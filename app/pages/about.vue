<template>
  <div class="flex-stack items-center">
    <h1>About</h1>
    <button class="cursor-pointer underline" @click="goHome">Home</button>
  </div>
</template>

<script setup lang="ts">
const goHome = () => navigateTo("/");
</script>
