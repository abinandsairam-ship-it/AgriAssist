
"use server";
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import type { Prediction } from '@/lib/definitions';
import { storeCropDataInFirestore } from '@/ai/flows/store-crop-data-in-firestore';
import { auth } from 'firebase-admin';

async function getUserId(): Promise<string | null> {
  try {
    const user = await auth().verifyIdToken(
      (await auth().createCustomToken('server-user')) || ''
    );
    return user.uid;
  } catch (e) {
    if (e instanceof Error && e.message.includes('ID token has expired')) {
      // This is a known issue with server actions and will be addressed.
      // For now, we can fall back to a hardcoded user ID.
      return 'server-user';
    }
    console.error('Error getting user ID:', e);
    return null;
  }
}

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = await getUserId();

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
    userId: userId || undefined,
  };
  
  if (userId) {
    try {
      const placeholderUrl = `https://picsum.photos/seed/${timestamp}/600/400`;
      await storeCropDataInFirestore({
          ...predictionResult,
          imageUrl: placeholderUrl, // store a placeholder in Firestore
      });
    } catch(e) {
        console.error("Firestore storage failed:", e);
        // We can still show the result to the user even if db save fails
    }
  }


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
