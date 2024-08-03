<script setup>
import NavBar from '../components/NavBar.vue'
import SideBar from '../components/SideBar.vue'
import ChatRoom from '../components/ChatRoom.vue'
import Modal from '@/components/Modal.vue'
import { ref } from 'vue'
let chatsSearch = () => console.log('chats')

let groupsSearch = () => console.log('groups')

let show_container = ref(false)

const handleClose = () => (show_container.value = false)

const handleOpen = () => (show_container.value = true)

const renderSideBar = ref(null)
const renderChatRoom = ref(null)
</script>

<template lang="pug">
Modal(v-if="show_container"  @close="handleClose")
.container
  NavBar(@renderChats="renderSideBar.chats()" @renderGroups="renderSideBar.groups()" @renderProfile="renderSideBar.profile()")  
  SideBar(title="chats" @open="handleOpen" ref="renderSideBar" @openChat='renderChatRoom?.render')
  ChatRoom(ref="renderChatRoom")
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: start;
  height: 100vh;
  div {
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: column;
    height: 100%;
  }
}
</style>
