import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

import { getFirebaseAuth } from '@/app/lib/firebase-client';

export async function getFirebaseIdTokenWithGooglePopup(): Promise<string> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  const result = await signInWithPopup(auth, provider);
  return result.user.getIdToken();
}

export async function signOutFirebaseClient(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}
