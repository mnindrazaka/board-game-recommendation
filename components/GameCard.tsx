import { ComplexityBadge } from "./ComplexityBadge";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { GameFavoriteButton } from "./GameFavoriteButton";

export type GameCardProps = {
  title: string;
  subtitle: string;
  slug: string;
  imageUrl: string;
  complexity: "light" | "medium" | "heavy";
  minPlayer: number;
  maxPlayer: number;
  minPlayTime: number;
  maxPlayTime: number;
  isFavorite: boolean;
  onFavoriteChange?: () => void;
};

export function GameCard(props: GameCardProps) {
  return (
    <Card className="relative mx-auto w-full h-full max-w-sm pt-0">
      <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
      <img
        src={props.imageUrl}
        alt="Game cover"
        className="relative z-20 aspect-video w-full object-cover"
      />
      <CardHeader className="flex flex-col justify-between gap-3 flex-1">
        <CardTitle className="flex justify-between items-center w-full">
          <p>{props.title}</p>
          <GameFavoriteButton
            defaultIsFavorite={props.isFavorite}
            slug={props.slug}
            onFavoriteChange={props.onFavoriteChange}
          />
        </CardTitle>
        <CardDescription>{props.subtitle}</CardDescription>
        <div className="flex gap-3">
          <ComplexityBadge complexity={props.complexity} />
          <p>
            {props.minPlayer}–{props.maxPlayer} players
          </p>
          <p>
            {props.minPlayTime}–{props.maxPlayTime} min
          </p>
        </div>
      </CardHeader>
    </Card>
  );
}
