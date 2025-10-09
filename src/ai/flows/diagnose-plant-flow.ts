
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
  cropType: z.string().describe('The identified name of the crop (e.g., Tomato, Rice).'),
  condition: z
    .string()
    .describe(
      'The identified condition of the plant. This should be the common disease name followed by the biological name in parentheses, e.g., "Late Blight (Phytophthora infestans)". If healthy, this should be "Healthy".'
    ),
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
      source: z
        .string()
        .url()
        .optional()
        .describe('The URL of the source of the information.'),
    }),
  },
  async ({ query }) => {
    // In a real app, this would use a search engine API.
    // For this demo, we'll return a hardcoded result.
    console.log(`Searching web for: ${query}`);
    if (query.toLowerCase().includes('brown spot')) {
      return {
        biologicalName: 'Bipolaris oryzae',
        commonName: 'Brown Spot',
        source: 'https://en.wikipedia.org/wiki/Bipolaris_oryzae',
      };
    }
     if (query.toLowerCase().includes('late blight')) {
      return {
        biologicalName: 'Phytophthora infestans',
        commonName: 'Late Blight',
        source: 'https://en.wikipedia.org/wiki/Phytophthora_infestans',
      };
    }
    return {
      biologicalName: 'N/A',
    };
  }
);


const diagnosePlantFlow = ai.defineFlow(
  {
    name: 'diagnosePlantFlow',
    inputSchema: DiagnosePlantInputSchema,
    outputSchema: DiagnosePlantOutputSchema,
  },
  async ({ photoDataUri }) => {
    const llmResponse = await ai.generate({
      prompt: `You are a world-class agronomist. Your task is to identify the crop and any disease from the provided image.
      
Follow these steps:
1.  First, identify the crop in the image (e.g., Rice, Tomato).
2.  Second, identify the common name of any disease you see (e.g., Brown Spot, Late Blight). If the plant is healthy, state "Healthy".
3.  Third, use the searchWebForDisease tool to find the biological name for the identified disease.
4.  Finally, construct the output. The 'condition' field MUST be formatted as "Common Name (Biological Name)".

Photo: {{media url=photoDataUri}}`,
      model: 'gemini-1.5-pro-latest',
      tools: [searchWebForDisease],
      output: {
        schema: DiagnosePlantOutputSchema,
      },
    });

    return llmResponse.output()!;
  }
);
