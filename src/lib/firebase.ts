
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "PLACEHOLDER_API_KEY",
  authDomain: "liseansyado.firebaseapp.com",
  projectId: "liseansyado",
  storageBucket: "liseansyado.appspot.com",
  messagingSenderId: "1005165848972",
  appId: "1:1005165848972:web:158481dd37775791c6b127"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
