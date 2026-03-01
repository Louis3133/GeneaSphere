<script lang="ts" setup>
const authStore = useAuthStore();
await authStore.init();
</script>

<template>
  <div class="flex min-h-screen flex-col ">
    <header>
      <AppNavbar />
    </header>
    <main class="flex-1 flex flex-col">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>

</style>
