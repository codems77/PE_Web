# 7주차 FE 미션

기준: `codems77/PE_Web`의 `week6` 브랜치 (`176206db97d0a715e59a6e05620541ee2224042e`). 기존 FE의 Vite, React, Tailwind, TanStack 파일 라우터, ky, Zustand를 그대로 사용합니다. BE와 루트 설정, FE/package.json, FE/pnpm-lock.yaml은 변경하지 않았습니다.

## 적용 및 실행

변경 파일 ZIP의 `FE/`를 기존 프로젝트의 `FE/`에 덮어씁니다. 앞서 제공한 npm 프로젝트 ZIP은 사용하지 않습니다.

```bash
cd FE
pnpm install --frozen-lockfile
pnpm dev
```

기존 `.env.local`의 TMDB 설정은 유지합니다. 회원 서버를 연결하려면 같은 파일에 `VITE_API_BASE_URL=http://localhost:8080`을 추가합니다(미지정 시 기본값 동일). 실제 가입을 위해서는 회원 서버 실행 및 CORS 설정이 필요합니다. 비밀 값은 이 문서나 ZIP에 포함하지 않습니다.

## 필수 미션

- `/login`: 이메일·비밀번호 입력, 이메일 검증, 비밀번호 표시 전환, 가입 화면 연결. 이번 주차는 퍼블리싱이므로 로그인 성공이나 토큰 발급을 모의 처리하지 않습니다.
- `/mypage`: 샘플 프로필 조회.
- `/mypage/edit`: 닉네임 2~12자·소개 100자 검증, 저장 후 조회 화면에 반영, 취소 시 변경 폐기. Zustand 메모리 상태로 유지하며 새로고침 시 초기화됩니다. 이메일은 읽기 전용입니다.
- 기존 헤더의 내 정보·로그인 메뉴를 실제 경로에 연결했습니다. 영화·검색 화면은 유지합니다.

## 본문 실습

`/signup` 회원가입 폼을 추가했습니다. 이메일·닉네임·비밀번호·비밀번호 확인을 검증합니다. 이메일/닉네임 중복 확인을 모두 통과해야 제출할 수 있습니다. 확인 후 입력값 수정 시 확인 결과를 초기화하며, 요청 중 해당 입력/버튼을 잠급니다. 가입 실패 시 입력값을 유지하고 성공/실패를 화면에 안내합니다.

- `GET /members/email/{email}`, `GET /members/nickname/{nickname}` → `{ available: boolean }`
- `POST /members` → `{ email, nickname, password }` (`passwordConfirm` 제외)
- 가입 응답은 워크북의 `{ isSuccess, code, message, result }` 형식입니다.
- ky 요청은 10초 제한·자동 재시도 없음으로 처리합니다.

## 선택 미션

조회·수정은 `src/pages/member/`, 로그인·회원가입은 `src/pages/auth/`로 묶었습니다. 인증용 레이아웃이나 접근 제한은 추가하지 않았습니다. 공통 `AccountPage`는 스타일 범위만 묶으며 권한 검사는 하지 않습니다.

## 검증

- 기존 pnpm 잠금 파일로 Linux 의존성 설치 성공.
- `pnpm run build`: TypeScript 검사·프로덕션 빌드 통과.
- `pnpm exec oxlint src`: 소스 검사 통과. 기존 `pnpm run lint`는 추적 중인 node_modules까지 검사해 실패하므로 소스 범위를 명시해 검증했습니다.
- Chromium 브라우저 테스트 5개 통과: 로그인 검증/안내, 모바일 프로필 수정/취소/새로고침 초기화, 중복 확인 상태/초기화, 가입 요청/성공/실패/입력 보존, 비밀번호 조건/일치 검증. 테스트 도구는 저장소 외부에 설치해 기존 의존성 설정을 유지했습니다.
- 회원가입 API는 브라우저 요청 가로채기로 검증했습니다. 실제 회원 서버는 실행하지 않았습니다. 로그인·내 정보 서버 연동은 다음 주차 범위입니다.
- 원본 Figma 링크는 네트워크에서 차단되어 PDF 화면의 색상과 구성을 참고했습니다. 원본 디자인과의 일치 여부는 확인하지 못했습니다.

PR 생성·원격 push·외부 제출은 수행하지 않았습니다.
