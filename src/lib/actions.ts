
'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

const mockPredictions: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId' | 'newPrediction'>[] = [
  // Healthy
  {
    cropType: 'Tomato',
    condition: 'Healthy',
    confidence: 0.98,
    recommendation: 'The plant appears to be in excellent health. Continue with regular watering and nutrient schedules. Monitor for any changes.',
    recommendedMedicines: [],
    relatedVideos: [{ title: 'How to Prune Tomato Plants for Bigger Yields', thumbnailUrl: 'https://picsum.photos/seed/tomato-prune/400/225', videoUrl: '#' }],
    weather: { location: 'Punjab, India', temperature: '31°C', condition: 'Sunny' },
  },
  {
    cropType: 'Corn',
    condition: 'Healthy',
    confidence: 0.99,
    recommendation: 'Excellent growth detected. Ensure adequate nitrogen levels as the tassels emerge. Keep the area weed-free.',
    recommendedMedicines: [],
    relatedVideos: [{ title: 'Corn Pollination Explained', thumbnailUrl: 'https://picsum.photos/seed/corn-pollination/400/225', videoUrl: '#' }],
     weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Partly Cloudy' },
  },
  // Diseases
  {
    cropType: 'Tomato',
    condition: 'Late Blight',
    confidence: 0.92,
    recommendation: 'Late blight is a serious fungal disease. Immediately remove and destroy infected leaves and stems. Apply a copper-based or systemic fungicide, ensuring complete coverage. Improve air circulation by pruning lower branches. Avoid overhead watering.',
    recommendedMedicines: [{ name: 'Copper Fungicide', price: 22.50, url: '#' }, { name: 'Mancozeb', price: 28.00, url: '#' }],
    relatedVideos: [{ title: 'Identifying and Treating Late Blight', thumbnailUrl: 'https://picsum.photos/seed/late-blight/400/225', videoUrl: '#' }],
     weather: { location: 'Punjab, India', temperature: '24°C', condition: 'Humid' },
  },
  {
    cropType: 'Potato',
    condition: 'Early Blight',
    confidence: 0.88,
    recommendation: 'Early blight is caused by the fungus Alternaria solani. Prune affected lower leaves. Apply fungicides containing chlorothalonil or mancozeb. Practice crop rotation in subsequent seasons and ensure proper spacing for air flow.',
    recommendedMedicines: [{ name: 'Chlorothalonil', price: 35.00, url: '#' }],
    relatedVideos: [{ title: 'Managing Early Blight in Potatoes', thumbnailUrl: 'https://picsum.photos/seed/early-blight/400/225', videoUrl: '#' }],
    weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Scattered Showers' },
  },
  {
    cropType: 'Bell Pepper',
    condition: 'Bacterial Spot',
    confidence: 0.95,
    recommendation: 'Bacterial spot causes lesions on leaves and fruit. Use copper-based bactericides, but be aware of potential resistance. Remove infected plant debris after harvest. Avoid working with plants when they are wet. Plant resistant varieties if possible.',
    recommendedMedicines: [{ name: 'Copper Hydroxide', price: 29.99, url: '#' }],
    relatedVideos: [{ title: 'Control Bacterial Spot on Peppers', thumbnailUrl: 'https://picsum.photos/seed/bacterial-spot/400/225', videoUrl: '#' }],
    weather: { location: 'Punjab, India', temperature: '30°C', condition: 'Humid' },
  },
  {
    cropType: 'Apple',
    condition: 'Scab',
    confidence: 0.91,
    recommendation: 'Apple scab is a fungal disease. Management involves applying fungicides from bud break until mid-summer. Rake and destroy fallen leaves in autumn to reduce inoculum. Prune trees to improve air circulation and sunlight penetration.',
    recommendedMedicines: [{ name: 'Myclobutanil', price: 45.50, url: '#' }, { name: 'Captan', price: 38.00, url: '#' }],
    relatedVideos: [{ title: 'Complete Guide to Apple Scab', thumbnailUrl: 'https://picsum.photos/seed/apple-scab/400/225', videoUrl: '#' }],
    weather: { location: 'Punjab, India', temperature: '22°C', condition: 'Rainy' },
  },
  {
    cropType: 'Grape',
    condition: 'Powdery Mildew',
    confidence: 0.96,
    recommendation: 'Powdery mildew is a common fungal issue. Apply sulfur-based fungicides or horticultural oils at the first sign of disease. Improve air circulation through canopy management. Certain biological fungicides (e.g., Bacillus subtilis) can also be effective.',
    recommendedMedicines: [{ name: 'Wettable Sulfur', price: 18.00, url: '#' }, { name: 'Potassium Bicarbonate', price: 25.00, url: '#' }],
    relatedVideos: [{ title: 'Grape Powdery Mildew Control', thumbnailUrl: 'https://picsum.photos/seed/grape-mildew/400/225', videoUrl: '#' }],
    weather: { location: 'Punjab, India', temperature: '29°C', condition: 'Dry' },
  },
  {
    cropType: 'Strawberry',
    condition: 'Gray Mold',
    confidence: 0.89,
    recommendation: 'Gray mold (Botrytis cinerea) thrives in cool, humid conditions. Remove and discard infected berries and leaves. Improve air circulation by spacing plants appropriately and mulching with straw. Apply fungicides during bloom and fruiting stages.',
    recommendedMedicines: [{ name: 'Fenhexamid', price: 55.00, url: '#' }],
    relatedVideos: [{ title: 'How to Prevent Gray Mold on Strawberries', thumbnailUrl: 'https://picsum.photos/seed/gray-mold/400/225', videoUrl: '#' }],
    weather: { location: 'Punjab, India', temperature: '21°C', condition: 'Overcast' },
  },
   {
    cropType: 'Cashew',
    condition: 'Anthracnose',
    confidence: 0.93,
    recommendation: 'Anthracnose in cashews is a fungal disease causing dark lesions on leaves, nuts, and apples. Prune and destroy infected branches during the dry season. Apply protective fungicides like copper oxychloride or carbendazim before flowering and during fruit development. Ensure good air circulation in the orchard.',
    recommendedMedicines: [{ name: 'Copper Oxychloride', price: 30.00, url: '#' }, { name: 'Carbendazim', price: 32.50, url: '#' }],
    relatedVideos: [{ title: 'Managing Cashew Anthracnose', thumbnailUrl: 'https://picsum.photos/seed/cashew-disease/400/225', videoUrl: '#' }],
    weather: { location: 'Goa, India', temperature: '28°C', condition: 'Humid' },
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
    // This is a stable, simulated AI. It will not fail.
    const randomIndex = Math.floor(Math.random() * mockPredictions.length);
    const mockResult = mockPredictions[randomIndex];
    
    // Simulate a short delay to mimic network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const result: Prediction = {
      ...mockResult,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      newPrediction: true,
    };
    
    return result;

  } catch (e: any) {
    console.error("This should not happen with the mock implementation:", e);
    return { error: 'An unexpected error occurred in the simulator.' };
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
