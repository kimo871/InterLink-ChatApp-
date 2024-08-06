<script setup>
import ChatHeader from './ChatHeader.vue'
import ChatBody from './ChatBody.vue'
import ChatFooter from './ChatFooter.vue'
import EmptyChat from './EmptyChat.vue'
import Loader from './Loader.vue'
import { inject , watch , ref} from 'vue'

const store = inject("storeProvider",{ state: { openedChat: null } })

const loader = ref({status:false})



// Watch for changes in the openedChat property
watch(
  () => store.state.openedChat,
  (newValue) => {
    if (newValue) {
      console.log('Opened chat changed:', newValue);
    }
  },
  { deep: true }
);

</script>
<template lang="pug">

div.chatroom
    Loader(v-if="store.state.loading.chatBody")
    ChatHeader(v-if="store.state.openedChat!=null")
    ChatBody(v-if="store.state.openedChat!=null")
    ChatFooter(v-if="store.state.openedChat!=null")
    EmptyChat(v-if="store.state.openedChat==null && !store.state.loading.chatBody")
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
