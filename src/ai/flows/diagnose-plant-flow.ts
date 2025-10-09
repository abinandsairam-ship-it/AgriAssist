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
  cropType: z.string().describe('The identified name of the crop.'),
  condition: z
    .string()
    .describe(
      'The general condition of the plant (e.g., Healthy, Late Blight).'
    ),
  diseaseCommonName: z
    .string()
    .optional()
    .describe('The common name of the identified disease.'),
  diseaseBiologicalName: z
    .string()
    .optional()
    .describe('The biological (Latin) name of the identified disease.'),
});
export type DiagnosePlantOutput = z.infer<typeof DiagnosePlantOutputSchema>;

export async function diagnosePlant(
  input: DiagnosePlantInput
): Promise<DiagnosePlantOutput & { confidence: number }> {
  const result = await diagnosePlantFlow(input);
  return { ...result, confidence: 0.95 }; // Add default confidence
}


const searchWebForDisease = ai.defineTool(
  {
    name: 'searchWebForDisease',
    description:
      'Searches agricultural and scientific websites for information on a crop disease to find its biological/Latin name. Use this to verify your findings.',
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          'The search query, which should be the crop and common disease name (e.g., "Tomato Late Blight").'
        ),
    }),
    outputSchema: z.object({
      biologicalName: z
        .string()
        .optional()
        .describe('The biological (Latin) name of the disease.'),
      commonName: z
        .string()
        .optional()
        .describe('The common name of the disease.'),
    }),
  },
  async input => {
    console.log(`Simulating web search for: ${input.query}`);
    // In a real app, this would perform a web search. Here we mock it.
    if (input.query.toLowerCase().includes('late blight')) {
      return {
        biologicalName: 'Phytophthora infestans',
        commonName: 'Late Blight',
      };
    }
    if (input.query.toLowerCase().includes('leaf spot')) {
      return {
        biologicalName: 'Cercospora beticola',
        commonName: 'Leaf Spot',
      };
    }
     if (input.query.toLowerCase().includes('brown spot')) {
      return {
        biologicalName: 'Bipolaris oryzae',
        commonName: 'Brown Spot',
      };
    }
    return {biologicalName: undefined, commonName: input.query};
  }
);

const prompt = ai.definePrompt({
  name: 'diagnosePlantPrompt',
  tools: [searchWebForDisease],
  input: {schema: DiagnosePlantInputSchema},
  output: {schema: DiagnosePlantOutputSchema},
  prompt: `You are an expert agronomist. Your task is to identify the crop and any disease from the provided image.

Instructions:
1.  First, identify the crop in the image (e.g., Rice, Tomato, etc.). Set the 'cropType' field.
2.  Second, identify the primary disease affecting the crop. Set the 'condition' field to the common name of the disease.
3.  Third, you MUST use the 'searchWebForDisease' tool to find the biological name of the identified disease. For example, if you see Brown Spot on Rice, you must call the tool with the query "Rice Brown Spot".
4.  Set the 'diseaseCommonName' and 'diseaseBiologicalName' fields based on the tool's output.
5.  If the plant is healthy, set the 'condition' to "Healthy" and leave the disease name fields empty.
6.  If you cannot identify the crop or disease with high confidence, set the 'cropType' to "Unknown" and the 'condition' to "Unknown disease. Please provide a clearer image or additional information."

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

    if (!output) {
      throw new Error('AI failed to produce an output.');
    }

    return output;
  }
);
