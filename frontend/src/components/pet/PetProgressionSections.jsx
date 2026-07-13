import React from 'react';
import { ACHIEVEMENTS, SHOP_ITEMS } from '../../lib/catalog';
import { api } from '../../lib/api';
import Mascot from '../mascot/Mascot';
import ChallengeCard from '../ui/ChallengeCard';
import StreakFlame from '../ui/StreakFlame';

const MILESTONES = [3, 7, 14];
const MILESTONE_REWARDS = { 3: 30, 7: 70, 14: 150 };

// Companion progression belongs to صقر: streaks, challenges, achievements,
// and cosmetics all reuse the existing game state and API actions.
export default function PetProgressionSections({ game, isSubmitting, runAction }) {
  const { streak, nxp_balance, achievements, activeChallenge, inventory, equipped } = game;

  return (
    <div className="w-full space-y-6 mb-6" data-testid="pet-progression-sections">
      <section className="bg-ink-card rounded-3xl p-5 text-center" data-testid="pet-streak-section">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="text-right min-w-0">
            <p className="text-[11px] font-black text-coral">سلسلة الادخار</p>
            <p className="text-xs text-cream/50 mt-1 font-medium leading-relaxed">
              {streak.status === 'frozen'
                ? 'درع الحماية حفظ سلسلتك اليوم ❄️'
                : 'استمر داخل الميزانية لتتقدم مع صقر.'}
            </p>
          </div>
          <StreakFlame streak={streak} size="lg" />
        </div>

        <div className="flex items-center justify-between mt-5 px-1">
          {MILESTONES.map((milestone, index) => (
            <React.Fragment key={milestone}>
              {index > 0 && (
                <div className={`flex-1 h-1 rounded mx-1 ${streak.current >= milestone ? 'bg-orange-400' : 'bg-white/10'}`} />
              )}
              <div className={`flex flex-col items-center gap-1 ${streak.current >= milestone ? '' : 'opacity-40'}`}>
                <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${streak.current >= milestone ? 'bg-orange-400/20 text-orange-300' : 'bg-white/5 text-cream/60'}`}>
                  {milestone}
                </span>
                <span className="text-[9px] font-bold text-cream/50">+{MILESTONE_REWARDS[milestone]} NXP</span>
              </div>
            </React.Fragment>
          ))}
        </div>
        <p className="text-[10px] text-cream/60 mt-3">
          أفضل سلسلة: {streak.best} يوم · دروع حماية السلسلة: {streak.freezesLeft} 🛡️
        </p>
      </section>

      <section data-testid="pet-challenge-section">
        <h2 className="font-black text-cream mb-3 px-1">التحديات</h2>
        <ChallengeCard challenge={activeChallenge} />
      </section>

      <section data-testid="pet-achievements-section">
        <h2 className="font-black text-cream mb-3 px-1">الإنجازات</h2>
        <div className="grid grid-cols-3 gap-2.5">
          {Object.entries(ACHIEVEMENTS).map(([key, achievement]) => {
            const unlocked = Boolean(achievements[key]);
            return (
              <div
                key={key}
                aria-label={`${achievement.title} — ${unlocked ? 'مفتوح' : 'مقفل'}`}
                className={`rounded-3xl p-3 text-center min-w-0 ${unlocked ? 'bg-ink-card border border-amber-400/25' : 'bg-ink-card/70 opacity-80 grayscale'}`}
              >
                <span className="text-3xl block" aria-hidden="true">{unlocked ? achievement.icon : '🔒'}</span>
                <p className="text-[10px] font-black text-cream mt-1 leading-tight break-words">{achievement.title}</p>
                <p className="text-[9px] font-bold text-amber-300 mt-0.5">+{achievement.coins} NXP</p>
              </div>
            );
          })}
        </div>
      </section>

      <section data-testid="pet-accessory-store">
        <div className="flex items-end justify-between gap-3 mb-3 px-1">
          <div>
            <h2 className="font-black text-cream">متجر إكسسوارات صقر</h2>
            <p className="text-[10px] text-cream/50 font-bold mt-1">المملوك والمجهز محفوظان في حسابك التجريبي.</p>
          </div>
          <span className="text-[11px] font-black text-amber-300 whitespace-nowrap">{nxp_balance} NXP</span>
        </div>
        <div className="space-y-3">
          {Object.entries(SHOP_ITEMS).map(([id, item]) => {
            const owned = Boolean(inventory[id]);
            const isEquipped = equipped === id;
            const affordable = nxp_balance >= item.price;
            return (
              <div key={id} className="bg-ink-card rounded-3xl p-3 flex items-center gap-3 min-w-0">
                <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                  <Mascot emotion="idle" stage={1} size={58} track={false} equipped={id} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-cream text-sm break-words">{item.icon} {item.name}</p>
                  <p className="text-[11px] font-bold text-amber-300 mt-0.5">{item.price} NXP</p>
                  {owned && <p className="text-[9px] text-emerald-300 font-bold mt-1">مملوك {isEquipped ? '· مجهز الآن' : ''}</p>}
                </div>
                {owned ? (
                  <button
                    disabled={isSubmitting}
                    onClick={() => runAction(() => api.equipItem(isEquipped ? null : id))}
                    className={`px-3 py-2 rounded-xl text-xs font-black border flex-shrink-0 ${isEquipped ? 'bg-coral text-ink border-coral' : 'bg-transparent text-coral border-coral/50'}`}
                  >
                    {isEquipped ? 'إزالة' : 'تجهيز'}
                  </button>
                ) : (
                  <button
                    disabled={isSubmitting || !affordable}
                    onClick={() => runAction(() => api.buyItem(id))}
                    className={`px-3 py-2 rounded-xl text-xs font-black flex-shrink-0 ${affordable ? 'bg-coin text-ink shadow' : 'bg-white/5 text-cream/40'}`}
                  >
                    {affordable ? 'شراء' : 'رصيد غير كافٍ'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
