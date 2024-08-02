<script setup>
import { inject , ref,watch } from 'vue';

let store = inject("storeProvider",{});

let chatInfo = ref({
  name: store.state.openedChat == null ? 'Adel Shakal' :  store.state.openedChat.userData.name,
  img: store.state.openedChat == null ? 'src/assets/images.jpeg' : store.state.openedChat.userData.photoURL
})

watch(
  () => store.state.openedChat,
  (newMsg) => {
    if (newMsg.userData!=null) {
      chatInfo.value={
        name :  store.state.openedChat.userData.name,
        img : store.state.openedChat.userData.photoURL
      }
      // 1000 milliseconds = 1 second
    }
  },
  { deep: true } // Enable deep watching
);




</script>
<template lang="pug">
div.chat-header
    img(:src="chatInfo.img")
    h1.contact-name {{ chatInfo.name}}
</template>
<style lang="scss">
.chat-header {
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: start;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
