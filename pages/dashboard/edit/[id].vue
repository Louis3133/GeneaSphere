<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

const route = useRoute();
const treeId = Number(route.params.id);

// useFetch est awaité → treeData.value est déjà disponible à ce stade (SSR/hydration)
const { data: treeData, pending, error } = await useFetch<any>(`/api/threes/${treeId}`);

const step = ref(1);
const memberData = ref<any | null>(null);

// Initialisation directe depuis treeData (déjà résolu grâce au await useFetch)
const formData = ref({
  name: treeData.value?.name ?? "",
  description: treeData.value?.description ?? "",
  isPublic: treeData.value?.isPublic ?? false,
});

const membersList = ref<any[]>(
  (treeData.value?.members ?? []).map((m: any) => ({ ...m })),
);

// Graphe identique à add.vue
const graphData = computed(() => {
  const nodes = [];
  const links = [];
  const unionNodesCreated = new Set();

  for (const memberItem of membersList.value) {
    let nodeColor = "#3498db";
    if (memberItem.isDead)
      nodeColor = "#95a5a6";
    else if (memberItem.isAdopted)
      nodeColor = "#f39c12";
    nodes.push({ id: memberItem.id, name: memberItem.name, color: nodeColor });

    if (memberItem.unions && memberItem.unions.length > 0) {
      for (const union of memberItem.unions) {
        if (union.partner) {
          const p1 = Math.min(memberItem.id, union.partner);
          const p2 = Math.max(memberItem.id, union.partner);
          const unionId = `union_${p1}_${p2}`;
          if (!unionNodesCreated.has(unionId)) {
            nodes.push({ id: unionId, name: union.status, color: "#ff4757", val: 0.5 });
            links.push({ source: p1, target: unionId });
            links.push({ source: p2, target: unionId });
            unionNodesCreated.add(unionId);
          }
        }
      }
    }
  }

  for (const memberItem of membersList.value) {
    if (memberItem.parent1 && memberItem.parent2) {
      const p1 = Math.min(memberItem.parent1, memberItem.parent2);
      const p2 = Math.max(memberItem.parent1, memberItem.parent2);
      const unionId = `union_${p1}_${p2}`;
      if (!unionNodesCreated.has(unionId)) {
        nodes.push({ id: unionId, name: "Union", color: "#ff4757", val: 0.5 });
        links.push({ source: p1, target: unionId });
        links.push({ source: p2, target: unionId });
        unionNodesCreated.add(unionId);
      }
      links.push({ source: unionId, target: memberItem.id });
    }
    else {
      if (memberItem.parent1)
        links.push({ source: memberItem.parent1, target: memberItem.id });
      if (memberItem.parent2)
        links.push({ source: memberItem.parent2, target: memberItem.id });
    }
  }

  return { nodes, links };
});

function handleLiveRelations(newRelations: any[]) {
  newRelations.forEach((relation) => {
    const memberExist = membersList.value.find(m => m.id === relation.id);
    if (memberExist) {
      memberExist.parent1 = relation.parent1;
      memberExist.parent2 = relation.parent2;
      memberExist.unions = relation.unions;
    }
  });
}

function updateMemberInList(updatedMember: any) {
  const index = membersList.value.findIndex(m => m.id === updatedMember.id);
  if (index !== -1)
    membersList.value[index] = updatedMember;
}

async function deleteMember(id: number) {
  // Si c'est un membre existant en BDD (id petit), on le supprime via API
  const TEMP_ID_THRESHOLD = 1_000_000_000_000;
  if (id < TEMP_ID_THRESHOLD) {
    await $fetch(`/api/members/${id}`, { method: "DELETE" });
  }
  membersList.value = membersList.value.filter(m => m.id !== id);
  if (memberData.value?.id === id)
    memberData.value = null;
}

const graphContainer = ref<HTMLElement | null>(null);
let myGraphInstance: any = null;

watch(step, async (newStep) => {
  if (newStep === 3) {
    await nextTick();
    if (graphContainer.value && import.meta.client) {
      const ForceGraph3D = (await import("3d-force-graph")).default;
      myGraphInstance = ForceGraph3D()(graphContainer.value)
        .graphData(graphData.value)
        .nodeLabel("name")
        .nodeColor((node: any) => node.color)
        .linkColor((link: any) => link.invisible ? "rgba(0,0,0,0)" : "#cccccc")
        .linkWidth((link: any) => link.invisible ? 0 : 5)
        .linkDirectionalParticles((link: any) => link.invisible ? 0 : 5)
        .showNavInfo(false)
        .height(400)
        .linkDirectionalParticleSpeed(0.001)
        .enableNodeDrag(false)
        .backgroundColor("#ffffff00")
        .dagMode("td")
        .dagLevelDistance(50);
    }
  }
});

watch(graphData, (newGraphData) => {
  if (myGraphInstance && newGraphData)
    myGraphInstance.graphData(newGraphData);
});

// Soumission finale : bulk update
const submitError = ref("");
const saving = ref(false);

async function handleFinalSubmit(payload: { tree: any; members: any[] }) {
  saving.value = true;
  submitError.value = "";
  try {
    await $fetch(`/api/threes/${treeId}/bulk`, {
      method: "PUT",
      body: {
        treeId,
        tree: payload.tree,
        members: payload.members,
      },
    });
    navigateTo("/dashboard/profil");
  }
  catch (e: any) {
    submitError.value = e.data?.statusMessage || "Erreur lors de la sauvegarde";
  }
  finally {
    saving.value = false;
  }
}
</script>

<template>
  <div>
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <span class="loading loading-spinner loading-lg text-primary" />
    </div>

    <div v-else-if="error" class="flex justify-center items-center min-h-screen">
      <div class="alert alert-error max-w-md">
        <Icon name="tabler:alert-circle" />
        <span>Impossible de charger l'arbre.</span>
      </div>
    </div>

    <div v-else class="add-content">
      <!-- Bandeau d'erreur global -->
      <div v-if="submitError" class="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <div class="alert alert-error shadow-lg">
          <Icon name="tabler:alert-circle" />
          <span>{{ submitError }}</span>
        </div>
      </div>

      <div class="sidebar-add">
        <div class="container max-w-md mx-auto mt-4">
          <!-- Étape 1 : Paramètres, pré-remplis depuis formData -->
          <AppThreeParametters
            v-if="step === 1 && treeData"
            :tree-data="formData"
            @next="step = $event.step; formData = $event.formData"
          />

          <!-- Étape 2 : Membres -->
          <AppThreeMembers
            v-if="step === 2"
            :member-data="memberData"
            :threes-id="treeId"
            @cancel-edit="memberData = null"
            @member-updated="updateMemberInList($event)"
            @member-added="membersList.push($event)"
            @next="step = $event.step"
          />

          <!-- Étape 3 : Relations, pré-remplies depuis membersList -->
          <AppThreeRelations
            v-if="step === 3 && treeData"
            :members-list="membersList"
            :tree-data="formData"
            :tree-id="treeId"
            is-edit
            @live-update="handleLiveRelations"
            @submit-edit="handleFinalSubmit"
            @next="step = $event.step"
          />
        </div>
      </div>

      <div class="flex-1">
        <div class="steps-container">
          <ul class="steps lg:steps-horizontal">
            <li class="step step-primary">
              Paramètres
            </li>
            <li class="step" :class="{ 'step-primary': step > 1 }">
              Membres
            </li>
            <li class="step" :class="{ 'step-primary': step > 2 }">
              Relations
            </li>
          </ul>
        </div>

        <!-- Étape 2 : liste des membres -->
        <div v-if="step === 2" class="previsualisation-box">
          <div
            v-for="member in membersList"
            :key="member.id"
            class="collapse collapse-arrow bg-base-100 border border-base-300"
            @click="memberData = member"
          >
            <input type="radio" name="edit-accordion">
            <div class="collapse-title font-semibold">
              <button type="button" @click.stop="deleteMember(member.id)">
                <Icon name="tabler:trash" size="24" />
              </button>
              {{ member.name }}
            </div>
            <div class="collapse-content text-sm">
              {{ member.description }}
            </div>
          </div>
        </div>

        <!-- Étape 3 : graphe 3D -->
        <div v-if="step === 3" class="previsualisation-box-2">
          <div ref="graphContainer" class="test-3d-container" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
[data-theme="dark"] {
  .sidebar-add {
    background: #1b232c !important;
  }
}

.sidebar-add {
  margin-bottom: -12px;
  padding-bottom: 32px;
  padding-inline: 32px;
  padding-top: 48px;
  background: white;
  width: 100%;
  --tw-shadow:
    0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow:
    var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow);

  @media (min-width: 998px) {
    width: 40%;
    min-width: 40%;
  }
}

.previsualisation-box {
  display: flex;
  margin-left: 15%;
  margin-top: 64px;
  max-width: 80%;
  flex-direction: column;
  gap: 24px;
}

.previsualisation-box-2 {
  display: flex;
  margin-left: 15%;
  margin-top: 64px;
  max-width: 80%;
  flex-direction: column;
  gap: 24px;
}

.add-content {
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: 998px) {
    flex-direction: row-reverse;
  }
}

.steps-container {
  justify-content: center;
  margin-top: 32px;
  display: flex;
}

.collapse-title {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
</style>
