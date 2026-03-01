<script setup lang="ts">
const step = ref(1);
const three = ref<number | null>(null);
const memberData = ref<any | null>(null);
const membersList = ref<any[]>([]);

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
</script>

<template>
  <div class="flex flex-row-reverse flex-1">
    <div class="sidebar-add">
      <div class="container max-w-md mx-auto mt-4">
        <AppThreeParametters v-if="step === 1" @next="step = $event.step; three = $event.three" />
        <AppThreeMembers v-if="step === 2" :member-data="memberData" :threes-id="three" @cancel-edit="memberData = null" @member-updated="updateMemberInList($event)" @member-added="membersList.push($event)" @next="step = $event.step; three = $event.three" />
        <AppThreeRelations v-if="step === 3" @next="step = $event.step; three = $event.three" />
        <AppThreeValidation v-if="step === 4" @next="step = $event.step; three = $event.three" />
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
            Relation
          </li>
          <li class="step" :class="{ 'step-primary': step > 3 }">
            Validation
          </li>
        </ul>
      </div>

      <div v-if="step >= 2" class="previsualisation-box">
        <div v-for="member in membersList" :key="member.id" class="collapse collapse-arrow bg-base-100 border border-base-300" @click="memberData = member">
          <input type="radio" name="my-accordion-2" checked="checked">
          <button @click.stop="deleteMember(member.id)">
            <Icon name="tabler:trash" size="12" />
          </button>
          <div class="collapse-title font-semibold">
            {{ member.name }}
          </div>
          <div class="collapse-content text-sm">
            {{ member.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-add {
  padding-inline: 32px;
  padding-top: 48px;
  width: 40%;
  --tw-shadow:
    0 1px 3px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 1px 2px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1));
  box-shadow:
    var(--tw-inset-shadow), var(--tw-inset-ring-shadow), var(--tw-ring-offset-shadow), var(--tw-ring-shadow),
    var(--tw-shadow);
}

.previsualisation-box {
  display: flex;
  margin-left: 15%;
  margin-top: 64px;
  max-width: 80%;
  flex-direction: column;
  gap: 24px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.step {
  min-width: 9rem;
}

h1 {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 32px;
}

.steps-container {
  justify-content: center;
  margin-top: 32px;
  display: flex;
}
</style>
