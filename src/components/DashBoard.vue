<script setup>
import NavBar from './NavBar.vue'
import SideBar from './SideBar.vue'
import ChatRoom from './ChatRoom.vue'
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
