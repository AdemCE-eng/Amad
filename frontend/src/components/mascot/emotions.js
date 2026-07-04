// The mascot's entire emotional range as one declarative table.
// Mascot.jsx interpolates every visual parameter toward the active row with
// springs — adding an emotion = adding a row, no animation code.
//
// brow.rot: positive = inner ends up (worry), negative = raised (delight).
// lid: 0 = eyes open … 1 = closed.
// mouth: which beak variant is visible (see Mascot.jsx BEAK_VARIANTS).
// body: ambient body-language loop.
// fx: effect layer (sparkles / tears / crumbs / zzz / swirl).
export const EMOTIONS = {
  idle:        { brow: { rot: 0,   y: 0  }, lid: 0,    mouth: 'smileSoft', cheeks: 0,    headTilt: 0,   body: 'breathe',     fx: null,      sat: 1 },
  happy:       { brow: { rot: -10, y: -3 }, lid: 0,    mouth: 'smileOpen', cheeks: 0.55, headTilt: 4,   body: 'bounce',      fx: 'sparkle', sat: 1 },
  celebrating: { brow: { rot: -14, y: -5 }, lid: 0,    mouth: 'grin',      cheeks: 0.7,  headTilt: 0,   body: 'hop',         fx: 'sparkle', sat: 1 },
  eating:      { brow: { rot: -6,  y: -2 }, lid: 0.1,  mouth: 'smileOpen', cheeks: 0.4,  headTilt: -3,  body: 'breathe',     fx: 'crumbs',  sat: 1 },
  sad:         { brow: { rot: 18,  y: 2  }, lid: 0.25, mouth: 'frown',     cheeks: 0,    headTilt: -6,  body: 'droop',       fx: null,      sat: 0.9 },
  crying:      { brow: { rot: 22,  y: 3  }, lid: 0.35, mouth: 'frownOpen', cheeks: 0,    headTilt: -8,  body: 'droop',       fx: 'tears',   sat: 0.85 },
  sick:        { brow: { rot: 10,  y: 4  }, lid: 0.6,  mouth: 'wavy',      cheeks: 0,    headTilt: -10, body: 'sway',        fx: 'swirl',   sat: 0.45 },
  sleeping:    { brow: { rot: 0,   y: 2  }, lid: 1,    mouth: 'smileSoft', cheeks: 0,    headTilt: 8,   body: 'slowBreathe', fx: 'zzz',     sat: 0.95 },
};

// Backend contract (pet.animationState) → mascot emotion.
export const ANIMATION_TO_EMOTION = {
  idle: 'idle',
  happy: 'happy',
  sad: 'sad',
  sick: 'sick',
  eating: 'eating',
  celebrate: 'celebrating',
};
