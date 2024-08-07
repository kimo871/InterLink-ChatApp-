// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore , getDocs , collection } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import {getStorage} from "firebase/storage"

import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:import.meta.env.VITE_APP_FIREBASE_APP_ID,
  measurementId:import.meta.env.VITE_APP_FIREBASE_MEASUREMENT_ID,
  databaseURL: import.meta.env.VITE_APP_DATABASE_URL
};


console.log("env",import.meta.env)


// Initialize Firebase
const app = initializeApp(firebaseConfig);


// const db = getFirestore(app);

const auth = getAuth(app);

const db = getDatabase(app);
const store = getStorage(app,import.meta.env.VITE_APP_FIREBASE_STORAGE_BUCKET);

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error.message);
  });

  

export {app,db,auth,store} 