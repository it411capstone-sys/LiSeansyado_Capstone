
'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null; 
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, "fisherfolk", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const fetchedData = userDoc.data();
          setUserData({ 
              ...fetchedData, 
              displayName: `${fetchedData.firstName} ${fetchedData.lastName}`
          });
        } else {
          // Handle case where user exists in Auth but not in Firestore
          console.log("No such document in Firestore!");
          setUserData(null);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
