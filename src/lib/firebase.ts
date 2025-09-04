// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAED0LzdLOdmnDfVWuClqZaOWywISU39c",
  authDomain: "ziarat-da5dc.firebaseapp.com",
  projectId: "ziarat-da5dc",
  storageBucket: "ziarat-da5dc.firebasestorage.app",
  messagingSenderId: "1063405798022",
  appId: "1:1063405798022:web:5f67b4cebddbc8f9294707",
  measurementId: "G-XB736CZH4V"
};

// Initialize Firebase for SSR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };
