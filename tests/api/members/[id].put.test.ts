import { describe, expect, it } from "@jest/globals";
import request from "supertest";

const baseURL = "http://localhost:3000";
const validCookie = [process.env.TEST_SESSION_COOKIE as string];

describe("PUT /api/members/:id", () => {
  it("retourne une erreur 401 si non connecte", async () => {
    const response = await request(baseURL)
      .put("/api/members/1")
      .send({
        name: "Jean Modifié",
        threesId: 50,
      });

    expect(response.status).toBe(401);
  });

  it("retourne une erreur 422 si les donnees sont invalides", async () => {
    const response = await request(baseURL)
      .put("/api/members/1")
      .set("Cookie", validCookie)
      .send({
        name: "",
        threesId: "pas-un-nombre",
      });

    expect(response.status).toBe(422);
    expect(response.body).toHaveProperty("data");
  });

  it("met a jour le membre si connecte et valide", async () => {
    const treeRes = await request(baseURL).get("/api/threes").set("Cookie", validCookie);
    const treeId = treeRes.body[0].id;
    const detailsRes = await request(baseURL).get(`/api/threes/${treeId}`);
    const memberId = detailsRes.body.members[0].id;

    const payload = {
      name: "Jean Modifié",
      description: "Mise à jour de la bio",
      bornDate: "1950-01-01T00:00:00.000Z",
      threesId: treeId,
    };

    const response = await request(baseURL)
      .put(`/api/members/${memberId}`)
      .set("Cookie", validCookie)
      .send(payload);

    expect(response.status).toBe(200);
  });
});
