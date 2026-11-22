import { authApi, resultOf } from "./auth-api";
export interface Rating { ratingId: number; movieId: number; score: number; comment: string | null }
export interface RatingInput { movieId: number; score: number; comment: string }
// The existing member ratings endpoint returns an array without an envelope.
export const getRatings = (memberId: number) => authApi.get(`members/${memberId}/ratings`).json<Rating[]>();
export const createRating = (body: RatingInput) => resultOf<Rating>(authApi.post("ratings", { json: body }));
export const updateRating = (ratingId: number, { score, comment }: RatingInput) => resultOf<Rating>(authApi.patch(`ratings/${ratingId}`, { json: { score, comment } }));
export const deleteRating = (ratingId: number) => resultOf<null>(authApi.delete(`ratings/${ratingId}`));
