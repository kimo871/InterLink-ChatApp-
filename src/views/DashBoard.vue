<script setup>
import NavBar from '../components/NavBar.vue'
import SideBar from '../components/SideBar.vue'
import ChatRoom from '../components/ChatRoom.vue'
</script>

<template lang="pug">
div.container
    NavBar
    SideBar(title="Chats")
    ChatRoom
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
