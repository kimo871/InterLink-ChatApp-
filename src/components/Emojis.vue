<script setup>
defineProps({
    click:{
        type:Function,
        required:true
    },
    emojis:{
        type:Array,
        required:true
    }
})

</script>

<template lang="pug">
.emoji-wrapper
 span(v-for="emoji in emojis" class="emoji-card" @click="()=>click(emoji)") {{ emoji }}
</template>

<style lang="scss">
 span{
    width: 25%;
    height: 100%;
    text-align: center;
    cursor: pointer;
    font-size: 22px;
    &:hover {
      background-color: #6159cb28;
    }
    
}
</style>