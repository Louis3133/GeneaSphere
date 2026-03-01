<script setup lang="ts">
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value) {
    colorMode.preference = value ? "dark" : "light";
  },
});
</script>

<template>
  <label class="swap swap-rotate">
    <input v-model="isDark" type="checkbox">
    <Icon class="swap-on h-10 w-10 fill-current" name="tabler:sun" size="24" />
    <Icon class="swap-off h-10 w-10 fill-current" name="tabler:moon" size="24" />
  </label>
</template>

<style scoped lang="scss">

</style>
