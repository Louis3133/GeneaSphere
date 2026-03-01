import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  if (event.path.startsWith("/dashboard")) {
    const session = await auth.api.getSession({
      headers: event.headers,
    });
    event.context.user = session?.user;
    if (!session) {
      await sendRedirect(event, "/", 302);
    }
  }
});
