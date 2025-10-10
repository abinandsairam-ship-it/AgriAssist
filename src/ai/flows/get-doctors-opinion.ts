'use server';

/**
 * @fileOverview Analyzes a crop image to identify the crop, detect disease, and provide a detailed recommendation.
 *
 * - getDoctorsOpinion - A function that handles the crop analysis process.
 * - GetDoctorsOpinionInput - The input type for the getDoctorsOpinion function.
 * - GetDoctorsOpinionOutput - The return type for the getDoctorsOpinion function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GetDoctorsOpinionInputSchema = z.object({
  imageUri: z
    .string()
    .describe(
      "A photo of the crop, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GetDoctorsOpinionInput = z.infer<
  typeof GetDoctorsOpinionInputSchema
>;

const GetDoctorsOpinionOutputSchema = z.object({
  cropType: z.string().describe('The common name and scientific name of the crop (e.g., "Tomato (Solanum lycopersicum)")'),
  condition: z.string().describe('The common name and scientific name of the disease, or "Healthy" if no disease is detected.'),
  confidence: z.number().describe('The prediction confidence level of the AI model (0-1).'),
  recommendation: z
    .string()
    .describe(
      "A detailed doctor's opinion and recommendation for managing the crop's condition. If healthy, provide tips for maintaining health."
    ),
});

export type GetDoctorsOpinionOutput = z.infer<
  typeof GetDoctorsOpinionOutputSchema
>;

export async function getDoctorsOpinion(
  input: GetDoctorsOpinionInput
): Promise<GetDoctorsOpinionOutput> {
  return getDoctorsOpinionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getDoctorsOpinionPrompt',
  input: { schema: GetDoctorsOpinionInputSchema },
  output: { schema: GetDoctorsOpinionOutputSchema },
  prompt: `You are an expert agronomist and plant pathologist.
  Analyze the provided image of a crop.
  Your task is to:
  1. Accurately identify the crop, providing its common and scientific name.
  2. Identify the primary visible disease, providing its common and scientific name. If the plant is healthy, state "Healthy".
  3. Provide a confidence score (0 to 1) for your analysis.
  4. Write a detailed "Doctor's Opinion" that explains the findings, describes the disease symptoms (if any), and provides a comprehensive set of recommendations for treatment or prevention. The recommendation should be actionable and easy for a farmer to understand.

  Image to analyze: {{media url=imageUri}}

  Return your response ONLY as a valid JSON object that conforms to the output schema.
  `,
});

const getDoctorsOpinionFlow = ai.defineFlow(
  {
    name: 'getDoctorsOpinionFlow',
    inputSchema: GetDoctorsOpinionInputSchema,
    outputSchema: GetDoctorsOpinionOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-1.5-flash-latest',
      prompt: `You are an expert agronomist and plant pathologist.
      Analyze the provided image of a crop.
      Your task is to:
      1. Accurately identify the crop, providing its common and scientific name.
      2. Identify the primary visible disease, providing its common and scientific name. If the plant is healthy, state "Healthy".
      3. Provide a confidence score (0 to 1) for your analysis.
      4. Write a detailed "Doctor's Opinion" that explains the findings, describes the disease symptoms (if any), and provides a comprehensive set of recommendations for treatment or prevention. The recommendation should be actionable and easy for a farmer to understand.
    
      Image to analyze:
      {{media url="${input.imageUri}"}}
    
      Return your response ONLY as a valid JSON object with the following keys: "cropType", "condition", "confidence", "recommendation".`,
      output: {
        format: 'json',
        schema: GetDoctorsOpinionOutputSchema,
      },
      config: {
        temperature: 0.2,
      },
    });

    const output = llmResponse.output();

    if (!output) {
      throw new Error('The AI model did not return a valid response.');
    }

    return output;
  }
);
