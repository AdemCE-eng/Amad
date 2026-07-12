import React from 'react';
import { useAppData } from '../../context/AppDataContext';

// Demo-only role switch — NOT authentication and NOT a permissions system.
// Lets the operator present the app as either the child (راشد) or a parent
// (أحمد) during the demo. Persisted in localStorage via context.
const ROLES = [
  { id: 'rashid', label: 'راشد' },
  { id: 'ahmed', label: 'أحمد' },
];

export default function RoleSwitch() {
  const { activeRole, setActiveRole } = useAppData();
  return (
    <div className="bg-ink-card rounded-2xl p-3 flex items-center gap-3" dir="rtl">
      <span className="text-[11px] font-black text-cream/50 flex-shrink-0">وضع العرض</span>
      <div className="flex gap-1 bg-white/5 rounded-xl p-1 flex-1">
        {ROLES.map((r) => {
          const active = activeRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRole(r.id)}
              className={`flex-1 text-xs font-black py-1.5 rounded-lg transition-colors ${
                active ? 'bg-coral text-ink' : 'text-cream/60'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
