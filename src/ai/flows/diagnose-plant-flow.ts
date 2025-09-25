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
    )
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., Tomato, Corn).'),
  condition: z
    .string()
    .describe(
      'The diagnosed condition of the crop (e.g., Healthy, Blight, Pest-attacked).'
    ),
  confidence: z.number().describe('A confidence score between 0 and 1 for the prediction.'),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(input: DiagnosePlantInput): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert botanist. Analyze the provided image of a plant.

Identify the plant's crop type and its health condition.
- cropType: The common name of the plant (e.g., Tomato, Corn, Rose).
- condition: The health status (e.g., Healthy, Late Blight, Aphid Infestation, Powdery Mildew).
- confidence: Your confidence in this diagnosis, from 0.0 to 1.0.

Analyze this image: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
