<template>
  <div class="flex flex-col items-center justify-center">
    <PButton class="mx-auto mt-8 w-fit" severity="secondary" @click="toggleDarkMode">
      Toggle Dark Mode: {{ layoutStore.darkMode }}
    </PButton>
    <NuxtLink to="/about"><PButton outlined label="About" /></NuxtLink>
  </div>
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
const toggleDarkMode = () => {
  layoutStore.darkMode = !layoutStore.darkMode;
};
</script>
