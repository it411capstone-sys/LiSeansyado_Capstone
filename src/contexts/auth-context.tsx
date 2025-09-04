
'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  userData: any | null; 
  loading: boolean;
  setUserData: (data: any) => void;
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
    // Attempt to load user data from session storage on initial load
    const storedUserData = sessionStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (!user) {
        // Clear user data on logout
        sessionStorage.removeItem('userData');
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSetUserData = (data: any) => {
    setUserData(data);
    sessionStorage.setItem('userData', JSON.stringify(data));
  };


  return (
    <AuthContext.Provider value={{ user, userData, loading, setUserData: handleSetUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
