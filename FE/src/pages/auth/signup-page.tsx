import { useRef, useState, type FormEvent } from 'react';
import { Link } from '@tanstack/react-router';
import { Field } from '../../components/auth/field';
import { checkEmailDuplicate, checkNicknameDuplicate, signup } from '../../api/members';
import { memberErrorMessage } from '../../api/members/error-message';
import { isEmailValid, isNicknameValid, isPasswordValid, PASSWORD_HINT } from './validation';

type Form = { email: string; nickname: string; password: string; passwordConfirm: string };
type CheckKey = 'email' | 'nickname';
type Check = { state: 'idle' | 'pending' | 'available' | 'error'; message: string };
const initialCheck: Check = { state: 'idle', message: '' };

export function SignupPage() {
  const [form, setForm] = useState<Form>({ email: '', nickname: '', password: '', passwordConfirm: '' });
  const [checks, setChecks] = useState<Record<CheckKey, Check>>({ email: initialCheck, nickname: initialCheck });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const locks = useRef({ email: false, nickname: false, submit: false });
  const valid = { email: isEmailValid(form.email), nickname: isNicknameValid(form.nickname), password: isPasswordValid(form.password), passwordConfirm: !!form.passwordConfirm && form.password === form.passwordConfirm };
  const canSubmit = Object.values(valid).every(Boolean) && checks.email.state === 'available' && checks.nickname.state === 'available';
  function change(key: keyof Form, value: string) {
    if (submitting || (key in checks && locks.current[key as CheckKey])) return;
    setForm(previous => ({ ...previous, [key]: value }));
    setResult(null);
    if (key === 'email' || key === 'nickname') setChecks(previous => ({ ...previous, [key]: initialCheck }));
  }
  async function check(key: CheckKey) {
    if (!valid[key] || locks.current[key] || locks.current.submit) return;
    locks.current[key] = true;
    setChecks(previous => ({ ...previous, [key]: { state: 'pending', message: '중복 여부를 확인하고 있어요.' } }));
    const label = key === 'email' ? '이메일' : '닉네임';
    try {
      const response = await (key === 'email' ? checkEmailDuplicate(form.email) : checkNicknameDuplicate(form.nickname));
      setChecks(previous => ({ ...previous, [key]: { state: response.available ? 'available' : 'error', message: response.available ? `사용할 수 있는 ${label}이에요.` : `이미 사용 중인 ${label}이에요.` } }));
    } catch (error) {
      setChecks(previous => ({ ...previous, [key]: { state: 'error', message: memberErrorMessage(error, '중복 확인에 실패했어요. 서버 연결을 확인하고 다시 시도해 주세요.') } }));
    } finally { locks.current[key] = false; }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit || locks.current.submit) return;
    locks.current.submit = true;
    setSubmitting(true);
    setResult(null);
    try {
      const response = await signup({ email: form.email.trim(), nickname: form.nickname.trim(), password: form.password });
      setResult({ success: true, message: response.message || '회원가입이 완료되었어요.' });
      setForm({ email: '', nickname: '', password: '', passwordConfirm: '' });
      setChecks({ email: initialCheck, nickname: initialCheck });
    } catch (error) {
      setResult({ success: false, message: memberErrorMessage(error, '회원가입에 실패했어요. 서버 연결을 확인하고 다시 시도해 주세요.') });
    } finally { locks.current.submit = false; setSubmitting(false); }
  }
  return <section className="auth-panel signup-panel" aria-labelledby="signup-title">
    <span className="eyebrow">JOIN UMCINE</span>
    <h1 id="signup-title">새로운 취향의 시작</h1>
    <p className="subtitle">회원가입하고 나만의 영화 이야기를 만들어 보세요.</p>
    <form onSubmit={submit} noValidate>
      {(['email', 'nickname'] as const).map(key => <div key={key}>
        <Field id={key} label={key === 'email' ? '이메일' : '닉네임'} type={key === 'email' ? 'email' : 'text'} autoComplete={key === 'email' ? 'email' : 'nickname'} placeholder={key === 'email' ? 'you@example.com' : '2~12자의 닉네임'} value={form[key]} disabled={submitting || checks[key].state === 'pending'} onChange={e => change(key, e.target.value)} error={form[key] && !valid[key] ? (key === 'email' ? '올바른 이메일 형식을 입력해 주세요.' : '닉네임은 2~12자로 입력해 주세요.') : undefined} action={<button type="button" className="check-button" disabled={!valid[key] || checks[key].state === 'pending' || submitting} onClick={() => void check(key)}>{checks[key].state === 'pending' ? '확인 중…' : '중복 확인'}</button>} />
        {checks[key].message && <p role="status" className={`check-message ${checks[key].state === 'error' ? 'field-error' : checks[key].state === 'available' ? 'success-text' : ''}`}>{checks[key].message}</p>}
      </div>)}
      <Field id="password" label="비밀번호" type="password" autoComplete="new-password" placeholder="비밀번호를 입력해 주세요" value={form.password} disabled={submitting} onChange={e => change('password', e.target.value)} hint={PASSWORD_HINT} error={form.password && !valid.password ? PASSWORD_HINT : undefined} />
      <Field id="passwordConfirm" label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="비밀번호를 한 번 더 입력해 주세요" value={form.passwordConfirm} disabled={submitting} onChange={e => change('passwordConfirm', e.target.value)} error={form.passwordConfirm && !valid.passwordConfirm ? '비밀번호가 일치하지 않아요.' : undefined} />
      <button className="button primary full" type="submit" disabled={!canSubmit || submitting}>{submitting ? '가입 중…' : '가입하기'}</button>
      {result && <div className={`notice ${result.success ? 'success' : 'error'}`} role={result.success ? 'status' : 'alert'}>{result.message}{result.success && <Link to="/login">로그인 화면으로 →</Link>}</div>}
    </form>
    <p className="auth-link">이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
  </section>;
}
