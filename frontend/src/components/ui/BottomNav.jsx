import React from 'react';
import { Home, Trophy } from 'lucide-react';

// Three-tab bottom nav. The center slot is the mascot's room — the app's
// emotional core gets the hero position.
export default function BottomNav({ activeView, setActiveView, petName }) {
  const tabs = [
    { id: 'home', label: 'الرئيسية', icon: <Home size={22} /> },
    { id: 'pet', label: `غرفة ${petName || 'المرافق'}`, icon: <span className="text-xl leading-none">🐤</span>, center: true },
    { id: 'rewards', label: 'المكافآت', icon: <Trophy size={22} /> },
  ];
  return (
    <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-100 flex justify-around items-stretch z-30 pb-1" dir="rtl">
      {tabs.map((t) => {
        const active = activeView === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setActiveView(t.id)}
            className={`flex flex-col items-center gap-0.5 py-2 px-4 transition-colors ${active ? 'text-alinma' : 'text-gray-400'}`}
          >
            <span className={`${t.center ? 'bg-alinma-light rounded-full p-2 -mt-4 border-4 border-white shadow' : ''} ${active && t.center ? 'ring-2 ring-alinma' : ''}`}>
              {t.icon}
            </span>
            <span className="text-[10px] font-bold">{t.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
