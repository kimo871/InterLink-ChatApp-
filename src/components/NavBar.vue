<script setup>
import chat from '../assets/icons/chat.svg'
import profile from '../assets/icons/profile.svg'
import rooms from '../assets/icons/rooms.svg'
import logOut from '../assets/icons/log-out.svg'
import logo from '../assets/logo.svg'
import { ref } from 'vue'
import { getAuth, signOut } from 'firebase/auth';
import { RouterLink } from 'vue-router'
import { auth } from '../firebase/firebaseConfig.js'; // Ensure you import your Firebase configuration


const icons = ref([
  {
    src: chat,
    alt: 'Chat Icon',
    isActive: true,  
  },
  {
    src: profile,
    alt: 'Profile Icon',
    isActive: false
  },
  {
    src: rooms,
    alt: 'Rooms Icon',
    isActive: false
  }
])
const handleClick = (index) => {
  icons.value.forEach((icon, i) => {
    icon.isActive = i === index
  })
}

const logout = async()=>{
  try {
    await signOut(auth);
    console.log('User signed out successfully.');
    // Redirect to login page or any other page
    window.location.href = '/login';
  } catch (error) {
    console.error('Error signing out:', error);
  }
}
</script>
<template lang="pug">
div.navbar
    img(src="../views/logo.png" alt = "Chat Vue")
    ul.icons-container
        li(v-for="(icon, index) in icons" :key="index" :class="{ 'activted': icon.isActive }" @click="handleClick(index)")
            img(:src="icon.src" :alt="icon.alt") 
        
    img.log-out(:src="logOut" alt = "Log Out" @click="logout")
    //- img.profile-avatr(:src="state.user.photoURL== null ? '' : state.user.photoURL ")
</template>
<style lang="scss" scoped>
.navbar {
  display: flex;
  align-items: center !important;
  min-width: 65px;
  width: 5%;
  background-color: #36404a;
  padding: 15px 0px;
  gap: 20%;
  //   background-color: var(--bg-color-light);
  img {
    width: 50px;
    height: 50px;
    cursor: pointer;
  }

  img.profile-avatr{
   
    border-radius: 100%;
  
  }

  .log-out {
    border-radius: 5px;
    padding: 5px;
    &:hover {
      background-color: #0b0b0b71;
    }
  }
  ul.icons-container {
    display: flex;
    height: 40%;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 20%;
    padding: 0px;
    li {
      list-style: none;
      // background-color: var(--bg-color-light);
      cursor: pointer;
      background-color: #36404a00;
      border-radius: 5px;
      width: 50px;
      height: 50px;
      padding: 10px;
      &:hover {
        background-color: #0b0b0b71;
      }
      img {
        width: 30px;
        height: 30px;
      }
    }
    .activted {
      background-color: #7269ef;
      &:hover {
        background-color: #7269ef;
      }
    }
  }
}
</style>
