import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { members } from "./member";

export const unions = sqliteTable("unions", {
  id: int().primaryKey({ autoIncrement: true }),
  person1: int().notNull().references(() => members.id),
  person2: int().notNull().references(() => members.id),
  status: text({ enum: ["Marié", "Divorcé", "En couple"] }),
});

export const InsertUnions = createInsertSchema(unions, {
  person1: z.preprocess(val => val === "" || val === null ? undefined : val, z.coerce.number().optional()),
  person2: z.preprocess(val => val === "" || val === null ? undefined : val, z.coerce.number().optional()),
}).omit({
  id: true,
});
