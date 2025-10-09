
"use server";
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import type { Prediction } from '@/lib/definitions';


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

    if (
      !diagnosis ||
      !diagnosis.cropType ||
      !diagnosis.condition ||
      diagnosis.cropType.toLowerCase() === 'unknown'
    ) {
      return {
        error:
          diagnosis.condition ||
          'Could not identify the crop. Please try a clearer image.',
      };
    }

    const doctorsOpinion = await getDoctorsOpinion({
      crop: diagnosis.cropType,
      condition: diagnosis.condition,
    });

    const predictionResult: Prediction & { newPrediction: boolean } = {
      cropType: diagnosis.cropType,
      condition: diagnosis.condition,
      confidence: 0.98, // Confidence from diagnosis is not available, using placeholder
      imageUrl: imageUri,
      timestamp: Date.now(),
      recommendation: doctorsOpinion.recommendation,
      recommendedMedicines: doctorsOpinion.recommendedMedicines,
      relatedVideos: doctorsOpinion.relatedVideos,
      weather: {
        location: 'Punjab, India',
        temperature: '32°C',
        condition: 'Sunny',
      },
      newPrediction: true,
      userId: userId,
    };
    return predictionResult;
  } catch (e: any) {
    console.error("Error in getPrediction flow:", e.message);
    return { error: "An unexpected error occurred during AI analysis. The AI model may be offline." };
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
