<template>
  <div class="j-button-group">
    <slot />
  </div>
</template>

<style scoped>
@reference "~/assets/css/main.css";
@layer components {
  .j-button-group {
    @apply flex;
  }

  .j-button-group > *:not(:last-child):not(.j-button-group__exempt) {
    @apply rounded-r-none;
  }

  .j-button-group > *:not(:first-child):not(.j-button-group__exempt) {
    @apply rounded-l-none;
  }
}
</style>
