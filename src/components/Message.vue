<script setup>
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
   await store.reactMessage(chat,id,emoji);
  }

  catch(err){
    console.log(err);
  }
}


let me = 'Adel Shakal'
</script>
<template lang="pug">
div.message(@click="(e)=>{showEmojis = !showEmojis}" :class="{ 'message': sender.email != store.state.user.email, 'usr-msg': sender.email == store.state.user.email }")
    Emojis(:emojis="emojis" v-if="showEmojis" :click="handleReaction")
    div.message-sender
      p {{ sender.name}}
    div.message-content
      i(v-if="type=='file'" class='fa-solid fa-file')
      p(v-else) {{ message }}
      a(v-if="type=='file'"  :href="download" download) {{"download"}}
     
    div.message-status
      p {{ getTime(time)[0] }}:{{ getTime(time)[1] }}
      span(class="reaction") {{reaction!=null ? reaction : '' }}
</template>
<style lang="scss" scoped>
.message {
  i{color:white;}
  .emoji-wrapper{
    
    width: fit-content;
    left: -125%;
    background: #303841;
    bottom: 100%;
    padding: 5px 5px;
    right: 10%;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
 
}
    
  align-self: start;
  display: flex;
  justify-content: start;
  align-items: center;
  background-color: #7269ef;
  flex-direction: column;
  width: fit-content;
  min-width: 120px;
  padding: 5px;
  border-radius: 5px;
  position:relative;
  &::before {
    border-bottom: 5px solid transparent;
    border-left: 5px solid #7269ef;
    border-left-color: #7269ef;
    border-right: 5px solid transparent;
    border-top: 5px solid #7269ef;
    border-top-color: #7269ef;
    bottom: -7px;
    content: '';
    left: 0px;
    width: 10px;
    height: 10px;
    position: absolute;
  }
  .message-content {
    width: 100%;
    border-radius: 10px;
    display:flex;
    align-items:center;
    p {
      padding: 5px;
      color: #f0f0f0;
    }
    i{
      font-size:50px;
      padding:10px;
    }
  }
  .message-sender {
    width: 100%;
    display: flex;
    justify-content: start;
    padding: 5px;
    p {
      color: #283157;
      font-weight: bold;
    }
  }
  .message-status {
    position:relative;
    width: 100%;
    display: flex;
    justify-content: end;
    p {
      color: #abb4d2;
    }
    span.reaction{
      top: 70%;
      position: absolute;
      left: 80%;
    }
  }
}
.usr-msg {
  background-color: #303841;
  color: white;
  align-self: end;
  &::before {
    border-left-color: #303841;
    border-top-color: #303841;
    border-bottom: 5px solid transparent;
    border-left: 5px solid transparent;
    border-right: 5px solid #303841;
    border-top: 5px solid #303841;
    bottom: -7px;
    content: '';
    right: 0px;
    left: auto;
    width: 10px;
    height: 10px;
    position: absolute;
  }
  .message-sender {
    display: none;
  }
}

 .message:hover  i.fa-face-smile{
  visibility: visible;
}

.emoji-wrapper{
  position: absolute;
    width: fit-content;
    height: 40px;
    top: 30%;
    .emoji-card{
      padding:12px;
      width:10px;
      height:10px;
      text-align:center;
      cursor:pointer;
      font-size:20px;
      display:inline-block;
      &:hover {
      background-color: #6159cb28;
    }
}
}
</style>
