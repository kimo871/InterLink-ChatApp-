<script setup>
import { RouterLink, RouterView } from 'vue-router'
import DashBoard from './views/DashBoard.vue'
import { provide , onMounted } from 'vue';
import { useStore } from './stores/store';
import { auth } from './firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

let store = useStore();

onMounted(()=>{
  // Set up the auth state listener
const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
  if (currentUser) {
    console.log(currentUser)
    store.state.user=currentUser;
   
  } else {
    // User is signed out
    user = null;
    console.log('User signed out');
  }
})
})

provide("storeProvider",store);

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
