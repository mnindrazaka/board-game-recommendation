import { db } from "@/db";
import { getGameBySlug } from "@/db/repo";
import {
  GetGameDetailResponse,
  mapGamesTableToGameDetail,
} from "@/services/games";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const game = await getGameBySlug(slug);

  const isFavorite = Boolean(
    await db.query.gameFavoritesTable.findFirst({
      where: {
        game_id: game?.id,
        session_id: request.cookies.get("session_id")?.value,
      },
    }),
  );

  if (game) {
    const response: GetGameDetailResponse = mapGamesTableToGameDetail(game);
    response.isFavorite = isFavorite;
    return Response.json(response);
  } else {
    return Response.json({ game: null }, { status: 404 });
  }
}
