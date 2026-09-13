"use client";

import { HeartIcon, LoaderIcon } from "lucide-react";
import { Button } from "./ui/button";
import { toggleGameFavorite } from "@/services/games";
import { useState } from "react";

export type GameFavoriteButtonProps = {
  slug: string;
  defaultIsFavorite: boolean;
  onFavoriteChange?: () => void;
};

export function GameFavoriteButton(props: GameFavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(props.defaultIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setIsLoading(true);
    await toggleGameFavorite(props.slug);
    setIsLoading(false);
    setIsFavorite(!isFavorite);

    if (props.onFavoriteChange) {
      props.onFavoriteChange();
    }
  };

  return (
    <Button
      variant="default"
      size="icon"
      aria-label="Submit"
      onClick={handleFavoriteClick}
      className={isFavorite ? "bg-red-400" : "bg-gray-500"}
      disabled={isLoading}
    >
      {isLoading ? (
        <LoaderIcon fill="white" stroke="white" />
      ) : (
        <HeartIcon fill={isFavorite ? "white" : "none"} stroke="white" />
      )}
    </Button>
  );
}
