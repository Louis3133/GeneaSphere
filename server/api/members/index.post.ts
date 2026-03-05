import { auth } from "~/lib/auth";
import db from "~/lib/db";
import { InsertMembers, members } from "~/lib/db/schema";

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

  const result = await readValidatedBody(event, InsertMembers.safeParse);

  if (!result.success) {
    const data = result.error.issues.reduce((errors, issue) => {
      errors[issue.path.join("")] = issue.message;
      return errors;
    }, {} as Record<string, string>);

    throw createError({
      statusCode: 422,
      statusMessage: "Validation Failed",
      data,
    });
  }

  const [created] = await db.insert(members).values({
    ...result.data,
  }).returning();

  return created;
});
