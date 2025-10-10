
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
    const identificationResult = await identifyPestDiseaseFromImage({
      photoDataUri: imageUri,
    });

    const isHealthy = (identificationResult.pestOrDisease || '').toLowerCase().includes('healthy');
    let recommendation = 'The plant appears healthy. No treatment is necessary. Continue standard monitoring and care.';

    if (!isHealthy) {
        const treatmentResult = await recommendTreatmentForCrop({
            cropName: identificationResult.cropName,
            pestOrDisease: identificationResult.pestOrDisease,
            organicPreference: false, // Defaulting to chemical, can be made a user option
        });
        recommendation = treatmentResult.treatmentRecommendations;
    }
    
    // Mock data for UI that is not returned by the AI
    const mockMedicines = isHealthy ? [] : [{ name: 'Universal Fungicide', url: '#', price: 25.00 }];
    const mockVideos = [{
        title: `Tips for managing ${identificationResult.pestOrDisease}`,
        videoUrl: '#',
        thumbnailUrl: `https://picsum.photos/seed/${identificationResult.cropName}/400/225`,
    }];
     const mockWeather = {
        location: 'Punjab, India',
        temperature: '30°C',
        condition: 'Sunny',
     };

    const result: Prediction = {
      cropType: identificationResult.cropName,
      condition: identificationResult.pestOrDisease,
      confidence: identificationResult.confidence,
      recommendation: recommendation,
      recommendedMedicines: mockMedicines,
      relatedVideos: mockVideos,
      weather: mockWeather,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      newPrediction: true,
    };
    
    return result;

  } catch (e: any) {
    console.error("AI analysis failed:", e);
    return { error: e.message || 'The AI model could not be reached. Please try again later.' };
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
