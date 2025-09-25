"use server";

import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import type { HistoryItem } from './definitions';

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
      // Do not throw an error that crashes the app, just log it.
      // The calling function will handle the empty result.
    }
  }
}

export async function getPredictionHistory(): Promise<HistoryItem[]> {
  initializeFirebaseAdmin();
  
  if (!getApps().length) {
    return [];
  }

  const db = getFirestore();

  try {
    const snapshot = await db
      .collection('crop_data')
      .orderBy('timestamp', 'desc')
      .limit(20)
      .get();
    if (snapshot.empty) {
      return [];
    }
    const history: HistoryItem[] = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      history.push({
        id: doc.id,
        cropType: data.cropType || 'N/A',
        condition: data.condition || 'N/A',
        confidence: data.confidence || 0,
        imageUrl: data.imageUrl || '',
        timestamp: data.timestamp || 0,
        recommendation: data.recommendation || '',
        recommendedMedicines: data.recommendedMedicines || [],
        relatedVideos: data.relatedVideos || [],
        weather: data.weather || null,
      });
    });
    return history;
  } catch (error) {
    console.error('Error fetching prediction history:', error);
    return [];
  }
}
