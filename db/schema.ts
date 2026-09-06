import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const gamesTable = sqliteTable("games", {
  id: int().primaryKey(),
  slug: text().notNull(),
  title: text().notNull(),
  subtitle: text().notNull(),
  description: text().notNull(),
  image_url: text().notNull(),
  complexity: text().notNull(),
  min_player: int().notNull(),
  max_player: int().notNull(),
  min_play_time: int().notNull(),
  max_play_time: int().notNull(),
  published_year: int().notNull(),
});

export type GamesTable = typeof gamesTable.$inferSelect;

export const categoriesTable = sqliteTable("categories", {
  id: int().primaryKey(),
  title: text().notNull(),
});

export type CategoriesTable = typeof categoriesTable.$inferSelect;

export const gameCategoriesTable = sqliteTable("game_categories", {
  id: int().primaryKey(),
  game_id: int().notNull(),
  category_id: int().notNull(),
});
