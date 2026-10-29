<template>
  <NuxtLink
    v-if="to"
    class="j-button"
    :class="{
      'j-button--unstyled': theme === null,
      'j-button--primary': theme === 'primary',
      'j-button--secondary': theme === 'secondary',
      'j-button--info': theme === 'info',
      'j-button--warning': theme === 'warning',
      'j-button--error': theme === 'error',
      'j-button--size-small': size === 'small',
      'j-button--size-default': size === 'default',
      'j-button--disabled-dimmed': disabledDimmed,
      'j-button--outlined': outlined,
      'j-button--reversed': iconPos === 'right',
      'j-button--disabled': disabled || (VISIBLY_DISABLED_WHEN_LOADING && loading),
      'j-button--loading': loading,
      'j-button--rounded': rounded,
      'j-button--symmetric': symmetric ?? (!label && !$slots.default),
    }"
    :disabled="disabled || (VISIBLY_DISABLED_WHEN_LOADING && loading)"
    :loading="loading"
    :to="disabled || loading ? undefined : to"
  >
    <slot>
      <Loader2 v-if="loading" class="j-button__icon animate-spin" />
      <component :is="icon" v-else-if="icon" class="j-button__icon" />
      <span v-if="label" class="j-button__label">{{ label }}</span>
    </slot>
  </NuxtLink>
  <button
    v-else
    class="j-button"
    :class="{
      'j-button--unstyled': theme === null,
      'j-button--primary': theme === 'primary',
      'j-button--secondary': theme === 'secondary',
      'j-button--info': theme === 'info',
      'j-button--warning': theme === 'warning',
      'j-button--error': theme === 'error',
      'j-button--size-small': size === 'small',
      'j-button--size-default': size === 'default',
      'j-button--disabled-dimmed': disabledDimmed,
      'j-button--outlined': outlined,
      'j-button--reversed': iconPos === 'right',
      'j-button--disabled': disabled || (VISIBLY_DISABLED_WHEN_LOADING && loading),
      'j-button--loading': loading,
      'j-button--rounded': rounded,
      'j-button--symmetric': symmetric ?? (!label && !$slots.default),
    }"
    :disabled="disabled || (VISIBLY_DISABLED_WHEN_LOADING && loading)"
    :loading="loading"
    :type="type"
    @click="onClick"
  >
    <slot>
      <Loader2 v-if="loading" class="j-button__icon animate-spin" />
      <component :is="icon" v-else-if="icon" class="j-button__icon" />
      <span v-if="label" class="j-button__label">{{ label }}</span>
    </slot>
  </button>
</template>

<script setup lang="ts">
import { type LucideIcon, Loader2 } from "@lucide/vue";
const VISIBLY_DISABLED_WHEN_LOADING = false;
export type JButtonProps = {
  label?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  /** @default true */
  disabledDimmed?: boolean;
  theme?: null | "primary" | "secondary" | "info" | "warning" | "error";
  to?: string;
  iconPos?: "left" | "right";
  type?: "submit" | "reset" | "button";
  loading?: boolean;
  outlined?: boolean;
  size?: "small" | "default";
  /**
   * @default true // IF NO LABEL PRESENT
   */
  symmetric?: boolean;
  rounded?: boolean;
};
const props = withDefaults(defineProps<JButtonProps>(), {
  label: undefined,
  icon: undefined,
  theme: "primary",
  disabledDimmed: true,
  to: undefined,
  iconPos: "left",
  type: "button",
  outlined: false,
  size: "default",
  symmetric: undefined, // keep it, otherwise it becomes `false`
});

const emit = defineEmits<{
  (e: "click", event: PointerEvent): void;
}>();

const onClick = (e: PointerEvent) => {
  if (props.disabled || props.loading) return;
  emit("click", e);
};
</script>

<style scoped lang="scss">
@layer components {
  .j-button {
    display: flex;
    align-items: center;
    justify-content: center;
    &.j-button--size-default {
      --font-size: 16px;
      gap: 8px;
      border-radius: 8px;
      padding: 8px 12px;
      .j-button__icon {
        width: var(--font-size);
        height: var(--font-size);
        font-size: var(--font-size);
      }
    }
    &.j-button--size-small {
      --font-size: 12px;
      gap: 4px;
      border-radius: 6px;
      padding: 6px 8px;
    }
    &.j-button__icon {
      width: var(--font-size);
      height: var(--font-size);
      font-size: var(--font-size);
    }
    font-size: var(--font-size);
    font-weight: 600;
    line-height: 1.2;
    transition: all 0.1s ease-in-out;
    user-select: none;
    touch-action: none;
    &.j-button--disabled {
      cursor: default;
      &.j-button--disabled-dimmed {
        opacity: 0.4;
      }
      pointer-events: none;
    }
    &.j-button--loading {
      cursor: progress;
    }
    &.j-button--reversed {
      flex-direction: row-reverse;
    }
    &.j-button--rounded {
      border-radius: 9999px;
    }
    &.j-button--symmetric {
      aspect-ratio: 1/1;
      &.j-button--size-default {
        padding: 8px;
      }
      &.j-button--size-small {
        padding: 6px;
      }
    }
    &.j-button--primary {
      --btn-palette: var(--color-primary);
    }
    &.j-button--secondary {
      --btn-palette: var(--color-secondary);
    }
    &.j-button--info {
      --btn-palette: var(--color-info);
    }
    &.j-button--warning {
      --btn-palette: var(--color-warning);
    }
    &.j-button--error {
      --btn-palette: var(--color-error);
    }
    &:not(.j-button--unstyled) {
      &:not(.j-button--outlined) {
        color: white;
        background-color: var(--btn-palette);
        &:not(.j-button--loading):not(.j-button--disabled) {
          &:hover {
            background-color: color-mix(in srgb, var(--btn-palette), white 8%);
          }
          &:active {
            background-color: color-mix(in srgb, var(--btn-palette), white 16%);
          }
        }
      }
      &.j-button--outlined {
        color: var(--btn-palette);
        background-color: transparent;
        border: 1px solid color-mix(in srgb, transparent, var(--btn-palette) 50%);
        &:not(.j-button--loading):not(.j-button--disabled) {
          &:hover {
            background-color: color-mix(in srgb, transparent, var(--btn-palette) 6%);
          }
          &:active {
            background-color: color-mix(in srgb, transparent, var(--btn-palette) 12%);
          }
        }
      }
    }
  }
}
</style>
