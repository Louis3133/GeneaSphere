<script setup lang="ts">
const route = useRoute();
const treeId = route.params.id;

const step = ref(1);
const tree = ref<number | null>(Number(treeId));
const membersList = ref<any[]>([]);
const formData = ref({ name: "", description: "", isPublic: false });
const memberData = ref<any | null>(null);

// Chargement initial
const { data: initialData, pending } = await useFetch<any>(`/api/threes/${treeId}`);

watch(initialData, (val) => {
  if (val) {
    formData.value = { name: val.name, description: val.description, isPublic: val.isPublic };
    membersList.value = val.members || [];
  }
}, { immediate: true });

function handleLiveRelations(newRelations: any) {
  newRelations.forEach((relation: any) => {
    const member = membersList.value.find(m => m.id === relation.id);
    if (member) {
      member.parent1 = relation.parent1;
      member.parent2 = relation.parent2;
      member.unions = relation.unions;
      member.isAdopted = relation.isAdopted;
    }
  });
}
</script>

<template>
  <div v-if="pending" class="flex justify-center p-20">
    <span class="loading loading-spinner" />
  </div>
  <div v-else class="flex flex-row-reverse flex-1">
    <div class="sidebar-add">
      <div class="container max-w-md mx-auto mt-4">
        <AppThreeParametters
          v-if="step === 1"
          :tree-data="formData"
          @next="step = $event.step; formData = $event.formData"
        />
        <AppThreeMembers
          v-if="step === 2"
          :member-data="memberData"
          :threes-id="tree"
          @member-added="membersList.push($event)"
          @member-updated="Object.assign(membersList.find(m => m.id === $event.id), $event)"
          @next="step = $event.step"
        />
        <AppThreeRelations
          v-if="step === 3"
          :members-list="membersList"
          :tree-data="formData"
          :is-edit="true"
          :tree-id="tree"
          @live-update="handleLiveRelations"
          @next="step = $event.step"
        />
      </div>
    </div>
  </div>
</template>
