import { sqliteTable, AnySQLiteColumn, text, numeric, integer, uniqueIndex, index, } from "drizzle-orm/sqlite-core"
import { sql, eq } from "drizzle-orm"

const baseTable = {
  id: integer().primaryKey({ autoIncrement: true }).notNull(),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull()
    .default(sql`(unixepoch())`),
  updateAt: integer("update_at", { mode: 'timestamp' }).notNull()
    .default(sql`(unixepoch())`)
}

export const user = sqliteTable("User", {
  ...baseTable,
  userId: text().notNull().unique(),
  machineMaxNum: integer("machine_max_num").notNull().default(2),
  info: text().notNull()
},
  (table) => [
    index("idx_User_userId").on(table.userId),
  ]);





export const allProduct = sqliteTable("AllProduct", {
  ...baseTable,
  label: text().notNull(),
  value: text(),
},
  (table) => [
    uniqueIndex("idx_all_label").on(table.label),
  ]);



export const product = sqliteTable("Product", {
  ...baseTable,
  userId: text().notNull().references(() => user.userId),
  productName: text().notNull(),
  expTime: integer('exp_time', { mode: "timestamp" }).notNull()
},
  (table) => [
    index("idx_product_userId").on(table.userId),
  ]);

export const machineBinding = sqliteTable("MachineBinding", {
  ...baseTable,
  userId: text("user_id").notNull().references(() => user.userId),
  machineId: text("machine_id").notNull(),
  endTime: integer("end_time", { mode: "timestamp" }),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
},
  (table) => ([
    uniqueIndex("idx_MachineBinding_userId_machineId")
      .on(table.userId, table.machineId)
      .where(sql`${table.isActive} = 1`),
    index("idx_MachineBinding_userId").on(table.userId),
    index("idx_MachineBinding_machineId").on(table.machineId),
    index("idx_MachineBinding_isActive").on(table.isActive)
  ]));