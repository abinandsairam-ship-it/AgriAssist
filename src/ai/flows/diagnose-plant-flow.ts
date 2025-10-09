
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
  condition: z.string().describe("The common name of the diagnosed condition (e.g., 'Healthy', 'Late Blight')."),
  conditionScientific: z.string().describe("The scientific (biological) name of the condition (e.g., 'Phytophthora infestans', or 'N/A' if healthy)."),
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
      prompt: `You are an expert agronomist. Analyze the provided image.
- Identify the crop. If you cannot, set cropType to "Unknown".
- Identify the health condition.
- If a disease or pest is present, provide its common name for 'condition' and its scientific name for 'conditionScientific'. Example: condition: "Late Blight", conditionScientific: "Phytophthora infestans".
- If the plant is healthy, set 'condition' to "Healthy" and 'conditionScientific' to "N/A".
- If you are uncertain, provide the most likely possibility and explain the uncertainty in the condition field.

Return only the JSON object. Do not add any other text or explanations.`,
      model: 'gemini-1.5-pro-latest',
      output: {
        schema: DiagnosePlantOutputSchema,
      },
      context: [
        { media: { url: photoDataUri } }
      ]
    });

    return llmResponse.output()!;
  }
);
