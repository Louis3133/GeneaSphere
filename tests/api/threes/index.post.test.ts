import { describe, expect, it } from "@jest/globals";
import request from "supertest";

const baseURL = "http://localhost:3000";
const validCookie = [process.env.TEST_SESSION_COOKIE as string];
describe("POST /api/threes", () => {
  it("retourne une erreur 401 si non connecte", async () => {
    const response = await request(baseURL)
      .post("/api/threes")
      .send({
        name: "Arbre Test",
        description: "Un bel arbre",
        isPublic: true,
      });

    expect(response.status).toBe(401);
  });

  it("retourne une erreur 422 si les donnees sont invalides", async () => {
    const response = await request(baseURL)
      .post("/api/threes")
      .set("Cookie", validCookie)
      .send({
        name: "",
        isPublic: "ceci n est pas un booleen",
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("data");
  });

  it("cree un nouvel arbre et genere le slug si connecte et valide", async () => {
    const payload = {
      name: "Famille Dupont",
      description: "Généalogie de la famille Dupont",
      isPublic: true,
    };

    const response = await request(baseURL)
      .post("/api/threes")
      .set("Cookie", validCookie)
      .send(payload);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Famille Dupont");
    expect(response.body.slug).toMatch(/^famille-dupont/);
  });
});
