import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { members, threes, unions, user } from "../../lib/db/schema/index";
import "dotenv/config";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

async function main() {
  const MY_USER_ID = "1";

  await db.insert(user).values({
    id: MY_USER_ID,
    name: "Louis Test",
    email: "louis@test.com",
    createdAt: new Date(),
    updatedAt: new Date(),
  }).onConflictDoNothing();

  const [newTree] = await db.insert(threes).values({
    name: "Lignée Dupont",
    slug: `famille-dupont-${Date.now()}`,
    description: "Arbre complet généré automatiquement.",
    isPublic: true,
    userId: MY_USER_ID,
  }).returning();

  const treeId = newTree.id;

  const [arthur] = await db.insert(members).values({
    name: "Arthur Dupont",
    description: "Le patriarche.",
    bornDate: new Date("1930-01-01"),
    threesId: treeId,
  }).returning();

  const [jean] = await db.insert(members).values({
    name: "Jean Dupont",
    description: "Fils d'Arthur.",
    bornDate: new Date("1960-05-15"),
    threesId: treeId,
    parent1: arthur.id,
  }).returning();

  const [marie] = await db.insert(members).values({
    name: "Marie Durant",
    description: "L'épouse de Jean.",
    bornDate: new Date("1962-08-20"),
    threesId: treeId,
  }).returning();

  await db.insert(unions).values({
    person1: jean.id,
    person2: marie.id,
    status: "married",
  });

  await db.insert(members).values({
    name: "Lucas Dupont",
    description: "La troisième génération.",
    bornDate: new Date("1990-12-10"),
    threesId: treeId,
    parent1: jean.id,
    parent2: marie.id,
  });

  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
