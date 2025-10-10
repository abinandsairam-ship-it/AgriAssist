'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

const MOCK_PREDICTIONS: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Late Blight (Phytophthora infestans)',
    confidence: 0.92,
    recommendation: "This is a serious fungal disease that can devastate tomato crops. The dark, water-soaked lesions on the leaves and stems are classic symptoms. To manage, immediately remove and destroy infected plants to prevent spores from spreading. Apply a copper-based or chlorothalonil fungicide, ensuring complete coverage of the plant, and repeat every 7-10 days or as the product label directs. Improve air circulation by pruning lower leaves and spacing plants farther apart. Avoid overhead watering, as the fungus thrives in moist conditions; use drip irrigation instead.",
    recommendedMedicines: [
      { name: 'Copper Fungicide', url: '#', price: 22.50 },
      { name: 'Chlorothalonil Fungicide', url: '#', price: 28.00 },
    ],
    relatedVideos: [
      { title: 'Identifying and Treating Late Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/late-blight-tomato/400/225' },
    ],
    weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Humid' },
  },
  {
    cropType: 'Corn (Zea mays)',
    condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    confidence: 0.88,
    recommendation: "The long, elliptical, grayish-green lesions are characteristic of Northern Corn Leaf Blight. This disease reduces the plant's photosynthetic ability, impacting yield. Management should focus on using resistant corn hybrids in future plantings. For the current crop, a foliar fungicide (such as one containing pyraclostrobin or azoxystrobin) can be effective if applied early in the disease's development, especially if the crop has not yet tasseled. Rotate crops away from corn for at least one year to reduce fungal inoculum in the soil.",
    recommendedMedicines: [
        { name: 'Pyraclostrobin Fungicide', url: '#', price: 45.00 },
        { name: 'Azoxystrobin Fungicide', url: '#', price: 55.00 },
    ],
    relatedVideos: [
      { title: 'Scouting for Northern Corn Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' },
    ],
    weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Partly Cloudy' },
  },
  {
    cropType: 'Potato (Solanum tuberosum)',
    condition: 'Early Blight (Alternaria solani)',
    confidence: 0.95,
    recommendation: "Early blight is identified by the 'target-spot' lesions on lower, older leaves. While less destructive than late blight, it can still significantly reduce yield. Start by removing and destroying affected lower leaves. Apply a preventive fungicide containing mancozeb or chlorothalonil before the disease becomes severe. Maintain consistent soil moisture to reduce plant stress and consider a longer crop rotation cycle (2-3 years) to break the disease cycle.",
    recommendedMedicines: [
      { name: 'Mancozeb Fungicide', url: '#', price: 19.99 },
      { name: 'Chlorothalonil Fungicide', url: '#', price: 28.00 },
    ],
    relatedVideos: [
      { title: 'Managing Early Blight in Potatoes', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/potato-blight/400/225' },
    ],
    weather: { location: 'Punjab, India', temperature: '29°C', condition: 'Sunny' },
  },
  {
    cropType: 'Bell Pepper (Capsicum annuum)',
    condition: 'Bacterial Spot (Xanthomonas campestris pv. vesicatoria)',
    confidence: 0.91,
    recommendation: "The small, water-soaked spots that turn dark and irregular are typical of Bacterial Spot. This disease is difficult to control once established. Prevention is key. Use certified disease-free seeds and transplants. Apply copper-based bactericides as a preventive measure, especially before periods of rain. Remove infected plants to reduce spread. Avoid working in the fields when plants are wet. Rotate with non-host crops.",
    recommendedMedicines: [
      { name: 'Copper Hydroxide Bactericide', url: '#', price: 25.50 },
    ],
    relatedVideos: [
      { title: 'Preventing Bacterial Spot on Peppers', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/pepper-spot/400/225' },
    ],
     weather: { location: 'Punjab, India', temperature: '31°C', condition: 'Humid' },
  },
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Healthy',
    confidence: 0.98,
    recommendation: "The plant appears to be in excellent health with no visible signs of disease or pest infestation. The foliage is vibrant and well-formed. To maintain this condition, ensure consistent watering, monitor regularly for early signs of pests, and continue with a balanced fertilization program. Consider applying a layer of mulch to retain soil moisture and suppress weeds. Great job!",
    recommendedMedicines: [],
    relatedVideos: [
      { title: 'Tips for Healthy Tomato Plants', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-tomato/400/225' },
    ],
    weather: { location: 'Punjab, India', temperature: '30°C', condition: 'Sunny' },
  }
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
    // Simulate AI analysis by picking a random result
    const randomIndex = Math.floor(Math.random() * MOCK_PREDICTIONS.length);
    const aiResult = MOCK_PREDICTIONS[randomIndex];

    const enhancedResult: Prediction = {
      ...aiResult,
      timestamp: Date.now(),
      imageUrl: imageUri, // Use the actual uploaded image
      userId: userId,
    };

    return enhancedResult;

  } catch (e: any) {
    console.error("Simulated analysis failed:", e);
    return { error: 'An unknown error occurred during analysis.' };
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
