
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBg9HFasEGJFkZvJBBJyc3-1mMx3iVMdXs",
  authDomain: "liseansyado-ioja6.firebaseapp.com",
  databaseURL: "https://liseansyado-ioja6-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "liseansyado-ioja6",
  storageBucket: "liseansyado-ioja6.firebasestorage.app",
  messagingSenderId: "731463009430",
  appId: "1:731463009430:web:428ca5988a74d94b4aeeb7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
