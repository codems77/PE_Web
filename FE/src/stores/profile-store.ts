import { create } from "zustand";

type Profile = { email: string; nickname: string; bio: string };
interface ProfileStore {
  profile: Profile;
  updateProfile: (profile: Profile) => void;
}
// 7주차 퍼블리싱용 샘플. 인증·서버 저장은 8주차에 연결합니다.
export const useProfile = create<ProfileStore>((set) => ({
  profile: { email: "movie@umcine.com", nickname: "영화보는피이", bio: "좋은 영화의 여운을 오래 간직해요." },
  updateProfile: (profile) => set({ profile }),
}));
