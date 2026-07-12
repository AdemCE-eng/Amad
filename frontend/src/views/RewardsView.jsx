import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { ACHIEVEMENTS, SHOP_ITEMS } from '../lib/catalog';
import { cashbackState, CASHBACK_SPONSOR_LABEL } from '../lib/cashback';
import StreakFlame from '../components/ui/StreakFlame';
import CoinPill from '../components/ui/CoinPill';
import ChallengeCard from '../components/ui/ChallengeCard';
import Mascot from '../components/mascot/Mascot';
import { api } from '../lib/api';

const MILESTONES = [3, 7, 14];

// المكافآت — streak hero, weekly challenge, achievements grid, and the
// accessory shop (cosmetics render instantly on the mascot). Dark ink theme.
export default function RewardsView() {
  const { user, game, akthrPoints, isSubmitting, runAction, restartOnboarding, restarting } = useAppData();
  if (!game) return null;
  const { streak, nxp_balance, achievements, activeChallenge, inventory, equipped } = game;
  const cashback = cashbackState(user, game);

  return (
    <div className="bg-ink h-full overflow-y-auto font-sans pb-24 text-cream" dir="rtl">
      <div className="px-5 pt-5 pb-3 flex justify-between items-center">
        <h1 className="text-2xl font-black text-cream">المكافآت</h1>
        <CoinPill coins={nxp_balance} />
      </div>

      <div className="px-4 space-y-5">
        {/* Three separate reward balances — never merged, three visual identities */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-amber-400/10 border border-amber-400/25 rounded-2xl p-2.5 text-center">
            <p className="text-[10px] font-bold text-amber-200">🪙 NXP</p>
            <p className="text-lg font-black text-amber-300 leading-tight">{nxp_balance}</p>
          </div>
          <div className="bg-emerald-400/10 border border-emerald-400/25 rounded-2xl p-2.5 text-center">
            <p className="text-[10px] font-bold text-emerald-200">🟢 أكثر</p>
            <p className="text-lg font-black text-emerald-300 leading-tight">{akthrPoints}</p>
          </div>
          <div className="bg-sky-400/10 border border-sky-400/25 rounded-2xl p-2.5 text-center">
            <p className="text-[10px] font-bold text-sky-200">💳 كاش باك</p>
            <p className="text-lg font-black text-sky-300 leading-tight">{cashback.total} <span className="text-[10px]">ر.س</span></p>
          </div>
        </div>
        {/* Streak hero */}
        <div className="bg-ink-card rounded-3xl p-5 text-center">
          <StreakFlame streak={streak} size="lg" />
          <p className="text-xs text-cream/50 mt-3 font-medium">
            {streak.status === 'frozen'
              ? 'درع الحماية حفظ سلسلتك اليوم — الغلطة تعدي ❄️'
              : 'أيام متتالية داخل الميزانية — كل يوم +10 🪙'}
          </p>
          {/* milestone track */}
          <div className="flex items-center justify-between mt-5 px-2">
            {MILESTONES.map((m, i) => (
              <React.Fragment key={m}>
                {i > 0 && <div className={`flex-1 h-1 rounded mx-1 ${streak.current >= m ? 'bg-orange-400' : 'bg-white/10'}`} />}
                <div className={`flex flex-col items-center gap-1 ${streak.current >= m ? '' : 'opacity-40'}`}>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${streak.current >= m ? 'bg-orange-400/20 text-orange-300' : 'bg-white/5 text-cream/60'}`}>
                    {m}
                  </span>
                  <span className="text-[9px] font-bold text-cream/50">+{{ 3: 30, 7: 70, 14: 150 }[m]} 🪙</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-[10px] text-cream/60 mt-3">أفضل سلسلة: {streak.best} يوم · دروع الحماية: {streak.freezesLeft} ❄️</p>
        </div>

        {/* Weekly challenge */}
        <ChallengeCard challenge={activeChallenge} />

        {/* Achievements */}
        <div>
          <h3 className="font-black text-cream mb-3 px-1">الإنجازات</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(ACHIEVEMENTS).map(([key, a]) => {
              const unlocked = Boolean(achievements[key]);
              return (
                <div
                  key={key}
                  className={`rounded-3xl p-3 text-center ${unlocked ? 'bg-ink-card border border-amber-400/25' : 'bg-ink-card/70 opacity-80 grayscale'}`}
                >
                  <span className="text-3xl block">{unlocked ? a.icon : '🔒'}</span>
                  <p className="text-[10px] font-black text-cream mt-1 leading-tight">{a.title}</p>
                  {/* reward type explicit on the card — this achievement pays NXP */}
                  <p className="text-[9px] font-bold text-amber-300 mt-0.5">+{a.coins} NXP 🪙</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Cashback — third reward type, real-value DEMO rewards. Separate
            visual identity (sky); never merged with NXP or Akthr. */}
        <div>
          <div className="flex items-center justify-between mb-1 px-1">
            <h3 className="font-black text-cream">كاش باك</h3>
            <span className="text-[10px] font-bold text-sky-300/90">💳 {cashback.total} ر.س</span>
          </div>
          <p className="text-[10px] font-bold text-cream/60 mb-3 px-1">{CASHBACK_SPONSOR_LABEL}</p>
          <div className="space-y-2">
            {[...cashback.earned.map((r) => ({ ...r, ok: true })), ...cashback.locked.map((r) => ({ ...r, ok: false }))].map((r) => (
              <div key={r.id} className={`rounded-2xl p-3 flex items-center gap-3 ${r.ok ? 'bg-sky-400/10 border border-sky-400/25' : 'bg-ink-card/70'}`}>
                <span className="text-xl">{r.ok ? '💳' : '🔒'}</span>
                <p className={`flex-1 text-[12px] font-bold ${r.ok ? 'text-cream' : 'text-cream/70'}`}>{r.title}</p>
                <span className={`text-[12px] font-black ${r.ok ? 'text-sky-300' : 'text-cream/50'}`}>+{r.amount} ر.س كاش باك</span>
              </div>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-black text-cream mb-3 px-1">متجر الإكسسوارات</h3>
          <div className="space-y-3">
            {Object.entries(SHOP_ITEMS).map(([id, item]) => {
              const owned = Boolean(inventory[id]);
              const isEquipped = equipped === id;
              const affordable = nxp_balance >= item.price;
              return (
                <div key={id} className="bg-ink-card rounded-3xl p-3 flex items-center gap-3">
                  <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center overflow-hidden">
                    <Mascot emotion="idle" stage={1} size={58} track={false} equipped={id} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-cream text-sm">{item.icon} {item.name}</p>
                    <p className="text-[11px] font-bold text-amber-300 mt-0.5">{item.price} 🪙</p>
                  </div>
                  {owned ? (
                    <button
                      disabled={isSubmitting}
                      onClick={() => runAction(() => api.equipItem(isEquipped ? null : id))}
                      className={`px-4 py-2 rounded-xl text-xs font-black border ${isEquipped ? 'bg-coral text-ink border-coral' : 'bg-transparent text-coral border-coral/50'}`}
                    >
                      {isEquipped ? 'يلبسه ✓' : 'ألبسه'}
                    </button>
                  ) : (
                    <button
                      disabled={isSubmitting || !affordable}
                      onClick={() => runAction(() => api.buyItem(id))}
                      className={`px-4 py-2 rounded-xl text-xs font-black ${affordable ? 'bg-coin text-ink shadow' : 'bg-white/5 text-cream/30'}`}
                    >
                      {affordable ? 'اشتره' : 'وفّر له'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger zone — full restart: wipes health/streak/coins AND
            re-runs onboarding (pick companion, name, goal). For switching
            between demo audiences/judges. */}
        <div className="pt-2">
          <button
            disabled={restarting}
            onClick={() => {
              if (window.confirm('هذا سيعيد كل شيء من الصفر (الصحة، السلسلة، العملات) ويرجعك لاختيار المرافق والهدف من جديد. متأكد؟')) {
                restartOnboarding();
              }
            }}
            className="w-full py-3 rounded-3xl font-bold text-sm border border-red-400/30 text-red-400 bg-red-400/10 disabled:opacity-50 active:scale-95 transition-transform"
          >
            {restarting ? '...جارٍ إعادة البدء' : '🔄 البدء من جديد (اختيار مرافق وهدف)'}
          </button>
        </div>
      </div>
    </div>
  );
}
