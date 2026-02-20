'use client';
import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import { initializeApp, getApps, getApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';

import { firebaseConfig, isFirebaseConfigured } from './config';

interface FirebaseContextValue {
  app: FirebaseApp;
  db: Firestore;
}

const FirebaseContext = createContext<FirebaseContextValue | null>(null);

function initializeFirebase() {
  if (!isFirebaseConfigured()) {
    if (process.env.NODE_ENV !== 'production') {
        console.warn("Firebase is not configured. Please add your Firebase project configuration to the .env file to enable trip saving and viewing.");
    }
    return null;
  }

  const apps = getApps();
  const app = apps.length > 0 ? getApp() : initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  return { app, db };
}

export function FirebaseProvider({ children }: { children: ReactNode }) {
  const firebase = useMemo(initializeFirebase, []);

  if (!firebase) {
    // Firebase is not configured, just render children without the provider
    // Components will handle the null context gracefully.
    return <>{children}</>;
  }

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirestore = () => {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useFirestore must be used within a FirebaseProvider');
  }
  if (context === null) {
    // This happens if Firebase is not configured.
    // We return null and let the component handle it.
    return null;
  }
  return context.db;
};
