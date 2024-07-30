<script setup>
import logo from './logo.svg';
import {ref} from "vue"
import { RouterLink } from 'vue-router';
import Form from '../components/Form.vue'

const defaultImage = "https://www.polytechnique.edu/sites/default/files/styles/annuaire/public/default_images/user.png?itok=y3Uo_Z7l";

let image = ref(`${defaultImage}`);

let show = ref(false);

let disabled = ref(false);

const handleImageUpload = (e)=>{
    let file = e.target.files[0];
    if(file && file.type.startsWith("image/")){
        let reader = new FileReader();
        reader.onload = ()=> {
            image.value = reader.result;
            show.value = true;
        }
        reader.readAsDataURL(file);
        
    }
    else{
        alert("invalid format")
    }
}

const removeImage = (e)=>{
   e.target.parentElement.parentElement.previousSibling.value="";
   console.log(e.target.parentElement.parentElement.previousSibling.files[0]);
   show.value=false;
   image.value = defaultImage;
   setTimeout(()=>{
    disabled.value=false;
   },1000)
   
}

</script>

<template >

 <div class="wrapper"><img width="200" src="./logo.png" alt="..." />
    <div class="brand_container">
        <h2>Sign up </h2>
        <p class="slogan">Get your Chatvia account now.</p>
    </div>
 
 <Form>
    <div class="field-wrapper">
      <label for="temp">Profile Photo</label>
      <div class="avatar-wrapper">
        <input :disabled="disabled" type="file" accept="image/*" id="image" name="image" hidden @change="handleImageUpload"  />
        <label for="image">
            <img :src="image"/>
            <div @mouseenter="disabled= true" v-if="show" class="action-wrapper">
            <i @click="removeImage" class="fa-solid fa-trash"></i>
        </div>
        </label>
        
    </div>
    </div>

    <div class="field-wrapper">
      <label for="email">Email</label>
      <div class="input-wrapper">
        <i class="fa-solid fa-envelope"></i>
        <input type="text" autocomplete="off" placeholder="Enter your email..." name="email" value="" /></div>
    </div>
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
     <p>By registering you agree to the Chatvia <a>Terms of Use</a></p>
    </div>

 </Form>

 <div class="rest_container">
    <p> <em>Already have an account ?</em><RouterLink to="login"> Signin </RouterLink></p>
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