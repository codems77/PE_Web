"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRating, deleteRating, getRatings, updateRating, type Rating } from "../../api/ratings";
import { getMemberId, useAuthStore } from "../../stores/auth-store";
export function MovieRating({ movieId }: { movieId: number }) {
  const token = useAuthStore(s => s.accessToken);
  const memberId = getMemberId(token);
  const query = useQuery({ queryKey: ["ratings", token, memberId], queryFn: () => getRatings(memberId!), enabled: Boolean(memberId), retry: false });
  if (!token) return <Link href="/login">로그인 후 평점 남기기</Link>;
  if (!memberId) return <p role="alert">회원 ID를 확인할 수 없어요. 다시 로그인해 주세요.</p>;
  if (query.isLoading) return <p role="status">내 평점 불러오는 중...</p>;
  if (query.isError) return <button onClick={() => void query.refetch()}>평점 다시 불러오기</button>;
  const rating = query.data?.find(r => r.movieId === movieId);
  return <RatingForm key={`${movieId}-${rating?.ratingId}-${rating?.score}-${rating?.comment}`} movieId={movieId} rating={rating} queryKey={["ratings", token, memberId]} />;
}
function RatingForm({ movieId, rating, queryKey }: { movieId: number; rating?: Rating; queryKey: readonly unknown[] }) {
  const [score, setScore] = useState(rating?.score ?? 5);
  const [comment, setComment] = useState(rating?.comment ?? "");
  const client = useQueryClient();
  const mutation = useMutation({
    mutationFn: (action: "save" | "delete") => action === "delete" ? deleteRating(rating!.ratingId) : rating ? updateRating(rating.ratingId, { movieId, score, comment }) : createRating({ movieId, score, comment }),
    onSuccess: () => client.invalidateQueries({ queryKey }),
  });
  return <section className="mt-8" aria-labelledby="rating-title"><h2 id="rating-title">내 평점</h2>
    <form onSubmit={e => { e.preventDefault(); if (!mutation.isPending && comment.length <= 500) mutation.mutate("save"); }}>
      <fieldset disabled={mutation.isPending}>
        <label htmlFor="score">별점</label><select id="score" value={score} onChange={e => setScore(Number(e.target.value))}>{[1,2,3,4,5].map(n => <option key={n} value={n}>{n}점</option>)}</select>
        <label htmlFor="comment">후기 (선택, 500자 이하)</label><textarea id="comment" maxLength={500} value={comment} onChange={e => setComment(e.target.value)} />
        <button type="submit">{mutation.isPending ? "처리 중..." : rating ? "평점 수정" : "평점 등록"}</button>
        {rating && <button type="button" onClick={() => mutation.mutate("delete")}>평점 삭제</button>}
      </fieldset>
    </form>{mutation.isError && <p role="alert">평점 변경에 실패했어요. 다시 시도해 주세요.</p>}
  </section>;
}
