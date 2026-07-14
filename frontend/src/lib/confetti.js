import confetti from 'canvas-confetti';

// Imperative confetti presets — canvas-confetti draws on its own fixed
// canvas, fully outside the React tree, so firing mid-Firebase-update never
// couples to re-renders.

const ALINMA = ['#E97C61', '#F5B841', '#FFD54F', '#1B2B45'];

export function burst() {
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ALINMA });
}

// Goal reached / big win: two-sided rain.
export function goalRain() {
  const end = Date.now() + 1200;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ALINMA });
    confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ALINMA });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
