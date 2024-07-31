// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

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
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export {app,analytics,db} 