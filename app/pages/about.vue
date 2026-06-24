<template>
  <div class="flex-stack items-center gap-4">
    <h1>{{ $t("about") }}</h1>
    <JHoldButton :loading="running" @click="onClickRun" />
    <JButton :icon="PrimeIcons.PLAY" :loading="running" @click="onClickRun" />
    <PButton severity="info" :label="$t('clickMe', { count })" :disabled="loading" @click="count++" />
    <PButton
      severity="success"
      :label="$t('common.submit')"
      :disabled="loading || !count"
      :loading="loading"
      @click="onSubmitFake"
    />
    <JButton :label="$t('home')" to="/" />
    <JInput v-model="username" class="w-60" :label="$t('username')" :placeholder="$t('common.usernamePlaceholder')" />
    <JInput
      v-model="password"
      class="w-60"
      :label="$t('password')"
      :placeholder="$t('common.passwordPlaceholder')"
      type="password"
    />
  </div>
</template>

<script setup lang="ts">
import { PrimeIcons } from "@primevue/core/api";

const count = ref(0);
const loading = ref(false);
const toast = useToast();

const username = ref("");
const password = ref("");

const onSubmitFake = () => {
  loading.value = true;
  const currentCount = count.value;
  setTimeout(() => {
    loading.value = false;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: $t("dataSubmittedSuccessfully", { count: currentCount }),
      life: 3000,
    });
    count.value = 0;
  }, 1000);
};

const running = ref(false);
const onClickRun = async () => {
  running.value = true;
  await new Promise((resolve) => setTimeout(resolve, 2000));
  running.value = false;
};
</script>
