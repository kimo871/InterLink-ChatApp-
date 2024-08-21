<script setup>
import { ref } from 'vue'
import Profile from './Profile.vue'
import ChatList from './ChatList.vue'
import Loader from './Loader.vue';
import { inject } from 'vue';

const store = inject("storeProvider",{})

const { title } = defineProps({
  title: String
})

const emits = defineEmits(['open'])
const renderedChild = ref('chats')

</script>
<template lang="pug">
.sidebar

  Profile(v-if="store.state.mode==='profile' ")
  ChatList(v-else @open="()=> emits('open')" :title="store.state.mode")
</template>

