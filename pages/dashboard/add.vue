<script setup lang="ts">
import { computed, nextTick, ref, watch } from "vue";

const step = ref(1);
const three = ref<number | null>(null);
const memberData = ref<any | null>(null);
const membersList = ref<any[]>([]);
const formData = ref({ name: "", description: "", isPublic: false });

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

  for (const memberItem of membersList.value) {
    if (!memberItem.parent1 && !memberItem.parent2 && memberItem.unions?.length > 0) {
      for (const u of memberItem.unions) {
        if (u.partner) {
          const partner = membersList.value.find(m => m.id === u.partner);
          if (partner && (partner.parent1 || partner.parent2)) {
            const parentId = partner.parent1 || partner.parent2;
            links.push({ source: parentId, target: memberItem.id, invisible: true });
            break;
          }
        }
      }
    }
  }

  return { nodes, links };
});

function handleLiveRelations(newRelations) {
  newRelations.forEach((relation) => {
    const memberExist = membersList.value.find(m => m.id === relation.id);
    if (memberExist) {
      memberExist.parent1 = relation.parent1;
      memberExist.parent2 = relation.parent2;
      memberExist.unions = relation.unions;
    }
  });
}

function updateMemberInList(updatedMember) {
  const index = membersList.value.findIndex(m => m.id === updatedMember.id);
  if (index !== -1) {
    membersList.value[index] = updatedMember;
  }
}

async function deleteMember(id: number) {
  await $fetch(`/api/members/${id}`, {
    method: "delete",
  });

  membersList.value = membersList.value.filter(m => m.id !== id);

  if (memberData.value && memberData.value.id === id) {
    memberData.value = null;
  }
}

const graphContainer = ref<HTMLElement | null>(null);

let myGraphInstance = null;

watch(step, async (newStep) => {
  if (newStep === 3) {
    await nextTick();

    if (graphContainer.value && import.meta.client) {
      const ForceGraph3D = (await import("3d-force-graph")).default;

      const data = graphData.value;

      myGraphInstance = ForceGraph3D()(graphContainer.value)
        .graphData(data)
        .nodeLabel("name")
        .nodeColor(node => node.color)
        .linkColor(link => link.invisible ? "rgba(0,0,0,0)" : "#cccccc")
        .linkWidth(link => link.invisible ? 0 : 5)
        .linkDirectionalParticles(link => link.invisible ? 0 : 5)
        .showNavInfo(false)
        .width(600)
        .height(400)
        .linkDirectionalParticleSpeed(0.001)
        .enableNodeDrag(false)
        .backgroundColor("#ffffff00")
        .dagMode("td")
        .dagLevelDistance(50);
    }
  }
});

watch(graphData, async (newGraphData) => {
  if (myGraphInstance && newGraphData) {
    myGraphInstance.graphData(newGraphData);
  }
});
</script>

<template>
  <div class="add-content">
    <div class="sidebar-add">
      <div class="container max-w-md mx-auto mt-4">
        <AppThreeParametters v-if="step === 1" :tree-data="formData" @next="step = $event.step; three = $event.three; formData = $event.formData" />
        <AppThreeMembers v-if="step === 2" :member-data="memberData" :threes-id="three" @cancel-edit="memberData = null" @member-updated="updateMemberInList($event)" @member-added="membersList.push($event)" @next="step = $event.step; three = $event.three" />
        <AppThreeRelations v-if="step === 3" :members-list="membersList" :tree-data="formData" @live-update="handleLiveRelations" @next="step = $event.step" />
      </div>
    </div>

    <div class="right-panel">
      <div class="steps-container">
        <ul class="steps lg:steps-horizontal">
          <li class="step step-primary">
            Paramètres
          </li>
          <li class="step" :class="{ 'step-primary': step > 1 }">
            Membres
          </li>
          <li class="step" :class="{ 'step-primary': step > 2 }">
            Relation
          </li>
        </ul>
      </div>

      <div v-if="step === 2" class="previsualisation-box">
        <div v-for="member in membersList" :key="member.id" class="collapse collapse-arrow bg-base-100 border border-base-300" @click="memberData = member">
          <input type="radio" name="my-accordion-2" checked="checked">
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

      <div v-if="step === 3" class="previsualisation-box-3">
        <div ref="graphContainer" />
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

.add-content {
  display: flex;
  flex-direction: column;
  flex: 1;

  @media (min-width: 998px) {
    flex-direction: row-reverse;
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

.right-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.steps-container {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  flex-shrink: 0;
  width: 100%;
}

.previsualisation-box {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 64px auto 0;
  width: 70%;
}

.previsualisation-box-3 {
  display: flex;
  justify-content: center;
  margin-top: 64px;
}

.step {
  min-width: 9rem;
}

h1 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 32px;
}

.collapse-title {
  display: flex;
  flex-direction: row;
  gap: 16px;
}
</style>
