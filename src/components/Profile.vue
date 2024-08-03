<script setup>
import { inject } from 'vue'
let store = inject('storeProvider', {})
</script>

<template lang="pug">
.profile 
    .section
        img(:src="store.state.user.photoURL")
    .section
        h2 Name
        h3 {{store.state.user.displayName}}
    .section
        h2 Email
        h3 {{store.state.user.email}}
</template>

<style lang="scss" scoped>
.profile {
  display: flex;
  justify-content: start !important;

  height: 100vh;
  padding: 100px 0px;
  gap: 20%;
  h2 {
    color: white;
    font-size: 16px;
  }
  h3 {
    color: #a6b0cf;
    font-size: 14px;
  }
  .section {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
  }
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>
