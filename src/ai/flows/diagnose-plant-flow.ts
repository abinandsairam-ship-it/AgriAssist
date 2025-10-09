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
  crop: z.string().describe('The identified name of the crop.'),
  disease: z
    .string()
    .describe(
      'The identified disease in the format "Common Name (Biological Name)".'
    ),
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
1.  First, identify the crop in the image (e.g., Rice, Tomato, etc.).
2.  Second, identify the primary disease affecting the crop.
3.  Third, use the 'searchWebForDisease' tool to find the biological name and confirm the common name.
4.  You MUST respond in the following strict format:
    - The 'crop' field should contain only the crop name.
    - The 'disease' field should contain the disease formatted as "Common Name (Biological Name)".
    - If the plant is healthy, set the disease field to "Healthy".
5.  If you cannot identify the crop or disease with high confidence, set the 'crop' to "Unknown" and the 'disease' field to "Unknown disease. Please provide a clearer image or additional information."

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

    // This is a workaround to transform the AI output to fit the old schema
    // expected by the rest of the application (actions, UI).
    // The AI is now instructed to return the new, stricter format.
    // We adapt it here to avoid breaking the client-side components.

    if (!output) {
      throw new Error('AI failed to produce an output.');
    }

    let condition = output.disease;
    let diseaseCommonName: string | undefined;
    let diseaseBiologicalName: string | undefined;

    if (
      output.disease.includes('(') &&
      output.disease.includes(')') &&
      output.disease !==
        'Unknown disease. Please provide a clearer image or additional information.'
    ) {
      const parts = output.disease.replace(')', '').split('(');
      condition = parts[0].trim();
      diseaseCommonName = parts[0].trim();
      diseaseBiologicalName = parts[1].trim();
    }

    return {
      ...output,
      condition: condition, // The UI expects 'condition'
      cropType: output.crop, // The UI expects 'cropType'
      diseaseCommonName: diseaseCommonName,
      diseaseBiologicalName: diseaseBiologicalName,
    } as any; // Cast to any to satisfy the old action return type.
  }
);
