
"use server";
import type { Prediction } from '@/lib/definitions';
import { diagnosePlant } from '@/ai/flows/diagnose-plant-flow';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';

// Mock data for instant and reliable responses
const mockPredictions = [
    {
        cropType: 'Rice',
        condition: 'Brown Spot (Bipolaris oryzae)',
        recommendation: 'The leaf shows characteristic brown spots which are typical of brown spot disease. Treat with recommended fungicides and ensure proper field hygiene. Monitor for similar symptoms on neighboring plants.',
        recommendedMedicines: [
            { name: 'Propiconazole 25% EC', price: 15.50, url: '#' },
            { name: 'Mancozeb 75% WP', price: 12.00, url: '#' }
        ],
        relatedVideos: [
            { title: 'Managing Brown Spot in Rice', thumbnailUrl: 'https://picsum.photos/seed/rice-spot/120/90', videoUrl: '#' },
        ]
    },
    {
        cropType: 'Corn',
        condition: 'Northern Leaf Blight (Exserohilum turcicum)',
        recommendation: 'The long, cigar-shaped lesions are a classic sign of Northern Leaf Blight. Apply fungicides at the first sign of disease and consider resistant hybrids for future plantings. Good residue management can reduce inoculum.',
        recommendedMedicines: [
            { name: 'Azoxystrobin', price: 22.00, url: '#' },
            { name: 'Pyraclostrobin', price: 25.00, url: '#' }
        ],
        relatedVideos: [
            { title: 'How to Identify and Treat Northern Leaf Blight', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/120/90', videoUrl: '#' },
        ]
    },
    {
        cropType: 'Potato',
        condition: 'Late Blight (Phytophthora infestans)',
        recommendation: 'This is Late Blight, a serious potato disease. Immediate fungicide application is critical. Destroy infected plants to prevent spread. Ensure good air circulation and avoid overhead irrigation.',
        recommendedMedicines: [
            { name: 'Chlorothalonil', price: 18.00, url: '#' },
            { name: 'Metalaxyl-M', price: 28.50, url: '#' }
        ],
        relatedVideos: [
            { title: 'Preventing Late Blight in Potatoes', thumbnailUrl: 'https://picsum.photos/seed/potato-blight/120/90', videoUrl: '#' },
        ]
    }
];


export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image.' };
  }

  // Use timestamp to cycle through mock predictions for more dynamic results
  const mockResult = mockPredictions[Date.now() % mockPredictions.length];

  const predictionResult: Prediction & { newPrediction: boolean } = {
    ...mockResult,
    confidence: 0.98, // High confidence for mock data
    imageUrl: imageUri,
    timestamp: Date.now(),
    weather: {
      location: 'Punjab, India',
      temperature: '28°C',
      condition: 'Cloudy',
    },
    newPrediction: true,
    userId: userId,
  };
  
  // Simulate network delay for realism, but keep it very short
  await new Promise(resolve => setTimeout(resolve, 500));
  
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
    const { translatePredictionResults } = await import('@/ai/flows/translate-prediction-results');
    const result = await translatePredictionResults({ text, language });
    return result.translatedText;
  } catch (error) {
    console.error('Translation failed:', error);
    return text; // Fallback to original text
  }
}
