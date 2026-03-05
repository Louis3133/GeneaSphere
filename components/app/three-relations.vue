<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { FieldArray, useForm } from "vee-validate";
import { watch } from "vue";
import { z } from "zod";

const props = defineProps<{
  membersList?: any[] | null;
  treeData: any;
  treeId: any;
}>();
const emit = defineEmits(["next", "liveUpdate"]);
const submitError = ref("");
const loading = ref(false);

const RelationsSchema = z.object({
  member: z.array(
    z.object({
      id: z.coerce.number(),
      isAdopted: z.coerce.boolean().default(false),
      parent1: z.preprocess(val => val === "" || val === null ? undefined : val, z.coerce.number().optional()),
      parent2: z.preprocess(val => val === "" || val === null ? undefined : val, z.coerce.number().optional()),
      unions: z.array(
        z.object({
          partner: z.preprocess(val => val === "" || val === null ? undefined : val, z.coerce.number().optional()),
          status: z.enum(["Marié", "Divorcé", "En couple"]),
        }),
      ).default([]),
    }),
  ),
});

const { handleSubmit, values } = useForm({
  validationSchema: toTypedSchema(RelationsSchema),
  initialValues: {
    member: props.membersList?.map(m => ({
      id: m.id,
      isAdopted: m.isAdopted || false,
      parent1: m.parent1 || undefined,
      parent2: m.parent2 || undefined,
      unions: m.unions || [],
    })) || [],
  },
});

watch(values, (newValues) => {
  if (newValues && newValues.member) {
    emit("liveUpdate", newValues.member);
  }
}, { deep: true });

function getParentOptions(currentId: number) {
  return props.membersList
    ?.filter((m: any) => m.id !== currentId)
    .map((m: any) => ({
      label: m.name,
      value: m.id,
    })) ?? [];
}

const onSubmit = handleSubmit(async (formValues) => {
  loading.value = true;

  const finalMembers = props.membersList?.map((m) => {
    const relations = formValues.member.find(r => r.id === m.id);
    return { ...m, ...relations };
  });

  try {
    await $fetch("/api/threes/bulk", {
      method: "POST",
      body: {
        tree: props.treeData,
        members: finalMembers,
      },
    });
    navigateTo("/dashboard/profil");
  }
  catch (e: any) {
    submitError.value = e.data?.statusMessage || "Erreur lors de la sauvegarde";
  }
  finally {
    loading.value = false;
  }
});
</script>

<template>
  <section class="step-3-content">
    <h1>Hiérarchie de l'arbre</h1>

    <div v-if="submitError" class="alert alert-error mb-4">
      <Icon name="tabler:alert-circle" />
      <span>{{ submitError }}</span>
    </div>

    <form @submit.prevent="onSubmit">
      <div class="member-list">
        <div v-for="(member, index) in membersList" :key="member.id" class="collapse collapse-arrow bg-base-100 border border-base-300">
          <input type="radio" name="my-accordion-2" :checked="index === 0">
          <div class="collapse-title font-semibold">
            {{ member.name }}
          </div>

          <div class="collapse-content text-sm">
            <div class="grid grid-cols-2 gap-4">
              <AppFormField
                label="Parent 1"
                :name="`member[${index}].parent1`"
                type="select"
                :options="getParentOptions(member.id)"
              />
              <AppFormField
                label="Parent 2"
                :name="`member[${index}].parent2`"
                type="select"
                :options="getParentOptions(member.id)"
              />
            </div>

            <AppFormField label="" type="hidden" :name="`member[${index}].id`" :value="member.id" />

            <div class="checkbox-container">
              <AppFormField
                :disabled="loading"
                type="checkbox"
                :name="`member[${index}].isAdopted`"
                label="Adopté ?"
              />
            </div>

            <FieldArray v-slot="{ fields, push, remove }" :name="`member[${index}].unions`">
              <div class="unions-container border-t border-base-300 pt-4 mt-4">
                <h4 class="font-semibold mb-4 text-sm">
                  Unions / Conjoints
                </h4>

                <div v-for="(field, idx) in fields" :key="field.key" class="flex gap-2 items-end mb-4 bg-base-200/30 p-2 rounded-lg">
                  <div class="flex-1">
                    <AppFormField
                      label="Conjoint"
                      :name="`member[${index}].unions[${idx}].partner`"
                      type="select"
                      :options="getParentOptions(member.id)"
                    />
                  </div>
                  <div class="flex-1">
                    <AppFormField
                      label="Statut"
                      :name="`member[${index}].unions[${idx}].status`"
                      type="select"
                      :options="[
                        { label: 'Marié', value: 'Marié' },
                        { label: 'Divorcé', value: 'Divorcé' },
                        { label: 'En couple', value: 'En couple' },
                      ]"
                    />
                  </div>
                  <button type="button" class="btn btn-error btn-square btn-sm mb-2" @click="remove(idx)">
                    <Icon name="tabler:trash" size="16" />
                  </button>
                </div>

                <button type="button" class="btn btn-outline btn-sm w-full" @click="push({ partner: undefined, status: 'En couple' })">
                  <Icon name="tabler:plus" size="16" />
                  Ajouter une relation
                </button>
              </div>
            </FieldArray>
          </div>
        </div>
      </div>
      <div class="buttons-form flex justify-end gap-4">
        <button class="btn btn-outline" @click="emit('next', { step: 2, three: props.membersList })">
          <Icon name="tabler:arrow-left" size="12" />
          Retour
        </button>

        <button :disabled="loading" type="submit" class="btn btn-primary">
          {{ loading ? 'Enregistrement...' : "Créer l'arbre" }}
          <Icon name="tabler:circle-check" size="12" />
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.checkbox-container {
  margin-top: 12px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  font-weight: 600;
  font-size: 24px;
  margin-bottom: 16px;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.step-3-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
