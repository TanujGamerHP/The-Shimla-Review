import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle escaped newline characters from .env
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET?.replace('.firebasestorage.app', '.appspot.com') || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const adminAuth = getAuth();
export const adminStorage = getStorage();
