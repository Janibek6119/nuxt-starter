<template>
  <div class="flex-stack items-center">
    <h1>About</h1>
    <PButton
      class="mx-auto mt-8 w-fit"
      severity="info"
      :label="`Click me x${count}`"
      :disabled="loading"
      @click="count++"
    />
    <PButton
      class="mx-auto mt-8 w-fit"
      severity="success"
      label="Submit"
      :disabled="loading || !count"
      :loading="loading"
      @click="onSubmitFake"
    />
    <PButton outlined label="Home" @click="goHome" />
  </div>
</template>

<script setup lang="ts">
const goHome = () => navigateTo("/");

const count = ref(0);
const loading = ref(false);
const toast = useToast();

const onSubmitFake = () => {
  loading.value = true;
  const currentCount = count.value;
  setTimeout(() => {
    loading.value = false;
    toast.add({
      severity: "success",
      summary: "Success",
      detail: `Data submitted successfully: ${currentCount}`,
      life: 3000,
    });
    count.value = 0;
  }, 1000);
};

</script>
