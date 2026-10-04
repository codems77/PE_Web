import Header from "./components/layout/header";
import MovieGrid from "./components/movies/movie-grid";

import { movies } from "./data/movie";
import { useBookmarkStore } from "./stores/bookmark-store";

import "./App.css";

function App() {
  const { bookmarkedMovieIds, toggleBookmark } = useBookmarkStore();

  return (
    <>
      <Header />

      <main className="main">
        <h1>영화 목록</h1>

        <MovieGrid
          movies={movies}
          bookmarkedIds={bookmarkedMovieIds}
          onToggleBookmark={toggleBookmark}
        />
      </main>
    </>
  );
}

export default App;