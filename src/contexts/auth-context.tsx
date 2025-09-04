
'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null; 
  loading: boolean;
  setUserData: (data: any | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    setUserData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        // Try to get data from sessionStorage first
        const sessionData = sessionStorage.getItem(`userData-${user.uid}`);
        if (sessionData) {
          setUserData(JSON.parse(sessionData));
          setLoading(false);
        } else {
          // If not in session, fetch from Firestore
          const userDocRef = doc(db, "fisherfolk", user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const fetchedData = userDoc.data();
            const fullUserData = { 
                ...fetchedData, 
                displayName: `${fetchedData.firstName} ${fetchedData.lastName}`
            };
            setUserData(fullUserData);
            sessionStorage.setItem(`userData-${user.uid}`, JSON.stringify(fullUserData));
          }
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
        // No need to clear session storage here as it's keyed by uid
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSetUserData = (data: any | null) => {
      if (user) {
        if (data) {
            sessionStorage.setItem(`userData-${user.uid}`, JSON.stringify(data));
        } else {
            sessionStorage.removeItem(`userData-${user.uid}`);
        }
      }
      setUserData(data);
  };

  return (
    <AuthContext.Provider value={{ user, userData, loading, setUserData: handleSetUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
