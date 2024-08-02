<script setup>
import { RouterLink, RouterView } from 'vue-router'
import DashBoard from './views/DashBoard.vue'
import { provide } from 'vue';
import { useStore } from './stores/store';

provide("storeProvider",useStore());

</script>

<template lang="pug">
main 
 RouterView
</template>

<style lang="scss">
@mixin perfect-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

header {
  width: 100%;
  line-height: 1.5;
  min-height: 100vh;
  .wrapper {
    @include perfect-center;
  }
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}
</style>
