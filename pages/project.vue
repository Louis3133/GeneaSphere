<script setup lang="ts">
</script>

<template>
  <section class="container project-section">
    <h1>Le projet</h1>
    <div class="text-section">
      <p>Le projet GeneaSphere est un projet étudiant réalisé en 3 semaines, ce dernier avais pour objectif de nous introduire aux tests unitaires, à typescript et apprendre une nouvelle techno. Nous pouvions partir sur NextJS, j'ai choisi Nuxt, étant plus à l'aise avec Vue. Durnat ce projet j'ai pris la décision d'utiliser le moins possible l'IA, afin de favoriser une montée en compétence sur les technos, en utilisant excliusivement les ressources en ligne (documentations formations vidéos), j'ai utilisé l'IA pour avoir des pistes de réflexions ou dans les dernier jours pour débugger et résoudre des features par manque de temps. </p>
      <p>Le brief consistait en la création d'un arbre généalogique en ligne. Nous avions carte blanche pour le type de représentation que nous allions faire (graphe, arbre), et pour la modélisation de ce dernier. j'ai donc décidé de partir sur de la 3D, voulant m'introduire a la techno ThreeJS (le nom semble raccord avec le projet). Le principe est donc le suivant : vous pouvez mettre en ligne (en privé ou en public) un arbre généalogique, ce dernier se présente sous la forme de racines avec son arbre au dessus !</p>

      <h2>Crédits</h2>

      <p>Ce projet à été encadré par M. Salmon dans le cadre du BUT MMI à l'IUT Bordeaux Montaigne. Le développement et la conception du site à été effecté par Louis Le Doussal, étudiant de troisième année.</p>
      <p>Je remercie la chaine youtube <a target="_blank" href="https://www.youtube.com/watch?v=DK93dqmJJYg&t=10227s">Syntax</a>, plus particulièrement CJ Reynolds pour son excellente formation qui m'as permis de prendre en main le projet et d'apprendre un grand nombre de notions ❤️ </p>

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
  font-size: 32px;
  font-weight: 500;

  @media (min-width: 998px) {
    font-size: 48px;
  }
}

h2 {
  font-size: 24px;
  font-weight: 500;
  padding-block: 12px;
}

.text-section {
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 24px;

  @media (min-width: 998px) {
    font-size: 18px;
  }

  a {
    text-decoration: underline;
  }
}
</style>
