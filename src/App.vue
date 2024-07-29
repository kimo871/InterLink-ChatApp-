<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template lang="pug">
header 
 div.wrapper 
   h1 Starter of The Project !

</template>

<style  lang="scss">

@mixin perfect-center{
 display:flex;
 justify-content:center;
 align-items:center;
}

header {
  width:100%;
  line-height: 1.5;
  max-height: 100vh;
  .wrapper{
    @include perfect-center;

  }

}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

</style>
