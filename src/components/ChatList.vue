<script setup>
import { reactive, ref, onMounted, inject } from 'vue'
import ChatCard from './ChatCard.vue'
import search from '../assets/icons/search.svg'
import addChat from '../assets/icons/add.svg'

let store = inject('storeProvider', {})
const { title } = defineProps({
  title: String
})

onMounted(() => {
  if (title === 'chats') store.fetchRecentChats()
  else store.fetchGroups()
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
])

const emits = defineEmits(['open'])

const activatedIndex = ref(0)
const activateChat = (index, userDetails) => {
  //activatedIndex.value = index; // ui effect
  store.getMessages(index, userDetails)
}
const activateGroup = (groupId) => {
  store.getGroupMessages(groupId)
}
</script>
<template lang="pug">
.chatlist
  img(:src="addChat" class="add-chat" @click="()=> emits('open')")
  h1 {{ title }}
  .search-bar
    img(:src="search")        
    input(type="text" placeholder="Search")
    //-  ChatCard(v-for="chat in store.state.recentChats"  :title="chat.userDetails.name" :icon="chat.chatDetails.photoURL" :index="index" :isActive="index === activatedIndex" @activate="activateChat" :lastMsg="chat.chatDetails.lastMessage") 
  .chat-cards(:class="{ 'scrollable': chats.length > 8 }")
    ChatCard(v-if="title==='chats'" v-for="chat in store.state.recentChats"  :title="chat.userDetails.name" :icon="chat.userDetails.photoURL" :index="index" :isActive="index === activatedIndex" @activate="()=>activateChat(chat.chatDetails.chatId,chat.userDetails)" :lastMsg="chat.chatDetails.lastMessage") 
    ChatCard(v-else v-for="group in store.state.recentGroups"  :title="group.name" :icon="'../assets/icons/group.svg'" :index="index" :isActive="index === activatedIndex" @activate="()=>activateGroup(group.groupId)" :lastMsg="group.lastMessage") 
</template>

<style lang="scss" scoped>
.chatlist {
  width: 25%;
  background-color: #303841;
  align-items: center;
  text-align: left;

  .add-chat {
    position: absolute;
    right: 20px;
    bottom: 50px;
    width: 50px;
    height: 50px;
    cursor: pointer;
    &:hover {
      transform: scale(1.1);
    }
  }
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
  .chat-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
    width: 90%;
    height: 70%;
  }
}

.actions-wrapper {
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 10px;
  i {
    width: 10%;
    background: var(--color-primary);
    border: none;
    border-radius: 5px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 22px;
    cursor: pointer;
  }
}
</style>
