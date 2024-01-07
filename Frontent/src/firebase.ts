// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.VITE_FIREBASE_KEY,
  authDomain:import.meta.VITE_FIREBSE_AUTH_DOMAIN,
  projectId: import.meta.VITE_FIREBSE_PROJECT_ID,
  storageBucket: import.meta.VITE_FIREBSE_STORAGE_BUCKET,
  messagingSenderId: import.meta.VITE_FIREBSE_MESSAGING_SENDER_ID,
  appId: import.meta.VITE_FIREBSE_API_ID
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)