<script setup>
const props = defineProps({
  title: String,
  unread:Number,
  icon: String,
  lastMsg: String,
  index: Number,
  isActive: Boolean
})


const emit = defineEmits(['activate'])

const handleClick = (e) => {
  const parent = e.target.closest(".sidebar");
  const sibling = parent.nextElementSibling;
  const sibling2 = parent.previousElementSibling;
  window.onresize = (e)=> reset(e,parent,sibling,sibling2);
  if(window.innerWidth < 1200){
  console.log(sibling,parent)
  if (parent) {
    // Hide the parent element
    parent.setAttribute("style","display:none !important");
}

if (sibling) {
    // Show the sibling element
    sibling.setAttribute("style","display:flex !important");
}

if(sibling2){
  sibling2.setAttribute("style","display:none !important");
}

  }

  emit('activate', props.index)
}


const reset = (e)=>{
  if (window.innerWidth > 1200) {

    document.querySelector(".chatroom").removeAttribute("style")
    document.querySelector(".sidebar").removeAttribute("style")
    document.querySelector(".navbar").removeAttribute("style")
  }
}

</script>

<template lang="pug">
div.chatcard(:class="{ active: isActive }" @click="handleClick")
    img(:src="icon")
    .chatcard-info
        h1.contact-name {{ title }}
        div.messageDetails
         p(classs="contact-message" :style="{ color: unread > 0 ? 'white' : 'inherit' }") {{ lastMsg }}
         span(v-if="unread > 0" class="badge") {{ unread }}
</template>

