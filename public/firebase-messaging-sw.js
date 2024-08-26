// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyCHHJuyWCrKHvXiYycrNYeHPaljHsvdyUw',
  authDomain: 'interlink-1e1bf.firebaseapp.com',
  databaseURL: 'https://interlink-1e1bf-default-rtdb.asia-southeast1.firebasedatabase.app/',
  projectId: 'interlink-1e1bf',
  storageBucket: 'interlink-1e1bf.appspot.com',
  messagingSenderId: '324654131501',
  appId: '1:324654131501:web:d910962965293b0f904ba4',
  measurementId: 'G-1HD51XC5B2',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();