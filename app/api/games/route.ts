import { db } from "@/db";
import { getGames, getTotalGames } from "@/db/repo";
import { gameFavoritesTable } from "@/db/schema";
import { GetGameListResponse, mapGamesTableToGame } from "@/services/games";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const playerNumber = url.searchParams.get("player_number");
  const maxPlayTime = url.searchParams.get("max_play_time");
  const complexity = url.searchParams.get("complexity");
  const isFavoriteOnly = url.searchParams.get("is_favorite_only");

  const total = await getTotalGames();
  const games = await getGames({
    complexity,
    query,
    maxPlayTime: maxPlayTime !== null ? Number(maxPlayTime) : null,
    playerNumber: playerNumber !== null ? Number(playerNumber) : null,
  });

  const gameIds = games.map(function (game) {
    return game.id;
  });

  const isFavorites = await db
    .select()
    .from(gameFavoritesTable)
    .where(
      and(
        eq(
          gameFavoritesTable.session_id,
          request.cookies.get("session_id")?.value ?? "",
        ),
        inArray(gameFavoritesTable.game_id, gameIds),
      ),
    );

  const response: GetGameListResponse = {
    games: games.map(mapGamesTableToGame),
    total,
  };

  response.games = response.games
    .map(function (game) {
      return {
        ...game,
        isFavorite: isFavorites.some(function (isFavorite) {
          return game.id === isFavorite.game_id;
        }),
      };
    })
    .filter(function (game) {
      // if (isFavoriteOnly === "true") {
      //   return game.isFavorite;
      // }
      // return true;

      return isFavoriteOnly === "true" ? game.isFavorite : true;
    });

  return Response.json(response);
}
