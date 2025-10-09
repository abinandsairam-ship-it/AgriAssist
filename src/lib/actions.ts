'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

const mockPredictions: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Late Blight (Phytophthora infestans)',
    confidence: 0.92,
    recommendation:
      "Late Blight is a serious fungal disease that can spread rapidly. Immediate action is crucial. The dark, water-soaked spots on the leaves and stems are characteristic. To manage, remove and destroy all infected plant parts immediately. Do not compost them. Improve air circulation by pruning lower leaves. Avoid overhead watering; use drip irrigation if possible. Apply a copper-based or chlorothalonil fungicide, ensuring complete coverage of the plant, and repeat every 7-10 days or according to the product label, especially in cool, moist conditions.",
    recommendedMedicines: [{ name: 'Copper Fungicide', url: '#', price: 18.5 }],
    relatedVideos: [{ title: 'Managing Tomato Late Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/tomato-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Humid' },
  },
  {
    cropType: 'Corn (Zea mays)',
    condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    confidence: 0.88,
    recommendation:
      "The long, elliptical, grayish-green or tan lesions are a classic sign of Northern Corn Leaf Blight. This disease thrives in humid weather and can significantly reduce yield if it infects the plant during early growth stages. Management should focus on using resistant corn hybrids if available. For existing infections, a foliar fungicide (such as those containing pyraclostrobin or azoxystrobin) can be effective if applied early. Crop rotation with non-host crops like soybeans or alfalfa is a key long-term prevention strategy.",
    recommendedMedicines: [{ name: 'Azoxystrobin Fungicide', url: '#', price: 45.0 }],
    relatedVideos: [{ title: 'Identifying Northern Corn Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '31°C', condition: 'Cloudy' },
  },
  {
    cropType: 'Potato (Solanum tuberosum)',
    condition: 'Early Blight (Alternaria solani)',
    confidence: 0.95,
    recommendation:
      "Early blight is characterized by small, dark spots that enlarge into target-like rings on the leaves. It typically affects lower, older leaves first. To control, practice good sanitation by removing plant debris after harvest. Ensure adequate spacing for airflow. Water at the base of the plant to keep foliage dry. Protective fungicides containing mancozeb or chlorothalonil are effective as a preventive measure, especially before the canopy closes.",
    recommendedMedicines: [{ name: 'Mancozeb Fungicide', url: '#', price: 22.0 }],
    relatedVideos: [{ title: 'Controlling Early Blight on Potatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/potato-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '29°C', condition: 'Partly Cloudy' },
  },
  {
    cropType: 'Bell Pepper (Capsicum annuum)',
    condition: 'Bacterial Spot (Xanthomonas campestris pv. vesicatoria)',
    confidence: 0.85,
    recommendation:
      "Bacterial spot appears as small, water-soaked spots on leaves that turn dark and greasy. This bacterial disease is difficult to control once established. Prevention is key: use certified disease-free seeds and transplants. Avoid working in the fields when plants are wet. Copper-based bactericides can help suppress the spread but may not be fully effective in favorable conditions. Rotating crops and removing infected plant debris is critical for future prevention.",
    recommendedMedicines: [{ name: 'Copper Hydroxide Bactericide', url: '#', price: 30.0 }],
    relatedVideos: [{ title: 'Preventing Bacterial Spot in Peppers', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/pepper-spot/400/225' }],
    weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Sunny' },
  },
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Healthy',
    confidence: 0.98,
    recommendation:
      "The plant appears to be in excellent health. The leaves are vibrant green with no signs of spots, yellowing, or pest damage. To maintain this condition, continue providing consistent watering, ensure good air circulation, and monitor regularly for any early signs of stress or disease. A balanced fertilizer application according to the plant's growth stage will support continued healthy development.",
    recommendedMedicines: [],
    relatedVideos: [],
    weather: { location: 'Punjab, India', temperature: '30°C', condition: 'Sunny' },
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

  // Use a truly random index to select a mock prediction
  const randomIndex = Math.floor(Math.random() * mockPredictions.length);
  const selectedPrediction = mockPredictions[randomIndex];

  if (!selectedPrediction) {
    return { error: 'Could not generate a prediction. Please try again.' };
  }

  // Construct the full prediction object for the UI
  const predictionResult: Prediction = {
    ...selectedPrediction,
    timestamp: Date.now(),
    imageUrl: imageUri, // Use the actual uploaded image for display
    userId: userId,
  };

  // Return a promise-like delay to simulate network latency
  await new Promise(resolve => setTimeout(resolve, 1500));

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
