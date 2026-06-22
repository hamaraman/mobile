# CLAUDE.md

모바일 청첩장 빌더. 사용자가 폼으로 청첩장을 만들어 발행하면 공유 링크(`/?id=xxx`)를
받고, 누구나 그 링크로 청첩장을 볼 수 있다.

## 기술 스택

- **프런트엔드**: React 19 + TypeScript, Vite 8, Tailwind CSS 4, Framer Motion, lucide-react
- **백엔드**: Cloudflare Pages Functions (`functions/`) + Workers KV
- **Node**: 22.13.0 (`.node-version`)

## 명령어

```bash
npm run dev      # 로컬 개발 서버 — http://127.0.0.1:3000 (5173 아님, 아래 주의 참고)
npm run build    # tsc -b && vite build → dist/
npm run lint     # eslint
npm run preview  # 빌드 결과 미리보기
```

> ⚠️ 개발 서버 포트는 **3000**이다. 이 머신에서 5173은 Windows 예약 포트 범위에 걸려
> EACCES로 실패하므로 `vite.config.ts`에서 `127.0.0.1:3000`으로 고정돼 있다.

> ⚠️ `npm run dev`(vite)는 정적 프런트엔드만 띄운다. **Pages Functions(`/api/*`,
> OG 미들웨어)는 동작하지 않는다.** 백엔드까지 로컬에서 보려면 `wrangler pages dev`로
> 실행하고 `INVITATIONS` KV 바인딩을 연결해야 한다.

## 아키텍처 / 데이터 흐름

진입점은 `src/App.tsx`이며 URL로 모드를 가른다.

- `/?id=xxx` → `PublishedInvitation` — 서버에서 청첩장을 불러와 **보기 전용**으로 렌더
- `/?edit` 또는 파라미터 없음 → 편집기(`InvitationForm`) + 실시간 미리보기
- 발행: `POST /api/invitations` → `{ id, editToken }` 발급. `editToken`은
  `localStorage`의 `edit-token-<id>`에 저장(수정 권한 증명용)

상태는 `WeddingData` 한 타입으로 흐른다 — `src/types/wedding.ts`가 단일 진실 공급원.
편집 중 데이터는 `localStorage`(`wedding-invitation-data`)에 임시 저장된다.

### 백엔드 (Cloudflare Pages Functions)

KV 바인딩 이름은 **`INVITATIONS`** (모든 함수가 `env.INVITATIONS`로 접근).
KV에는 `{ data, editToken, createdAt, updatedAt }` 형태로 저장된다.

- `functions/api/invitations.js` — `POST` 발행
- `functions/api/invitations/[id].js` — `GET` 조회(편집 토큰은 절대 노출 안 함) / `PUT` 수정(토큰 검증)
- `functions/api/invitations/[id]/og.js` — 갤러리 첫 사진을 **실제 이미지**로 응답(링크 미리보기용)
- `functions/_middleware.js` — `/?id=xxx` HTML 요청에 청첩장별 Open Graph 태그 주입

## 이미지 / 공유 관련 핵심 주의점

- **갤러리 사진은 base64 data URL로 KV에 저장**된다(`src/utils/image.ts`가 업로드 시
  최대 1600px JPEG로 리사이즈). KV 레코드 상한은 5MB.
- **메신저(카카오톡) 링크 미리보기**: 스크래퍼는 JS를 실행하지 않고 정적 HTML의 og 태그만
  읽으므로, base64를 직접 og:image로 쓸 수 없다. 그래서 두 단계로 처리한다:
  1. `functions/_middleware.js`가 엣지에서 `/?id=xxx`의 og 태그를 청첩장별로 다시 씀
  2. og:image는 `functions/api/invitations/[id]/og.js`(base64 → 실제 이미지)를 가리킴
- **변경 시 이 둘은 함께 봐야 한다.** OG 동작은 배포(또는 `wrangler pages dev`)에서만 검증
  가능하며, 카카오는 미리보기를 강하게 캐시하므로
  [카카오 캐시 삭제 도구](https://developers.kakao.com/tool/clear/og)로 갱신해야 한다.

## 환경 변수

- `VITE_KAKAO_KEY` — 카카오 JavaScript 키(`ShareSection.tsx`의 공유 버튼용). 미설정 시
  소스에 박힌 공개 기본 키를 쓴다. 공개 JS 키라 비밀 아님. 배포 도메인을 카카오
  개발자 콘솔의 사이트 도메인에 등록해야 동작한다. (`.env.example` 참고)

## 컨벤션

- 주석·UI 문구는 한국어. 코드 주변 스타일(주석 밀도, 네이밍)을 맞춰서 작성한다.
- 변경 후에는 `npm run build`(타입체크 포함)와 `npm run lint`로 검증한다.
