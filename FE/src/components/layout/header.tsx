import { Link } from "@tanstack/react-router";

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* 왼쪽 */}
        <div className="flex items-center gap-4 sm:gap-10">
          {/* 로고 */}
          <div className="flex items-center gap-2">
            <img
              src="/icons/movie-icons/movie.svg"
              alt=""
              className="h-7 w-7"
            />
            <span className="text-xl font-bold text-gray-900">
              UMCine
            </span>
          </div>

          {/* 메뉴 */}
          <nav className="flex items-center gap-3 text-xs sm:gap-7 sm:text-sm font-medium">
            <Link to="/" className="font-semibold text-gray-900">영화</Link>

            <Link
              to="/search"
              className="text-gray-500 transition hover:text-gray-900"
            >
              검색
            </Link>

            <Link to="/mypage" className="text-gray-500 transition hover:text-gray-900">내 정보</Link>
          </nav>
        </div>

        {/* 오른쪽 */}
        <div className="flex items-center gap-4">
          <Link
            to="/search"
            aria-label="검색"
            className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-gray-100"
          >
            <img
              src="/icons/movie-icons/search.svg"
              alt=""
              className="h-5 w-5"
            />
          </Link>

          <Link
            to="/login"
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-700"
          >
            로그인
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;