import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { cashbackState } from '../lib/cashback';

const REWARD_TYPES = [
  { id: 'nxp', label: 'NXP', icon: '🪙', style: 'violet', description: 'عملة نامو للإنجازات وإكسسوارات صقر.' },
  { id: 'akthr', label: 'أكثر / Akthr', icon: '🟢', style: 'emerald', description: 'نقاط ولاء مرتبطة بالمكافآت والعروض.' },
  { id: 'cashback', label: 'كاش باك', icon: '💳', style: 'sky', description: 'مكافآت كاش باك من العروض المؤهلة.' },
];

const BALANCE_STYLES = {
  violet: 'bg-violet/10 border-violet/25 text-violet',
  emerald: 'bg-emerald-400/10 border-emerald-400/25 text-emerald-300',
  sky: 'bg-sky-400/10 border-sky-400/25 text-sky-300',
};

// المكافآت is the value ledger: three distinct balances, their meaning,
// family reward activity, and campaign-funded cashback milestones.
export default function RewardsView() {
  const {
    user, game, family, akthrPoints,
    restartDemo, restarting,
  } = useAppData();
  if (!game) return null;

  const cashback = cashbackState(user, game);
  const balances = {
    nxp: String(game.nxp_balance ?? 0),
    akthr: String(akthrPoints),
    cashback: `${cashback.total} ر.س`,
  };
  const familyRewards = Object.values(family?.rewards || {}).sort((a, b) => (b.at || 0) - (a.at || 0));

  return (
    <div className="bg-ink h-full overflow-y-auto overflow-x-hidden font-sans pb-28 text-cream" dir="rtl">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-black text-cream">المكافآت</h1>
        <p className="text-xs text-cream/50 font-bold mt-1">أرصدة وقيمة مكتسبة — منفصلة وواضحة</p>
      </div>

      <div className="px-4 space-y-5">
        <section aria-labelledby="reward-balances-title">
          <h2 id="reward-balances-title" className="sr-only">أرصدة المكافآت</h2>
          <div className="grid grid-cols-3 gap-2" data-testid="reward-balances">
            {REWARD_TYPES.map((type) => (
              <div key={type.id} className={`border rounded-2xl p-2.5 text-center min-w-0 ${BALANCE_STYLES[type.style]}`}>
                <p className="text-[10px] font-bold leading-tight break-words">{type.icon} {type.label}</p>
                <p className="text-lg font-black leading-tight mt-1 break-words">{balances[type.id]}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-ink-card rounded-3xl p-4" aria-labelledby="reward-types-title">
          <h2 id="reward-types-title" className="font-black text-cream mb-3">ما الفرق بين المكافآت؟</h2>
          <div className="space-y-3">
            {REWARD_TYPES.map((type) => (
              <div key={type.id} className="flex items-start gap-3">
                <span className="text-lg" aria-hidden="true">{type.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-black text-cream">{type.label}</p>
                  <p className="text-[11px] text-cream/60 font-medium leading-relaxed">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="family-rewards-title" data-testid="family-reward-activity">
          <div className="flex items-center justify-between gap-3 mb-3 px-1">
            <h2 id="family-rewards-title" className="font-black text-cream">مكافآت العائلة</h2>
            <span className="text-[9px] font-black text-emerald-300 border border-emerald-400/25 rounded-full px-2 py-1">نقاط أكثر</span>
          </div>
          {familyRewards.length > 0 ? (
            <div className="space-y-2">
              {familyRewards.map((reward) => (
                <article key={reward.id} className="bg-emerald-400/10 border border-emerald-400/25 rounded-2xl p-3 flex items-center gap-3 min-w-0">
                  <span className="text-xl" aria-hidden="true">🎖️</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-cream break-words">مكافأة عائلية إلى {reward.recipientName || 'راشد'}</p>
                    {reward.message && <p className="text-[10px] text-cream/60 font-medium mt-1 break-words">{reward.message}</p>}
                  </div>
                  <span className="text-xs font-black text-emerald-300 whitespace-nowrap">+{reward.amount} أكثر</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="bg-ink-card rounded-2xl p-4 text-center text-xs font-bold text-cream/55">
              لا توجد مكافأة عائلية مستلمة بعد.
            </div>
          )}
        </section>

        <section aria-labelledby="cashback-title" data-testid="cashback-milestones">
          <div className="flex items-center justify-between gap-3 mb-1 px-1">
            <h2 id="cashback-title" className="font-black text-cream">مكافآت الكاش باك</h2>
            <span className="text-[10px] font-bold text-sky-300/90 whitespace-nowrap">💳 {cashback.total} ر.س</span>
          </div>
          <p className="text-[10px] font-bold text-cream/60 mb-3 px-1">مكافآت مرتبطة بالعروض المؤهلة</p>
          <div className="space-y-2">
            {[...cashback.earned.map((reward) => ({ ...reward, earned: true })), ...cashback.locked.map((reward) => ({ ...reward, earned: false }))].map((reward) => (
              <div key={reward.id} className={`rounded-2xl p-3 flex items-center gap-3 min-w-0 ${reward.earned ? 'bg-sky-400/10 border border-sky-400/25' : 'bg-ink-card/70'}`}>
                <span className="text-xl" aria-hidden="true">{reward.earned ? '💳' : '🔒'}</span>
                <p className={`flex-1 min-w-0 text-[12px] font-bold break-words ${reward.earned ? 'text-cream' : 'text-cream/70'}`}>{reward.title}</p>
                <span className={`text-[11px] font-black whitespace-nowrap ${reward.earned ? 'text-sky-300' : 'text-cream/50'}`}>+{reward.amount} ر.س</span>
              </div>
            ))}
          </div>
        </section>

        {/* Existing full-demo recovery remains available without changing its behavior. */}
        <div className="pt-2">
          <button
            disabled={restarting}
            onClick={() => {
              if (window.confirm('هذا سيعيد كل شيء من الصفر (الصحة، السلسلة، العملات) ويرجعك لاختيار المرافق والهدف من جديد. متأكد؟')) {
                restartDemo();
              }
            }}
            className="w-full py-3 rounded-3xl font-bold text-sm border border-red-400/30 text-red-400 bg-red-400/10 disabled:opacity-50 active:scale-95 transition-transform"
          >
            {restarting ? '...جارٍ إعادة البدء' : '🔄 إعادة العرض من البداية'}
          </button>
        </div>
      </div>
    </div>
  );
}
