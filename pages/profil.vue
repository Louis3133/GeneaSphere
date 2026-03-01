<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user">
    <div>
      {{ authStore.user.name }}
      <div v-if="authStore.user.image" class="avatar">
        <div class="w-8 rounded-full">
          <img :src="authStore.user.image">
        </div>
      </div>
    </div>
  </div>
</template>
