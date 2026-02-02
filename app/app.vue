<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
useHead({
  htmlAttrs: {
    class: layoutStore.darkMode ? "dark" : "",
  },
});
</script>
