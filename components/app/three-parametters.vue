<script setup lang="ts">
import type { FetchError } from "ofetch";
import { toTypedSchema } from "@vee-validate/zod";
import { InsertThrees } from "~/lib/db/schema";

const emit = defineEmits(["next"]);
const router = useRouter();
const submitError = ref("");
const loading = ref(false);
const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(InsertThrees),
});

const onSubmit = handleSubmit(async (values) => {
  try {
    submitError.value = "";
    loading.value = true;
    const inserted = await $fetch("/api/threes", {
      method: "post",
      body: values,
    });
    emit("next", { step: 2, three: inserted.id });
  }
  catch (e) {
    const error = e as FetchError;

    if (error.data?.data) {
      setErrors(error.data.data);
    }

    submitError.value = error.statusMessage || "Erreur inconnue";
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
    <h1>Paramètres de l'arbre</h1>
    <div v-if="submitError" role="alert" class="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{{ submitError }}</span>
    </div>
    <form @submit.prevent="onSubmit">
      <AppFormField :disabled="loading" name="name" label="Nom" :error="errors.name" />
      <AppFormField :disabled="loading" type="textarea" name="description" label="Description" :error="errors.description" />
      <AppFormField :disabled="loading" type="checkbox" name="isPublic" label="Arbre accessible au public ?" :error="errors.isPublic" />
      <div class="flex gap-2 justify-end">
        <button :disabled="loading" type="button" class="btn btn-outline" @click="router.back()">
          Cancel
          <Icon name="tabler:arrow-left" size="12" />
        </button>
        <button :disabled="loading" type="submit" class="btn btn-primary">
          Add
          <Icon name="tabler:circle-plus-filled" size="12" />
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">

</style>
