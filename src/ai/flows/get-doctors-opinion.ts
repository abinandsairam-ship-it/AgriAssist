
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
      "The common name of the diagnosed condition (e.g., 'Healthy', 'Late Blight')."
    ),
  conditionScientific: z
    .string()
    .describe(
      "The scientific (biological) name of the condition (e.g., 'Phytophthora infestans', or 'N/A' if healthy)."
    ),
  recommendation: z
    .string()
    .describe(
      'A detailed "Doctor\'s Opinion" report including disease description, severity, symptoms, treatment, and prevention advice. Formatted in natural language for farmers.'
    ),
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
1.  **Identify Crop**: Determine the 'crop' type. If it's not a plant, set 'crop' to "Not a plant" and nothing else.
2.  **Diagnose Condition**: Determine the common 'condition' name (e.g., 'Late Blight', 'Healthy') and the 'conditionScientific' name (e.g., 'Phytophthora infestans', or 'N/A' if healthy).
3.  **Write Recommendation**: Write a detailed, easy-to-understand 'recommendation'. Include a disease description, severity, symptoms visible, a treatment plan, and prevention measures.

Generate only the JSON object based on the provided schemas.`,
        },
        { media: { url: photoDataUri } },
      ],
      model: 'gemini-1.5-pro-latest',
      output: {
        schema: GetDoctorsOpinionOutputSchema,
      },
    });

    return llmResponse.output()!;
  }
);
