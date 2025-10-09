'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';

// High-quality mock prediction data
const mockPredictions: Omit<Prediction, 'timestamp' | 'imageUrl' | 'userId'>[] = [
  {
    cropType: 'Tomato (Solanum lycopersicum)',
    condition: 'Late Blight (Phytophthora infestans)',
    recommendation: "Doctor's Opinion: The image shows classic symptoms of Late Blight, a highly destructive fungal disease caused by Phytophthora infestans. Key indicators include large, dark, water-soaked lesions on leaves and stems, often with a white moldy growth on the underside in humid conditions. This disease can spread rapidly and lead to total crop loss if not managed aggressively.\n\nActionable Steps:\n1.  **Sanitation:** Immediately remove and destroy all infected plant parts. Do not compost them.\n2.  **Improve Airflow:** Prune lower leaves and ensure plants are spaced adequately to reduce humidity around the foliage.\n3.  **Fungicide Application:** A proactive fungicide program is critical. Apply a preventative spray of a copper-based fungicide or a systemic product like Mancozeb or Chlorothalonil. Alternate between different fungicide groups to prevent resistance. Follow label instructions precisely.\n4.  **Watering Practices:** Avoid overhead watering. Use drip irrigation or water at the base of the plant to keep leaves dry.",
    confidence: 0.92,
    recommendedMedicines: [{ name: 'Mancozeb Fungicide', url: '#', price: 28.50 }],
    relatedVideos: [{ title: 'Managing Tomato Late Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/tomato-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '28°C', condition: 'Humid' },
  },
  {
    cropType: 'Corn (Zea mays)',
    condition: 'Northern Corn Leaf Blight (Exserohilum turcicum)',
    recommendation: "Doctor's Opinion: The analysis indicates the presence of Northern Corn Leaf Blight (NCLB), characterized by long, elliptical, grayish-green or tan lesions on the leaves. These lesions can merge, leading to significant loss of photosynthetic area, which can impact yield, especially if infection occurs before silking.\n\nActionable Steps:\n1.  **Resistant Hybrids:** For future plantings, select corn hybrids with genetic resistance to NCLB, which is the most effective management strategy.\n2.  **Fungicide Timing:** If the disease is present on one-third of the leaves and the crop is two weeks before or after tasseling, a foliar fungicide application is warranted. Products containing Azoxystrobin or Pyraclostrobin are effective.\n3.  **Crop Rotation & Tillage:** Rotate with non-host crops like soybeans or alfalfa. Tillage to bury infected crop residue can help reduce the fungal inoculum for the next season.",
    confidence: 0.88,
    recommendedMedicines: [{ name: 'Azoxystrobin 250 SC', url: '#', price: 45.00 }],
    relatedVideos: [{ title: 'Identifying Northern Corn Leaf Blight', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/corn-blight/400/225' }],
    weather: { location: 'Punjab, India', temperature: '32°C', condition: 'Sunny' },
  },
  {
    cropType: 'Potato (Solanum tuberosum)',
    condition: 'Healthy',
    recommendation: "Doctor's Opinion: The plant appears to be in excellent health. The leaves are vibrant green, well-formed, and show no visible signs of stress, disease, or pest infestation. The overall structure is robust.\n\nActionable Steps:\n1.  **Maintain Monitoring:** Continue regular scouting for early signs of common potato issues like aphids, potato beetles, or early/late blight.\n2.  **Consistent Practices:** Maintain your current schedule of watering, fertilization, and hilling. Consistency is key to preventing stress.\n3.  **Preventative Measures:** Consider a light, preventative application of neem oil as a natural repellent for pests, and ensure good air circulation to discourage fungal growth.",
    confidence: 0.98,
    recommendedMedicines: [],
    relatedVideos: [{ title: 'Best Practices for Potato Farming', videoUrl: '#', thumbnailUrl: 'https://picsum.photos/seed/healthy-potato/400/225' }],
     weather: { location: 'Punjab, India', temperature: '30°C', condition: 'Partly Cloudy' },
  },
  {
    cropType: 'Wheat (Triticum aestivum)',
    condition: 'Powdery Mildew (Blumeria graminis)',
    recommendation: "Doctor's Opinion: The image displays a classic case of Powdery Mildew, identified by the white, talc-like fungal growth on the leaf surfaces. This disease inhibits photosynthesis and can lead to reduced grain fill and lower yields if it becomes severe, particularly on the upper leaves like the flag leaf.\n\nActionable Steps:\n1.  **Fungicide Application:** If the mildew is present on upper leaves during the flag leaf or heading stages, an application of a triazole fungicide (e.g., Propiconazole, Tebuconazole) or a strobilurin fungicide is recommended.\n2.  **Variety Selection:** In the future, choose wheat varieties with better genetic resistance to powdery mildew.\n3.  **Cultural Practices:** Avoid excessive nitrogen application, as this can promote lush, susceptible growth. If possible, wider row spacing can improve air circulation and reduce disease pressure.",
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
