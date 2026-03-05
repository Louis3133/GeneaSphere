import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth";

export const threes = sqliteTable("threes", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  slug: text().notNull(),
  description: text().notNull(),
  isPublic: int({ mode: "boolean" }).notNull(),
  userId: text().notNull().references(() => user.id),
});

export const InsertThrees = createInsertSchema(threes, {
  name: field => field.min(1).max(100),
  description: field => field.min(1).max(600),
  isPublic: z.coerce.boolean(),
}).omit({
  id: true,
  userId: true,
  slug: true,
});
