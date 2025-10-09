'use server';
/**
 * @fileOverview A plant problem diagnosis AI agent.
 *
 * - diagnosePlant - A function that handles the plant diagnosis process.
 * - DiagnosePlantInput - The input type for the diagnosePlant function.
 * - DiagnosePlantOutput - The return type for the diagnosePlant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DiagnosePlantInput = z.infer<typeof DiagnosePlantInputSchema>;

const DiagnosePlantOutputSchema = z.object({
  cropType: z.string().describe('The type of crop (e.g., Tomato, Corn).'),
  condition: z
    .string()
    .describe(
      'The diagnosed condition of the crop (e.g., Healthy, Blight, Pest-attacked).'
    ),
  diseaseCommonName: z
    .string()
    .optional()
    .describe('The common name of the identified disease, if any.'),
  diseaseBiologicalName: z
    .string()
    .optional()
    .describe('The biological (Latin) name of the identified disease, if any.'),
  confidence: z
    .number()
    .describe('A confidence score between 0 and 1 for the prediction.'),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(
  input: DiagnosePlantInput
): Promise<DiagnosePlantOutput> {
  return diagnosePlantFlow(input);
}

const searchWebForDisease = ai.defineTool(
  {
    name: 'searchWebForDisease',
    description:
      'Searches agricultural and scientific websites for information on a crop disease to find its biological/Latin name.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The search query, which should be the crop and common disease name (e.g., "Tomato Late Blight").'
        ),
    }),
    outputSchema: z.object({
      biologicalName: z.string().optional(),
    }),
  },
  async input => {
    console.log(`Simulating web search for: ${input.query}`);
    // In a real app, this would perform a web search. Here we mock it.
    if (input.query.toLowerCase().includes('late blight')) {
      return {biologicalName: 'Phytophthora infestans'};
    }
    if (input.query.toLowerCase().includes('leaf spot')) {
      return {biologicalName: 'Cercospora beticola'};
    }
    return {biologicalName: undefined};
  }
);

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  tools: [searchWebForDisease],
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert botanist. Analyze the provided image of a plant.

1.  Identify the plant's crop type and its health condition.
    - cropType: The common name of the plant (e.g., Tomato, Corn, Rose).
    - condition: The general health status (e.g., Healthy, Late Blight, Aphid Infestation, Powdery Mildew).
2.  If you identify a disease, use the searchWebForDisease tool to find its biological/Latin name.
    - Set 'diseaseCommonName' to the common name of the disease.
    - Set 'diseaseBiologicalName' to the result from the tool.
    - If the plant is 'Healthy' or the condition is not a specific disease, do not use the tool and leave the disease fields blank.
3.  Provide your confidence in this diagnosis, from 0.0 to 1.0.

Analyze this image: {{media url=photoDataUri}}`,
});

const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
