
"use server";
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import type { Prediction } from '@/lib/definitions';

function parseAnalysis(analysis: string): { cropType: string; condition: string } {
  if (analysis.startsWith('Unknown disease')) {
    return {
      cropType: 'Unknown',
      condition: 'Unknown disease. Please provide clearer image or additional information.',
    };
  }

  const diseaseMatch = analysis.match(/Disease: (.*)/);
  const cropMatch = analysis.match(/Crop: (.*)/);

  const condition = diseaseMatch ? diseaseMatch[1].trim() : 'Could not determine disease';
  const cropType = cropMatch ? cropMatch[1].trim() : 'Could not determine crop';

  return { cropType, condition };
}


export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image.' };
  }
  
  const imageUrl = imageUri;

  let diagnosis;
  try {
    diagnosis = await diagnosePlant({ photoDataUri: imageUri });
  } catch (e) {
     console.error("Error diagnosing plant:", e);
     return { error: "Could not analyze the plant image. Please try again." };
  }

  const { cropType, condition } = parseAnalysis(diagnosis.analysis);
  
  if (condition.startsWith('Unknown disease')) {
    return { error: condition };
  }

  const confidence = (diagnosis as any).confidence || 0.95;
  const timestamp = Date.now();

  let doctorsOpinion;
  try {
    doctorsOpinion = await getDoctorsOpinion({ crop: cropType, condition });
  } catch (e) {
    console.error('Error getting doctor\'s opinion:', e);
    // Fallback to a default message
    doctorsOpinion = {
      recommendation: "Could not retrieve AI doctor's opinion. Please try again.",
      recommendedMedicines: [],
      relatedVideos: [],
    };
  }

  const predictionResult: Prediction & { newPrediction: boolean } = {
    cropType,
    condition,
    confidence,
    imageUrl,
    timestamp,
    recommendation: doctorsOpinion.recommendation,
    recommendedMedicines: doctorsOpinion.recommendedMedicines,
    relatedVideos: doctorsOpinion.relatedVideos,
    weather: {
      location: 'Punjab, India',
      temperature: '32°C',
      condition: 'Sunny',
    },
    newPrediction: true,
    userId,
  };
  
  return predictionResult;
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
