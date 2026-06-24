<template>
  <div class="j-hello">{{ $t("hello") }}</div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
@layer components {
  .j-hello {
    @apply text-temp text-4xl font-bold;
  }
}
</style>
