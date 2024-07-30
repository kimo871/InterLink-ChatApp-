<script setup>
import {onMounted,onUpdated,ref} from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from './firebase/firebaseConfig';
const auth = getAuth(app);
</script>

<template lang="pug">
main
 RouterView


</template>

