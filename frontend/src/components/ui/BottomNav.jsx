import React, { useEffect, useState } from 'react';
import { Home, Trophy, Users, TrendingUp } from 'lucide-react';
import Mascot from '../mascot/Mascot';
import { useMascotEmotion } from '../mascot/useMascotEmotion';

// Final five-destination Nadeem navigation. صقر remains the emphasized center
// destination and stays locked until the savings plan is activated.
const TIP_KEY = 'nadeem_tip_dismissed';

export default function BottomNav({ activeView, setActiveView, petName, pet, game, petLocked = false }) {
  const { emotion } = useMascotEmotion(pet);
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
    { id: 'family', label: 'العائلة', icon: <Users size={21} strokeWidth={1.8} /> },
    { id: 'pet', label: petName || 'صقر', icon: <Mascot emotion={emotion} stage={game?.stage ?? 0} equipped={game?.equipped ?? null} size={40} track={false} />, center: true },
    { id: 'opportunities', label: 'فرص التوفير', icon: <TrendingUp size={21} strokeWidth={1.8} /> },
    { id: 'rewards', label: 'المكافآت', icon: <Trophy size={21} strokeWidth={1.8} /> },
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
        const disabled = locked;
        const active = activeView === t.id;
        return (
          <button
            key={t.id}
            onClick={() => !disabled && setActiveView(t.id)}
            aria-label={t.label}
            className={`relative min-w-0 flex-1 flex flex-col items-center gap-1 py-2.5 px-1 transition-colors ${
              active ? 'text-coral' : disabled ? 'text-cream/30' : 'text-cream/60'
            }`}
          >
            <span className={t.center ? `relative w-12 h-12 -mt-1 rounded-2xl grid place-items-center overflow-hidden border transition-colors ${
              active
                ? 'bg-coral/20 border-coral/60 shadow-[0_0_18px_rgba(255,126,91,0.18)]'
                : disabled
                  ? 'bg-white/[0.03] border-white/5 opacity-45'
                  : 'bg-white/[0.07] border-white/10 opacity-80'
            }` : ''}>
              {t.icon}
              {t.center && locked && (
                <span className="absolute -top-2 -right-2 bg-white/15 text-cream/70 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">🔒</span>
              )}
            </span>
            <span className={`text-[9px] sm:text-[10px] whitespace-nowrap ${active ? 'font-black' : 'font-bold'}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
