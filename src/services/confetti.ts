import confetti from 'canvas-confetti';

export function fireCelebrationConfetti(): void {
  try {
    // Left burst
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
    // Right burst
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6'],
    });
  } catch (e) {
    console.warn('Confetti error', e);
  }
}

export function fireAchievementConfetti(): void {
  try {
    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#fbbf24', '#ffffff'],
    });
  } catch (e) {
    console.warn('Confetti error', e);
  }
}
