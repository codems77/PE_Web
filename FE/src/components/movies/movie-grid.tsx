import MovieCard from "./movie-card";
import type { Movie } from "../../types/movie";

type MovieGridProps = {
  movies: Movie[];
};

function MovieGrid({ movies }: MovieGridProps) {

  return (
    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          id={movie.id}
          title={movie.title}
          releaseDate={movie.releaseDate}
          poster={movie.posterPath}
        />
      ))}
    </div>
  );
}

export default MovieGrid;