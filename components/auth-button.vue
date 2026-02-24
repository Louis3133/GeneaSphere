<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div v-if="!authStore.loading && authStore.user" class="dropdown">
    <div tabindex="0" role="button" class="btn m-1">
      {{ authStore.user.name }}
      <div v-if="authStore.user.image" class="avatar">
        <div class="w-8 rounded-full">
          <img :src="authStore.user.image">
        </div>
      </div>
    </div>

    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
      <li>
        <NuxtLink to="/sign-out">
          Sign Out
        </NuxtLink>
      </li>
    </ul>
  </div>
  <button v-else :disabled="authStore.loading" class="btn btn-accent" @click="authStore.signIn">
    Sign In With Github
    <span v-if="authStore.loading" class="loading loading-spinner loading-md" />
  </button>
</template>
