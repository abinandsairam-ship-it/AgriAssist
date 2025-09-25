'use server';
/**
 * @fileOverview Provides an AI-powered "doctor's opinion" for crop analysis.
 *
 * - getDoctorsOpinion - A function to get analysis, recommendations, and related media.
 * - GetDoctorsOpinionInput - The input type for the getDoctorsOpinion function.
 * - GetDoctorsOpinionOutput - The return type for the getDoctorsOpinion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetDoctorsOpinionInputSchema = z.object({
  crop: z.string().describe('The type of crop (e.g., Tomato, Corn).'),
  condition: z
    .string()
    .describe(
      'The diagnosed condition of the crop (e.g., Healthy, Blight, Pest-attacked).'
    ),
});
export type GetDoctorsOpinionInput = z.infer<
  typeof GetDoctorsOpinionInputSchema
>;

const GetDoctorsOpinionOutputSchema = z.object({
  recommendation: z
    .string()
    .describe(
      'A detailed recommendation and plan to address the crop condition. Provide a step-by-step guide. This should be 2-3 paragraphs long.'
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
          .describe('A placeholder URL to a product page, e.g., https://example.com/product/fungicide-x.'),
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
          .describe('A placeholder URL to a video, e.g., https://youtube.com/watch?v=...'),
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
  prompt: `You are a world-renowned agronomist and plant pathologist.
A farmer has provided the following information about their crop:
- Crop: {{{crop}}}
- Condition: {{{condition}}}

Your task is to provide a comprehensive "Doctor's Opinion".

1.  **Recommendation**: Write a detailed, actionable recommendation.
    - If the plant is not healthy, explain the condition in simple terms, its likely causes, and a step-by-step treatment plan.
    - If the plant is healthy, provide advice on how to maintain its health and maximize yield.
    - The tone should be expert, yet easy for a non-specialist to understand.

2.  **Recommended Medicines**:
    - If the condition is not 'Healthy', suggest 2-3 specific, commonly available medicines or organic treatments. Provide a fictional but realistic price for each.
    - If the condition is 'Healthy', return an empty array for this field.

3.  **Related Videos**:
    - Suggest 3 relevant YouTube videos that could help the farmer. The topics should be directly related to the crop and its condition. For example, if it's "Tomato Blight", videos could be on "How to Treat Tomato Blight" or "Preventing Fungus in Tomatoes".
    - For each video, provide a realistic title.
    - Use placeholder thumbnail URLs from picsum.photos, ensuring each URL has a unique seed (e.g., https://picsum.photos/seed/video1/400/225).

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
