import React, { useState } from 'react';
import { ChevronRight, Sparkles, Trophy, ChevronDown, TrendingUp, Hourglass, CheckCircle2 } from 'lucide-react';
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
    family, contributionPlan, offers, activeRole,
    nxp, akthrPoints,
    setActiveView, runAction, isSubmitting, actionError,
  } = useAppData();
  const [openDetails, setOpenDetails] = useState(false);
  const [rewardMsg, setRewardMsg] = useState(null);

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

  // Predicted offers, hero (highest probability) first. Deterministic MOCK
  // predictions — never presented as guaranteed.
  const predictedList = Object.values(offers?.predicted || {}).sort((a, b) => b.probability - a.probability);
  const rewards = family.rewards || {};

  // Parent reward — demo flow: أحمد rewards راشد with Akthr points.
  // eventId is fixed per demo run (reset wipes /family/rewards, so each run
  // can reuse it); a duplicate within one run surfaces as "already sent".
  const rewardChild = async (memberId) => {
    setRewardMsg(null);
    try {
      await api.sendReward({
        eventId: 'reward_demo_001',
        senderId: activeRole,
        recipientId: memberId,
        rewardType: 'akthr',
        amount: 25,
        message: 'تستاهل يا بطل، استمريت داخل ميزانيتك 7 أيام.',
      });
      setRewardMsg('تم إرسال مكافأة أكثر 🎁');
    } catch (e) {
      setRewardMsg(e.message === 'duplicate_reward' ? 'تمت المكافأة مسبقاً ✓' : 'تعذر إرسال المكافأة');
    }
    setTimeout(() => setRewardMsg(null), 2500);
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

        {/* Predicted saving opportunities — MOCK, deterministic, probabilistic
            wording only (never "guaranteed"). راشد decides to wait; the
            presenter settles from the demo controller. */}
        {predictedList.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 px-1">
              <TrendingUp size={16} className="text-coral" />
              <h3 className="font-black text-cream text-sm">فرص توفير متوقعة</h3>
            </div>
            <div className="space-y-2">
              {predictedList.map((o) => (
                <div key={o.id} className={`rounded-3xl p-4 ${o.status === 'settled' ? 'bg-emerald-400/10 border border-emerald-400/25' : 'bg-ink-card'}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-black text-cream text-sm">{o.merchant} — {o.occasion}</p>
                      <p className="text-[11px] text-cream/50 font-bold mt-0.5">{o.basis}</p>
                    </div>
                    <span className="bg-coral/15 text-coral text-[11px] font-black px-2.5 py-1 rounded-full flex-shrink-0">
                      احتمال {o.probability}٪
                    </span>
                  </div>
                  <div className="flex gap-3 mt-3 text-[11px] font-bold text-cream/60">
                    <span>⏳ نافذة {o.windowDays} أيام</span>
                    <span>💰 توفير محتمل {o.potentialSaving} ر.س</span>
                  </div>
                  <div className="mt-3">
                    {o.status === 'pending' && activeRole === 'rashid' && (
                      <button
                        disabled={isSubmitting}
                        onClick={() => runAction(() => api.decideOffer(o.id, 'wait'))}
                        className="w-full bg-coral text-ink font-black text-sm py-2.5 rounded-2xl active:scale-95 transition-transform disabled:opacity-50"
                      >
                        أنتظر العرض المتوقع
                      </button>
                    )}
                    {o.status === 'pending' && activeRole !== 'rashid' && (
                      <p className="text-[11px] text-cream/40 font-bold text-center">بانتظار قرار راشد</p>
                    )}
                    {o.status === 'waiting' && (
                      <p className="flex items-center justify-center gap-1.5 text-[12px] text-amber-300 font-bold bg-amber-400/10 border border-amber-400/20 rounded-2xl py-2.5">
                        <Hourglass size={13} /> قرر راشد الانتظار — بانتظار وصول العرض
                      </p>
                    )}
                    {o.status === 'settled' && (
                      <p className="flex items-center justify-center gap-1.5 text-[12px] text-emerald-300 font-black bg-emerald-400/10 rounded-2xl py-2.5">
                        <CheckCircle2 size={14} /> وصل العرض — تحوّل {o.potentialSaving} ر.س لهدف العائلة
                      </p>
                    )}
                    {o.status === 'ignored' && (
                      <p className="text-[11px] text-cream/40 font-bold text-center">تم تجاهل العرض</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                {/* Parent reward — only a parent role sees it, on child rows */}
                {activeRole === 'ahmed' && m.role === 'child' && (
                  rewards.reward_demo_001 ? (
                    <span className="text-[11px] font-black text-emerald-300 flex-shrink-0">تمت ✓</span>
                  ) : (
                    <button
                      disabled={isSubmitting}
                      onClick={() => rewardChild(m.id)}
                      className="bg-coral-tile text-ink text-[11px] font-black px-3 py-1.5 rounded-xl active:scale-95 transition-transform flex-shrink-0 whitespace-nowrap disabled:opacity-50"
                    >
                      كافئه بأكثر 🎁
                    </button>
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reward toast — absolute so it stays inside the phone frame */}
      {rewardMsg && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-ink-card border border-emerald-400/30 text-cream text-sm font-bold px-5 py-3 rounded-2xl shadow-2xl z-50 whitespace-nowrap">
          {rewardMsg}
        </div>
      )}
    </div>
  );
}
