
'use server';
import type { Prediction } from '@/lib/definitions';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<Prediction | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image.' };
  }

  try {
    // A single, robust call to the AI model
    const opinion = await getDoctorsOpinion({ photoDataUri: imageUri });

    if (opinion.crop.toLowerCase() === 'not a plant') {
        return { error: "The uploaded image does not appear to be a plant. Please try another image." };
    }

    const predictionResult: Prediction = {
      cropType: opinion.crop,
      condition: `${opinion.condition} (${opinion.conditionScientific})`,
      recommendation: opinion.recommendation,
      recommendedMedicines: opinion.recommendedMedicines,
      relatedVideos: opinion.relatedVideos,
      confidence: 0.98, // Confidence can be refined or passed from a model step if available
      imageUrl: imageUri,
      timestamp: Date.now(),
      weather: {
        location: 'Punjab, India',
        temperature: '28°C',
        condition: 'Cloudy',
      },
      userId: userId,
    };
    
    return predictionResult;

  } catch (e: any) {
    console.error("AI analysis failed:", e);
    // Check for specific error messages if the model provides them
    if (e.message && e.message.includes('API key not valid')) {
       return { error: "The AI model API key is not configured correctly. Please contact support." };
    }
     if (e.message && e.message.includes('rate limit')) {
       return { error: "The AI model is currently busy. Please try again in a few moments." };
    }
    return { error: 'An unexpected error occurred during the AI analysis. The model may be temporarily offline.' };
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
