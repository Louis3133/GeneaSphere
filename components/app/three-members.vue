<script setup lang="ts">
import type { FetchError } from "ofetch";
import { toTypedSchema } from "@vee-validate/zod";
import { InsertMembers } from "~/lib/db/schema";

const props = defineProps<{
  threesId: number | null;
  memberData?: any | null;
}>();
const emit = defineEmits(["next", "memberAdded", "memberUpdated", "cancelEdit"]);
const submitError = ref("");
const loading = ref(false);

const { handleSubmit, errors, meta, setErrors, setValues, resetForm } = useForm({
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

const onSubmit = handleSubmit(async (values, actions) => {
  if (props.memberData) {
    try {
      submitError.value = "";
      loading.value = true;
      const inserted = await $fetch(`/api/members/${props.memberData.id}`, {
        method: "put",
        body: {
          ...values,
          threesId: props.threesId,
        },
      });
      emit("memberUpdated", inserted);
      actions.resetForm();
    }
    catch (e) {
      const error = e as FetchError;

      if (error.data?.data) {
        setErrors(error.data.data);
      }

      submitError.value = error.statusMessage || "Erreur inconnue";
    }
  }
  else {
    try {
      submitError.value = "";
      loading.value = true;
      const inserted = await $fetch("/api/members", {
        method: "post",
        body: {
          ...values,
          threesId: props.threesId,
        },
      });
      emit("memberAdded", inserted);
      actions.resetForm();
    }
    catch (e) {
      const error = e as FetchError;

      if (error.data?.data) {
        setErrors(error.data.data);
      }

      submitError.value = error.statusMessage || "Erreur inconnue";
    }
  }
  loading.value = false;
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
      <div class="flex gap-2 justify-end">
        <button type="button" class="btn btn-outline" @click="handleCancel">
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
    <button class="btn btn-primary" @click="emit('next', { step: 3 })">
      Continuer
      <Icon name="tabler:arrow-right" size="12" />
    </button>
  </section>
</template>

<style scoped lang="scss">

</style>
