import { getGames, getTotalGames } from "@/db/repo";
import { GetGameListResponse, mapGamesTableToGame } from "@/services/games";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  const playerNumber = url.searchParams.get("player_number");
  const maxPlayTime = url.searchParams.get("max_play_time");
  const complexity = url.searchParams.get("complexity");

  const total = await getTotalGames();
  const games = await getGames({
    complexity,
    query,
    maxPlayTime: maxPlayTime !== null ? Number(maxPlayTime) : null,
    playerNumber: playerNumber !== null ? Number(playerNumber) : null,
  });

  const response: GetGameListResponse = {
    games: games.map(mapGamesTableToGame),
    total,
  };

  return Response.json(response);
}
