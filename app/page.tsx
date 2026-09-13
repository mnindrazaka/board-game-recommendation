import { GameList } from "@/components/GameList";
import { fetchGames } from "@/services/games";
import { cookies } from "next/headers";

export type HomePageProps = {
  searchParams: Promise<{
    query?: string;
    player_number?: string;
    max_play_time?: string;
    complexity?: string;
    is_favorite_only?: string;
  }>;
};

export default async function Home(props: HomePageProps) {
  const searchParams = await props.searchParams;
  const cookieStore = await cookies();
  const fetchGamesResponse = await fetchGames({
    query: searchParams.query ?? null,
    playerNumber: searchParams.player_number
      ? Number(searchParams.player_number)
      : null,
    complexity: searchParams.complexity ?? null,
    maxPlayTime: searchParams.max_play_time
      ? Number(searchParams.max_play_time)
      : null,
    isFavoriteOnly:
      searchParams.is_favorite_only === undefined
        ? null
        : searchParams.is_favorite_only === "true"
          ? true
          : false,
    cookies: cookieStore.toString(),
  });
  return (
    <div className="flex flex-col gap-8 items-center bg-zinc-50 font-sans dark:bg-black pt-8">
      <div>
        <h1 className="text-3xl font-bold mb-4">Board Game Recommendation</h1>
        <p>
          Browse the library, or describe your group and let the AI pick one for
          you.
        </p>
      </div>

      <div className="container">
        <GameList
          defaultGames={fetchGamesResponse.games}
          defaultTotal={fetchGamesResponse.total}
          defaultText={searchParams.query ?? ""}
          defaultPlayerNumber={
            searchParams.player_number
              ? Number(searchParams.player_number)
              : null
          }
          defaultMaxPlayTime={
            searchParams.max_play_time
              ? Number(searchParams.max_play_time)
              : null
          }
          defaultComplexity={searchParams.complexity ?? null}
          defaultIsFavoriteOnly={
            searchParams.is_favorite_only === undefined
              ? null
              : searchParams.is_favorite_only === "true"
                ? true
                : false
          }
        />
      </div>
    </div>
  );
}
