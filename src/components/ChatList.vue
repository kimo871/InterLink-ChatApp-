<script setup>
import { reactive, ref, onMounted, inject, onUpdated } from 'vue'
import ChatCard from './ChatCard.vue'
import search from '../assets/icons/search.svg'
import addChat from '../assets/icons/add.svg'
import groupIcon from '../assets/icons/group.png';
import Loader from './Loader.vue'
import ChatController from '@/Contollers/Chat'

let store = inject('storeProvider', {})
const { title } = defineProps({
  title: String
})

let controller = undefined;

const strategy = {
    groups :{
        getChatsPath : `groups`,
        getuserChatPath : 'groupChats'
    },
    directChats:{
        getChatsPath : `chats`,
        getuserChatPath : 'userChats'
    },
    privateGroups:{
  
    }
  }

onMounted(() => {
  controller = new ChatController(store.state.mode,store);
  controller.fetchRecentChats()
})


const chats = reactive([
])

const emits = defineEmits(['open'])

const activatedIndex = ref(0)
const activateChat = (index, userDetails) => {
  const controller = new ChatController(store.state.mode,store);
  controller.getMessages(index,userDetails);
}
const activateGroup = (groupId,userDetails) => {
  const controller = new ChatController(store.state.mode,store);
  controller.getMessages(groupId,userDetails);
  
}
</script>
<template lang="pug">
.chatlist
    img(:src="addChat" class="add-chat" @click="()=> emits('open')")
    h1 {{ title }}
    div.actions-wrapper
     .search-bar
        img(:src="search")
        
        input(type="text" placeholder="Search" v-model="store.state.searchQuery")
    .chat-cards(:class="{ 'scrollable': chats.length > 8 }")
    Loader(v-if="store.state.loading.recentChats")
    ChatCard(v-if="title==='chats'" v-for="chat in store.filteredResults"  :title="chat.userDetails.name" :icon="chat.userDetails.photoURL" :index="index" :isActive="index === activatedIndex"  :unread="chat.userDetails.unread" @activate="()=>activateChat(chat.chatDetails.chatId,chat.userDetails)" :lastMsg="chat.chatDetails.lastMessage") 
    ChatCard(v-else v-for="group in store.filteredResults"  :title="group.userDetails.name" :icon="groupIcon" :index="index" :isActive="index === activatedIndex" @activate="()=>activateGroup(group.chatDetails.chatId,group.userDetails)" :unread="group.userDetails.unread" :lastMsg="group.chatDetails.lastMessage") 
</template>

