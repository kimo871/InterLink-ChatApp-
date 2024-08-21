<script setup>
import { inject } from 'vue'
let store = inject('storeProvider', {})
</script>

<template lang="pug">
.profile 
    .section
        img(:src="store.state.user.photoURL")
    .section
        h5 Name
        h3 {{store.state.user.displayName}}
    .section
        h5 Email
        h3 {{store.state.user.email}}
</template>



