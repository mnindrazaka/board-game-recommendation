import { CategoriesTable, GamesTable } from "../db/schema";

type Game = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  complexity: "light" | "medium" | "heavy";
  minPlayer: number;
  maxPlayer: number;
  minPlayTime: number;
  maxPlayTime: number;
  isFavorite: boolean;
};

export type GetGameListResponse = {
  games: Game[];
  total: number;
};

export type GetGameDetailResponse = Game & {
  publishedYear: number;
  description: string;
  categories: { id: number; title: string }[];
};

export function mapGamesTableToGame(gameTable: GamesTable): Game {
  return {
    id: gameTable.id,
    slug: gameTable.slug,
    title: gameTable.title,
    subtitle: gameTable.subtitle,
    imageUrl: gameTable.image_url,
    complexity:
      gameTable.complexity === "light"
        ? "light"
        : gameTable.complexity === "medium"
          ? "medium"
          : gameTable.complexity === "heavy"
            ? "heavy"
            : "light",
    minPlayer: gameTable.min_player,
    maxPlayer: gameTable.max_player,
    minPlayTime: gameTable.min_play_time,
    maxPlayTime: gameTable.max_play_time,
    isFavorite: false,
  };
}

export function mapGamesTableToGameDetail(
  gameTableWithCategories: GamesTable & { categories: CategoriesTable[] },
): GetGameDetailResponse {
  return {
    ...mapGamesTableToGame(gameTableWithCategories),
    publishedYear: gameTableWithCategories.published_year,
    description: gameTableWithCategories.description,
    categories: gameTableWithCategories.categories,
  };
}
