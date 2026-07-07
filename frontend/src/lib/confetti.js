import confetti from 'canvas-confetti';

// Imperative confetti presets — canvas-confetti draws on its own fixed
// canvas, fully outside the React tree, so firing mid-Firebase-update never
// couples to re-renders.

const ALINMA = ['#009C8E', '#F5B841', '#FFD54F', '#E8833A'];

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

// Evolution: golden star burst from the mascot's chest height.
export function evolutionStars() {
  confetti({
    particleCount: 60,
    spread: 100,
    startVelocity: 32,
    shapes: ['star'],
    scalar: 1.1,
    origin: { y: 0.45 },
    colors: ['#FFD54F', '#F5B841', '#FFF3C4'],
  });
  setTimeout(() => confetti({ particleCount: 40, spread: 140, shapes: ['star'], scalar: 0.7, origin: { y: 0.45 }, colors: ['#FFD54F'] }), 250);
}
