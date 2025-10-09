
'use server';
/**
 * @fileOverview A Genkit flow for recommending suitable crops based on soil analysis.
 *
 * This file defines a flow that takes a soil image, soil type, and pH level
 * as input. It uses a generative AI model to analyze this information and
 * provide a recommendation for the most suitable crops to plant.
 *
 * - RecommendCropInput - The input type for the recommendCrop function.
 * - RecommendCropOutput - The return type for the recommendCrop function.
 * - recommendCrop - The function that executes the crop recommendation flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for the flow's input
const RecommendCropInputSchema = z.object({
  soilImageUri: z
    .string()
    .describe(
      "A photo of the soil, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  soilType: z.string().describe('The type of the soil (e.g., Loamy, Sandy, Clay).'),
  soilPh: z.number().describe('The pH level of the soil (e.g., 6.5).'),
});
export type RecommendCropInput = z.infer<typeof RecommendCropInputSchema>;

// Define the schema for the flow's output
const RecommendCropOutputSchema = z.object({
  recommendation: z.string().describe('A detailed recommendation of suitable crops and justification.'),
});
export type RecommendCropOutput = z.infer<typeof RecommendCropOutputSchema>;

/**
 * Executes the crop recommendation flow.
 * @param input The input data for the flow, including soil image, type, and pH.
 * @returns A promise that resolves to the crop recommendation.
 */
export async function recommendCrop(
  input: RecommendCropInput
): Promise<RecommendCropOutput> {
  return recommendCropFlow(input);
}

// Define the Genkit prompt for the AI model
const recommendCropPrompt = ai.definePrompt({
  name: 'recommendCropPrompt',
  input: { schema: RecommendCropInputSchema },
  output: { schema: RecommendCropOutputSchema },
  prompt: `You are an expert agronomist. Analyze the provided soil image and data to recommend the most suitable crops.

  Analyze the following information:
  1. Soil Image: {{media url=soilImageUri}}
  2. Soil Type: {{{soilType}}}
  3. Soil pH: {{{soilPh}}}

  Based on your analysis, provide a detailed recommendation. Explain WHY these crops are suitable based on the given soil type, pH, and visual characteristics from the image. Suggest at least two or three crops.`,
});

// Define the main Genkit flow
const recommendCropFlow = ai.defineFlow(
  {
    name: 'recommendCropFlow',
    inputSchema: RecommendCropInputSchema,
    outputSchema: RecommendCropOutputSchema,
  },
  async (input) => {
    const { output } = await recommendCropPrompt(input);
    if (!output) {
      throw new Error('The AI model did not return a valid recommendation.');
    }
    return output;
  }
);
