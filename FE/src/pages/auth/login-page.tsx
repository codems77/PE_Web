import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Field } from '../../components/auth/field';
import { isEmailValid } from './validation';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  return <section className="auth-panel" aria-labelledby="login-title">
    <span className="eyebrow">WELCOME BACK</span>
    <h1 id="login-title">다시 만나 반가워요</h1>
    <p className="subtitle">당신의 다음 인생 영화를 만나보세요.</p>
    <form onSubmit={event => event.preventDefault()} noValidate>
      <Field id="email" label="이메일" type="email" autoComplete="email" placeholder="이메일을 입력해 주세요" value={email} onChange={e => { setEmail(e.target.value); }} error={email && !isEmailValid(email) ? '올바른 이메일 형식을 입력해 주세요.' : undefined} />
      <Field id="password" label="비밀번호" type="password" autoComplete="current-password" placeholder="비밀번호를 입력해 주세요" value={password} onChange={e => { setPassword(e.target.value); }} />
      <button className="button primary full" type="submit" disabled={!isEmailValid(email) || !password}>로그인</button>
    </form>
    <p className="auth-link">아직 회원이 아니신가요? <Link to="/signup">회원가입</Link></p>
  </section>;
}
