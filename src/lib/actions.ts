
'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { identifyPestDiseaseFromImage } from '@/ai/flows/identify-pest-disease-flow';
import { recommendTreatmentForCrop } from '@/ai/flows/recommend-treatment-flow';

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
    const identification = await identifyPestDiseaseFromImage({ photoDataUri: imageUri });

    if (!identification.cropName) {
      return { error: 'The AI could not identify a crop in the image. Please try another image.' };
    }

    const isHealthy = identification.pestOrDisease.toLowerCase() === 'healthy';

    let recommendation = 'The plant appears to be in excellent health. Continue with regular watering and nutrient schedules. Monitor for any changes.';
    if (!isHealthy) {
        const treatmentResponse = await recommendTreatmentForCrop({
            cropName: identification.cropName,
            pestOrDisease: identification.pestOrDisease,
            organicPreference: false, // Default to chemical for now
        });
        recommendation = treatmentResponse.treatmentRecommendations;
    }
    

    const result: Prediction = {
      cropType: identification.cropName,
      condition: identification.pestOrDisease,
      confidence: identification.confidence,
      recommendation: recommendation,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      newPrediction: true,
       // Mock data for UI that is not provided by the core AI
      recommendedMedicines: isHealthy ? [] : [{ name: 'Universal Fungicide', url: '#', price: 25.00 }],
      relatedVideos: [
        {
          title: `Tips for managing ${identification.pestOrDisease}`,
          videoUrl: '#',
          thumbnailUrl: `https://picsum.photos/seed/${identification.cropName}/400/225`,
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
