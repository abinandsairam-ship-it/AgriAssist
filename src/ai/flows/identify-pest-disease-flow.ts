
'use server';
/**
 * @fileOverview An AI agent that identifies the crop and any potential pests or diseases from an image.
 *
 * - identifyPestDiseaseFromImage - A function that handles the identification process.
 * - IdentifyPestDiseaseFromImageInput - The input type for the identifyPestDiseaseFromImage function.
 * - IdentifyPestDiseaseFromImageOutput - The return type for the identifyPestDiseaseFromImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {createStreamableValue} from 'ai/rsc';

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
  recommendation: z.string().describe('A detailed recommendation for treating the identified issue. If the plant is healthy, provide general care tips.'),
});
export type IdentifyPestDiseaseFromImageOutput = z.infer<typeof IdentifyPestDiseaseFromImageOutputSchema>;

export async function identifyPestDiseaseFromImage(
  input: IdentifyPestDiseaseFromImageInput
) {
  const stream = createStreamableValue();

  (async () => {
    const {stream: resultStream} = await identifyPestDiseaseFromImagePrompt.stream(input);
    for await (const chunk of resultStream) {
       stream.update(chunk);
    }
    stream.done();
  })();
  
  return stream.value;
}

const identifyPestDiseaseFromImagePrompt = ai.definePrompt({
  name: 'identifyPestDiseaseFromImagePrompt',
  input: {schema: IdentifyPestDiseaseFromImageInputSchema},
  output: {schema: IdentifyPestDiseaseFromImageOutputSchema},
  model: 'googleai/gemini-1.5-flash-preview',
  prompt: `You are an expert in botany and agricultural diagnostics.

  Analyze the image to identify the crop and any potential pests or diseases affecting it.

  If the crop appears healthy, set the pestOrDisease field to "Healthy".
  
  Provide a detailed recommendation for treating the identified issue. If the plant is healthy, provide general care tips.

  Photo: {{media url=photoDataUri}}
  
  Output a well-formed JSON object.`,
});

const identifyPestDiseaseFromImageFlow = ai.defineFlow(
  {
    name: 'identifyPestDiseaseFromImageFlow',
    inputSchema: IdentifyPestDiseaseFromImageInputSchema,
    outputSchema: IdentifyPestDiseaseFromImageOutputSchema,
    stream: true,
  },
  async (input) => {
    const { stream } = await ai.generate({
      model: 'googleai/gemini-1.5-flash-preview',
      prompt: `You are an expert in botany and agricultural diagnostics.

      Analyze the image to identify the crop and any potential pests or diseases affecting it.
    
      If the crop appears healthy, set the pestOrDisease field to "Healthy".
      
      Provide a detailed recommendation for treating the identified issue. If the plant is healthy, provide general care tips.
    
      Photo: {{media url=${input.photoDataUri}}}
      
      Output a well-formed JSON object.`,
      output: {
        schema: IdentifyPestDiseaseFromImageOutputSchema
      },
      stream: true,
    });
    return stream;
  }
);
