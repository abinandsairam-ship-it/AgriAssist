
'use server';
import type { Prediction, RecommendedMedicine, RelatedVideo } from '@/lib/definitions';
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
    const opinion = await getDoctorsOpinion({ photoDataUri: imageUri });

    if (opinion.crop.toLowerCase() === 'not a plant') {
        return { error: "The uploaded image does not appear to be a plant. Please try another image." };
    }
    
    // Client-side will generate mock data for medicines and videos
    const predictionResult: Prediction = {
      cropType: opinion.crop,
      condition: `${opinion.condition} (${opinion.conditionScientific})`,
      recommendation: opinion.recommendation,
      confidence: 0.98, // Confidence can be refined or passed from a model step if available
      imageUrl: imageUri,
      timestamp: Date.now(),
      weather: {
        location: 'Punjab, India',
        temperature: '28°C',
        condition: 'Cloudy',
      },
      userId: userId,
      // The app will now be responsible for generating these based on the result
      recommendedMedicines: [],
      relatedVideos: [],
    };
    
    return predictionResult;

  } catch (e: any) {
    console.error("AI analysis failed:", e);
    
    if (e.message) {
      if (e.message.includes('API key not valid')) {
        return { error: "The AI model API key is not configured correctly. Please contact support." };
      }
      if (e.message.includes('rate limit')) {
        return { error: "The AI model is currently busy. Please try again in a few moments." };
      }
      if (e.message.includes('malformed')) {
        return { error: "The AI model could not process the request. The response was malformed." };
      }
    }
    
    return { error: 'An unexpected error occurred during the AI analysis. The model may be temporarily offline or experiencing issues.' };
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
