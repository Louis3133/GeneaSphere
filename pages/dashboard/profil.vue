<script setup lang="ts">
type Tree = {
  id: number;
  name: string;
  description?: string | null;
  isPublic: boolean;
};

const authStore = useAuthStore();

const { data: myTrees, pending, error, refresh } = await useFetch<Tree[]>("/api/threes", {
  headers: useRequestHeaders(["cookie"]) as Record<string, string>,
});

async function deleteTree(id: number) {
  try {
    await $fetch(`/api/threes/${id}`, {
      method: "DELETE",
    });
    await refresh();
  }
  catch (err: any) {
    console.error("ÉCHEC :", err.message);
  }
}
</script>

<template>
  <section class="container project-section">
    <div v-if="!authStore.loading && authStore.user" class="profile-header bg-base-100 p-8 rounded-2xl border border-base-300">
      <div class="flex items-center gap-6">
        <div class="avatar">
          <div class="avatar-item rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img :src="authStore.user.image" alt="Avatar">
          </div>
        </div>
        <div>
          <h1 class="username">
            {{ authStore.user.name }}
          </h1>
          <p class="email-user">
            {{ authStore.user.email }}
          </p>
        </div>
      </div>

      <NuxtLink to="/dashboard/add" class="btn btn-primary">
        <Icon name="tabler:plus" size="20" />
        Nouvel Arbre
      </NuxtLink>
    </div>

    <div class="mt-12">
      <h2 class="text-2xl font-semibold mb-6">
        Mes Arbres Généalogiques
      </h2>

      <div v-if="pending" class="flex justify-center py-12">
        <span class="loading loading-spinner loading-lg text-primary" />
      </div>

      <div v-else-if="error" class="alert alert-error">
        <Icon name="tabler:alert-circle" />
        <span>Erreur lors de la récupération de vos arbres.</span>
      </div>

      <div v-else-if="!myTrees || myTrees.length === 0" class="text-center py-20 border-2 border-dashed border-base-300 rounded-2xl">
        <Icon name="tabler:tree" size="48" class="text-base-content/20 mb-4" />
        <p class="text-xl text-base-content/50">
          Vous n'avez pas encore créé d'arbre.
        </p>
        <NuxtLink to="/dashboard/add" class="btn btn-outline btn-primary mt-4">
          Commencer maintenant
        </NuxtLink>
      </div>

      <div v-else class="trees-grid">
        <div v-for="tree in myTrees" :key="tree.id" class="card bg-base-100 shadow-sm border border-base-200 transition-all hover:shadow-md">
          <div class="card-body">
            <div class="flex justify-between items-start">
              <h2 class="card-title text-xl">
                {{ tree.name }}
              </h2>
              <div v-if="tree.isPublic" class="badge badge-success badge-outline text-[10px]">
                Public
              </div>
              <div v-else class="badge badge-ghost badge-outline text-[10px]">
                Privé
              </div>
            </div>

            <p v-if="tree.description" class="text-sm text-base-content/70 line-clamp-2 my-2">
              {{ tree.description }}
            </p>

            <div class="card-actions justify-end mt-4 pt-4">
              <button class="btn btn-ghost btn-sm text-error" @click.prevent="deleteTree(tree.id)">
                <Icon name="tabler:trash" size="18" />
              </button>

              <NuxtLink :to="`/dashboard/edit/${tree.id}`" class="btn btn-ghost btn-sm">
                <Icon name="tabler:edit" size="18" />
              </NuxtLink>

              <NuxtLink :to="`/threes/${tree.id}`" class="btn btn-primary btn-sm px-6">
                Ouvrir
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.project-section {
  max-width: 80%;
  margin-inline: auto;
  padding-block: 60px;
}

.username {
  font-size: 20px;
  font-weight: 600;

  @media (min-width: 578px) {
    font-size: 32px;
  }
}

.avatar-item {
  width: 50px;

  @media (min-width: 460px) {
    width: 60px;
  }

  @media (min-width: 578px) {
    width: 100px;
  }
}

.email-user {
  font-size: 12px;
  color: #7f7f7f;

  @media (min-width: 578px) {
    font-size: 16px;
  }
}

.profile-header {
  box-shadow: 0 4px 20px -5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (min-width: 800px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.trees-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}
</style>
