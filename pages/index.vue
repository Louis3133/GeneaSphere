<script lang="ts" setup>
import { onMounted, ref } from "vue";

const graphContainer = ref<HTMLElement | null>(null);
const drawer = ref<HTMLInputElement | null>(null);

onMounted(async () => {
  if (import.meta.client) {
    const ForceGraph3D = (await import("3d-force-graph")).default;

    // Données minimales pour le test
    const data = {
      nodes: [{ id: "Parent" }, { id: "Enfant" }, { id: "Grand-pere" }, { id: "Grand-mere" }, { id: "femme" }],
      links: [{ source: "femme", target: "Parent" }, { source: "Parent", target: "Enfant" }, { source: "Grand-pere", target: "Parent" }, { source: "Grand-mere", target: "Parent" }],
    };

    if (graphContainer.value) {
      ForceGraph3D()(graphContainer.value)
        .graphData(data)
        .nodeLabel("id")
        .showNavInfo(false)
        .width(1000)
        .height(400)
        .linkWidth(5)
        .linkDirectionalParticles(5)
        .linkDirectionalParticleSpeed(0.001)
        .enableNodeDrag(false)
        .onNodeClick(() => {
          if (drawer.value) {
            drawer.value.checked = true;
          }
        })
        .backgroundColor("#ffffff00");
    }
  }
});
</script>

<template>
  <div>
    <div class="main-title">
      <div class="title-suptitle">
        <span class="text-rotate">
          <span class="justify-items-center">
            <span>🌳 Créer vos racines </span>
            <span>🤝️ Collaborez</span>
            <span>👀 Visualisez</span>
          </span>
        </span>
        <h1>Visualisez vos racines généalogiques </h1>
      </div>
      <p class="main-subtitle">
        Ou découvrez celles des autres
      </p>
      <div class="main-buttons">
        <NuxtLink to="/dashboard/add" class="btn btn-complete btn-neutral">
          Créer une graine
        </NuxtLink>
        <NuxtLink to="/trufo" class="btn btn-neutral btn-outline">
          Trouver une graine
        </NuxtLink>
      </div>
    </div>
    <div ref="graphContainer" class="test-3d-container" />
    <div class="drawer drawer-end">
      <input
        id="my-drawer-5"
        ref="drawer"
        type="checkbox"
        class="drawer-toggle"
      >

      <div class="drawer-content" />

      <div class="drawer-side">
        <label for="my-drawer-5" class="drawer-overlay" />
        <ul class="menu bg-base-200 min-h-full w-80 p-4">
          <li><a>Sidebar Item 1</a></li>
          <li><a>Sidebar Item 2</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h1 {
  text-align: center;
  font-size: 76px;
  font-style: normal;
  font-weight: 900;
  line-height: normal;
  letter-spacing: -1.5px;
  margin: unset;
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
  margin-top: 164px;
  max-width: 955px;
  margin-inline: auto;
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

.btn-complete {
  color: white;
}

.main-subtitle {
  text-align: center;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
  letter-spacing: -1.5px;
}
</style>
