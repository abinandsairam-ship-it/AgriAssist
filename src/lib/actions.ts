
'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { identifyPestDiseaseFromImage } from '@/ai/flows/identify-pest-disease-flow';

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
    const identificationAndRecommendation = await identifyPestDiseaseFromImage({ photoDataUri: imageUri });

    if (!identificationAndRecommendation.cropName) {
      return { error: 'The AI could not identify a crop in the image. Please try another image.' };
    }
    
    const isHealthy = identificationAndRecommendation.pestOrDisease.toLowerCase() === 'healthy';

    const result: Prediction = {
      cropType: identificationAndRecommendation.cropName,
      condition: identificationAndRecommendation.pestOrDisease,
      confidence: identificationAndRecommendation.confidence,
      recommendation: identificationAndRecommendation.recommendation,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      newPrediction: true,
       // Mock data for UI that is not provided by the core AI
      recommendedMedicines: isHealthy ? [] : [{ name: 'Universal Fungicide', url: '#', price: 25.00 }],
      relatedVideos: [
        {
          title: `Tips for managing ${identificationAndRecommendation.pestOrDisease}`,
          videoUrl: '#',
          thumbnailUrl: `https://picsum.photos/seed/${identificationAndRecommendation.cropName}/400/225`,
        },
      ],
      weather: {
        location: 'Punjab, India',
        temperature: '30°C',
        condition: 'Sunny',
      },
    };
    
    return result;

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
