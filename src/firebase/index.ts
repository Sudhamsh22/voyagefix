'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This is a placeholder for your Firebase configuration.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

function initializeFirebase() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  // For emulators, we can use a dummy project ID, but we'll keep this check
  // to encourage good practice for production.
  if (firebaseConfig.apiKey.startsWith("REPLACE_WITH")) {
    console.warn("Firebase config is using placeholder values. For production, please update your configuration in src/firebase/index.ts.");
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export { initializeFirebase };

export * from './provider';
export * from './auth/use-user';
