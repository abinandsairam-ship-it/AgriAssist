"use server";

import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';
import { initializeFirebase } from '@/firebase/server';
import type { HistoryItem } from './definitions';

export async function getPredictionHistory(): Promise<HistoryItem[]> {
  try {
    const { firestore } = initializeFirebase();
    const historyCollection = collection(firestore, 'crop_data');
    const q = query(
      historyCollection,
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    const snapshot = await getDocs(q);

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
