<script setup>
let chatInfo = {
  name: 'Adel Shakal',
  img: 'src/assets/images.jpeg'
}
</script>
<template lang="pug">
div.chat-header
    img(:src="chatInfo.img")
    h1.contact-name {{ chatInfo.name }}
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
}
</style>
