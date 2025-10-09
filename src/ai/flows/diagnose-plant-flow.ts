
'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  cropType: z.string().describe('The identified name of the crop (e.g., Tomato, Rice).'),
  condition: z
    .string()
    .describe(
      'The identified condition of the plant. This should be the common disease name followed by the biological name in parentheses, e.g., "Late Blight (Phytophthora infestans)". If healthy, this should be "Healthy".'
    ),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(
  input: DiagnosePlantInput
): Promise<DiagnosePlantOutput & { confidence: number }> {
  const result = await diagnosePlantFlow(input);
  return { ...result, confidence: 0.95 }; // Add default confidence
}

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async ({ photoDataUri }) => {
    const llmResponse = await ai.generate({
      prompt: `You are a world-class agronomist. Your task is to identify the crop and any disease from the provided image.
      
Identify the crop in the image (e.g., Rice, Tomato).
Identify the common name of any disease you see (e.g., Brown Spot, Late Blight). If the plant is healthy, state "Healthy".

Your final output for the condition must be formatted as "Common Name (Biological Name)" if a disease is found. For example, "Late Blight (Phytophthora infestans)".

Photo: {{media url=photoDataUri}}`,
      model: 'gemini-1.5-pro-latest',
      output: {
        schema: DiagnosePlantOutputSchema,
      },
    });

    return llmResponse.output()!;
  }
);
