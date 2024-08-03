<script setup></script>

<template lang="pug">

.img-container 
 img(alt="empty.." src="../views/messages.png")
 p No Messages Yet...

</template>

<style lang="scss">
@import '@/assets/scss/mixins';

.img-container {
  height: 100%;
  width: 100%;
  @include perfect-center;
  flex-direction: column;
  gap: 20px;
  img {
    width: 300px;
    height: 300px;
  }
}
</style>
