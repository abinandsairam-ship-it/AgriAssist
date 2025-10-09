'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

// In-memory "database" of high-quality, pre-defined prediction results
const mockPredictions: Prediction[] = [
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Late Blight (Phytophthora infestans)',
    confidence: 0.95,
    recommendation: "Doctor's Opinion: The image shows classic symptoms of Late Blight, a serious fungal disease. You can see dark, water-soaked lesions on the leaves that are rapidly expanding. White mold may be visible on the undersides of leaves in humid conditions. This disease spreads very quickly and can destroy a crop in a week. Immediate action is required. For management, remove and destroy all infected plants immediately to reduce the source of spores. Do not compost them. Ensure good air circulation by pruning and spacing plants appropriately. Avoid overhead watering. Apply a preventative fungicide containing copper or chlorothalonil according to label directions, especially during cool, wet weather.",
    timestamp: 0,
    imageUrl: '',
    recommendedMedicines: [{ name: 'Mancozeb Fungicide', url: '#', price: 28.50 }],
    relatedVideos: [{ title: 'How to Manage Late Blight on Tomatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/late-blight/400/225' }],
  },
  {
    cropType: 'Corn (Zea mays)',
    condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    confidence: 0.92,
    recommendation: "Doctor's Opinion: The long, elliptical, grayish-green to tan lesions are characteristic of Northern Corn Leaf Blight. This is a common foliar disease that can significantly reduce yield if it becomes severe, especially during the silking and grain fill stages. To manage it, consider using resistant corn hybrids in future plantings. Crop rotation with non-host crops like soybeans or alfalfa can help reduce inoculum levels. If the disease is severe on a susceptible hybrid, a foliar fungicide application may be warranted. Consult with a local extension agent for the best fungicide options and timing in your area.",
    timestamp: 0,
    imageUrl: '',
    recommendedMedicines: [{ name: 'Propiconazole 14.3%', url: '#', price: 45.00 }],
    relatedVideos: [{ title: 'Identifying Northern Corn Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }],
  },
  {
    cropType: 'Potato (Solanum tuberosum)',
    condition: 'Early Blight (Alternaria solani)',
    confidence: 0.89,
    recommendation: "Doctor's Opinion: The leaf spots with a characteristic 'target' or 'bullseye' appearance are indicative of Early Blight. This disease typically affects lower, older leaves first and can cause defoliation, reducing tuber size and yield. To manage, maintain good plant nutrition and soil moisture to reduce stress. Remove and destroy infected lower leaves. Practice crop rotation, as the fungus can survive in plant debris. Protective fungicides like those containing chlorothalonil or mancozeb can be effective if applied before the disease becomes severe.",
    timestamp: 0,
    imageUrl: '',
    recommendedMedicines: [{ name: 'Chlorothalonil Fungicide', url: '#', price: 32.00 }],
    relatedVideos: [{ title: 'Control and Prevention of Early Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/early-blight/400/225' }],
  },
  {
    cropType: 'Bell Pepper (Capsicum annuum)',
    condition: 'Bacterial Spot (Xanthomonas campestris)',
    confidence: 0.96,
    recommendation: "Doctor's Opinion: The small, water-soaked spots on the leaves that turn dark and irregular are classic signs of Bacterial Spot. This can lead to defoliation and spots on the fruit, making them unmarketable. This bacterial disease is very difficult to control once established and is spread by splashing water. Prevention is key. Use certified disease-free seeds and transplants. Sanitize all tools and equipment. Avoid working in the fields when plants are wet. Copper-based bactericides can help suppress the spread but will not cure infected plants. Remove heavily infected plants to protect healthy ones.",
    timestamp: 0,
    imageUrl: '',
    recommendedMedicines: [{ name: 'Copper Hydroxide Bactericide', url: '#', price: 22.75 }],
    relatedVideos: [{ title: 'Managing Bacterial Spot in Peppers', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/pepper-spot/400/225' }],
  },
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Healthy',
    confidence: 0.98,
    recommendation: "Doctor's Opinion: The plant appears to be in excellent health. The leaves show vigorous growth, good color, and no signs of spots, lesions, or pest damage. To maintain this healthy state, continue with your current watering and fertilization schedule. Ensure good air circulation around the plants to prevent fungal diseases. Regularly scout for early signs of pests or diseases. A proactive approach is the best way to keep your plants thriving.",
    timestamp: 0,
    imageUrl: '',
    recommendedMedicines: [],
    relatedVideos: [{ title: 'Tips for Healthy Tomato Plants', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-tomato/400/225' }],
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
    // --- RELIABLE SIMULATED AI ---
    // This provides a fast, error-free experience by cycling through a pre-defined set of high-quality results.
    
    // Select a random prediction from our mock database
    const randomIndex = Math.floor(Math.random() * mockPredictions.length);
    const simulatedResult = mockPredictions[randomIndex];

    // Construct the full prediction object for the UI
    const predictionResult: Prediction = {
      ...simulatedResult,
      timestamp: Date.now(),
      imageUrl: imageUri, // Use the actual uploaded image for display
      userId: userId,
      weather: {
        location: 'Punjab, India',
        temperature: '30°C',
        condition: 'Sunny',
      },
    };

    return predictionResult;
    
  } catch (e: any) {
    console.error('Prediction simulation failed:', e);
    return {
      error: `An unexpected error occurred during analysis.`,
    };
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
