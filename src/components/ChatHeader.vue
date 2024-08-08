<script setup>
import { inject , ref,watch } from 'vue';

let store = inject("storeProvider",{});

let chatInfo = ref({
  name: store.state.openedChat == null ? 'Adel Shakal' :  store.state.openedChat.userData.name,
  img: store.state.openedChat == null ? 'src/assets/images.jpeg' : store.state.openedChat.userData.photoURL
})

watch(
  () => store.state.openedChat,
  (newMsg) => {
    if (newMsg.userData!=null) {
      chatInfo.value={
        name :  store.state.openedChat.userData.name,
        img : store.state.openedChat.userData.photoURL
      }
      // 1000 milliseconds = 1 second
    }
  },
  { deep: true } // Enable deep watching
);


const handleClick = (e) => {
const parent = e.target.parentElement.parentElement;
const sibling = e.target.parentElement.parentElement.previousElementSibling;
const sibling2 = e.target.parentElement.parentElement.previousElementSibling.previousElementSibling;
  console.log(sibling,parent)
  if (parent) {
    // Hide the parent element
    parent.setAttribute("style","display:none !important");
}

if (sibling) {
    // Show the sibling element
    sibling.setAttribute("style","display:block !important");
}

if(sibling2){
  sibling2.setAttribute("style","display:block !important");
}
  
}




</script>
<template lang="pug">
div.chat-header
    img(src="../assets/icons/angle-left.png" @click="handleClick")
    | &nbsp; &nbsp; &nbsp;
    img(:src="chatInfo.img")
    h1.contact-name {{ chatInfo.name}}
</template>
<style lang="scss">
.chat-header {
  height: 12%;
  display: flex;
  align-items: center;
  justify-content: start;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  // img:first-child{
  //   cursor:pointer;
  // }
  i{
    color:white;
    font-size:15px;
    cursor:pointer;
  }
}
</style>
