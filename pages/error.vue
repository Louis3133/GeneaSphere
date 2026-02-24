<script lang="ts" setup>
const route = useRoute();
const error = route.query.error || " An unknown error occured";
</script>

<template>
  <div role="alert" class="alert alert-error">
    <span>Oh no ! {{ error }}</span>
  </div>
</template>
