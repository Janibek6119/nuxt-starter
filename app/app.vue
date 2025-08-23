<template>
  <div class="flex min-h-screen flex-col">
    <BigHello class="flex-center" />
    <button @click="toggleDarkMode">Toggle Dark Mode: {{ layoutStore.darkMode }}</button>
  </div>
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
useHead({
  htmlAttrs: {
    class: layoutStore.darkMode ? "dark" : "",
  },
});

const toggleDarkMode = () => {
  layoutStore.darkMode = !layoutStore.darkMode;
};
</script>
