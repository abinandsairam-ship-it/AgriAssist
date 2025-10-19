
'use server';
/**
 * @fileOverview Recommends suitable crops based on soil analysis and location data.
 *
 * - recommendCrop - A function that handles the crop recommendation process.
 * - RecommendCropInput - The input type for the recommendCrop function.
 * - RecommendCropOutput - The return type for the recommendCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCropInputSchema = z.object({
  soilImageUri: z.string().describe("A photo of the soil, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
  soilType: z.string().describe('The type of soil (e.g., Loamy, Sandy, Clay).'),
  soilPh: z.number().describe('The pH level of the soil.'),
});
export type RecommendCropInput = z.infer<typeof RecommendCropInputSchema>;

const RecommendCropOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A detailed recommendation of suitable crops for the given soil conditions, including reasoning.'),
});
export type RecommendCropOutput = z.infer<typeof RecommendCropOutputSchema>;

export async function recommendCrop(input: RecommendCropInput): Promise<RecommendCropOutput> {
  return recommendCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCropPrompt',
  input: {schema: RecommendCropInputSchema},
  output: {schema: RecommendCropOutputSchema},
  prompt: `You are an expert agronomist. Analyze the provided soil data to recommend the most suitable crops.

Soil Analysis:
- Soil Type: {{{soilType}}}
- Soil pH: {{{soilPh}}}
- Soil Image: {{media url=soilImageUri}}

Based on this information, provide a detailed recommendation for at least 3 crops that would thrive in these conditions. Explain your reasoning for each crop. The recommendation should be formatted as a single string.`,
});

const recommendCropFlow = ai.defineFlow(
  {
    name: 'recommendCropFlow',
    inputSchema: RecommendCropInputSchema,
    outputSchema: RecommendCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
