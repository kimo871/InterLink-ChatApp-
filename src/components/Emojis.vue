<script setup>
defineProps({
    click:{
        type:Function,
        required:true
    },
    emojis:{
        type:Array,
        required:true
    },
    fontSize:{
        type:String,
        required:true
    }
})

</script>

<template lang="pug">
.emoji-wrapper
 span(v-for="emoji in emojis" :style="{ 'font-size': fontSize+'px' }"  class="emoji-card" @click="()=>click(emoji)") {{ emoji }}
</template>

<style lang="scss">
 span{
    width: 25%;
    height: 100%;
    text-align: center;
    cursor: pointer;
    &:hover {
      background-color: #6159cb28;
    }
    
}



emoji-wrapper{
    width: fit-content;
    background: #303841;
    padding: 5px 5px;
    position:absolute;
    border-radius: 5px;
    top:50%;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2);
    .emoji-card{
      padding:12px;
      width:10px;
      height:10px;
      text-align:center;
      cursor:pointer;
      font-size:20px;
      display:inline-block;
      
}
    &:hover {
      background-color: #6159cb28;
    }

}
</style>