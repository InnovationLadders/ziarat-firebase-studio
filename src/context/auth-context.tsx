
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';

export interface User {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  photoURL: string | null;
  displayName: string | null;
  role?: 'admin' | 'user';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged listens for auth state changes in the browser
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      setLoading(true); // Start loading whenever auth state might be changing
      if (firebaseUser) {
        // If user is authenticated, set up a real-time listener to their Firestore document
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        
        const unsubscribeFirestore = onSnapshot(userDocRef, (userDoc) => {
          // When Firestore data changes (or on initial load), create a complete user object
          const userData = userDoc.exists() ? userDoc.data() : {};
          
          // Construct a new, reliable user object
          const currentUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            emailVerified: firebaseUser.emailVerified,
            photoURL: firebaseUser.photoURL,
            // Prioritize name from Firestore, fall back to Firebase display name
            displayName: userData.name || firebaseUser.displayName || 'مستخدم',
            // Default to 'user' role if not specified in Firestore
            role: userData.role || 'user',
          };
          
          console.log('Auth Context User:', currentUser);
          console.log('Firestore userData:', userData);
          console.log('Firebase User:', {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName
          });
          
          setUser(currentUser);
          setLoading(false);
        }, (error) => {
            console.error("Firestore snapshot error:", error);
            // If Firestore fails, fall back to basic Firebase user data
            const fallbackUser = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              emailVerified: firebaseUser.emailVerified,
              photoURL: firebaseUser.photoURL,
              displayName: firebaseUser.displayName || 'مستخدم',
              role: 'user', // Default role on error
            };
            
            console.log('Auth Context Fallback User:', fallbackUser);
            setUser(fallbackUser);
            setLoading(false);
        });

        // Return the cleanup function for the Firestore listener
        return () => unsubscribeFirestore();
      } else {
        // If no user is authenticated, clear user state
        setUser(null);
        setLoading(false);
      }
    });

    // Return the cleanup function for the auth state listener
    return () => unsubscribeAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
