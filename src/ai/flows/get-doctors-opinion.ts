'use server';
/**
 * @fileOverview A Genkit flow for analyzing a crop image and providing a "Doctor's Opinion".
 *
 * - getDoctorsOpinion - The function that executes the analysis.
 * - DoctorsOpinionInput - The input type for the function.
 * - DoctorsOpinionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// Define the schema for the flow's input
const DoctorsOpinionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DoctorsOpinionInput = z.infer<typeof DoctorsOpinionInputSchema>;

// Define the schema for the flow's output
const DoctorsOpinionOutputSchema = z.object({
  cropType: z.string().describe('The identified crop type, including its scientific name. Example: "Tomato (Solanum lycopersicum)"'),
  condition: z.string().describe('The primary visible disease or health status, including its scientific name if applicable. Example: "Late Blight (Phytophthora infestans)" or "Healthy"'),
  confidence: z.number().min(0).max(1).describe('The confidence level of the prediction (0-1).'),
  recommendation: z.string().describe("A detailed doctor's opinion and recommendation for the farmer."),
});
export type DoctorsOpinionOutput = z.infer<typeof DoctorsOpinionOutputSchema>;


export async function getDoctorsOpinion(input: DoctorsOpinionInput): Promise<DoctorsOpinionOutput> {
  return getDoctorsOpinionFlow(input);
}


// Define the main Genkit flow
const getDoctorsOpinionFlow = ai.defineFlow(
  {
    name: 'getDoctorsOpinionFlow',
    inputSchema: DoctorsOpinionInputSchema,
    outputSchema: DoctorsOpinionOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: [
        {
          text: `You are a world-renowned agronomist. Your task is to analyze the provided image of a plant and return a JSON object with your expert analysis.

          Your JSON response must contain the following fields:
          - "cropType": A string identifying the crop and its scientific name (e.g., "Tomato (Solanum lycopersicum)").
          - "condition": A string identifying the primary visible disease (with its scientific name) or "Healthy" if no disease is present (e.g., "Late Blight (Phytophthora infestans)").
          - "confidence": A number between 0 and 1 representing your confidence in the diagnosis.
          - "recommendation": A detailed paragraph providing a "Doctor's Opinion". Explain the symptoms, the cause of the disease (if any), and provide actionable steps for the farmer to manage or treat the issue. If the plant is healthy, provide tips to maintain its health.

          Analyze the image and provide your diagnosis.`,
        },
        { media: { url: input.photoDataUri } },
      ],
      output: {
        format: 'json',
        schema: DoctorsOpinionOutputSchema,
      },
    });

    const output = llmResponse.output();
    if (!output) {
      throw new Error('The AI model did not return valid JSON output.');
    }
    return output;
  }
);
