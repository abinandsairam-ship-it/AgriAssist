
"use server";
import type { Prediction } from '@/lib/definitions';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';


export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image.' };
  }

  try {
    const diagnosis = await diagnosePlant({ photoDataUri: imageUri });

    if (!diagnosis || !diagnosis.cropType || !diagnosis.condition || diagnosis.cropType.toLowerCase() === 'unknown') {
      return {
        error: diagnosis.condition || 'Could not identify the crop. Please try a clearer image.',
      };
    }

    const doctorsOpinion = await getDoctorsOpinion({
      crop: diagnosis.cropType,
      condition: diagnosis.condition,
      conditionScientific: diagnosis.conditionScientific,
    });

    const predictionResult: Prediction & { newPrediction: boolean } = {
      cropType: diagnosis.cropType,
      condition: `${diagnosis.condition} (${diagnosis.conditionScientific})`,
      confidence: 0.98, // Placeholder confidence, as model doesn't return it
      imageUrl: imageUri,
      timestamp: Date.now(),
      recommendation: doctorsOpinion.recommendation,
      recommendedMedicines: doctorsOpinion.recommendedMedicines,
      relatedVideos: doctorsOpinion.relatedVideos,
      weather: {
        location: 'Punjab, India',
        temperature: '28°C',
        condition: 'Cloudy',
      },
      newPrediction: true,
      userId: userId,
    };
    return predictionResult;

  } catch (e: any) {
    console.error("Error in getPrediction flow:", e.message);
    return { error: "An unexpected error occurred during analysis. The AI model may be offline or experiencing issues." };
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
    const { translatePredictionResults } = await import('@/ai/flows/translate-prediction-results');
    const result = await translatePredictionResults({ text, language });
    return result.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
}
