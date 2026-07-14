import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, HeartPulse, ShieldAlert, ShoppingBag, Trophy } from 'lucide-react';
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
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
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
        <div className="relative w-60 h-60 mb-2 flex items-center justify-center" data-testid="pet-mascot-hero">
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

        {/* Short live companion message. Secondary metadata lives below the financial cards. */}
        <div className="bg-ink-card px-4 py-3 rounded-2xl w-full mb-3 relative" data-testid="pet-status-message">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-ink-card rotate-45" aria-hidden="true" />
          <p className="text-center text-sm text-cream leading-relaxed relative z-10 font-bold">
            "{pet.message}"
          </p>
        </div>

        {/* Savings is the primary action and the only input to Saqr evolution. */}
        <section className="w-full bg-ink-card rounded-3xl px-4 py-3.5 mb-3" data-testid="pet-savings-summary" aria-labelledby="pet-savings-title">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p id="pet-savings-title" className="text-[10px] text-cream/50 font-bold">إجمالي المدخرات</p>
              <p className="mt-0.5 text-xl font-black text-emerald-400 tabular-nums" data-testid="pet-saved-amount">
                {SAR_NUMBER.format(user.savedAmount)} <span className="text-[11px]">ر.س</span>
              </p>
            </div>
            <div className="text-left shrink-0">
              <p className="text-[10px] text-cream/50 font-bold">هدف الادخار</p>
              <p className="mt-0.5 text-lg font-black text-coral tabular-nums" data-testid="pet-goal-amount">
                {SAR_NUMBER.format(user.goalAmount)} <span className="text-[10px]">ر.س</span>
              </p>
            </div>
          </div>

          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
            role="progressbar"
            aria-label="تقدم هدف الادخار الشخصي"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={goalProgress}
            data-testid="pet-savings-progress"
          >
            <div className="h-full rounded-full bg-gradient-to-l from-emerald-400 to-coral transition-[width] duration-700 motion-reduce:transition-none" style={{ width: `${goalProgress}%` }} />
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-3 text-[9px] font-bold text-cream/45">
            <span>كل توفير يقرّبك من هدفك ويطوّر صقر</span>
            <span className="shrink-0 tabular-nums">{goalProgress}%</span>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2" aria-label="مبالغ التوفير السريع">
            {SAVE_PRESETS.map((amount) => (
              <button
                key={amount}
                type="button"
                disabled={isSubmitting}
                onClick={() => runAction(() => api.save(amount))}
                className="rounded-xl bg-coral-tile py-2 text-xs font-black text-ink transition-transform active:scale-95 disabled:opacity-50"
              >
                +{amount}
              </button>
            ))}
          </div>
          <SaveRewardTag reward={game.lastSaveReward} compact />
        </section>

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
              ? <>باقي <strong className="text-coral">{SAR_NUMBER.format(evolution.remainingAmount)} ر.س</strong> للوصول إلى مرحلة {evolution.nextStage.name}.</>
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

        <section className="w-full mb-3" data-testid="pet-secondary-details">
          <button
            type="button"
            aria-expanded={detailsOpen}
            aria-controls="pet-secondary-details-content"
            onClick={() => setDetailsOpen((open) => !open)}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-xs font-black text-cream/70 transition-colors hover:bg-white/[0.07] focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
          >
            <span>تفاصيل الحالة</span>
            <ChevronDown size={15} className={`text-coral transition-transform motion-reduce:transition-none ${detailsOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
          </button>
          {detailsOpen && (
            <div id="pet-secondary-details-content" className="mt-2 grid grid-cols-3 gap-2 rounded-2xl bg-ink-card px-3 py-2.5 text-center" data-testid="pet-secondary-details-content">
              <div><span className="block text-[8px] font-bold text-cream/40">المزاج</span><strong className="text-[10px]">{MOOD_LABEL[pet.mood] || pet.mood}</strong></div>
              <div><span className="block text-[8px] font-bold text-cream/40">الحماية</span><strong className="text-[10px]">{emergencyShield.usesRemaining} درع</strong></div>
              <div><span className="block text-[8px] font-bold text-cream/40">الإكسسوار</span><strong className="text-[10px]">{SHOP_ITEMS[game.equipped]?.name || 'بدون'}</strong></div>
            </div>
          )}
        </section>

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
