import { movies } from "../../data/movie";
import MovieCard from "../../components/movies/movie-card";
import { useBookmarkStore } from "../../stores/bookmark-store";

function MovieListPage() {
  const { bookmarkedMovieIds, toggleBookmark } = useBookmarkStore();

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">공개 예정 영화</h1>

      <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-5">
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            releaseDate={movie.releaseDate}
            poster={movie.posterPath}
            isBookmarked={bookmarkedMovieIds.includes(movie.id)}
            onToggleBookmark={() => toggleBookmark(movie.id)}
          />
        ))}
      </div>
    </main>
  );
}

export default MovieListPage;