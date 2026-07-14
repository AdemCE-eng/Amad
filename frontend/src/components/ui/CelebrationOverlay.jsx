import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import Mascot from '../mascot/Mascot';
import { ACHIEVEMENTS, SHOP_ITEMS, STAGE_INFO } from '../../lib/catalog';
import { burst, goalRain } from '../../lib/confetti';
import { evaluateCelebrationCursor } from '../../lib/celebrationTrigger';
import {
  EVOLUTION_EXIT_MS,
  EVOLUTION_HOLD_MS,
  EVOLUTION_PARTICLES,
  EVOLUTION_TOTAL_MS,
} from '../../lib/evolutionMotion';

const HOLD_MS = { evolution: EVOLUTION_HOLD_MS, achievement: 2400, streak: 2400, challenge: 2400, shop: 2000 };
const EXIT_MS = { evolution: EVOLUTION_EXIT_MS, default: 300 };
const EVOLUTION_RESULT = ['صار بيضة', 'صار فرخًا', 'صار صقرًا'];

export default function CelebrationOverlay({ game, petName }) {
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const queue = useRef([]);
  const seenAt = useRef(null);
  const playing = useRef(false);
  const dismissing = useRef(false);
  const activeType = useRef(null);
  const timers = useRef(new Set());

  const schedule = (callback, milliseconds) => {
    const timer = setTimeout(() => {
      timers.current.delete(timer);
      callback();
    }, milliseconds);
    timers.current.add(timer);
    return timer;
  };

  const clearTimers = () => {
    for (const timer of timers.current) clearTimeout(timer);
    timers.current.clear();
  };

  useEffect(() => () => clearTimers(), []);

  useEffect(() => {
    const celebration = game?.lastCelebration;
    const decision = evaluateCelebrationCursor(seenAt.current, celebration);
    seenAt.current = decision.nextAt;
    if (!decision.shouldQueue) return;
    queue.current.push({ ...celebration, stage: game.stage });
    pump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.lastCelebration?.at]);

  const finishCurrent = () => {
    if (!playing.current || dismissing.current) return;
    dismissing.current = true;
    clearTimers();
    setLeaving(true);
    const exitMs = activeType.current === 'evolution' ? EXIT_MS.evolution : EXIT_MS.default;
    schedule(() => {
      setCurrent(null);
      activeType.current = null;
      playing.current = false;
      dismissing.current = false;
      schedule(pump, 100);
    }, exitMs);
  };

  const pump = () => {
    if (playing.current || !queue.current.length) return;
    playing.current = true;
    dismissing.current = false;
    const event = queue.current.shift();
    activeType.current = event.type;
    setLeaving(false);
    setCurrent(event);
    if (event.type === 'achievement' && event.id === 'goal_reached') goalRain();
    else if (event.type !== 'evolution') burst();
    schedule(finishCurrent, HOLD_MS[event.type] ?? 2200);
  };

  if (!current) return null;

  if (current.type === 'evolution') {
    return createPortal(
      <EvolutionOverlay event={current} petName={petName} leaving={leaving} onDismiss={finishCurrent} />,
      document.body
    );
  }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <motion.div
        className="relative bg-white rounded-3xl px-8 py-6 shadow-2xl flex flex-col items-center max-w-[300px] text-center"
        dir="rtl"
        initial={{ scale: 0.6, y: 40 }}
        animate={{ scale: leaving ? 0.85 : 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      >
        <StandardCard event={current} petName={petName} />
      </motion.div>
    </motion.div>,
    document.body
  );
}

function EvolutionOverlay({ event, petName, leaving, onDismiss }) {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const [canDismiss, setCanDismiss] = useState(Boolean(reducedMotion));
  const previousStage = Math.max(0, event.stage - 1);
  const info = STAGE_INFO[event.stage] || STAGE_INFO[1];

  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    const timer = setTimeout(() => setCanDismiss(true), reducedMotion ? 0 : 1400);
    return () => {
      clearTimeout(timer);
      if (previousFocus instanceof HTMLElement) previousFocus.focus();
    };
  }, [reducedMotion]);

  const handleKeyDown = (eventObject) => {
    if (eventObject.key === 'Escape' && canDismiss) onDismiss();
  };

  const entranceEase = [0.22, 1, 0.36, 1];
  const bounceEase = [0.34, 1.56, 0.64, 1];

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex items-center justify-center px-5 pointer-events-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: reducedMotion ? 0.12 : 0.25 }}
      data-testid="evolution-overlay"
      data-total-duration={EVOLUTION_TOTAL_MS}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" data-testid="evolution-backdrop" />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="evolution-dialog-title"
        aria-describedby="evolution-dialog-description"
        tabIndex={-1}
        dir="rtl"
        onKeyDown={handleKeyDown}
        className="evolution-dialog relative w-full max-w-[310px] overflow-hidden rounded-3xl border border-coral/35 bg-ink-card px-5 py-4 text-center text-cream shadow-[0_24px_70px_rgba(0,0,0,0.65)] outline-none"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.94, y: 14 }}
        animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: reducedMotion ? 0.15 : 0.38, ease: entranceEase }}
      >
        <div className="relative mx-auto h-[174px] w-[230px]" data-testid="evolution-motion-stage">
          <motion.div
            className="absolute inset-8 rounded-full bg-coral/20 blur-xl"
            initial={{ opacity: 0.2, scale: 0.75 }}
            animate={reducedMotion ? { opacity: 0.24, scale: 1 } : { opacity: [0.2, 0.58, 0.16], scale: [0.75, 1.12, 1] }}
            transition={{ duration: reducedMotion ? 0.2 : 2.1, ease: entranceEase }}
            aria-hidden="true"
          />

          {!reducedMotion && (
            <div className="absolute inset-0 pointer-events-none" data-testid="evolution-local-particles" aria-hidden="true">
              {EVOLUTION_PARTICLES.map((particle, index) => (
                <motion.span
                  key={`${particle.x}-${particle.y}`}
                  className="absolute left-1/2 top-[58%] rounded-full"
                  style={{ width: particle.size, height: particle.size, backgroundColor: particle.color }}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.45 }}
                  animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 0], scale: [0.45, 1.15, 0.8] }}
                  transition={{ delay: particle.delay, duration: particle.duration, ease: entranceEase }}
                  data-testid="evolution-particle"
                  data-particle-index={index}
                />
              ))}
            </div>
          )}

          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={reducedMotion
              ? { opacity: 0 }
              : { opacity: [1, 1, 0.6, 0], scale: [1, 1.03, 0.92, 0.82], y: [0, -7, -3, 4], x: previousStage === 0 ? [0, -2, 2, 0] : 0 }}
            transition={reducedMotion
              ? { duration: 0.28, ease: entranceEase }
              : { duration: 0.9, times: [0, 0.33, 0.68, 1], ease: entranceEase }}
            data-testid="evolution-previous-mascot"
          >
            <Mascot emotion="idle" stage={previousStage} size={150} track={false} />
          </motion.div>

          {previousStage === 0 && !reducedMotion && (
            <motion.svg
              className="absolute left-1/2 top-1/2 z-10 h-16 w-20 -translate-x-1/2 -translate-y-1/2"
              viewBox="0 0 80 64"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ delay: 0.28, duration: 0.62, times: [0, 0.15, 0.7, 1] }}
              data-testid="evolution-shell-crack"
              aria-hidden="true"
            >
              <motion.path
                d="M42 8 L34 23 L44 31 L31 48 L38 58"
                fill="none"
                stroke="#8A5A22"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.34, ease: entranceEase }}
              />
            </motion.svg>
          )}

          <motion.div
            className="absolute inset-0 grid place-items-center"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 12 }}
            animate={reducedMotion
              ? { opacity: 1 }
              : { opacity: [0, 0, 1, 1, 1, 1], scale: [0.82, 0.82, 1.06, 1, 1.04, 1], y: [12, 12, -8, 0, -7, 0] }}
            transition={reducedMotion
              ? { delay: 0.22, duration: 0.32, ease: entranceEase }
              : { duration: 1.65, times: [0, 0.30, 0.52, 0.65, 0.82, 1], ease: bounceEase }}
            data-testid="evolution-current-mascot"
          >
            <Mascot emotion={reducedMotion ? 'idle' : 'celebrating'} stage={event.stage} size={154} track={false} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reducedMotion ? 0.28 : 0.92, duration: 0.32, ease: entranceEase }}
        >
          <p id="evolution-dialog-title" className="text-[11px] font-black text-coral">تطور {petName || 'صقر'}!</p>
          <h2 className="mt-0.5 text-xl font-black text-cream">{EVOLUTION_RESULT[event.stage] || `صار ${info.name}`}</h2>
          <p id="evolution-dialog-description" className="mt-1 text-[11px] font-medium text-cream/55">مدخراتك الشخصية نقلته إلى مرحلة جديدة.</p>
        </motion.div>

        <button
          type="button"
          disabled={!canDismiss}
          onClick={onDismiss}
          className="mt-3 min-w-24 rounded-xl border border-coral/30 bg-coral/10 px-5 py-2 text-xs font-black text-coral transition-colors hover:bg-coral/15 disabled:opacity-35"
        >
          رائع
        </button>
      </motion.div>
    </motion.div>
  );
}

function StandardCard({ event, petName }) {
  if (event.type === 'achievement') {
    const achievement = ACHIEVEMENTS[event.id] || { title: event.id, icon: '🏅', coins: 0 };
    return (
      <>
        <span className="text-6xl mb-2">{achievement.icon}</span>
        <p className="text-xs font-bold text-alinma">إنجاز جديد</p>
        <h2 className="text-xl font-black text-gray-800 mt-1">{achievement.title}</h2>
        <p className="text-sm font-bold text-amber-600 mt-2">+{achievement.coins} NXP</p>
      </>
    );
  }
  if (event.type === 'streak') {
    return (
      <>
        <span className="text-6xl mb-2">🔥</span>
        <p className="text-xs font-bold text-alinma">سلسلة أيام رائعة</p>
        <h2 className="text-xl font-black text-gray-800 mt-1">{event.id.replace('day', '')} أيام متتالية!</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">الانضباط صار عادة</p>
      </>
    );
  }
  if (event.type === 'shop') {
    const item = SHOP_ITEMS[event.id] || { name: 'إكسسوار', icon: '🎁' };
    return (
      <>
        <span className="text-6xl mb-2">{item.icon}</span>
        <h2 className="text-xl font-black text-gray-800 mt-1">{item.name}</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">{petName || 'صقر'} لابسه الحين!</p>
      </>
    );
  }
  return (
    <>
      <span className="text-6xl mb-2">🎯</span>
      <p className="text-xs font-bold text-alinma">تحدي الأسبوع</p>
      <h2 className="text-xl font-black text-gray-800 mt-1">أنجزته!</h2>
    </>
  );
}
