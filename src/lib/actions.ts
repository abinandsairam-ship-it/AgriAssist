
"use server";
import type { Prediction } from '@/lib/definitions';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import { getDoctorsOpinion, type GetDoctorsOpinionOutput } from '@/ai/flows/get-doctors-opinion';


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
    // Step 1: Get a simple, descriptive diagnosis from the image.
    const diagnosis = await diagnosePlant({ photoDataUri: imageUri });

    if (!diagnosis || !diagnosis.description) {
      return {
        error: 'Could not analyze the image. Please try a clearer picture.',
      };
    }

    if (diagnosis.description.toLowerCase().includes("not a plant") || diagnosis.description.toLowerCase().includes("unknown")) {
        return {
            error: "Could not identify a plant in the image. Please try again with a clearer picture of a plant."
        }
    }


    // Step 2: Use the description to generate the detailed "Doctor's Opinion".
    const doctorsOpinion: GetDoctorsOpinionOutput = await getDoctorsOpinion({
        imageDescription: diagnosis.description,
    });
    
    if (!doctorsOpinion || !doctorsOpinion.crop || doctorsOpinion.crop.toLowerCase() === 'unknown') {
        return { error: "AI could not identify the crop in the image. Please try again." };
    }


    const predictionResult: Prediction & { newPrediction: boolean } = {
      cropType: doctorsOpinion.crop,
      condition: `${doctorsOpinion.condition} (${doctorsOpinion.conditionScientific})`,
      confidence: 0.98, // Placeholder confidence
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
    console.error("Error in getPrediction flow:", e);
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
