import { ComplexityBadge } from "@/components/ComplexityBadge";
import { Badge } from "@/components/ui/badge";
import { fetchGameBySlug } from "@/services/games";
import Link from "next/link";

export type GameDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function GameDetailPage(props: GameDetailPageProps) {
  const params = await props.params;
  const game = await fetchGameBySlug(params.slug);
  return (
    <div>
      <Link href="/">Back to games</Link>

      <img src={game.imageUrl} alt={game.title} />
      <h1>{game.title}</h1>
      <p>{game.subtitle}</p>

      <div>
        <ComplexityBadge complexity={game.complexity} />
        {game.categories.map((category) => (
          <Badge key={category.id}>{category.title}</Badge>
        ))}
      </div>

      <div>
        <p>
          {game.minPlayer}–{game.maxPlayer} players
        </p>
        <p>
          {game.minPlayTime}–{game.maxPlayTime} min
        </p>
        <p>{game.publishedYear}</p>
      </div>

      <p>{game.description}</p>
    </div>
  );
}
