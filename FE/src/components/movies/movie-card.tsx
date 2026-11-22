"use client";

import Link from "next/link";
import { BookmarkButton } from "../bookmark-button";

type MovieCardProps = {
  id: number;
  title: string;
  releaseDate: string;
  poster: string;
};

function MovieCard({
  id,
  title,
  releaseDate,
  poster,
}: MovieCardProps) {
  return (
    <div className="w-full">
      <div className="relative overflow-hidden rounded-xl bg-gray-100">
        <Link
          href={`/movies/${id}`}
          className="block"
        >
          <img
            className="aspect-[2/3] w-full object-cover"
            src={poster}
            alt={title}
          />
        </Link>

        <div className="absolute right-3 top-3 rounded bg-white p-2 text-xs"><BookmarkButton movieId={id} /></div>
      </div>

      <Link
        href={`/movies/${id}`}
        className="mt-3 block"
      >
        <h2 className="truncate text-base font-semibold text-gray-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {releaseDate}
        </p>
      </Link>
    </div>
  );
}

export default MovieCard;