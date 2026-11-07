import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Field } from '../../components/auth/field';
import { useProfile } from '../../stores/profile-store';
import { isNicknameValid } from '../auth/validation';

export function EditProfilePage() {
  const { profile, updateProfile } = useProfile();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState(profile.nickname);
  const [bio, setBio] = useState(profile.bio);
  const valid = isNicknameValid(nickname) && bio.length <= 100;
  const changed = nickname.trim() !== profile.nickname || bio.trim() !== profile.bio;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || !changed) return;
    updateProfile({ ...profile, nickname: nickname.trim(), bio: bio.trim() });
    void navigate({ to: '/mypage', search: { updated: true } });
  }
  return <section className="profile-panel" aria-labelledby="edit-title">
    <Link className="back-link" to="/mypage">← 내 정보로 돌아가기</Link>
    <span className="eyebrow">EDIT PROFILE</span><h1 id="edit-title">내 정보 수정</h1><p className="subtitle">지금의 나를 담은 프로필로 바꿔보세요.</p>
    <form className="profile-card edit-card" onSubmit={submit} noValidate>
      <div className="edit-avatar"><div className="avatar" aria-hidden="true">{nickname.trim().slice(0, 1) || '나'}</div><p>나를 표현하는 프로필</p></div>
      <Field id="email" label="이메일" type="email" value={profile.email} readOnly hint="가입한 이메일은 변경할 수 없어요." />
      <Field id="nickname" label="닉네임" value={nickname} onChange={e => setNickname(e.target.value)} autoComplete="nickname" hint="2~12자의 닉네임을 입력해 주세요." error={!isNicknameValid(nickname) ? '닉네임은 2~12자로 입력해 주세요.' : undefined} />
      <div className="field"><label htmlFor="bio">한 줄 소개 <span className="optional">선택</span></label><textarea id="bio" rows={3} placeholder="어떤 영화를 좋아하시나요?" value={bio} onChange={e => setBio(e.target.value)} aria-invalid={bio.length > 100} aria-describedby="bio-count" /><p id="bio-count" className={bio.length > 100 ? 'field-error counter' : 'field-hint counter'}>{bio.length} / 100</p></div>
      <div className="form-actions"><Link className="button secondary" to="/mypage">취소</Link><button type="submit" className="button primary" disabled={!valid || !changed}>변경사항 저장</button></div>
    </form>
  </section>;
}
