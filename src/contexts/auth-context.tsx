
'use client';

import { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Fisherfolk } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  userData: Fisherfolk | null; 
  loading: boolean;
  setUserData: (data: Fisherfolk | null) => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    userData: null,
    loading: true,
    setUserData: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Fisherfolk | null>(null);
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
            const fetchedData = userDoc.data() as Omit<Fisherfolk, 'uid'>;
            const displayName = fetchedData.firstName && fetchedData.lastName ? `${fetchedData.firstName} ${fetchedData.lastName}` : (user.email || '');

            const fullUserData: Fisherfolk = { 
                uid: user.uid,
                ...fetchedData, 
                displayName,
            };
            setUserData(fullUserData);
            sessionStorage.setItem(`userData-${user.uid}`, JSON.stringify(fullUserData));
          } else {
              // Could be an admin user, check admins collection
               const adminDocRef = doc(db, "admins", user.uid);
               const adminDoc = await getDoc(adminDocRef);
                if (adminDoc.exists()) {
                    // Admin user data structure might be different, adapt as needed
                     const fetchedData = adminDoc.data() as any;
                     const adminUserData = {
                         uid: user.uid,
                         displayName: fetchedData.name,
                         email: fetchedData.email,
                         role: fetchedData.role,
                         avatarUrl: fetchedData.avatarUrl,
                         // Fisherfolk-specific fields are not here
                         firstName: '',
                         lastName: '',
                         isVerified: true, // Admins are always "verified" in a sense
                     }
                     setUserData(adminUserData as Fisherfolk);
                     sessionStorage.setItem(`userData-${user.uid}`, JSON.stringify(adminUserData));
                }
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
