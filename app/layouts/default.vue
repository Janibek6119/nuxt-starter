<template>
  <div class="flex-stack min-h-screen gap-6">
    <JHello class="flex-center" />
    <JSelect
      class="mx-auto w-40"
      :model-value="$i18n.locale"
      :options="$i18n.locales.value.map((l) => l.code)"
      :option-label="(locale) => $t('_thisLanguage', {}, { locale })"
      @update:model-value="$event && $i18n.setLocale($event)"
    />
    <slot />
  </div>
</template>
