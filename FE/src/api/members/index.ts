import { apiClient } from "../api-client";

type DuplicateResponse = { available: boolean };
export type SignupRequest = { email: string; nickname: string; password: string };
export type SignupResponse = {
  isSuccess: boolean;
  code: string;
  message: string;
  result: { memberId: number; email: string; nickname: string } | null;
};

async function checkDuplicate(field: "email" | "nickname", value: string) {
  const response = await apiClient.get(`members/${field}/${encodeURIComponent(value.trim())}`).json<DuplicateResponse>();
  if (typeof response?.available !== "boolean") throw new Error("서버의 중복 확인 응답을 확인해 주세요.");
  return response;
}
export const checkEmailDuplicate = (email: string) => checkDuplicate("email", email);
export const checkNicknameDuplicate = (nickname: string) => checkDuplicate("nickname", nickname);
export async function signup(body: SignupRequest) {
  const response = await apiClient.post("members", { json: body }).json<SignupResponse>();
  if (response?.isSuccess !== true) throw new Error(response?.message || "회원가입에 실패했어요. 다시 시도해 주세요.");
  return response;
}
