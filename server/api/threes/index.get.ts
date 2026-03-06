import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { threes } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);

    // 1. On s'assure que "true" (string) est bien traité comme un vrai filtre
    const isPublicRequest = String(query.isPublic) === "true";

    // 2. PRIORITÉ : Si c'est public, on renvoie les données et on S'ARRÊTE là.
    // Pas besoin de toucher à la session, c'est ce qui évite le crash en incognito.
    if (isPublicRequest) {
      return await db.select()
        .from(threes)
        .where(eq(threes.isPublic, true));
    }

    // 3. SEULEMENT SI ce n'est pas public, on vérifie qui est l'utilisateur
    const session = await auth.api.getSession({ headers: event.headers });

    if (session?.user) {
      return await db.select()
        .from(threes)
        .where(eq(threes.userId, session.user.id));
    }

    // Si rien ne correspond, on renvoie un tableau vide plutôt que de planter
    return [];
  }
  catch (e) {
    // Si ça crash, on regarde pourquoi dans le terminal Nuxt
    console.error("Erreur API Threes Index:", e);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne",
    });
  }
});
