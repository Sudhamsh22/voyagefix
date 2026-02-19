import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// This is a placeholder for your Firebase configuration.
// In a real application, you should move this to a separate file and use environment variables.
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
  
  // Basic check to see if config is just placeholder
  if (firebaseConfig.apiKey.startsWith("REPLACE_WITH")) {
    console.warn("Firebase config is using placeholder values. Please update your configuration in src/firebase/index.ts to connect to Firebase.");
    return null;
  }

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const auth = getAuth(app);
  const firestore = getFirestore(app);

  return { app, auth, firestore };
}

export { initializeFirebase };

export * from './provider';
export * from './auth/use-user';
