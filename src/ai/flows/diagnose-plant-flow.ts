
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
  description: z.string().describe("A simple, natural language description of the plant and its condition (e.g., 'A tomato plant with yellow leaves and brown spots.' or 'This is not a plant.')."),
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
      prompt: [
        {text: `Analyze the provided image and describe what you see in one simple sentence.
- If it is a plant, identify the plant and its most obvious health characteristic. For example: "A tomato plant with yellow leaves" or "A healthy-looking corn stalk".
- If you are unsure, say "An unknown plant with...".
- If the image does not contain a plant, say "This is not a plant."
- Do not use JSON, just return the single sentence.`},
        {media: { url: photoDataUri } },
      ],
      model: 'gemini-1.5-flash-latest',
      output: {
        schema: DiagnosePlantOutputSchema,
      },
    });

    return llmResponse.output()!;
  }
);
