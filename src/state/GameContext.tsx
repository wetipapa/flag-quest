import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import { createDefaultState } from "./gameState";
import type { GameState } from "./gameState";
import { gameReducer, type GameAction } from "./gameReducer";
import { loadState, saveState } from "../lib/storage";

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => loadState(createDefaultState()));

  useEffect(() => {
    saveState(state);
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame은 GameProvider 안에서만 사용할 수 있어요.");
  return ctx;
}
