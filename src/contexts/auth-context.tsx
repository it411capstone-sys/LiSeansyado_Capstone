
'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Fisherfolk, Admin } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userData: (Fisherfolk | Admin) | null; 
  loading: boolean;
  setUserData: (data: (Fisherfolk | Admin) | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    setUserData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<(Fisherfolk | Admin) | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      if (user) {
        setUser(user);
        const sessionData = sessionStorage.getItem(`userData-${user.uid}`);
        if (sessionData) {
          setUserData(JSON.parse(sessionData));
          setLoading(false);
        } else {
          let docRef = doc(db, "fisherfolk", user.uid);
          let docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const fetchedData = docSnap.data() as Omit<Fisherfolk, 'uid'>;
            const displayName = fetchedData.firstName && fetchedData.lastName ? `${fetchedData.firstName} ${fetchedData.lastName}` : (user.email || '');
            const fullUserData: Fisherfolk = { 
                uid: user.uid,
                ...fetchedData, 
                displayName,
            };
            setUserData(fullUserData);
            sessionStorage.setItem(`userData-${user.uid}`, JSON.stringify(fullUserData));
          } else {
              docRef = doc(db, "admins", user.uid);
              docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                  const fetchedData = docSnap.data() as Admin;
                   const adminUserData = {
                         ...fetchedData,
                         displayName: fetchedData.name,
                   };
                   setUserData(adminUserData);
                   sessionStorage.setItem(`userData-${user.uid}`, JSON.stringify(adminUserData));
              }
          }
          setLoading(false);
        }
      } else {
        setUser(null);
        setUserData(null);
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
