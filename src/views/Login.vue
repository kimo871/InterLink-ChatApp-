<script setup>
import logo from './logo.svg';
import {ref ,inject,onBeforeMount} from "vue"
import { RouterLink } from 'vue-router';
import Form from '../components/Form.vue'
import { validatorMap } from '@/Validators';
import { onAuthStateChanged } from 'firebase/auth';
import {auth} from "../firebase/firebaseConfig"

import {useRouter} from "vue-router"

const router = useRouter();

let email = ref(null);


let store = inject("storeProvider",{});


const handleSubmit = async(e)=>{
  console.log("kimokjjjjjjj");
  store.clearFeedback();
  let formData = new FormData(e.target);

  let data = Object.fromEntries(formData.entries());

  console.log(data)

  for(let entry of Object.entries(data)){
    console.log(entry)
    switch(entry[0]){
      case "email":{
        if(!validatorMap.email.validator(entry[1])) store.state.feedback={status:400,msg:validatorMap.email.error}
        break;
      }
      case "password":{
        if(!validatorMap.password.validator(entry[1])) store.state.feedback={status:400,msg:validatorMap.password.error}
        break;
      }
    }
  }

  if(store.state.feedback.status===null){
     store.logIn(data).then(()=> setTimeout(()=>router.push("/dashboard"),300))
  }

}


</script>


<template lang="pug">

.wrapper
  img(width='200' src='./logo.png' alt='...')
  .brand_container
    h2 Sign in 
    p.slogan Sign in to continue to Interlink.
  Form(:handleSubmit='handleSubmit')
    .field-wrapper
      label(for='email') Username 
      .input-wrapper
        i.fa-solid.fa-user
        input(type='text' autocomplete='off' placeholder='Enter your email...' name='email' value='')
    .field-wrapper
      label(for='password') Password
      .input-wrapper
        i.fa-solid.fa-eye
        input(type='password' autocomplete='off' @change="()=> console.log('dd')" placeholder='Enter your password...' name='password')
    .field-wrapper.check
      .input-wrapper
        input(type='checkbox')
      label Remember me 
    .field-wrapper
      .input-wrapper
        input(type='submit' value='Submit')
  .rest_container
    p
      em Didn&apos;t have an account ?
      RouterLink(to='/signup')  Signup now ?
    p  
    span
      | &copy; 2024 Interlink. Crafted With 
      i.fa-solid.fa-heart  
      | &nbsp; And Coffee
</template>

<style lang="scss">
@import "@/assets/scss/mixins";

.wrapper{
    width:inherit;
    min-height:92vh;;
    @include perfect-center;
    flex-direction: column;
    gap:2em;

    .slogan{
        color:var(--color-text-secondary);
        font-size:18px;
    }

    .brand_container{
        text-align: center;
    }


.rest_container{
    color:var(--color-text-secondary);
    line-height:1.9;
}
}
</style>