<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <button class="btn btn-outline" :disabled="authStore.loading" @click="authStore.signIn('github')">
    Connexion avec Github
    <Icon name="fa7-brands:github" size="24" />
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
  </button>
</template>
