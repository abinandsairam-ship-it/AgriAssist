'use server';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { identifyPestDiseaseFromImage, IdentifyPestDiseaseFromImageOutput } from '@/ai/flows/identify-pest-disease-from-image';

export async function getPrediction(
  imageUri: string
): Promise<IdentifyPestDiseaseFromImageOutput> {
  if (!imageUri) {
    throw new Error('Please upload or capture an image to analyze.');
  }
  
  const analysisResult = await identifyPestDiseaseFromImage({ photoDataUri: imageUri });

  return analysisResult;
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
