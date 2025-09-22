
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "liseansyado-ioja6",
  "appId": "1:731463009430:web:428ca5988a74d94b4aeeb7",
  "storageBucket": "liseansyado-ioja6.firebasestorage.app",
  "apiKey": "AIzaSyBg9HFasEGJFkZvJBBJyc3-1mMx3iVMdXs",
  "authDomain": "liseansyado-ioja6.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "731463009430"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Enable offline persistence
if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(db)
      .catch((err) => {
        if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
          console.log("Firestore persistence failed: Multiple tabs open.");
        } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
          console.log("Firestore persistence not supported in this browser.");
        }
      });
}
