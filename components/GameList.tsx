"use client";

import { fetchGames, Game } from "@/services/games";
import { GameCard } from "./GameCard";
import { useEffect, useState } from "react";
import { Field, FieldLabel } from "./ui/field";
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";
import { Card, CardHeader } from "./ui/card";
import { useDebounce } from "use-debounce";
import { GameCardLoading } from "./GameCardLoading";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import Link from "next/link";

const playerNumberItems = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4", value: 4 },
  { label: "5", value: 5 },
  { label: "6", value: 6 },
  { label: "7", value: 7 },
  { label: "8", value: 8 },
];

const maxPlayTimeItems = [
  { label: "Any", value: null },
  { label: "<= 30", value: 30 },
  { label: "<= 60", value: 60 },
  { label: "<= 90", value: 90 },
  { label: "<= 120", value: 120 },
];

const complexityItems = [
  { label: "Any", value: null },
  { label: "Light", value: "light" },
  { label: "Medium", value: "medium" },
  { label: "Heavy", value: "heavy" },
];

export type GameListProps = {
  defaultGames: Game[];
  defaultText: string;
  defaultPlayerNumber: number | null;
  defaultMaxPlayTime: number | null;
  defaultComplexity: string | null;
  defaultTotal: number;
};

export function GameList(props: GameListProps) {
  const [games, setGames] = useState<Game[]>(props.defaultGames);
  const [total, setTotal] = useState<number>(props.defaultTotal);

  const [text, setText] = useState<string>(props.defaultText);
  const [query] = useDebounce(text, 600);

  const [playerNumber, setPlayerNumber] = useState<number | null>(
    props.defaultPlayerNumber,
  );
  const [maxPlayTime, setMaxPlayTime] = useState<number | null>(
    props.defaultMaxPlayTime,
  );
  const [complexity, setComplexity] = useState<string | null>(
    props.defaultComplexity,
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    (async function () {
      if (
        query !== props.defaultText ||
        playerNumber !== props.defaultPlayerNumber ||
        maxPlayTime !== props.defaultMaxPlayTime ||
        complexity !== props.defaultComplexity ||
        games !== props.defaultGames
      ) {
        setLoading(true);
        setError(false);
        try {
          const response = await fetchGames({
            query,
            playerNumber,
            maxPlayTime,
            complexity,
          });
          setGames(response.games);
          setTotal(response.total);
          response.total;
        } catch (err) {
          setError(true);
        } finally {
          setLoading(false);
        }
      }
    })();
  }, [query, playerNumber, maxPlayTime, complexity]);

  useEffect(() => {
    const url = new URL(window.location.origin + window.location.pathname);

    if (query !== "") {
      url.searchParams.set("query", query);
    }

    if (playerNumber !== null) {
      url.searchParams.set("player_number", playerNumber.toString());
    }

    if (maxPlayTime !== null) {
      url.searchParams.set("max_play_time", maxPlayTime.toString());
    }

    if (complexity !== null) {
      url.searchParams.set("complexity", complexity);
    }

    window.history.replaceState({}, "", url);
  }, [query, playerNumber, maxPlayTime, complexity]);

  function onSearchChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newText = event.target.value;
    setText(newText);
  }

  function onPlayerNumberChange(value: number | null) {
    setPlayerNumber(value);
  }

  function onMaxPlayTimeChange(value: number | null) {
    setMaxPlayTime(value);
  }

  function onComplexityChange(value: string | null) {
    setComplexity(value);
  }

  function onRetryClick() {
    (async function () {
      setLoading(true);
      setError(false);
      try {
        const response = await fetchGames({
          query,
          playerNumber,
          maxPlayTime,
          complexity,
        });
        setGames(response.games);
        setTotal(response.total);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex gap-3">
            <Field>
              <FieldLabel htmlFor="input-button-group">Search</FieldLabel>
              <ButtonGroup>
                <Input
                  id="input-button-group"
                  placeholder="Type to search..."
                  value={text}
                  onChange={onSearchChange}
                />
              </ButtonGroup>
            </Field>

            <Field>
              <FieldLabel>Player Number</FieldLabel>
              <Select
                items={playerNumberItems}
                value={playerNumber}
                onValueChange={onPlayerNumberChange}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {playerNumberItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Max Play Time</FieldLabel>
              <Select
                items={maxPlayTimeItems}
                value={maxPlayTime}
                onValueChange={onMaxPlayTimeChange}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {maxPlayTimeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <Field>
              <FieldLabel>Complexity</FieldLabel>
              <Select
                items={complexityItems}
                value={complexity}
                onValueChange={onComplexityChange}
              >
                <SelectTrigger className="w-full max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {complexityItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>
        </CardHeader>
      </Card>
      {loading ? (
        <div className="flex w-full flex-wrap items-stretch gap-4">
          <div className="w-[calc(25%-16px)]">
            <GameCardLoading />
          </div>
          <div className="w-[calc(25%-16px)]">
            <GameCardLoading />
          </div>
          <div className="w-[calc(25%-16px)]">
            <GameCardLoading />
          </div>
          <div className="w-[calc(25%-16px)]">
            <GameCardLoading />
          </div>
        </div>
      ) : error ? (
        <div className="flex flex-col gap-2 items-center">
          <h1 className="text-3xl font-bold">Failed to fetch games</h1>
          <p>Error occurred while fetching games.</p>
          <Button onClick={onRetryClick}>Retry</Button>
        </div>
      ) : games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <div>
          <p>
            {games.length} of {total} games
          </p>
          <div className="flex w-full flex-wrap items-stretch gap-4">
            {games.map(function (game) {
              return (
                <div className="w-[calc(25%-16px)]" key={game.id}>
                  <Link href={`/games/${game.slug}`}>
                    <GameCard
                      title={game.title}
                      subtitle={game.subtitle}
                      complexity={game.complexity}
                      minPlayer={game.minPlayer}
                      maxPlayer={game.maxPlayer}
                      minPlayTime={game.minPlayTime}
                      maxPlayTime={game.maxPlayTime}
                      imageUrl={game.imageUrl}
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
