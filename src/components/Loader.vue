<script setup>

</script>

<template>
<div class="loader-container">
    <div class="loader"></div>
</div>

</template>

<style scoped>
.loader-container{
    width:100%;
    height: 100%;
    display:flex;
    justify-content:center !important;
    align-items: center !important;
}
.loader {
  border: 10px solid #f3f3f3;
  border-radius: 50%;
  border-top: 10px solid var(--color-primary);
  width: 80px;
  height: 80px;
  -webkit-animation: spin 2s linear infinite; /* Safari */
  animation: spin 2s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>