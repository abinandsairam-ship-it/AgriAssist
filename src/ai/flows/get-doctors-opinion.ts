'use server';
/**
 * @fileOverview Provides an AI-powered "doctor's opinion" for crop analysis.
 *
 * - getDoctorsOpinion - A function to get analysis and recommendations.
 * - GetDoctorsOpinionInput - The input type for the getDoctorsOpinion function.
 * - GetDoctorsOpinionOutput - The return type for the getDoctorsOpinion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetDoctorsOpinionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GetDoctorsOpinionInput = z.infer<
  typeof GetDoctorsOpinionInputSchema
>;

const GetDoctorsOpinionOutputSchema = z.object({
  crop: z
    .string()
    .describe(
      "The type of crop identified. If the image is not a plant, return 'Not a plant'."
    ),
  condition: z
    .string()
    .describe(
      "The common name of the diagnosed condition (e.g., 'Healthy', 'Late Blight (Phytophthora infestans)')."
    ),
  recommendation: z
    .string()
    .describe(
      'A detailed "Doctor\'s Opinion" report including a brief disease description, symptoms, a treatment plan, and prevention advice. Formatted in natural language for farmers.'
    ),
  confidence: z.number().min(0).max(1).describe('The confidence level of the diagnosis, from 0 to 1.'),
});
export type GetDoctorsOpinionOutput = z.infer<
  typeof GetDoctorsOpinionOutputSchema
>;

export async function getDoctorsOpinion(
  input: GetDoctorsOpinionInput
): Promise<GetDoctorsOpinionOutput> {
  return getDoctorsOpinionFlow(input);
}

const getDoctorsOpinionFlow = ai.defineFlow(
  {
    name: 'getDoctorsOpinionFlow',
    inputSchema: GetDoctorsOpinionInputSchema,
    outputSchema: GetDoctorsOpinionOutputSchema,
  },
  async ({ photoDataUri }) => {
    const llmResponse = await ai.generate({
      prompt: [
        {
          text: `You are a world-renowned agronomist. Analyze the provided image and generate a JSON report with your "Doctor's Opinion".

Your tasks:
1.  **Identify Crop**: Determine the 'crop' type. If it's not a plant, set 'crop' to "Not a plant" and all other fields to "N/A" with 0 confidence.
2.  **Diagnose Condition**: Determine the common 'condition' name and include the scientific name in parentheses, like 'Late Blight (Phytophthora infestans)'. If healthy, the condition should be 'Healthy'.
3.  **Assess Confidence**: Provide a 'confidence' score (0.0 to 1.0) for your diagnosis.
4.  **Write Recommendation**: Write a detailed, easy-to-understand 'recommendation'. Include a disease description, severity, symptoms visible, a treatment plan, and prevention measures.

Generate only the JSON object based on the provided schemas. Do not include any other text or formatting.`,
        },
        { media: { url: photoDataUri } },
      ],
      model: 'googleai/gemini-1.5-flash-latest',
      output: {
        schema: GetDoctorsOpinionOutputSchema,
      },
    });

    const output = llmResponse.output;
    if (!output) {
      throw new Error("AI failed to generate a valid analysis.");
    }
    return output;
  }
);
