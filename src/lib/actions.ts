'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

// High-quality mock prediction data
const mockPredictions: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Late Blight (Phytophthora infestans)',
    recommendation: 'Late blight is a serious fungal disease. Immediately remove and destroy infected leaves. Ensure proper spacing for air circulation. Apply a copper-based or systemic fungicide like Mancozeb or Chlorothalonil, following label instructions carefully. Avoid overhead watering.',
    confidence: 0.92,
    recommendedMedicines: [{ name: 'Mancozeb Fungicide', url: '#', price: 28.50 }],
    relatedVideos: [{ title: 'Managing Tomato Late Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/tomato-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Humid' },
  },
  {
    cropType: 'Corn (Zea mays)',
    condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    recommendation: 'This fungal disease presents as long, elliptical, grayish-green or tan lesions. Use resistant hybrids if possible. Foliar fungicides like Azoxystrobin or Pyraclostrobin can be effective if applied early. Rotate crops and manage residue to reduce fungal survival.',
    confidence: 0.88,
    recommendedMedicines: [{ name: 'Azoxystrobin 250 SC', url: '#', price: 45.00 }],
    relatedVideos: [{ title: 'Identifying Northern Corn Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Sunny' },
  },
  {
    cropType: 'Potato (Solanum tuberosum)',
    condition: 'Healthy',
    recommendation: 'The plant appears healthy with no visible signs of disease or pest infestation. Continue standard monitoring and good agricultural practices. Ensure consistent watering and balanced fertilization to maintain vigor.',
    confidence: 0.98,
    recommendedMedicines: [],
    relatedVideos: [{ title: 'Best Practices for Potato Farming', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-potato/400/225' }],
     weather: { location: 'Punjab, India', temperature: '30°C', condition: 'Partly Cloudy' },
  },
  {
    cropType: 'Wheat (Triticum aestivum)',
    condition: 'Powdery Mildew (Blumeria graminis)',
    recommendation: 'Powdery mildew appears as white, talc-like powder on leaf surfaces. It thrives in high humidity and moderate temperatures. Apply a sulfur-based or triazole fungicide. Ensure good air circulation and avoid excessive nitrogen fertilization.',
    confidence: 0.95,
    recommendedMedicines: [{ name: 'Propiconazole 25% EC', url: '#', price: 35.75 }],
    relatedVideos: [{ title: 'Controlling Powdery Mildew in Wheat', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/wheat-mildew/400/225' }],
     weather: { location: 'Punjab, India', temperature: '25°C', condition: 'Cloudy' },
  },
];


export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<Prediction | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;
  
  if (!imageUri) {
    return { error: 'Please upload or capture an image to analyze.' };
  }

  try {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Cycle through mock predictions based on the current time
    const now = Date.now();
    const predictionIndex = Math.floor(now / 10000) % mockPredictions.length;
    const selectedPrediction = mockPredictions[predictionIndex];
    
    if (!selectedPrediction) {
       throw new Error('Internal error: Could not load a prediction.');
    }

    const predictionResult: Prediction = {
      ...selectedPrediction,
      timestamp: now,
      imageUrl: imageUri, // Use the actual uploaded image for the preview
      userId: userId,
    };

    return predictionResult;
  } catch (e: any) {
    console.error("Simulated analysis failed:", e);
    return { error: e.message || 'The analysis failed. Please try again later.' };
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
