import { authApi, resultOf } from "./auth-api";
// PDF defines the endpoints; keep the favorite response contract in this module.
export interface Favorite { movieId: number }
export async function getFavorites(): Promise<Favorite[]> {
  const favorites = await resultOf<Favorite[]>(authApi.get("favorites"));
  if (!Array.isArray(favorites) || favorites.some(f => !Number.isSafeInteger(f.movieId) || f.movieId <= 0)) {
    throw new Error("즐겨찾기 목록 응답 형식을 확인해 주세요.");
  }
  return favorites;
}
export async function getFavorite(movieId: number) {
  const favorite = await resultOf<{ isFavorite: boolean }>(authApi.get(`favorites/${movieId}`));
  if (typeof favorite?.isFavorite !== "boolean") throw new Error("즐겨찾기 상태 응답 형식을 확인해 주세요.");
  return favorite;
}
export const addFavorite = (movieId: number) => resultOf<unknown>(authApi.post("favorites", { json: { movieId } }));
export const removeFavorite = (movieId: number) => resultOf<unknown>(authApi.delete(`favorites/${movieId}`));
