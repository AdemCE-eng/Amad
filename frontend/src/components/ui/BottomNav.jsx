import React from 'react';
import { Home, Trophy } from 'lucide-react';

// Three-tab bottom nav, styled like the real Alinma app: cream bar, navy
// line icons, active tab bold. Center slot is the mascot's room.
export default function BottomNav({ activeView, setActiveView, petName }) {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: <Home size={22} strokeWidth={1.8} /> },
    { id: 'pet', label: `غرفة ${petName || 'المرافق'}`, icon: <span className="text-xl leading-none">🐤</span>, center: true },
    { id: 'rewards', label: 'المكافآت', icon: <Trophy size={22} strokeWidth={1.8} /> },
  ];
  return (
    <nav className="absolute bottom-0 inset-x-0 bg-alinma-light border-t border-black/5 flex justify-around items-stretch z-30 pb-1" dir="rtl">
      {tabs.map((t) => {
        const active = activeView === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveView(t.id)}
            className={`flex flex-col items-center gap-0.5 py-2 px-4 transition-colors ${active ? 'text-alinma' : 'text-gray-400'}`}
          >
            <span className={`${t.center ? 'bg-white rounded-full p-2 -mt-4 border-4 border-alinma-light shadow-sm' : ''} ${active && t.center ? 'ring-2 ring-coral' : ''}`}>
              {t.icon}
            </span>
            <span className={`text-[10px] ${active ? 'font-black' : 'font-bold'}`}>{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
