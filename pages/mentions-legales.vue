<script setup lang="ts">
</script>

<template>
  <section class="container mentions-legales-section">
    <h1>Mentions légales</h1>
    <div class="text-section">
      <p>
        Conformément aux dispositions de la loi n°2004-575 du 21 juin 2004 pour la Confiance en l’économie
        numérique, il est porté à la connaissance des utilisateurs et visiteurs, du site
        <a href="https://geneasphere.fr">https://geneasphere.fr</a>, les présentes mentions légales.
      </p>
      <p>
        La connexion et la navigation sur le Site par l’Utilisateur implique acceptation intégrale et sans
        réserve des présentes mentions légales.
      </p>

      <h2>Édition du site</h2>

      <p>
        L’édition et la direction de la publication du Site est assurée par Monsieur Le Doussal Louis, domicilié
        rue jacque Ellul et l'adresse e-mail <a href="mailto:louis.le-doussal@mmibordeaux.com">louis.le-doussal@mmibordeaux.com</a>.
      </p>

      <h2>Hébergeur</h2>

      <p>
        L'hébergeur du Site est la société Vercel, dont le siège social est situé au 650 California St 94108
        San Francisco .
      </p>

      <h2>Accès au site</h2>

      <p>
        Le Site est normalement accessible, à tout moment, à l'Utilisateur. Toutefois, l'Editeur pourra, à tout
        moment, suspendre, limiter ou interrompre le Site afin de procéder, notamment, à des mises à jour ou
        des modifications de son contenu. L'Editeur ne pourra en aucun cas être tenu responsable des
        conséquences éventuelles de cette indisponibilité sur les activités de l'Utilisateur.
      </p>

      <p>
        Toute utilisation, reproduction, diffusion, commercialisation, modification de toute ou partie du Site,
        sans autorisation expresse de l’Editeur est prohibée et pourra entraîner des actions et poursuites
        judiciaires telles que prévues par la règlementation en vigueur.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.mentions-legales-section {
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
