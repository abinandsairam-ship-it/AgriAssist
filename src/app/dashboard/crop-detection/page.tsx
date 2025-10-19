
'use client';

import { getPrediction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ImageUp, Loader2, Bot, Scan, AlertTriangle, X } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { useToast } from '@/hooks/use-toast';
import { CardDescription } from '@/components/ui/card';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import type { Prediction } from '@/lib/definitions';
import { readStreamableValue } from 'ai/rsc';
import type { IdentifyPestDiseaseFromImageOutput } from '@/ai/flows/identify-pest-disease-flow';

export default function CropDetectionPage() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  
  const [predictionResult, setPredictionResult] = useState<Prediction | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const { user } = useUser();
  const firestore = useFirestore();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (err) {
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, []);
  
  const handleFormSubmit = async () => {
    if (!imageUri) {
      toast({
        variant: 'destructive',
        title: 'No Image',
        description: 'Please upload or capture an image first.',
      });
      return;
    }
    
    setIsAnalyzing(true);
    setPredictionResult(null);
    setError(null);
    
    const formData = new FormData();
    formData.append('imageUri', imageUri);
    if (user?.uid) {
      formData.append('userId', user.uid);
    }
    
    try {
      const result = await getPrediction(null, formData);
      
      const newPredictionData = result as IdentifyPestDiseaseFromImageOutput;
      const finalPrediction: Prediction = {
            cropType: newPredictionData.cropName || '',
            condition: newPredictionData.pestOrDisease || '',
            recommendation: newPredictionData.recommendation || '',
            confidence: newPredictionData.confidence || 0,
            timestamp: Date.now(),
            imageUrl: imageUri,
            recommendedMedicines: [],
            relatedVideos: [],
            userId: user?.uid,
      };
      setPredictionResult(finalPrediction);

      // Save to Firestore after successful analysis
       if (user && firestore && finalPrediction) {
          try {
            const dataToSave = {
              userId: user.uid || '',
              timestamp: finalPrediction.timestamp,
              cropType: finalPrediction.cropType,
              condition: finalPrediction.condition.split(' (')[0],
              imageUrl: imageUri, // Save the actual image URI
              confidence: finalPrediction.confidence,
            };
            const cropDataCollection = collection(firestore, 'crop_data');
            await addDoc(cropDataCollection, dataToSave);
          } catch(e) {
            console.error("Firestore write failed:", e);
             toast({
              variant: 'destructive',
              title: 'History Save Failed',
              description: 'Could not save the analysis to your history.',
            });
          }
        }
      
    } catch (e: any) {
      const errorMessage = e?.error || e.message || "An unknown error occurred.";
      setError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: errorMessage,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImageUri(dataUri);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const captureFromVideo = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUri = canvas.toDataURL('image/jpeg');
        setImageUri(dataUri);
      }
    }
  }, []);

  const clearImage = () => {
    setImageUri(null);
    setPredictionResult(null);
    setError(null);
  }

  const renderAnalysisState = () => {
    if (isAnalyzing) {
      return (
        <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
          <CardHeader>
            <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
            <CardTitle>Analyzing...</CardTitle>
            <CardDescription>
              Our AI is inspecting your image.
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    if (error) {
      return (
        <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed border-destructive">
          <CardHeader>
            <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
            <CardTitle>Analysis Failed</CardTitle>
            <CardDescription className="text-destructive">
              {error}
            </CardDescription>
          </CardHeader>
        </Card>
      );
    }

    if (predictionResult) {
      return <PredictionResult result={predictionResult} />;
    }

    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
          <CardHeader>
            <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
            <CardTitle>Awaiting Analysis</CardTitle>
            <CardDescription>
              Capture or upload an image and click "Analyze Plant".
            </CardDescription>
          </CardHeader>
      </Card>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">
          Crop Detection
        </h1>
        <p className="text-muted-foreground">
          Use your camera to get an AI-powered analysis of your crop.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>Capture or Upload Image</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Image Preview</Label>
                <div className="w-full aspect-video border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden bg-muted/50">
                  {imageUri ? (
                    <>
                      <img src={imageUri} alt="Crop Preview" className="w-full h-full object-cover" />
                       <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={clearImage}>
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                      {hasCameraPermission === false && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                          <Camera className="h-12 w-12 text-muted-foreground" />
                          <p className="text-muted-foreground mt-2">Camera access is required. Please grant permission in your browser.</p>
                        </div>
                      )}
                      {hasCameraPermission === null && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                          <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
                          <p className="text-muted-foreground mt-2">Initializing camera...</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
                 <canvas ref={canvasRef} className="hidden"></canvas>
                <Input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  name="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex gap-2">
                 <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  onClick={captureFromVideo}
                  disabled={!hasCameraPermission || isAnalyzing}
                >
                  <Camera className="mr-2 h-4 w-4" /> Capture
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing}
                >
                  <ImageUp className="mr-2 h-4 w-4" /> Upload
                </Button>
              </div>
               <Button
                  type="button"
                  className="w-full"
                  onClick={handleFormSubmit}
                  disabled={!imageUri || isAnalyzing}
                >
                  {isAnalyzing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scan className="mr-2 h-4 w-4" />}
                   Analyze Plant
                </Button>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {renderAnalysisState()}
        </div>
      </div>
    </div>
  );
}
