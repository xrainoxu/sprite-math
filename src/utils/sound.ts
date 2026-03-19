// 使用 Web Audio API 生成音效

let audioContext: AudioContext | null = null;

// 获取或创建 AudioContext
function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

// 播放正确音效（高音短促）
export function playCorrectSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(880, ctx.currentTime);
    oscillator.frequency.setValueAtTime(1108, ctx.currentTime + 0.1);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  } catch (e) {
    console.error("Failed to play correct sound:", e);
  }
}

// 播放错误音效（低音）
export function playWrongSound(): void {
  try {
    const ctx = getAudioContext();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.setValueAtTime(150, ctx.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  } catch (e) {
    console.error("Failed to play wrong sound:", e);
  }
}

// 播放连击音效
export function playComboSound(combo: number): void {
  try {
    const ctx = getAudioContext();
    const baseFreq = 440 + combo * 50;

    for (let i = 0; i < Math.min(combo, 5); i++) {
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(baseFreq + i * 100, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.1);
      }, i * 50);
    }
  } catch (e) {
    console.error("Failed to play combo sound:", e);
  }
}

// 播放游戏结束音效
export function playGameOverSound(): void {
  try {
    const ctx = getAudioContext();
    const notes = [300, 250, 200, 150];

    notes.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.2);
      }, i * 150);
    });
  } catch (e) {
    console.error("Failed to play game over sound:", e);
  }
}

// 播放胜利音效
export function playVictorySound(): void {
  try {
    const ctx = getAudioContext();
    const notes = [523, 659, 784, 1047];

    notes.forEach((freq, i) => {
      setTimeout(() => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
      }, i * 100);
    });
  } catch (e) {
    console.error("Failed to play victory sound:", e);
  }
}
