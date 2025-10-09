
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
      'A detailed "Doctor\'s Opinion" report including disease description, severity, symptoms, treatment, prevention, and when to consult a specialist. Formatted in natural language for farmers.'
    ),
  recommendedMedicines: z
    .array(
      z.object({
        name: z.string().describe('The commercial name of the medicine.'),
        price: z
          .number()
          .describe('An approximate price in USD for the medicine.'),
        url: z.string().url().describe('A placeholder URL to a product page.'),
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
    .describe(
      'A list of 3 relevant video URLs for the given crop and condition. If the crop is healthy, provide videos about general maintenance.'
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
          text: `You are a world-renowned agronomist providing a "Doctor's Opinion" for a farmer.

Analyze the provided image and your expert knowledge to perform the following tasks and generate a comprehensive JSON report.

1.  **Identify Crop**: Determine the 'crop' type. If the image does not contain a plant, set 'crop' to "Not a plant" and return immediately.
2.  **Diagnose Condition**:
    - Determine the common 'condition' name (e.g., 'Late Blight', 'Healthy').
    - Determine the 'conditionScientific' name (e.g., 'Phytophthora infestans', or 'N/A' for healthy).
3.  **Write Recommendation (Doctor's Opinion)**: Write a detailed, easy-to-understand recommendation.
    - **Disease Description**: Briefly explain the condition.
    - **Severity & Symptoms**: Describe severity and key symptoms visible in the image.
    - **Treatment & Management**: Provide a clear, step-by-step treatment plan.
    - **Preventive Measures**: Suggest actionable steps for prevention.
    - **When to Consult an Expert**: Advise on when to call a local specialist.
    - If the condition is 'Healthy', provide advice on maintaining health.
4.  **Recommend Medicines**:
    - If not 'Healthy', suggest 2-3 specific commercial treatments. If 'Healthy', return an empty array.
5.  **Find Related Videos**:
    - Suggest 3 relevant video URLs for the given crop and condition. If healthy, find videos on general maintenance for that crop.
    - Use placeholder thumbnails from picsum.photos with unique seeds.

Generate the full JSON output based on the provided schemas. Return only the JSON object.`,
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
