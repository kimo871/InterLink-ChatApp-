<script setup>
import { RouterLink, RouterView } from 'vue-router'
import DashBoard from './views/DashBoard.vue'
import { provide, onMounted } from 'vue'
import { useStore } from './stores/store'
import { auth , messaging } from './firebase/firebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { getToken} from "firebase/messaging";
import GroupChat from './models/GroupChat'
const store = useStore()

onMounted(() => {
  Notification.requestPermission().then((permission) => {
  if (permission === "granted") {
    getToken(messaging,{vapidKey:import.meta.env.VITE_APP_VAPID_KEY}).then((token)=> console.log(token)).catch((error) => {
      if (error.code === 'messaging/permission-blocked') {
        console.error("Notifications are blocked.");
        alert("Please enable notifications in your browser settings.");
      } else {
        console.error("Failed to get the token:", error);
      }
    });
  } else {
    console.error("Notification permission not granted.");
  }
});

  
let chat = new GroupChat(store);

  // Set up the auth state listener
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    if (currentUser) {
      console.log(currentUser)
      store.state.user = currentUser
    } else {
      // User is signed out
      user = null
      console.log('User signed out')
    }
  })
})

provide('storeProvider', store)
</script>

<template lang="pug">
RouterView
</template>

<style lang="scss">
@mixin perfect-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

header {
  width: 100%;
  line-height: 1.5;
  min-height: 100vh;
  .wrapper {
    @include perfect-center;
  }
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
