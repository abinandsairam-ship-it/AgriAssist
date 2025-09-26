
"use client";

import { useActionState } from 'react';
import { getPrediction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ImageUp, Loader2, Bot, Scan, Video, ThumbsUp, MessageSquare, PlayCircle } from 'lucide-react';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { useToast } from '@/hooks/use-toast';
import { CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialState = undefined;

const relatedVideos = [
  {
    id: 1,
    title: "Mastering Tomato Pruning for a Bigger Harvest",
    thumbnailUrl: "https://picsum.photos/seed/video1/400/225",
    videoUrl: "https://www.youtube.com/embed/s2zo2b04pSg",
    likes: 12,
    comments: 3,
  },
  {
    id: 2,
    title: "Organic Pest Control: Natural Solutions for Your Garden",
    thumbnailUrl: "https://picsum.photos/seed/video2/400/225",
    videoUrl: "https://www.youtube.com/embed/s2zo2b04pSg",
    likes: 45,
    comments: 8,
  },
  {
    id: 3,
    title: "How to Make Compost: The Complete Guide",
    thumbnailUrl: "https://picsum.photos/seed/video3/400/225",
    videoUrl: "https://www.youtube.com/embed/s2zo2b04pSg",
    likes: 78,
    comments: 12,
  }
]

export default function DashboardPage() {
  const [state, formAction, isPending] = useActionState(getPrediction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  
  const formRef = useRef<HTMLFormElement>(null);

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
  
  const handleFormSubmit = (formData: FormData) => {
    formAction(formData);
  }
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setImagePreview(dataUri);
        const formData = new FormData();
        formData.append('imageUri', dataUri);
        handleFormSubmit(formData);
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
        const formData = new FormData();
        formData.append('imageUri', dataUri);
        handleFormSubmit(formData);
      }
    }
  }, []);

  useEffect(() => {
    if (state) {
      if (state?.error) {
        toast({
          title: 'Prediction Error',
          description: state.error,
          variant: 'destructive',
        });
      } else if (state && 'newPrediction' in state) {
        toast({
          title: 'Success!',
          description: 'Your crop has been analyzed.',
        });
      }
    }
  }, [state, toast]);

  const currentPrediction = state && "cropType" in state ? state : null;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">
          Crop Analysis Dashboard
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
            <form ref={formRef} action={handleFormSubmit} className="space-y-4">
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
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          { isPending ? (
            <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
              <CardHeader>
                <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
                <CardTitle>Analyzing...</CardTitle>
                <CardDescription>
                  Our AI is inspecting your image. Please wait a moment.
                </CardDescription>
              </CardHeader>
            </Card>
          ) : currentPrediction ? (
            <PredictionResult result={currentPrediction} />
          ) : (
             <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
                <CardHeader>
                  <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
                  <CardTitle>Awaiting Analysis</CardTitle>
                  <CardDescription>
                    Point your camera at a plant and click "Analyze Plant".
                  </CardDescription>
                </CardHeader>
             </Card>
          )}
        </div>
      </div>
      
      <Card className="mt-8">
        <CardHeader className="flex flex-row items-center gap-4">
          <Video className="h-6 w-6 text-primary" />
          <CardTitle>Agri Videos</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedVideos.map((video) => (
             <Dialog key={video.id}>
              <div className="space-y-2">
                <DialogTrigger asChild>
                  <div className="group cursor-pointer">
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                      <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover transition-transform group-hover:scale-105" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-white/80 group-hover:text-white transition-colors" />
                      </div>
                    </div>
                    <h3 className="mt-2 text-sm font-semibold group-hover:text-primary leading-tight">{video.title}</h3>
                  </div>
                </DialogTrigger>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="sr-only">Like</span>
                  </Button>
                  <span>{video.likes}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MessageSquare className="h-4 w-4" />
                    <span className="sr-only">Comment</span>
                  </Button>
                  <span>{video.comments}</span>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex items-start gap-2">
                      <Input placeholder="Add a comment..." className="h-8 text-xs flex-1"/>
                      <Button size="sm" className="h-8">Post</Button>
                  </div>
                </div>
              </div>
               <DialogContent className="max-w-4xl p-0">
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={video.videoUrl}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
              </DialogContent>
            </Dialog>
          ))}
        </CardContent>
      </Card>
      
    </div>
  );
}
