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
    // Call the live AI flow to get a real analysis of the image.
    const analysisResult = await getDoctorsOpinion({ imageUri });

    if (!analysisResult || !analysisResult.cropType) {
        return { error: 'The AI model returned an invalid analysis. Please try again.' };
    }

    // Enhance the live AI result with additional data for the UI.
    const isHealthy = (analysisResult.condition || '').toLowerCase().includes('healthy');
    const enhancedResult: Prediction = {
      ...analysisResult,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      // Add mock data for UI elements that the primary model doesn't provide
      recommendedMedicines: isHealthy
        ? []
        : [{ name: 'Universal Fungicide', url: '#', price: 25.00 }],
      relatedVideos: [
        {
          title: `Tips for managing ${analysisResult.condition}`,
          videoUrl: '#',
          thumbnailUrl: `https://picsum.photos/seed/${analysisResult.cropType}/400/225`,
        },
      ],
      weather: {
        location: 'Punjab, India',
        temperature: '30°C',
        condition: 'Sunny',
      },
    };

    return enhancedResult;

  } catch (e: any) {
    console.error("AI analysis failed:", e);
    return { error: e.message || 'The AI model is currently unavailable or could not be found. Please try again later.' };
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
