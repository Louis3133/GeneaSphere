<script setup lang="ts">

</script>

<template>
  <section>
    <h1>Relations</h1>
    <form @submit="onSubmit">
      <AppFormField name="name" label="Nom" :error="errors.name" />
      <AppFormField type="textarea" name="description" label="Description" :error="errors.name" />
      <AppFormField type="checkbox" name="visibility" label="Arbre accessible au public ?" :error="errors.name" />
      <div class="flex gap-2 justify-end">
        <button type="button" class="btn btn-outline">
          Cancel
          <Icon name="tabler:arrow-left" size="12" />
        </button>
        <button type="submit" class="btn btn-primary">
          Add
          <Icon name="tabler:circle-plus-filled" size="12" />
        </button>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">

</style>
