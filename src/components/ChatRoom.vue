<script setup>
import ChatHeader from './ChatHeader.vue'
import ChatBody from './ChatBody.vue'
import ChatFooter from './ChatFooter.vue'
</script>
<template lang="pug">
div.chatroom
    ChatHeader
    ChatBody
    ChatFooter
</template>
<style lang="scss" scoped>
.chatroom {
  width: 70%;
  gap: 0.2%;
  background-color: #262e35;
  //   background-color: var(--bg-color-dark);
  div {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: start;
    align-items: center;
  }
}
</style>
