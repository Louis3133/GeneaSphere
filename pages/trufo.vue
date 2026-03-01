<script setup lang="ts">
</script>

<template>
  <section class="container project-section">
    <h1>Trufo</h1>
    <div class="text-section">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.project-section {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-inline: auto;
  padding-block: 90px;
  gap: 32px;
}

h1 {
  font-size: 48px;
  font-weight: 500;
}

h2 {
  font-size: 24px;
  font-weight: 500;
  padding-block: 12px;
}

.text-section {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  gap: 24px;

  a {
    text-decoration: underline;
  }
}
</style>
