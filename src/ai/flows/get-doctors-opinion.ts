
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

// Mock search tool for demonstration purposes.
const webSearch = ai.defineTool(
  {
    name: 'webSearch',
    description: 'Performs a web search for agricultural information.',
    inputSchema: z.object({
      query: z.string().describe('The search query, e.g., "Tomato Late Blight symptoms"'),
    }),
    outputSchema: z.object({
      results: z.array(
        z.object({
          title: z.string(),
          url: z.string().url(),
          snippet: z.string(),
        })
      ),
    }),
  },
  async ({ query }) => {
    // In a real application, this would call a search API (e.g., Google Search API).
    // For this demo, we return mock data based on a common query.
    if (query.toLowerCase().includes('late blight')) {
      return {
        results: [
          {
            title: 'Late Blight on Tomatoes | Cornell University',
            url: 'https://www.gardening.cornell.edu/factsheets/vegetables/tomatolateblight.html',
            snippet: 'Late blight is a destructive disease of tomatoes and potatoes... Symptoms include blighted leaves with dark, water-soaked spots, often with a pale green halo.',
          },
          {
            title: 'Managing Late Blight in Organic Gardens - SARE',
            url: 'https://www.sare.org/resources/managing-late-blight-in-organic-gardens/',
            snippet: 'Prevention is key. Ensure good air circulation, avoid overhead watering, and apply copper-based fungicides as a preventative measure.',
          },
        ],
      };
    }
    return { results: [] };
  }
);

const GetDoctorsOpinionInputSchema = z.object({
  imageDescription: z.string().describe('A natural language description of a plant and its condition, derived from an image.'),
});
export type GetDoctorsOpinionInput = z.infer<
  typeof GetDoctorsOpinionInputSchema
>;

const GetDoctorsOpinionOutputSchema = z.object({
  crop: z.string().describe("The type of crop identified, or 'Unknown' if not identifiable."),
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
  tools: [webSearch],
  input: { schema: GetDoctorsOpinionInputSchema },
  output: { schema: GetDoctorsOpinionOutputSchema },
  prompt: `You are a world-renowned agronomist providing a "Doctor's Opinion" for a farmer.

You have been given the following description of a plant from an image:
"{{{imageDescription}}}"

Based on this description, perform the following tasks and generate a comprehensive JSON report.

1.  **Formulate a Hypothesis**: First, make a preliminary identification of the crop and its condition based on your expert knowledge.

2.  **Verify with Web Search**: Use the 'webSearch' tool to cross-reference your hypothesis. Search for the suspected condition to confirm symptoms, treatments, and scientific names from reliable agricultural websites.

3.  **Synthesize and Report**: Combine your expertise with the information from the web search to generate the final, validated JSON report.

    - **Identify Crop**: Determine the 'crop' type. If unclear, set to "Unknown".
    - **Diagnose Condition**:
        - Determine the common 'condition' name (e.g., 'Late Blight', 'Healthy').
        - Determine the 'conditionScientific' name (e.g., 'Phytophthora infestans', or 'N/A' for healthy).

    - **Write Recommendation (Doctor's Opinion)**: Write a detailed, easy-to-understand recommendation.
        - **Disease Description**: Briefly explain the condition, using info from the search to validate.
        - **Severity & Symptoms**: Describe severity and key symptoms.
        - **Treatment & Management**: Provide a clear, step-by-step treatment plan.
        - **Preventive Measures**: Suggest actionable steps for prevention.
        - **When to Consult an Expert**: Advise on when to call a local specialist.
        - If the condition is 'Healthy', provide advice on maintaining health.

    - **Recommend Medicines**:
        - If not 'Healthy', suggest 2-3 specific treatments. If 'Healthy', return an empty array.

    - **Find Related Videos**:
        - Suggest 3 relevant video URLs for the given crop and condition.
        - Use placeholder thumbnails from picsum.photos with unique seeds.

Generate the full JSON output based on the provided schemas. Return only the JSON object.
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
