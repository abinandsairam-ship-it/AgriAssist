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
    return { error: 'Please upload or capture an image to analyze.' };
  }

  try {
    // Call the live AI flow
    const aiResult = await getDoctorsOpinion({ photoDataUri: imageUri });

    if (!aiResult) {
      throw new Error('AI analysis returned an empty result.');
    }
    
    // Construct the full prediction object for the UI
    const predictionResult: Prediction = {
      ...aiResult,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      // The following are placeholders as the AI doesn't generate this part.
      // In a real app, this would come from other APIs.
      recommendedMedicines: (aiResult.condition || '').toLowerCase().includes('healthy')
        ? []
        : [{ name: 'Universal Fungicide', url: '#', price: 25.00 }],
      relatedVideos: [
        {
          title: `Tips for managing ${aiResult.condition}`,
          videoUrl: '#',
          thumbnailUrl: `https://picsum.photos/seed/${encodeURIComponent(aiResult.cropType)}/400/225`,
        },
      ],
      weather: {
        location: 'Punjab, India',
        temperature: '30°C',
        condition: 'Sunny',
      },
    };

    return predictionResult;
    
  } catch (e: any) {
    console.error('AI analysis failed:', e);
    // Return a user-friendly error message. The full error is logged on the server.
    return {
      error: `AI analysis failed. ${e.message || 'An unknown error occurred.'}`,
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
