
'use server';

/**
 * @fileOverview Recommends suitable crops based on soil analysis.
 *
 * - recommendCrop - A function that handles the crop recommendation process.
 * - RecommendCropInput - The input type for the recommendCrop function.
 * - RecommendCropOutput - The return type for the recommendCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCropInputSchema = z.object({
  soilImageUri: z
    .string()
    .describe(
      "A photo of the soil, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  soilType: z.string().describe('The type of soil (e.g., Loamy, Sandy, Clay).'),
  soilPh: z.number().describe('The pH level of the soil.'),
});
export type RecommendCropInput = z.infer<typeof RecommendCropInputSchema>;

const RecommendCropOutputSchema = z.object({
  recommendation: z
    .string()
    .describe('A detailed recommendation of suitable crops for the given soil conditions, including reasons.'),
});
export type RecommendCropOutput = z.infer<typeof RecommendCropOutputSchema>;

export async function recommendCrop(input: RecommendCropInput): Promise<RecommendCropOutput> {
  return recommendCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCropPrompt',
  input: {schema: RecommendCropInputSchema},
  output: {schema: RecommendCropOutputSchema},
  prompt: `You are an expert agronomist. Analyze the provided soil information and image to recommend the most suitable crops.

Soil Information:
- Type: {{{soilType}}}
- pH: {{{soilPh}}}

Soil Image Analysis:
- Analyze the color, texture, and other visual cues from the image to refine your assessment.
- Photo: {{media url=soilImageUri}}

Based on a comprehensive analysis of the soil type, pH, and visual characteristics from the image, provide a detailed recommendation for the top 3-5 suitable crops. For each crop, briefly explain why it is a good fit for these conditions. Structure your response as a single, informative paragraph.
`,
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
