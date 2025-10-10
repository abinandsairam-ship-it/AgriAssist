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
    // 1. Get the initial identification from the image.
    const identification = await identifyPestDiseaseFromImage({ photoDataUri: imageUri });
    const isHealthy = identification.pestOrDisease.toLowerCase() === 'healthy';

    let treatmentRecommendation = 'The plant appears healthy. No treatment is necessary. Continue standard monitoring and care.';
    if (!isHealthy) {
        // 2. If not healthy, get treatment recommendations.
        const treatmentResult = await recommendTreatmentForCrop({
            cropName: identification.cropName,
            pestOrDisease: identification.pestOrDisease,
            organicPreference: false, // Defaulting to chemical, can be made a user option
        });
        treatmentRecommendation = treatmentResult.treatmentRecommendations;
    }

    // 3. Assemble the final Prediction object.
    const result: Prediction = {
      cropType: identification.cropName,
      condition: identification.pestOrDisease,
      confidence: identification.confidence,
      recommendation: treatmentRecommendation,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      newPrediction: true,
      // Mock data for UI elements that are not part of the core AI flow
      recommendedMedicines: isHealthy ? [] : [{ name: 'General Fungicide', url: '#', price: 30.00 }],
      relatedVideos: [
        {
          title: `How to manage ${identification.pestOrDisease} in ${identification.cropName}`,
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
