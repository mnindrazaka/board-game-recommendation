import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
  gamesTable: {
    categories: r.many.categoriesTable({
      from: r.gamesTable.id.through(r.gameCategoriesTable.game_id),
      to: r.categoriesTable.id.through(r.gameCategoriesTable.category_id),
    }),
  },
  categoriesTable: {
    games: r.many.gamesTable({
      from: r.categoriesTable.id.through(r.gameCategoriesTable.category_id),
      to: r.gamesTable.id.through(r.gameCategoriesTable.game_id),
    }),
  },
  // gameFavoritesTable: {
  //   game: r.gamesTable({
  //     from: r.gameFavoritesTable.game_id.through(r.gamesTable.id),
  //     to: r.gamesTable.id.through(r.gameFavoritesTable.game_id),
  //   }),
  // },
}));
