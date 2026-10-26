# Vibecoding_TQ_Contents_ClaudCode
Guide for the first camper or Users

## 첫캠핑 가이드 컨텐츠 페이지

공통 렌더러 1개 + 컨텐츠 JSON으로 만드는 `/guide/{contentId}` 페이지 (기획안: 첫캠핑 가이드 컨텐츠 페이지 상세 기획안).

**프로토타입:** https://danielmoonkr.github.io/Vibecoding_TQ_Contents_ClaudCode/ (모바일 화면 또는 브라우저 개발자도구의 모바일 뷰로 보세요)

```bash
npm install
npm run dev     # http://localhost:5173
```

### 프로토타입 배포 (GitHub Pages)

`main`에 push하면 `.github/workflows/deploy.yml`이 빌드해 GitHub Pages에 올린다.
최초 1회 리포지터리 **Settings → Pages → Build and deployment → Source** 를 **GitHub Actions** 로 설정해야 한다.
캠핑장 카드·전체보기는 실제 앱 화면 대신 프로토타입 안내 화면(`/camp/:id`, `/search`)으로 이동한다.

- `/` 개발용 목록 (16편 현황, 진단 결과 초기화, 첫 예약 회원 전환, 테마 전환)
- `/guide/G-01` … 16편 전체 (1차 8편 + 2차 8편, `release` 값으로 구분)
- `/preview/blocks` 블록 샘플 미리보기 (stepCards, photoTour, interview, costCalculator, image)
- `?booked=1` / `?booked=0` 첫 예약 완료 회원 목업 전환, `?entry=push` 등 유입 경로

## 구조

| 경로 | 내용 |
| --- | --- |
| `src/content/{ID}.json` | 컨텐츠 1편 = JSON 1개. 파일을 추가하면 바로 `/guide/{ID}`로 열림 |
| `src/types/content.ts` | 컨텐츠·캠핑장·블록 14종 스키마 |
| `src/pages/GuidePage.tsx` | 렌더러: 상단 바 → 히어로 → 추천 대상 → 본문 블록 → 캠핑장 캐러셀 → 다음 글 → 하단 CTA |
| `src/components/template/` | 렌더러 고정 영역 |
| `src/components/blocks/` | 본문 블록 14종 + `BlockRenderer` |
| `src/data/campsites.ts` | 목업 캠핑장 20곳 |
| `src/data/glossary.ts` | 용어 사전 (상세페이지 툴팁과 공유할 데이터) |
| `src/lib/campsites.ts` | 캠핑장 조회·필터. **검색 API 연동 시 이 파일만 교체** |
| `src/lib/track.ts` | `track(eventName, params)` — 지금은 console.log, 공통 파라미터 자동 부착 |
| `src/lib/user.ts` | 진단 결과·첫 예약 여부·쿠폰·A/B variant (목업: localStorage) |
| `src/styles/index.css` | 디자인 시스템 v2 시맨틱 컬러 토큰 (라이트/다크) |
| `tailwind.config.js` | 토큰 이름 그대로 클래스화 (`bg-semantic-primary-normal`, `prose-body-one-reading-regular`) |

## 환경 변수 (`.env`)

- `VITE_WELCOME_COUPON_AMOUNT` 웰컴 쿠폰 금액 → 쿠폰 적용가 = `priceFrom - 쿠폰 금액`
- `VITE_WELCOME_COUPON_VALID_DAYS` 쿠폰 D-day 목업용 유효 일수

## 기획안 대비 확장·가정 (확인 필요)

- 다크모드 토큰 값은 스토리북에 없어 inverse 토큰 기반 임시값. 앱은 `html[data-theme="dark|light"]`로 전달, 없으면 OS 설정을 따른다
- 페르소나 A~H 라벨은 가안 (`src/data/meta.ts`)
- 핵심 인터랙션용 블록 옵션 추가: `compareTable.highlightFrom/selectable`, `campsiteList.petWeightInput/weekendPicker/followOverride`, `checklist.segments`·항목별 `filter`/`only`, 큐레이션 `pin`·`minPrice`/`maxPrice`
- 목업 캠핑장 필드 추가: `petMaxKg`, `weekendWeather`, 태그 `nearFacility`(관리동 가까움)·`nightLight`(야간 조명). 검색 API에 같은 조건이 있는지 확인 필요
- 후기(D-01~03)의 인물·캠핑장·사진은 가상. 실제 회원 섭외와 게재 동의서 확보 후 교체
- 목업 이미지·영상 파일이 없어 토큰 색 플레이스홀더로 표시. 영상은 파일이 없으면 타이머로 재생을 흉내 내 자막·구간 이동을 확인할 수 있다
- 본문 카피는 AI 초안. 환불 규정·안전 수칙·가격은 실제 정책과 대조 필요