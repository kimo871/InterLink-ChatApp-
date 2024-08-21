<script setup>
import ChatController from '@/Contollers/Chat';
import Emojis from './Emojis.vue';
import { defineProps , inject , ref } from 'vue'
let store = inject("storeProvider",{});

const { message, sender, time, isSent, isReceived, isRead , chat,id,reaction } = defineProps({
  message:String,
  id : String,
  chat:String,
  reaction: String,
  sender: String | Object,
  type: String | undefined,
  download : String | undefined,
  downloadName : String | undefined,
  time: Number|String,
  isSent: Boolean,
  isReceived: Boolean,
  isRead: Boolean
})

const emojis = [ '😂',  '😍', '🥰',  '😭']


let showEmojis = ref(false);

const getTime=(timestamp)=>{
  const date = new Date(timestamp);

  // Extract minutes and seconds
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return [hours,minutes]
}

const handleReaction = async(emoji)=>{
  try{
   const controller = new ChatController(store.state.mode,store);
   await controller.reactMessage(chat,id,emoji);
  }

  catch(err){
    console.log(err);
  }
}


let me = 'Adel Shakal'
</script>
<template lang="pug">
div.message(@click="(e)=>{showEmojis = !showEmojis}" :class="{ 'receiver-msg': sender.email != store.state.user.email, 'usr-msg': sender.email == store.state.user.email }")
    Emojis(:emojis="emojis" fontSize="22" v-if="showEmojis" :click="handleReaction")
    div.message-sender
      p {{ sender.name}}
    div.message-content
      i(v-if="type=='file'" class='fa-solid fa-file')
      p(v-else) {{ message }}
      a(v-if="type=='file'"  :href="download" :download="downloadName") {{"download"}}
     
    div.message-status
      p {{ getTime(time)[0] }}:{{ getTime(time)[1] }}
      span(class="reaction") {{reaction!=null ? reaction : '' }}
</template>



