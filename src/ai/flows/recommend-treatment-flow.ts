
'use server';

/**
 * @fileOverview Recommends treatments for a crop based on identified pest or disease, tailored to user preferences.
 *
 * - recommendTreatmentForCrop - A function that handles the treatment recommendation process.
 * - RecommendTreatmentForCropInput - The input type for the recommendTreatmentForCrop function.
 * - RecommendTreatmentForCropOutput - The return type for the recommendTreatmentForCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTreatmentForCropInputSchema = z.object({
  pestOrDisease: z.string().describe('The identified pest or disease affecting the crop.'),
  cropName: z.string().describe('The name of the affected crop.'),
  organicPreference: z
    .boolean()
    .describe(
      'Whether the user prefers organic treatment recommendations (true) or chemical treatment recommendations (false).'
    ),
});
export type RecommendTreatmentForCropInput = z.infer<typeof RecommendTreatmentForCropInputSchema>;

const RecommendTreatmentForCropOutputSchema = z.object({
  treatmentRecommendations: z
    .string()
    .describe('Recommended treatments and best practices for the identified pest or disease.'),
});
export type RecommendTreatmentForCropOutput = z.infer<typeof RecommendTreatmentForCropOutputSchema>;

export async function recommendTreatmentForCrop(input: RecommendTreatmentForCropInput): Promise<RecommendTreatmentForCropOutput> {
  return recommendTreatmentForCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTreatmentForCropPrompt',
  input: {schema: RecommendTreatmentForCropInputSchema},
  output: {schema: RecommendTreatmentForCropOutputSchema},
  model: 'googleai/gemini-1.5-flash-latest',
  prompt: `You are an expert agricultural advisor. A user has identified the following pest or disease affecting their crop:

Pest or Disease: {{{pestOrDisease}}}
Crop Name: {{{cropName}}}

The user has the following preference for treatment recommendations:

Organic Preference: {{#if organicPreference}}Organic treatments only{{else}}Chemical treatments preferred{{/if}}

Based on this information, provide detailed treatment recommendations and best practices to address the issue. Tailor the recommendations to the user's preference for organic or chemical solutions.
`,
});

const recommendTreatmentForCropFlow = ai.defineFlow(
  {
    name: 'recommendTreatmentForCropFlow',
    inputSchema: RecommendTreatmentForCropInputSchema,
    outputSchema: RecommendTreatmentForCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
        throw new Error("Failed to get treatment recommendations from the AI.");
    }
    return output;
  }
);
