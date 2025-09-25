"use server";
import { storeCropData } from '@/ai/flows/store-crop-data-in-firestore';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import type { Prediction } from '@/lib/definitions';

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageUri = formData.get('imageUri') as string;

  if (!imageUri) {
    return { error: 'Please upload or capture an image.' };
  }
  
  // In a real app, you would upload the image to a storage service (e.g., Firebase Storage)
  // and get a public URL. For this demo, we'll use a placeholder and the data URI for analysis.
  const imageUrl = imageUri;

  let diagnosis;
  try {
    diagnosis = await diagnosePlant({ photoDataUri: imageUri });
  } catch (e) {
     console.error("Error diagnosing plant:", e);
     return { error: "Could not analyze the plant image. Please try again." };
  }

  const { cropType, condition, confidence } = diagnosis;
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

  try {
    // For storage, we might not want to store the full data URI.
    // In a real app, this would be a URL from a service like Cloud Storage.
    // For now, we'll use a placeholder for the stored URL to keep Firestore documents light.
    const placeholderUrl = `https://picsum.photos/seed/${timestamp}/600/400`;
    await storeCropData({
      timestamp,
      cropType,
      condition,
      imageUrl: placeholderUrl,
      confidence,
      recommendation: doctorsOpinion.recommendation,
      recommendedMedicines: doctorsOpinion.recommendedMedicines,
      relatedVideos: doctorsOpinion.relatedVideos,
      weather: {
        location: 'Punjab, India',
        temperature: '32°C',
        condition: 'Sunny',
      },
      // userId: "anonymous" // In a real app with auth
    });
  } catch (e) {
    console.error('Firestore storage failed:', e);
    // Non-fatal for the user, but log it.
  }

  const predictionResult: Prediction & { newPrediction: boolean } = {
    cropType,
    condition,
    confidence,
    imageUrl, // Use the captured/uploaded image for immediate display
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
