<script setup lang="ts">
import AppThemeColor from "~/components/app/theme-color.vue";

const authStore = useAuthStore();
</script>

<template>
  <div class="flex footer-content w-full flex-col">
    <div class="divider">
      <img src="/footer-logo.svg">
    </div>
    <div class="content-footer flex place-items-center">
      <div class="duo-list">
        <div class="footer-list">
          <p class="title-footer">
            À propos
          </p>
          <div class="footer-links-content">
            <NuxtLink to="/project">
              Le projet
            </NuxtLink>
            <NuxtLink to="/mentions-legales">
              Mentions légales
            </NuxtLink>
          </div>
        </div>

        <div class="footer-list">
          <p class="title-footer">
            Navigation
          </p>
          <div class="footer-links-content">
            <NuxtLink v-if="!authStore.loading && authStore.user" to="/dashboard/add">
              Ajouter une racine
            </NuxtLink>
            <NuxtLink to="/trufo">
              Voir les racines
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="footer-list">
        <p class="title-footer">
          Profil
        </p>
        <div v-if="!authStore.loading && authStore.user" class="footer-links-content">
          <NuxtLink to="/sign-out">
            Déconnexion
          </NuxtLink>
          <NuxtLink to="/dashboard/profil">
            {{ authStore.user.name }}
          </NuxtLink>
        </div>
        <div v-else class="footer-links-content">
          <span class="footer-connexion"><AppAuthModalTwo /></span>
        </div>
      </div>
    </div>
    <div class="divider" />
    <div class="rounded-box content-footer-bottom flex place-items-center">
      <p class="copyright">
        Copyright © 2026 Louis Le Doussal - MIT License
      </p>
      <div class="nav-icons-link">
        <AppThemeColor />
        <div class="tooltip github" data-tip="Github du projet">
          <a target="_blank" href="https://github.com/Louis3133/GeneaSphere">
            <Icon name="fa7-brands:github" size="24" />
          </a>
        </div>
        <div class="tooltip github" data-tip="LinkedIn">
          <a target="_blank" href="https://www.linkedin.com/in/louis-le-doussal-206b7a278/">
            <Icon name="fa7-brands:linkedin" size="24" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
[data-theme="light"] {
  .divider img {
    filter: invert(1);
  }
}

[data-theme="dark"] {
  .footer-content {
    background: #1b232c;
  }
}

.footer-content {
  background: white;
  position: relative;
  z-index: 10;
}

.divider img {
  width: 32px;
  height: 32px;
}

.divider {
  margin-block: unset;
}

.title-footer {
  font-weight: 600;
}

.footer-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: fit-content;
  flex-shrink: 0;
}

.duo-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  flex-wrap: wrap;

  @media (min-width: 578px) {
    gap: 100px;
    flex-direction: row;
  }

  @media (min-width: 998px) {
    gap: 200px;
  }
}

.content-footer {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-inline: auto;
  padding-block: 48px;
  gap: 32px;
  flex-wrap: wrap;
  justify-content: center;

  @media (min-width: 578px) {
    gap: 100px;
    justify-content: unset;
    flex-direction: row;
  }

  @media (min-width: 998px) {
    gap: 200px;
  }
}

.content-footer-bottom {
  display: flex;
  flex-direction: column;
  width: 90%;
  margin-inline: auto;
  justify-content: space-between;
  gap: 32px;
  align-items: center;
  padding-block: 12px;

  @media (min-width: 578px) {
    flex-direction: row;
    gap: 100px;
  }

  @media (min-width: 998px) {
    gap: 200px;
  }
}

.footer-links-content {
  display: flex;
  flex-direction: column;
  gap: 6px;

  a {
    font-size: 14px;
    font-weight: 400;
  }
}

.footer-connexion:deep(.btn) {
  font-size: 14px;
  font-weight: 400;
}

.copyright {
  font-size: 14px;
  font-weight: 400;
}

.nav-icons-link {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.swap {
  margin-bottom: 4px;
}
</style>
