'use server';
import type { Prediction } from '@/lib/definitions';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<Prediction | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image to analyze.' };
  }

  try {
    const aiResult = await getDoctorsOpinion({ photoDataUri: imageUri });

    if (!aiResult || !aiResult.cropType || !aiResult.condition) {
      throw new Error('AI analysis returned an incomplete result.');
    }

    const predictionResult: Prediction = {
      ...aiResult,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      // The following are placeholders as requested, the core logic comes from the AI
      recommendedMedicines: [],
      relatedVideos: [],
      weather: undefined,
    };

    return predictionResult;
  } catch (e: any) {
    console.error('AI analysis failed:', e);
    return {
      error: `AI analysis failed: ${e.message || 'An unknown error occurred.'}`,
    };
  }
}

import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

export async function getTranslatedText(
  text: string,
  language: string
): Promise<string> {
  if (!text || !language || language === 'en') {
    return text;
  }
  try {
    const result = await translatePredictionResults({ text, language });
    return result.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
}
