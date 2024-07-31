<script setup>
import chat from '../assets/icons/chat.svg'
import profile from '../assets/icons/profile.svg'
import rooms from '../assets/icons/rooms.svg'
import logOut from '../assets/icons/log-out.svg'
import logo from '../assets/logo.svg'
import { ref } from 'vue'
const icons = ref([
  {
    src: chat,
    alt: 'Chat Icon',
    isActive: true
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
</script>
<template lang="pug">
div.navbar
    img(:src="logo" alt = "Chat Vue")
    ul.icons-container
        li(v-for="(icon, index) in icons" :key="index" :class="{ 'activted': icon.isActive }" @click="handleClick(index)")
            img(:src="icon.src" :alt="icon.alt")  
    img.log-out(:src="logOut" alt = "Log Out")
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
