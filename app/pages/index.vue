<template>
  <div class="flex-stack items-center gap-4">
    <PButton severity="secondary" @click="toggleDarkMode">
      {{ $t("toggleDarkMode") }}: {{ layoutStore.darkMode }}
    </PButton>
    <JTable :columns="cols" :rows="fmtCurrencies" striped />
    <JSelect v-model="currency" class="w-30" :options="CURRENCIES" />
    <JButton :label="$t('about')" to="/about" />
  </div>
</template>

<script setup lang="ts">
const layoutStore = useLayoutStore();
const toggleDarkMode = () => {
  layoutStore.darkMode = !layoutStore.darkMode;
};

const CURRENCIES = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "SEK", "NZD"] as const;
type CurrencyType = (typeof CURRENCIES)[number];

const fmtCurrencies = computed(() => CURRENCIES.map((c) => ({ label: $t(`currencies.${c}`), value: c })));
const cols = computed(() =>
  defineTableColumns([
    { key: "label", header: $t("currencies.name") },
    { key: "value", header: $t("currencies.ticker") },
  ]),
);
const currency = ref<CurrencyType>(CURRENCIES[0]);
</script>
