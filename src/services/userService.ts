import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase.ts';

export type EducationLevel = 'Primaria' | 'Médio' | 'Superior';

export const EDUCATION_LEVELS: EducationLevel[] = ['Primaria', 'Médio', 'Superior'];

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  educationLevel: EducationLevel;
  createdAt?: any;
  updatedAt?: any;
}

/**
 * Retrieves a user profile by UID
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const path = `users/${uid}`;
  try {
    const userDocRef = doc(db, 'users', uid);
    const snap = await getDoc(userDocRef);
    if (!snap.exists()) {
      return null;
    }
    return snap.data() as UserProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

/**
 * Creates or updates user profile in Firestore
 */
export async function saveUserProfile(profile: {
  uid: string;
  name: string;
  email: string;
  educationLevel: EducationLevel;
}): Promise<void> {
  const path = `users/${profile.uid}`;
  try {
    const userDocRef = doc(db, 'users', profile.uid);
    const snap = await getDoc(userDocRef);

    const cleanData: UserProfile = {
      uid: profile.uid,
      name: profile.name.trim().slice(0, 100),
      email: profile.email.trim().toLowerCase().slice(0, 150),
      educationLevel: profile.educationLevel,
    };

    if (!snap.exists()) {
      await setDoc(userDocRef, {
        ...cleanData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } else {
      await updateDoc(userDocRef, {
        name: cleanData.name,
        educationLevel: cleanData.educationLevel,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to profile updates with defensive error handling
 */
export function subscribeToUserProfile(
  uid: string,
  onProfile: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void
) {
  const path = `users/${uid}`;
  const userDocRef = doc(db, 'users', uid);

  return onSnapshot(
    userDocRef,
    (snap) => {
      if (snap.exists()) {
        onProfile(snap.data() as UserProfile);
      } else {
        onProfile(null);
      }
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, path);
      } catch (e: any) {
        if (onError) onError(e);
      }
    }
  );
}
