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

    // Construct the full prediction object for the UI
    const predictionResult: Prediction = {
      ...aiResult,
      timestamp: Date.now(),
      imageUrl: imageUri, // Use the actual uploaded image for display
      userId: userId,
      // Mocking these for now as the AI doesn't provide them
      recommendedMedicines: [],
      relatedVideos: [],
      weather: {
        location: 'Punjab, India',
        temperature: '30°C',
        condition: 'Sunny',
      },
    };
    
    // Add mock recommendations if not healthy
    if (aiResult.condition.toLowerCase() !== 'healthy') {
      predictionResult.recommendedMedicines.push({ name: 'General Fungicide', url: '#', price: 25.00 });
      predictionResult.relatedVideos.push({
        title: `Tips for managing ${aiResult.condition}`,
        videoUrl: '#',
        thumbnailUrl: `https://picsum.photos/seed/${aiResult.cropType.split(' ')[0]}/400/225`,
      });
    }


    return predictionResult;
    
  } catch (e: any) {
    console.error('AI analysis failed:', e);
    return {
      error: `AI analysis failed. ${e.message}`,
    };
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
