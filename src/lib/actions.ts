
'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

// In-memory "AI brain" with a variety of detailed, realistic predictions
const MOCK_PREDICTIONS: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId' | 'newPrediction'>[] = [
    // Healthy
    { cropType: 'Tomato', condition: 'Healthy', confidence: 0.98, recommendation: 'The plant appears healthy. No treatment is necessary. Continue standard monitoring and care.', recommendedMedicines: [], relatedVideos: [{ title: 'How to Grow Healthy Tomatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/tomato-healthy/400/225' }], weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Sunny' } },
    { cropType: 'Corn', condition: 'Healthy', confidence: 0.96, recommendation: 'Excellent condition. Ensure consistent watering as it enters the tasseling stage.', recommendedMedicines: [], relatedVideos: [{ title: 'Corn Growing Guide', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-healthy/400/225' }], weather: { location: 'Punjab, India', temperature: '30°C', condition: 'Partly Cloudy' } },

    // Tomato Diseases
    { cropType: 'Tomato', condition: 'Early blight', confidence: 0.92, recommendation: 'Apply a copper-based or chlorothalonil fungicide. Ensure good air circulation by pruning lower leaves. Avoid overhead watering.', recommendedMedicines: [{ name: 'Copper Fungicide', url: '#', price: 22.50 }], relatedVideos: [{ title: 'Managing Early Blight on Tomatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/early-blight/400/225' }], weather: { location: 'Punjab, India', temperature: '31°C', condition: 'Humid' } },
    { cropType: 'Tomato', condition: 'Late blight', confidence: 0.88, recommendation: 'Immediate action required. Apply fungicides containing mancozeb or chlorothalonil. Remove and destroy infected plants to prevent spread. This disease is aggressive.', recommendedMedicines: [{ name: 'Mancozeb Fungicide', url: '#', price: 28.00 }], relatedVideos: [{ title: 'Identifying and Treating Late Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/late-blight/400/225' }], weather: { location: 'Punjab, India', temperature: '25°C', condition: 'Rainy' } },
    { cropType: 'Tomato', condition: 'Leaf Mold', confidence: 0.95, recommendation: 'Improve air circulation and reduce humidity. Apply a fungicide containing chlorothalonil or mancozeb. Water at the base of the plant to keep foliage dry.', recommendedMedicines: [{ name: 'Chlorothalonil 720', url: '#', price: 35.00 }], relatedVideos: [{ title: 'Tomato Leaf Mold control', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/leaf-mold/400/225' }], weather: { location: 'Punjab, India', temperature: '29°C', condition: 'Humid' } },

    // Corn Diseases
    { cropType: 'Corn', condition: 'Northern Leaf Blight', confidence: 0.91, recommendation: 'Apply a strobilurin or triazole fungicide. Rotate crops and till residue to reduce overwintering of the fungus. Choose resistant hybrids for future planting.', recommendedMedicines: [{ name: 'Azoxystrobin Fungicide', url: '#', price: 45.00 }], relatedVideos: [{ title: 'Controlling Northern Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }], weather: { location: 'Punjab, India', temperature: '27°C', condition: 'Overcast' } },
    { cropType: 'Corn', condition: 'Common Rust', confidence: 0.89, recommendation: 'Most modern hybrids have good resistance. If severe on a susceptible variety, apply a fungicide like propiconazole. Scout fields regularly.', recommendedMedicines: [{ name: 'Propiconazole 14.3', url: '#', price: 32.00 }], relatedVideos: [{ title: 'Managing Common Rust in Corn', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-rust/400/225' }], weather: { location: 'Punjab, India', temperature: '26°C', condition: 'Light Rain' } },

    // Potato Diseases
    { cropType: 'Potato', condition: 'Early blight', confidence: 0.94, recommendation: 'Similar to tomatoes, apply copper-based or chlorothalonil fungicides. Ensure proper hilling to protect tubers. Maintain a consistent watering schedule.', recommendedMedicines: [{ name: 'Liquid Copper Fungicide', url: '#', price: 24.00 }], relatedVideos: [{ title: 'Potato Early Blight treatment', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/potato-blight/400/225' }], weather: { location: 'Punjab, India', temperature: '24°C', condition: 'Humid' } },

    // Pepper
    { cropType: 'Bell Pepper', condition: 'Bacterial spot', confidence: 0.93, recommendation: 'Use copper-based bactericides, but be aware of resistance. Avoid working in fields when wet. Remove infected debris after harvest.', recommendedMedicines: [{ name: 'Copper Hydroxide', url: '#', price: 29.50 }], relatedVideos: [{ title: 'Bacterial Spot on Peppers', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/pepper-spot/400/225' }], weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Sunny' } },

    // Apple
    { cropType: 'Apple', condition: 'Apple scab', confidence: 0.95, recommendation: 'Apply fungicides from green tip through petal fall. Mancozeb and Captan are effective. Prune trees for better air circulation and sunlight penetration.', recommendedMedicines: [{ name: 'Captan Fungicide', url: '#', price: 55.00 }], relatedVideos: [{ title: 'Preventing Apple Scab', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/apple-scab/400/225' }], weather: { location: 'Punjab, India', temperature: '22°C', condition: 'Drizzle' } },
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
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Select a random prediction from the mock database
    const randomIndex = Math.floor(Math.random() * MOCK_PREDICTIONS.length);
    const selectedPrediction = MOCK_PREDICTIONS[randomIndex];
    
    const result: Prediction = {
      ...selectedPrediction,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
      newPrediction: true,
    };
    
    return result;

  } catch (e: any) {
    console.error("Simulated analysis failed:", e);
    return { error: 'An unexpected error occurred during the simulated analysis. Please try again.' };
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
