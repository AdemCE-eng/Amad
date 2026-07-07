import React from 'react';
import { useAppData } from '../context/AppDataContext';
import { ACHIEVEMENTS, SHOP_ITEMS } from '../lib/catalog';
import StreakFlame from '../components/ui/StreakFlame';
import CoinPill from '../components/ui/CoinPill';
import ChallengeCard from '../components/ui/ChallengeCard';
import Mascot from '../components/mascot/Mascot';
import { api } from '../lib/api';

const MILESTONES = [3, 7, 14];

// المكافآت — streak hero, weekly challenge, achievements grid, and the
// accessory shop (cosmetics render instantly on the mascot).
export default function RewardsView() {
  const { user, game, isSubmitting, runAction } = useAppData();
  if (!game) return null;
  const { streak, coins, achievements, activeChallenge, inventory, equipped } = game;

  return (
    <div className="bg-gray-50 min-h-screen font-sans pb-24" dir="rtl">
      <div className="bg-alinma text-white p-4 rounded-b-2xl shadow-md">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-black">المكافآت</h1>
          <CoinPill coins={coins} />
        </div>
      </div>

      <div className="p-4 space-y-5">
        {/* Streak hero */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <StreakFlame streak={streak} size="lg" />
          <p className="text-xs text-gray-500 mt-3 font-medium">
            {streak.status === 'frozen'
              ? 'درع الحماية حفظ سلسلتك اليوم — الغلطة تعدي ❄️'
              : 'أيام متتالية داخل الميزانية — كل يوم +10 🪙'}
          </p>
          {/* milestone track */}
          <div className="flex items-center justify-between mt-5 px-2">
            {MILESTONES.map((m, i) => (
              <React.Fragment key={m}>
                {i > 0 && <div className={`flex-1 h-1 rounded mx-1 ${streak.current >= m ? 'bg-orange-400' : 'bg-gray-200'}`} />}
                <div className={`flex flex-col items-center gap-1 ${streak.current >= m ? '' : 'opacity-40'}`}>
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-black ${streak.current >= m ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                    {m}
                  </span>
                  <span className="text-[9px] font-bold text-gray-500">+{{ 3: 30, 7: 70, 14: 150 }[m]} 🪙</span>
                </div>
              </React.Fragment>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3">أفضل سلسلة: {streak.best} يوم · دروع الحماية: {streak.freezesLeft} ❄️</p>
        </div>

        {/* Weekly challenge */}
        <ChallengeCard challenge={activeChallenge} />

        {/* Achievements */}
        <div>
          <h3 className="font-black text-gray-800 mb-3 px-1">الإنجازات</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(ACHIEVEMENTS).map(([key, a]) => {
              const unlocked = Boolean(achievements[key]);
              return (
                <div
                  key={key}
                  className={`bg-white rounded-2xl p-3 border text-center ${unlocked ? 'border-amber-200 shadow-sm' : 'border-gray-100 opacity-50 grayscale'}`}
                >
                  <span className="text-3xl block">{unlocked ? a.icon : '🔒'}</span>
                  <p className="text-[10px] font-black text-gray-700 mt-1 leading-tight">{a.title}</p>
                  <p className="text-[9px] font-bold text-amber-600 mt-0.5">+{a.coins} 🪙</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-black text-gray-800 mb-3 px-1">متجر الإكسسوارات</h3>
          <div className="space-y-3">
            {Object.entries(SHOP_ITEMS).map(([id, item]) => {
              const owned = Boolean(inventory[id]);
              const isEquipped = equipped === id;
              const affordable = coins >= item.price;
              return (
                <div key={id} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="w-16 h-16 bg-alinma-light rounded-xl flex items-center justify-center overflow-hidden">
                    <Mascot emotion="idle" stage={1} size={58} track={false} equipped={id} />
                  </div>
                  <div className="flex-1">
                    <p className="font-black text-gray-800 text-sm">{item.icon} {item.name}</p>
                    <p className="text-[11px] font-bold text-amber-600 mt-0.5">{item.price} 🪙</p>
                  </div>
                  {owned ? (
                    <button
                      disabled={isSubmitting}
                      onClick={() => runAction(() => api.equipItem(isEquipped ? null : id))}
                      className={`px-4 py-2 rounded-xl text-xs font-black border ${isEquipped ? 'bg-alinma text-white border-alinma' : 'bg-white text-alinma border-alinma'}`}
                    >
                      {isEquipped ? 'يلبسه ✓' : 'ألبسه'}
                    </button>
                  ) : (
                    <button
                      disabled={isSubmitting || !affordable}
                      onClick={() => runAction(() => api.buyItem(id))}
                      className={`px-4 py-2 rounded-xl text-xs font-black ${affordable ? 'bg-coin text-white shadow' : 'bg-gray-100 text-gray-400'}`}
                    >
                      {affordable ? 'اشتره' : 'وفّر له'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
