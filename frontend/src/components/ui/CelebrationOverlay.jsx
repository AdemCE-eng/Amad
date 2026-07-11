import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'motion/react';
import Mascot from '../mascot/Mascot';
import { ACHIEVEMENTS, SHOP_ITEMS, STAGE_INFO } from '../../lib/catalog';
import { burst, goalRain, evolutionStars } from '../../lib/confetti';

// Full-screen celebration layer. Watches game.lastCelebration.at — a changed
// timestamp enqueues exactly one event (replays impossible), overlays play
// one at a time above the phone frame via a body portal.
//
// No AnimatePresence: its exit path deadlocks under React 19 (froze the
// onboarding transition too), which for a full-screen dim overlay would trap
// the screen. Instead we fade out manually (leaving flag → opacity 0 → unmount).
const HOLD_MS = { evolution: 3200, achievement: 2400, streak: 2400, challenge: 2400, shop: 2000 };

export default function CelebrationOverlay({ game, petName }) {
  const [current, setCurrent] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const queue = useRef([]);
  const seenAt = useRef(null);
  const playing = useRef(false);

  useEffect(() => {
    const c = game?.lastCelebration;
    if (!c || !c.at) { seenAt.current = c?.at ?? 0; return; }
    if (seenAt.current === null) { seenAt.current = c.at; return; } // ignore mount-time state
    if (c.at === seenAt.current) return;
    seenAt.current = c.at;
    queue.current.push({ ...c, stage: game.stage });
    pump();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game?.lastCelebration?.at]);

  const pump = () => {
    if (playing.current || !queue.current.length) return;
    playing.current = true;
    const evt = queue.current.shift();
    setLeaving(false);
    setCurrent(evt);
    if (evt.type === 'evolution') evolutionStars();
    else if (evt.type === 'achievement' && evt.id === 'goal_reached') goalRain();
    else burst();
    setTimeout(() => setLeaving(true), HOLD_MS[evt.type] ?? 2200);
    setTimeout(() => {
      setCurrent(null);
      playing.current = false;
      setTimeout(pump, 100);
    }, (HOLD_MS[evt.type] ?? 2200) + 300);
  };

  if (!current) return null;

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
        <Card evt={current} petName={petName} />
      </motion.div>
    </motion.div>,
    document.body
  );
}

function Card({ evt, petName }) {
  if (evt.type === 'evolution') {
    const info = STAGE_INFO[evt.stage] || STAGE_INFO[1];
    return (
      <>
        <motion.div
          initial={{ scale: 0.4, rotate: -8 }}
          animate={{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 120, damping: 10, delay: 0.15 } }}
        >
          <Mascot emotion="celebrating" stage={evt.stage} size={170} track={false} />
        </motion.div>
        <p className="text-xs font-bold text-alinma mt-1">تطوّر {petName || 'مرافقك'}!</p>
        <h2 className="text-2xl font-black text-gray-800 mt-1">{info.icon} صار {info.name}!</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">مدخراتك كبّرته — واصل!</p>
      </>
    );
  }
  if (evt.type === 'achievement') {
    const a = ACHIEVEMENTS[evt.id] || { title: evt.id, icon: '🏅', coins: 0 };
    return (
      <>
        <span className="text-6xl mb-2">{a.icon}</span>
        <p className="text-xs font-bold text-alinma">إنجاز جديد</p>
        <h2 className="text-xl font-black text-gray-800 mt-1">{a.title}</h2>
        <p className="text-sm font-bold text-amber-600 mt-2">+{a.coins} NXP</p>
      </>
    );
  }
  if (evt.type === 'streak') {
    return (
      <>
        <span className="text-6xl mb-2">🔥</span>
        <p className="text-xs font-bold text-alinma">سلسلة أيام رائعة</p>
        <h2 className="text-xl font-black text-gray-800 mt-1">{evt.id.replace('day', '')} أيام متتالية!</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">الانضباط صار عادة 💪</p>
      </>
    );
  }
  if (evt.type === 'shop') {
    const item = SHOP_ITEMS[evt.id] || { name: 'إكسسوار', icon: '🎁' };
    return (
      <>
        <span className="text-6xl mb-2">{item.icon}</span>
        <h2 className="text-xl font-black text-gray-800 mt-1">{item.name} 🎉</h2>
        <p className="text-sm text-gray-500 mt-1 font-medium">{petName || 'مرافقك'} لابسه الحين!</p>
      </>
    );
  }
  // challenge
  return (
    <>
      <span className="text-6xl mb-2">🎯</span>
      <p className="text-xs font-bold text-alinma">تحدي الأسبوع</p>
      <h2 className="text-xl font-black text-gray-800 mt-1">أنجزته!</h2>
    </>
  );
}
