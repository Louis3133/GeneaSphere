<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { InsertMembers } from "~/lib/db/schema";

const props = defineProps<{
  threesId: number | null;
  memberData?: any | null;
}>();
const emit = defineEmits(["next", "memberAdded", "memberUpdated", "cancelEdit"]);

const { handleSubmit, errors, meta, setValues, resetForm } = useForm({
  validationSchema: toTypedSchema(InsertMembers.omit({ threesId: true })),
});

function handleCancel() {
  resetForm();
  emit("cancelEdit");
}

watch(() => props.memberData, (newMembersData) => {
  if (newMembersData) {
    setValues({
      name: newMembersData.name,
      description: newMembersData.description,
      bornDate: new Date(newMembersData.bornDate).toISOString().split("T")[0],
      deathDate: newMembersData.deathDate ? new Date(newMembersData.deathDate).toISOString().split("T")[0] : undefined,
    });
  }
});

const onSubmit = handleSubmit((values) => {
  const tempMember = {
    ...values,
    id: Date.now(),
  };
  emit("memberAdded", tempMember);
  resetForm();
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty) {
    // eslint-disable-next-line no-alert
    const confirm = window.confirm("Attention, vos changement ne seront pas sauvegardés, voulez vous quitter la page ? ");
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <section>
    <h1>Ajout des membres de la famille</h1>
    <form @submit="onSubmit">
      <AppFormField name="name" label="Nom" :error="errors.name" />
      <AppFormField type="textarea" name="description" label="Description" :error="errors.description" />
      <AppFormField type="date" name="bornDate" label="Date de naissance" :error="errors.bornDate" />
      <AppFormField type="date" name="deathDate" label="Date de décès" :error="errors.deathDate" />
      <div class="flex gap-2">
        <button v-if="props.memberData" type="button" class="btn btn-outline" @click="handleCancel">
          Cancel
          <Icon name="tabler:arrow-left" size="12" />
        </button>
        <button v-if="props.memberData" type="submit" class="btn btn-primary">
          Modifier
          <Icon name="tabler:circle-plus-filled" size="12" />
        </button>

        <button v-else type="submit" class="btn btn-primary">
          Ajouter
          <Icon name="tabler:circle-plus-filled" size="12" />
        </button>
      </div>
    </form>
    <div class="buttons-form flex justify-end gap-4">
      <button class="btn btn-outline" @click="emit('next', { step: 1, three: props.threesId })">
        <Icon name="tabler:arrow-left" size="12" />
        Retour
      </button>

      <button class="btn btn-primary" @click="emit('next', { step: 3, three: props.threesId })">
        Continuer
        <Icon name="tabler:arrow-right" size="12" />
      </button>
    </div>
  </section>
</template>

<style scoped lang="scss">
h1 {
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 16px;
}

.buttons-form {
  margin-top: 32px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-bottom: 1px solid #7e7e7e;
  padding-bottom: 32px;
}
</style>
