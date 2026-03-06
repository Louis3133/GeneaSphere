<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div class="index-contain">
    <div class="main-title">
      <div class="title-suptitle">
        <h1>Visualisez vos racines généalogiques </h1>
      </div>
      <p class="main-subtitle">
        Ou découvrez celles des autres
      </p>
      <div class="main-buttons">
        <NuxtLink v-if="!authStore.loading && authStore.user" to="/dashboard/add" class="btn btn-complete btn-neutral">
          Créer une racine
        </NuxtLink>
        <NuxtLink to="/trufo" class="btn btn-neutral btn-outline">
          Trouver une racine
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: 48px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  letter-spacing: -1.5px;
  margin: unset;

  @media (min-width: 578px) {
    font-size: 60px;
  }

  @media (min-width: 998px) {
    font-size: 76px;
  }
}

.title-suptitle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.main-buttons {
  display: flex;
  flex-direction: row;
  gap: 24px;

  .btn {
    border-radius: 40px;
    box-shadow: unset;
  }
}

.main-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  margin-top: 90px;
  max-width: 950px;
  margin-inline: auto;
  margin-bottom: 20%;

  @media (min-width: 578px) {
    margin-top: 124px;
  }

  @media (min-width: 998px) {
    margin-top: 164px;
  }
}

.video-container {
  border-radius: 24px 0 0 24px;
  height: 400px;
  width: 60%;
  border: 1px solid black;
  margin-bottom: 5%;
}

.text-rotate {
  font-size: 18px;
}

[data-theme="dark"] {
  .btn-outline {
    border: 1px solid var(--color-base-content);
    color: var(--color-base-content);

    &:hover {
      background: transparent;
    }
  }
}

.index-contain {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 100px;
  align-items: center;
}

.btn-complete {
  color: white;
}

.main-subtitle {
  text-align: left;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -1.5px;

  @media (min-width: 578px) {
    font-size: 24px;
  }

  @media (min-width: 998px) {
    font-size: 32px;
  }
}
</style>
