"use server";
import { storeCropData } from '@/ai/flows/store-crop-data-in-firestore';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import type { Prediction } from '@/lib/definitions';

const MOCK_CROPS = ['Wheat', 'Corn', 'Rice', 'Tomato', 'Potato'];
const MOCK_CONDITIONS = [
  'Healthy',
  'Pest-attacked',
  'Nutrient deficiency',
  'Blight',
  'Rust',
];

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageFile = formData.get('image') as File;

  if (!imageFile || imageFile.size === 0) {
    return { error: 'Please upload an image.' };
  }

  // In a real app, you would upload the image to a storage service (e.g., Firebase Storage)
  // and get a public URL. For this demo, we'll use a placeholder.
  const imageUrl = 'https://picsum.photos/seed/crop-result/600/400';

  // Mock AI model prediction
  const cropType = MOCK_CROPS[Math.floor(Math.random() * MOCK_CROPS.length)];
  const condition =
    MOCK_CONDITIONS[Math.floor(Math.random() * MOCK_CONDITIONS.length)];
  const confidence = Math.random() * (0.99 - 0.75) + 0.75; // Confidence between 75% and 99%
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
