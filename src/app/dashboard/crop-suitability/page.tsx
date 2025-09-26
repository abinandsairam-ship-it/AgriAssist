
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
import { Triangle, Loader2, Bot } from 'lucide-react';
import React, { useState } from 'react';

// Mock data, replace with actual data or API calls
const soilTypes = ['Loamy', 'Sandy', 'Clay', 'Silty', 'Peaty'];

export default function CropSuitabilityPage() {
  const [soilType, setSoilType] = useState('');
  const [soilPh, setSoilPh] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPrediction(null);
    // Mock API call
    setTimeout(() => {
      if (soilType && soilPh) {
        setPrediction(
          `Based on ${soilType} soil with a pH of ${soilPh}, Corn and Soybeans are highly suitable for cultivation.`
        );
      }
      setIsLoading(false);
    }, 1500);
  };

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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Triangle className="mr-2 h-4 w-4" />
                )}
                Predict Suitable Crop
              </Button>
            </CardFooter>
          </form>
        </Card>>

        <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed">
          {isLoading && (
            <>
              <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
              <CardTitle className="mt-4">Analyzing...</CardTitle>
              <CardDescription>
                Our AI is determining the best crops for your soil.
              </CardDescription>
            </>
          )}
          {!isLoading && prediction && (
            <>
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{prediction}</p>
              </CardContent>
            </>
          )}
          {!isLoading && !prediction && (
            <>
              <Bot className="mx-auto h-16 w-16 text-muted-foreground" />
              <CardTitle className="mt-4">Awaiting Analysis</CardTitle>
              <CardDescription>
                Your crop recommendation will appear here.
              </CardDescription>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
