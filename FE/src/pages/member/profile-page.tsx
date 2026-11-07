import { Link, useSearch } from '@tanstack/react-router';
import { useProfile } from '../../stores/profile-store';

export function ProfilePage() {
  const { profile } = useProfile();
  const { updated } = useSearch({ from: '/mypage' });
  return <section className="profile-panel" aria-labelledby="profile-title">
    <div className="page-heading"><div><span className="eyebrow">MY ACCOUNT</span><h1 id="profile-title">내 정보</h1><p className="subtitle">영화를 좋아하는 나를 소개해 보세요.</p></div><span className="small-badge">프로필</span></div>
    {updated && <p className="notice success" role="status">프로필을 수정했어요. 변경한 내용을 확인해 보세요.</p>}
    <div className="profile-card">
      <div className="profile-summary"><div className="avatar" aria-hidden="true">{profile.nickname.slice(0, 1)}</div><div><span className="muted-label">반가워요!</span><h2>{profile.nickname}<span>님</span></h2><p>나만의 영화 취향을 쌓아가는 중</p></div></div>
      <dl className="profile-details"><div><dt>이메일</dt><dd>{profile.email}</dd></div><div><dt>닉네임</dt><dd>{profile.nickname}</dd></div><div><dt>한 줄 소개</dt><dd>{profile.bio || '아직 소개를 작성하지 않았어요.'}</dd></div></dl>
      <Link className="button primary" to="/mypage/edit">내 정보 수정 <span aria-hidden="true">↗</span></Link>
    </div>
    <p className="scope-note">샘플 프로필이에요. 수정 내용은 현재 화면에서만 유지되며 새로고침하면 초기화돼요. 서버 연동과 로그인 인증은 다음 주차에 진행해요.</p>
  </section>;
}
