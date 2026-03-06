<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{
  error: NuxtError;
}>();
</script>

<template>
  <NuxtLayout>
    <div class="error-center">
      <div class="title-text">
        <h1>Erreur {{ error.status }}</h1>
        <p>La page est introuvable</p>
      </div>
      <NuxtLink class="btn btn-neutral" to="/">
        Retour a l'accueil
      </NuxtLink>
    </div>
  </NuxtLayout>
</template>

<style lang="scss" scoped>
  .error-center {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  align-items: center;
  height: 100%;
  margin-top: 10%;
  gap: 32px;
}

.title-text {
  display: flex;
  flex-direction: column;
  align-items: center;
}

h1 {
  font-size: 128px;
}
</style>
