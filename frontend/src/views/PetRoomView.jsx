import React, { useState } from 'react';
import { Check, CircleDot, HeartPulse, LockKeyhole, ShieldAlert, ShoppingBag, Trophy } from 'lucide-react';
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
      <header className="px-5 pt-4 pb-2 flex items-center justify-between gap-3 z-20" data-testid="pet-product-header">
        <div className="min-w-0">
          <h1 className="font-black text-cream text-xl leading-tight">صقر</h1>
          <p className="text-[11px] text-cream/55 font-bold mt-0.5 truncate">
            رفيقك المالي <span aria-hidden="true">·</span> مرحلة {evolution.currentStage.name}
          </p>
        </div>
        <div
          className="shrink-0 inline-flex items-center gap-2 rounded-full bg-amber-400/10 border border-amber-300/25 px-3 py-1.5"
          aria-label={`رصيد NXP: ${game.nxp_balance}`}
          data-testid="pet-nxp-balance"
        >
          <span className="text-[10px] font-black tracking-wide text-amber-300">NXP</span>
          <strong className="text-sm font-black text-cream tabular-nums">{game.nxp_balance}</strong>
        </div>
      </header>

      <div className="px-4 pb-2 z-20">
        <div className="grid grid-cols-3 gap-1 bg-white/[0.04] border border-white/10 rounded-2xl p-1" role="tablist" aria-label="أقسام صقر">
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
              className={`min-h-10 rounded-xl px-1 py-1 inline-flex items-center justify-center gap-1 text-[9px] leading-[1.05] font-black border transition-colors ${selected ? 'bg-coral/15 border-coral/45 text-coral' : 'border-transparent text-cream/55 hover:text-cream hover:bg-white/5'}`}
            >
              <TabIcon size={12} strokeWidth={2.5} className="shrink-0" aria-hidden="true" />
              <span>{tab.label}</span>
            </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-5 pt-1 overflow-y-auto pb-28 z-10">

        {petActiveTab === 'status' && (
          <div id="pet-panel-status" role="tabpanel" aria-labelledby="pet-tab-status" className="w-full flex flex-col items-center" data-testid="pet-status-panel">

        {/* --- MAIN INTERACTIVE PET AREA --- */}
        <div className="relative w-64 h-64 mb-5 flex items-center justify-center">
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
        <div className="bg-ink-card p-4 rounded-3xl w-full mb-5 relative">
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
        <section className="w-full bg-ink-card rounded-3xl p-5 mb-6" data-testid="pet-evolution-card" aria-labelledby="pet-evolution-title">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="pet-evolution-title" className="font-black text-cream text-base">نمو صقر</h2>
              <p className="text-[10px] text-cream/45 font-bold mt-1">يتطور وفق مدخراتك الشخصية</p>
            </div>
            <span className="rounded-full bg-coral/15 border border-coral/25 text-coral px-3 py-1 text-xs font-black tabular-nums" data-testid="pet-evolution-progress">
              {evolution.progress}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="rounded-2xl bg-white/5 border border-white/5 p-3" data-testid="pet-current-stage">
              <p className="text-[9px] text-cream/40 font-bold">المرحلة الحالية</p>
              <p className="font-black text-cream mt-1">{evolution.currentStage.name}</p>
              <p className="text-[9px] text-cream/45 mt-1">{evolution.progress}% من هدف الادخار الشخصي</p>
            </div>
            <div className="rounded-2xl bg-white/5 border border-white/5 p-3" data-testid="pet-next-stage">
              <p className="text-[9px] text-cream/40 font-bold">المرحلة التالية</p>
              <p className="font-black text-coral mt-1">{evolution.nextStage?.name || 'اكتمل التطور'}</p>
              <p className="text-[9px] text-cream/45 mt-1">
                {evolution.nextStage ? `تبدأ عند ${evolution.nextStage.at}%` : 'وصل صقر إلى مرحلته النهائية'}
              </p>
            </div>
          </div>

          <div className="relative h-24 mx-8 mt-5" dir="rtl" data-testid="pet-evolution-track" aria-label={`تقدم الادخار الشخصي ${evolution.progress}%`}>
            <div className="absolute top-4 right-0 left-0 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="absolute right-0 top-0 h-full rounded-full bg-gradient-to-l from-coral to-coin transition-[width] duration-1000 motion-reduce:transition-none"
                style={{ width: `${evolution.progress}%` }}
                data-testid="pet-evolution-fill"
              />
            </div>
            {evolution.milestones.map((milestone) => {
              const completed = milestone.state === 'completed';
              const current = milestone.state === 'current';
              return (
                <div
                  key={milestone.name}
                  className="absolute top-0 w-16 text-center"
                  style={{ right: `${milestone.at}%`, transform: 'translateX(50%)' }}
                  data-stage-state={milestone.state}
                  data-threshold={milestone.at}
                >
                  <span className={`mx-auto w-10 h-10 rounded-full border-2 grid place-items-center shadow-lg ${completed ? 'bg-emerald-400 border-emerald-300 text-ink' : current ? 'bg-coral border-coral text-ink ring-4 ring-coral/15' : 'bg-ink-soft border-white/15 text-cream/35'}`}>
                    {completed && <Check size={17} strokeWidth={3} aria-label="مكتملة" />}
                    {current && <CircleDot size={17} strokeWidth={3} aria-label="المرحلة الحالية" />}
                    {!completed && !current && <LockKeyhole size={14} aria-label="مرحلة مستقبلية" />}
                  </span>
                  <span className={`block text-[10px] font-black mt-1 ${current ? 'text-coral' : completed ? 'text-emerald-300' : 'text-cream/40'}`}>{milestone.name}</span>
                  <span className="block text-[9px] text-cream/40 font-bold">{milestone.at}%</span>
                  {current && <span className="block text-[8px] text-coral font-black">أنت هنا</span>}
                </div>
              );
            })}
          </div>

          <div className="rounded-2xl bg-coral/10 border border-coral/20 px-3 py-2.5 mt-2" data-testid="pet-next-milestone-explanation">
            {evolution.nextStage ? (
              <p className="text-[11px] text-cream/75 font-bold leading-relaxed">
                أضف <strong className="text-coral">{SAR_NUMBER.format(evolution.remainingAmount)} ر.س</strong> من مدخراتك الشخصية للوصول إلى مرحلة {evolution.nextStage.name}.
                <span className="block text-[9px] text-cream/45 mt-0.5">باقي {evolution.remainingPercentage}% من هدفك الشخصي حتى هذا المستوى.</span>
              </p>
            ) : (
              <p className="text-[11px] text-cream/75 font-bold leading-relaxed">وصل صقر إلى مرحلته النهائية؛ واصل الادخار الشخصي لإكمال هدفك.</p>
            )}
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
