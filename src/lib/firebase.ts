
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
