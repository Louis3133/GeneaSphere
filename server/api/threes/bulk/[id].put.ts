import { and, eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { members as membersTable, threes } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session?.user)
    throw createError({ statusCode: 401 });

  const treeId = Number(getRouterParam(event, "id"));
  const { tree, members } = await readBody(event);

  return db.transaction(async (tx) => {
    // 1. Update de l'arbre (Sécurité : userId doit correspondre)
    await tx.update(threes)
      .set({
        name: tree.name,
        description: tree.description,
        isPublic: tree.isPublic,
      })
      .where(and(eq(threes.id, treeId), eq(threes.userId, session.user.id)));

    // 2. Nettoyage : On supprime tous les anciens membres de cet arbre
    await tx.delete(membersTable).where(eq(membersTable.threesId, treeId));

    if (!members || members.length === 0)
      return { success: true };

    // 3. Ré-insertion (Même logique que le POST)
    const tempToRealId = new Map<number, number>();
    const createdMembers = [];

    for (const m of members) {
      const [newMember] = await tx.insert(membersTable).values({
        name: m.name,
        description: m.description,
        bornDate: new Date(m.bornDate),
        deathDate: m.deathDate ? new Date(m.deathDate) : null,
        threesId: treeId,
        isAdopted: m.isAdopted || false,
      }).returning();

      tempToRealId.set(m.id, newMember.id);
      createdMembers.push({ ...m, realId: newMember.id });
    }

    // 4. Update des relations
    for (const m of createdMembers) {
      if (m.parent1 || m.parent2) {
        await tx.update(membersTable)
          .set({
            parent1: m.parent1 ? tempToRealId.get(m.parent1) : null,
            parent2: m.parent2 ? tempToRealId.get(m.parent2) : null,
          })
          .where(eq(membersTable.id, m.realId));
      }
    }
    return { id: treeId };
  });
});
