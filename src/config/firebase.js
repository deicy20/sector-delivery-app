// src/config/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCCqPQS7ZbPSv5eK3WwnrRgxJ4-F-FVDXI",
  authDomain: "delivery-a6886.firebaseapp.com",
  projectId: "delivery-a6886",
  storageBucket: "delivery-a6886.firebasestorage.app",
  messagingSenderId: "384434627155",
  appId: "1:384434627155:web:3ce67e9234690786855ca6",
  measurementId: "G-C4MHRY833X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
