// Shared spring personalities. Every animated mascot part picks one of these
// four so the whole character moves like one creature, not twelve tweens.
export const springs = {
  gentle: { type: 'spring', stiffness: 60, damping: 14 },   // emotion morphs: brows, lids, tilt
  pose: { type: 'spring', stiffness: 140, damping: 15 },    // body position (hop/droop)
  snappy: { type: 'spring', stiffness: 420, damping: 24 },  // tap squish, mouth swaps
  slow: { type: 'spring', stiffness: 30, damping: 10 },     // evolution morph
};
