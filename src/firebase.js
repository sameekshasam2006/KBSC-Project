
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAL0IWIlBnZm3hIKd6jJoJT9_Yj94NA5kI",
  authDomain: "retailiq-588c4.firebaseapp.com",
  projectId: "retailiq-588c4",
  storageBucket: "retailiq-588c4.firebasestorage.app",
  messagingSenderId:  "759286015651",
  appId:  "1:759286015651:web:e9dbe3708c23108c32c116",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
