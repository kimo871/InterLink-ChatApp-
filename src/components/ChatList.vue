<script setup>
import { defineProps, reactive, ref } from 'vue'
import ChatCard from './ChatCard.vue'
import search from '../assets/icons/search.svg'

const { title } = defineProps({
  title: String
})

const chats = reactive([
  // {
  //   title: 'Adel Shakal',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'Hello there!!'
  // },
  // {
  //   title: 'El Za3ama',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'What about you?'
  // },
  // {
  //   title: 'Mo Salah',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'I am fine too'
  // },
  // {
  //   title: 'batman',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'I am fine'
  // },
  // {
  //   title: 'Ana Ahmed',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'Hello there!!'
  // },
  // {
  //   title: 'El Za3ama',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'What about you?'
  // },
  // {
  //   title: 'Mo Salah',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'I am fine too'
  // },
  // {
  //   title: 'batman',
  //   icon: 'src/assets/images.jpeg',
  //   lastMsg: 'I am fine'
  // }
]);

const emits = defineEmits(["open"])

const activatedIndex = ref(0)

const activateChat = (index) => {
  activatedIndex.value = index
}
</script>
<template lang="pug">
div.chatlist(:class="{ 'scrollable': chats.length > 8 }")
    h1 {{ title }}
    div.actions-wrapper
     .search-bar
         img(:src="search")
        
         input(type="text" placeholder="Search")
     i(class="fa-solid fa-plus" @click="()=> emits('open')")
    ChatCard(v-for="(chat, index) in chats" :key="chat.title" :title="chat.title" :icon="chat.icon" :index="index" :isActive="index === activatedIndex" @activate="activateChat" :lastMsg="chat.lastMsg") 
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

.actions-wrapper{
  display:flex;
  justify-content:space-between;
  width:100%;
  gap:10px;
  i{width:10%; background:var(--color-primary);  
    border: none;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    cursor:pointer}
}



</style>
