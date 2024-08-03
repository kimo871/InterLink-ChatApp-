<script setup>
import { inject } from 'vue'
let store = inject('storeProvider', {})
</script>

<template lang="pug">
.profile 
    h1 some profile 
</template>

<style lang="scss" scoped>
.profile {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  h1 {
    color: white;
  }
}
</style>
