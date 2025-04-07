// Firebase configuration
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// Replace these values with the ones from your Firebase console
const firebaseConfig = {
  apiKey: "AIzaSyDE1hnTCoCjbtFX_RnBurOIYSTN0jtXT6E",
  authDomain: "eventra-83596.firebaseapp.com",
  projectId: "eventra-83596",
  storageBucket: "eventra-83596.firebasestorage.app",
  messagingSenderId: "851816873916",
  appId: "1:851816873916:web:5f1f92b5d9b49c7890f5b9",
  measurementId: "G-F0Q4NPJ5PZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { auth, db, storage };
