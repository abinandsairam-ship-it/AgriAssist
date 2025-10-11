
'use server';

/**
 * @fileOverview Identifies the pest or disease from an image of a crop and provides recommendations.
 *
 * - identifyPestDiseaseFromImage - A function that handles the pest/disease identification process.
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
export type IdentifyPestDiseaseFromImageInput = z.infer<
  typeof IdentifyPestDiseaseFromImageInputSchema
>;

const IdentifyPestDiseaseFromImageOutputSchema = z.object({
  cropName: z.string().describe('The name of the identified crop.'),
  pestOrDisease: z
    .string()
    .describe(
      "The identified pest or disease affecting the crop. If the crop is healthy, this should be 'Healthy'."
    ),
  confidence: z
    .number()
    .describe('A confidence score (0-1) for the prediction.'),
  recommendation: z
    .string()
    .describe(
      'A detailed recommendation for treating the identified issue. If healthy, provide general care tips.'
    ),
});
export type IdentifyPestDiseaseFromImageOutput = z.infer<
  typeof IdentifyPestDiseaseFromImageOutputSchema
>;

const identifyPestDiseaseFromImagePrompt = ai.definePrompt({
  name: 'identifyPestDiseaseFromImagePrompt',
  input: {schema: IdentifyPestDiseaseFromImageInputSchema},
  output: {schema: IdentifyPestDiseaseFromImageOutputSchema},
  prompt: `You are an expert agriculturalist. Analyze the provided image of a crop.

- Identify the crop name.
- Determine if the crop is healthy or identify the specific pest or disease affecting it.
- Provide a confidence score for your analysis.
- Offer a clear, actionable recommendation for treatment or general care.

Image: {{media url=photoDataUri}}`,
  config: {
    model: 'googleai/gemini-1.5-flash-preview',
  },
});

export const identifyPestDiseaseFromImage = ai.defineFlow(
  {
    name: 'identifyPestDiseaseFromImageFlow',
    inputSchema: IdentifyPestDiseaseFromImageInputSchema,
    outputSchema: IdentifyPestDiseaseFromImageOutputSchema,
    stream: true,
  },
  async input => {
    const stream = await ai.generate({
      prompt: identifyPestDiseaseFromImagePrompt,
      input: input,
      stream: true,
    });

    return stream.output();
  }
);
