<script setup>
import { defineProps } from 'vue'
import ChatCard from './ChatCard.vue'
const { title } = defineProps({
  title: String
})
import search from '../assets/icons/search.svg'
let data = [
  { title: 'Adel Shakal', avatar: 'src/assets/images.jpeg', isActive: true, lastMsg: 'Hello' },
  {
    title: 'El Za3ama',
    avatar: 'src/assets/images.jpeg',
    isActive: false,
    lastMsg: 'What about you?'
  },
  {
    title: 'Mo Salah',
    avatar: 'src/assets/images.jpeg',
    isActive: false,
    lastMsg: 'I am fine too'
  },
  {
    title: 'batman',
    avatar: 'src/assets/images.jpeg',
    isActive: false,
    lastMsg: 'I am fine'
  }
]
</script>
<template lang="pug">
div.chatlist
    h1 {{ title }}
    .search-bar
        img(:src="search")
        input(type="text" placeholder="Search")
    h2 Recent 
    ChatCard(v-for="chat in data" :key="chat.title" :title="chat.title" :avatar="chat.avatar" :isActive="chat.isActive" :lastMsg="chat.lastMsg" ) 
    </template>
<style lang="scss" scoped>
.chatlist {
  width: 25%;
  background-color: #303841;
  align-items: center;
  text-align: left;
  h1 {
    color: white;
  }
  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    background-color: rgb(54, 64, 74);
    padding: 10px;
    width: 90%;
    border-radius: 5px;
    img {
      width: 20px;
      height: 20px;
    }
    input {
      width: 100%;
      height: 30px;
      border: none;
      border-radius: 5px;
      background-color: rgb(54, 64, 74);
      color: white;

      &:focus {
        outline: none;
      }
    }
  }
}
</style>
