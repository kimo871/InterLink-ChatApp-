<script setup>
import { inject } from 'vue';
import Form from './Form.vue';
const store = inject("storeProvider",{})
console.log(store)

const handleSubmit = (e)=>{
    e.preventDefault();
    let formData = new FormData(e.target);

    let data = Object.fromEntries(formData.entries());

    const sanitizedEmail = data.email.replace(/\./g, ',');

    store.getByEmail(sanitizedEmail);

}

const emits = defineEmits(['close']);

const handleClose = () => {
  emits("close");
};

</script>

<template lang="pug">
.modal-container 
 .form-container 
  Form(:handleSubmit="handleSubmit")
   .close-wrapper
    i(class="fa-solid fa-close" @click="()=> emits('close')")
   .field-wrapper
    label(for='email') Email
    .input-wrapper
     i.fa-solid.fa-user
     input(type='text' autocomplete='off' placeholder='Enter your email...' name='email' value='')
   .field-wrapper
    .input-wrapper
     input(type='submit' value='Chat')


</template>

<style lang="scss">

i{
  color:black
}
.modal-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top:0px;
  left:0px;
  background: inherit;
  opacity: 1;
  z-index: 100000000000000000000;
  transition: 0.5s ease-in-out;
  background:#00000099;
   .form-container {
  position: fixed;
  opacity: 1;
  top: 25%;
  left: 25%;
  width: 50%;
  min-height: fit-content;
  background: transparent;
  border-radius: 6px;
  z-index: 9999999999;
  padding: 0px;
  transition: 0.5s ease-in-out;
 
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