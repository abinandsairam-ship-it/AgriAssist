
'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Triangle, Loader2, Bot, Camera, ImageUp, Scan, AlertTriangle } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';
import { recommendCrop } from '@/ai/flows/recommend-crop-flow';

// Mock data, replace with actual data or API calls
const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty'];

export default function CropSuitabilityPage() {
  const [soilType, setSoilType] = useState('');
  const [soilPh, setSoilPh] = useState('');
  const [isPending, startTransition] = useTransition();
  const [prediction, setPrediction] = useState<{ recommendation: string } | { error: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera not supported');
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
            'Please enable camera permissions in your browser settings.',
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
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
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
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview || !soilType || !soilPh) {
      toast({
        variant: 'destructive',
        title: 'Missing Information',
        description: 'Please provide a soil image, soil type, and pH value.',
      });
      return;
    }

    setPrediction(null);
    
    startTransition(async () => {
      try {
        const result = await recommendCrop({
          soilImageUri: imagePreview,
          soilType,
          soilPh: parseFloat(soilPh),
        });
        setPrediction(result);
        toast({
          title: 'Analysis Complete!',
          description: 'Crop recommendation is ready.',
        })
      } catch (error: any) {
        console.error('AI recommendation failed:', error);
        setPrediction({ error: error.message || 'An unexpected error occurred.' });
        toast({
          variant: 'destructive',
          title: 'Analysis Failed',
          description: error.message || 'Could not get a recommendation from the AI.',
        })
      }
    });
  };

  const renderAnalysisState = () => {
    if (isPending) {
      return (
        <>
          <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
          <CardTitle className="mt-4">Analyzing...</CardTitle>
          <CardDescription>
            Our AI is determining the best crops for your soil.
          </CardDescription>
        </>
      );
    }
    
    if (prediction && 'error' in prediction) {
      return (
         <>
          <AlertTriangle className="mx-auto h-16 w-16 text-destructive" />
          <CardTitle className="mt-4">Analysis Failed</CardTitle>
          <CardDescription className="text-destructive">
            {prediction.error}
          </CardDescription>
        </>
      )
    }

    if (prediction && 'recommendation' in prediction) {
      return (
        <>
          <CardHeader>
            <CardTitle>AI Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{prediction.recommendation}</p>
          </CardContent>
        </>
      );
    }

    return (
      <>
        <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
        <CardTitle className="mt-4">Awaiting Analysis</CardTitle>
        <CardDescription>
          Your crop recommendation will appear here.
        </CardDescription>
      </>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Crop Suitability</h1>
        <p className="text-muted-foreground">
          Find the best crops to grow based on your soil conditions.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Soil Analysis</CardTitle>
            <CardDescription>
              Enter your soil details to get crop recommendations.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
               <div className="space-y-2">
                <Label>Soil Image</Label>
                <div className="w-full aspect-video border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden bg-muted/50">
                  {imagePreview ? (
                     <img src={imagePreview} alt="Soil preview" className="w-full h-full object-cover" />
                  ): (
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                  )}
                  
                  {hasCameraPermission === false && !imagePreview && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 text-center p-4">
                       <Camera className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground mt-2">Camera access denied.</p>
                    </div>
                  )}
                   {hasCameraPermission === null && !imagePreview && (
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
                 <div className="flex gap-2">
                  <Button
                    type="button"
                    className="w-full"
                    onClick={captureFromVideo}
                    disabled={!hasCameraPermission || isPending}
                  >
                    <Scan className="mr-2 h-4 w-4" />
                    Use Camera
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                  >
                    <ImageUp className="mr-2 h-4 w-4" /> Upload Photo
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil-type">Soil Type</Label>
                <Select onValueChange={setSoilType} value={soilType} required>
                  <SelectTrigger id="soil-type">
                    <SelectValue placeholder="Select a soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    {soilTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="soil-ph">Soil pH</Label>
                <Input
                  id="soil-ph"
                  type="number"
                  placeholder="e.g., 6.5"
                  step="0.1"
                  required
                  value={soilPh}
                  onChange={e => setSoilPh(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Triangle className="mr-2 h-4 w-4" />
                )}
                Predict Suitable Crop
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
          {renderAnalysisState()}
        </Card>
      </div>
    </div>
  );
}
