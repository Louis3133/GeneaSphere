import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { members } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({
    headers: event.headers,
  });

  if (!session?.user) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: "Unauthorized",
    }));
  }

  const id = Number(getRouterParam(event, "id"));

  const [deleted] = await db.delete(members)
    .where(eq(members.id, id))
    .returning();

  return deleted;
});
