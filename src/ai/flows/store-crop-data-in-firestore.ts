'use server';
/**
 * @fileOverview A flow to store crop data in Firestore.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
  collection,
  addDoc,
  getFirestore,
} from 'firebase/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';

// Define the input schema based on the Prediction type from lib/definitions
const StoreCropDataInputSchema = z.object({
  cropType: z.string(),
  condition: z.string(),
  confidence: z.number(),
  imageUrl: z.string(),
  timestamp: z.number(),
  recommendation: z.string(),
  recommendedMedicines: z.array(
    z.object({
      name: z.string(),
      price: z.number(),
      url: z.string().url(),
    })
  ),
  relatedVideos: z.array(
    z.object({
      title: z.string(),
      thumbnailUrl: z.string().url(),
      videoUrl: z.string().url(),
    })
  ),
  weather: z.object({
    location: z.string(),
    temperature: z.string(),
    condition: z.string(),
  }),
});

type StoreCropDataInput = z.infer<typeof StoreCropDataInputSchema>;

// Initialize Firebase Admin SDK
function initializeFirebaseAdmin() {
  if (!getApps().length) {
    try {
      const serviceAccount = JSON.parse(
        process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
      );
      initializeApp({
        credential: cert(serviceAccount),
      });
    } catch (error) {
      console.error('Error initializing Firebase Admin SDK:', error);
      // Throw an error if initialization fails
      throw new Error(
        'Failed to initialize Firebase Admin SDK. Service account key might be missing or invalid.'
      );
    }
  }
}

export const storeCropDataInFirestore = ai.defineFlow(
  {
    name: 'storeCropDataInFirestore',
    inputSchema: StoreCropDataInputSchema,
    outputSchema: z.object({ success: z.boolean(), docId: z.string().optional() }),
  },
  async (data) => {
    try {
      initializeFirebaseAdmin();
      const db = getAdminFirestore();
      const docRef = await db.collection('crop_data').add(data);
      console.log('Document written with ID: ', docRef.id);
      return { success: true, docId: docRef.id };
    } catch (e) {
      console.error('Error adding document: ', e);
      return { success: false };
    }
  }
);
