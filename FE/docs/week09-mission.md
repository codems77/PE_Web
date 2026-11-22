# FE 9주차 필수 미션 · UMCine Next.js 마이그레이션

## 핵심 변경

- `src/app`에서 홈, 검색, 영화 상세, 로그인, 회원가입, 마이페이지와 프로필 수정 경로를 정의합니다. 서버 페이지에서 검색어와 영화 ID를 받아 화면에 넘기고, 화면에서는 `next/link`와 `useRouter`로 이동합니다.
- React Query와 Zustand는 클라이언트에서 사용합니다. 로그인 상태는 마운트 후 브라우저 저장소에서 복원하며, 복원이 끝난 뒤 접근 권한에 따라 이동합니다.
- 영화 요청은 `/api/tmdb`를 거칩니다. Next.js Route Handler가 허용된 영화 조회 경로에만 TMDB 토큰을 붙여 요청합니다. Tailwind CSS는 PostCSS 플러그인으로 처리합니다.

## 로컬 실행

Node.js 24와 pnpm 11 기준입니다.

```bash
git switch fe-week9
cd FE
pnpm install --frozen-lockfile --force
pnpm dev
```

기존 브랜치가 macOS용 `FE/node_modules`를 추적하므로 첫 설치에서 `--force`로 현재 플랫폼의 의존성을 다시 설치합니다. 개발 서버 기본 포트는 3000입니다.

- 영화 기능은 `FE/.env.local`에 `TMDB_API_BASE_URL`과 `TMDB_ACCESS_TOKEN`을 설정합니다. 이전 `VITE_TMDB_*` 이름도 서버 설정으로 읽습니다.
- 가입, 로그인, 프로필, 즐겨찾기, 평점은 실행 중인 회원 API가 필요합니다. 기본 주소는 `http://localhost:8080`이고, 다른 주소는 `NEXT_PUBLIC_API_BASE_URL`로 설정합니다. 회원 API에서 프런트엔드 주소의 CORS를 허용해야 합니다.

## 검증 방법

`FE`에서 `pnpm build`와 `pnpm lint`를 실행합니다. 브라우저 회귀 검증은 개발 서버 또는 프로덕션 서버를 띄운 상태에서 `pnpm exec playwright install chromium` 후 `pnpm test:smoke`로 실행합니다. 시스템 Chromium이 있으면 `CHROMIUM_PATH`로 지정할 수 있습니다. 테스트는 영화와 회원 응답을 모의 처리합니다.
