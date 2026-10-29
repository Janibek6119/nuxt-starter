<template>
  <div class="j-select">
    <label v-if="label" :for="triggerId">{{ label }}</label>
    <div class="j-select__container" :class="{ 'j-select__container--invalid': invalid }">
      <div
        ref="rootRef"
        class="j-select__field"
        :class="{ 'j-select__field--open': isOpen, 'j-select__field--disabled': disabled }"
      >
        <button
          :id="triggerId"
          type="button"
          class="j-select__box"
          :disabled="disabled"
          :aria-expanded="isOpen"
          :aria-haspopup="'listbox'"
          :aria-controls="isOpen ? listboxId : undefined"
          @click="isOpen = !isOpen"
        >
          <span class="j-select__value" :class="{ 'j-select__value--placeholder': !hasValue }">
            {{ displayValue }}
          </span>
          <ChevronDown class="j-select__icon" :class="{ 'j-select__icon--open': isOpen }" />
        </button>
        <Transition name="j-select-overlay">
          <div v-if="isOpen" class="j-select__overlay">
            <ul :id="listboxId" role="listbox">
              <li
                v-for="(option, index) in options"
                :key="index"
                role="option"
                class="j-select__option line-clamp-1"
                :class="{ 'j-select__option--selected': modelValue === option }"
                :aria-selected="modelValue === option"
                @click="select(option)"
              >
                {{ optionLabel(option) }}
              </li>
            </ul>
          </div>
        </Transition>
      </div>
      <div v-if="message !== null" class="j-select__message line-clamp-1">
        {{ message || "&nbsp;" }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { ChevronDown } from "@lucide/vue";

const props = withDefaults(
  defineProps<{
    label?: string;
    invalid?: boolean;
    /**
     * - `null` hides the message block
     * @default null
     */
    message?: string | null;
    placeholder?: string;
    disabled?: boolean;
    options: readonly T[];
    optionLabel?: (option: T) => string;
  }>(),
  {
    label: undefined,
    message: null,
    placeholder: undefined,
    optionLabel: (option: T) => String(option),
  },
);

const modelValue = defineModel<T | undefined>();

const rootRef = useTemplateRef<HTMLElement>("rootRef");
const triggerId = useId();
const listboxId = `${triggerId}-listbox`;
const isOpen = ref(false);

const hasValue = computed(() => modelValue.value !== undefined && modelValue.value !== null);

const displayValue = computed(() => {
  if (!hasValue.value) return props.placeholder ?? "";
  return props.optionLabel(modelValue.value as Exclude<T, undefined | null>);
});

function close() {
  isOpen.value = false;
}
function select(option: T) {
  modelValue.value = option;
  close();
}
onClickOutside(rootRef, close);

// Escape
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") close();
}
onMounted(() => document.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => document.removeEventListener("keydown", onKeydown));
</script>

<style scoped>
@reference "~/assets/css/main.css";
@layer components {
  .j-select {
    @apply flex-stack gap-2;
  }

  label {
    color: var(--color-secondary);
  }

  .j-select__container {
    @apply flex-stack gap-1;
  }

  .j-select__field {
    position: relative;
  }

  .j-select__box {
    @apply flex-stream rounded-2 w-full gap-4;
    background: var(--color-background);
    border: 1px solid color-mix(in srgb, var(--color-background), var(--color-foreground) 16%);
    color: var(--color-foreground);
    transition-duration: 0.2s;
    cursor: pointer;
    outline: none;
    padding: 8.5px 16px;
  }

  .j-select__box:hover {
    border-color: color-mix(in srgb, var(--color-background), var(--color-foreground) 36%);
  }

  .j-select__box:focus {
    border-color: var(--color-primary);
  }

  .j-select__value {
    flex: 1;
    min-width: 0;
    text-align: left;
  }

  .j-select__value.j-select__value--placeholder {
    color: var(--color-secondary);
  }

  .j-select__icon {
    @apply shrink-0;
    color: var(--color-secondary);
    transition: transform 0.2s ease;
  }

  .j-select__icon.j-select__icon--open {
    transform: rotate(180deg);
  }

  .j-select__overlay {
    @apply rounded-2 absolute left-0 z-1 w-full shadow-md;
    background: color-mix(in srgb, var(--color-background), var(--color-foreground) 4%);
    color: var(--color-foreground);
    border: 1px solid color-mix(in srgb, var(--color-background), var(--color-foreground) 16%);
    top: calc(100% + 4px);
    overflow: hidden;
  }

  ul {
    @apply flex-stack p-1;
    gap: 2px;
    max-height: 200px;
    overflow-y: auto;
  }

  .j-select__option {
    @apply rounded-1 shrink-0;
    background: transparent;
    color: var(--color-foreground);
    cursor: pointer;
    padding: 8px 16px;
    transition: background-color 0.2s ease;
  }

  .j-select__option:hover {
    background: color-mix(in srgb, transparent, var(--color-foreground) 8%);
    color: var(--color-foreground);
  }

  .j-select__option.j-select__option--selected {
    background: color-mix(in srgb, transparent, var(--color-primary) 16%);
    color: var(--color-primary);
  }
  .j-select__option.j-select__option--selected:hover {
    background: color-mix(in srgb, transparent, var(--color-primary) 26%);
    color: var(--color-primary);
  }

  .j-select__field.j-select__field--open > .j-select__box {
    border-color: var(--color-primary);
  }

  .j-select__field.j-select__field--disabled > .j-select__box {
    color: var(--color-secondary);
    cursor: default;
    opacity: 0.6;
  }

  .j-select__message {
    color: var(--color-secondary);
    font-size: 12px;
    line-height: 16px;
  }

  .j-select__container.j-select__container--invalid > .j-select__field > .j-select__box {
    /* @apply border-red-500 text-red-500; */
    border-color: var(--color-error);
  }

  .j-select__container.j-select__container--invalid
    > .j-select__field
    > .j-select__box
    > .j-select__value--placeholder {
    color: color-mix(in srgb, var(--color-background), var(--color-error) 55%);
  }

  .j-select__container.j-select__container--invalid > .j-select__message {
    color: var(--color-error);
  }

  .j-select-overlay-enter-active,
  .j-select-overlay-leave-active {
    transition:
      opacity 0.15s ease,
      transform 0.15s ease;
  }

  .j-select-overlay-enter-from,
  .j-select-overlay-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
}
</style>
