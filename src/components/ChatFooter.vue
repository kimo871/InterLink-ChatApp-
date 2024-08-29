<script setup>
import ChatController from '@/Contollers/Chat';
import emoji from '../assets/icons/emoji.svg'
import fileShare from '../assets/icons/fileShare.svg'
import sendButton from '../assets/icons/sendButton.svg'
import Emojis from './Emojis.vue';
import { ref , inject , watch } from 'vue';


let store = inject("storeProvider",{});

const emojis =  ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹', '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾']

let fileValue = ref({})

let file = ref({
  status:false,
  content:null,
})

let element =  ref(null);

watch(
  () => file,
  (newMsg) => {
    if (newMsg) {
      console.log(file.value,"mode");
    }
  },
  { deep: true } 
);



let showEmojis = ref(false)

let inputValue = ref("");

const sendMessage = async()=>{
  try{
  console.log(inputValue.value);
  const res = await sendOption(); 
  console.log(store.state.openedChat.chatType)                                                                                   
  const controller = new ChatController(store.state.openedChat.chatType,store)
  controller.strategy.sendMessage(res,store.state.openedChat.chatId);

  //store.sendGroupMessage(res,store.state.openedChat.chatId);
  //console.log(res);
  }
  catch(err){
    console.log(err);
  }
  inputValue.value="";
  file.value = {status:false,content:null}
}

const sendOption = ()=>{

    if(inputValue.value!=""){
      console.log("inputext here..")
      return inputValue.value;
    }

    else if(file.value.content){
       return file.value.content;
}
    else {
      console.log("rejected")
      return null
     
    }
}

let clickEmoji = (emoji)=>{
  inputValue.value+=emoji
}

const handleFile = (e)=>{
  inputValue.value = "";
  console.log(e.target.files[0])
  if(!validateSizeFile(e.target.files[0])) return alert(" Max File Size is 3000 kb ! ")
  file.value = {status:true,content:e.target.files[0]};
  e.target.value = "";
}

const validateSizeFile = (file)=>{
   return  file.size/1024 <= 3000
}

</script>
<template lang="pug">
div.chat-footer
    input(v-if="!file.status" type="text" id="message-text" placeholder="Enter Message..." v-model="inputValue" @keyup.enter="sendMessage" @focus="showEmojis=false")
    div.fileShower(v-if="file.status")
     i(class="fa-solid fa-file")
     p {{ file.content.name }}
     .reset-wrapper 
      i(@click="()=>file={status:false,content:null}" class="fa-solid fa-circle-xmark")
    img(v-if="!file.status" :src="emoji" @click="()=>{showEmojis = !showEmojis}") 
    Emojis(v-if="showEmojis"  fontSize="30" :click="clickEmoji"  :emojis="emojis")
  
    div.input-wrapper
     label(for="file")
      img(:src="fileShare").file-share
     input( type="file" , @change="handleFile",hidden,name="file",id="file")
    
    img(:src="sendButton" @click="sendMessage").send-button 
</template>

