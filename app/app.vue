<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <PToast />
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
useHead({
  htmlAttrs: {
    class: layoutStore.darkMode ? "dark" : "",
  },
});
</script>
