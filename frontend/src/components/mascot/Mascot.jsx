/* eslint-disable react/no-unknown-property */
import React, { useEffect, useId, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'motion/react';
import { EMOTIONS } from './emotions';
import { springs } from './springs';

// صقّور — the falcon chick. One SVG rig; every part interpolates toward the
// EMOTIONS table with springs. Cute-proportion rules (Duolingo/Finch): head
// ≈ 55% of height, eyes ≈ 30% of face width sitting at the head's vertical
// center, tiny beak, no neck, round everything.
//
// Props: emotion (EMOTIONS key) · stage (0 egg | 1 chick | 2 grown) ·
// size (px) · track (pupils follow cursor) · equipped (accessory id) ·
// onTap. Memoized — parents can re-render freely on Firebase pushes.

const C = {
  body: '#F5B841',
  belly: '#FDEBC8',
  wing: '#E8A62E',
  wingDark: '#8A5A22',   // falcon primary tips / breast streaks / tail bars
  cap: '#7A4E1D',        // grown falcon crown + malar stripe
  beakTop: '#E8833A',
  beakBottom: '#D96F2B',
  beakHook: '#4A4A4A',   // raptor beak (grown)
  cere: '#F5C24B',       // fleshy base of the beak (grown)
  mouthInner: '#8C3A1D',
  brow: '#7A4E1D',
  eye: '#2B1E12',
  blush: '#F48FB1',
  feet: '#E8833A',
  shell: '#FDF6E3',
  shellEdge: '#E8D9B5',
};

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
  if (fx === 'crumbs') {
    return (
      <g>
        {[[112, 132], [124, 136], [118, 130]].map(([x, y], i) => (
          <circle key={i} className="anim-crumb" style={{ animationDelay: `${i * 0.25}s` }} cx={x} cy={y} r="2.5" fill={C.wing} />
        ))}
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
function Accessory({ id }) {
  if (id === 'shemagh') {
    return (
      <g>
        <path d="M64,72 Q120,18 176,72 L176,86 Q120,42 64,86 Z" fill="#fff" />
        <path d="M64,72 Q120,18 176,72 L176,79 Q120,30 64,79 Z" fill="#D32F2F" opacity="0.85" />
        <ellipse cx="120" cy="52" rx="34" ry="8" fill="none" stroke="#1a1a1a" strokeWidth="6" />
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
    return (
      <g>
        <path d="M86,58 Q120,20 154,58 Q154,74 120,72 Q86,74 86,58 Z" fill="#8D6E63" />
        <path d="M86,58 Q120,20 154,58" fill="none" stroke="#5D4037" strokeWidth="3" />
        <circle cx="120" cy="30" r="5" fill="#FFD54F" />
      </g>
    );
  }
  return null;
}

function Mascot({ emotion = 'idle', stage = 1, size = 240, track = true, equipped = null, onTap }) {
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
  const bodyLoop = BODY_LOOP_CLASS[e.body] ?? '';
  const flapping = emotion === 'celebrating' || emotion === 'happy';

  return (
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
              <path d="M104,182 L120,232 L136,182 Q120,192 104,182 Z" fill={C.wing} />
              <path d="M110,196 L120,214 L130,196 Q120,201 110,196 Z" fill={C.wingDark} opacity="0.7" />
              <path d="M113,186 L120,198 L127,186 Q120,190 113,186 Z" fill={C.wingDark} opacity="0.5" />
            </g>
          ) : stage >= 1 && (
            <g fill={C.wing}>
              <ellipse cx="112" cy="196" rx="6" ry="12" transform="rotate(18 112 196)" />
              <ellipse cx="128" cy="196" rx="6" ry="12" transform="rotate(-18 128 196)" />
            </g>
          )}

          {/* Body */}
          <ellipse cx="120" cy="158" rx="56" ry="50" fill={C.body} />
          <ellipse cx="120" cy="170" rx="34" ry="28" fill={C.belly} />

          {/* Breast streaks — falcon plumage pattern (grown only) */}
          {grown && (
            <g fill={C.wingDark} opacity="0.45">
              {[[104, 166], [120, 172], [136, 166], [112, 182], [128, 182]].map(([x, y], i) => (
                <path key={i} d={`M${x},${y} q2,7 0,13 q-2,-6 0,-13 Z`} />
              ))}
            </g>
          )}

          {/* Wings — grown falcon: long swept raptor wings tucked down the
              body with dark primary tips. Chick: little rounded nubs. */}
          {stage >= 1 && (grown ? (
            <>
              <g className={flapping ? 'anim-flap-l' : ''} style={{ transformOrigin: '70px 136px' }}>
                <Pivot x={70} y={136} animate={{ rotate: e.body === 'droop' ? 12 : 0 }} transition={springs.gentle}>
                  <path d="M72,132 Q40,150 46,200 Q58,196 70,168 Q68,148 80,142 Z" fill={C.wing} />
                  <path d="M46,200 Q52,182 62,170 Q58,190 54,200 Z" fill={C.wingDark} />
                </Pivot>
              </g>
              <g className={flapping ? 'anim-flap-r' : ''} style={{ transformOrigin: '170px 136px' }}>
                <Pivot x={170} y={136} animate={{ rotate: e.body === 'droop' ? -12 : 0 }} transition={springs.gentle}>
                  <path d="M168,132 Q200,150 194,200 Q182,196 170,168 Q172,148 160,142 Z" fill={C.wing} />
                  <path d="M194,200 Q188,182 178,170 Q182,190 186,200 Z" fill={C.wingDark} />
                </Pivot>
              </g>
            </>
          ) : (
            <>
              <g className={flapping ? 'anim-flap-l' : ''} style={{ transformOrigin: '68px 144px' }}>
                <Pivot x={68} y={144} animate={{ rotate: e.body === 'droop' ? 10 : 0 }} transition={springs.gentle}>
                  <path d="M66,140 Q46,158 58,186 Q72,178 74,156 Z" fill={C.wing} />
                </Pivot>
              </g>
              <g className={flapping ? 'anim-flap-r' : ''} style={{ transformOrigin: '172px 144px' }}>
                <Pivot x={172} y={144} animate={{ rotate: e.body === 'droop' ? -10 : 0 }} transition={springs.gentle}>
                  <path d="M174,140 Q194,158 182,186 Q168,178 166,156 Z" fill={C.wing} />
                </Pivot>
              </g>
            </>
          ))}

          {/* Feet */}
          {stage >= 1 && (
            <g fill={C.feet}>
              <ellipse cx="100" cy="206" rx="10" ry="5" />
              <ellipse cx="140" cy="206" rx="10" ry="5" />
            </g>
          )}

          {/* Head — tilt pivot at the neck. */}
          <Pivot x={120} y={150} animate={{ rotate: e.headTilt }} transition={springs.gentle}>
            <circle cx="120" cy="92" r="58" fill={C.body} />

            {/* Crown cap — dark falcon head, swept-back crest (grown only) */}
            {grown && (
              <g fill={C.cap}>
                <path d="M64,90 Q66,46 120,42 Q174,46 176,90 Q150,72 120,70 Q90,72 64,90 Z" />
                {/* swept-back crest feathers off the crown */}
                <path d="M104,44 Q98,24 112,34 Q108,42 104,44 Z" />
                <path d="M118,41 Q120,18 130,34 Q124,40 118,41 Z" />
                <path d="M132,44 Q142,26 142,44 Q136,46 132,44 Z" />
              </g>
            )}
            {!grown && <path d="M112,38 Q120,24 128,38 Q120,34 112,38" fill={C.wing} />}

            {/* Face */}
            {/* side −1/+1: positive EMOTIONS rot must RAISE the inner ends
                (worry); SVG-positive rotation is clockwise, so left flips. */}
            {/* Grown falcon: brows sit on the dark crown, so darken them to
                keep the emotion readable (brown-on-brown would vanish). */}
            <Brow cx={96} rot={e.brow.rot} y={e.brow.y} side={-1} color={grown ? '#2E1C0A' : C.brow} />
            <Brow cx={144} rot={e.brow.rot} y={e.brow.y} side={1} color={grown ? '#2E1C0A' : C.brow} />

            <motion.g initial={false} style={{ x: pupilX, y: pupilY }}>
              <Eye cx={96} lid={e.lid} blinking={blinking} clipId={`${uid}-eyeL`} />
              <Eye cx={144} lid={e.lid} blinking={blinking} clipId={`${uid}-eyeR`} />
            </motion.g>

            {/* Malar stripe — the signature dark falcon "moustache" teardrop
                below each eye. THE marking that says peregrine/saqr. */}
            {grown && (
              <g fill={C.cap}>
                <path d="M90,108 Q83,124 90,138 Q98,124 96,109 Z" />
                <path d="M150,108 Q157,124 150,138 Q142,124 144,109 Z" />
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
                <ellipse cx="120" cy="110" rx="12" ry="7" fill={C.cere} />
                <path d="M108,111 Q120,106 132,111 Q130,122 123,127 Q120,133 120,127 Q118,133 117,127 Q110,122 108,111 Z" fill={C.beakHook} />
                <circle cx="114" cy="110" r="1.3" fill="#2A2A2A" />
                <circle cx="126" cy="110" r="1.3" fill="#2A2A2A" />
              </g>
            ) : (
              <path d="M106,112 Q120,102 134,112 L120,124 Z" fill={C.beakTop} />
            )}
            {Object.entries(BEAK_VARIANTS).map(([id, node]) => (
              <Pivot
                key={id} x={120} y={128}
                animate={{ opacity: e.mouth === id ? 1 : 0, scale: e.mouth === id ? 1 : 0.85 }}
                transition={springs.snappy}
              >
                {node}
              </Pivot>
            ))}

            {equipped && <Accessory id={equipped} />}
          </Pivot>

          {/* Egg shell (stage 0) wraps the lower body, over the belly. */}
          {stage === 0 && (
            <g>
              <path
                d="M70,160 L80,148 L90,160 L100,148 L110,160 L120,148 L130,160 L140,148 L150,160 L160,148 L170,160 Q170,208 120,208 Q70,208 70,160 Z"
                fill={C.shell} stroke={C.shellEdge} strokeWidth="2"
              />
              <ellipse cx="102" cy="182" rx="7" ry="10" fill="#fff" opacity="0.5" />
            </g>
          )}
        </g>

        <Effects fx={e.fx} />
      </Pivot>
    </motion.svg>
  );
}

export default React.memo(Mascot);
