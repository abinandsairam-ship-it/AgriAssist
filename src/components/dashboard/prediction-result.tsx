"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { getTranslatedText } from '@/lib/actions';
import type { Prediction } from '@/lib/definitions';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Bot } from 'lucide-react';

type PredictionResultProps = {
  result: (Prediction & { newPrediction: boolean }) | { error: string } | undefined;
};

export function PredictionResult({ result }: PredictionResultProps) {
  const [language, setLanguage] = useState('en');
  const [translatedCondition, setTranslatedCondition] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  
  const currentPrediction = result && "condition" in result ? result : null;

  useEffect(() => {
    if (currentPrediction) {
      setIsTranslating(true);
      getTranslatedText(currentPrediction.condition, language).then(translated => {
        setTranslatedCondition(translated);
        setIsTranslating(false);
      });
    }
  }, [currentPrediction, language]);

  if (!currentPrediction) {
    return (
      <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
        <CardHeader>
          <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
          <CardTitle>Awaiting Prediction</CardTitle>
          <CardDescription>
            Your crop analysis results will appear here.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const confidencePercent = Math.round(currentPrediction.confidence * 100);
  const isHealthy = currentPrediction.condition.toLowerCase() === 'healthy';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Prediction Result</CardTitle>
            <CardDescription>
              Analysis based on the provided image.
            </CardDescription>
          </div>
          <LanguageSwitcher
            selectedLanguage={language}
            onLanguageChange={setLanguage}
          />
        </div>
      </CardHeader>
      <CardContent className="grid md:grid-cols-2 gap-6">
        <div className="relative aspect-video rounded-lg overflow-hidden border">
          <Image
            src={currentPrediction.imageUrl}
            alt="Analyzed crop"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Crop Type
            </h3>
            <p className="text-lg font-semibold">{currentPrediction.cropType}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Condition
            </h3>
            {isTranslating ? (
              <Skeleton className="h-7 w-32" />
            ) : (
              <div className="flex items-center gap-2">
                {isHealthy ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-destructive" />
                )}
                <p className="text-lg font-semibold">{translatedCondition}</p>
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-1">
              Confidence
            </h3>
            <div className="flex items-center gap-4">
              <Progress value={confidencePercent} className="w-[60%]" />
              <span className="font-semibold text-lg">{confidencePercent}%</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          Prediction from{' '}
          {new Date(currentPrediction.timestamp).toLocaleString()}. This is a
          demo prediction.
        </p>
      </CardFooter>
    </Card>
  );
}
