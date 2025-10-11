
'use server';
import type { Prediction } from '@/lib/definitions';
import { translatePredictionResults } from '@/ai/flows/translate-prediction-results';
import { identifyPestDiseaseFromImage, IdentifyPestDiseaseFromImageOutput } from '@/ai/flows/identify-pest-disease-flow';
import { createStreamableValue } from 'ai/rsc';

export async function getPrediction(
  prevState: any,
  formData: FormData
) {
  const imageUri = formData.get('imageUri') as string;
  const userId = formData.get('userId') as string | undefined;

  if (!imageUri) {
    throw new Error('Please upload or capture an image to analyze.');
  }

  const stream = createStreamableValue();

  (async () => {
    try {
      const resultStream = await identifyPestDiseaseFromImage({ photoDataUri: imageUri });
      for await (const delta of resultStream) {
        stream.update(delta);
      }
    } catch (e) {
      console.error("AI analysis failed:", e);
      // It's important to still use stream.error to propagate the error to the client hook
      stream.error({ error: 'AI analysis failed. Please try again.' });
    } finally {
      stream.done();
    }
  })()

  return stream.value;
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
