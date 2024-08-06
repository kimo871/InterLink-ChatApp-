<script setup>
import emoji from '../assets/icons/emoji.svg'
import fileShare from '../assets/icons/fileShare.svg'
import sendButton from '../assets/icons/sendButton.svg'
import { ref , inject } from 'vue';

let store = inject("storeProvider",{});

let fileValue = ref({})

let file = ref({
  status:false,
  content:null,
})

let showEmojis = ref(false)

const emojis =  ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']

const inputValue = ref("");

const sendMessage = async()=>{
  try{
  console.log(inputValue.value);
  const res = await sendOption();
  store.sendMessage(res);
  //console.log(res);
  }
  catch(err){
    console.log(err);
  }
  inputValue.value="";
  file.value = {status:null,content:null}
}

const sendOption = ()=>{

    if(inputValue.value!=""){
      console.log("inputext here..")
      return inputValue.value;
    }

    else if(file.value.content){
      // return new Promise((resolve,reject)=>{
      //  console.log("file here..")
      // const reader = new FileReader();
      
      // reader.onload = () => {
      //  // console.log(reader.result);
      //   resolve(reader.result);
      // };

      // reader.onerror = ()=>{
      //   console.log("laaaaaaaaaa");
      //   reject("error")
      // }
      
      // reader.onerror = () => {
      //   reject(null); // Reject if there's an error reading the file
      // };
      
  //     // reader.readAsDataURL(file.value.content);
  // })
  return file.value.content;
}
    else {
      console.log("rejected")
      return null
     
    }
 
}



const handleFile = (e)=>{
  inputValue.value = "";
  console.log(e.target.files[0])
  if(!validateSizeFile(e.target.files[0]))alert(" Max File Size is 30 kb ! ")
  file.value = {status:true,content:e.target.files[0]};
}

const validateSizeFile = (file)=>{
   return  file.size/1024 <= 30
}




</script>
<template lang="pug">
div.chat-footer
    input(v-if="!file.status" type="text" id="message-text" placeholder="Enter Message..." v-model="inputValue" @focus="showEmojis=false")
    div.fileShower(v-if="file.status")
     i(class="fa-solid fa-file")
     p {{ file.content.name }}
     .reset-wrapper 
      i(@click="()=>file={status:false,fileName:null}" class="fa-solid fa-circle-xmark")
    img(v-if="!file.status" :src="emoji" @click="()=>{showEmojis = !showEmojis}").emoji 
    .emoji-wrapper(v-if="showEmojis")
     span(v-for="emoji in emojis" class="emoji-card" @click="inputValue+=emoji") {{ emoji }}
    div.input-wrapper
     label(for="file")
      img(:src="fileShare").file-share
     input( type="file" , @change="handleFile",hidden,name="file",id="file")
    
    img(:src="sendButton" @click="sendMessage").send-button 
</template>
<style lang="scss">
@import "../assets/scss/mixins.scss";

.chat-footer {
  position:relative;
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 3%;
  input {
    min-width: 50%;
    width: 75%;
    border: none;
    padding: 0 20px;
    font-size: 1rem;
    border-radius: 5px;
    background-color: #303841;
    //   color: var(--input-text-color);
    color: #a6b0cf;
    height: 80%;
    margin: 0 10px;
    justify-content: center;
    align-items: center;
  }
  img {
    cursor: pointer;
    width: 50px;
    height: 50px;
    padding: 15px;
    background-color: #6159cb00;
    &:hover {
      background-color: #6159cb28;
    }
  }
  .send-button {
    padding: 0px;
    &:hover {
      opacity: 0.8;
    }
  }
}

.avatar-wrapper{
                @include perfect-center;

                label{
                    position:relative;
                    top:0px;
                    width:9rem;
                    height:9rem;;
                    border-radius:50%;
                    cursor:pointer; 
                    img{
                        position:absolute;
                        top:0px;
                        width:100%;
                        height:100%;
                        border-radius:50%;
                    }

                  }

                }

  .fileShower{
    width:100%;
    display:flex;
    align-items: center;
    i{font-size:35px; color:white; margin:20px 20px;}
    .reset-wrapper{
      i{color: red;
         cursor:pointer;}
      display:flex;
      justify-content:flex-end;
      width:100%;
    }
   
  }


/* Styling the scrollbar */
.emoji-wrapper::-webkit-scrollbar {
  width: 10px;
}

.emoji-wrapper::-webkit-scrollbar-track {
  background-color: #f1f1f1; /* Color of the track */
}

.emoji-wrapper::-webkit-scrollbar-thumb {
  background-color: #888; /* Color of the scroll thumb */
  border-radius: 5px; /* Rounded corners */
}

.emoji-wrapper::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* Hover color of the scroll thumb */
}


  .emoji-wrapper{
    position: absolute;
    width:55%;
    height: 300px;
    overflow-y:scroll;
    background: #303841;
    bottom: 100%;
    padding:5px 5px;
    right: 10%;
    border-radius: 5px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); 
    .emoji-card{
      margin-top:5px;
      width:25%;
      height:25%;
      text-align:center;
      cursor:pointer;
      font-size:30px;
      display:inline-block;
      &:hover {
      background-color: #6159cb28;
    }
    }
}
  
</style>
