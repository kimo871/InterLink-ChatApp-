<script setup>
import { defineProps , inject } from 'vue'
let store = inject("storeProvider",{});
const { message, sender, time, isSent, isReceived, isRead } = defineProps({
  message: String,
  sender: String,
  time: String,
  isSent: Boolean,
  isReceived: Boolean,
  isRead: Boolean
})

const getTime=(timestamp)=>{
  const date = new Date(timestamp);

  // Extract minutes and seconds
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return [hours,minutes]
}
let me = 'Adel Shakal'
</script>
<template lang="pug">
div.message(:class="{ 'message': sender.email != store.state.user.email, 'usr-msg': sender.email == store.state.user.email }")
    div.message-sender
      p {{ sender.name}}
    div.message-content
      p {{ message }}
    div.message-status
      p {{ getTime(time)[0] }}:{{ getTime(time)[1] }}
</template>
<style lang="scss" scoped>
.message {
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
  position: relative;
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
    p {
      padding: 5px;
      color: #f0f0f0;
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
    width: 100%;
    display: flex;
    justify-content: end;
    p {
      color: #abb4d2;
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
</style>
