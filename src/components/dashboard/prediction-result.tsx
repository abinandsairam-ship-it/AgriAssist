
"use client";
import React from 'react';
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
import type { Prediction, RecommendedMedicine, RelatedVideo } from '@/lib/definitions';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Bot, CloudSun, Stethoscope, ShoppingCart, Video } from 'lucide-react';
import { Button } from '../ui/button';
import { useLanguage } from '@/context/language-context';

type PredictionResultProps = {
  result: Prediction | { error: string } | undefined;
};

type TranslatedContent = {
  condition: string;
  recommendation: string;
};

// This is the placeholder component shown when no analysis has been run yet.
function AwaitingAnalysis() {
  return (
    <Card className="h-full flex flex-col items-center justify-center text-center p-8 border-dashed">
      <CardHeader>
        <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
        <CardTitle>Awaiting Analysis</CardTitle>
        <CardDescription>
          Your crop analysis results will appear here.
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// This is the main component that displays the full prediction result.
function PredictionDisplay({ prediction }: { prediction: Prediction }) {
  const { language, setLanguage } = useLanguage();
  const [isTranslating, startTransition] = React.useTransition();
  const [translatedContent, setTranslatedContent] = React.useState<TranslatedContent | null>(null);

  React.useEffect(() => {
    if (language === 'en') {
      setTranslatedContent(null); // Clear translations if switching back to English
      return;
    }

    startTransition(() => {
      Promise.all([
        getTranslatedText(prediction.condition, language),
        getTranslatedText(prediction.recommendation, language),
      ]).then(([condition, recommendation]) => {
        setTranslatedContent({ condition, recommendation });
      }).catch(error => {
        console.error("Translation failed:", error);
        setTranslatedContent(null); // Fallback to English on error
      });
    });
  }, [prediction, language]);
  
  const confidencePercent = Math.round(prediction.confidence * 100);
  const isHealthy = prediction.condition.toLowerCase() === 'healthy';
  const displayedCondition = translatedContent?.condition ?? prediction.condition;
  const displayedRecommendation = translatedContent?.recommendation ?? prediction.recommendation;

  const ConditionIcon = isHealthy ? CheckCircle2 : AlertCircle;
  const iconColor = isHealthy ? "text-primary" : "text-destructive";

  return (
     <div className="space-y-8">
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
              disabled={isTranslating}
            />
          </div>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-video rounded-lg overflow-hidden border">
            <Image
              src={prediction.imageUrl}
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
              <p className="text-lg font-semibold">{prediction.cropType}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Condition
              </h3>
              {isTranslating ? (
                <Skeleton className="h-7 w-32" />
              ) : (
                <div className="flex items-center gap-2">
                  <ConditionIcon className={`h-5 w-5 ${iconColor}`} />
                  <p className="text-lg font-semibold">{displayedCondition}</p>
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
            {new Date(prediction.timestamp).toLocaleString()}. This is a
            demo prediction.
          </p>
        </CardFooter>
      </Card>
      
      {prediction.weather && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <CloudSun className="h-6 w-6 text-primary" />
            <CardTitle>Local Weather</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-bold text-lg">{prediction.weather.location}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="font-bold text-lg">{prediction.weather.temperature}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-bold text-lg">{prediction.weather.condition}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Stethoscope className="h-6 w-6 text-primary" />
          <CardTitle>Doctor's Opinion</CardTitle>
        </CardHeader>
        <CardContent>
          {isTranslating ? <Skeleton className="h-20 w-full" /> : <p>{displayedRecommendation}</p>}
        </CardContent>
      </Card>
      
      {!isHealthy && prediction.recommendedMedicines && prediction.recommendedMedicines.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <ShoppingCart className="h-6 w-6 text-primary" />
            <CardTitle>Recommended Medicines</CardTitle>
          </Header>
          <CardContent>
            <div className="space-y-4">
              {prediction.recommendedMedicines.map((med: RecommendedMedicine) => (
                <div key={med.name} className="flex justify-between items-center p-2 rounded-md border">
                  <div>
                    <p className="font-semibold">{med.name}</p>
                    <p className="text-sm text-muted-foreground">Price: ${med.price.toFixed(2)}</p>
                  </div>
                  <div className='flex gap-2'>
                  <Button size="sm"><ShoppingCart className="mr-2 h-4 w-4" />Buy Now</Button>
                  <Button size="sm" variant="outline">Track Order</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {prediction.relatedVideos && prediction.relatedVideos.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Video className="h-6 w-6 text-primary" />
            <CardTitle>Related Videos</CardTitle>
          </Header>
          <CardContent>
            <div className="space-y-4">
              {prediction.relatedVideos.map((video: RelatedVideo) => (
                <div key={video.title} className="flex items-center gap-4 p-2 rounded-md border">
                  <Image src={video.thumbnailUrl} alt={video.title} width={120} height={90} className="rounded-md object-cover" />
                  <div>
                    <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">{video.title}</a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// The main export component that decides which view to show.
export function PredictionResult({ result }: PredictionResultProps) {
  // Determine if the result is a valid prediction.
  const currentPrediction = result && "condition" in result ? result : null;

  if (currentPrediction) {
    return <PredictionDisplay prediction={currentPrediction} />;
  }
  
  // If there's no valid prediction, show the placeholder.
  return <AwaitingAnalysis />;
}
