<script setup lang="ts">
import AppAuthButtonGithub from "~/components/app/auth-button-github.vue";
import AppAuthButtonGoogle from "~/components/app/auth-button-google.vue";
</script>

<template>
  <div>
    <button class="btn button-modal" onclick="my_modal_2.showModal()">
      Se connecter
    </button>
    <dialog id="my_modal_2" class="modal">
      <div class="modal-box">
        <h3>Se connecter</h3>

        <div class="divider">
          Ou
        </div>
        <div class="tiers-connection">
          <AppAuthButtonGithub />
          <AppAuthButtonGoogle />
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>

<style scoped lang="scss">
.button-modal {
  border: unset;
  background: unset;
  padding: unset;
  box-shadow: none;
}

.tiers-connection {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 12px;
}

h3 {
  font-size: 24px;
}
</style>
