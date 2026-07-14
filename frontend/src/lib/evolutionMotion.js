// The button becomes available after the one-shot transition has settled.
// This timer never dismisses or acknowledges the dialog.
export const EVOLUTION_CONFIRM_READY_MS = 1650;
export const EVOLUTION_EXIT_MS = 250;

// Fixed once in source: 12 particles, all inside a 210 x 180 px envelope
// around the mascot. Evolution never uses a full-screen confetti canvas.
export const EVOLUTION_PARTICLES = [
  { x: -92, y: -54, size: 5, delay: 0.72, duration: 0.82, color: '#F5B841' },
  { x: -66, y: -86, size: 4, delay: 0.80, duration: 1.05, color: '#FFF3C4' },
  { x: -38, y: -64, size: 7, delay: 0.76, duration: 0.94, color: '#E97C61' },
  { x: -16, y: -92, size: 4, delay: 0.88, duration: 1.20, color: '#F5B841' },
  { x: 18, y: -76, size: 6, delay: 0.74, duration: 0.88, color: '#FFF3C4' },
  { x: 46, y: -98, size: 4, delay: 0.84, duration: 1.12, color: '#E97C61' },
  { x: 76, y: -68, size: 7, delay: 0.78, duration: 0.98, color: '#F5B841' },
  { x: 102, y: -42, size: 4, delay: 0.90, duration: 1.24, color: '#FFF3C4' },
  { x: -104, y: -18, size: 4, delay: 0.86, duration: 1.14, color: '#E97C61' },
  { x: -72, y: -30, size: 6, delay: 0.82, duration: 0.90, color: '#FFF3C4' },
  { x: 70, y: -26, size: 5, delay: 0.76, duration: 1.06, color: '#E97C61' },
  { x: 96, y: -10, size: 6, delay: 0.88, duration: 0.96, color: '#F5B841' },
];
