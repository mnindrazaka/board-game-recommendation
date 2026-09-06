import { db } from "@/src/db";
import { gamesTable } from "@/src/db/schema";
import { GetGameListResponse, mapGamesTableToGame } from "@/src/services/games";
import { count } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const playerNumber = url.searchParams.get("player_number");
  const maxPlayTime = url.searchParams.get("max_play_time");
  const complexity = url.searchParams.get("complexity");

  const [{ total }] = await db.select({ total: count() }).from(gamesTable);

  const games = await db.query.gamesTable.findMany({
    with: { categories: true },
    where: {
      min_player:
        playerNumber !== null ? { lte: Number(playerNumber) } : undefined,
      max_player:
        playerNumber !== null ? { gte: Number(playerNumber) } : undefined,
      max_play_time:
        maxPlayTime !== null ? { lte: Number(maxPlayTime) } : undefined,
      complexity: complexity !== null ? { eq: complexity } : undefined,
      OR: [
        { title: query !== null ? { like: `%${query}%` } : undefined },
        { description: query !== null ? { like: `%${query}%` } : undefined },
        {
          categories: {
            title: query !== null ? { like: `%${query}%` } : undefined,
          },
        },
      ],
    },
  });

  const response: GetGameListResponse = {
    games: games.map(mapGamesTableToGame),
    total,
  };

  return Response.json(response);
}
