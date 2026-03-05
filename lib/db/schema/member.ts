import type { AnySQLiteColumn } from "drizzle-orm/sqlite-core";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { threes } from "./three";

export const members = sqliteTable("members", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  description: text().notNull(),
  bornDate: int("born", { mode: "timestamp" }).notNull(),
  deathDate: int("death", { mode: "timestamp" }),
  threesId: int().notNull().references(() => threes.id, { onDelete: "cascade" }),
  isAdopted: int({ mode: "boolean" }).default(false),
  parent1: int().references((): AnySQLiteColumn => members.id),
  parent2: int().references((): AnySQLiteColumn => members.id),
});

export const InsertMembers = createInsertSchema(members, {
  name: field => field.min(1).max(100),
  description: field => field.min(1).max(600),
  isAdopted: z.coerce.boolean(),
  bornDate: z.coerce.date(),
  deathDate: z.coerce.date().optional(),
  parent1: z.preprocess(val => val === "" || val === null ? undefined : val, z.coerce.number().optional()),
  parent2: z.preprocess(val => val === "" || val === null ? undefined : val, z.coerce.number().optional()),
}).omit({
  id: true,
});
