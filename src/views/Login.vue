<script setup>
import logo from './logo.svg';
import {ref ,inject} from "vue"
import { RouterLink } from 'vue-router';
import Form from '../components/Form.vue'
import { validatorMap } from '@/Validators';
let email = ref(null);


let store = inject("storeProvider",{})




const handleSubmit=(e)=>{
  console.log("kimo");
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
    store.logIn(data).then((res)=>{
      console.log(res)
      store.state.feedback={
        status:200,
        msg:"Logged In"
      }
    })
      .catch((err)=>{
        console.log(err)
        store.state.feedback ={
         status:400,
         msg:err.message
      }
    })
  }
}

</script>


<template >

 <div class="wrapper"><img width="200" src="./logo.png" alt="..." />
    <div class="brand_container">
        <h2>Sign in </h2>
        <p class="slogan">Sign in to continue to Interlink.</p>
    </div>
 
 <Form :handleSubmit="handleSubmit"  >
    <div class="field-wrapper">
      <label for="email">Username </label>
      <div class="input-wrapper">
        <i class="fa-solid fa-user"></i>
        <input type="text" autocomplete="off" placeholder="Enter your email..." name="email" value="" /></div>
    </div>
    <div class="field-wrapper">
      <label for="password">Password</label>
      <div class="input-wrapper"><i class="fa-solid fa-eye"></i><input type="password" autocomplete="off" @change="()=&gt; console.log('dd')" placeholder="Enter your password..." name="password" /></div>
    </div>
    <div class="field-wrapper check ">
      <div class="input-wrapper">
        <input type="checkbox" />
      </div>
      <label>Remember me </label>
    </div>
    <div class="field-wrapper">
     <div class="input-wrapper">
        <input type="submit" value="Submit" />
     </div>
    </div>

 </Form>

 <div class="rest_container">
    <p> <em>Didn't have an account ?</em><RouterLink to="/signup"> Signup now ?</RouterLink></p>
    <p> </p><span> © 2024 Interlink. Crafted With <i class="fa-solid fa-heart"> </i>&nbsp; And Coffee</span>
 </div>

</div>
       
      
 

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