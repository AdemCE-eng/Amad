import React, { useState } from 'react';
import { ChevronRight, Sparkles, Trophy, ChevronDown } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import RoleSwitch from '../components/ui/RoleSwitch';

// Privacy-safe explanation shown for members OTHER than the active role — the
// backend's raw explanation (income, expenses, buffers) is never rendered for
// anyone but yourself.
const PRIVACY_EXPLANATION =
  'تم احتساب المساهمة حسب القدرة الادخارية والالتزامات، مع الحفاظ على احتياطي الأمان.';

const RING_R = 62;
const RING_CIRC = 2 * Math.PI * RING_R;

// نامو — Family Shared Savings Goal. All values come from the canonical
// Phase 1 backend (/family + /contributionPlan). Nothing about the split is
// hardcoded; the Explainable Saving Capacity Engine produces every amount.
export default function FamilyGoalView() {
  const {
    family, contributionPlan, activeRole,
    nxp, akthrPoints,
    setActiveView, runAction, isSubmitting, actionError,
  } = useAppData();
  const [openDetails, setOpenDetails] = useState(false);

  // Loading state — watchers haven't delivered /family yet.
  if (!family) {
    return (
      <div className="bg-ink h-full flex items-center justify-center text-cream/60 font-sans" dir="rtl">
        <p className="animate-pulse">جاري تحميل الهدف العائلي…</p>
      </div>
    );
  }

  const { goalTitle, goalAmount, savedAmount, members } = family;
  const pct = goalAmount > 0 ? Math.min(100, Math.round((savedAmount / goalAmount) * 100)) : 0;
  const dash = (pct / 100) * RING_CIRC;

  // members is an object keyed by id → array sorted by contribution (no shaming).
  const memberList = Object.entries(members || {}).map(([id, m]) => ({ id, ...m }));
  const sorted = [...memberList].sort((a, b) => b.contributed - a.contributed);

  const allocations = contributionPlan?.allocations || null;
  const hasPlan = Boolean(allocations);

  const generate = () => runAction(() => api.generatePlan());

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
        {/* Demo-only role switch */}
        <RoleSwitch />

        {/* Two separate currencies, visually distinct: NXP (game) vs Akthr (loyalty) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-amber-400/10 border border-amber-400/25 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-xl">🪙</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-amber-300/80">نقاط NXP</p>
              <p className="text-lg font-black text-amber-300 leading-none">{nxp}</p>
            </div>
          </div>
          <div className="bg-emerald-400/10 border border-emerald-400/25 rounded-2xl p-3 flex items-center gap-2">
            <span className="text-xl">🟢</span>
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-emerald-300/80">نقاط أكثر</p>
              <p className="text-lg font-black text-emerald-300 leading-none">{akthrPoints}</p>
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <div className="bg-ink-card rounded-3xl p-5 flex flex-col items-center">
          <p className="text-sm font-bold text-cream/60 mb-3">{goalTitle}</p>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
              <circle cx="70" cy="70" r={RING_R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
              <circle
                cx="70" cy="70" r={RING_R} fill="none" stroke="#F0846A" strokeWidth="12"
                strokeDasharray={`${dash} ${RING_CIRC - dash}`} strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-cream">{pct}%</span>
              <span className="text-[11px] text-cream/50 font-bold mt-1">{savedAmount} / {goalAmount} ر.س</span>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {actionError && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-300 rounded-2xl p-3 text-sm font-bold text-center">
            {actionError}
          </div>
        )}

        {/* Explainable contribution plan */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Sparkles size={16} className="text-violet" />
            <h3 className="font-black text-cream text-sm">خطة نامو الذكية</h3>
          </div>

          {!hasPlan ? (
            <div className="bg-violet/15 border border-violet/30 rounded-3xl p-4 text-center">
              <p className="text-xs text-cream/80 font-medium leading-relaxed mb-3">
                ولّد خطة مساهمة عادلة لكل فرد حسب قدرته الادخارية.
              </p>
              <button
                onClick={generate}
                disabled={isSubmitting}
                className="bg-violet text-white font-black text-sm px-5 py-2.5 rounded-2xl active:scale-95 transition-transform disabled:opacity-50"
              >
                {isSubmitting ? '…جاري التوليد' : '✨ ولّد الخطة'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="bg-violet/10 border border-violet/25 rounded-2xl px-4 py-2.5 flex justify-between items-center">
                <span className="text-[11px] font-bold text-cream/70">المطلوب شهرياً للعائلة</span>
                <span className="text-sm font-black text-violet">{contributionPlan.monthlyRequired} ر.س</span>
              </div>
              {sorted.map((m) => {
                const alloc = allocations[m.id];
                if (!alloc) return null;
                const isSelf = m.id === activeRole;
                return (
                  <div key={m.id} className="bg-ink-card rounded-2xl p-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{m.role === 'child' ? '🧒' : '🧑'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-cream truncate">
                          {m.name}{isSelf && <span className="text-[10px] text-coral font-black mr-1">(أنت)</span>}
                        </p>
                        <p className="text-[11px] text-cream/50 font-bold">{alloc.sharePct}% من قدرة العائلة</p>
                      </div>
                      <span className="text-sm font-black text-coral flex-shrink-0">{alloc.amount} ر.س</span>
                    </div>

                    {isSelf ? (
                      // Only YOUR own detailed explanation, collapsible.
                      <div className="mt-2">
                        <button
                          onClick={() => setOpenDetails((v) => !v)}
                          className="flex items-center gap-1 text-[11px] font-bold text-cream/60 hover:text-cream"
                        >
                          <ChevronDown size={13} className={openDetails ? 'rotate-180 transition-transform' : 'transition-transform'} />
                          تفاصيل حسابي
                        </button>
                        {openDetails && (
                          <p className="mt-2 text-[11px] text-cream/70 leading-relaxed bg-white/5 rounded-xl p-3">
                            {alloc.explanation}
                          </p>
                        )}
                      </div>
                    ) : (
                      // Privacy-safe: never expose another member's raw figures.
                      <p className="mt-2 text-[11px] text-cream/40 leading-relaxed">{PRIVACY_EXPLANATION}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Leaderboard — sorted by contribution, no shaming */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Trophy size={16} className="text-coral" />
            <h3 className="font-black text-cream text-sm">لوحة المساهمين</h3>
          </div>
          <div className="space-y-2">
            {sorted.map((m, i) => (
              <div key={m.id} className="bg-ink-card rounded-2xl p-3 flex items-center gap-3">
                <span className="w-5 text-center font-black text-cream/40 text-sm">{i + 1}</span>
                <span className="text-2xl">{m.role === 'child' ? '🧒' : '🧑'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-cream truncate">
                    {m.name}{m.id === activeRole && <span className="text-[10px] text-coral font-black mr-1">(أنت)</span>}
                  </p>
                  <p className="text-[11px] text-cream/50 font-bold">{m.relation}</p>
                </div>
                <span className="text-sm font-black text-cream/80 flex-shrink-0">{m.contributed} ر.س</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
