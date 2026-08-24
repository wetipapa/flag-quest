import { useRef, useState } from "react";
import { useGame } from "../state/GameContext";
import { useSound } from "../hooks/useSound";
import { buildRound, buildReviewQuestion } from "../lib/quizEngine";
import { createRng, pickInt } from "../lib/rng";
import { getCountry } from "../data/countries";
import { CONTINENTS } from "../types";
import { DIFFICULTIES } from "../lib/difficulty";
import { FlagImage } from "../components/FlagImage";
import { OptionButton } from "../components/game/OptionButton";
import { AnswerFeedback } from "../components/game/AnswerFeedback";
import { ProgressDots } from "../components/ui/ProgressDots";
import type { CourseId, Difficulty, QuestionSpec, RoundResult } from "../types";

interface PlayScreenProps {
  course: CourseId;
  difficulty: Difficulty;
  onExit: () => void;
  onRoundComplete: (result: RoundResult) => void;
  /** 주어지면 buildRound 대신 이 문제 목록을 그대로 사용한다 (예: "틀린 나라만 다시 도전") */
  forcedQuestions?: QuestionSpec[];
}

type OptionUiState = "idle" | "selected-wrong" | "reveal-correct" | "disabled";

const MAX_WRONG_BEFORE_REVEAL = 2;

export function PlayScreen({ course, difficulty, onExit, onRoundComplete, forcedQuestions }: PlayScreenProps) {
  const { state, dispatch } = useGame();
  const sound = useSound();
  const config = DIFFICULTIES[difficulty];

  const rngRef = useRef(createRng((Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0));
  const [questions, setQuestions] = useState<QuestionSpec[]>(
    () => forcedQuestions ?? buildRound(course, difficulty, state.visited, state.mistakeQueue, rngRef.current),
  );
  const [index, setIndex] = useState(0);
  const [wrongIdx, setWrongIdx] = useState<number[]>([]);
  const [phase, setPhase] = useState<"asking" | "feedback">("asking");
  const [feedbackResult, setFeedbackResult] = useState<"correct" | "wrong">("correct");
  const [results, setResults] = useState<("correct" | "wrong" | undefined)[]>(() => Array(questions.length).fill(undefined));

  const statsRef = useRef({ correctCount: 0, visited: new Set<string>(), newly: new Set<string>(), missed: new Set<string>() });
  const scheduledReviewRef = useRef<Set<string>>(new Set());

  const current = questions[index];
  const target = getCountry(current.targetCode);
  const continent = CONTINENTS.find((c) => c.id === target.continent);

  function optionState(optIndex: number): OptionUiState {
    if (phase === "feedback") {
      if (optIndex === current.correctIndex) return "reveal-correct";
      if (wrongIdx.includes(optIndex)) return "selected-wrong";
      return "disabled";
    }
    if (wrongIdx.includes(optIndex)) return "selected-wrong";
    return "idle";
  }

  function setResultAt(i: number, value: "correct" | "wrong") {
    setResults((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  }

  function handleSelect(optIndex: number) {
    if (phase !== "asking" || wrongIdx.includes(optIndex)) return;
    sound.tap();
    const isCorrect = optIndex === current.correctIndex;

    if (isCorrect) {
      const alreadyVisited = !!state.visited[current.targetCode];
      statsRef.current.correctCount += 1;
      statsRef.current.visited.add(current.targetCode);
      if (!alreadyVisited) statsRef.current.newly.add(current.targetCode);

      dispatch({ type: "ANSWER_RESULT", code: current.targetCode, correct: true, now: Date.now() });
      sound.fly();
      window.setTimeout(sound.stamp, 300);
      setResultAt(index, "correct");
      setFeedbackResult("correct");
      setPhase("feedback");
      return;
    }

    sound.hint();
    const nextWrongIdx = [...wrongIdx, optIndex];
    setWrongIdx(nextWrongIdx);

    // 처음 틀렸을 때, 이 나라를 몇 문제 뒤에 자연스럽게 다시 출제하도록 예약한다
    if (!scheduledReviewRef.current.has(current.id)) {
      scheduledReviewRef.current.add(current.id);
      const reviewQuestion = buildReviewQuestion(current.targetCode, course, difficulty, rngRef.current);
      const insertAt = Math.min(index + 3 + pickInt(rngRef.current, 0, 2), questions.length);
      setQuestions((prev) => {
        const next = [...prev];
        next.splice(insertAt, 0, reviewQuestion);
        return next;
      });
      setResults((prev) => {
        const next = [...prev];
        next.splice(insertAt, 0, undefined);
        return next;
      });
    }

    if (nextWrongIdx.length >= MAX_WRONG_BEFORE_REVEAL) {
      statsRef.current.missed.add(current.targetCode);
      statsRef.current.visited.add(current.targetCode);
      dispatch({ type: "ANSWER_RESULT", code: current.targetCode, correct: false, now: Date.now() });
      setResultAt(index, "wrong");
      setFeedbackResult("wrong");
      setPhase("feedback");
    }
  }

  function handleNext() {
    setPhase("asking");
    setWrongIdx([]);
    if (index + 1 >= questions.length) {
      const stats = statsRef.current;
      onRoundComplete({
        courseId: course,
        difficulty,
        totalQuestions: questions.length,
        correctCount: stats.correctCount,
        visitedCodes: [...stats.visited],
        newlyVisitedCodes: [...stats.newly],
        missedCodes: [...stats.missed],
      });
      return;
    }
    setIndex((i) => i + 1);
  }

  return (
    <div className="relative h-full flex flex-col bg-[var(--color-cream)]">
      <header className="flex items-center gap-3 px-4 pt-4 safe-top">
        <button
          type="button"
          onClick={onExit}
          aria-label="여행 그만하고 홈으로"
          className="flex items-center justify-center h-11 w-11 rounded-full bg-white border-2 border-[var(--color-border)] shadow-[0_3px_0_var(--color-border)] active:translate-y-0.5 shrink-0"
        >
          <span aria-hidden="true">✕</span>
        </button>
        <div className="flex-1">
          <ProgressDots total={questions.length} current={index} results={results} />
        </div>
      </header>

      <main className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center gap-5 px-5 py-6">
        {config.showContinentHint && continent && (
          <span className="rounded-full bg-[var(--color-globe-tint)] text-[var(--color-globe-ink)] text-xs font-extrabold px-3 py-1">
            {continent.emoji} {continent.labelKo}
          </span>
        )}

        <p className="text-lg font-extrabold text-[var(--color-ink)] text-center">이 국기는 어느 나라일까요?</p>

        <FlagImage
          code={target.code}
          decorative
          className="w-full max-w-[280px] aspect-[4/3] rounded-3xl border-4 border-white shadow-[0_10px_24px_rgba(51,36,28,0.18)]"
        />

        <div className="w-full max-w-sm flex flex-col gap-2.5" role="group" aria-label="보기">
          {current.optionCodes.map((code, i) => (
            <OptionButton key={code} label={getCountry(code).nameKo} state={optionState(i)} onClick={() => handleSelect(i)} />
          ))}
        </div>
      </main>

      {phase === "feedback" && (
        <AnswerFeedback result={feedbackResult} country={target} reduceMotion={state.settings.reduceMotion} onNext={handleNext} />
      )}
    </div>
  );
}
