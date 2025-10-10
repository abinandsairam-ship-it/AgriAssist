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
    const aiResult = await getDoctorsOpinion({ imageUri });

    // Mock supplemental data for UI purposes until these are implemented via live APIs
    const isHealthy = (aiResult.condition || '').toLowerCase().includes('healthy');
    const enhancedResult: Prediction = {
      ...aiResult,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      recommendedMedicines: isHealthy
        ? []
        : [{ name: 'Universal Fungicide', url: '#', price: 25.0 }],
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

    return enhancedResult;

  } catch (e: any) {
    console.error("AI analysis failed:", e);
    // Return a user-friendly error message
    if (e.message) {
      // Extract a cleaner error message if possible
      const match = e.message.match(/Error fetching from .*: (\[.*)/);
      if (match && match[1]) {
        return { error: `AI analysis failed. ${match[1]}` };
      }
      return { error: `AI analysis failed: ${e.message}` };
    }
    return { error: 'An unknown error occurred during AI analysis.' };
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
