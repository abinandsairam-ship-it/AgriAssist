
'use server';

/**
 * @fileOverview Recommends a treatment plan for a given crop and problem.
 *
 * - recommendTreatmentForCrop - A function that handles the treatment recommendation process.
 * - RecommendTreatmentForCropInput - The input type for the recommendTreatmentForCrop function.
 * - RecommendTreatmentForCropOutput - The return type for the recommendTreatmentForCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTreatmentForCropInputSchema = z.object({
  crop: z.string().describe('The name of the crop.'),
  problem: z.string().describe('The diagnosed problem (e.g., "Blight" or "Healthy").'),
});
export type RecommendTreatmentForCropInput = z.infer<typeof RecommendTreatmentForCropInputSchema>;

const RecommendTreatmentForCropOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A detailed, step-by-step treatment plan. If the crop is healthy, this should be a brief confirmation and general care tips.'),
});
export type RecommendTreatmentForCropOutput = z.infer<typeof RecommendTreatmentForCropOutputSchema>;

export async function recommendTreatmentForCrop(input: RecommendTreatmentForCropInput): Promise<RecommendTreatmentForCropOutput> {
  return recommendTreatmentForCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendTreatmentForCropPrompt',
  input: {schema: RecommendTreatmentForCropInputSchema},
  output: {schema: RecommendTreatmentForCropOutputSchema},
  prompt: `You are an expert agronomist providing a treatment plan for a farmer.

Crop: {{{crop}}}
Problem: {{{problem}}}

Based on the crop and the diagnosed problem, provide a clear, step-by-step recommendation.

If the problem is 'Healthy', provide a brief confirmation that the plant looks good and give one or two general tips for maintaining its health (e.g., watering, sunlight).

If there is a disease or pest, provide a detailed treatment plan including:
1.  Immediate actions to take (e.g., pruning, isolating).
2.  Organic and chemical treatment options, if applicable.
3.  Long-term prevention strategies.

Structure your response as a single, informative paragraph.
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
    return output!;
  }
);
