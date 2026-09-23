import { sqliteTable, AnySQLiteColumn, text, numeric, integer, uniqueIndex, index, } from "drizzle-orm/sqlite-core"
import { sql, eq, relations } from "drizzle-orm"

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

// ===== 游戏相关表（从 web-games-nexus 迁移）=====
// 游戏分类
export const categories = sqliteTable('categories', {
  ...baseTable,
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  icon: text('icon'),
  sort: integer('sort'),
  enable: integer("enable", { mode: 'boolean' }).default(true)
}, (table) => [
  index("idx_categories_slug").on(table.slug)
]);

// 游戏平台
export const platforms = sqliteTable('platforms', {
  ...baseTable,
  slug: text('slug').notNull().unique(),
  name: text('name', { length: 30 }).notNull(),
  icon: text('icon'),
  sort: integer('sort'),
}, (table) => [
  index("idx_platforms_slug").on(table.slug),
]);

// 游戏表
export const games = sqliteTable('games', {
  ...baseTable,
  title: text('title').notNull(),
  description: text('description'),
  coverImage: text('cover_image'),
  romUrl: text('rom_url').notNull(), // 游戏实际URL
  coreCype: text('core_type').notNull(), // 直接通过a标签访问
  categoryId: integer('category_id').references(() => categories.id),
  platformId: integer('platform_id').references(() => platforms.id),
  isHot: integer('is_hot', { mode: 'boolean' }).default(false),
  enable: integer("enable", { mode: "boolean" }).default(true),
  sort: integer('sort').default(0),
}, (table) => [
  index('idx_games_title').on(table.title),
  index('idx_games_platformID').on(table.platformId, table.enable),
  index('idx_games_category').on(table.categoryId, table.enable),
  index('idx_games_hot').on(table.isHot, table.enable),
  index('idx_games_enable').on(table.enable)
]);

// 游戏关系
export const gamesRelations = relations(games, ({ one }) => ({
  category: one(categories, {
    fields: [games.categoryId],
    references: [categories.id],
  }),
  platform: one(platforms, {
    fields: [games.platformId],
    references: [platforms.id],
  }),
}));