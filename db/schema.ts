import { sqliteTable, AnySQLiteColumn, text, numeric, integer, uniqueIndex } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const allProduct = sqliteTable("AllProduct", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  label: text().notNull(),
  value: text(),
},
  (table) => [
    uniqueIndex("AllProduct_label_key").on(table.label),
  ]);

