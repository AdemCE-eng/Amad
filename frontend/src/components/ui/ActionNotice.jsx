import React, { useEffect } from 'react';
import { BellRing, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppData } from '../../context/AppDataContext';

export default function ActionNotice() {
  const { actionNotice, dismissActionNotice } = useAppData();

  useEffect(() => {
    if (!actionNotice) return undefined;
    const timer = setTimeout(dismissActionNotice, 5000);
    return () => clearTimeout(timer);
  }, [actionNotice?.id, dismissActionNotice]);

  if (!actionNotice) return null;

  return (
    <motion.div
      key={actionNotice.id}
      className="absolute inset-x-4 top-16 z-[74]"
      initial={{ opacity: 0, y: -20, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      dir="rtl"
      role="alert"
      aria-live="assertive"
    >
      <div className="rounded-3xl border border-coral/35 bg-ink-card p-4 shadow-2xl">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-coral/15 text-coral">
            <BellRing size={20} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black text-cream">{actionNotice.title}</p>
            <p className="mt-1 text-[11px] font-medium leading-relaxed text-cream/65">{actionNotice.body}</p>
          </div>
          <button
            type="button"
            onClick={dismissActionNotice}
            className="shrink-0 rounded-lg p-1 text-cream/40 hover:bg-white/5 hover:text-cream"
            aria-label="إغلاق الإشعار"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
