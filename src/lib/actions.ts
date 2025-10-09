'use server';
import type { Prediction } from '@/lib/definitions';
import { getDoctorsOpinion } from '@/ai/flows/get-doctors-opinion';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<Prediction | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image to analyze.' };
  }

  // --- High-Quality AI Simulator ---
  const mockPredictions: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
    {
      cropType: 'Tomato (Solanum lycopersicum)',
      condition: 'Late Blight (Phytophthora infestans)',
      confidence: 0.92,
      recommendation:
        "Doctor's Opinion: The plant is showing classic symptoms of Late Blight, including large, dark, water-soaked lesions on leaves and stems. This is a serious fungal disease that can spread rapidly in cool, moist conditions. Immediate action is required. Management involves removing and destroying infected plant parts, improving air circulation by pruning, and applying a targeted fungicide containing copper or chlorothalonil. Avoid overhead watering.",
      recommendedMedicines: [],
      relatedVideos: [],
    },
    {
      cropType: 'Tomato (Solanum lycopersicum)',
      condition: 'Bacterial Spot (Xanthomonas campestris pv. vesicatoria)',
      confidence: 0.88,
      recommendation:
        "Doctor's Opinion: The small, dark, angular spots on the leaves are characteristic of Bacterial Spot. This disease thrives in warm, wet weather. To manage, remove infected leaves, avoid working with plants when they are wet, and apply a copper-based bactericide as a preventive measure. Ensure proper spacing for good airflow.",
      recommendedMedicines: [],
      relatedVideos: [],
    },
    {
      cropType: 'Corn (Zea mays)',
      condition: 'Common Rust (Puccinia sorghi)',
      confidence: 0.95,
      recommendation:
        "Doctor's Opinion: The oval-shaped, reddish-brown pustules on the leaves are a clear sign of Common Rust. While it can reduce yield, it's often manageable. Management includes planting resistant hybrids, ensuring good soil fertility, and if the infection is severe before silking, applying a foliar fungicide. Scout fields regularly to monitor disease progression.",
      recommendedMedicines: [],
      relatedVideos: [],
    },
    {
      cropType: 'Potato (Solanum tuberosum)',
      condition: 'Early Blight (Alternaria solani)',
      confidence: 0.91,
      recommendation:
        "Doctor's Opinion: The 'target spot' lesions on lower leaves are indicative of Early Blight. This fungal disease is common in humid weather. Management practices include crop rotation, removing infected debris at the end of the season, and applying protective fungicides like mancozeb or azoxystrobin before the disease becomes widespread.",
      recommendedMedicines: [],
      relatedVideos: [],
    },
    {
      cropType: 'Bell Pepper (Capsicum annuum)',
      condition: 'Healthy',
      confidence: 0.98,
      recommendation:
        "Doctor's Opinion: The plant appears to be in excellent health. The leaves are green and vibrant, and there are no visible signs of disease, pests, or nutrient deficiencies. Continue with your current watering and fertilization schedule. Monitor regularly for any changes.",
      recommendedMedicines: [],
      relatedVideos: [],
    },
     {
      cropType: 'Grape (Vitis vinifera)',
      condition: 'Powdery Mildew (Erysiphe necator)',
      confidence: 0.94,
      recommendation:
        "Doctor's Opinion: The white, powdery patches on leaves and fruit are classic symptoms of Powdery Mildew. This is a very common grape disease. Management includes improving air circulation through canopy management, and timely application of fungicides. Sulfur-based and biological fungicides can be effective, especially when applied preventively.",
      recommendedMedicines: [],
      relatedVideos: [],
    },
  ];

  try {
    // Select a random prediction from the mock list
    const randomIndex = Math.floor(Math.random() * mockPredictions.length);
    const randomPrediction = mockPredictions[randomIndex];

    if (!randomPrediction) {
      throw new Error('AI simulator failed to generate a result.');
    }

    const predictionResult: Prediction = {
      ...randomPrediction,
      timestamp: Date.now(),
      imageUrl: imageUri,
      userId: userId,
    };

    return predictionResult;

  } catch (e: any) {
    console.error('AI simulation failed:', e);
    return {
      error: `AI analysis failed: ${e.message || 'An unknown error occurred.'}`,
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
