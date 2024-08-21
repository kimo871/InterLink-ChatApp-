<script setup>
import { inject, ref } from 'vue'
import Form from './Form.vue'
import closeIcon from '../assets/icons/close.svg'
import ChatController from '@/Contollers/Chat';
const store = inject('storeProvider', {})
console.log(store)

let adjust = ()=>{
  if(window.innerWidth < 1200){
    document.querySelector(".chatroom").setAttribute("style","display:block !important")
    document.querySelector(".sidebar").setAttribute("style","display:none !important")
  }
}

const handleSubmit = (e) => {
  const controlller = new ChatController(type.value,store);
  controlller.strategy.handleForm(e);
  adjust();
  emits('close')
}

const emits = defineEmits(['close'])
const type = ref('chats')
const handleClose = () => {
  emits('close')
}
</script>

<template lang="pug">
.modal-container 
   .form-container
    Form(:handleSubmit="handleSubmit")
      .type-wrapper
        .type(@click="type='chats'" :class="{ 'active': type==='chats' }") Chats
        .type(@click="type='groups'" :class="{ 'active': type==='groups' }") Groups
      .close-wrapper
        img(:src="closeIcon" class="close-icon" @click="()=> emits('close')")
      .field-wrapper
        label(v-if="type==='chats'" for='email') Email
        label(v-else for='name') Group Name
        .input-wrapper(v-if="type === 'chats'")
          img(src="../assets/icons/profile.svg")
          input(type='text' autocomplete='off' placeholder='Enter Your Email...' name='email' value='')
        .input-wrapper(v-else)
          img(src="../assets/icons/rooms.svg")
          input(type='text' autocomplete='off' placeholder='Enter Group Name...' name='name' value='')
      .field-wrapper
        .input-wrapper
          input.submit(type='submit' value='chat')
</template>


