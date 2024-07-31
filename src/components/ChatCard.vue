<script setup>
import { defineProps } from 'vue'
const { title, avatar, isActive, lastMsg } = defineProps({
  title: String,
  avatar: String,
  isActive: Boolean,
  lastMsg: String
})
</script>
<template lang="pug">
div.chatcard(:class="{ active: isActive }")
    img(:src="avatar")
    .chatcard-info
        h1.contact-name {{ title }}
        p.contact-message {{ lastMsg }}
</template>
<style lang="scss" scoped>
.chatcard {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 10px;
  padding: 10px;
  background-color: #303841;
  border-radius: 5px;
}
.active {
  background-color: rgb(54, 64, 74);
}
img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.chatcard-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  gap: 5px;
}
.contact-name {
  color: white;
}
</style>
