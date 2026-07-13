import React, { useEffect, useState } from 'react';
import { Home, Trophy, ArrowLeftRight, Grid } from 'lucide-react';

// Five-tab dark nav mirroring the real Alinma app; صقر sits in the
// AutoFlow slot with the "جديد" treatment (violet bubble + badge).
// التحويل / الخدمات are decorative — they exist so the bar reads like the
// real bank app, not a 3-screen demo. The pet tab is LOCKED until the savings
// account is activated (petLocked) — the companion only appears after that.
const TIP_KEY = 'namo_tip_dismissed';

export default function BottomNav({ activeView, setActiveView, petName, petLocked = false }) {
  // "جديد · جرّب صقر" bubble: shows once per device, auto-dismisses after
  // 3s, manually dismissible, never inside the Pet Room, never while locked.
  const [tipVisible, setTipVisible] = useState(() => localStorage.getItem(TIP_KEY) !== '1');
  useEffect(() => {
    if (!tipVisible) return;
    const t = setTimeout(() => dismissTip(), 3000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const dismissTip = () => {
    localStorage.setItem(TIP_KEY, '1');
    setTipVisible(false);
  };
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: <Home size={21} strokeWidth={1.8} /> },
    { id: '_transfer', label: 'التحويل', icon: <ArrowLeftRight size={21} strokeWidth={1.8} />, dead: true },
    { id: 'pet', label: petName || 'صقر', icon: <span className="text-xl leading-none">🐤</span>, center: true },
    { id: 'rewards', label: 'المكافآت', icon: <Trophy size={21} strokeWidth={1.8} /> },
    { id: '_services', label: 'الخدمات', icon: <Grid size={21} strokeWidth={1.8} />, dead: true },
  ];
  return (
    <nav className="absolute bottom-0 inset-x-0 bg-ink border-t border-white/5 flex justify-around items-stretch z-30 pb-1" dir="rtl">
      {/* "new feature" bubble above the center tab — once per device, and only
          once the pet is actually unlocked */}
      {tipVisible && activeView !== 'pet' && !petLocked && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-violet text-white text-[11px] font-black pr-3.5 pl-2 py-1.5 rounded-full whitespace-nowrap shadow-lg flex items-center gap-1.5">
          جديد · جرّب {petName || 'صقر'}
          <button onClick={dismissTip} className="text-white/70 hover:text-white leading-none text-[13px]" aria-label="إغلاق">×</button>
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-violet rotate-45"></span>
        </div>
      )}
      {tabs.map((t) => {
        const locked = t.center && petLocked;
        const disabled = t.dead || locked;
        const active = activeView === t.id;
        return (
          <button
            key={t.id}
            onClick={() => !disabled && setActiveView(t.id)}
            className={`relative flex flex-col items-center gap-1 py-2.5 px-3 transition-colors ${
              active ? 'text-coral' : disabled ? 'text-cream/30' : 'text-cream/60'
            }`}
          >
            <span className={t.center ? 'relative bg-white/10 rounded-2xl px-2.5 py-1' : ''}>
              {t.icon}
              {t.center && !locked && (
                <span className="absolute -top-2 -right-3 bg-coral-deep text-white text-[8px] font-black px-1.5 py-0.5 rounded-full">جديد</span>
              )}
              {t.center && locked && (
                <span className="absolute -top-2 -right-2 bg-white/15 text-cream/70 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">🔒</span>
              )}
            </span>
            <span className={`text-[10px] ${active ? 'font-black' : 'font-bold'}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
