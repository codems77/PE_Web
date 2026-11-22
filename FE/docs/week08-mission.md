# 8주차 필수 미션

기준 브랜치: `fe-week7` (`464ec4e877cda6715487695cafabf39ab83ddba5`).
`main`에는 README만 있어 기존 FE가 있는 브랜치를 사용했습니다. FE 외 파일, 루트 pnpm 구조, BE는 변경하지 않았습니다. TanStack Query 의존성만 FE의 package.json과 pnpm-lock.yaml에 추가했습니다.

## 구현

- `(authenticated)` Route Group과 `_auth` Layout Route의 `<Outlet />` 아래에 마이페이지와 정보 수정 화면을 배치했습니다. 직접 URL 접근과 세션 만료를 로그인 화면으로 보냅니다.
- 인증 요청에 필요한 로그인·토큰 persist·Authorization 헤더·401 토큰 제거를 연결했습니다. 서버 프로필로 기존 샘플 데이터를 대체했습니다.
- 마이페이지의 `GET /favorites` 결과를 표시하고 영화 상세로 연결합니다.
- 영화 상세의 `GET /favorites/{movieId}`, `POST /favorites`, `DELETE /favorites/{movieId}`를 연결했습니다. 기존 목록·검색의 즐겨찾기도 같은 서버 상태를 사용합니다.
- JWT의 `sub`에서 회원 ID를 읽어 `GET /members/{memberId}/ratings`로 내 평점을 찾고 `POST /ratings`, `PATCH /ratings/{ratingId}`, `DELETE /ratings/{ratingId}`를 연결했습니다. JWT의 신뢰성·권한은 서버가 검증합니다.
- 변경 중 중복 제출을 막고, 실패 안내와 재시도를 제공합니다. 변경 성공 후 관련 query를 무효화해 다시 조회합니다. 토큰별 캐시로 다른 계정의 정보가 섞이지 않게 했습니다.
- 선택 미션인 캐시 전략 비교, mutationOptions 리팩터링, 낙관적 업데이트는 추가하지 않았습니다.

## 실행

기존 `FE/.env.local`을 유지하고 회원 서버 주소는 `VITE_API_BASE_URL`로 지정합니다(기본 `http://localhost:8080`). TMDB 변수도 기존 설정을 사용합니다.

```sh
cd FE
pnpm install --frozen-lockfile
pnpm dev
```

저장소가 macOS용 node_modules를 추적하고 있으므로 Linux에서는 이 설치 결과를 그대로 사용하면 안 됩니다. 이번 검증은 checkout 밖에 pnpm으로 Linux 의존성을 설치하고 동일 소스와 설정을 복사해 수행했습니다. 추적된 node_modules와 dist는 원상 복구했습니다.

## 검증과 한계

- Vite 프로덕션 빌드, TypeScript `tsc -b`, 소스 범위 oxlint 통과.
- `tests/week08-smoke.cjs`: Chromium과 Playwright로 모의 API를 사용하는 7개 흐름 통과. 비로그인 접근 제한, 로그인 실패·재시도, 토큰 저장·복원과 로그인 경로 제한, 즐겨찾기 추가·조회·해제, 평점 등록·수정·삭제, 서버 프로필 수정, 401 세션 해제를 확인합니다. 인증 헤더와 브라우저 예외도 검사합니다.
- 테스트 실행에는 별도로 설치된 `playwright`, `/usr/bin/chromium`, 5173 포트의 FE 개발 서버가 필요합니다. Playwright는 저장소 외부에서 설치해 `NODE_PATH`로 해당 node_modules를 지정할 수 있습니다.
- 실제 API 서버와의 통합 검증은 하지 않았습니다. PDF는 즐겨찾기 endpoint만 정의하고 요청·응답 스키마는 제공하지 않습니다. API 문서 접근도 차단되어 다음 계약을 `src/api/favorites.ts` 한곳에 명시했습니다: POST 본문 `{ movieId }`, 목록 `result: [{ movieId }]`, 단건 `result: { isFavorite: boolean }`, 공통 `{ isSuccess, code, message, result }` 응답. 실제 서버 스키마가 다르면 이 모듈의 매핑을 조정해야 합니다.
- 평점의 정수 1~5, 후기 500자, 응답 배열과 ID 형식은 기존 BE 브랜치의 DTO·controller를 읽어 적용했습니다. BE는 수정하거나 실행하지 않았습니다.

PR 생성, push, 머지는 수행하지 않았습니다.
