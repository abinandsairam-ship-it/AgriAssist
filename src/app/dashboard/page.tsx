"use client";

import { useFormState, useFormStatus } from 'react-dom';
import { getPrediction } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, ImageUp, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import { PredictionResult } from '@/components/dashboard/prediction-result';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

const initialState = undefined;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting...
        </>
      ) : (
        'Predict'
      )}
    </Button>
  );
}

export default function DashboardPage() {
  const [state, formAction] = useFormState(getPrediction, initialState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();

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
  
  const clearPreview = () => {
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
    if(cameraInputRef.current) cameraInputRef.current.value = "";
  }

  useEffect(() => {
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
      clearPreview();
      formRef.current?.reset();
    }
  }, [state, toast]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold font-headline">
          Crop Analysis Dashboard
        </h1>
        <p className="text-muted-foreground">
          Upload an image of a crop to get an AI-powered analysis.
        </p>
      </header>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-1 h-fit">
          <CardHeader>
            <CardTitle>New Prediction</CardTitle>
          </CardHeader>
          <CardContent>
            <form ref={formRef} action={formAction} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor='image-upload'>Upload Image</Label>
                <div
                  className="w-full h-48 border-2 border-dashed rounded-lg flex items-center justify-center relative overflow-hidden bg-muted/50 cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <>
                      <Image
                        src={imagePreview}
                        alt="Image preview"
                        fill
                        className="object-cover"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearPreview();
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImageUp className="mx-auto h-12 w-12" />
                      <p>Click to upload or use camera</p>
                    </div>
                  )}
                </div>
                <Input
                  ref={fileInputRef}
                  id="image-upload"
                  type="file"
                  name="image"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <Input
                  ref={cameraInputRef}
                  id="camera-upload"
                  type="file"
                  name="image"
                  className="hidden"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" /> Use Camera
                </Button>
              </div>

              <SubmitButton />
            </form>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <PredictionResult result={state} />
        </div>
      </div>
    </div>
  );
}
