// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore , getDocs , collection } from "firebase/firestore";
import { getDatabase } from "firebase/database";

import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCHHJuyWCrKHvXiYycrNYeHPaljHsvdyUw",
  authDomain: "interlink-1e1bf.firebaseapp.com",
  projectId: "interlink-1e1bf",
  storageBucket: "interlink-1e1bf.appspot.com",
  messagingSenderId: "324654131501",
  appId:"1:324654131501:web:d910962965293b0f904ba4",
  measurementId:"G-1HD51XC5B2",
  databaseURL: "https://interlink-1e1bf-default-rtdb.asia-southeast1.firebasedatabase.app/"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// const db = getFirestore(app);

const auth = getAuth(app);

const db = getDatabase(app);

setPersistence(auth, browserLocalPersistence)
  .catch((error) => {
    console.error('Error setting persistence:', error.message);
  });

  

export {app,analytics,db,auth} 