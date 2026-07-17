/* eslint-disable react/no-unknown-property */
import React, { useEffect, useId, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { EMOTIONS } from './emotions';
import { springs } from './springs';
// Per-state coloured aura — single source of truth shared with the backend
// voice/health config (deep path: mascot → components → src → frontend → repo).
import { glowFor } from '../../../../shared/rafiqIdentity.js';

// صقّور — the falcon chick. One SVG rig; every part interpolates toward the
// EMOTIONS table with springs. Cute-proportion rules (Duolingo/Finch): head
// ≈ 55% of height, eyes ≈ 30% of face width sitting at the head's vertical
// center, tiny beak, no neck, round everything.
//
// Props: emotion (EMOTIONS key) · stage (0 egg | 1 chick | 2 grown) ·
// size (px) · track (pupils follow cursor) · equipped (accessory id) ·
// onTap. Memoized — parents can re-render freely on Firebase pushes.

// Chick palette (stages 0-1): bright, baby, cute.
const C = {
  body: '#F5B841',
  belly: '#FDEBC8',
  wing: '#E8A62E',
  wingDark: '#8A5A22',
  cap: '#7A4E1D',
  beakTop: '#E8833A',
  beakBottom: '#D96F2B',
  mouthInner: '#8C3A1D',
  brow: '#7A4E1D',
  eye: '#2B1E12',
  blush: '#F48FB1',
  feet: '#E8833A',
  shell: '#FDF6E3',
  shellEdge: '#E8D9B5',
};

// Grown falcon palette (stage 2): the baby-yellow is what most read as
// "chick", so the adult goes tawny-brown like a real saqr/peregrine — dark
// slate hood, pale cheek, cream streaked breast. Emotion rig colors
// (eye/mouthInner/blush) stay shared.
const FALCON = {
  ...C,
  body: '#B9793B',       // tawny brown plumage
  belly: '#F2E7D0',      // pale cream breast
  wing: '#9A6230',       // darker brown wing
  wingDark: '#4A2F16',   // primary tips / tail bars / breast streaks
  hood: '#4E3620',       // dark slate-brown head hood
  cheek: '#F3E7D2',      // pale cheek patch (peregrine mask)
  malar: '#3A2412',      // moustache stripe
  beakHook: '#3A3A3A',   // slate raptor beak
  cere: '#E7B84E',       // fleshy beak base
  brow: '#241708',       // near-black, reads on the hood
  feet: '#E0A93E',       // yellow talons (falcons have yellow legs)
};

const paletteFor = (stage) => (stage >= 2 ? FALCON : C);

// Rotation/scale pivot with the origin baked into SVG translates instead of
// CSS transform-origin — identical results in every renderer (browsers,
// librsvg golden frames) and no reliance on transform-box support.
function Pivot({ x, y, children, ...motionProps }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <motion.g initial={false} {...motionProps}>
        <g transform={`translate(${-x} ${-y})`}>{children}</g>
      </motion.g>
    </g>
  );
}

// Lower-beak variants, all mounted and crossfaded (path-morphing `d` strings
// between different point counts glitches; opacity swaps never do).
const BEAK_VARIANTS = {
  smileSoft: <path d="M110,126 Q120,133 130,126" fill="none" stroke={C.beakBottom} strokeWidth="4" strokeLinecap="round" />,
  smileOpen: (
    <g>
      <path d="M107,123 Q120,142 133,123 Z" fill={C.mouthInner} />
      <path d="M107,123 Q120,142 133,123" fill="none" stroke={C.beakBottom} strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  grin: (
    <g>
      <path d="M104,122 Q120,148 136,122 Z" fill={C.mouthInner} />
      <ellipse cx="120" cy="136" rx="7" ry="4" fill={C.blush} />
    </g>
  ),
  frown: <path d="M111,132 Q120,124 129,132" fill="none" stroke={C.beakBottom} strokeWidth="4" strokeLinecap="round" />,
  frownOpen: (
    <g className="anim-wobble">
      <path d="M109,128 Q120,121 131,128 Q120,141 109,128 Z" fill={C.mouthInner} />
    </g>
  ),
  wavy: <path d="M108,130 q6,-5 12,0 q6,5 12,0" fill="none" stroke={C.beakBottom} strokeWidth="4" strokeLinecap="round" />,
};

const BODY_LOOP_CLASS = {
  breathe: 'anim-breathe-soft',
  slowBreathe: 'anim-breathe-slow',
  bounce: 'anim-bounce',
  hop: 'anim-hop',
  droop: '',
  sway: 'anim-sway',
};

// Happy Saqr chatters between the existing closed and open beak drawings.
// Crossfading shapes avoids fragile SVG path morphing and works for every stage.
const HAPPY_BEAK_OPEN = { opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.9] };
const HAPPY_BEAK_CLOSED = { opacity: [1, 0, 0, 1], scale: 1 };
const HAPPY_BEAK_TRANSITION = {
  duration: 0.9,
  repeat: Infinity,
  times: [0, 0.2, 0.65, 1],
  ease: 'easeInOut',
};

function beakAnimation(emotion, activeMouth, id) {
  if (emotion === 'happy' && id === 'smileOpen') {
    return { animate: HAPPY_BEAK_OPEN, transition: HAPPY_BEAK_TRANSITION };
  }
  if (emotion === 'happy' && id === 'smileSoft') {
    return { animate: HAPPY_BEAK_CLOSED, transition: HAPPY_BEAK_TRANSITION };
  }
  const visible = activeMouth === id;
  return {
    animate: { opacity: visible ? 1 : 0, scale: visible ? 1 : 0.85 },
    transition: springs.snappy,
  };
}

function Eye({ cx, lid, blinking, clipId }) {
  const closed = blinking ? 1 : lid;
  // Clip the eye+highlights with an ellipse that squishes vertically from
  // the center — a smooth curved lid, unlike a flat rect sliding down (which
  // cuts a hard straight chord across the circle and strands a highlight
  // dot floating on the seam, reading as a "slash" instead of a sleepy eye).
  const openFrac = Math.max(0.05, 1 - closed);
  return (
    <g>
      <clipPath id={clipId}>
        <motion.ellipse
          initial={false}
          cx={cx} cy="92" rx="16"
          animate={{ ry: 14 * openFrac }}
          transition={blinking ? { duration: 0.06 } : springs.gentle}
        />
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        <circle cx={cx} cy="92" r="14" fill={C.eye} />
        {/* Fixed highlights — never blink, never move; they're the life. */}
        <circle cx={cx - 4} cy="87" r="4.5" fill="#fff" />
        <circle cx={cx + 4.5} cy="95.5" r="2" fill="#fff" opacity="0.75" />
      </g>
      {/* Closed-eye lash line, crossfades in once the lid is mostly shut. */}
      <motion.path
        initial={false}
        d={`M${cx - 12},92 Q${cx},96 ${cx + 12},92`}
        fill="none" stroke={C.eye} strokeWidth="3" strokeLinecap="round"
        animate={{ opacity: closed > 0.85 ? 1 : 0 }}
        transition={springs.gentle}
      />
    </g>
  );
}

function Brow({ cx, rot, y, side, color = C.brow }) {
  return (
    <Pivot x={cx} y={66} animate={{ rotate: side * rot, y }} transition={springs.gentle}>
      <path
        d={`M${cx - 12},68 Q${cx},61 ${cx + 12},68`}
        fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
      />
    </Pivot>
  );
}

function Effects({ fx }) {
  if (!fx) return null;
  if (fx === 'sparkle') {
    return (
      <g>
        {[[52, 62, 0], [186, 48, 0.4], [62, 148, 0.8], [182, 132, 1.2]].map(([x, y, d]) => (
          <path
            key={`${x}${y}`} className="anim-twinkle" style={{ animationDelay: `${d}s` }}
            d={`M${x},${y - 7} L${x + 2},${y - 2} L${x + 7},${y} L${x + 2},${y + 2} L${x},${y + 7} L${x - 2},${y + 2} L${x - 7},${y} L${x - 2},${y - 2} Z`}
            fill="#FFD54F"
          />
        ))}
      </g>
    );
  }
  if (fx === 'tears') {
    return (
      <g>
        <path className="anim-tear" d="M96,104 q-4,8 0,12 q4,-4 0,-12" fill="#7EC8F2" />
        <path className="anim-tear" style={{ animationDelay: '0.7s' }} d="M144,104 q4,8 0,12 q-4,-4 0,-12" fill="#7EC8F2" />
      </g>
    );
  }
  if (fx === 'zzz') {
    return (
      <g fill="#90A4AE" fontFamily="sans-serif" fontWeight="900">
        <text className="anim-zzz" x="164" y="58" fontSize="18">z</text>
        <text className="anim-zzz" style={{ animationDelay: '0.6s' }} x="178" y="44" fontSize="13">z</text>
        <text className="anim-zzz" style={{ animationDelay: '1.2s' }} x="189" y="33" fontSize="9">z</text>
      </g>
    );
  }
  if (fx === 'thinking') {
    return (
      <g aria-hidden="true">
        <circle className="anim-thought-dot" cx="151" cy="73" r="5" fill="#B39DDB" />
        <circle className="anim-thought-dot" style={{ animationDelay: '0.24s' }} cx="160" cy="62" r="8" fill="#9C83D5" />
        <g className="anim-thought-cloud">
          <path
            d="M164,57 C151,57 148,45 156,38 C153,26 166,17 178,21 C185,8 206,8 213,21 C226,19 237,31 232,43 C237,54 225,64 213,61 C203,70 187,68 181,59 C175,61 169,60 164,57 Z"
            fill="#F8F5FF"
            stroke="#8E76CF"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />
          <path d="M174,30 Q190,17 207,25" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity="0.85" />
          <text x="195" y="53" textAnchor="middle" fill="#5D498E" fontFamily="sans-serif" fontWeight="900" fontSize="46">?</text>
        </g>
      </g>
    );
  }
  if (fx === 'swirl') {
    return (
      <g className="anim-spin" style={{ transformOrigin: '120px 30px' }}>
        <path d="M108,30 a12,12 0 1,1 12,12 a8,8 0 1,1 8,-8 a4,4 0 1,1 -4,4" fill="none" stroke="#B39DDB" strokeWidth="3.5" strokeLinecap="round" />
      </g>
    );
  }
  return null;
}

// Accessories render inside the head group so they inherit tilt and bounce.
function Accessory({ id, uid }) {
  // `shemagh` remains a render-only alias for customers with saved legacy
  // inventory. New purchases and all visible copy use the cap.
  if (id === 'cap' || id === 'shemagh') {
    return (
      <g>
        <path d="M76,71 Q80,37 120,31 Q160,37 164,71 Q120,55 76,71 Z" fill="#1D4E68" stroke="#14384C" strokeWidth="2" />
        <path d="M83,61 Q97,42 120,39 Q143,42 157,61 Q120,49 83,61 Z" fill="#2C7596" opacity="0.9" />
        <path d="M96,68 Q120,60 151,72 Q135,79 107,76 Q99,74 96,68 Z" fill="#14384C" />
        <path d="M86,70 Q116,64 151,73" fill="none" stroke="#4B9BBD" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
      </g>
    );
  }
  if (id === 'sunglasses') {
    return (
      <g>
        <rect x="80" y="82" width="32" height="22" rx="10" fill="#1a1a1a" />
        <rect x="128" y="82" width="32" height="22" rx="10" fill="#1a1a1a" />
        <path d="M112,90 L128,90" stroke="#1a1a1a" strokeWidth="5" />
        <circle cx="90" cy="88" r="4" fill="#fff" opacity="0.35" />
        <circle cx="138" cy="88" r="4" fill="#fff" opacity="0.35" />
      </g>
    );
  }
  if (id === 'falcon_hood') {
    const goldId = `${uid}-crown-gold`;
    return (
      <g filter="drop-shadow(0 5px 4px rgba(91,54,5,.28))">
        <defs>
          <linearGradient id={goldId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFF3A6" />
            <stop offset="0.42" stopColor="#FFD052" />
            <stop offset="1" stopColor="#D99A1A" />
          </linearGradient>
        </defs>
        <path
          d="M82,52 L90,23 L105,40 L120,11 L135,40 L150,23 L158,52 Q120,42 82,52 Z"
          fill={`url(#${goldId})`}
          stroke="#B67810"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <path d="M84,51 Q120,42 156,51 L154,66 Q120,56 86,66 Z" fill={`url(#${goldId})`} stroke="#B67810" strokeWidth="3" />
        <path d="M89,54 Q120,47 151,54" fill="none" stroke="#FFF3A6" strokeWidth="3" strokeLinecap="round" opacity="0.85" />
        <path d="M91,62 Q120,55 153,62" fill="none" stroke="#8F590B" strokeWidth="2" opacity="0.55" />
        <circle cx="90" cy="23" r="4.5" fill="#FF776D" stroke="#A84E43" strokeWidth="1.5" />
        <circle cx="120" cy="11" r="5.5" fill="#8E76CF" stroke="#5D498E" strokeWidth="1.5" />
        <circle cx="150" cy="23" r="4.5" fill="#5FD1A2" stroke="#318361" strokeWidth="1.5" />
        <path d="M114,55 L120,49 L126,55 L120,61 Z" fill="#F8F5FF" stroke="#C88914" strokeWidth="1.5" />
      </g>
    );
  }
  return null;
}

function Mascot({
  emotion = 'idle', stage = 1, size = 240, track = true, equipped = null, onTap,
  petTier = 'classic',
}) {
  const e = EMOTIONS[emotion] || EMOTIONS.idle;
  // Unique clipPath ids — multiple Mascots can share a page (MascotLab,
  // onboarding). Strip colons from useId()'s output: some SVG renderers
  // (librsvg, used by the golden-frame script) mishandle them in url(#…).
  const uid = useId().replace(/:/g, '');

  // Blink on a randomized timer; double-blink 15% of the time.
  const [blinking, setBlinking] = useState(false);
  useEffect(() => {
    let alive = true;
    let timer;
    const loop = () => {
      timer = setTimeout(() => {
        if (!alive) return;
        setBlinking(true);
        setTimeout(() => {
          if (!alive) return;
          setBlinking(false);
          if (Math.random() < 0.15) {
            setTimeout(() => alive && setBlinking(true), 140);
            setTimeout(() => alive && setBlinking(false), 260);
          }
        }, 120);
        loop();
      }, 2500 + Math.random() * 3500);
    };
    loop();
    return () => { alive = false; clearTimeout(timer); };
  }, []);

  // Pupil tracking via motion values — zero React re-renders per mousemove.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const canTrack = track && !['sleeping', 'sick', 'crying'].includes(emotion);
  useEffect(() => {
    if (!canTrack) { mx.set(0); my.set(0); return; }
    const onMove = (ev) => {
      mx.set((ev.clientX / window.innerWidth - 0.5) * 2);
      my.set((ev.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [canTrack, mx, my]);
  const pupilX = useTransform(mx, (v) => v * 3.5);
  const pupilY = useTransform(my, (v) => v * 2.5);

  const grown = stage >= 2;
  const P = grown ? FALCON : C;
  const bodyLoop = BODY_LOOP_CLASS[e.body] ?? '';
  const flapping = emotion === 'celebrating' || emotion === 'happy' || emotion === 'radiant';

  // Per-state coloured aura + the Akthr signature-tier gold aura, both on the
  // wrapping div (kept off the svg's own `animate` filter so they never fight
  // the saturate() transition below). The aura transitions smoothly between
  // states, coordinated with the emotion morph.
  const stateGlow = glowFor(emotion);
  const tierShadow = petTier === 'signature' ? 'drop-shadow(0 0 14px rgba(212,175,55,0.65))' : '';
  const stateShadow = stateGlow && stateGlow !== 'none' ? `drop-shadow(${stateGlow})` : '';
  const wrapperFilter = [tierShadow, stateShadow].filter(Boolean).join(' ') || 'none';

  // Revive burst — the most-watched pitch moment. Leaving `sick` for any
  // healthier state fires a one-shot pop + expanding ring (~0.9s).
  const [reviving, setReviving] = useState(false);
  const prevEmotion = useRef(emotion);
  useEffect(() => {
    if (prevEmotion.current === 'sick' && emotion !== 'sick') {
      setReviving(true);
      const t = setTimeout(() => setReviving(false), 900);
      prevEmotion.current = emotion;
      return () => clearTimeout(t);
    }
    prevEmotion.current = emotion;
  }, [emotion]);

  return (
    <div
      className={`relative inline-block ${reviving ? 'anim-revive-pop' : ''}`}
      style={{ filter: wrapperFilter, transition: 'filter 0.6s ease' }}
    >
      {reviving && <span className="mascot-revive-ring" aria-hidden="true" />}
      <motion.svg
        initial={false}
        viewBox="0 0 240 240" width={size} height={size}
        animate={{ filter: `saturate(${e.sat})` }}
        transition={{ duration: 0.6 }}
        style={{ overflow: 'visible', touchAction: 'manipulation' }}
        onPointerDown={onTap}
      >
        <ellipse cx="120" cy="212" rx="52" ry="9" fill="#000" opacity="0.08" />

      {/* Root: squish pivot at bottom-center; droop sinks the whole bird. */}
      <Pivot
        x={120} y={208}
        animate={{ y: e.body === 'droop' ? 5 : 0, scale: grown ? 1.06 : 1 }}
        whileTap={{ scaleY: 0.85, scaleX: 1.1 }}
        transition={springs.pose}
      >
        <g className={bodyLoop} style={{ transformOrigin: '120px 208px' }}>
          {/* Tail — grown falcon gets a bold, pointed, barred tail; the
              chick keeps a small stub. */}
          {grown ? (
            <g>
              <path d="M104,182 L120,232 L136,182 Q120,192 104,182 Z" fill={P.wing} />
              <path d="M110,196 L120,214 L130,196 Q120,201 110,196 Z" fill={P.wingDark} opacity="0.8" />
              <path d="M113,186 L120,198 L127,186 Q120,190 113,186 Z" fill={P.wingDark} opacity="0.6" />
            </g>
          ) : stage >= 1 && (
            <g fill={P.wing}>
              <ellipse cx="112" cy="196" rx="6" ry="12" transform="rotate(18 112 196)" />
              <ellipse cx="128" cy="196" rx="6" ry="12" transform="rotate(-18 128 196)" />
            </g>
          )}

          {/* Body */}
          <ellipse cx="120" cy="158" rx="56" ry="50" fill={P.body} />
          <ellipse cx="120" cy="170" rx="34" ry="28" fill={P.belly} />

          {/* Breast streaks — falcon plumage pattern (grown only) */}
          {grown && (
            <g fill={P.wingDark} opacity="0.55">
              {[[106, 164], [120, 170], [134, 164], [113, 180], [127, 180], [120, 190]].map(([x, y], i) => (
                <path key={i} d={`M${x},${y} q2.5,8 0,15 q-2.5,-7 0,-15 Z`} />
              ))}
            </g>
          )}

          {/* Wings — grown falcon: long swept raptor wings tucked down the
              body with dark primary tips. Chick: little rounded nubs. */}
          {stage >= 1 && (grown ? (
            <>
              <g className={flapping ? 'anim-flap-l' : ''} style={{ transformOrigin: '70px 136px' }}>
                <Pivot x={70} y={136} animate={{ rotate: e.body === 'droop' ? 12 : 0 }} transition={springs.gentle}>
                  <path d="M72,130 Q36,150 44,202 Q58,198 71,166 Q68,146 81,140 Z" fill={P.wing} />
                  <path d="M44,202 Q50,180 63,166 Q58,190 53,203 Z" fill={P.wingDark} />
                  <path d="M55,200 Q60,184 69,172 Q65,190 62,201 Z" fill={P.wingDark} opacity="0.7" />
                </Pivot>
              </g>
              <g className={flapping ? 'anim-flap-r' : ''} style={{ transformOrigin: '170px 136px' }}>
                <Pivot x={170} y={136} animate={{ rotate: e.body === 'droop' ? -12 : 0 }} transition={springs.gentle}>
                  <path d="M168,130 Q204,150 196,202 Q182,198 169,166 Q172,146 159,140 Z" fill={P.wing} />
                  <path d="M196,202 Q190,180 177,166 Q182,190 187,203 Z" fill={P.wingDark} />
                  <path d="M185,200 Q180,184 171,172 Q175,190 178,201 Z" fill={P.wingDark} opacity="0.7" />
                </Pivot>
              </g>
            </>
          ) : (
            <>
              <g className={flapping ? 'anim-flap-l' : ''} style={{ transformOrigin: '68px 144px' }}>
                <Pivot x={68} y={144} animate={{ rotate: e.body === 'droop' ? 10 : 0 }} transition={springs.gentle}>
                  <path d="M66,140 Q46,158 58,186 Q72,178 74,156 Z" fill={P.wing} />
                </Pivot>
              </g>
              <g className={flapping ? 'anim-flap-r' : ''} style={{ transformOrigin: '172px 144px' }}>
                <Pivot x={172} y={144} animate={{ rotate: e.body === 'droop' ? -10 : 0 }} transition={springs.gentle}>
                  <path d="M174,140 Q194,158 182,186 Q168,178 166,156 Z" fill={P.wing} />
                </Pivot>
              </g>
            </>
          ))}

          {/* Feet — yellow talons on the grown falcon */}
          {stage >= 1 && (
            <g fill={P.feet}>
              <ellipse cx="100" cy="206" rx="10" ry="5" />
              <ellipse cx="140" cy="206" rx="10" ry="5" />
            </g>
          )}

          {/* Head — tilt pivot at the neck. */}
          <Pivot x={120} y={150} animate={{ rotate: e.headTilt }} transition={springs.gentle}>
            <circle cx="120" cy="92" r="58" fill={P.body} />

            {grown ? (
              <>
                {/* Peregrine/saqr face pattern: pale cheeks, dark hood over
                    the crown dipping to a widow's-peak between the eyes,
                    swept crest feathers. The eyes sit on the pale cheek at
                    the hood's edge — the classic falcon "helmet" look. */}
                <ellipse cx="94" cy="104" rx="22" ry="20" fill={P.cheek} />
                <ellipse cx="146" cy="104" rx="22" ry="20" fill={P.cheek} />
                <path
                  d="M62,96 Q64,46 120,44 Q176,46 178,96 Q152,80 138,92 Q130,74 120,84 Q110,74 102,92 Q88,80 62,96 Z"
                  fill={P.hood}
                />
                <g fill={P.hood}>
                  <path d="M102,46 Q94,24 110,34 Q106,42 102,46 Z" />
                  <path d="M118,43 Q120,18 132,34 Q124,42 118,43 Z" />
                  <path d="M134,46 Q148,26 146,46 Q138,48 134,46 Z" />
                </g>
              </>
            ) : (
              <path d="M112,38 Q120,24 128,38 Q120,34 112,38" fill={P.wing} />
            )}

            {/* Face */}
            {/* side −1/+1: positive EMOTIONS rot must RAISE the inner ends
                (worry); SVG-positive rotation is clockwise, so left flips. */}
            <Brow cx={96} rot={e.brow.rot} y={e.brow.y} side={-1} color={P.brow} />
            <Brow cx={144} rot={e.brow.rot} y={e.brow.y} side={1} color={P.brow} />

            <g className={emotion === 'thinking' ? 'anim-thinking-gaze' : ''}>
              <motion.g initial={false} style={{ x: pupilX, y: pupilY }}>
                <Eye cx={96} lid={e.lid} blinking={blinking} clipId={`${uid}-eyeL`} />
                <Eye cx={144} lid={e.lid} blinking={blinking} clipId={`${uid}-eyeR`} />
              </motion.g>
            </g>

            {/* Malar stripe — the signature dark falcon "moustache" running
                down from the eye through the pale cheek. THE marking that
                says peregrine/saqr. */}
            {grown && (
              <g fill={P.malar}>
                <path d="M92,106 Q86,122 93,138 Q100,122 97,107 Z" />
                <path d="M148,106 Q154,122 147,138 Q140,122 143,107 Z" />
              </g>
            )}

            <motion.g initial={false} animate={{ opacity: e.cheeks }} transition={springs.gentle}>
              <ellipse cx="86" cy="112" rx="9" ry="5" fill={C.blush} />
              <ellipse cx="154" cy="112" rx="9" ry="5" fill={C.blush} />
            </motion.g>

            {/* Beak: grown falcon gets a hooked raptor beak with a cere;
                the chick keeps the little triangle. Bottom variants (the
                emotion mouth) render over both. */}
            {grown ? (
              <g>
                <ellipse cx="120" cy="109" rx="13" ry="8" fill={P.cere} />
                <path d="M107,110 Q120,105 133,110 Q131,122 123,128 Q120,135 120,128 Q118,135 117,128 Q109,122 107,110 Z" fill={P.beakHook} />
                <circle cx="114" cy="109" r="1.4" fill="#1F1F1F" />
                <circle cx="126" cy="109" r="1.4" fill="#1F1F1F" />
              </g>
            ) : (
              <path d="M106,112 Q120,102 134,112 L120,124 Z" fill={P.beakTop} />
            )}
            {Object.entries(BEAK_VARIANTS).map(([id, node]) => {
              const animation = beakAnimation(emotion, e.mouth, id);
              return (
                <Pivot key={id} x={120} y={128} {...animation}>
                  {node}
                </Pivot>
              );
            })}

            {emotion === 'thinking' && stage >= 1 && (
              <Pivot x={164} y={150} animate={{ rotate: [-4, 3, -4] }} transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}>
                <path d="M170,160 Q176,137 157,119 Q147,121 146,133 Q154,140 161,160 Z" fill={P.wing} stroke={P.wingDark} strokeWidth="2" strokeLinejoin="round" />
                <ellipse cx="154" cy="125" rx="4" ry="6" fill={P.belly} opacity="0.6" />
              </Pivot>
            )}

            {equipped && <Accessory id={equipped} uid={uid} />}
          </Pivot>

          {/* Egg shell (stage 0) wraps the lower body, over the belly. */}
          {stage === 0 && (
            <g>
              <path
                d="M60,160 
                    L75,148 L90,160 
                    L105,148 L120,160 
                    L135,148 L150,160 
                    L165,148 L180,160 
                    Q170,208 120,208 
                    Q70,208 60,160 Z"
                fill={C.shell} stroke={C.shellEdge} strokeWidth="2"
              />
              <ellipse cx="102" cy="182" rx="7" ry="10" fill="#fff" opacity="0.5" />
            </g>
          )}
        </g>

        <Effects fx={e.fx} />
      </Pivot>
      </motion.svg>
    </div>
  );
}

export default React.memo(Mascot);
