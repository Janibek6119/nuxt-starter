<template>
  <div class="flex flex-col items-center justify-center">
    <h1>About</h1>
    <button class="cursor-pointer underline" @click="goHome">Home</button>
  </div>
</template>

<script setup lang="ts">
const goHome = () => navigateTo("/");
</script>
