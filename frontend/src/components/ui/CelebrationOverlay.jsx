import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'motion/react';
import Mascot from '../mascot/Mascot';
import NamoCelebrationDialog from './NamoCelebrationDialog';
import { STAGE_INFO } from '../../lib/catalog';
import { evaluateCelebrationCursor } from '../../lib/celebrationTrigger';
import { buildCelebrationPresentation } from '../../lib/celebrationPresentation';
import {
  EVOLUTION_EXIT_MS,
  EVOLUTION_HOLD_MS,
  EVOLUTION_PARTICLES,
  EVOLUTION_TOTAL_MS,
} from '../../lib/evolutionMotion';

const EXIT_MS = { evolution: EVOLUTION_EXIT_MS, default: 260 };
const EVOLUTION_RESULT = ['صار بيضة', 'صار فرخًا', 'صار صقرًا'];

export default function CelebrationOverlay({ game, petName, activeRole = 'rashid' }) {
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const queue = useRef([]);
  const seenCursor = useRef(null);
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
    if (activeRole !== 'rashid') {
      clearTimers();
      queue.current = [];
      playing.current = false;
      dismissing.current = false;
      activeType.current = null;
      setCurrent(null);
      setLeaving(false);
    }
    const decision = evaluateCelebrationCursor(seenCursor.current, celebration, {
      eligible: activeRole === 'rashid',
    });
    seenCursor.current = decision.nextCursor;
    if (!decision.shouldQueue) return;
    queue.current.push({ ...celebration, stage: game.stage });
    pump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.lastCelebration?.at, game?.lastCelebration?.type, game?.lastCelebration?.id, activeRole]);

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
      schedule(pump, 80);
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
    // Evolution is concise and auto-dismisses; other meaningful rewards wait
    // for the explicit accessible action so their actual outcome is readable.
    if (event.type === 'evolution') schedule(finishCurrent, EVOLUTION_HOLD_MS);
  };

  if (!current) return null;

  return createPortal(
    current.type === 'evolution'
      ? <EvolutionOverlay event={current} petName={petName} leaving={leaving} onDismiss={finishCurrent} />
      : <RewardOverlay event={current} petName={petName} leaving={leaving} onDismiss={finishCurrent} />,
    document.body
  );
}

function EvolutionOverlay({ event, petName, leaving, onDismiss }) {
  const reducedMotion = useReducedMotion();
  const [canDismiss, setCanDismiss] = useState(Boolean(reducedMotion));
  const previousStage = Math.max(0, event.stage - 1);
  const info = STAGE_INFO[event.stage] || STAGE_INFO[1];
  const isHatch = previousStage === 0 && event.stage === 1;

  useEffect(() => {
    const timer = setTimeout(() => setCanDismiss(true), reducedMotion ? 0 : 1350);
    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <NamoCelebrationDialog
      variant="evolution"
      titleId="evolution-dialog-title"
      descriptionId="evolution-dialog-description"
      onDismiss={onDismiss}
      leaving={leaving}
      dismissDisabled={!canDismiss}
      reducedMotion={reducedMotion}
      testId="evolution-overlay"
    >
      {({ reducedMotion: shouldReduce }) => (
        <>
          <div
            className="relative mx-auto h-[174px] w-[230px]"
            data-testid="evolution-motion-stage"
            data-transition-kind={isHatch ? 'egg-to-chick' : 'chick-to-adult'}
          >
            <motion.div
              className="absolute inset-8 rounded-full bg-coral/20 blur-xl"
              initial={{ opacity: 0.18, scale: 0.78 }}
              animate={shouldReduce ? { opacity: 0.22, scale: 1 } : { opacity: [0.18, 0.5, 0.14], scale: [0.78, 1.1, 1] }}
              transition={{ duration: shouldReduce ? 0.18 : 2.05, ease: [0.22, 1, 0.36, 1] }}
              aria-hidden="true"
            />

            {!shouldReduce && (
              <LocalizedParticles testId="evolution" />
            )}

            {isHatch ? (
              <HatchMotion event={event} reducedMotion={shouldReduce} />
            ) : (
              <AdultEvolutionMotion event={event} previousStage={previousStage} reducedMotion={shouldReduce} />
            )}
          </div>

          <motion.div
            initial={{ opacity: 0, y: shouldReduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: shouldReduce ? 0.24 : 1.02, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <p id="evolution-dialog-title" className="text-[11px] font-black text-coral">تطور {petName || 'صقر'}!</p>
            <h2 className="mt-0.5 text-xl font-black text-cream">{EVOLUTION_RESULT[event.stage] || `صار ${info.name}`}</h2>
            <p id="evolution-dialog-description" className="mt-1 text-[11px] font-medium text-cream/60">
              {isHatch ? 'مدخراتك كبرت، وصقر كبر معك.' : 'واصلت الادخار، وصقر وصل إلى مرحلته الأقوى.'}
            </p>
          </motion.div>

          <button
            type="button"
            disabled={!canDismiss}
            onClick={onDismiss}
            className="mt-3 min-w-24 rounded-xl border border-coral/30 bg-coral/10 px-5 py-2 text-xs font-black text-coral transition-colors hover:bg-coral/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral disabled:opacity-35"
          >
            رائع
          </button>
          <span className="sr-only" data-total-duration={EVOLUTION_TOTAL_MS} />
        </>
      )}
    </NamoCelebrationDialog>
  );
}

function HatchMotion({ event, reducedMotion }) {
  const entranceEase = [0.22, 1, 0.36, 1];
  const bounceEase = [0.34, 1.56, 0.64, 1];

  return (
    <>
      <motion.div
        className="absolute inset-0 z-10 grid place-items-center"
        initial={{ opacity: 1, scale: 1, x: 0, rotate: 0 }}
        animate={reducedMotion
          ? { opacity: 0, scale: 0.96 }
          : { opacity: [1, 1, 0.72, 0], scale: [1, 1.015, 0.98, 0.92], x: [0, -2, 2, 0], rotate: [0, -1.6, 1.6, 0] }}
        transition={reducedMotion
          ? { duration: 0.26, ease: entranceEase }
          : { duration: 0.88, times: [0, 0.34, 0.62, 1], ease: entranceEase }}
        data-testid="evolution-previous-mascot"
      >
        <Mascot emotion="idle" stage={0} size={150} track={false} />
      </motion.div>

      {!reducedMotion && (
        <>
          <motion.span
            className="absolute left-[68px] top-[64px] z-30 h-[48px] w-[94px] border border-amber-200/70 bg-[#FFF3C4] shadow-[0_5px_18px_rgba(245,184,65,0.18)]"
            style={{ borderRadius: '52% 52% 40% 40% / 78% 78% 24% 24%' }}
            initial={{ opacity: 0, y: 0, rotate: 0, scale: 0.96 }}
            animate={{ opacity: [0, 1, 1, 0.45, 0], y: [0, 0, -20, -25, -28], rotate: [0, 0, -5, -7, -7], scale: [0.96, 1, 1, 0.98, 0.96] }}
            transition={{ delay: 0.22, duration: 1.12, times: [0, 0.12, 0.52, 0.78, 1], ease: entranceEase }}
            data-testid="evolution-shell-top"
            aria-hidden="true"
          />
          <motion.span
            className="absolute left-[68px] top-[101px] z-30 h-[38px] w-[94px] border border-amber-200/70 bg-[#FFF3C4] shadow-[0_7px_16px_rgba(0,0,0,0.16)]"
            style={{ borderRadius: '38% 38% 54% 54% / 24% 24% 78% 78%' }}
            initial={{ opacity: 0, y: 0, scale: 0.96 }}
            animate={{ opacity: [0, 1, 1, 1, 0], y: [0, 0, 7, 8, 9], scale: [0.96, 1, 1.02, 1, 0.98] }}
            transition={{ delay: 0.22, duration: 1.62, times: [0, 0.1, 0.45, 0.82, 1], ease: entranceEase }}
            data-testid="evolution-shell-bottom"
            aria-hidden="true"
          />
        </>
      )}

      <motion.div
        className="absolute inset-0 z-20 grid place-items-center"
        initial={reducedMotion ? { opacity: 0, scale: 0.96 } : { opacity: 0, scale: 0.88, y: 18 }}
        animate={reducedMotion
          ? { opacity: 1, scale: 1 }
          : { opacity: [0, 0.35, 1, 1, 1], scale: [0.88, 0.92, 1.04, 0.98, 1], y: [18, 12, -6, 2, 0] }}
        transition={reducedMotion
          ? { delay: 0.2, duration: 0.28, ease: entranceEase }
          : { delay: 0.48, duration: 1.08, times: [0, 0.18, 0.52, 0.76, 1], ease: bounceEase }}
        data-testid="evolution-current-mascot"
      >
        <Mascot emotion={reducedMotion ? 'idle' : 'celebrating'} stage={event.stage} size={154} track={false} />
      </motion.div>
    </>
  );
}

function AdultEvolutionMotion({ event, previousStage, reducedMotion }) {
  const entranceEase = [0.22, 1, 0.36, 1];
  const bounceEase = [0.34, 1.56, 0.64, 1];
  return (
    <>
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={{ opacity: 1, scale: 1, y: 0 }}
        animate={reducedMotion
          ? { opacity: 0 }
          : { opacity: [1, 1, 0.6, 0], scale: [1, 1.03, 0.92, 0.82], y: [0, -7, -3, 4] }}
        transition={reducedMotion
          ? { duration: 0.28, ease: entranceEase }
          : { duration: 0.9, times: [0, 0.33, 0.68, 1], ease: entranceEase }}
        data-testid="evolution-previous-mascot"
      >
        <Mascot emotion="idle" stage={previousStage} size={150} track={false} />
      </motion.div>
      <motion.div
        className="absolute inset-0 grid place-items-center"
        initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 12 }}
        animate={reducedMotion
          ? { opacity: 1 }
          : { opacity: [0, 0, 1, 1, 1, 1], scale: [0.82, 0.82, 1.06, 1, 1.04, 1], y: [12, 12, -8, 0, -7, 0] }}
        transition={reducedMotion
          ? { delay: 0.22, duration: 0.32, ease: entranceEase }
          : { duration: 1.65, times: [0, 0.3, 0.52, 0.65, 0.82, 1], ease: bounceEase }}
        data-testid="evolution-current-mascot"
      >
        <Mascot emotion={reducedMotion ? 'idle' : 'celebrating'} stage={event.stage} size={154} track={false} />
      </motion.div>
    </>
  );
}

function RewardOverlay({ event, petName, leaving, onDismiss }) {
  const presentation = buildCelebrationPresentation(event, petName);
  return (
    <NamoCelebrationDialog
      variant={presentation.variant}
      titleId="reward-dialog-title"
      descriptionId="reward-dialog-description"
      onDismiss={onDismiss}
      leaving={leaving}
      testId="reward-celebration-overlay"
    >
      {({ reducedMotion }) => (
        <>
          {!reducedMotion && <LocalizedParticles testId="reward" />}
          <motion.div
            className="relative z-10 mx-auto grid h-20 w-20 place-items-center rounded-3xl border border-white/10 bg-black/15 text-5xl"
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.82, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0.16 : 0.42, ease: [0.34, 1.56, 0.64, 1] }}
            aria-hidden="true"
          >
            {presentation.icon}
          </motion.div>
          <p className="relative z-10 mt-3 text-[11px] font-black text-coral">{presentation.label}</p>
          <h2 id="reward-dialog-title" className="relative z-10 mt-0.5 text-xl font-black text-cream">{presentation.title}</h2>
          <p id="reward-dialog-description" className="relative z-10 mt-1 text-[11px] font-medium leading-relaxed text-cream/60">{presentation.description}</p>
          {presentation.reward && <p className="relative z-10 mt-2 text-sm font-black text-amber-300">{presentation.reward}</p>}
          <button
            type="button"
            onClick={onDismiss}
            className="relative z-10 mt-4 min-w-24 rounded-xl border border-coral/30 bg-coral/10 px-5 py-2 text-xs font-black text-coral transition-colors hover:bg-coral/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
          >
            رائع
          </button>
        </>
      )}
    </NamoCelebrationDialog>
  );
}

function LocalizedParticles({ testId }) {
  return (
    <div className="absolute inset-0 pointer-events-none" data-testid={`${testId}-local-particles`} aria-hidden="true">
      {EVOLUTION_PARTICLES.map((particle, index) => (
        <motion.span
          key={`${particle.x}-${particle.y}`}
          className="absolute left-1/2 top-[44%] rounded-full"
          style={{ width: particle.size, height: particle.size, backgroundColor: particle.color }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.45 }}
          animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 0], scale: [0.45, 1.12, 0.8] }}
          transition={{ delay: particle.delay, duration: particle.duration, ease: [0.22, 1, 0.36, 1] }}
          data-testid={`${testId}-particle`}
          data-particle-index={index}
        />
      ))}
    </div>
  );
}
