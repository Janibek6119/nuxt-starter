<template>
  <span class="j-tooltip">
    <slot />
    <span v-if="label" class="j-tooltip__bubble" role="tooltip">{{ label }}</span>
  </span>
</template>

<script setup lang="ts">
const props = defineProps<{
  text?: string | null;
}>();

const label = computed(() => {
  const text = props.text?.trim();
  return text ? text : null;
});
</script>

<style scoped lang="scss">
@layer components {
  .j-tooltip {
    position: relative;
    display: inline-flex;

    .j-tooltip__bubble {
      position: absolute;
      z-index: 20;
      bottom: calc(100% + 6px);
      left: 50%;
      transform: translateX(-50%);
      padding: 4px 8px;
      border-radius: var(--radius-2);
      background-color: var(--color-foreground);
      color: var(--color-background);
      font-size: 12px;
      font-weight: 500;
      line-height: 1.2;
      white-space: nowrap;
      pointer-events: none;
      visibility: hidden;
      user-select: none;
      box-shadow: 0 4px 14px rgb(0 0 0 / 16%);
    }

    &:hover .j-tooltip__bubble {
      visibility: visible;
    }
  }
}
</style>
