"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMe, type MemberInfo } from "../../api/account";
import { useMe } from "../../hooks/use-account";
import { useAuthStore } from "../../stores/auth-store";
import { Field } from "../../components/auth/field";
export function EditProfilePage() {
  const me = useMe();
  if (me.isLoading) return <p role="status">내 정보 불러오는 중...</p>;
  if (!me.data || me.isError) return <button onClick={() => void me.refetch()}>내 정보 다시 불러오기</button>;
  return <EditForm profile={me.data} />;
}
function EditForm({ profile }: { profile: MemberInfo }) {
  const [nickname, setNickname] = useState(profile.nickname);
  const token = useAuthStore(s => s.accessToken);
  const client = useQueryClient();
  const router = useRouter();
  const mutation = useMutation({ mutationFn: updateMe, onSuccess: data => {
    client.setQueryData(["members", "me", token], data);
    router.push("/mypage");
  } });
  const valid = nickname.trim().length >= 2 && nickname.trim().length <= 12;
  return <section className="profile-panel"><h1>내 정보 수정</h1><form onSubmit={e => { e.preventDefault(); if (valid && !mutation.isPending) mutation.mutate(nickname.trim()); }}>
    <Field id="email" label="이메일" value={profile.email} readOnly />
    <Field id="nickname" label="닉네임" value={nickname} onChange={e => setNickname(e.target.value)} hint="2~12자의 닉네임" />
    <Link href="/mypage">취소</Link><button disabled={!valid || mutation.isPending} type="submit">{mutation.isPending ? "저장 중..." : "변경사항 저장"}</button>
    {mutation.isError && <p role="alert">내 정보 수정에 실패했어요. 다시 시도해 주세요.</p>}
  </form></section>;
}
