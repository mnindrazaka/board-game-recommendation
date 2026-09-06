import { CategoriesTable, GamesTable } from "@/db/schema";

export type Game = {
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

export async function fetchGames({
  query,
  playerNumber,
  maxPlayTime,
  complexity,
}: {
  query: string | null;
  playerNumber: number | null;
  maxPlayTime: number | null;
  complexity: string | null;
}): Promise<GetGameListResponse> {
  const url = new URL(`http://localhost:3000/api/games`);

  if (query) {
    url.searchParams.set("query", query);
  }

  if (playerNumber) {
    url.searchParams.set("player_number", String(playerNumber));
  }

  if (maxPlayTime) {
    url.searchParams.set("max_play_time", String(maxPlayTime));
  }

  if (complexity) {
    url.searchParams.set("complexity", complexity);
  }

  const res = await fetch(url);
  return res.json();
}

export async function fetchGameBySlug(
  slug: string,
): Promise<GetGameDetailResponse> {
  const response = await fetch("http://localhost:3000/api/games/" + slug);
  return response.json();
}

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
