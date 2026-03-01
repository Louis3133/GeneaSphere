<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <button class="btn btn-neutral" :disabled="authStore.loading" @click="authStore.signIn('google')">
    Connexion avec Google
    <Icon name="fa7-brands:google" size="24" />
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
  </button>
</template>
