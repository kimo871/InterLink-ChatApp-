<script setup>
import { defineProps } from 'vue'
import ChatList from './ChatList.vue'
const { title } = defineProps({
  title: String
})

const emits = defineEmits(["open"])
</script>
<template lang="pug">
div.sidebar
    h1 {{ title }}
    ChatList(@open="()=> emits('open')")
</template>
<style lang="scss" scoped>
.sidebar {
  width: 25%;
  background-color: #303841;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  h1 {
    color: white;
  }
  div {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 10px;
  }
}

// @media(max-width:1400px){
//   .sidebar{
//     width:90% !important;
//   }
// }
</style>
