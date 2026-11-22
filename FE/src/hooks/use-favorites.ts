import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addFavorite, getFavorite, getFavorites, removeFavorite } from "../api/favorites";
import { useAuthStore } from "../stores/auth-store";
export function useFavorites() {
  const token = useAuthStore(s => s.accessToken);
  return useQuery({ queryKey: ["favorites", token], queryFn: getFavorites, enabled: Boolean(token), retry: false });
}
export function useFavorite(movieId: number) {
  const token = useAuthStore(s => s.accessToken);
  const client = useQueryClient();
  const query = useQuery({ queryKey: ["favorites", token, movieId], queryFn: () => getFavorite(movieId), enabled: Boolean(token), retry: false });
  const mutation = useMutation({
    mutationFn: (selected: boolean) => selected ? removeFavorite(movieId) : addFavorite(movieId),
    onSuccess: () => client.invalidateQueries({ queryKey: ["favorites", token] }),
  });
  return { token, query, mutation };
}
