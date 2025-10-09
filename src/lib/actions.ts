'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';

// This function simulates a real-time prediction by cycling through mock data.
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

    const predictionResult: Prediction = {
      cropType: aiResult.crop,
      condition: aiResult.condition,
      recommendation: aiResult.recommendation,
      confidence: aiResult.confidence,
      timestamp: Date.now(),
      imageUrl: imageUri, // Use the actual uploaded image for display
      userId: userId,
      // These are added on the client-side for UI purposes
      recommendedMedicines: [],
      relatedVideos: [],
      weather: undefined,
    };

    return predictionResult;
  } catch (e: any) {
    console.error("AI analysis failed:", e);
    return { error: e.message || 'The AI analysis failed. Please try again with a clearer image.' };
  }
}

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
