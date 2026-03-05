import { describe, expect, it } from "@jest/globals";
import request from "supertest";

const baseURL = "http://localhost:3000";
const validCookie = [process.env.TEST_SESSION_COOKIE as string];

describe("DELETE /api/threes/:id", () => {
  it("accepte la requete de suppression si l'utilisateur est connecte", async () => {
    const createRes = await request(baseURL)
      .post("/api/threes")
      .set("Cookie", validCookie)
      .send({
        name: "Arbre de Test",
        description: "Test de suppression",
        isPublic: false,
      });

    const treeId = createRes.body.id;

    const response = await request(baseURL)
      .delete(`/api/threes/${treeId}`)
      .set("Cookie", validCookie);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(treeId);
  });
});
