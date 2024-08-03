<script setup>
const props = defineProps({
  title: String,
  icon: String,
  lastMsg: String,
  index: Number,
  isActive: Boolean
})

const emit = defineEmits(['activate'])

const handleClick = () => {
  emit('activate', props.index)
}
</script>

<template lang="pug">
.chatcard(:class="{ active: isActive }" @click="handleClick")
  img(:src="icon")
  .chatcard-info
    h1.contact-name {{ title }}
    p.contact-message {{ lastMsg }}
</template>
<style lang="scss" scoped>
.chatcard {
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  gap: 10px;
  padding: 10px;
  background-color: #303841;
  border-radius: 5px;
  cursor: pointer;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
  .chatcard-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: start;
    gap: 5px;
  }
  .contact-name {
    color: white;
  }
}
.active {
  background-color: #0b0b0b71;
}
</style>
