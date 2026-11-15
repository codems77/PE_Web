import { apiClient } from "./api-client";
import { authApi, resultOf } from "./auth-api";
export interface MemberInfo { email: string; nickname: string; createdAt: string }
export const login = (body: { email: string; password: string }) => resultOf<{ nickname: string; accessToken: string }>(apiClient.post("auth/login", { json: body }));
export const getMe = () => resultOf<MemberInfo>(authApi.get("members/me"));
export const updateMe = (nickname: string) => resultOf<MemberInfo>(authApi.patch("members/me", { json: { nickname } }));
