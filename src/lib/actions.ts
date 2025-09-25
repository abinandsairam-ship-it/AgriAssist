"use server";
import { storeCropData } from '@/ai/flows/store-crop-data-in-firestore';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import type { Prediction } from '@/lib/definitions';
import {writeFile} from 'fs/promises';
import {join} from 'path';


async function fileToDataURI(file: File) {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageFile = formData.get('image') as File;

  if (!imageFile || imageFile.size === 0) {
    return { error: 'Please upload an image.' };
  }
  
  const tempFilePath = join('/tmp', imageFile.name);
  await writeFile(tempFilePath, Buffer.from(await imageFile.arrayBuffer()));

  // In a real app, you would upload the image to a storage service (e.g., Firebase Storage)
  // and get a public URL. For this demo, we'll use a placeholder.
  const imageUrl = 'https://picsum.photos/seed/crop-result/600/400';

  let diagnosis;
  try {
    const photoDataUri = await fileToDataURI(imageFile);
    diagnosis = await diagnosePlant({ photoDataUri });
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
    await storeCropData({
      timestamp,
      cropType,
      condition,
      imageUrl,
      confidence,
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
