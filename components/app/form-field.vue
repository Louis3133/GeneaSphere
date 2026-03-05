<script setup lang="ts">
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "textarea" | "checkbox" | "date" | "select" | "hidden";
  disabled?: boolean;
  options?: { label: string; value: string | number }[];
  value: string | number | undefined;
}>();

const inputType = props.type ?? "text";
const isCheckbox = inputType === "checkbox";
const isTextarea = inputType === "textarea";
const isSelect = inputType === "select";
const isHidden = inputType === "hidden";
</script>

<template>
  <div v-if="isHidden" class="form-control">
    <Field
      as="input"
      type="hidden"
      :name="name"
      :disabled="disabled"
      :value="value"
    />
  </div>

  <div v-else-if="isCheckbox" class="form-control">
    <label class="label cursor-pointer justify-start gap-3">
      <Field
        as="input"
        type="checkbox"
        :name="name"
        :disabled="disabled"
        class="toggle"
        :value="true"
        :unchecked-value="false"
      />
      <span class="label-text">{{ label }}</span>
    </label>
    <p v-if="error" class="text-error text-sm mt-1">
      {{ error }}
    </p>
  </div>

  <fieldset v-else-if="isSelect" class="fieldset">
    <legend class="fieldset-legend">
      {{ label }}
    </legend>

    <Field
      as="select"
      :name="name"
      :disabled="disabled"
      class="select w-full" :class="[
        error && 'select-error',
      ]"
    >
      <option value="" disabled>
        Choisir...
      </option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </Field>

    <p v-if="error" class="label text-error">
      {{ error }}
    </p>
  </fieldset>

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
