import { useMemo } from "react";

interface ConfettiProps {
  active: boolean;
  reduceMotion?: boolean;
  count?: number;
}

const COLORS = ["#ffd166", "#f0900c", "#1e8a5f", "#6fb8d6", "#ff8a5c"];

/** 정답 시 터지는 색종이 효과. reduceMotion이면 은은하게만 표시한다 */
export function Confetti({ active, reduceMotion = false, count = 18 }: ConfettiProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
        const distance = 60 + Math.random() * 70;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance,
          delay: Math.random() * 0.15,
          color: COLORS[i % COLORS.length],
          rotate: Math.random() * 360,
        };
      }),
    [count],
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-50" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute block rounded-full"
          style={
            reduceMotion
              ? { width: 10, height: 10, background: p.color, transform: `translate(${p.x * 0.3}px, ${p.y * 0.3}px)`, opacity: 0.8 }
              : ({
                  width: 10,
                  height: 10,
                  background: p.color,
                  "--tx": `${p.x}px`,
                  "--ty": `${p.y}px`,
                  animation: `confetti-burst 0.9s ease-out ${p.delay}s forwards`,
                } as React.CSSProperties)
          }
        />
      ))}
    </div>
  );
}
