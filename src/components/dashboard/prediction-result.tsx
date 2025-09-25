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
import type { Prediction, RecommendedMedicine, RelatedVideo } from '@/lib/definitions';
import { LanguageSwitcher } from '@/components/language-switcher';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, CheckCircle2, Bot, CloudSun, Stethoscope, Video, ShoppingCart, Tractor, ThumbsUp, MessageSquare } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

type PredictionResultProps = {
  result: (Prediction & { newPrediction: boolean }) | { error: string } | undefined;
};

const VideoCard = ({ video }: { video: RelatedVideo }) => {
  const [likes, setLikes] = useState(Math.floor(Math.random() * 100));
  const [comments, setComments] = useState<{ id: number; text: string }[]>([]);
  const [newComment, setNewComment] = useState('');

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: Date.now(), text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <div className="group border rounded-lg overflow-hidden">
      <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </a>
      <div className="p-4 space-y-3">
        <p className="font-medium group-hover:text-primary">{video.title}</p>
        <div className="flex items-center justify-between text-muted-foreground">
          <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center gap-2">
            <ThumbsUp className="h-4 w-4" />
            <span>{likes}</span>
          </Button>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>{comments.length} Comments</span>
          </div>
        </div>
        <div className="space-y-2">
          {comments.map(comment => (
            <div key={comment.id} className="text-sm bg-muted/50 p-2 rounded-md">
              {comment.text}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Input 
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button onClick={handleAddComment} size="sm">Comment</Button>
        </div>
      </div>
    </div>
  );
};


export function PredictionResult({ result }: PredictionResultProps) {
  const [language, setLanguage] = useState('en');
  const [originalText, setOriginalText] = useState<{ condition: string; recommendation: string } | null>(null);
  const [translatedText, setTranslatedText] = useState<{ condition: string; recommendation: string } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  
  const currentPrediction = result && "condition" in result ? result : null;

  useEffect(() => {
    if (currentPrediction) {
      const original = {
        condition: currentPrediction.condition,
        recommendation: currentPrediction.recommendation,
      };
      setOriginalText(original);
      setTranslatedText(original);
    }
  }, [currentPrediction]);

  useEffect(() => {
    if (!originalText) return;

    if (language === 'en') {
      setTranslatedText(originalText);
      return;
    }

    setIsTranslating(true);
    Promise.all([
      getTranslatedText(originalText.condition, language),
      getTranslatedText(originalText.recommendation, language),
    ]).then(([condition, recommendation]) => {
      setTranslatedText({ condition, recommendation });
      setIsTranslating(false);
    }).catch(() => {
      // In case of error, revert to original text
      setTranslatedText(originalText);
      setIsTranslating(false);
    });
  }, [language, originalText]);

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
                  <p className="text-lg font-semibold">{translatedText?.condition}</p>
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
      
      {currentPrediction.weather && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <CloudSun className="h-6 w-6 text-primary" />
            <CardTitle>Local Weather</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-around">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Location</p>
              <p className="font-bold text-lg">{currentPrediction.weather.location}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="font-bold text-lg">{currentPrediction.weather.temperature}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Condition</p>
              <p className="font-bold text-lg">{currentPrediction.weather.condition}</p>
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
          {isTranslating ? <Skeleton className="h-20 w-full" /> : <p>{translatedText?.recommendation}</p>}
        </CardContent>
      </Card>

      {!isHealthy && currentPrediction.recommendedMedicines && currentPrediction.recommendedMedicines.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center gap-4">
            <Tractor className="h-6 w-6 text-primary" />
            <CardTitle>Recommended Medicines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPrediction.recommendedMedicines.map((med: RecommendedMedicine) => (
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
    </div>
  );
}
