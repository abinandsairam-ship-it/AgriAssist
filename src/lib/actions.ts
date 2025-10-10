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

    // The AI result now matches the required structure more closely,
    // but we can still enhance it with mock client-side data if needed.
    const isHealthy = (aiResult.condition || '').toLowerCase().includes('healthy');
    const enhancedResult: Prediction = {
      ...aiResult,
      timestamp: Date.now(),
      imageUrl: imageUri, // Use the actual uploaded image
      userId: userId,
       // Add mock data for UI elements that the AI doesn't provide
      recommendedMedicines: isHealthy
        ? []
        : [{ name: 'Universal Fungicide', url: '#', price: 25.00 }], // Example
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
    // Provide a more user-friendly error message
    const errorMessage = e.message?.includes('404 Not Found')
      ? 'The AI model is currently unavailable or could not be found. Please try again later.'
      : e.message || 'An unknown error occurred during analysis.';
    return { error: `AI analysis failed. ${errorMessage}` };
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
