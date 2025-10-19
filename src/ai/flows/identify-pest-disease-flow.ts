'use server';
/**
 * @fileOverview An AI agent that identifies the crop and any potential pests or diseases from an image, and provides a recommendation.
 *
 * - identifyPestDiseaseFromImage - A function that handles the identification process.
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
  recommendation: z.string().describe('A detailed recommendation or "Doctor\'s Opinion" for treating the identified issue. If healthy, provide general care tips.'),
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
  prompt: `You are an expert in botany and agricultural diagnostics, acting as a "Plant Doctor".

  Your tasks are:
  1.  **Identify the Crop**: Analyze the image to accurately identify the plant or crop.
  2.  **Diagnose Condition**: Determine if the plant has a pest or disease. If the crop appears healthy, set the pestOrDisease field to "Healthy".
  3.  **Provide Recommendation**: Based on your diagnosis, provide a detailed recommendation (a "Doctor's Opinion").
      - If there is a disease or pest, explain the issue and suggest specific, actionable treatment steps (e.g., organic and chemical solutions, pruning techniques, watering adjustments).
      - If the plant is healthy, provide tips for maintaining its health (e.g., watering schedule, sunlight needs, fertilization).
  4.  **Set Confidence**: Provide a confidence score for your overall analysis.

  Photo: {{media url=photoDataUri}}`,
});

const identifyPestDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'identifyPestDiseaseFromImageFlow',
    inputSchema: IdentifyPestDiseaseFromImageInputSchema,
    outputSchema: IdentifyPestDiseaseFromImageOutputSchema,
  },
  async input => {
    const {output} = await identifyPestDiseaseFromImagePrompt.generate({
      input: input,
      model: 'googleai/gemini-1.5-flash-preview',
    });
    return output!;
  }
);
