import { and, eq } from "drizzle-orm";
import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { InsertThrees, threes } from "~/lib/db/schema";

export default defineEventHandler(async (event) => {
  const session = await auth.api.getSession({ headers: event.headers });

  if (!session?.user) {
    throw createError({ statusCode: 401, statusMessage: "Unauthorized" });
  }

  const id = Number(getRouterParam(event, "id"));

  const result = await readValidatedBody(event, InsertThrees.partial().safeParse);

  if (!result.success) {
    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);
    throw createError({ statusCode: 422, statusMessage: "Validation Failed", data });
  }

  const [updated] = await db
    .update(threes)
    .set({
      ...result.data,
      ...(result.data.name && {
        slug: result.data.name.trim().replaceAll(/\s+/g, "-").toLowerCase(),
      }),
    })
    .where(and(eq(threes.id, id), eq(threes.userId, session.user.id)))
    .returning();

  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: "Tree not found or access denied" });
  }

  return updated;
});
