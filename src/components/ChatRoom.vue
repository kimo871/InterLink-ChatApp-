<script setup>
import ChatHeader from './ChatHeader.vue'
import ChatBody from './ChatBody.vue'
import ChatFooter from './ChatFooter.vue'
import EmptyChat from './EmptyChat.vue'
import { inject , watch} from 'vue'

const store = inject("storeProvider",{ state: { openedChat: null } })

console.log(store)

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
    
    ChatHeader(v-if="store.state.openedChat!=null")
    ChatBody(v-if="store.state.openedChat!=null")
    ChatFooter(v-if="store.state.openedChat!=null")
    EmptyChat(v-else)
</template>

