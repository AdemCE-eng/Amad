import React, { useState } from 'react';
import { ArrowLeft, HeartPulse, ShieldAlert, ShoppingBag, Trophy } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import { useMascotEmotion } from '../components/mascot/useMascotEmotion';
import CompanionShowcase from '../components/pet/CompanionShowcase';
import SaveRewardTag from '../components/ui/SaveRewardTag';
import SarAmount from '../components/ui/SarAmount';
import EmergencyWithdrawModal from '../components/ui/EmergencyWithdrawModal';
import PetProgressionSections from '../components/pet/PetProgressionSections';
import { SAVE_PRESETS } from '../lib/catalog';
import { buildEvolutionPresentation } from '../lib/petEvolutionPresentation';
import { rememberCelebrationReturnFocus } from '../lib/celebrationTrigger';

const PET_TABS = [
  { id: 'status', label: 'الحالة', icon: HeartPulse },
  { id: 'progress', label: 'التحديات والإنجازات', icon: Trophy },
  { id: 'accessories', label: 'الإكسسوارات', icon: ShoppingBag },
];
// The hero screen — YOUR companion, singular and named. Full pupil tracking,
// tap to squish, accessories on, evolution meter toward the goal. Dark ink.
export default function PetRoomView() {
  const { user: petOwner } = useAppData();
  const petDisplayName = petOwner?.petName || 'صقر';
  const {
    user, pet, game, emergencyShield,
    isSick, isHappy, goalProgress,
    handlePetInteraction, isSubmitting, runAction,
    petActiveTab, setPetActiveTab,
  } = useAppData();
  const { emotion, poke } = useMascotEmotion(pet);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [saveInput, setSaveInput] = useState('');
  const evolution = buildEvolutionPresentation({
    stage: game.stage,
    goalProgress,
    savedAmount: user.savedAmount,
    goalAmount: user.goalAmount,
  });

  const submitSave = () => {
    const amount = Number(saveInput);
    if (!Number.isFinite(amount) || amount <= 0) return;
    rememberCelebrationReturnFocus('pet-save-custom');
    runAction(async () => {
      await api.save(amount);
      setSaveInput('');
    });
  };

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
              <h1 className="font-black text-cream text-lg leading-none">{petDisplayName}</h1>
          <span className="text-[9px] font-black text-coral bg-coral/10 border border-coral/20 rounded-full px-2 py-1" data-testid="pet-header-stage">
            {evolution.currentStage.name}
          </span>
        </div>
        <div
          className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-violet/10 border border-violet/20 px-2.5 py-1"
          aria-label={`رصيد NXP: ${game.nxp_balance}`}
          data-testid="pet-nxp-balance"
        >
          <strong className="text-xs font-black text-violet tabular-nums">{game.nxp_balance}</strong>
          <span className="text-[9px] font-black tracking-wide text-violet">NXP</span>
        </div>
      </header>

      <div className="px-4 pb-1 z-20">
        <div className="h-9 grid grid-cols-3 gap-0.5 bg-white/[0.04] border border-white/10 rounded-xl p-0.5" role="tablist" aria-label={`أقسام ${petDisplayName}`}>
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

        <CompanionShowcase
          pet={pet}
          game={game}
          emotion={emotion}
          goalProgress={goalProgress}
          petName={petDisplayName}
          isSick={isSick}
          isHappy={isHappy}
          onTap={() => { poke(); handlePetInteraction(); }}
        />

        {/* One glance tells judges how behavior becomes a living outcome. */}
        <div className="relative mb-3 w-full overflow-hidden rounded-2xl border border-violet/20 bg-gradient-to-l from-violet/10 via-ink-card to-coral/10 px-4 py-3" data-testid="pet-status-message">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-black text-violet"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 motion-safe:animate-pulse" /> استجابة مالية حيّة</span>
            <span className="text-[8px] font-bold text-cream/35">يتحدث حسب حالتك</span>
          </div>
          <p className="relative z-10 mt-2 text-center text-[13px] font-bold leading-relaxed text-cream">“{pet.message}”</p>
        </div>

        {/* Savings is the primary action and the only input to Saqr evolution. */}
        <section className="w-full bg-gradient-to-br from-ink-card to-ink-soft/70 border border-white/10 shadow-[0_14px_35px_-24px_rgba(0,0,0,0.9)] rounded-3xl px-4 py-3.5 mb-3" data-testid="pet-savings-summary" aria-labelledby="pet-savings-title">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p id="pet-savings-title" className="text-[10px] text-cream/50 font-bold">إجمالي المدخرات</p>
              <p className="mt-0.5 text-xl font-black text-emerald-400 tabular-nums" data-testid="pet-saved-amount"><SarAmount value={user.savedAmount} /></p>
            </div>
            <div className="text-left shrink-0">
              <p className="text-[10px] text-cream/50 font-bold">هدف الادخار</p>
              <p className="mt-0.5 text-lg font-black text-coral tabular-nums" data-testid="pet-goal-amount"><SarAmount value={user.goalAmount} /></p>
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
            <span>كل توفير يقرّبك من هدفك ويطوّر {petDisplayName}</span>
            <span className="shrink-0 tabular-nums">{goalProgress}%</span>
          </div>

          <div className="mt-2.5 grid grid-cols-3 gap-2" aria-label="مبالغ التوفير السريع">
            {SAVE_PRESETS.map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSaveInput(String(amount))}
                aria-pressed={saveInput === String(amount)}
                className={`min-w-0 w-full border text-xs font-black px-1.5 py-2.5 rounded-2xl transition-all ${saveInput === String(amount) ? 'bg-coral/15 border-coral/50 text-coral shadow-[0_0_0_1px_rgba(232,132,102,0.12)]' : 'bg-ink-soft/70 border-white/10 text-cream/80 hover:border-white/20'}`}
              >
                <SarAmount value={amount} />
              </button>
            ))}
          </div>
          <div className="mt-2.5 grid grid-cols-[minmax(0,1fr)_5.5rem] items-stretch gap-2">
            <div className="relative min-w-0">
              <input
                type="number"
                inputMode="numeric"
                min="1"
                value={saveInput}
                onChange={(e) => setSaveInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') submitSave(); }}
                placeholder="المبلغ"
                className="w-full h-full min-w-0 bg-black/10 border border-white/15 rounded-2xl py-2.5 pr-4 pl-12 text-cream font-black placeholder:text-cream/30 focus:outline-none focus:border-coral/60 focus:ring-2 focus:ring-coral/10"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream/40 text-sm font-bold" aria-label="ريال سعودي">⃁</span>
            </div>
            <button
              type="button"
              disabled={isSubmitting || !(Number(saveInput) > 0)}
              onClick={submitSave}
              data-focus-return-key="pet-save-custom"
              className="w-full bg-coral text-ink font-black px-2 py-2.5 rounded-2xl shadow-[0_8px_20px_-12px_rgba(232,132,102,0.9)] disabled:bg-white/10 disabled:text-cream/30 disabled:shadow-none disabled:cursor-not-allowed whitespace-nowrap transition-colors"
            >
              {isSubmitting ? 'جارٍ…' : 'أضف'}
            </button>
          </div>
          <SaveRewardTag reward={game.lastSaveReward} compact />
        </section>

        {/* Growth uses a stage rail so it cannot be mistaken for the financial progress bar. */}
        <section className="w-full bg-ink-card rounded-3xl px-4 py-3 mb-4" data-testid="pet-evolution-card" aria-labelledby="pet-evolution-title">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="text-[9px] font-bold text-cream/40">مراحل النمو</p>
              <h2 id="pet-evolution-title" className="font-black text-cream text-sm">تطور {petDisplayName}</h2>
            </div>
            <div className="inline-flex min-w-0 items-center gap-1.5 rounded-xl bg-white/[0.035] px-2.5 py-1.5 text-[10px] font-black" aria-label="المرحلة الحالية والتالية">
              <span className="text-cream" data-testid="pet-current-stage">{evolution.currentStage.name}</span>
              {evolution.nextStage && <ArrowLeft size={11} className="shrink-0 text-cream/35" aria-hidden="true" />}
              <span className="text-coral" data-testid="pet-next-stage">{evolution.nextStage?.name || 'اكتمل التطور'}</span>
              <span className="text-cream/30" aria-hidden="true">•</span>
              <span className="tabular-nums text-cream/45" data-testid="pet-evolution-progress">
                {evolution.currentIndex + 1}/{evolution.milestones.length}
              </span>
            </div>
          </div>

          <ol
            className="relative mt-2.5 grid grid-cols-3 gap-2 before:absolute before:right-[16.66%] before:left-[16.66%] before:top-2.5 before:h-px before:bg-white/10"
            dir="rtl"
            aria-label={`مراحل تطور ${petDisplayName}`}
            data-testid="pet-evolution-stage-rail"
          >
            {evolution.milestones.map((milestone) => (
              <li
                key={milestone.name}
                className={`relative z-10 flex min-w-0 flex-col items-center text-center ${milestone.state === 'current' ? 'text-coral' : milestone.state === 'completed' ? 'text-emerald-300' : 'text-cream/35'}`}
                data-stage-state={milestone.state}
                data-threshold={milestone.at}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full border-2 bg-ink-card ${milestone.state === 'current' ? 'border-coral shadow-[0_0_0_4px_rgba(233,124,97,0.12)]' : milestone.state === 'completed' ? 'border-emerald-400' : 'border-white/15'}`} aria-hidden="true">
                  <span className={`h-1.5 w-1.5 rounded-full ${milestone.state === 'current' ? 'bg-coral' : milestone.state === 'completed' ? 'bg-emerald-400' : 'bg-white/15'}`} />
                </span>
                <span className="mt-1.5 max-w-full truncate text-[9px] font-black">{milestone.name}</span>
                <span className="text-[8px] font-bold opacity-70">{milestone.at}%</span>
              </li>
            ))}
          </ol>

          <p className="mt-2 rounded-xl border border-white/5 bg-black/10 px-2.5 py-1.5 text-[10px] font-bold leading-relaxed text-cream/65" data-testid="pet-next-milestone-explanation">
            {evolution.nextStage
              ? <>باقي <SarAmount value={evolution.remainingAmount} className="text-coral font-black" /> لانتقال {petDisplayName} إلى مرحلة {evolution.nextStage.name}.</>
              : <>وصل {petDisplayName} إلى مرحلته النهائية؛ واصل الادخار الشخصي لإكمال هدفك.</>}
          </p>
        </section>

        <PetProgressionSections section="status" game={game} isSubmitting={isSubmitting} runAction={runAction} petName={petDisplayName} />

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
            <PetProgressionSections section="progress" game={game} isSubmitting={isSubmitting} runAction={runAction} petName={petDisplayName} />
          </div>
        )}

        {petActiveTab === 'accessories' && (
          <div id="pet-panel-accessories" role="tabpanel" aria-labelledby="pet-tab-accessories" className="w-full" data-testid="pet-accessories-panel">
            <PetProgressionSections section="accessories" game={game} isSubmitting={isSubmitting} runAction={runAction} petName={petDisplayName} />
          </div>
        )}
      </div>

      <EmergencyWithdrawModal
        petName={petDisplayName}
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
