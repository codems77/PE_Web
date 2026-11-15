import { Link } from "@tanstack/react-router";
import { useFavorite } from "../hooks/use-favorites";
export function BookmarkButton({ movieId }: { movieId: number }) {
  const { token, query, mutation } = useFavorite(movieId);
  if (!token) return <Link to="/login">로그인 후 즐겨찾기</Link>;
  if (query.isLoading) return <span role="status">즐겨찾기 확인 중...</span>;
  if (query.isError) return <button type="button" onClick={() => void query.refetch()}>즐겨찾기 다시 불러오기</button>;
  const selected = query.data?.isFavorite ?? false;
  return <span>
    <button type="button" aria-pressed={selected} disabled={mutation.isPending || query.isFetching} onClick={() => mutation.mutate(selected)}>{selected ? "즐겨찾기 해제" : "즐겨찾기 추가"}</button>
    {mutation.isError && <span role="alert">즐겨찾기 변경에 실패했어요. 다시 시도해 주세요.</span>}
  </span>;
}
