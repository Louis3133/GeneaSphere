<script setup lang="ts">
type Tree = {
  id: number;
  name: string;
  description?: string | null;
};

const { data: publicTrees, pending, error } = await useFetch<Tree[]>("/api/threes", {
  query: { isPublic: true },
});
</script>

<template>
  <section class="container project-section">
    <h1>Trouver des racines</h1>
    <div class="text-section">
      <p>Découvrez les arbres généalogiques partagés publiquement par la communauté. Explorez les racines et les histoires qui nous relient.</p>
    </div>

    <div v-if="pending" class="flex justify-center mt-12">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>

    <div v-else-if="error" class="alert alert-error mt-8">
      <Icon name="tabler:alert-circle" size="24" />
      <span>Mince, impossible de charger les arbres pour le moment.</span>
    </div>

    <div v-else-if="!publicTrees || publicTrees.length === 0" class="alert alert-info mt-8">
      <Icon name="tabler:info-circle" size="24" />
      <span>Il n'y a pas encore d'arbres publics disponibles. Soyez le premier à partager le vôtre !</span>
    </div>

    <div v-else class="trees-grid mt-8">
      <div v-for="tree in publicTrees" :key="tree.id" class="card bg-base-100 shadow-md border border-base-200 transition-transform hover:-translate-y-1 hover:shadow-lg">
        <div class="card-body">
          <h2 class="card-title text-xl">
            {{ tree.name }}
          </h2>
          <p class="text-sm text-base-content/70 line-clamp-3">
            {{ tree.description || 'Aucune description fournie pour cet arbre.' }}
          </p>

          <div class="card-actions justify-end mt-4">
            <NuxtLink :to="`/threes/${tree.id}`" class="btn btn-primary btn-sm">
              Explorer
              <Icon name="tabler:arrow-right" size="16" />
            </NuxtLink>
          </div>
        </div>
      </div>
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
  font-size: 32px;
  font-weight: 500;

  @media (min-width: 998px) {
    font-size: 48px;
  }
}

.text-section {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 24px;

  @media (min-width: 998px) {
    font-size: 18px;
  }

  a {
    text-decoration: underline;
  }
}

.trees-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 24px;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
