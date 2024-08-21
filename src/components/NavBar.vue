<script setup>
import chat from '../assets/icons/chat.svg'
import profile from '../assets/icons/profile.svg'
import rooms from '../assets/icons/rooms.svg'
import logOut from '../assets/icons/log-out.svg'
import logo from '../assets/logo.svg'
import { ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth'
import { RouterLink } from 'vue-router'
import { auth } from '../firebase/firebaseConfig.js' // Ensure you import your Firebase configuration
import { inject } from 'vue'
import ChatController from '@/Contollers/Chat'
const store = inject("storeProvider",{})

const icons = ref([
  {
    src: chat,
    alt: 'Chat Icon',
    value:"chats",
    isActive: true
  },
  {
    src: rooms,
    value:"groups",
    alt: 'Rooms Icon',
    isActive: false
  },
  {
    src: profile,
    value:"profile",
    alt: 'Profile Icon',
    isActive: false
  }
])
const handleClick = (index,mode) => {
  icons.value.forEach((icon, i) => {
    icon.isActive = i === index
  })
  store.state.recentChats = [];
  store.state.mode =  mode;
  const controller = new ChatController(mode,store);
  controller.fetchRecentChats(mode);
}
const emit = defineEmits(['renderChats', 'renderProfile', 'renderGroups'])

const logout = async () => {
  try {
    store.state.value = null;
    await signOut(auth)
    console.log('User signed out successfully.')
    // Redirect to login page or any other page
    window.location.href = '/login'
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>
<template lang="pug">
.navbar
  img(src="../views/logo2.png" alt = "Interlink Logo")
  ul.icons-container
    li(v-for="(icon, index) in icons" :key="index" :class="{ 'activated': icon.isActive }" @click="handleClick(index,icon.value)")
          img(:src="icon.src" :alt="icon.alt")
  img.log-out(:src="logOut" alt = "Log Out" @click="logout")
   
</template>



