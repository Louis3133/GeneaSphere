# GeneaSphere

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.


## Production Infos supplémentaires

slides de la présentation : [Slides](https://www.figma.com/deck/LjtVCoX4bmUu5D5vw1274y)

Pour les tests unitaires, n'oubliez pas de mettre le bon cookie Better Auth dans le .env, il est trouvable facilement via la console sur application -> cookies

ATTENTION en production actuellement, il n'est possible de se connecter qu'avec google, je veux faire des changements d'auth, et google permet de faire de manière plus faciles plusieurs URI, mais il sera possible de se connecter avec Github quand j'aurais finalisé les derniers détails !

La production : https://genea-sphere.vercel.app/

Les points que je vais corriger quand je le pourrais : 

- l'édition des arbres (actuellement ça fait des copies)
- Amélioration du temps de chargement de l'arbre
- Amélioration de l'ésthétique des racines
- Bugs divers

