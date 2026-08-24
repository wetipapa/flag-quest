/**
 * Web Audio API로 직접 만드는 짧은 효과음.
 * 외부 음원 파일을 쓰지 않으므로 저작권 걱정이 없고, 자동재생 정책에도 안전하다
 * (AudioContext는 반드시 사용자 제스처 이후에 resume 된다).
 */

let ctx: AudioContext | null = null;
let enabled = true;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return null;
  if (!ctx) ctx = new AudioCtor();
  return ctx;
}

/** 첫 사용자 상호작용 시 호출해 오디오 컨텍스트를 깨운다 (모바일 자동재생 정책 대응) */
export function unlockAudio(): void {
  const c = getContext();
  if (c && c.state === "suspended") {
    void c.resume();
  }
}

export function setSoundEnabled(value: boolean): void {
  enabled = value;
}

interface ToneOptions {
  freq: number;
  duration: number;
  type?: OscillatorType;
  delay?: number;
  gain?: number;
}

function playTone({ freq, duration, type = "sine", delay = 0, gain = 0.16 }: ToneOptions): void {
  if (!enabled) return;
  const c = getContext();
  if (!c) return;
  if (c.state === "suspended") void c.resume();

  const startAt = c.currentTime + delay;
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, startAt);
  gainNode.gain.setValueAtTime(0, startAt);
  gainNode.gain.linearRampToValueAtTime(gain, startAt + 0.012);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + duration);

  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.start(startAt);
  osc.stop(startAt + duration + 0.02);
}

/** 버튼을 눌렀을 때 나는 짧고 부드러운 소리 */
export function playTap(): void {
  playTone({ freq: 520, duration: 0.09, type: "triangle", gain: 0.1 });
}

/** 정답을 맞혔을 때 나는 밝은 화음 */
export function playCorrect(): void {
  playTone({ freq: 523.25, duration: 0.22, type: "sine" });
  playTone({ freq: 659.25, duration: 0.24, delay: 0.06, type: "sine" });
  playTone({ freq: 783.99, duration: 0.32, delay: 0.12, type: "sine" });
}

/** 오답이어도 다정하게 들리는 안내음 (혼내는 느낌이 아님) */
export function playHint(): void {
  playTone({ freq: 392, duration: 0.16, type: "sine", gain: 0.09 });
  playTone({ freq: 349.23, duration: 0.2, delay: 0.09, type: "sine", gain: 0.09 });
}

/** 비행기가 이동하며 나는 짧은 스윕음 */
export function playFly(): void {
  if (!enabled) return;
  const c = getContext();
  if (!c) return;
  if (c.state === "suspended") void c.resume();
  const startAt = c.currentTime;
  const osc = c.createOscillator();
  const gainNode = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(260, startAt);
  osc.frequency.exponentialRampToValueAtTime(480, startAt + 0.35);
  gainNode.gain.setValueAtTime(0, startAt);
  gainNode.gain.linearRampToValueAtTime(0.05, startAt + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, startAt + 0.4);
  osc.connect(gainNode);
  gainNode.connect(c.destination);
  osc.start(startAt);
  osc.stop(startAt + 0.42);
}

/** 여권 도장이 쾅 찍히는 느낌의 짧고 두툼한 소리 */
export function playStamp(): void {
  playTone({ freq: 180, duration: 0.12, type: "square", gain: 0.14 });
  playTone({ freq: 90, duration: 0.14, delay: 0.02, type: "square", gain: 0.1 });
}

/** 대륙 완주 등 큰 축하 사운드 */
export function playFanfare(): void {
  const notes = [523.25, 523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => playTone({ freq, duration: 0.35, delay: i * 0.11, type: "triangle", gain: 0.15 }));
}
