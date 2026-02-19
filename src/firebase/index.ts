'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// This is a placeholder for your Firebase configuration.
const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_STORAGE_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

// A flag to ensure we only connect to emulators once.
let emulatorsConnected = false;

function initializeFirebase() {
  if (typeof window === 'undefined') {
    return null;
  }
  
  if (firebaseConfig.apiKey.startsWith("REPLACE_WITH")) {
    console.warn("Firebase config is using placeholder values. For production, please update your configuration in src/firebase/index.ts.");
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const firestore = getFirestore(app);

  if (!emulatorsConnected) {
    try {
        // Connect to Firestore emulator on port 8080
        connectFirestoreEmulator(firestore, 'localhost', 8080);
        console.log("Connecting to Firebase Emulators: Firestore (8080)");
        emulatorsConnected = true;
    } catch (e) {
        // Catch errors if emulators are already connected or not running.
        console.error("Error connecting to Firebase emulators: ", e);
    }
  }

  return { app, firestore };
}

export { initializeFirebase };

export * from './provider';
