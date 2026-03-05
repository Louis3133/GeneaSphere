import { describe, expect, it } from "@jest/globals";
import request from "supertest";

const baseURL = "http://localhost:3000";
const validCookie = [process.env.TEST_SESSION_COOKIE as string];

describe("GET /api/threes", () => {
  it("retourne les arbres publics avec la query isPublic", async () => {
    const response = await request(baseURL).get("/api/threes?isPublic=true");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0].isPublic).toBe(true);
    }
  });

  it("retourne un tableau vide si aucun parametre et non connecte", async () => {
    const response = await request(baseURL).get("/api/threes");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("retourne les arbres de l'utilisateur si connecte", async () => {
    const response = await request(baseURL)
      .get("/api/threes")
      .set("Cookie", validCookie);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});
