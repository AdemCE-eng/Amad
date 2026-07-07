import React from 'react';
import { ChevronRight, ShieldAlert, HeartPulse } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import Mascot from '../components/mascot/Mascot';
import { useMascotEmotion } from '../components/mascot/useMascotEmotion';
import StreakFlame from '../components/ui/StreakFlame';
import CoinPill from '../components/ui/CoinPill';
import { STAGE_INFO } from '../lib/catalog';

// The hero screen — YOUR companion, singular and named. Full pupil tracking,
// tap to squish, accessories on, evolution meter toward the goal.
export default function PetRoomView() {
  const {
    user, pet, game, emergencyShield,
    isSick, isHappy, goalProgress,
    handlePetInteraction, isSubmitting, runAction, setActiveView,
  } = useAppData();
  const { emotion, poke } = useMascotEmotion(pet);
  const petName = user.petName || 'سنقر';

  return (
    <div className={`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
      isSick ? 'from-red-50 to-gray-100' : 'from-alinma-light to-amber-50'
    } min-h-screen flex flex-col font-sans transition-colors duration-500`} dir="rtl">

      {/* Header — back arrow points right in RTL */}
      <div className="p-4 flex items-center justify-between z-20">
        <button onClick={() => setActiveView('home')} className="bg-white/80 backdrop-blur p-2 rounded-full shadow-sm text-gray-700 hover:bg-white transition-all">
          <ChevronRight size={24} />
        </button>
        <h1 className="font-black text-gray-800 text-lg tracking-wide">غرفة {petName}</h1>
        <div className="w-10"></div>
      </div>

      {/* streak + coins strip */}
      <div className="flex justify-center gap-3 z-20">
        <StreakFlame streak={game.streak} />
        <CoinPill coins={game.coins} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto pb-28 z-10">

        {/* --- MAIN INTERACTIVE PET AREA --- */}
        <div className="relative w-64 h-64 mb-6 flex items-center justify-center mt-1">
          {/* Background Glow */}
          <div className={`absolute inset-6 rounded-full blur-2xl transition-all duration-1000 ${
            isSick ? 'bg-red-400/40 animate-pulse' :
            isHappy ? 'bg-yellow-400/50 animate-pulse' :
            'bg-alinma/25 animate-pulse'
          }`}></div>

          {/* The living mascot — tap to squish */}
          <div className="relative z-10 cursor-pointer select-none">
            <Mascot
              emotion={emotion}
              stage={game.stage}
              equipped={game.equipped}
              size={250}
              track
              onTap={() => { poke(); handlePetInteraction(); }}
            />
          </div>

          {/* Health Badge Overlay */}
          <div className="absolute -bottom-2 bg-white px-4 py-2 rounded-full shadow-xl border-2 border-gray-100 flex items-center gap-2 z-20">
            <HeartPulse size={20} className={isSick ? 'text-red-500 animate-pulse' : 'text-green-500'} />
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-1000 ${isSick ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${pet.health}%` }}></div>
            </div>
            <span className={`text-sm font-black ${isSick ? 'text-red-600' : 'text-green-600'}`}>{pet.health}%</span>
          </div>
        </div>

        {/* GenAI Chat Bubble */}
        <div className="bg-white/90 backdrop-blur p-5 rounded-2xl shadow-lg border border-white/50 w-full mb-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white/90 rotate-45 border-t border-l border-white/50"></div>
          <p className="text-center text-gray-800 leading-relaxed relative z-10 font-bold">
            "{pet.message}"
          </p>
        </div>

        {/* --- EVOLUTION METER — growth tied to the savings goal --- */}
        <div className="w-full bg-white/90 backdrop-blur rounded-2xl p-5 shadow-sm border border-white/50 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-gray-800 text-sm">نمو {petName}</h3>
            <span className="text-xs font-bold text-gray-500">{goalProgress}% من الهدف</span>
          </div>
          <div className="relative">
            <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
              <div className="h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-l from-alinma to-emerald-400" style={{ width: `${goalProgress}%` }}></div>
            </div>
            <div className="flex justify-between mt-2">
              {STAGE_INFO.map((s, i) => {
                const reached = game.stage >= i;
                return (
                  <div key={s.name} className={`flex flex-col items-center ${reached ? '' : 'opacity-40 grayscale'}`}>
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-[9px] font-bold text-gray-500">{s.name}{i > 0 ? ` · ${s.at}%` : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Savings card */}
        <div className="w-full bg-white/90 backdrop-blur rounded-2xl p-5 shadow-sm border border-white/50 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] text-gray-500 mb-1 font-bold">إجمالي المدخرات</p>
              <h3 className="text-2xl font-black text-green-600 drop-shadow-sm">{user.savedAmount.toFixed(2)} <span className="text-sm">ر.س</span></h3>
            </div>
            <div className="text-left bg-alinma-light p-2 rounded-xl border border-alinma/20">
              <p className="text-[10px] text-alinma-dark mb-1 font-bold">هدف الادخار</p>
              <h3 className="text-xl font-black text-alinma">{user.goalAmount.toFixed(0)}</h3>
            </div>
          </div>

          {/* Quick-save — the core action: feed the companion by saving */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-[11px] text-gray-500 font-bold mb-2">💰 وفّر الآن — {petName} يفرح ويكبر</p>
            <div className="grid grid-cols-3 gap-2">
              {[100, 500, 1000].map((amt) => (
                <button
                  key={amt}
                  disabled={isSubmitting}
                  onClick={() => runAction(() => api.save(amt))}
                  className="py-2.5 rounded-xl font-black text-sm bg-green-500 text-white shadow shadow-green-200 border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50"
                >
                  +{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Emergency Shield */}
        <button
          disabled={isSubmitting}
          onClick={() => {
            const amountStr = window.prompt('مبلغ السحب الطارئ (ر.س):', '200');
            if (!amountStr) return;
            const amt = parseFloat(amountStr);
            if (!amt || amt <= 0) return;
            runAction(() => api.emergency(amt, 'سحب طارئ'));
          }}
          className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border-b-4 active:border-b-0 active:translate-y-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-800 shadow-xl shadow-blue-200 disabled:opacity-50"
        >
          <ShieldAlert size={20} className="animate-pulse" />
          سحب طارئ ({emergencyShield.usesRemaining} متبقٍ)
        </button>
        <p className="text-[10px] text-gray-500 mt-3 text-center font-medium">يفعل الدرع مؤقتاً لحماية المرافق من التأثر النفسي عند سحب مبلغ للظروف القاهرة.</p>
      </div>
    </div>
  );
}
