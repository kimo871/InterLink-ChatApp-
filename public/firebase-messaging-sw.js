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

// Handle background messages
self.addEventListener('push', (event) => {
  const payload = event.data ? event.data.json() : {};
  
  console.log('Received push event: ', payload);

  const notificationTitle = payload.notification?.title || 'Default Title';
  const notificationOptions = {
    body: payload.notification?.body || 'Default body text',
    icon:  'https://i.ibb.co/pr75xQS/logo2.png',
  };

    // Show the notification
    const showNotificationPromise = self.registration.showNotification(notificationTitle, notificationOptions)
      .catch((err) => {
        console.error('Failed to show notification:', err);
      });

    // Ensure that the service worker waits until the notification is shown
    event.waitUntil(showNotificationPromise);
});

// Optional: Handle notification click events
self.addEventListener('notificationclick', (event) => {
  event.notification.close(); // Close the notification when clicked

  // Handle the click event, e.g., open a URL or focus on the app
  event.waitUntil(
    clients.openWindow('/') // Replace with your app's URL
  );
});