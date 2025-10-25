'use server';
/**
 * @fileOverview An AI agent that identifies the crop and any potential pests or diseases from an image, and recommends a treatment plan.
 *
 * - identifyPestDiseaseFromImage - A function that handles the identification and recommendation process.
 * - IdentifyPestDiseaseFromImageInput - The input type for the identifyPestDiseaseFromImage function.
 * - IdentifyPestDiseaseFromImageOutput - The return type for the identifyPestDiseaseFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPestDiseaseFromImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyPestDiseaseFromImageInput = z.infer<typeof IdentifyPestDiseaseFromImageInputSchema>;

const IdentifyPestDiseaseFromImageOutputSchema = z.object({
  cropName: z.string().describe('The identified name of the crop in the image.'),
  pestOrDisease: z.string().describe('The identified pest or disease affecting the crop. If the crop is healthy, this should be "Healthy".'),
  confidence: z.number().describe('The confidence level of the identification (0-1).'),
  recommendation: z.string().describe('A detailed, step-by-step treatment plan. If the crop is healthy, this should be a brief confirmation and general care tips.'),
});
export type IdentifyPestDiseaseFromImageOutput = z.infer<typeof IdentifyPestDiseaseFromImageOutputSchema>;

export async function identifyPestDiseaseFromImage(
  input: IdentifyPestDiseaseFromImageInput
): Promise<IdentifyPestDiseaseFromImageOutput> {
  return identifyPestDiseaseFromImageFlow(input);
}

const identifyPestDiseaseFromImagePrompt = ai.definePrompt({
  name: 'identifyPestDiseaseFromImagePrompt',
  input: {schema: IdentifyPestDiseaseFromImageInputSchema},
  output: {schema: IdentifyPestDiseaseFromImageOutputSchema},
  prompt: `You are an expert in botany and agricultural diagnostics.

  1. Analyze the image to identify the crop and any potential pests or diseases affecting it.
  2. If the crop appears healthy, set the pestOrDisease field to "Healthy".
  3. Based on your diagnosis, provide a clear, step-by-step treatment recommendation in the 'recommendation' field.
     - If the problem is 'Healthy', provide a brief confirmation that the plant looks good and give one or two general tips for maintaining its health (e.g., watering, sunlight).
     - If there is a disease or pest, provide a detailed treatment plan including immediate actions, organic/chemical options, and long-term prevention strategies.

  Photo: {{media url=photoDataUri}}
  `,
});

const identifyPestDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'identifyPestDiseaseFromImageFlow',
    inputSchema: IdentifyPestDiseaseFromImageInputSchema,
    outputSchema: IdentifyPestDiseaseFromImageOutputSchema,
  },
  async input => {
    const {output} = await identifyPestDiseaseFromImagePrompt(input);
    return output!;
  }
);
