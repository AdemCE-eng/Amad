import React from 'react';
import { CircleDollarSign, Coins, CreditCard } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { cashbackState } from '../lib/cashback';
import SarAmount from '../components/ui/SarAmount';

const REWARD_TYPES = [
  { id: 'nxp', label: 'NXP', icon: Coins, style: 'violet', description: 'عملة نديم للإنجازات وإكسسوارات المرافق.' },
  { id: 'akthr', label: 'أكثر / Akthr', icon: CircleDollarSign, style: 'emerald', description: 'نقاط ولاء مرتبطة بالمكافآت والعروض.' },
  { id: 'cashback', label: 'كاش باك', icon: CreditCard, style: 'sky', description: 'مكافآت كاش باك من العروض المؤهلة.' },
];

const BALANCE_STYLES = {
  violet: 'bg-gradient-to-b from-violet/15 to-violet/5 border-violet/30 text-violet',
  emerald: 'bg-gradient-to-b from-emerald-400/15 to-emerald-400/5 border-emerald-400/30 text-emerald-300',
  sky: 'bg-gradient-to-b from-sky-400/15 to-sky-400/5 border-sky-400/30 text-sky-300',
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
    cashback: <SarAmount value={cashback.total} />,
  };
  const familyRewards = Object.values(family?.rewards || {}).sort((a, b) => (b.at || 0) - (a.at || 0));

  return (
    <div className="bg-ink h-full overflow-y-auto overflow-x-hidden font-sans pb-28 text-cream" dir="rtl">
      <div className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-black text-cream">المكافآت</h1>
        <p className="text-xs text-cream/50 font-bold mt-1">أرصدة وقيمة مكتسبة، منفصلة وواضحة</p>
      </div>

      <div className="px-4 space-y-5">
        <section aria-labelledby="reward-balances-title">
          <h2 id="reward-balances-title" className="sr-only">أرصدة المكافآت</h2>
          <div className="grid grid-cols-3 gap-2" data-testid="reward-balances">
            {REWARD_TYPES.map((type) => {
              const RewardIcon = type.icon;
              return (
                <article key={type.id} className={`border rounded-2xl p-2.5 text-center min-w-0 shadow-[0_12px_28px_-22px_rgba(0,0,0,0.9)] ${BALANCE_STYLES[type.style]}`}>
                  <span className="mx-auto grid h-7 w-7 place-items-center rounded-xl bg-white/5 border border-white/10" aria-hidden="true"><RewardIcon size={14} strokeWidth={2.2} /></span>
                  <p className="mt-1.5 min-h-6 text-[9px] font-black leading-tight break-words">{type.label}</p>
                  <p className="text-lg font-black leading-tight mt-0.5 break-words tabular-nums">{balances[type.id]}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-gradient-to-br from-ink-card to-ink-soft/65 border border-white/10 rounded-3xl p-4" aria-labelledby="reward-types-title">
          <h2 id="reward-types-title" className="font-black text-cream mb-3">ما الفرق بين المكافآت؟</h2>
          <div className="space-y-3">
            {REWARD_TYPES.map((type) => {
              const RewardIcon = type.icon;
              return (
                <div key={type.id} className={`flex items-center gap-3 rounded-2xl border p-3 ${BALANCE_STYLES[type.style]}`}>
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-black/10 shrink-0" aria-hidden="true"><RewardIcon size={18} strokeWidth={2.2} /></span>
                  <div className="min-w-0">
                    <p className="text-xs font-black text-cream">{type.label}</p>
                    <p className="text-[10px] text-cream/60 font-medium leading-relaxed">{type.description}</p>
                  </div>
                </div>
              );
            })}
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
            <span className="text-[10px] font-bold text-sky-300/90 whitespace-nowrap">💳 <SarAmount value={cashback.total} /></span>
          </div>
          <p className="text-[10px] font-bold text-cream/60 mb-3 px-1">مكافآت مرتبطة بالعروض المؤهلة</p>
          <div className="space-y-2">
            {[...cashback.earned.map((reward) => ({ ...reward, earned: true })), ...cashback.locked.map((reward) => ({ ...reward, earned: false }))].map((reward) => (
              <div key={reward.id} className={`rounded-2xl p-3 flex items-center gap-3 min-w-0 ${reward.earned ? 'bg-sky-400/10 border border-sky-400/25' : 'bg-ink-card/70'}`}>
                <span className="text-xl" aria-hidden="true">{reward.earned ? '💳' : '🔒'}</span>
                <p className={`flex-1 min-w-0 text-[12px] font-bold break-words ${reward.earned ? 'text-cream' : 'text-cream/70'}`}>{reward.title}</p>
                <SarAmount value={reward.amount} prefix="+" className={`text-[11px] font-black ${reward.earned ? 'text-sky-300' : 'text-cream/50'}`} />
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
