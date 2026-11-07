import { useState, type InputHTMLAttributes, type ReactNode } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  action?: ReactNode;
};
export function Field({ id, label, hint, error, action, type, ...input }: Props) {
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  const describedBy = error || hint ? `${id}-help` : undefined;
  return <div className="field">
    <label htmlFor={id}>{label}</label>
    <div className={`input-row ${error ? 'invalid' : ''}`}>
      <input {...input} id={id} type={password && visible ? 'text' : type} aria-invalid={!!error} aria-describedby={describedBy} />
      {password && <button className="reveal" type="button" disabled={input.disabled} aria-label={`${label} ${visible ? '숨기기' : '보기'}`} aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? '숨김' : '보기'}</button>}
      {action}
    </div>
    {(error || hint) && <p className={error ? 'field-error' : 'field-hint'} id={describedBy}>{error || hint}</p>}
  </div>;
}
