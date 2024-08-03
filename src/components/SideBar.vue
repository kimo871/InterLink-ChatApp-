<script setup>
import { ref } from 'vue'
import Profile from './Profile.vue'
import ChatList from './ChatList.vue'
const { title } = defineProps({
  title: String
})

const emits = defineEmits(['open'])
const renderedChild = ref('chats')
defineExpose({
  chats() {
    renderedChild.value = 'chats'
  },
  groups() {
    renderedChild.value = 'groups'
  },
  profile() {
    renderedChild.value = 'profile'
  }
})
</script>
<template lang="pug">
.sidebar
  Profile(v-if="renderedChild=== 'profile'")
  ChatList(v-else @open="()=> emits('open')" :title="renderedChild")
</template>
<style lang="scss" scoped>
.sidebar {
  position: relative;
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
</style>
