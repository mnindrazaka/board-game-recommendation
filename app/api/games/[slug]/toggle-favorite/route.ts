import { db } from "@/db";
import { gameFavoritesTable, gamesTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  let sessionId = request.cookies.get("session_id")?.value;

  if (sessionId === undefined) {
    const newSessionId = crypto.randomUUID();
    sessionId = newSessionId;

    // set cookies to frontend
    const cookieStore = await cookies();
    cookieStore.set("session_id", newSessionId);
  }

  // save to DB
  const { slug } = await params;
  const game = await db.query.gamesTable.findFirst({ where: { slug } });
  if (game) {
    const isFavorite = await db.query.gameFavoritesTable.findFirst({
      where: {
        game_id: game?.id,
        session_id: sessionId,
      },
    });

    if (isFavorite) {
      await db
        .delete(gameFavoritesTable)
        .where(
          and(
            eq(gameFavoritesTable.game_id, game?.id),
            eq(gameFavoritesTable.session_id, sessionId),
          ),
        );
    } else {
      await db.insert(gameFavoritesTable).values({
        id: crypto.randomUUID(),
        game_id: game.id,
        session_id: sessionId,
      });
    }

    return Response.json({ success: true });
  } else {
    return Response.json({ success: false });
  }
}
