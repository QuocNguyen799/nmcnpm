// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrfcc5k6Ttbw2pNeh4s_SJ6KVKknkTrjk",
  authDomain: "nmcnpm-945ac.firebaseapp.com",
  projectId: "nmcnpm-945ac",
  storageBucket: "nmcnpm-945ac.appspot.com",
  messagingSenderId: "424314513200",
  appId: "1:424314513200:web:3379173c650a116a144af5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);