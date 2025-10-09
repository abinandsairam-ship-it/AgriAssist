
"use server";
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import type { Prediction } from '@/lib/definitions';

// Mock function to simulate a fast AI response
async function getMockPrediction(imageUri: string, userId?: string): Promise<Prediction & { newPrediction: boolean }> {
  // This simulates the AI analysis and returns a realistic result instantly.
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 200)); // Simulate 200-700ms delay

  const mockDiagnosis = {
    cropType: 'Tomato',
    condition: 'Late Blight',
  };

  const mockDoctorsOpinion = {
    recommendation: "Your tomato plant is showing classic signs of Late Blight, a common fungal disease. To manage this, immediately remove and destroy infected leaves. Improve air circulation around the plants and apply a copper-based fungicide every 7-10 days, following the product's instructions carefully. Avoid overhead watering to keep foliage dry.",
    recommendedMedicines: [
      {
        name: 'Copper Fungicide',
        price: 25.99,
        url: 'https://example.com/product/copper-fungicide',
      },
      {
        name: 'Bonide Fung-onil',
        price: 19.50,
        url: 'https://example.com/product/bonide-fung-onil',
      },
    ],
    relatedVideos: [
       {
        title: "How to Identify and Treat Late Blight on Tomatoes",
        thumbnailUrl: "https://picsum.photos/seed/video1/400/225",
        videoUrl: "https://youtube.com/watch?v=example1"
      },
       {
        title: "Organic Sprays for Tomato Diseases",
        thumbnailUrl: "https://picsum.photos/seed/video2/400/225",
        videoUrl: "https://youtube.com/watch?v=example2"
      },
       {
        title: "Pruning Tomatoes for Better Airflow",
        thumbnailUrl: "https://picsum.photos/seed/video3/400/225",
        videoUrl: "https://youtube.com/watch?v=example3"
      }
    ],
  };

  return {
    cropType: mockDiagnosis.cropType,
    condition: mockDiagnosis.condition,
    confidence: 0.98,
    imageUrl: imageUri, // Use the uploaded image
    timestamp: Date.now(),
    recommendation: mockDoctorsOpinion.recommendation,
    recommendedMedicines: mockDoctorsOpinion.recommendedMedicines,
    relatedVideos: mockDoctorsOpinion.relatedVideos,
    weather: {
      location: 'Punjab, India',
      temperature: '32°C',
      condition: 'Sunny',
    },
    newPrediction: true,
    userId,
  };
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

  // Use the mock function for instant, reliable results.
  try {
    const predictionResult = await getMockPrediction(imageUri, userId);
    return predictionResult;
  } catch (e: any) {
    console.error("Error in mock prediction flow:", e.message);
    return { error: "An unexpected error occurred during analysis. Please try again." };
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
