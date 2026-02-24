<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(() => {
  authStore.signOut();
});
</script>

<template>
  <div>
    <span v-if="authStore.loading" class="loading loading-spinner loading-xl" />
    Yeah
  </div>
</template>
