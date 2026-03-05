<script lang="ts" setup>
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
        <NuxtLink to="/dashboard/add" class="btn btn-complete btn-neutral">
          Créer une racine
        </NuxtLink>
        <NuxtLink to="/trufo" class="btn btn-neutral btn-outline">
          Trouver une racine
        </NuxtLink>
      </div>
    </div>

    <div class="video-container" />
  </div>
</template>

<style lang="scss" scoped>
h1 {
  text-align: left;
  font-size: 40px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  letter-spacing: -1.5px;
  margin: unset;

  @media (min-width: 578px) {
    font-size: 48px;
  }

  @media (min-width: 998px) {
    font-size: 55px;
  }
}

.title-suptitle {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.video-container {
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
  align-items: start;
  gap: 36px;
  margin-left: 5%;
  margin-top: 90px;
  max-width: 850px;
  margin-right: auto;
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
