<script setup lang="ts">
</script>

<template>
  <section class="container project-section">
    <h1>Le projet</h1>
    <div class="text-section">
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum</p>

      <h2>Crédits</h2>

      <p>Ce projet à été encadré par M. Salmon dans le cadre du BUT MMI à l'IUT Bordeaux Montaigne. Le développement et la conception du site à été effecté par Louis Le Doussal, étudiant de troisième année</p>
      <p>Je remercie la chaine youtube<a target="_blank" href="https://www.youtube.com/watch?v=DK93dqmJJYg&t=10227s">Syntax</a>, plus particulièrement CJ Reynolds pour son excellente formation qui m'as permis de prendre en main le projet et d'apprendre un grand nombre de notions ❤️ </p>

      <h2>Nota Bene</h2>

      <p>Merci d'avoir apporté de l'attention à ce projet, n'hésitez pas à me contacter via LinkedIn, mail ou autre si vous souhaitez en parler !</p>
      <p><strong>Un projet fait par un humain, pour des humain :)</strong></p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.project-section {
  display: flex;
  flex-direction: column;
  max-width: 80%;
  margin-inline: auto;
  padding-block: 90px;
  gap: 32px;
}

h1 {
  font-size: 48px;
  font-weight: 500;
}

h2 {
  font-size: 24px;
  font-weight: 500;
  padding-block: 12px;
}

.text-section {
  display: flex;
  flex-direction: column;
  font-size: 18px;
  gap: 24px;

  a {
    text-decoration: underline;
  }
}
</style>
