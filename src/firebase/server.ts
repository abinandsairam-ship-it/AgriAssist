import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

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
      throw new Error(
        'Failed to initialize Firebase Admin SDK. Check service account key.'
      );
    }
  }
}

export function initializeFirebase() {
  initializeFirebaseAdmin();
  return {
    firestore: getFirestore(),
    auth: getAuth(),
  };
}

// This is a placeholder for the client-side non-blocking update.
// On the server, we can perform the action directly.
export function addDocumentNonBlocking(colRef: any, data: any) {
  return colRef.add(data);
}
