import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, googleAuthProvider, testFirestoreConnection } from '../lib/firebase.ts';
import {
  UserProfile,
  getUserProfile,
  saveUserProfile,
  subscribeToUserProfile,
  EducationLevel,
} from '../services/userService.ts';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthReady: boolean;
  needsProfileCompletion: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (data: {
    name: string;
    email: string;
    pass: string;
    educationLevel: EducationLevel;
  }) => Promise<void>;
  completeGoogleProfile: (data: {
    name: string;
    educationLevel: EducationLevel;
  }) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthReady, setIsAuthReady] = useState<boolean>(false);
  const [needsProfileCompletion, setNeedsProfileCompletion] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Test Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection().catch((err) =>
      console.warn('Initial Firestore ping note:', err)
    );
  }, []);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
            setNeedsProfileCompletion(false);
          } else {
            // User signed in but has not completed EduMind study profile yet
            setUserProfile(null);
            setNeedsProfileCompletion(true);
          }
        } catch (err: any) {
          console.error('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
        setNeedsProfileCompletion(false);
      }
      setLoading(false);
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to profile changes when user is active and has completed profile
  useEffect(() => {
    if (!currentUser || needsProfileCompletion) return;

    const unsub = subscribeToUserProfile(
      currentUser.uid,
      (profile) => {
        if (profile) {
          setUserProfile(profile);
          setNeedsProfileCompletion(false);
        }
      },
      (err) => console.error('Subscription error:', err)
    );

    return () => unsub();
  }, [currentUser, needsProfileCompletion]);

  // Translate Firebase errors into clear Portuguese messages
  const mapAuthError = (err: any): string => {
    const code = err?.code || '';
    if (code === 'auth/operation-not-allowed') {
      return 'O provedor de e-mail/senha não está ativado no Firebase Console. Utilize o botão "Continuar com Google" para acesso instantâneo!';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
      return 'E-mail ou senha incorretos. Verifique suas credenciais.';
    }
    if (code === 'auth/email-already-in-use') {
      return 'Este e-mail já está cadastrado. Faça login ou use o login com o Google.';
    }
    if (code === 'auth/weak-password') {
      return 'A senha precisa ter pelo menos 6 caracteres.';
    }
    if (code === 'auth/invalid-email') {
      return 'Formato de e-mail inválido. Digite um e-mail válido.';
    }
    if (code === 'auth/popup-closed-by-user') {
      return 'A janela de login do Google foi fechada antes da confirmação.';
    }
    if (code === 'auth/popup-blocked') {
      return 'O navegador bloqueou o pop-up de login. Por favor, permita pop-ups nesta página.';
    }
    if (code === 'auth/network-request-failed') {
      return 'Falha de conexão com a internet. Verifique sua rede e tente novamente.';
    }
    return err?.message || 'Ocorreu um erro durante a autenticação. Tente novamente.';
  };

  const loginWithGoogle = async () => {
    try {
      setError(null);
      setLoading(true);
      const cred = await signInWithPopup(auth, googleAuthProvider);
      const user = cred.user;

      // Check if profile exists in database
      const existingProfile = await getUserProfile(user.uid);
      if (existingProfile) {
        setUserProfile(existingProfile);
        setNeedsProfileCompletion(false);
      } else {
        // Brand new Google user - prompt to set up academic level
        setNeedsProfileCompletion(true);
      }
    } catch (err: any) {
      setError(mapAuthError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    try {
      setError(null);
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const profile = await getUserProfile(cred.user.uid);
      if (profile) {
        setUserProfile(profile);
        setNeedsProfileCompletion(false);
      } else {
        setNeedsProfileCompletion(true);
      }
    } catch (err: any) {
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const registerWithEmail = async (data: {
    name: string;
    email: string;
    pass: string;
    educationLevel: EducationLevel;
  }) => {
    try {
      setError(null);
      setLoading(true);
      const cred = await createUserWithEmailAndPassword(auth, data.email, data.pass);
      await updateProfile(cred.user, { displayName: data.name });

      // Save user profile immediately to database
      await saveUserProfile({
        uid: cred.user.uid,
        name: data.name,
        email: data.email,
        educationLevel: data.educationLevel,
      });

      const profile = await getUserProfile(cred.user.uid);
      setUserProfile(profile);
      setNeedsProfileCompletion(false);
    } catch (err: any) {
      const msg = mapAuthError(err);
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const completeGoogleProfile = async (data: {
    name: string;
    educationLevel: EducationLevel;
  }) => {
    if (!currentUser) return;
    try {
      setError(null);
      setLoading(true);

      await saveUserProfile({
        uid: currentUser.uid,
        name: data.name || currentUser.displayName || 'Estudante EduMind',
        email: currentUser.email || '',
        educationLevel: data.educationLevel,
      });

      const updated = await getUserProfile(currentUser.uid);
      setUserProfile(updated);
      setNeedsProfileCompletion(false);
    } catch (err: any) {
      setError(mapAuthError(err));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setNeedsProfileCompletion(false);
      setError(null);
    } catch (err: any) {
      setError(mapAuthError(err));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAuthReady,
        needsProfileCompletion,
        loginWithGoogle,
        loginWithEmail,
        registerWithEmail,
        completeGoogleProfile,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
