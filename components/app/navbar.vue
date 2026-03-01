<script setup lang="ts">
import AppAuthModal from "~/components/app/auth-modal.vue";
import AppThemeColor from "~/components/app/theme-color.vue";

const authStore = useAuthStore();
</script>

<template>
  <div class="navbar shadow-sm">
    <div class="flex-1">
      <NuxtLink class="text-xl" to="/">
        GeneaSphere
      </NuxtLink>
    </div>
    <div class="flex-none">
      <ul class="menu menu-horizontal px-1">
        <li>
          <details>
            <summary>À propos</summary>
            <ul class="rounded-t-none dropdown-start dropdown-content-rounded">
              <li>
                <NuxtLink to="/project">
                  Le projet
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/mentions-legales">
                  Mentions légales
                </NuxtLink>
              </li>
            </ul>
          </details>
        </li>
        <li>
          <NuxtLink to="/trufo">
            Trouver des graines
          </NuxtLink>
        </li>
        <li v-if="!authStore.loading && authStore.user">
          <NuxtLink to="/dashboard/add">
            Créer une graine
          </NuxtLink>
        </li>
        <li v-if="!authStore.loading && authStore.user">
          <div class="connected-button dropdown dropdown-end">
            <div tabindex="0" role="button" class="btn">
              {{ authStore.user.name }}
              <div v-if="authStore.user.image" class="avatar">
                <div class="w-8 rounded-full">
                  <img :src="authStore.user.image">
                </div>
              </div>
            </div>

            <ul tabindex="-1" class="dropdown-content menu  rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <NuxtLink to="/sign-out">
                  Sign Out
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/profil">
                  Profil
                </NuxtLink>
              </li>
            </ul>
          </div>
        </li>
        <div v-else>
          <li><AppAuthModal /></li>
        </div>
        <div class="nav-icons-link">
          <AppThemeColor />
          <div class="tooltip github" data-tip="Github du projet">
            <a target="_blank" href="https://github.com/Louis3133/GeneaSphere">
              <Icon name="fa7-brands:github" size="24" />
            </a>
          </div>
        </div>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
[data-theme="dark"] {
  .nav-icons-link {
    border-left: 1px solid var(--color-base-content);
  }
}

.navbar {
  padding-inline: 38px;
}

.nav-icons-link {
  display: flex;
  gap: 16px;
  padding-left: 16px;
  border-left: 1px solid black;
  height: 24px;
  align-items: center;
  margin-left: 8px;
}

.connected-button {
  .btn {
    border: none;
    box-shadow: unset;
    background: none;
  }
}

.github {
  width: 24px;
  height: 24px;
}

.dropdown-content-rounded {
  width: max-content;
}

.menu li {
  height: fit-content;
}

.menu {
  display: flex;
  align-items: center;
}
</style>
