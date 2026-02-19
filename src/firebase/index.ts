'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
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

let emulatorsConnected = false;

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

  if (process.env.NODE_ENV === 'development' && !emulatorsConnected) {
    console.log("Connecting to Firebase emulators...");
    try {
      // Using 127.0.0.1 can be more reliable than 'localhost' in some containerized environments.
      // Default port for Auth Emulator is 9099.
      connectAuthEmulator(auth, 'http://127.0.0.1:9099');
      // Default port for Firestore Emulator is 8080.
      connectFirestoreEmulator(firestore, '127.0.0.1', 8080);
      emulatorsConnected = true;
      console.log("Successfully connected to Firebase emulators running on ports 9099 (Auth) and 8080 (Firestore).");
    } catch (e) {
        console.error("Error connecting to emulators. Please ensure they are running on the correct ports.", e);
    }
  }


  return { app, auth, firestore };
}

export { initializeFirebase };

export * from './provider';
export * from './auth/use-user';
