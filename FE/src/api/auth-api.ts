import { apiClient } from "./api-client";
import { useAuthStore } from "../stores/auth-store";
export const authApi = apiClient.extend({ hooks: {
  beforeRequest: [({ request }) => {
    const token = useAuthStore.getState().accessToken;
    if (token) request.headers.set("Authorization", `Bearer ${token}`);
  }],
  afterResponse: [({ response }) => {
    if (response.status === 401) useAuthStore.getState().setAccessToken(null);
  }],
} });
export async function resultOf<T>(request: Promise<{ json: <U>() => Promise<U> }>): Promise<T> {
  const response = await (await request).json<{ isSuccess: boolean; message: string; result: T }>();
  if (!response.isSuccess) throw new Error(response.message || "요청에 실패했어요.");
  return response.result;
}
