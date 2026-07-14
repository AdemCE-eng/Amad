import React, { useState } from 'react';
import { ShieldAlert, HeartPulse } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import Mascot from '../components/mascot/Mascot';
import { useMascotEmotion } from '../components/mascot/useMascotEmotion';
import CoinPill from '../components/ui/CoinPill';
import SaveRewardTag from '../components/ui/SaveRewardTag';
import EmergencyWithdrawModal from '../components/ui/EmergencyWithdrawModal';
import PetProgressionSections from '../components/pet/PetProgressionSections';
import { STAGE_INFO, SAVE_PRESETS } from '../lib/catalog';

// The hero screen — YOUR companion, singular and named. Full pupil tracking,
// tap to squish, accessories on, evolution meter toward the goal. Dark ink.
export default function PetRoomView() {
  const {
    user, pet, game, emergencyShield,
    isSick, isHappy, goalProgress,
    handlePetInteraction, isSubmitting, runAction,
  } = useAppData();
  const { emotion, poke } = useMascotEmotion(pet);
  const petName = user.petName || 'صقر';
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  return (
    <div className={`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
      isSick ? 'from-red-950 to-ink' : 'from-ink-soft to-ink'
    } h-full flex flex-col font-sans text-cream transition-colors duration-500`} dir="rtl">

      {/* Pet is a primary BottomNav destination, so its header has no nested back control. */}
      <div className="p-4 flex items-center justify-between gap-3 z-20">
        <h1 className="font-black text-cream text-lg tracking-wide">غرفة {petName}</h1>
        <CoinPill coins={game.nxp_balance} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto pb-28 z-10">

        {/* --- MAIN INTERACTIVE PET AREA --- */}
        <div className="relative w-64 h-64 mb-6 flex items-center justify-center mt-1">
          {/* Background Glow */}
          <div className={`absolute inset-6 rounded-full blur-2xl transition-all duration-1000 ${
            isSick ? 'bg-red-500/30 animate-pulse' :
            isHappy ? 'bg-yellow-400/30 animate-pulse' :
            'bg-coral/20 animate-pulse'
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
          <div className="absolute -bottom-2 bg-ink-soft px-4 py-2 rounded-full shadow-xl border border-white/10 flex items-center gap-2 z-20">
            <HeartPulse size={20} className={isSick ? 'text-red-400 animate-pulse' : 'text-emerald-400'} />
            <div className="w-20 bg-white/10 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-1000 ${isSick ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${pet.health}%` }}></div>
            </div>
            <span className={`text-sm font-black ${isSick ? 'text-red-400' : 'text-emerald-400'}`}>{pet.health}%</span>
          </div>
        </div>

        {/* GenAI Chat Bubble */}
        <div className="bg-ink-card p-5 rounded-3xl w-full mb-6 relative">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-ink-card rotate-45"></div>
          <p className="text-center text-cream leading-relaxed relative z-10 font-bold">
            "{pet.message}"
          </p>
        </div>

        {/* --- EVOLUTION METER — growth tied to the savings goal --- */}
        <div className="w-full bg-ink-card rounded-3xl p-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-black text-cream text-sm">نمو {petName}</h3>
            <span className="text-xs font-bold text-cream/50">{goalProgress}% من الهدف</span>
          </div>
          <div className="relative">
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
              <div className="h-3 rounded-full transition-all duration-1000 ease-out bg-gradient-to-l from-coral to-coin" style={{ width: `${goalProgress}%` }}></div>
            </div>
            <div className="flex justify-between mt-2">
              {STAGE_INFO.map((s, i) => {
                const reached = game.stage >= i;
                return (
                  <div key={s.name} className={`flex flex-col items-center ${reached ? '' : 'opacity-40 grayscale'}`}>
                    <span className="text-xl">{s.icon}</span>
                    <span className="text-[9px] font-bold text-cream/50">{s.name}{i > 0 ? ` · ${s.at}%` : ''}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Savings card */}
        <div className="w-full bg-ink-card rounded-3xl p-5 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-[11px] text-cream/50 mb-1 font-bold">إجمالي المدخرات</p>
              <h3 className="text-2xl font-black text-emerald-400">{user.savedAmount.toFixed(2)} <span className="text-sm">ر.س</span></h3>
            </div>
            <div className="text-left bg-white/5 p-2 rounded-2xl">
              <p className="text-[10px] text-cream/50 mb-1 font-bold">هدف الادخار</p>
              <h3 className="text-xl font-black text-coral">{user.goalAmount.toFixed(0)}</h3>
            </div>
          </div>

          {/* Quick-save — the core action: feed the companion by saving */}
          <div className="mt-4 pt-3 border-t border-white/10">
            <p className="text-[11px] text-cream/50 font-bold mb-2">💰 وفّر الآن — {petName} يفرح ويكبر</p>
            <div className="grid grid-cols-3 gap-2">
              {SAVE_PRESETS.map((amt) => (
                <button
                  key={amt}
                  disabled={isSubmitting}
                  onClick={() => runAction(() => api.save(amt))}
                  className="py-2.5 rounded-xl font-black text-sm bg-coral-tile text-ink active:scale-95 transition-all disabled:opacity-50"
                >
                  +{amt}
                </button>
              ))}
            </div>
            {/* Income-relative NXP receipt — same backend stamp HomeView shows */}
            <SaveRewardTag reward={game.lastSaveReward} compact />
          </div>
        </div>

        <PetProgressionSections game={game} isSubmitting={isSubmitting} runAction={runAction} />

        {/* Emergency Shield */}
        <button
          disabled={isSubmitting}
          onClick={() => setEmergencyOpen(true)}
          className="w-full py-4 rounded-3xl font-bold flex items-center justify-center gap-2 transition-all duration-300 active:scale-[0.98] bg-ink-soft border border-white/10 text-cream shadow-lg disabled:opacity-50"
        >
          <ShieldAlert size={20} className="animate-pulse text-coral" />
          سحب طارئ ({emergencyShield.usesRemaining} متبقٍ)
        </button>
        <p className="text-[10px] text-cream/60 mt-3 text-center font-medium">يفعل الدرع مؤقتاً لحماية المرافق من التأثر النفسي عند سحب مبلغ للظروف القاهرة.</p>
      </div>

      <EmergencyWithdrawModal
        open={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        onConfirm={async (amt, label) => {
          // runAction swallows errors into the global banner and never
          // rethrows — capture failure locally so the modal's own success
          // state only fires when the withdrawal actually succeeded.
          let failed = false;
          await runAction(async () => {
            try {
              await api.emergency(amt, label);
            } catch (err) {
              failed = true;
              throw err;
            }
          });
          if (failed) throw new Error('emergency_failed');
        }}
        balance={user.balance}
        shieldsRemaining={emergencyShield.usesRemaining}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
