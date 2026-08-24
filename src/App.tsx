import { useState } from "react";
import { GameProvider, useGame } from "./state/GameContext";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayScreen } from "./screens/PlayScreen";
import { ResultScreen } from "./screens/ResultScreen";
import { PassportScreen } from "./screens/PassportScreen";
import { SettingsPanel } from "./screens/SettingsPanel";
import { buildMistakeRound } from "./lib/quizEngine";
import { createRng } from "./lib/rng";
import type { CourseId, Difficulty, QuestionSpec, RoundResult } from "./types";

type Screen = "home" | "play" | "result" | "passport";

interface PlayConfig {
  course: CourseId;
  difficulty: Difficulty;
  forcedQuestions?: QuestionSpec[];
}

function AppShell() {
  const { state } = useGame();
  const [screen, setScreen] = useState<Screen>("home");
  const [playConfig, setPlayConfig] = useState<PlayConfig | null>(null);
  const [lastResult, setLastResult] = useState<RoundResult | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  function startRound(course: CourseId, difficulty: Difficulty) {
    setPlayConfig({ course, difficulty });
    setScreen("play");
  }

  function startMistakeReview() {
    const rng = createRng(Date.now() >>> 0);
    const questions = buildMistakeRound(state.mistakeQueue, state.settings.difficulty, rng);
    if (questions.length === 0) return;
    setPlayConfig({ course: "world", difficulty: state.settings.difficulty, forcedQuestions: questions });
    setScreen("play");
  }

  return (
    <div className="relative h-full">
      {screen === "home" && (
        <HomeScreen onStart={startRound} onOpenPassport={() => setScreen("passport")} onOpenSettings={() => setSettingsOpen(true)} />
      )}

      {screen === "play" && playConfig && (
        <PlayScreen
          course={playConfig.course}
          difficulty={playConfig.difficulty}
          forcedQuestions={playConfig.forcedQuestions}
          onExit={() => setScreen("home")}
          onRoundComplete={(result) => {
            setLastResult(result);
            setScreen("result");
          }}
        />
      )}

      {screen === "result" && lastResult && (
        <ResultScreen
          result={lastResult}
          onPlayAgain={() => startRound(lastResult.courseId, lastResult.difficulty)}
          onOpenPassport={() => setScreen("passport")}
          onHome={() => setScreen("home")}
        />
      )}

      {screen === "passport" && <PassportScreen onBack={() => setScreen("home")} onReviewMistakes={startMistakeReview} />}

      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
    </div>
  );
}

function App() {
  return (
    <div className="h-screen w-full flex justify-center bg-[#e7dcc3]">
      <div className="relative w-full max-w-md h-full bg-[var(--color-cream)] shadow-2xl overflow-hidden">
        <GameProvider>
          <AppShell />
        </GameProvider>
      </div>
    </div>
  );
}

export default App;
