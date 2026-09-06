import { db } from "@/src/db";
import {
  GetGameDetailResponse,
  GetGameListResponse,
  mapGamesTableToGame,
  mapGamesTableToGameDetail,
} from "@/src/services/games";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const game = await db.query.gamesTable.findFirst({
    with: { categories: true },
    where: {
      slug: slug,
    },
  });

  if (game) {
    const response: GetGameDetailResponse = mapGamesTableToGameDetail(game);
    return Response.json(response);
  } else {
    return Response.json({ game: null }, { status: 404 });
  }
}
