<script setup>
import emoji from '../assets/icons/emoji.svg'
import fileShare from '../assets/icons/fileShare.svg'
import sendButton from '../assets/icons/sendButton.svg'
import { ref, inject } from 'vue'

let store = inject('storeProvider', {})

const inputValue = ref('')

const sendMessage = () => {
  console.log(inputValue.value)
  store.sendMessage(inputValue.value)
  inputValue.value = ''
}
</script>
<template lang="pug">
.chat-footer
  input(type="text" placeholder="Enter Message..." v-model="inputValue")
  img(:src="emoji").emoji 
  img(:src="fileShare").file-share 
  img(:src="sendButton" @click="sendMessage").send-button 
</template>
<style lang="scss">
.chat-footer {
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 3%;
  input {
    min-width: 50%;
    width: 75%;
    border: none;
    padding: 0 20px;
    font-size: 1rem;
    border-radius: 5px;
    background-color: #303841;
    //   color: var(--input-text-color);
    color: #a6b0cf;
    height: 80%;
    margin: 0 10px;
    justify-content: center;
    align-items: center;
  }
  img {
    cursor: pointer;
    width: 50px;
    height: 50px;
    padding: 15px;
    background-color: #6159cb00;
    &:hover {
      background-color: #6159cb28;
    }
  }
  .send-button {
    padding: 0px;
    &:hover {
      opacity: 0.8;
    }
  }
}
</style>
