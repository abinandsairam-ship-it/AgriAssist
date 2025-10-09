
'use server';
/**
 * @fileOverview Provides an AI-powered "doctor's opinion" for crop analysis.
 *
 * - getDoctorsOpinion - A function to get analysis, recommendations, and related media.
 * - GetDoctorsOpinionInput - The input type for the getDoctorsOpinion function.
 * - GetDoctorsOpinionOutput - The return type for the getDoctorsOpinion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GetDoctorsOpinionInputSchema = z.object({
  crop: z.string().describe('The type of crop (e.g., Tomato, Corn).'),
  condition: z
    .string()
    .describe(
      'The common name of the diagnosed condition (e.g., Healthy, Late Blight).'
    ),
  conditionScientific: z
    .string()
    .describe(
      'The scientific name of the condition (e.g., Phytophthora infestans).'
    ),
});
export type GetDoctorsOpinionInput = z.infer<
  typeof GetDoctorsOpinionInputSchema
>;

const GetDoctorsOpinionOutputSchema = z.object({
  recommendation: z
    .string()
    .describe(
      'A detailed "Doctor\'s Opinion" report including disease description, severity, symptoms, treatment, prevention, and when to consult a specialist. Formatted in natural language for farmers.'
    ),
  recommendedMedicines: z
    .array(
      z.object({
        name: z.string().describe('The commercial name of the medicine.'),
        price: z
          .number()
          .describe('An approximate price in USD for the medicine.'),
        url: z
          .string()
          .url()
          .describe('A placeholder URL to a product page.'),
      })
    )
    .describe(
      'A list of 2-3 recommended medicines or treatments. If the crop is healthy, return an empty array.'
    ),
  relatedVideos: z
    .array(
      z.object({
        title: z.string().describe('A concise, relevant title for the video.'),
        thumbnailUrl: z
          .string()
          .url()
          .describe(
            'A placeholder thumbnail URL from picsum.photos. Use a unique seed for each.'
          ),
        videoUrl: z
          .string()
          .url()
          .describe('A placeholder URL to a video.'),
      })
    )
    .describe('A list of 3 relevant video URLs for the given crop and condition.'),
});
export type GetDoctorsOpinionOutput = z.infer<
  typeof GetDoctorsOpinionOutputSchema
>;

export async function getDoctorsOpinion(
  input: GetDoctorsOpinionInput
): Promise<GetDoctorsOpinionOutput> {
  return getDoctorsOpinionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDoctorsOpinionPrompt',
  input: { schema: GetDoctorsOpinionInputSchema },
  output: { schema: GetDoctorsOpinionOutputSchema },
  prompt: `You are a world-renowned agronomist writing a "Doctor's Opinion" for a farmer.

Crop: {{{crop}}}
Condition: {{{condition}}} ({{{conditionScientific}}})

Based on this, generate a comprehensive report.

1.  **Recommendation (Doctor's Opinion)**: Write a detailed, easy-to-understand report.
    - **Disease Description**: Briefly explain what {{{condition}}} is.
    - **Severity & Symptoms**: Describe the severity and key symptoms the farmer should watch for.
    - **Treatment & Management**: Provide a clear, step-by-step treatment plan.
    - **Preventive Measures**: Suggest actionable steps to prevent this issue in the future.
    - **When to Consult an Expert**: Advise on when it's time to call a local plant doctor or agricultural specialist.
    - If the condition is 'Healthy', provide advice on maintaining health and maximizing yield.

2.  **Recommended Medicines**:
    - If not 'Healthy', suggest 2-3 specific, commonly available treatments (fungicides, pesticides, organic alternatives).
    - If 'Healthy', return an empty array.

3.  **Related Videos**:
    - Suggest 3 relevant YouTube videos for the crop and condition.
    - Use placeholder thumbnails from picsum.photos with unique seeds.

Generate the full JSON output based on the provided schemas.
`,
});

const getDoctorsOpinionFlow = ai.defineFlow(
  {
    name: 'getDoctorsOpinionFlow',
    inputSchema: GetDoctorsOpinionInputSchema,
    outputSchema: GetDoctorsOpinionOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
