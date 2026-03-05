import { describe, expect, it } from "@jest/globals";
import request from "supertest";

const baseURL = "http://localhost:3000";
const validCookie = [process.env.TEST_SESSION_COOKIE as string];

describe("DELETE /api/members/:id", () => {
  it("accepte la requete de suppression si l'utilisateur est connecte", async () => {
    const treesRes = await request(baseURL).get("/api/threes").set("Cookie", validCookie);
    const treeId = treesRes.body[0].id;

    const newMemberRes = await request(baseURL)
      .post("/api/members")
      .set("Cookie", validCookie)
      .send({
        name: "Membre Temporaire",
        description: "Sera supprimé par le test",
        bornDate: "2000-01-01T00:00:00.000Z",
        threesId: treeId,
      });

    const memberId = newMemberRes.body.id;

    const response = await request(baseURL)
      .delete(`/api/members/${memberId}`)
      .set("Cookie", validCookie);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(memberId);
  });
});
