import React, { useState } from 'react';
import { ChevronRight, Sparkles, Trophy } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const PET_EMOJI = { falcon: '🦅', cat: '🐱', camel: '🐫' };
const GIFT_REWARD_NXP = 50;

// Family Shared Savings Goal — a household saving toward a trip together.
// Dedicated tab (not a Home widget) so there's room for the progress ring,
// the AI insight card, and the contribution leaderboard. The local user is
// always the family_goal member with is_owner: true, so they're the only
// one who can send reward gifts — never public shaming for low contributors.
export default function FamilyGoalView() {
  const { familyGoal, setActiveView } = useAppData();
  const [toast, setToast] = useState(null);

  if (!familyGoal) return null;

  const { title, target_amount, current_amount, ai_insight, members } = familyGoal;
  const pct = target_amount > 0 ? Math.min(100, Math.round((current_amount / target_amount) * 100)) : 0;
  const sorted = [...members].sort((a, b) => b.contribution - a.contribution);

  const R = 62;
  const CIRC = 2 * Math.PI * R;
  const dash = (pct / 100) * CIRC;

  // Purely a frontend simulation — no backend call, per the gamified-reward
  // framing (no real transfer happens on the mock demo rail).
  const sendReward = (member) => {
    setToast(`تم إرسال هدية بقيمة ${GIFT_REWARD_NXP} NXP بنجاح! 🎁`);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="bg-ink h-full overflow-y-auto font-sans text-cream" dir="rtl">
      {/* Header — same back-arrow pattern as PetRoomView */}
      <div className="p-4 flex items-center justify-between z-20">
        <button onClick={() => setActiveView('home')} className="bg-white/10 backdrop-blur p-2 rounded-full text-cream hover:bg-white/20 transition-all">
          <ChevronRight size={24} />
        </button>
        <h1 className="font-black text-cream text-lg tracking-wide">الهدف العائلي</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-5 pb-28 space-y-5">
        {/* AI insight card — rendered at the top, dynamic from family_goal.ai_insight.
            Violet is the team's reserved "new feature" accent. */}
        <div className="bg-violet/15 border border-violet/30 rounded-3xl p-4 flex gap-3">
          <div className="bg-violet/20 text-violet p-2.5 rounded-2xl h-fit flex-shrink-0">
            <Sparkles size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-black text-violet mb-1">اقتراح Namo AI</p>
            <p className="text-xs text-cream/80 font-medium leading-relaxed">
              {ai_insight || 'لم يتم توليد خطة الذكاء الاصطناعي بعد — جرّب "توليد خطة الذكاء الاصطناعي" من لوحة التحكم.'}
            </p>
          </div>
        </div>

        {/* Progress ring */}
        <div className="bg-ink-card rounded-3xl p-5 flex flex-col items-center">
          <p className="text-sm font-bold text-cream/60 mb-3">{title}</p>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
              <circle
                cx="70" cy="70" r={R} fill="none" stroke="#F0846A" strokeWidth="12"
                strokeDasharray={`${dash} ${CIRC - dash}`} strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-cream">{pct}%</span>
              <span className="text-[11px] text-cream/50 font-bold mt-1">{current_amount} / {target_amount} ر.س</span>
            </div>
          </div>
        </div>

        {/* Leaderboard — sorted by contribution, no shaming for low ones */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Trophy size={16} className="text-coral" />
            <h3 className="font-black text-cream text-sm">لوحة المساهمين</h3>
          </div>
          <div className="space-y-2">
            {sorted.map((m, i) => (
              <div key={m.id} className="bg-ink-card rounded-2xl p-3 flex items-center gap-3">
                <span className="w-5 text-center font-black text-cream/40 text-sm">{i + 1}</span>
                <span className="text-2xl">{PET_EMOJI[m.pet] || '🐾'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-cream truncate">{m.name}</p>
                  <p className="text-[11px] text-cream/50 font-bold">{m.contribution} ر.س</p>
                </div>
                {!m.is_owner && (
                  <button
                    onClick={() => sendReward(m)}
                    className="bg-coral-tile text-ink text-[11px] font-black px-3 py-1.5 rounded-xl active:scale-95 transition-transform flex-shrink-0 whitespace-nowrap"
                  >
                    إرسال مكافأة 🎁
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gift toast — absolute (not fixed) so it stays within the phone frame */}
      {toast && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-ink-card border border-emerald-400/30 text-cream text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl z-50 whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}
