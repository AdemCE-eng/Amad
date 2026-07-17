import React, { useEffect, useRef, useState } from 'react';
import { BellRing, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppData } from '../../context/AppDataContext';

export default function OfferWaitNotice() {
  const { userNotifications, activeRole } = useAppData();
  const notice = userNotifications.find((item) => item.type === 'offer_waiting') || null;
  const [visible, setVisible] = useState(false);
  const timer = useRef(null);
  const seenKey = `nadeem_offer_wait_seen_${activeRole}`;

  useEffect(() => {
    if (!notice?.timestamp) return;
    const seen = Number(localStorage.getItem(seenKey) || 0);
    if (notice.timestamp <= seen) return;
    localStorage.setItem(seenKey, String(notice.timestamp));
    setVisible(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(timer.current);
  }, [notice?.timestamp, seenKey]);

  if (!visible || !notice) return null;

  return (
    <motion.div
      className="absolute inset-x-4 top-16 z-[72]"
      initial={{ opacity: 0, y: -20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      dir="rtl"
      role="status"
      aria-live="polite"
    >
      <div className="rounded-3xl border border-amber-300/30 bg-ink-card p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-amber-300/15 text-amber-300"><BellRing size={20} /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-cream">{notice.title}</p>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-cream/65">{notice.body}</p>
          </div>
          <button type="button" onClick={() => setVisible(false)} className="shrink-0 rounded-lg p-1 text-cream/40 hover:bg-white/5 hover:text-cream" aria-label="إغلاق الإشعار"><X size={16} /></button>
        </div>
      </div>
    </motion.div>
  );
}
