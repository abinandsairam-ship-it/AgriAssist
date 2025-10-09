
"use server";
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import type { Prediction } from '@/lib/definitions';

// Mock function to simulate diagnosePlant
async function mockDiagnosePlant(input: { photoDataUri: string }): Promise<{ cropType: string; condition: string }> {
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
  // A simple mock: return a fixed result.
  // A more advanced mock could have a few options and pick one randomly.
  return {
    cropType: 'Tomato',
    condition: 'Late Blight',
  };
}

// Mock function to simulate getDoctorsOpinion
async function mockGetDoctorsOpinion(input: { crop: string; condition: string }): Promise<any> {
  await new Promise(resolve => setTimeout(resolve, 400)); // Simulate network delay
  if (input.condition.toLowerCase() === 'healthy') {
    return {
      recommendation: `Your ${input.crop} plant looks healthy! Keep up the great work. Ensure consistent watering and monitor for any changes.`,
      recommendedMedicines: [],
      relatedVideos: [
        {
          title: `How to Keep Your ${input.crop} Plants Thriving`,
          thumbnailUrl: 'https://picsum.photos/seed/video4/400/225',
          videoUrl: 'https://youtube.com/watch?v=example',
        },
        {
          title: `Tips for Maximizing ${input.crop} Yield`,
          thumbnailUrl: 'https://picsum.photos/seed/video5/400/225',
          videoUrl: 'https://youtube.com/watch?v=example',
        },
        {
            title: `Organic Fertilizers for Healthy ${input.crop}s`,
            thumbnailUrl: 'https://picsum.photos/seed/video6/400/225',
            videoUrl: 'https://youtube.com/watch?v=example',
        }
      ],
    };
  }

  return {
    recommendation: `Your ${input.crop} plant appears to have ${input.condition}. This is a common fungal disease. It's important to remove affected leaves and ensure good air circulation. Consider applying a copper-based fungicide.`,
    recommendedMedicines: [
      {
        name: 'Copper Fungicide',
        price: 15.99,
        url: 'https://example.com/product/copper-fungicide',
      },
      {
        name: 'BioFungus Control',
        price: 22.5,
        url: 'https://example.com/product/bio-fungus-control',
      },
    ],
    relatedVideos: [
      {
        title: `How to Treat ${input.condition} in ${input.crop}s`,
        thumbnailUrl: 'https://picsum.photos/seed/video1/400/225',
        videoUrl: 'https://youtube.com/watch?v=example',
      },
      {
        title: `Preventing Fungal Diseases in Your Garden`,
        thumbnailUrl: 'https://picsum.photos/seed/video2/400/225',
        videoUrl: 'https://youtube.com/watch?v=example',
      },
      {
        title: `Identifying Common ${input.crop} Diseases`,
        thumbnailUrl: 'https://picsum.photos/seed/video3/400/225',
        videoUrl: 'https://youtube.com/watch?v=example',
      },
    ],
  };
}


export async function getPrediction(
  prevState: any,
  formData: FormData
): Promise<(Prediction & { newPrediction: boolean }) | { error: string }> {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    return { error: 'Please upload or capture an image.' };
  }
  
  const imageUrl = imageUri;

  let diagnosis;
  try {
    // Using the mock function for near-instant analysis
    diagnosis = await mockDiagnosePlant({ photoDataUri: imageUri });
  } catch (e) {
     console.error("Error diagnosing plant:", e);
     return { error: "Could not analyze the plant image. Please try again." };
  }

  const { cropType, condition } = diagnosis;
  
  if (cropType === 'Unknown' || condition.startsWith('Unable to determine')) {
    return { error: "Could not identify the crop from the image. Please try again with a clearer picture." };
  }

  const confidence = 0.95; // Default confidence
  const timestamp = Date.now();

  let doctorsOpinion;
  try {
    // Using the mock function for the doctor's opinion
    doctorsOpinion = await mockGetDoctorsOpinion({ crop: cropType, condition });
  } catch (e) {
    console.error('Error getting doctor\'s opinion:', e);
    // Fallback to a default message
    doctorsOpinion = {
      recommendation: "Could not retrieve AI doctor's opinion. Please try again.",
      recommendedMedicines: [],
      relatedVideos: [],
    };
  }

  const predictionResult: Prediction & { newPrediction: boolean } = {
    cropType,
    condition,
    confidence,
    imageUrl,
    timestamp,
    recommendation: doctorsOpinion.recommendation,
    recommendedMedicines: doctorsOpinion.recommendedMedicines,
    relatedVideos: doctorsOpinion.relatedVideos,
    weather: {
      location: 'Punjab, India',
      temperature: '32°C',
      condition: 'Sunny',
    },
    newPrediction: true,
    userId,
  };
  
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
