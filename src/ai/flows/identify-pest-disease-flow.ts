'use server';
/**
 * @fileOverview An AI agent that identifies the crop, any potential pests or diseases from an image, and recommends a course of action.
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
  recommendation: z.string().describe('A detailed recommendation for treatment or best practices.'),
});
export type IdentifyPestDiseaseFromImageOutput = z.infer<typeof IdentifyPestDiseaseFromImageOutputSchema>;


export async function identifyPestDiseaseFromImage(
  input: IdentifyPestDiseaseFromImageInput
): Promise<any> {
  return identifyPestDiseaseFromImageFlow(input);
}


const identifyPestDiseaseFromImagePrompt = ai.definePrompt({
  name: 'identifyPestDiseaseFromImagePrompt',
  input: {schema: IdentifyPestDiseaseFromImageInputSchema},
  output: {schema: IdentifyPestDiseaseFromImageOutputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert in botany and agricultural diagnostics.

  Analyze the image to identify the crop and any potential pests or diseases affecting it.

  - If the crop appears healthy, set the pestOrDisease field to "Healthy" and provide a recommendation for maintaining good health.
  - If a pest or disease is detected, identify it and provide detailed treatment recommendations and best practices to address the issue.

  Photo: {{media url=photoDataUri}}
  `,
});

const identifyPestDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'identifyPestDiseaseFromImageFlow',
    inputSchema: IdentifyPestDiseaseFromImageInputSchema,
    outputSchema: IdentifyPestDiseaseFromImageOutputSchema,
    stream: true,
  },
  async input => {
    const {stream} = await ai.generate({
      model: 'googleai/gemini-1.5-flash',
      prompt: `You are an expert in botany and agricultural diagnostics.

      Analyze the image to identify the crop and any potential pests or diseases affecting it.

      - If the crop appears healthy, set the pestOrDisease field to "Healthy" and provide a recommendation for maintaining good health.
      - If a pest or disease is detected, identify it and provide detailed treatment recommendations and best practices to address the issue.

      Photo: {{media url=photoDataUri}}
      `,
      input: {
        photoDataUri: input.photoDataUri
      },
      output: {
        schema: IdentifyPestDiseaseFromImageOutputSchema
      },
      stream: true,
    });
    return stream;
  }
);
