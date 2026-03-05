import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { members as membersTable, threes } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });
  if (!session?.user)
    throw createError({ statusCode: 401 });

  const body = await readBody(event);
  const { tree, members } = body;

  return db.transaction(async (tx) => {
    const [insertedTree] = await tx.insert(threes).values({
      ...tree,
      slug: `${tree.name.replaceAll(" ", "-").toLowerCase()}-${Date.now()}`,
      userId: session.user.id,
    }).returning();

    if (!members || members.length === 0)
      return insertedTree;

    const tempToRealId = new Map<number, number>();
    const createdMembers = [];

    for (const m of members) {
      const [newMember] = await tx.insert(membersTable).values({
        name: m.name,
        description: m.description,
        bornDate: new Date(m.bornDate),
        deathDate: m.deathDate ? new Date(m.deathDate) : null,
        threesId: insertedTree.id,
        isAdopted: m.isAdopted || false,
      }).returning();

      tempToRealId.set(m.id, newMember.id);
      createdMembers.push({ ...m, realId: newMember.id });
    }

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

    return insertedTree;
  });
});
