import { useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { Field } from '../../components/auth/field';
import { isEmailValid } from './validation';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [notice, setNotice] = useState('');
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isEmailValid(email) && password.length > 0) setNotice('로그인 화면 구현을 완료했어요. 실제 로그인과 JWT 인증은 다음 주차에 연결할 예정이에요.');
  }
  return <section className="auth-panel" aria-labelledby="login-title">
    <span className="eyebrow">WELCOME BACK</span>
    <h1 id="login-title">다시 만나 반가워요</h1>
    <p className="subtitle">당신의 다음 인생 영화를 만나보세요.</p>
    <form onSubmit={handleSubmit} noValidate>
      <Field id="email" label="이메일" type="email" autoComplete="email" placeholder="이메일을 입력해 주세요" value={email} onChange={e => { setEmail(e.target.value); setNotice(''); }} error={email && !isEmailValid(email) ? '올바른 이메일 형식을 입력해 주세요.' : undefined} />
      <Field id="password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요" value={password} onChange={e => { setPassword(e.target.value); setNotice(''); }} />
      <button className="button primary full" type="submit" disabled={!isEmailValid(email) || !password}>로그인</button>
      {notice && <p className="notice" role="status">{notice}</p>}
    </form>
    <p className="auth-link">아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
    <div className="scope-note"><span aria-hidden="true">ⓘ</span> 이번 미션은 화면 구현 단계예요. <Link to="/mypage">내 정보 화면 둘러보기 →</Link></div>
  </section>;
}
