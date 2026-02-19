'use client';

import { FirebaseProvider } from './provider';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  return (
    <FirebaseProvider>
      <FirebaseErrorListener />
      {children}
    </FirebaseProvider>
  );
}
