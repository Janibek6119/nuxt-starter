<template>
  <div class="flex-stack items-center">
    <button @click="toggleDarkMode">Toggle Dark Mode: {{ layoutStore.darkMode }}</button>
    <NuxtLink class="underline" to="/about">About</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
const toggleDarkMode = () => {
  layoutStore.darkMode = !layoutStore.darkMode;
};
</script>
