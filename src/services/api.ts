// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "API",
  authDomain: "videogamehub-8f0e9.firebaseapp.com",
  projectId: "videogamehub-8f0e9",
  storageBucket: "videogamehub-8f0e9.firebasestorage.app",
  messagingSenderId: "78866590111",
  appId: "1:78866590111:web:c4cb3b0d3fb90ddaeff5aa",
  measurementId: "G-FK5KEBD7L1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);