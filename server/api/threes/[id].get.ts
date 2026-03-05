import { eq } from "drizzle-orm";
import db from "~/lib/db";
import { members, threes, unions, user } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");

    if (!id || Number.isNaN(Number(id))) {
      return null;
    }

    const treeId = Number(id);

    const treeResults = await db
      .select({
        id: threes.id,
        name: threes.name,
        description: threes.description,
        userId: threes.userId,
        user: {
          id: user.id,
          name: user.name,
        },
      })
      .from(threes)
      .leftJoin(user, eq(threes.userId, user.id))
      .where(eq(threes.id, treeId))
      .limit(1);

    const tree = treeResults[0];

    if (!tree) {
      throw createError({
        statusCode: 404,
        statusMessage: "Arbre introuvable",
      });
    }

    const allMembers = await db.select()
      .from(members)
      .where(eq(members.threesId, treeId));

    const allUnions = await db.select().from(unions);

    const membersWithUnions = allMembers.map((m) => {
      return {
        ...m,
        unions: allUnions
          .filter(u => u.person1 === m.id)
          .map(u => ({
            partner: u.person2,
            status: u.status,
          })),
      };
    });

    return {
      ...tree,
      members: membersWithUnions,
    };
  }
  catch (error: any) {
    if (error.statusCode)
      throw error;

    console.error("Erreur API [id].get.ts :", error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Erreur interne du serveur",
    });
  }
});
