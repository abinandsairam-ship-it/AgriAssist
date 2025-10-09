
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
  analysis: z.string().describe('The final analysis in the specified format.'),
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
      prompt: `Identify the disease and crop from the submitted image.
Respond strictly in the format:
"Disease: [Common Name] ([Biological Name])
Crop: [Crop Name]"

Example:
"Disease: Brown Spot (Bipolaris oryzae)
Crop: Rice"

Use this format ONLY. If uncertain or unclear, reply ONLY with:
"Unknown disease. Please provide clearer image or additional information."

Cross-check with multiple authoritative agricultural sources for accuracy before responding.
Photo: {{media url=photoDataUri}}`,
      model: 'gemini-1.5-pro-latest',
      output: {
        schema: z.object({
          analysis: z.string(),
        }),
      },
    });

    return llmResponse.output()!;
  }
);
