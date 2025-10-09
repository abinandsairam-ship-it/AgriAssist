
"use client";

import { getPrediction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ImageUp, Loader2, Bot, Scan, AlertTriangle } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { useToast } from '@/hooks/use-toast';
import { CardDescription } from '@/components/ui/card';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection } from 'firebase/firestore';
import type { Prediction, RecommendedMedicine, RelatedVideo } from '@/lib/definitions';

const generateMockMedicines = (crop: string, condition: string): RecommendedMedicine[] => {
    if (condition.toLowerCase().includes('healthy')) return [];
    return [
        { name: `Anti-Fungal for ${crop}`, price: 25.99, url: '#' },
        { name: 'Broad-Spectrum Pesticide', price: 32.50, url: '#' },
    ];
};

const generateMockVideos = (crop: string, condition: string): RelatedVideo[] => {
    const topic = condition.toLowerCase().includes('healthy') ? `Care for ${crop}` : `${condition} Treatment`;
    return [
        { title: `Tutorial: ${topic}`, videoUrl: '#', thumbnailUrl: `https://picsum.photos/seed/${crop}1/400/225` },
        { title: `Expert Tips for ${crop}`, videoUrl: '#', thumbnailUrl: `https://picsum.photos/seed/${crop}2/400/225` },
        { title: `Preventing ${condition} in ${crop}`, videoUrl: '#', thumbnailUrl: `https://picsum.photos/seed/${crop}3/400/225` },
    ];
};

export default function CropDetectionPage() {
  const [predictionResult, setPredictionResult] = useState<Prediction | { error: string } | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
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
        console.error('Camera not supported on this device');
        setHasCameraPermission(false);
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setHasCameraPermission(true);
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description:
            'Please enable camera permissions in your browser settings to use this feature.',
        });
      }
    };

    getCameraPermission();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);
  
  const handleFormSubmit = useCallback(async (imageUri: string) => {
    setPredictionResult(undefined);
    setError(null);
    const formData = new FormData();
    formData.append('imageUri', imageUri);
    if (user?.uid) {
      formData.append('userId', user.uid);
    }
    
    startTransition(async () => {
      const result = await getPrediction(null, formData);
      
      if (result && 'error' in result && result.error) {
        setError(result.error);
        setPredictionResult(undefined);
      } else if (result && 'cropType' in result) {
        
        const fullResult: Prediction = {
          ...result,
          recommendedMedicines: generateMockMedicines(result.cropType, result.condition),
          relatedVideos: generateMockVideos(result.cropType, result.condition),
        };

        setPredictionResult(fullResult);
        setError(null);
        toast({
          title: 'Success!',
          description: 'Your crop has been analyzed.',
        });

        if (user && firestore) {
          try {
            const { recommendedMedicines, relatedVideos, ...historyData } = fullResult;
            const placeholderUrl = `https://picsum.photos/seed/${historyData.timestamp}/600/400`;
            
            const dataToSave = {
              ...historyData,
              imageUrl: placeholderUrl, 
              condition: fullResult.condition.split(' (')[0],
            };

            const cropDataCollection = collection(firestore, 'crop_data');
            await addDoc(cropDataCollection, dataToSave);
          } catch(e) {
            console.error("Firestore write failed:", e);
          }
        }
      }
    });
  }, [user, firestore, toast]);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        handleFormSubmit(dataUri);
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
        setImagePreview(dataUri);
        handleFormSubmit(dataUri);
      }
    }
  }, [handleFormSubmit]);

  const currentPrediction = predictionResult && "cropType" in predictionResult ? (predictionResult as Prediction) : null;

  const renderAnalysisState = () => {
    if (isPending) {
      return (
        <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
          <CardHeader>
            <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
            <CardTitle>Analyzing...</CardTitle>
            <CardDescription>
              Our AI is inspecting your image. Please wait a moment.
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

    if (currentPrediction) {
      return <PredictionResult result={currentPrediction} />;
    }

    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
          <CardHeader>
            <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
            <CardTitle>Awaiting Analysis</CardTitle>
            <CardDescription>
              Point your camera at a plant and click "Analyze Plant".
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
            <CardTitle>Live Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-upload">Live Camera Feed</Label>
                <div className="w-full aspect-video border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden bg-muted/50">
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
                  className="w-full"
                  onClick={captureFromVideo}
                  disabled={!hasCameraPermission || isPending}
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Scan className="mr-2 h-4 w-4" />}
                   Analyze Plant
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isPending}
                >
                  <ImageUp className="mr-2 h-4 w-4" /> Upload
                </Button>
              </div>
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
