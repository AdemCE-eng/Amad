import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, RefreshCw, Sparkles, Trophy, Users, TrendingUp } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import { runStagedRequest } from '../lib/stagedRequest';
import RoleSwitch from '../components/ui/RoleSwitch';
import StagedProgress from '../components/ui/StagedProgress';
import CountUp from '../components/ui/CountUp';

export const CONTRIBUTION_STAGES = [
  'نحلل دخل والتزامات أفراد العائلة',
  'نحسب القدرة الادخارية لكل فرد',
  'نوزع المساهمات بشكل عادل',
  'الخطة جاهزة',
];
export const CONTRIBUTION_MIN_MS = 3200;

const PRIVACY_EXPLANATION =
  'تم احتساب المساهمة حسب القدرة الادخارية والالتزامات، مع الحفاظ على احتياطي الأمان.';

const MEMBER_AVATARS = {
  ahmed: { init: 'أ', bg: 'bg-coral/20', text: 'text-coral', bar: 'bg-coral' },
  sarah: { init: 'س', bg: 'bg-violet/25', text: 'text-violet', bar: 'bg-violet' },
  rashid: { init: 'ر', bg: 'bg-amber-400/20', text: 'text-amber-300', bar: 'bg-amber-400' },
};
const avatarOf = (id) => MEMBER_AVATARS[id] || MEMBER_AVATARS.rashid;

export default function FamilyGoalView() {
  const {
    family, contributionPlan, activeRole, savingsAccountOpened,
    setActiveView, runAction, isSubmitting, actionError,
  } = useAppData();
  const [openDetails, setOpenDetails] = useState(false);
  const [rewardMsg, setRewardMsg] = useState(null);
  const [visiblePlan, setVisiblePlan] = useState(contributionPlan);
  const [planStage, setPlanStage] = useState(-1);
  const [planError, setPlanError] = useState(null);
  const planRunning = useRef(false);
  const planRunId = useRef(0);

  useEffect(() => () => { planRunId.current += 1; planRunning.current = false; }, []);
  useEffect(() => {
    if (!planRunning.current && planStage === -1 && !planError) setVisiblePlan(contributionPlan);
  }, [contributionPlan, planError, planStage]);

  if (!family) {
    return <div className="bg-ink h-full grid place-items-center text-cream/60" dir="rtl">جارٍ تحميل العائلة…</div>;
  }

  if (!savingsAccountOpened) {
    return (
      <div className="bg-ink h-full overflow-y-auto px-5 pb-28 text-cream" dir="rtl">
        <header className="pt-5 pb-4">
          <h1 className="text-2xl font-black">العائلة</h1>
          <p className="text-xs text-cream/50 font-bold mt-1">هدف ادخار مشترك بخطة واضحة لكل فرد.</p>
        </header>
        <section className="mt-12 bg-ink-card rounded-3xl p-6 text-center">
          <Users size={34} className="mx-auto text-coral mb-3" />
          <h2 className="font-black text-lg">ابدأ بخطة التوفير أولًا</h2>
          <p className="text-sm text-cream/60 mt-2 leading-relaxed">بعد تفعيل الخطة ستظهر مساهمات العائلة وتفاصيل التوزيع هنا.</p>
          <button onClick={() => setActiveView('home')} className="mt-5 bg-coral text-ink font-black px-5 py-3 rounded-2xl">
            فعّل خطة التوفير
          </button>
        </section>
      </div>
    );
  }

  const { goalTitle, goalAmount, savedAmount, members, rewards = {} } = family;
  const progress = goalAmount > 0 ? Math.min(100, Math.round((savedAmount / goalAmount) * 100)) : 0;
  const memberList = Object.entries(members || {})
    .map(([id, member]) => ({ id, ...member }))
    .sort((a, b) => b.contributed - a.contributed);
  const allocations = visiblePlan?.allocations || null;

  const generateContributionPlan = async () => {
    if (planRunning.current) return;
    planRunning.current = true;
    const currentRun = ++planRunId.current;
    setVisiblePlan(null);
    setPlanError(null);
    setPlanStage(0);
    try {
      const response = await runStagedRequest({
        request: () => api.generatePlan(),
        stages: CONTRIBUTION_STAGES,
        minimumMs: CONTRIBUTION_MIN_MS,
        onStage: (index) => { if (planRunId.current === currentRun) setPlanStage(index); },
      });
      if (planRunId.current === currentRun) {
        setVisiblePlan(response.contributionPlan);
        setPlanStage(-1);
      }
    } catch {
      if (planRunId.current === currentRun) {
        setVisiblePlan(null);
        setPlanStage(-1);
        setPlanError('تعذر حساب خطة المساهمة. تحقق من الاتصال وحاول مرة أخرى.');
      }
    } finally {
      if (planRunId.current === currentRun) planRunning.current = false;
    }
  };

  const rewardChild = async (memberId) => {
    setRewardMsg(null);
    try {
      await api.sendReward({
        eventId: 'reward_demo_001', senderId: activeRole, recipientId: memberId,
        rewardType: 'akthr', amount: 25,
        message: 'تستاهل يا بطل، استمريت داخل ميزانيتك 7 أيام.',
      });
      setRewardMsg('تم إرسال مكافأة أكثر 🎁');
    } catch (error) {
      setRewardMsg(error.message === 'duplicate_reward' ? 'تمت المكافأة مسبقًا ✓' : 'تعذر إرسال المكافأة');
    }
    setTimeout(() => setRewardMsg(null), 2500);
  };

  return (
    <div className="bg-ink h-full overflow-y-auto overflow-x-hidden font-sans text-cream" dir="rtl">
      <header className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-black">العائلة</h1>
        <p className="text-xs text-cream/50 font-bold mt-1">خطتكم المشتركة ومساهمة كل فرد.</p>
      </header>

      <div className="px-5 pb-28 space-y-5">
        <RoleSwitch />

        <section className="bg-gradient-to-l from-coral/15 to-ink-card border border-coral/20 rounded-3xl p-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-xs text-cream/55 font-bold">الهدف العائلي</p>
              <h2 className="text-xl font-black mt-1">{goalTitle}</h2>
            </div>
            <span className="text-coral font-black">{progress}%</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden mt-4">
            <div className="h-full bg-coral rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <div className="flex justify-between text-xs font-bold mt-2">
            <span className="text-cream/55">{savedAmount} من {goalAmount} ر.س</span>
            <span className="text-violet">المتبقي {Math.max(0, goalAmount - savedAmount)} ر.س</span>
          </div>
        </section>

        {actionError && <p className="bg-red-500/10 text-red-300 rounded-2xl p-3 text-sm font-bold text-center">{actionError}</p>}

        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2"><Sparkles size={16} className="text-violet" /><h2 className="font-black">خطة المساهمة</h2></div>
            {visiblePlan && <span className="text-xs text-violet font-black">{visiblePlan.monthlyRequired} ر.س شهريًا</span>}
          </div>
          {planStage >= 0 ? (
            <div className="bg-violet/15 border border-violet/30 rounded-3xl p-5" aria-busy="true">
              <StagedProgress steps={CONTRIBUTION_STAGES} activeIndex={planStage} testId="contribution-progress" />
              <button type="button" disabled className="mt-4 w-full bg-violet/50 text-white/70 font-black px-5 py-2.5 rounded-2xl cursor-wait">جارٍ حساب الخطة…</button>
            </div>
          ) : planError ? (
            <div className="bg-red-500/10 border border-red-400/20 rounded-3xl p-5 text-center" role="alert">
              <p className="text-sm text-red-200 font-bold">{planError}</p>
              <button type="button" onClick={generateContributionPlan} className="mt-4 bg-white/10 text-cream font-black px-5 py-2.5 rounded-2xl inline-flex items-center gap-2"><RefreshCw size={15} /> إعادة المحاولة</button>
            </div>
          ) : !allocations ? (
            <div className="bg-violet/15 border border-violet/30 rounded-3xl p-5 text-center">
              <p className="text-sm text-cream/70 leading-relaxed">ولّد توزيعًا عادلًا حسب القدرة الادخارية لكل فرد.</p>
              <button type="button" onClick={generateContributionPlan} className="mt-4 bg-violet text-white font-black px-5 py-2.5 rounded-2xl">ولّد الخطة</button>
            </div>
          ) : (
            <div className="space-y-2">
              {memberList.map((member) => {
                const allocation = allocations[member.id];
                if (!allocation) return null;
                const isSelf = member.id === activeRole;
                return (
                  <article key={member.id} className="bg-ink-card rounded-2xl p-3">
                    <div className="flex items-center gap-3">
                      <span className={`w-10 h-10 rounded-full grid place-items-center font-black ${avatarOf(member.id).bg} ${avatarOf(member.id).text}`}>{avatarOf(member.id).init}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-sm">{member.name}{isSelf && <span className="mr-2 text-[9px] text-coral">أنت</span>}</p>
                        <p className="text-[11px] text-cream/55 font-bold">ساهم حتى الآن بـ {member.contributed} ر.س</p>
                      </div>
                      <span className="text-coral font-black text-sm"><CountUp value={allocation.amount} decimals={0} duration={0.65} startFrom={0} /> ر.س</span>
                    </div>
                    {isSelf ? (
                      <div className="mt-2">
                        <button onClick={() => setOpenDetails((value) => !value)} className="flex items-center gap-1 text-[11px] text-cream/60 font-bold">
                          <ChevronDown size={13} className={openDetails ? 'rotate-180' : ''} /> كيف حُسبت مساهمتي؟
                        </button>
                        {openDetails && <p className="mt-2 bg-white/5 rounded-xl p-3 text-[11px] text-cream/65 leading-relaxed">{allocation.explanation}</p>}
                      </div>
                    ) : <p className="mt-2 text-[11px] text-cream/55 leading-relaxed">{PRIVACY_EXPLANATION}</p>}
                  </article>
                );
              })}
              <button type="button" onClick={generateContributionPlan} className="w-full pt-3 text-xs text-cream/50 font-bold inline-flex items-center justify-center gap-2"><RefreshCw size={13} /> إعادة حساب الخطة</button>
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3 px-1"><Trophy size={16} className="text-coral" /><h2 className="font-black">مساهمات العائلة</h2></div>
          <div className="space-y-2">
            {memberList.map((member, index) => (
              <article key={member.id} className="bg-ink-card rounded-2xl p-3 flex items-center gap-3">
                <span className="text-xs text-cream/40 font-black">{index + 1}</span>
                <span className={`w-9 h-9 rounded-full grid place-items-center font-black ${avatarOf(member.id).bg} ${avatarOf(member.id).text}`}>{avatarOf(member.id).init}</span>
                <div className="flex-1 min-w-0"><p className="font-black text-sm">{member.name}</p><p className="text-[11px] text-cream/50">{member.relation}</p></div>
                <span className="font-black text-sm">{member.contributed} ر.س</span>
                {activeRole === 'ahmed' && member.role === 'child' && (
                  rewards.reward_demo_001
                    ? <span className="text-[11px] text-emerald-300 font-black">تمت ✓</span>
                    : <button disabled={isSubmitting} onClick={() => rewardChild(member.id)} className="bg-coral-tile text-ink text-[10px] font-black px-2.5 py-1.5 rounded-xl">كافئه بأكثر</button>
                )}
              </article>
            ))}
          </div>
        </section>

        <button onClick={() => setActiveView('opportunities')} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between text-right">
          <span><strong className="block">استكشف فرص التوفير</strong><small className="text-cream/50">فرص مخصصة تساعد الهدف العائلي.</small></span>
          <TrendingUp className="text-coral" />
        </button>
      </div>

      {rewardMsg && <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-ink-card border border-emerald-400/30 px-5 py-3 rounded-2xl shadow-2xl z-50 whitespace-nowrap text-sm font-bold">{rewardMsg}</div>}
    </div>
  );
}
