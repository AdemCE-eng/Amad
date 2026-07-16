import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useAppData } from '../../context/AppDataContext';

// Parent-reward notification for the ACTIVE role. Watches
// /notifications/{activeRole}/parentReward and celebrates once per event
// timestamp (seen-marker in localStorage → refresh-safe, replays impossible).
// No AnimatePresence — keyed enter + manual dismiss, same pattern as
// CelebrationOverlay.
export default function RewardNotice() {
  const { notifications, activeRole } = useAppData();
  const notice = notifications?.[activeRole]?.parentReward || null;
  const [visible, setVisible] = useState(false);
  const seenKey = `nadeem_reward_seen_${activeRole}`;
  const timer = useRef(null);

  useEffect(() => {
    if (!notice?.at) return;
    const seen = Number(localStorage.getItem(seenKey) || 0);
    if (notice.at <= seen) return;
    localStorage.setItem(seenKey, String(notice.at));
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice?.at, activeRole]);

  if (!visible || !notice) return null;

  return (
    <motion.div
      key={notice.at}
      className="absolute inset-x-4 top-16 z-[70]"
      initial={{ opacity: 0, y: -24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      dir="rtl"
    >
      <div className="bg-ink-card border border-emerald-400/30 rounded-3xl p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="text-3xl">🎖️</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-cream text-sm">{notice.title}</p>
            <p className="text-[12px] text-cream/70 font-medium mt-1 leading-relaxed">{notice.body}</p>
            <p className="text-[11px] font-black text-emerald-300 mt-2">+{notice.akthrPoints} نقطة أكثر 🟢</p>
          </div>
          <button onClick={() => setVisible(false)} className="text-cream/40 text-lg leading-none flex-shrink-0">×</button>
        </div>
      </div>
    </motion.div>
  );
}
