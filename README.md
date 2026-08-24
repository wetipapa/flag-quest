# 국기 콕콕 🌍✈️

7세 전후 어린이를 위한 세계 국기 학습 게임입니다. 국기를 보고 나라 이름을 콕 맞히면 여권에 도장이 찍히고, 대륙을 옮겨 다니며 나라를 수집하는 짧은 세계여행을 반복해서 즐길 수 있습니다.

WETI PLAY(웨티플레이) 산하 서비스로, `wetipapa-play`의 브랜드 디자인 토큰(`brand/tokens.css`)과 톤앤매너를 그대로 이어받았습니다.

## 실행 방법

```bash
npm install
npm run dev       # http://localhost:5173
```

환경변수가 필요 없어 클론 후 바로 실행됩니다.

### 그 외 스크립트

```bash
npm run build      # 프로덕션 빌드 (tsc + vite build)
npm run preview    # 빌드 결과 로컬 미리보기
npm run test       # vitest 단위 테스트 실행
npm run lint       # oxlint 정적 분석
npm run gen:icons      # scripts/icon-source.svg로부터 favicon/PWA 아이콘 재생성
npm run gen:world-map  # scripts/continents-source.svg로부터 대륙 지도 경로 데이터 재생성
```

### Open Graph 공유 이미지

카카오톡/Threads/트위터 등에 링크를 공유했을 때 뜨는 미리보기 이미지(`public/og-image.png`, 1200×630)는
`scripts/og-template.html`을 실제 앱과 동일한 폰트(Jua/Noto Sans KR)로 브라우저에 띄운 뒤 스크린샷해서
만들었습니다. 문구나 디자인을 바꾸려면:

1. `scripts/og-template.html` 수정
2. 브라우저 자동화 도구(Playwright 등)로 `scripts/og-template.html`을 1200×630(고해상도용으로는
   `deviceScaleFactor: 2`) 뷰포트로 열어 스크린샷 → `public/og-image.png`로 저장
   (`node_modules`의 폰트 파일을 `file://` 상대 경로로 참조하므로 템플릿 파일은 `scripts/` 안에 그대로 둘 것)
3. `index.html`의 `og:title` / `og:description`도 문구를 바꿨다면 함께 갱신

## 핵심 플레이

1. 큰 국기를 보고 3~4개의 나라 이름 보기 중 정답을 고른다.
2. 맞히면 비행기가 날아가고 여권에 도장이 쾅 찍히는 짧은 연출과 함께, 그 나라의 수도·대륙·인구·한 줄 특징을 보여주는 정보 카드가 뜬다.
3. 틀리면 혼내는 대신 다시 고를 기회를 준다. 두 번째까지 틀리면 정답을 알려주고 같은 정보 카드로 안내한다. 틀린 나라는 같은 판 안에서 몇 문제 뒤 자연스럽게 다시 등장한다(즉석 복습).
4. 첫 화면에서 설정 없이 바로 "여행 떠나기"로 시작할 수 있고, 여행 코스(대륙)와 난이도는 아코디언 안에 후순위로 배치했다.

## 난이도 & 코스

- **코스**: 세계 전체 또는 대륙별(아시아/유럽/아프리카/북아메리카/남아메리카/오세아니아) 선택.
- **난이도**: 쉬움(3지선다, 익숙한 나라 위주) → 보통(4지선다, 익숙함+낯섦 혼합) → 어려움(4지선다, 낯선 나라와 비슷하게 생긴 국기 오답 비중이 높음).
- 국가 인지도 등급(`tier`, `src/data/countries.ts`)과 최근 오답 여부, 이미 여러 번 맞힌 정도를 함께 반영한 가중치로 출제 국가를 뽑는다(`src/lib/quizEngine.ts`의 `computeWeight`).
- 국기가 헷갈리기 쉬운 나라 쌍(예: 인도네시아·모나코·폴란드, 아일랜드·코트디부아르, 콜롬비아·에콰도르·베네수엘라 등)은 `confusables` 필드로 등록해 어려운 난이도에서 오답 보기로 더 자주 섞인다.

## 수집 & 복습

- **여권(`PassportScreen`)**: 대륙 탭별로 방문한 나라는 도장이 찍힌 컬러 국기로, 아직 못 가본 나라는 실루엣(회색)으로 표시하고 진행률을 막대바로 보여준다.
- **틀린 나라 다시 도전**: 오답 목록(`mistakeQueue`)은 홈 화면과 여권 화면 양쪽에서 "다시 도전하기" 버튼으로 노출되며, 대륙 구분 없이 그 나라들만 모아 별도 라운드로 풀 수 있다.
- 진행 상황(방문 국가, 오답 목록, 설정)은 모두 `localStorage`에 자동 저장된다. 회원가입·서버·유료 API가 전혀 없다.

## 국가 데이터 (`src/data/countries.ts`)

- UN 회원국 대부분 + 대만까지 약 195개국을 대륙·수도·대략적 인구·한 줄 특징·인지도 등급으로 정리했다(코소보·팔레스타인 등 영토 분쟁 지역은 어린이용 콘텐츠 특성상 이번 버전에서 제외).
- 인구는 지나치게 정확한 숫자 대신 `약 ○○만 명` 형태의 어림값이다.
- 이스라엘의 수도는 국제적으로 논쟁이 있어, 대사관이 실제로 모여 있는 텔아비브로 표기했다.
- 국가를 추가/수정하려면 이 배열에 항목만 더하면 되고 다른 로직은 건드릴 필요가 없다.

## 국기 표시 방식

이모지 국기는 기기·OS·브라우저마다 다르게 보이거나 아예 표시되지 않을 수 있어 사용하지 않았다. 대신 [`flag-icons`](https://github.com/lipis/flag-icons) 라이브러리(벡터 스프라이트, 오프라인 번들)로 모든 기기에서 동일하게 보이는 국기를 렌더링한다(`src/components/FlagImage.tsx`).

## 브랜드 적용

- `brand/tokens.css`는 `wetipapa-play/brand/tokens.css` 원본을 그대로 복사한 것이며, `src/index.css`에서 import해 배경·잉크·프라이머리 오렌지·서체(Jua/Noto Sans KR)·라운드·그림자 토큰을 그대로 재사용한다.
- 기존 서비스(웨티 보카=블루, 웨티 레이싱=레드오렌지, 웨티 시계탐험대=바이올렛)와 겹치지 않는 새 포인트 컬러로 "월드 그린"(`--color-globe`)을 추가해 이 게임만의 정체성을 표현했다.
- 브랜드 가이드 원칙에 따라 마스코트 캐릭터는 게임 화면 전면에 내세우지 않았고, Footer에는 `WETI PLAY by 웨티아빠` 표기를 유지한다.
- 서체는 Next.js가 아니라 Vite 프로젝트이므로 `next/font/google` 대신 `@fontsource/jua`, `@fontsource/noto-sans-kr`로 동일하게 자체 호스팅해 외부 네트워크 요청 없이 안정적으로 로딩한다.

## 기술 스택 & 구조

- Vite + React 19 + TypeScript, Tailwind CSS v4 (`clock` 프로젝트와 동일한 스택/설정 패턴)
- 상태 관리: React Context + `useReducer` (`src/state`), 진행 상황은 `localStorage`에 자동 저장
- 문제 생성 로직은 UI와 분리되어 있다 (`src/lib`)
  - `quizEngine.ts` — 코스/난이도별 출제 가중치, 보기 구성, 오답 재출제, "틀린 나라만" 라운드
  - `difficulty.ts` — 난이도별 등급 가중치·보기 수·힌트·혼동 국기 확률 설정
  - `rng.ts` — 테스트 가능한 시드 PRNG
  - `korean.ts` — 을/를, 이/가, 은/는 조사 자동 처리
  - `audio.ts` — Web Audio로 직접 합성한 효과음(탭/정답/힌트/비행/도장/팡파르)
  - `storage.ts` — localStorage 안전 래퍼
- 화면(`src/screens`), 국기·여권 관련 컴포넌트(`src/components`)로 관심사를 분리했다.

### 테스트

`npm run test`로 시드 PRNG, 조사 처리, 국가 데이터 무결성(코드 중복·`confusables` 유효성), 문제 생성 로직, 리듀서를 단위 테스트로 검증한다.

## 배포 (Vercel)

정적 빌드 결과물만 생성하는 순수 프론트엔드 앱이라 환경변수 설정 없이 바로 배포할 수 있다.

```bash
npm install -g vercel
vercel
```

또는 GitHub 저장소로 연동 후 Vercel에서 New Project → Framework Preset: Vite, Build Command: `npm run build`, Output Directory: `dist`.

## 앞으로 확장할 수 있는 부분

- **모드 확장**: 나라 이름 보고 국기 고르기, 수도 맞히기, 대륙 맞히기, 지도 위치 맞히기, 랜드마크 보고 나라 맞히기, 비슷한 국기만 구별하기 — 모두 `Country` 데이터를 그대로 재사용해 `quizEngine.ts`에 새 문제 생성 함수만 추가하면 된다.
- **국가 데이터 확대**: 현재 제외한 지역이나 세부 통계(국기, 국화, 대표 음식 등)를 `Country` 타입에 필드만 추가해 확장할 수 있다.
- **정밀 지도**: `ContinentMiniMap`은 대륙 단위의 단순화된 위치 표시다. 실제 국가 좌표 데이터를 추가하면 나라별 정확한 지도 핀으로 발전시킬 수 있다.
- **wetipapa-play 허브 연동**: 이번 작업 범위(신규 게임 단독 구현)에는 포함하지 않았지만, 완성도가 확인되면 `wetipapa-play`의 서비스 목록에 카드를 추가해 연결할 수 있다.

## 남아 있는 제한사항

- 인구·기준연도는 대략적인 값이며, 실제 통계와 시간에 따라 달라질 수 있다.
- 코소보, 팔레스타인, 서사하라 등 영토 분쟁이 있는 지역은 이번 버전에 포함하지 않았다.
- 국기 렌더링은 `flag-icons`의 4:3 스프라이트를 사용하며, 국가별 실제 국기 비율과 정확히 일치하지 않을 수 있다.
