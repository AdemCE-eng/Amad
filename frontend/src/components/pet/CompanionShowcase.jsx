import React, { useEffect, useRef, useState } from 'react';
import { Flame, HeartPulse, TrendingUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Mascot from '../mascot/Mascot';

const PARTICLES = [
  { x: -76, y: -70, symbol: '✦', color: 'text-amber-300' },
  { x: 78, y: -62, symbol: '♥', color: 'text-coral' },
  { x: -92, y: -12, symbol: '✦', color: 'text-violet' },
  { x: 94, y: 4, symbol: '✦', color: 'text-emerald-300' },
  { x: -54, y: 72, symbol: '♥', color: 'text-coral' },
  { x: 64, y: 74, symbol: '✦', color: 'text-amber-300' },
];

function MetricChip({ icon: Icon, label, value, className, delay = 0, testId }) {
  return (
    <motion.div
      data-testid={testId}
      className={`absolute z-20 inline-flex items-center gap-1.5 rounded-2xl border px-2.5 py-1.5 shadow-lg backdrop-blur-md ${className}`}
      initial={{ opacity: 0, y: 8, scale: 0.92 }}
      animate={{ opacity: 1, y: [0, -3, 0], scale: 1 }}
      transition={{ opacity: { delay, duration: 0.35 }, scale: { delay, duration: 0.35 }, y: { delay: delay + 0.35, duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
    >
      <Icon size={13} strokeWidth={2.4} aria-hidden="true" />
      <span className="text-[8px] font-bold opacity-65">{label}</span>
      <strong dir="ltr" className="text-[10px] font-black tabular-nums">{value}</strong>
    </motion.div>
  );
}

export default function CompanionShowcase({ pet, game, emotion, goalProgress, petName, isSick, isHappy, onTap }) {
  const [reacting, setReacting] = useState(false);
  const [burst, setBurst] = useState(0);
  const reactionTimer = useRef(null);

  useEffect(() => () => clearTimeout(reactionTimer.current), []);

  const handleTap = () => {
    onTap?.();
    setReacting(true);
    setBurst((value) => value + 1);
    clearTimeout(reactionTimer.current);
    reactionTimer.current = setTimeout(() => setReacting(false), 1300);
  };

  const activeEmotion = reacting ? 'celebrating' : emotion;
  const glow = isSick ? 'from-red-500/25 via-red-500/5' : isHappy || reacting ? 'from-amber-300/25 via-coral/10' : 'from-coral/20 via-violet/5';
  return (
    <section
      className="relative mb-3 h-[15.5rem] w-full overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-b from-ink-card to-ink/80 shadow-[0_24px_60px_-38px_rgba(0,0,0,0.95)]"
      data-testid="pet-mascot-hero"
      aria-label={`${petName}، مرافق مالي يتفاعل مع تقدم الادخار`}
    >
      <div className={`absolute inset-x-8 top-4 h-52 rounded-full bg-gradient-to-b ${glow} to-transparent blur-2xl transition-colors duration-700`} />
      <div className="absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:24px_24px]" />

      <svg className="absolute left-1/2 top-1/2 h-[14.5rem] w-[14.5rem] -translate-x-1/2 -translate-y-1/2 -rotate-90" viewBox="0 0 240 240" aria-hidden="true">
        <circle cx="120" cy="120" r="105" fill="none" stroke="rgba(255,255,255,0.055)" strokeWidth="2" strokeDasharray="2 8" />
        <circle cx="120" cy="120" r="94" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="7" />
        <motion.circle cx="120" cy="120" r="94" pathLength="100" fill="none" stroke="url(#pet-progress-gradient)" strokeWidth="7" strokeLinecap="round" strokeDasharray="100" initial={{ strokeDashoffset: 100 }} animate={{ strokeDashoffset: 100 - goalProgress }} transition={{ duration: 1.2, ease: 'easeOut' }} />
        <defs>
          <linearGradient id="pet-progress-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8B7CF6" />
            <stop offset="50%" stopColor="#E88466" />
            <stop offset="100%" stopColor="#63D6A1" />
          </linearGradient>
        </defs>
      </svg>

      <MetricChip icon={TrendingUp} label="الهدف" value={`${goalProgress}%`} className="right-3 top-3 border-coral/25 bg-coral/10 text-coral" delay={0.05} />
      <MetricChip icon={Flame} label="السلسلة" value={`${game.streak.current}`} className="left-3 top-3 border-amber-300/25 bg-amber-300/10 text-amber-300" delay={0.12} />
      <MetricChip testId="pet-health-status" icon={HeartPulse} label="الصحة" value={`${pet.health}%`} className={`bottom-3 left-3 ${isSick ? 'border-red-400/30 bg-red-400/10 text-red-300' : 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'}`} delay={0.2} />

      <button type="button" onClick={handleTap} className="absolute left-1/2 top-1/2 z-10 grid h-48 w-48 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral" aria-label={`تفاعل مع ${petName}`}>
        <motion.div animate={reacting ? { scale: [1, 1.12, 0.98, 1], rotate: [0, -3, 3, 0] } : { y: [0, -3, 0] }} transition={reacting ? { duration: 0.8, ease: 'easeOut' } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}>
          <Mascot emotion={activeEmotion} stage={game.stage} equipped={game.equipped} size={196} track={!reacting} />
        </motion.div>
      </button>

      <AnimatePresence>
        {reacting && (
          <motion.div key={burst} className="pointer-events-none absolute left-1/2 top-1/2 z-30" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {PARTICLES.map((particle, index) => (
              <motion.span key={`${burst}-${index}`} className={`absolute text-base font-black ${particle.color}`} initial={{ x: 0, y: 0, opacity: 0, scale: 0.2 }} animate={{ x: particle.x, y: particle.y, opacity: [0, 1, 0], scale: [0.2, 1.25, 0.8], rotate: index % 2 ? 22 : -22 }} transition={{ duration: 0.95, delay: index * 0.045, ease: 'easeOut' }}>
                {particle.symbol}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
