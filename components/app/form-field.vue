<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "textarea" | "checkbox" | "date";
  disabled?: boolean;
}>();

const inputType = props.type ?? "text";
const isCheckbox = inputType === "checkbox";
const isTextarea = inputType === "textarea";
</script>

<template>
  <div v-if="isCheckbox" class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
      <Field
        as="input"
        type="checkbox"
        :name="name"
        :disabled="disabled"
        class="toggle"
      />
      <span class="label-text">{{ label }}</span>
    </label>
    <p v-if="error" class="text-error text-sm mt-1">
      {{ error }}
    </p>
  </div>

  <fieldset v-else class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>

    <Field
      :as="isTextarea ? 'textarea' : 'input'"
      :name="name"
      :type="!isTextarea ? inputType : undefined"
      :disabled="disabled"
      :class="[
        error && 'input-error',
        isTextarea
          ? 'textarea w-full'
          : 'input w-full',
      ]"
    />

    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>
</template>
