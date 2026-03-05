<script setup lang="ts">
import AppAuthModal from "~/components/app/auth-modal.vue";
import AppThemeColor from "~/components/app/theme-color.vue";

const authStore = useAuthStore();
</script>

<template>
  <div class="drawer drawer-end">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle">
    <div class="drawer-content flex flex-col">
      <div class="navbar shadow-sm w-full">
        <div class="flex-1 ">
          <NuxtLink class="logo text-xl" to="/">
            <img src="/Geneasphere.svg" alt="Geneasphere">
            GeneaSphere
          </NuxtLink>
        </div>
        <div class="flex-none lg:hidden">
          <label for="my-drawer-2" aria-label="open sidebar" class="btn btn-square btn-ghost">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block h-6 w-6 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
        </div>
        <div class="hidden flex-none lg:block">
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
                Trouver des racines
              </NuxtLink>
            </li>
            <li v-if="!authStore.loading && authStore.user">
              <NuxtLink to="/dashboard/add">
                Créer une racine
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

                <ul tabindex="-1" class="dropdown-content dropdown-content-profil menu  rounded-box z-1 w-52 p-2 shadow-sm">
                  <li>
                    <NuxtLink to="/sign-out">
                      Déconnexion
                    </NuxtLink>
                  </li>
                  <li>
                    <NuxtLink to="/dashboard/profil">
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
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />
      <ul class="menu bg-base-200 min-h-full w-80 p-4">
        <!-- Sidebar content here -->
        <li><a>Sidebar Item 1</a></li>
        <li><a>Sidebar Item 2</a></li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
[data-theme="dark"] {
  .nav-icons-link {
    border-left: 1px solid var(--color-base-content);
  }

  .dropdown-content-profil {
    background: #222e3a;
  }
}

.logo {
  display: flex;
  flex-direction: row;
  gap: 12px;
  align-items: center;
}

.navbar {
  padding-inline: 38px;
  position: relative;
  z-index: 10;
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

.dropdown-content-profil {
  background: white;
}

.dropdown-content-profil.menu {
  align-items: unset;
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
