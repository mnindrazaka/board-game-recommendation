import { count } from "drizzle-orm";
import { db } from ".";
import { gamesTable } from "./schema";

export function getGameBySlug(slug: string) {
  return db.query.gamesTable.findFirst({
    with: { categories: true },
    where: {
      slug: slug,
    },
  });
}

export function getGames({
  playerNumber,
  maxPlayTime,
  complexity,
  query,
}: {
  playerNumber: number | null;
  maxPlayTime: number | null;
  complexity: string | null;
  query: string | null;
}) {
  return db.query.gamesTable.findMany({
    with: { categories: true },
    where: {
      min_player: playerNumber !== null ? { lte: playerNumber } : undefined,
      max_player: playerNumber !== null ? { gte: playerNumber } : undefined,
      max_play_time: maxPlayTime !== null ? { lte: maxPlayTime } : undefined,
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
}

export async function getTotalGames() {
  const [{ total }] = await db.select({ total: count() }).from(gamesTable);
  return total;
}
