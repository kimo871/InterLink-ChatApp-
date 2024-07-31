<script setup>
import {onMounted,onUpdated,ref} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { provide } from 'vue';
import { useStore } from './stores/store';

let {state,signUp} = useStore();

console.log(state)

provide("storeProvider",useStore());

</script>

<template lang="pug">
main
 RouterView


</template>

