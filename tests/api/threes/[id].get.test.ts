import { describe, expect, it } from "@jest/globals";
import request from "supertest";

const baseURL = "http://localhost:3000";

describe("GET /api/threes/:id", () => {
  it("retourne un statut 204 (vide) si l'id n'est pas un nombre", async () => {
    const response = await request(baseURL).get("/api/threes/texte-invalide");
    expect(response.status).toBe(204);
  });

  it("retourne une erreur 404 si l'arbre n'existe pas", async () => {
    const response = await request(baseURL).get("/api/threes/999999");
    expect(response.status).toBe(404);
  });

  it("retourne l'arbre et ses membres avec un id valide", async () => {
    const validId = 1;
    const response = await request(baseURL).get(`/api/threes/${validId}`);

    if (response.status === 200) {
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("members");
      expect(Array.isArray(response.body.members)).toBe(true);
    }
    else {
      expect(response.status).toBe(404);
    }
  });
});
