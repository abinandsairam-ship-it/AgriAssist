
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
  cropType: z.string().describe("The type of crop identified, or 'Unknown' if not identifiable."),
  condition: z.string().describe("The diagnosed condition of the crop (e.g., 'Healthy', 'Late Blight', 'Pest-attacked'), or a reason for uncertainty."),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(
  input: DiagnosePlantInput
): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}


const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async ({ photoDataUri }) => {
    const llmResponse = await ai.generate({
      prompt: `You are an expert agronomist. Identify the crop and its condition from the provided image.
- If you can identify the crop and it appears healthy, set condition to "Healthy".
- If you can identify a disease or pest, set the condition to the common name of that issue (e.g., "Late Blight", "Aphid Infestation").
- If you cannot identify the crop or disease, set cropType to "Unknown" and condition to "Unable to determine. Please provide a clearer image."

Do not add any extra explanations.

Photo: {{media url=photoDataUri}}`,
      model: 'gemini-1.5-pro-latest',
      output: {
        schema: DiagnosePlantOutputSchema,
      },
    });

    return llmResponse.output()!;
  }
);
