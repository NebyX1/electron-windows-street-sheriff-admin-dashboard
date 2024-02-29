// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Importamos las funciones que necesitamos para autenticación
import { getAuth } from "firebase/auth"; // Removed GoogleAuthProvider

// Importamos las funciones que necesitamos para la base de datos
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Export the auth
export { auth };

// Get a reference to the firestore service
export const db = getFirestore(app);
