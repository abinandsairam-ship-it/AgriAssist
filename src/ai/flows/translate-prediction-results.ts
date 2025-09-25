'use server';

/**
 * @fileOverview This file defines a Genkit flow for translating prediction results into different languages.
 *
 * The flow takes prediction results and a target language as input and returns the translated results.
 * It uses the ai.definePrompt to generate the translated text based on the input and language.
 *
 * @fileOverview TranslatePredictionResultsInput - The input type for the translatePredictionResults function.
 * @fileOverview TranslatePredictionResultsOutput - The return type for the translatePredictionResults function.
 * @fileOverview translatePredictionResults - A function that handles the translation of prediction results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslatePredictionResultsInputSchema = z.object({
  text: z.string().describe('The prediction results text to translate.'),
  language: z.string().describe('The target language for translation (e.g., English, Hindi).'),
});
export type TranslatePredictionResultsInput = z.infer<
  typeof TranslatePredictionResultsInputSchema
>;

const TranslatePredictionResultsOutputSchema = z.object({
  translatedText: z.string().describe('The translated prediction results.'),
});

export type TranslatePredictionResultsOutput = z.infer<
  typeof TranslatePredictionResultsOutputSchema
>;

export async function translatePredictionResults(
  input: TranslatePredictionResultsInput
): Promise<TranslatePredictionResultsOutput> {
  return translatePredictionResultsFlow(input);
}

const translatePredictionResultsPrompt = ai.definePrompt({
  name: 'translatePredictionResultsPrompt',
  input: {schema: TranslatePredictionResultsInputSchema},
  output: {schema: TranslatePredictionResultsOutputSchema},
  prompt: `Translate the following text into {{{language}}}:

{{{text}}}`,
});

const translatePredictionResultsFlow = ai.defineFlow(
  {
    name: 'translatePredictionResultsFlow',
    inputSchema: TranslatePredictionResultsInputSchema,
    outputSchema: TranslatePredictionResultsOutputSchema,
  },
  async input => {
    const {output} = await translatePredictionResultsPrompt(input);
    return output!;
  }
);
