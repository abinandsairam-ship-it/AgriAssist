
'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

// A pre-defined set of high-quality, realistic predictions.
const mockPredictions: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
    {
        cropType: 'Cashew (Anacardium occidentale)',
        condition: 'Leaf Blight (Neopestalotiopsis clavispora)',
        recommendation: 'The plant shows characteristic necrotic patches on the leaves, indicating a fungal infection. To manage, prune and destroy infected leaves, ensure proper air circulation, and protect new growth with recommended fungicides. Field sanitation is crucial to prevent spread.',
        confidence: 0.96,
        recommendedMedicines: [{ name: 'Tricyclazole 75% WP', url: '#', price: 15.50 }],
        relatedVideos: [{ title: 'How to Manage Cashew Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/cashew-blight/400/225' }],
        weather: { location: 'Punjab, India', temperature: '31°C', condition: 'Sunny' },
    },
    {
        cropType: 'Tomato (Solanum lycopersicum)',
        condition: 'Late Blight (Phytophthora infestans)',
        recommendation: "Visible lesions on leaves and stems are classic signs of Late Blight, a serious disease. Immediately remove and burn infected plants. Apply a targeted fungicide like Chlorothalonil or Mancozeb, especially in humid conditions. Ensure good spacing between plants for airflow.",
        confidence: 0.92,
        recommendedMedicines: [{ name: 'Mancozeb 75% WP', url: '#', price: 22.00 }],
        relatedVideos: [{ title: 'Identifying and Treating Late Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/tomato-blight/400/225' }],
        weather: { location: 'Punjab, India', temperature: '29°C', condition: 'Partly Cloudy' },
    },
    {
        cropType: 'Corn (Zea mays)',
        condition: 'Northern Leaf Blight (Exserohilum turcicum)',
        recommendation: 'Long, elliptical, grayish-green lesions are symptomatic of Northern Leaf Blight. This can reduce yield significantly. Use resistant hybrids if available. Apply foliar fungicides like Pyraclostrobin or Azoxystrobin at the first sign of disease, and practice crop rotation.',
        confidence: 0.94,
        recommendedMedicines: [{ name: 'Azoxystrobin 23% SC', url: '#', price: 35.00 }],
        relatedVideos: [{ title: 'Managing Northern Leaf Blight in Corn', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }],
        weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Hot & Humid' },
    },
    {
        cropType: 'Potato (Solanum tuberosum)',
        condition: 'Healthy',
        recommendation: 'The plant appears healthy with no visible signs of disease or pest infestation. Continue standard monitoring and good cultural practices. Ensure consistent watering and nutrient supply to maintain vigor.',
        confidence: 0.99,
        recommendedMedicines: [],
        relatedVideos: [{ title: 'Tips for Growing Healthy Potatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-potato/400/225' }],
        weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Clear Skies' },
    }
];

// This function simulates a real-time prediction by cycling through mock data.
export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<Prediction | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image to analyze.' };
  }

  // Simulate a sub-second AI analysis by selecting a mock result.
  // Using a timestamp ensures a different result on each call.
  const now = Date.now();
  const predictionIndex = now % mockPredictions.length;
  const mockResult = mockPredictions[predictionIndex];

  if (!mockResult) {
      return { error: 'An unexpected error occurred during analysis.' };
  }

  const predictionResult: Prediction = {
    ...mockResult,
    timestamp: now,
    imageUrl: imageUri, // Use the actual uploaded image for display
    userId: userId,
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
