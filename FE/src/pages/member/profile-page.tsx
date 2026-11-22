import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../../api/movies/get-movie-detail";
import { Link } from "@tanstack/react-router";
import { useMe } from "../../hooks/use-account";
import { useFavorites } from "../../hooks/use-favorites";
export function ProfilePage() {
  const me = useMe();
  const favorites = useFavorites();
  return <section className="profile-panel"><h1>내 정보</h1>
    {me.isLoading ? <p role="status">내 정보 불러오는 중...</p> : me.isError ? <button onClick={() => void me.refetch()}>내 정보 다시 불러오기</button> : me.data && <div className="profile-card"><h2>{me.data.nickname}님</h2><p>{me.data.email}</p><Link to="/mypage/edit">내 정보 수정</Link></div>}
    <h2>즐겨찾는 영화</h2>
    {favorites.isLoading ? <p role="status">즐겨찾기 불러오는 중...</p> : favorites.isError ? <button onClick={() => void favorites.refetch()}>즐겨찾기 다시 불러오기</button> : favorites.data?.length ? <ul>{favorites.data.map(f => <FavoriteMovie key={f.movieId} movieId={f.movieId} />)}</ul> : <p>즐겨찾는 영화가 없어요.</p>}
  </section>;
}

function FavoriteMovie({ movieId }: { movieId: number }) {
  const movie = useQuery({ queryKey: ["movies", movieId], queryFn: () => getMovieDetail(movieId) });
  return <li><Link to="/movies/$movieId" params={{ movieId: String(movieId) }}>{movie.data?.title ?? `영화 ${movieId}`}</Link></li>;
}
