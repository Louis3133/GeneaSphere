import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { user } from "./auth";

export const projects = sqliteTable("projects", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  userId: int().notNull().references(() => user.id),
});
