import { eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { threes } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const session = await auth.api.getSession({ headers: event.headers });

  if (query.isPublic === "true") {
    return db.select()
      .from(threes)
      .where(eq(threes.isPublic, true));
  }

  if (session?.user) {
    return db.select()
      .from(threes)
      .where(eq(threes.userId, session.user.id));
  }

  return [];
});
