import { describe, expect, it } from "@jest/globals";
import request from "supertest";

const baseURL = "http://localhost:3000";
const validCookie = [process.env.TEST_SESSION_COOKIE as string];

describe("POST /api/members", () => {
  it("cree un nouveau membre si connecte et valide", async () => {
    const treesRes = await request(baseURL).get("/api/threes").set("Cookie", validCookie);
    const treeId = treesRes.body.length > 0 ? treesRes.body[0].id : 1;

    const payload = {
      name: "Jean Dupont",
      description: "Le patriarche de la lignée",
      bornDate: "1950-01-01T00:00:00.000Z",
      threesId: treeId,
      isAdopted: false,
    };

    const response = await request(baseURL)
      .post("/api/members")
      .set("Cookie", validCookie)
      .send(payload);

    expect(response.status).toBe(200);
  });
});
