'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
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

    if (aiResult.crop === 'Not a plant') {
        return { error: "The uploaded image does not appear to be a plant. Please try a different image." };
    }

    const predictionResult: Prediction = {
      cropType: aiResult.crop,
      condition: aiResult.condition,
      recommendation: aiResult.recommendation,
      confidence: aiResult.confidence,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      recommendedMedicines: [],
      relatedVideos: [],
      weather: undefined,
    };

    return predictionResult;
  } catch (e: any) {
    console.error("AI analysis failed:", e);
    return { error: e.message || 'The AI analysis failed. The model may be unavailable or the image could not be processed. Please try again later.' };
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
