import { and, eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { threes } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    });
  }

  const id = Number(getRouterParam(event, "id"));
  const currentUserId = session.user.id;

  const [deleted] = await db.delete(threes)
    .where(and(eq(threes.id, id), eq(threes.userId, currentUserId)))
    .returning();

  if (!deleted) {
    throw createError({
      statusCode: 404,
      statusMessage: "Tree not found or access denied",
    });
  }

  return deleted;
});
