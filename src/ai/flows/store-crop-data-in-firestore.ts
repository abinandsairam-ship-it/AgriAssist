'use server';
/**
 * @fileOverview Stores crop image data and prediction details in Firestore.
 *
 * - storeCropData - A function to store crop data in Firestore.
 * - StoreCropDataInput - The input type for the storeCropData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {getFirestore} from 'firebase-admin/firestore';
import {initializeApp, cert, getApps} from 'firebase-admin/app';
import type { RecommendedMedicine, RelatedVideo, Weather } from '@/lib/definitions';

const StoreCropDataInputSchema = z.object({
  userId: z.string().optional().describe('The ID of the user uploading the image.'),
  timestamp: z.number().describe('The timestamp of when the image was uploaded.'),
  cropType: z.string().describe('The predicted crop type.'),
  condition: z.string().describe('The predicted health condition of the crop.'),
  imageUrl: z.string().describe('The URL of the uploaded crop image.'),
  confidence: z.number().optional().describe('Prediction confidence level'),
  recommendation: z.string().optional(),
  recommendedMedicines: z.array(z.any()).optional(),
  relatedVideos: z.array(z.any()).optional(),
  weather: z.any().optional(),
});
export type StoreCropDataInput = z.infer<typeof StoreCropDataInputSchema>;

// No output schema needed as this flow doesn't return anything, it just stores data.

// Initialize Firebase Admin SDK if not already initialized
function initializeFirebaseAdmin() {
  if (!getApps().length) {
    try {
      // Attempt to load the service account key from environment variable
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
      );

      initializeApp({
        credential: cert(serviceAccount),
      });
      console.log('Firebase Admin SDK initialized successfully.');
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      throw new Error(
        'Failed to initialize Firebase Admin SDK. Check service account key.'
      );
    }
  }
}

export async function storeCropData(input: StoreCropDataInput): Promise<void> {
  await storeCropDataFlow(input);
}

const storeCropDataFlow = ai.defineFlow(
  {
    name: 'storeCropDataFlow',
    inputSchema: StoreCropDataInputSchema,
  },
  async input => {
    initializeFirebaseAdmin();
    const db = getFirestore();
    await db.collection('crop_data').add({
      ...input,
    });
  }
);
