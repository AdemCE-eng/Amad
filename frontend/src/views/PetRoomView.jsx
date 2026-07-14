import React, { useState } from 'react';
import { ArrowLeft, HeartPulse, ShieldAlert, ShoppingBag, Trophy } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import Mascot from '../components/mascot/Mascot';
import { useMascotEmotion } from '../components/mascot/useMascotEmotion';
import SaveRewardTag from '../components/ui/SaveRewardTag';
import EmergencyWithdrawModal from '../components/ui/EmergencyWithdrawModal';
import PetProgressionSections from '../components/pet/PetProgressionSections';
import { SAVE_PRESETS, SHOP_ITEMS } from '../lib/catalog';
import { buildEvolutionPresentation } from '../lib/petEvolutionPresentation';

const PET_TABS = [
  { id: 'status', label: 'الحالة', icon: HeartPulse },
  { id: 'progress', label: 'التحديات والإنجازات', icon: Trophy },
  { id: 'accessories', label: 'الإكسسوارات', icon: ShoppingBag },
];
const MOOD_LABEL = { radiant: 'مشرق', happy: 'سعيد', neutral: 'هادئ', tired: 'متعب', sick: 'يحتاج عناية' };
const SAR_NUMBER = new Intl.NumberFormat('ar-SA', { maximumFractionDigits: 0 });

// The hero screen — YOUR companion, singular and named. Full pupil tracking,
// tap to squish, accessories on, evolution meter toward the goal. Dark ink.
export default function PetRoomView() {
  const {
    user, pet, game, emergencyShield,
    isSick, isHappy, goalProgress,
    handlePetInteraction, isSubmitting, runAction,
    petActiveTab, setPetActiveTab,
  } = useAppData();
  const { emotion, poke } = useMascotEmotion(pet);
  const petName = user.petName || 'صقر';
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const evolution = buildEvolutionPresentation({
    stage: game.stage,
    goalProgress,
    savedAmount: user.savedAmount,
    goalAmount: user.goalAmount,
  });

  const handleTabKeyDown = (event, currentIndex) => {
    let nextIndex = currentIndex;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex + 1) % PET_TABS.length;
    else if (event.key === 'ArrowRight') nextIndex = (currentIndex - 1 + PET_TABS.length) % PET_TABS.length;
    else if (event.key === 'Home') nextIndex = 0;
    else if (event.key === 'End') nextIndex = PET_TABS.length - 1;
    else return;

    event.preventDefault();
    const nextTab = PET_TABS[nextIndex];
    setPetActiveTab(nextTab.id);
    requestAnimationFrame(() => document.getElementById(`pet-tab-${nextTab.id}`)?.focus());
  };

  return (
    <div className={`bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${
      isSick ? 'from-red-950 to-ink' : 'from-ink-soft to-ink'
    } h-full flex flex-col font-sans text-cream transition-colors duration-500`} dir="rtl">

      {/* Pet is a primary BottomNav destination, so its header has no nested back control. */}
      <header className="h-12 px-5 flex items-center justify-between gap-3 z-20" data-testid="pet-product-header">
        <div className="min-w-0 flex items-center gap-2">
          <h1 className="font-black text-cream text-lg leading-none">صقر</h1>
          <span className="text-[9px] font-black text-coral bg-coral/10 border border-coral/20 rounded-full px-2 py-1" data-testid="pet-header-stage">
            {evolution.currentStage.name}
          </span>
        </div>
        <div
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 border border-amber-300/20 px-2.5 py-1"
          aria-label={`رصيد NXP: ${game.nxp_balance}`}
          data-testid="pet-nxp-balance"
        >
          <strong className="text-xs font-black text-cream tabular-nums">{game.nxp_balance}</strong>
          <span className="text-[9px] font-black tracking-wide text-amber-300">NXP</span>
        </div>
      </header>

      <div className="px-4 pb-1 z-20">
        <div className="h-9 grid grid-cols-3 gap-0.5 bg-white/[0.04] border border-white/10 rounded-xl p-0.5" role="tablist" aria-label="أقسام صقر">
          {PET_TABS.map((tab, index) => {
            const TabIcon = tab.icon;
            const selected = petActiveTab === tab.id;
            return (
            <button
              key={tab.id}
              id={`pet-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`pet-panel-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setPetActiveTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`h-8 rounded-[10px] px-1 inline-flex items-center justify-center gap-1 text-[8.5px] leading-none font-black border transition-colors ${selected ? 'bg-coral/10 border-coral/35 text-coral' : 'border-transparent text-cream/55 hover:text-cream hover:bg-white/5'}`}
            >
              <TabIcon size={10} strokeWidth={2.5} className="shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-0 overflow-y-auto pb-28 z-10">

        {petActiveTab === 'status' && (
          <div id="pet-panel-status" role="tabpanel" aria-labelledby="pet-tab-status" className="w-full flex flex-col items-center" data-testid="pet-status-panel">

        {/* --- MAIN INTERACTIVE PET AREA --- */}
        <div className="relative w-60 h-60 mb-4 flex items-center justify-center" data-testid="pet-mascot-hero">
          {/* Background Glow */}
          <div className={`absolute inset-10 rounded-full blur-xl transition-all duration-500 ${
            isSick ? 'bg-red-500/20' :
            isHappy ? 'bg-yellow-400/16' :
            'bg-coral/14'
          }`}></div>

          {/* The living mascot — tap to squish */}
          <div className="relative z-10 cursor-pointer select-none">
            <Mascot
              emotion={emotion}
              stage={game.stage}
              equipped={game.equipped}
              size={230}
              track
              onTap={() => { poke(); handlePetInteraction(); }}
            />
          </div>

          {/* Health Badge Overlay */}
          <div className="absolute bottom-0 bg-ink-soft px-3.5 py-1.5 rounded-full shadow-xl border border-white/10 flex items-center gap-2 z-20" data-testid="pet-health-status">
            <HeartPulse size={17} className={isSick ? 'text-red-400 motion-safe:animate-pulse' : 'text-emerald-400'} />
            <div className="w-20 bg-white/10 rounded-full h-2">
              <div className={`h-2 rounded-full transition-all duration-1000 ${isSick ? 'bg-red-400' : 'bg-emerald-400'}`} style={{ width: `${pet.health}%` }}></div>
            </div>
            <span className={`text-sm font-black ${isSick ? 'text-red-400' : 'text-emerald-400'}`}>{pet.health}%</span>
          </div>
        </div>

        {/* GenAI Chat Bubble */}
        <div className="bg-ink-card p-3.5 rounded-3xl w-full mb-4 relative" data-testid="pet-status-message">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-ink-card rotate-45"></div>
          <p className="text-center text-cream leading-relaxed relative z-10 font-bold">
            "{pet.message}"
          </p>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-white/5 text-center">
            <div><span className="block text-[9px] text-cream/40 font-bold">المزاج</span><strong className="text-[11px]">{MOOD_LABEL[pet.mood] || pet.mood}</strong></div>
            <div><span className="block text-[9px] text-cream/40 font-bold">الحماية</span><strong className="text-[11px]">{emergencyShield.usesRemaining} درع</strong></div>
            <div><span className="block text-[9px] text-cream/40 font-bold">الإكسسوار</span><strong className="text-[11px]">{SHOP_ITEMS[game.equipped]?.name || 'بدون'}</strong></div>
          </div>
        </div>

        {/* The authoritative stage and goal percentage come from shared app state. */}
        <section className="w-full bg-ink-card rounded-3xl px-4 py-3.5 mb-5" data-testid="pet-evolution-card" aria-labelledby="pet-evolution-title">
          <div className="flex items-center justify-between gap-3">
            <h2 id="pet-evolution-title" className="font-black text-cream text-sm">نمو صقر</h2>
            <span className="text-xs font-black text-coral tabular-nums" data-testid="pet-evolution-progress">{evolution.progress}%</span>
          </div>

          <div className="flex items-center justify-between gap-3 mt-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-black">
              <span className="text-cream" data-testid="pet-current-stage">{evolution.currentStage.name}</span>
              {evolution.nextStage && <ArrowLeft size={13} className="text-cream/35" aria-hidden="true" />}
              <span className="text-coral" data-testid="pet-next-stage">{evolution.nextStage?.name || 'اكتمل التطور'}</span>
            </div>
            <span className="text-[9px] text-cream/40 font-bold">من هدف الادخار الشخصي</span>
          </div>

          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden mt-2" dir="rtl" data-testid="pet-evolution-track" aria-label={`تقدم الادخار الشخصي ${evolution.progress}%`}>
            <div
              className="h-full rounded-full bg-gradient-to-l from-coral to-coin transition-[width] duration-700 motion-reduce:transition-none mr-0"
              style={{ width: `${evolution.progress}%` }}
              data-testid="pet-evolution-fill"
            />
          </div>

          <p className="text-[10px] text-cream/65 font-bold leading-relaxed mt-2" data-testid="pet-next-milestone-explanation">
            {evolution.nextStage
              ? <>باقي <strong className="text-coral">{SAR_NUMBER.format(evolution.remainingAmount)} ر.س</strong> من مدخراتك الشخصية للوصول إلى مرحلة {evolution.nextStage.name}.</>
              : 'وصل صقر إلى مرحلته النهائية؛ واصل الادخار الشخصي لإكمال هدفك.'}
          </p>

          <div className="grid grid-cols-3 gap-2 mt-2.5 pt-2 border-t border-white/5" dir="rtl" data-testid="pet-evolution-milestones">
            {evolution.milestones.map((milestone) => (
              <div
                key={milestone.name}
                className={`flex items-center justify-center gap-1.5 min-w-0 ${milestone.state === 'current' ? 'text-coral' : milestone.state === 'completed' ? 'text-emerald-300' : 'text-cream/35'}`}
                data-stage-state={milestone.state}
                data-threshold={milestone.at}
              >
                <span className={`w-2 h-2 rounded-full shrink-0 ${milestone.state === 'current' ? 'bg-coral ring-2 ring-coral/20' : milestone.state === 'completed' ? 'bg-emerald-400' : 'bg-white/15'}`} aria-hidden="true" />
                <span className="text-[9px] font-black truncate">{milestone.name}</span>
                <span className="text-[8px] font-bold opacity-70">{milestone.at}%</span>
              </div>
            ))}
          </div>
        </section>

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

        <PetProgressionSections section="status" game={game} isSubmitting={isSubmitting} runAction={runAction} />

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
        )}

        {petActiveTab === 'progress' && (
          <div id="pet-panel-progress" role="tabpanel" aria-labelledby="pet-tab-progress" className="w-full" data-testid="pet-progress-panel">
            <PetProgressionSections section="progress" game={game} isSubmitting={isSubmitting} runAction={runAction} />
          </div>
        )}

        {petActiveTab === 'accessories' && (
          <div id="pet-panel-accessories" role="tabpanel" aria-labelledby="pet-tab-accessories" className="w-full" data-testid="pet-accessories-panel">
            <PetProgressionSections section="accessories" game={game} isSubmitting={isSubmitting} runAction={runAction} />
          </div>
        )}
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
