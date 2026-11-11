# HolyLife View (Faith Pathway) — Frontend

설교 · QT · P.B.S(개인성경공부) · 독서노트를 관리하는 기독교 콘텐츠 플랫폼의 **Vue 3 프론트엔드**입니다.
백엔드(Spring Boot, `:38081`)와 Nginx(`:38080`)를 통해 통신합니다.

- 저장소: https://github.com/ban-jh/holylifeView (branch: `main`)
- 백엔드: https://github.com/ban-jh/holylife (branch: `dev`)

---

## 1. 기술 스택

| 구성 | 기술 |
|------|------|
| Framework | Vue **3.5** (`<script setup>`, Composition API) |
| Language | TypeScript 5.6 |
| Build | Vite **6** |
| Routing | Vue Router 4 (`createWebHistory`) |
| HTTP | Axios (baseURL `/api`, JWT 인터셉터) |
| Editor | Tiptap **3.31** (StarterKit, Image, Link, Color, Highlight, TextAlign, FontFamily, Underline) |
| Styling | 순수 CSS (페이지별 CSS 파일, CSS 변수 기반 테마) |
| Font | Pretendard |

---

## 2. 화면 목록 (18 routes / 16 views)

### 인증 (사이드바 없음 — `AuthLayout`)
| 경로 | 화면 | 설명 |
|------|------|------|
| `/login` | LoginView | 로그인 (`/auth/login`) |
| `/signup` | SignupView | 회원가입 화면 (입력 검증·안내 모달까지 구현, 실제 등록은 관리자 `/system/users/new`) |

### 콘텐츠 (`DefaultLayout` — 사이드바 + 헤더)
| 경로 | 화면 | 설명 |
|------|------|------|
| `/dashboard` | DashboardView | 통계 카드, 오늘의 QT, 월간 작성 현황, 최근 등록 콘텐츠(설교/QT/P.B.S/독서 탭) |
| `/sermons` | SermonListView | 설교 목록 (검색·카드형) |
| `/sermons/:id` | SermonDetailView | 설교 등록/수정 (`new` = 신규) |
| `/qts` | QtListView | QT 목록 |
| `/qts/:id` | QtDetailView | QT 등록/수정 (크롤링 본문 불러오기, 성경역 탭) |
| `/pbs` | PbsListView | **P.B.S 3분할** — 폴더 트리 / 성경말씀 / 제목+내용 |
| `/readings` | ReadingListView | 독서노트 목록 |
| `/readings/:id` | ReadingDetailView | 독서노트 등록/수정 |
| `/mypage` | MyPageView | 프로필, 기본 역본/QT 출처, 비밀번호 변경 |
| `/notice` | (인라인) | 공지사항 — 준비 중 |

### 시스템 관리 (SYS_ADMIN)
| 경로 | 화면 | 설명 |
|------|------|------|
| `/system/users` | UserListView | 사용자 목록 (행 클릭 → 상세 팝업) |
| `/system/users/new` | UserCreateView | 사용자 등록 |
| `/system/menus` | MenuListView | 메뉴 관리 (트리, 드래그&드롭, 아이콘 업로드) |
| `/system/permissions` | PermissionListView | 권한 관리 (역할 ↔ 메뉴) |
| `/system/common-codes` | CommonCodeView | 공통코드 / 그룹코드 |

---

## 3. 디렉터리 구조

```
src/
├── api/index.ts            Axios 클라이언트 + 도메인별 API 모듈
│                           (userApi, sermonApi, qtApi, qtDailyApi, pbsApi,
│                            readingApi, bibleApi, menuApi, roleApi,
│                            permissionApi, commonCodeApi, groupCodeApi, fileApi)
│                           ※ 로그인(/auth/login)은 useAuth.ts에서 직접 호출
├── composables/
│   ├── useAuth.ts          토큰/사용자/메뉴 저장(localStorage), 세션 만료(날짜 변경 시 1시간), 메뉴 접근 검사
│   ├── useFileUpload.ts    이미지 업로드
│   └── useToast.ts         전역 토스트
├── layouts/
│   ├── AuthLayout.vue      로그인/회원가입 레이아웃
│   └── DefaultLayout.vue   사이드바 + 헤더 (사이드바 접기/펼치기)
├── components/
│   ├── AppSidebar.vue      DB 기반 메뉴 트리 (권한 필터링)
│   ├── AppHeader.vue       사용자 메뉴, 사이드바 토글
│   ├── AppToast.vue        토스트 UI
│   ├── Pagination.vue      공통 페이지네이션
│   ├── StatusBadge.vue     상태 배지
│   ├── RichTextEditor.vue  Tiptap 에디터 (툴바, 이미지, 필기 연동)
│   ├── ResizableImage.ts   이미지 리사이즈 NodeView (Tiptap 확장)
│   └── HandwritingPad.vue  손글씨 입력 (Canvas + Pointer Events)
├── router/index.ts         라우트 + 인증/메뉴 가드
├── views/                  화면 16개 (위 표 참고)
└── assets/css/             페이지별 CSS (common.css, dashboard.css, pbs-list.css …)
```

---

## 4. 주요 기능 상세

### 리치 에디터 (`RichTextEditor.vue`)
- Tiptap 기반, 설교 / QT / 독서노트 / P.B.S 공통 사용
- **이미지 붙여넣기(클립보드) / 드래그&드롭 / 파일 선택** 업로드 (`/api/files/upload`)
- **이미지 크기 조절**: 우하단 핸들을 드래그해 폭 조절, `width` 속성으로 저장
- **이미지 정렬**(좌/중앙/우), 글자색·형광펜·폰트·정렬
- `editable` prop으로 읽기 모드 지원 (P.B.S 배포 후 조회 모드)
- 손글씨 패드(`HandwritingPad`)로 서명/필기 삽입

### P.B.S (`PbsListView.vue`)
- Confluence 스타일 **폴더 트리 + 페이지** 구조 (페이지 단위 라우트 없음, 한 화면에서 처리)
- 3분할 레이아웃: `폴더/페이지 트리 | 성경말씀 | 제목 + 내용`
- 폴더: 인라인 생성/이름 수정(Enter·blur 저장), 삭제, 드래그&드롭 정렬
- 페이지: 등록·삭제, 드래그&드롭으로 폴더 이동/순서 변경, 빈 폴더 드롭 지원
- 본문 **800ms 디바운스 자동저장**, 배포 시 읽기 모드 전환([수정] → [배포] 토글)
- 성경 선택: 신구약 → 성경 → 장 → 절 (설교/QT와 동일 포맷)

### 대시보드 (`DashboardView.vue`)
- 통계 카드: 설교 / QT / P.B.S / 독서 (전체 건수 + 이번 달)
- 월간 작성 현황 바 차트
- 오늘의 QT: `qt-daily` (생명의삶 우선, 없으면 SUM)
- 최근 등록 콘텐츠 4개 탭 (각 5건) — P.B.S는 폴더명·한글 성경구절·배포 상태 표시

### 인증 / 가드 (`useAuth.ts`, `router/index.ts`)
- JWT를 `localStorage`에 저장 (`holylife_token`, `holylife_user`, `holylife_menus`)
- 날짜가 바뀐 뒤 1시간 경과 시 세션 만료
- 로그인 후 DB 메뉴 기준으로 접근 가능한 경로만 허용, 그 외 차단

---

## 5. 테마

| 용도 | 색상 |
|------|------|
| Accent (warm) | `#c97d4e` |
| 배경 (cream) | `#faf7f2` |
| 보더 (sand) | `#e8ddd0` |
| 로그인/인증 강조 | `#2b4c7e` |

반응형: 태블릿 900px, 모바일 500px 기준으로 1단/2단 자동 전환

---

## 6. 개발 환경

```bash
npm install
npm run dev          # http://localhost:38080 (Vite dev server)
```

`vite.config.ts` 프록시:

| 경로 | 대상 |
|------|------|
| `/api` | `http://localhost:38081` |
| `/swagger-ui`, `/v3/api-docs` | `http://localhost:38081` |

---

## 7. 빌드 및 배포

```bash
npm run build        # dist/ 생성
npm run preview      # 빌드 결과 미리보기
npm run type-check   # vue-tsc 타입 검사
```

운영 배포 (Nginx `/opt/holylife/holylifeView/`):

```bash
npm run build
sudo rm -rf /opt/holylife/holylifeView/*
sudo cp -r dist/* /opt/holylife/holylifeView/
sudo nginx -s reload
```

- Nginx: **38080** (정적 파일 + `/api` → `38081` 프록시)
- `index.html`은 no-cache로 설정되어 배포 즉시 반영

---

## 8. 요구사항

- Node.js 22 이상 (현재 26.x에서 동작 확인)
- npm 11 이상
- 백엔드 서버 `:38081` 실행 중
