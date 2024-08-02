<script setup>
import logo from './logo.svg';
import {ref,inject,watch} from "vue"
import {db} from "../firebase/firebaseConfig"
import { RouterLink } from 'vue-router';
import Form from '../components/Form.vue';
import { validatorMap } from '@/Validators';
import {getStorage,ref as storageRef,uploadBytes,getDownloadURL} from "firebase/storage"
import { getFirestore, doc, setDoc } from "firebase/firestore";

let store = inject("storeProvider",{})



console.log(store.state)

const defaultImage = "https://www.polytechnique.edu/sites/default/files/styles/annuaire/public/default_images/user.png?itok=y3Uo_Z7l";

let image = ref(`${defaultImage}`);

let show = ref(false);

let disabled = ref(false);


const handleImageUpload = (e)=>{
    let file = e.target.files[0];
    if(file && file.type.startsWith("image/")){
        let reader = new FileReader();
        reader.onload = ()=> {
            console.log(reader.result)
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

const validateForm = (data)=>{
  for(let entry of Object.entries(data)){
    console.log(entry)
    switch(entry[0]){
      case "name":{
        if(!validatorMap.name.validator(entry[1])) store.state.feedback={status:400,msg:validatorMap.name.error};
        break;
      }
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
}


const handleSubmit=(e)=>{
  console.log("kimo");
  store.state.feedback ={
    status:null,
    msg:""
  };

  let formData = new FormData(e.target);
  

  let data = Object.fromEntries(formData.entries());

  validateForm(data);

  const fileInput = e.target.querySelector('input[type="file"]');
  const file = fileInput ? fileInput.files[0] : null;

  if(store.state.feedback.status===null){
    if(file){
       store.saveUser(data,file).then(()=> store.state.feedback={status:200,msg:"Account created"});
  
  }
    else{
      store.state.feedback={
        status:400,
        msg:"Error in Image"
      }
    }
  }
 
}



</script>

<template >

 <div class="wrapper"><img width="200" src="./logo.png" alt="..." />
    <div class="brand_container">
        <h2>Sign up </h2>
        <p class="slogan">Get your Chatvia account now.</p>
    </div>
 
 <Form :handleSubmit="handleSubmit" :feedback="store.state.feedback" >
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
      <label for="email">Full Name </label>
      <div class="input-wrapper">
        <i class="fa-solid fa-user"></i>
        <input type="text" autocomplete="off" placeholder="Enter your Name..." name="name" value="" /></div>
    </div>

    <div class="field-wrapper">
      <label for="email">Email</label>
      <div class="input-wrapper">
        <i class="fa-solid fa-envelope"></i>
        <input type="text" autocomplete="off" placeholder="Enter your email..." name="email" value="" /></div>
    </div>
    
    <div class="field-wrapper">
      <label for="password">Password</label>
      <div class="input-wrapper"><i class="fa-solid fa-eye"></i><input type="password" autocomplete="off" @change="()=&gt; console.log('dd')" placeholder="Enter your password..." name="password" /></div>
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
    color:var(--color-primary-white);
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