'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

// In-memory "AI brain" with a wide variety of predefined predictions.
const simulatedPredictions: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Late Blight (Phytophthora infestans)',
    confidence: 0.92,
    recommendation: "Late Blight is a serious fungal disease. Immediately remove and destroy infected plants. Apply a copper-based or systemic fungicide, ensuring full coverage, especially under leaves. Improve air circulation by pruning and spacing plants. Avoid overhead watering; use drip irrigation instead. Rotate crops and do not plant tomatoes or potatoes in the same spot for at least 3 years.",
    recommendedMedicines: [
        { name: 'Copper Fungicide', url: '#', price: 22.50 },
        { name: 'Mancozeb Fungicide', url: '#', price: 35.00 },
    ],
    relatedVideos: [{ title: 'Managing Late Blight on Tomatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/late-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Humid' },
  },
  {
    cropType: 'Corn (Zea mays)',
    condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    confidence: 0.88,
    recommendation: "Northern Corn Leaf Blight thrives in humid conditions. Plant resistant hybrids if possible. Apply a strobilurin or triazole fungicide at the first sign of disease, especially if the corn is in a critical growth stage. Tillage to bury crop residue can help reduce inoculum for the next season. Monitor fields closely, especially after periods of high humidity and moderate temperatures.",
    recommendedMedicines: [
        { name: 'Azoxystrobin Fungicide', url: '#', price: 45.00 },
        { name: 'Propiconazole Fungicide', url: '#', price: 52.00 },
    ],
    relatedVideos: [{ title: 'Identifying and Treating NCLB in Corn', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '31°C', condition: 'Cloudy' },
  },
  {
    cropType: 'Potato (Solanum tuberosum)',
    condition: 'Early Blight (Alternaria solani)',
    confidence: 0.95,
    recommendation: "Early blight appears as dark lesions with concentric rings. Practice crop rotation and ensure good field sanitation. Apply protective fungicides like chlorothalonil or mancozeb before symptoms become severe. Ensure plants have adequate nutrition, as stressed plants are more susceptible. Water at the base of the plant to keep foliage dry.",
    recommendedMedicines: [
        { name: 'Chlorothalonil Fungicide', url: '#', price: 28.00 },
    ],
    relatedVideos: [{ title: 'Controlling Early Blight in Potatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/potato-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '29°C', condition: 'Partly Cloudy' },
  },
  {
    cropType: 'Bell Pepper (Capsicum annuum)',
    condition: 'Bacterial Spot (Xanthomonas campestris)',
    confidence: 0.85,
    recommendation: "Bacterial spot causes water-soaked spots on leaves. It is difficult to control once established. Use certified disease-free seeds and plants. Apply copper-based bactericides preventatively, especially before rainy periods. Avoid working in fields when plants are wet. Remove and destroy heavily infected plants to reduce spread.",
    recommendedMedicines: [
        { name: 'Copper Hydroxide Bactericide', url: '#', price: 30.00 },
    ],
    relatedVideos: [{ title: 'Managing Bacterial Spot on Peppers', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/pepper-spot/400/225' }],
    weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Sunny' },
  },
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Healthy',
    confidence: 0.98,
    recommendation: "The plant appears healthy. To maintain good health, continue to monitor for pests and diseases regularly. Ensure consistent watering and balanced fertilization based on soil tests. Good air circulation is key to preventing fungal diseases. Continue scouting for common issues like hornworms or early signs of blight.",
    recommendedMedicines: [],
    relatedVideos: [{ title: 'Tips for Healthy Tomato Plants', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-tomato/400/225' }],
    weather: { location: 'Punjab, India', temperature: '30°C', condition: 'Sunny' },
  },
    {
    cropType: 'Cashew (Anacardium occidentale)',
    condition: 'Anthracnose (Colletotrichum gloeosporioides)',
    confidence: 0.91,
    recommendation: "Anthracnose on cashews affects leaves, twigs, and nuts, causing dark, sunken lesions. Prune and destroy infected branches during the dry season to reduce inoculum. Apply protective fungicides containing copper or mancozeb before flowering and during fruit development. Improving air circulation within the canopy can also help reduce disease severity.",
    recommendedMedicines: [
        { name: 'Mancozeb Fungicide', url: '#', price: 35.00 },
        { name: 'Copper Oxychloride', url: '#', price: 29.00 },
    ],
    relatedVideos: [{ title: 'How to Manage Cashew Anthracnose', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/cashew-disease/400/225' }],
    weather: { location: 'Goa, India', temperature: '33°C', condition: 'Humid and Sunny' },
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
    // *** SIMULATED AI RESPONSE ***
    // This block simulates an AI call by selecting a random prediction from our database.
    // It does not actually analyze the image.
    const randomIndex = Math.floor(Math.random() * simulatedPredictions.length);
    const simulatedResult = simulatedPredictions[randomIndex];
    
    // Create a full prediction object, adding dynamic data like timestamp and image URI.
    const enhancedResult: Prediction = {
      ...simulatedResult,
      timestamp: Date.now(),
      imageUrl: imageUri, // Use the actual uploaded image for the preview
      userId: userId,
    };

    return enhancedResult;

  } catch (e: any) {
    console.error("Simulated AI failed:", e);
    // This error is unlikely to be hit in the simulation but is kept for safety.
    return { error: 'An unexpected error occurred during analysis.' };
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
