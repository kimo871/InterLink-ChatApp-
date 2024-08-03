<script setup>
import { inject, ref } from 'vue'
import Form from './Form.vue'
import closeIcon from '../assets/icons/close.svg'
const store = inject('storeProvider', {})
console.log(store)

const handleSubmit = (e) => {
  if (type.value === 'chats') {
    e.preventDefault()
    let formData = new FormData(e.target)
    let data = Object.fromEntries(formData.entries())
    const sanitizedEmail = data.email.replace(/\./g, ',')
    store.getByEmail(sanitizedEmail)
  } else if (type.value === 'groups') {
    e.preventDefault()
    let formData = new FormData(e.target)
    let data = Object.fromEntries(formData.entries())
    let name = data.name
    store.createGroup(name)
  } else {
    console.log('error')
  }
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
  //- form(method="POST" @submit.prevent="handleSubmit")
   
  //-  label Email 
  //-  input(type='text' name="email" placeholder="Enter Email ..")
  //-  input(type="submit" value="submit")

</template>

<style lang="scss">
i {
  color: #7269ef;
}
.modal-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  background: inherit;
  opacity: 1;
  z-index: 100000000000000000000;
  transition: 0.5s ease-in-out;
  background: #00000099;
  .form-container {
    position: fixed;
    opacity: 1;
    top: 25%;
    left: 15%;
    width: 70%;
    min-height: fit-content;
    background: transparent;
    border-radius: 6px;
    z-index: 9999999999;
    padding: 0px;
    transition: 0.5s ease-in-out;
    display: flex;
    flex-direction: column;
    gap: 10%;
  }
  .close-wrapper {
    position: relative;
    .close-icon {
      position: absolute;
      top: -80px;
      right: -28px;
      width: 30px;
      height: 30px;
      cursor: pointer;
      &:hover {
        transform: scale(1.1);
      }
    }
  }
  .type-wrapper {
    display: flex;
    justify-content: start;
    width: 90%;
    .type {
      width: 50%;
      padding: 10px;
      border: none;
      text-align: center;
      cursor: pointer;
      background-color: #7269ef00;
      color: #f0f0f0;
      font-weight: 600;
      border-bottom: 1px solid #7269ef;
      &:hover {
        background: #7269ef;
        color: white;
      }
    }
    .active {
      background: #7269ef;
      color: white;
    }
  }
  .input-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border-radius: 5px;
    padding: 10px;
    img {
      width: 20px;
      height: 20px;
    }
    input {
      position: relative;
      font-size: 15px;
      width: 100%;
      padding: 7px;
      border: 1.5px solid #6c63ff;
      border-radius: 5px;
    }
    .submit {
      background: #7269ef;
      color: white;
      border: none;
      padding: 12px 12px;
      text-align: center;
      width: 50%;
      cursor: pointer;
    }
  }
}

// input, textarea {
//   position: relative;
//   font-size: 15px;
//   width: 100%;
//   padding: 7px;
//   border: 1.5px solid #6c63ff;
//   border-radius: 5px;
// }
</style>
