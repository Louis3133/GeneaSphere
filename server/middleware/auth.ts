import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  const path = event.path;
  const method = event.method; // On récupère la méthode (GET, POST, etc.)

  // On protège le dashboard et les APIs de modification/création
  // Mais on laisse passer les GET sur /api/threes pour le mode public
  const isProtectedRoute
    = path.startsWith("/dashboard")
      || (path.startsWith("/api/threes") && method !== "GET")
      || path.startsWith("/api/members");

  if (isProtectedRoute) {
    const session = await auth.api.getSession({
      headers: event.headers,
    });

    if (!session) {
      if (!path.startsWith("/api/")) {
        return sendRedirect(event, "/", 302);
      }

      throw createError({
        statusCode: 401,
        statusMessage: "Tu n'as pas le droit d'être ici !",
      });
    }

    event.context.user = session.user;
    event.context.session = session;
  }
});
