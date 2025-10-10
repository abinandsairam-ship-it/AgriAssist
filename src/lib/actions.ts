'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

const MOCK_PREDICTIONS: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Late Blight (Phytophthora infestans)',
    confidence: 0.92,
    recommendation: 'Late blight is a serious fungal disease. Immediately apply a targeted fungicide containing copper or chlorothalonil. Ensure proper spacing between plants for better air circulation and avoid overhead watering. Remove and destroy infected plant debris to prevent further spread.',
    recommendedMedicines: [{ name: 'Copper Fungicide', url: '#', price: 28.50 }],
    relatedVideos: [{ title: 'Managing Late Blight in Tomatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/tomato-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Humid' },
  },
  {
    cropType: 'Corn (Zea mays)',
    condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    confidence: 0.88,
    recommendation: 'This fungal disease thrives in humid conditions. Apply a foliar fungicide at the first sign of disease. Consider using resistant hybrids for future plantings. Rotate crops and manage residue to reduce fungal inoculum.',
    recommendedMedicines: [{ name: 'Foliar Fungicide Plus', url: '#', price: 35.00 }],
    relatedVideos: [{ title: 'Identifying Northern Corn Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '31°C', condition: 'Partly Cloudy' },
  },
  {
    cropType: 'Potato (Solanum tuberosum)',
    condition: 'Healthy',
    confidence: 0.98,
    recommendation: 'The plant appears healthy. To maintain health, ensure consistent watering, monitor for pests like the Colorado potato beetle, and consider a balanced fertilizer application based on a recent soil test. Hill the potatoes as they grow to protect tubers from sunlight.',
    recommendedMedicines: [],
    relatedVideos: [{ title: 'Tips for Healthy Potato Growth', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-potato/400/225' }],
    weather: { location: 'Punjab, India', temperature: '29°C', condition: 'Sunny' },
  },
  {
    cropType: 'Bell Pepper (Capsicum annuum)',
    condition: 'Bacterial Spot (Xanthomonas campestris)',
    confidence: 0.95,
    recommendation: 'Bacterial spot causes lesions on leaves and fruit. Use copper-based bactericides for control. Avoid working with plants when they are wet to prevent spreading the bacteria. Purchase certified disease-free seeds and practice crop rotation.',
    recommendedMedicines: [{ name: 'Copper-Based Bactericide', url: '#', price: 22.75 }],
    relatedVideos: [{ title: 'Controlling Bacterial Spot on Peppers', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/pepper-spot/400/225' }],
    weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Sunny' },
  },
  {
    cropType: 'Apple (Malus domestica)',
    condition: 'Apple Scab (Venturia inaequalis)',
    confidence: 0.91,
    recommendation: 'Apple scab is a common fungal disease. A preventative spray schedule with fungicides is crucial, starting from early spring. Prune trees to improve air circulation and remove fallen leaves in autumn to reduce the source of infection.',
    recommendedMedicines: [{ name: 'Myclobutanil Fungicide', url: '#', price: 45.00 }],
    relatedVideos: [{ title: 'Preventing Apple Scab', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/apple-scab/400/225' }],
    weather: { location: 'Punjab, India', temperature: '25°C', condition: 'Overcast' },
  },
  {
    cropType: 'Grape (Vitis vinifera)',
    condition: 'Powdery Mildew (Erysiphe necator)',
    confidence: 0.94,
    recommendation: 'Powdery mildew can affect all green parts of the vine. Apply sulfur-based or systemic fungicides. Improve air circulation through canopy management. Early detection and treatment are key to control.',
    recommendedMedicines: [{ name: 'Sulfur Dust', url: '#', price: 18.00 }],
    relatedVideos: [{ title: 'Grape Powdery Mildew Control', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/grape-mildew/400/225' }],
    weather: { location: 'Punjab, India', temperature: '34°C', condition: 'Hot and Dry' },
  },
   {
    cropType: 'Strawberry (Fragaria × ananassa)',
    condition: 'Healthy',
    confidence: 0.97,
    recommendation: 'Plants look vigorous and healthy. Ensure they receive consistent moisture, use straw mulch to keep fruit clean and conserve water, and fertilize with a balanced fertilizer during the growing season. Monitor for slugs and birds.',
    recommendedMedicines: [],
    relatedVideos: [{ title: 'Growing Perfect Strawberries', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-strawberry/400/225' }],
    weather: { location: 'Punjab, India', temperature: '26°C', condition: 'Sunny' },
  },
];

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<Prediction | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    // This is a user-facing error.
    return { error: 'Please upload or capture an image to analyze.' };
  }
  
  // This is a simulated AI response.
  // It returns a random prediction from the MOCK_PREDICTIONS array.
  try {
    const randomIndex = Math.floor(Math.random() * MOCK_PREDICTIONS.length);
    const mockResult = MOCK_PREDICTIONS[randomIndex];

    // Simulate a network delay for a more realistic user experience.
    await new Promise(resolve => setTimeout(resolve, 1500));

    const result: Prediction = {
      ...mockResult,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      newPrediction: true,
    };
    
    return result;

  } catch (e: any) {
    console.error("Prediction simulation failed:", e);
    // This is a developer-facing error for a critical failure in the mock logic.
    return { error: 'The AI model is currently unavailable or could not be found. Please try again later.' };
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
