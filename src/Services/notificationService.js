// notificationService.js (Business Controller Module)

import { getToken  } from 'firebase/messaging';
import { messaging } from '../firebase/firebaseConfig.js';
import {getMessaging} from 'firebase/messaging'; // Import your Firebase messaging instance
import { ref, update } from 'firebase/database';
import { db } from '../firebase/firebaseConfig'; // Import your Firebase configuration

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, { vapidKey: import.meta.env.VITE_APP_VAPID_KEY });
      console.log('FCM Token:', token);
      // Send the token to your server or store it
      return token;
    } else {
      console.error('Notification permission not granted.');
      return null;
    }
  } catch (error) {
    console.error('Failed to request notification permission or get token:', error);
    return null;
  }
};


export const saveToken = async(email,token)=>{
  try{
   const user = ref(db,`users/${email}`);
   await update(user,{
    "deviceToken" : token
   })
  }

  catch(err){
    console.log(err);
  }
}

export const sendNotification = async(deviceToken,sender,msg)=>{
    try{
        console.log(msg)
        await fetch("https://firebase-messaging-service.vercel.app/api/sendNotification",{
            method:"POST",
            headers: {
              'Content-Type': 'application/json',
              "Access-Control-Allow-Origin":"*"
            },
            body:JSON.stringify({
                title:`${sender} Messaged you.....`,
                body : msg,
                token:deviceToken
            })
        })
        .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
        })
        .catch((error) => {
        console.log('Error sending message:', error);
        });
    }
    catch(err){
        console.log(err);
    }
}