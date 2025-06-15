import { sqliteTable, AnySQLiteColumn, text, numeric, integer, uniqueIndex, index } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export const allProduct = sqliteTable("AllProduct", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  label: text().notNull(),
  value: text(),
},
  (table) => [
    uniqueIndex("AllProduct_label_key").on(table.label),
  ]);

export const product = sqliteTable("Product", {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  userId: text().notNull(),
  productName: text().notNull(),
  expTime: numeric().notNull()
},
  (table) => [
    index("Product_productName_key").on(table.userId),
  ])