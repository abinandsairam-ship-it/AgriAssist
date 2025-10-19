
'use server';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { identifyPestDiseaseFromImage, IdentifyPestDiseaseFromImageOutput } from '@/ai/flows/identify-pest-disease-flow';

export async function getPrediction(
  imageUri: string
): Promise<IdentifyPestDiseaseFromImageOutput> {
  if (!imageUri) {
    throw new Error('Please upload or capture an image to analyze.');
  }
  
  try {
    const result = await identifyPestDiseaseFromImage({ photoDataUri: imageUri });
    return result;
  } catch (e: any) {
    console.error("AI analysis failed:", e);
    throw new Error('AI analysis failed. Please try again.');
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
