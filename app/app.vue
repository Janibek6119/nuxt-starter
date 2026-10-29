<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
  <JToast />
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
useHead({
  htmlAttrs: {
    class: computed(() => (layoutStore.darkMode ? "dark" : "")),
  },
});
</script>
