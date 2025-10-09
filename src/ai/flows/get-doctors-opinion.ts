'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - getDoctorsOpinion - A function that handles the plant diagnosis process.
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
  cropType: z.string().describe('The identified crop type, including its scientific name, e.g., "Tomato (Solanum lycopersicum)".'),
  condition: z
    .string()
    .describe(
      'The identified disease or health status, including its scientific name, e.g., "Late Blight (Phytophthora infestans)" or "Healthy".'
    ),
  confidence: z
    .number()
    .describe(
      'The confidence level of the prediction, from 0.0 to 1.0.'
    ),
  recommendation: z
    .string()
    .describe(
      "A detailed expert opinion. Start with \"Doctor's Opinion:\". Describe the disease symptoms, severity, and provide clear, actionable steps for management, including sanitation, cultural practices, and specific fungicide/pesticide recommendations."
    ),
});
export type GetDoctorsOpinionOutput = z.infer<
  typeof GetDoctorsOpinionOutputSchema
>;

export async function getDoctorsOpinion(
  input: GetDoctorsOpinionInput
): Promise<GetDoctorsOpinionOutput> {
  // This is a no-op function to prevent build errors, but it is not used.
  // The actual logic is now in the simulated AI in `src/lib/actions.ts`.
  return {
    cropType: '',
    condition: '',
    confidence: 0,
    recommendation: '',
  };
}
