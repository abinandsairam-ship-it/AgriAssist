
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
  
  const imageUrl = imageUri;

  let diagnosis;
  try {
    diagnosis = await diagnosePlant({ photoDataUri: imageUri });
  } catch (e) {
     console.error("Error diagnosing plant:", e);
     return { error: "Could not analyze the plant image. Please try again." };
  }

  const { cropType, condition } = diagnosis;
  
  if (cropType === 'Unknown' || condition.startsWith('Unable to determine')) {
    return { error: "Could not identify the crop from the image. Please try again with a clearer picture." };
  }

  // Generate a confidence score. This can be a fixed value or a more complex calculation.
  const confidence = 0.95 + Math.random() * 0.049; // Mock confidence between 95% and 99.9%
  const timestamp = Date.now();

  let doctorsOpinion;
  try {
    doctorsOpinion = await getDoctorsOpinion({ crop: cropType, condition });
  } catch (e) {
    console.error('Error getting doctor\'s opinion:', e);
    // Fallback to a default message if the opinion flow fails
    doctorsOpinion = {
      recommendation: `Could not retrieve AI doctor's opinion for ${cropType} with condition ${condition}. Please try again.`,
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
    newPrediction: true, // Flag to indicate this is a new prediction
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
