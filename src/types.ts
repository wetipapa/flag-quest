export type ContinentId = "asia" | "europe" | "africa" | "north-america" | "south-america" | "oceania";

export const CONTINENTS: { id: ContinentId; labelKo: string; emoji: string }[] = [
  { id: "asia", labelKo: "아시아", emoji: "🌏" },
  { id: "europe", labelKo: "유럽", emoji: "🏰" },
  { id: "africa", labelKo: "아프리카", emoji: "🦁" },
  { id: "north-america", labelKo: "북아메리카", emoji: "🌵" },
  { id: "south-america", labelKo: "남아메리카", emoji: "🌴" },
  { id: "oceania", labelKo: "오세아니아", emoji: "🏝️" },
];

/** 여행 코스: "world"는 대륙 구분 없이 전체에서 출제 */
export type CourseId = "world" | ContinentId;

/** 국가 인지도 등급 (1 = 아주 익숙, 3 = 낯선 나라). 출제 난이도 조절에 쓰인다. */
export type Tier = 1 | 2 | 3;

export interface Country {
  /** ISO 3166-1 alpha-2 코드 (소문자). flag-icons 클래스명(fi-xx)과 동일하다. */
  code: string;
  nameKo: string;
  continent: ContinentId;
  capitalKo: string;
  /** 공용어/주요 언어 (여러 개면 가운데점으로 구분) */
  languageKo: string;
  /** 통용되는 화폐 이름 */
  currencyKo: string;
  /** 수도(대략적인) 위경도. 국가 정보 카드의 지도에 정확히 이 나라 위치만 핀으로 찍는 데 쓴다. */
  lat: number;
  lng: number;
  /** "약 ○○만 명" 형태의 대략적인 인구 표기 */
  populationKo: string;
  /** 인구 수치의 대략적인 기준연도 */
  populationYear: number;
  /** 아이가 흥미를 느낄 만한 한 줄 특징 */
  funFactKo: string;
  tier: Tier;
  /** 국기가 비슷해 헷갈리기 쉬운 다른 나라 코드 (어려운 난이도의 오답 보기로 활용) */
  confusables?: string[];
}

export type Difficulty = "easy" | "normal" | "hard";

export interface DifficultyConfig {
  id: Difficulty;
  labelKo: string;
  descriptionKo: string;
  optionCount: 3 | 4;
  /** 각 등급(tier)이 뽑힐 상대적 가중치 */
  tierWeights: Record<Tier, number>;
  /** 대륙/위치 힌트를 보여줄지 */
  showContinentHint: boolean;
  /** 비슷한 국기를 오답 보기로 섞을 확률 (0~1) */
  confusableChance: number;
}

export interface QuestionSpec {
  id: string;
  targetCode: string;
  optionCodes: string[];
  correctIndex: number;
  /** 이전에 틀려서 복습차 다시 나온 문제인지 */
  isReview: boolean;
}

export interface VisitRecord {
  timesSeen: number;
  timesCorrect: number;
  timesWrong: number;
  firstVisitedAt: number;
  lastResult: "correct" | "wrong";
}

export interface RoundResult {
  courseId: CourseId;
  difficulty: Difficulty;
  totalQuestions: number;
  correctCount: number;
  visitedCodes: string[];
  newlyVisitedCodes: string[];
  missedCodes: string[];
}
