
'use server';

/**
 * @fileOverview Recommends a treatment plan for a crop based on its problem.
 *
 * - recommendTreatmentForCrop - A function that handles the treatment recommendation process.
 * - RecommendTreatmentInput - The input type for the recommendTreatmentForCrop function.
 * - RecommendTreatmentOutput - The return type for the recommendTreatmentForCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTreatmentInputSchema = z.object({
  crop: z.string().describe('The type of crop (e.g., Tomato, Corn).'),
  problem: z.string().describe('The identified disease or pest (e.g., Early Blight, Aphids).'),
});
export type RecommendTreatmentInput = z.infer<typeof RecommendTreatmentInputSchema>;

const RecommendTreatmentOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A detailed, step-by-step treatment plan for the given crop and problem.'),
});
export type RecommendTreatmentOutput = z.infer<typeof RecommendTreatmentOutputSchema>;

export async function recommendTreatmentForCrop(input: RecommendTreatmentInput): Promise<RecommendTreatmentOutput> {
  return recommendTreatmentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTreatmentPrompt',
  input: {schema: RecommendTreatmentInputSchema},
  output: {schema: RecommendTreatmentOutputSchema},
  prompt: `You are an expert agronomist providing a treatment plan.

Crop: {{{crop}}}
Problem: {{{problem}}}

Based on the crop and the identified problem, provide a detailed, step-by-step treatment plan. If the problem is 'Healthy', provide general advice for keeping the crop healthy. Structure your response as a clear, actionable guide. Include both organic and chemical treatment options if applicable.
`,
});

const recommendTreatmentFlow = ai.defineFlow(
  {
    name: 'recommendTreatmentFlow',
    inputSchema: RecommendTreatmentInputSchema,
    outputSchema: RecommendTreatmentOutputSchema,
  },
  async input => {
    if (input.problem.toLowerCase() === 'healthy') {
        return {
            recommendation: `The ${input.crop} plant appears to be healthy. To maintain its health, ensure consistent watering, proper sunlight exposure, and balanced soil nutrients. Regularly inspect for any signs of pests or diseases to catch issues early.`
        };
    }
    const {output} = await prompt(input);
    return output!;
  }
);
