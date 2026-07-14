import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronDown, Hourglass, Search, Sparkles, TrendingUp } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import { runStagedRequest } from '../lib/stagedRequest';
import StagedProgress from '../components/ui/StagedProgress';

export const ANALYSIS_STEPS = [
  'نقرأ أنماط مشترياتك',
  'نقدّر احتمالية الشراء',
  'نحلل المواسم وحملات التجار',
  'نقارن فرص التوفير بميزانيتك',
  'نرتب أفضل الفرص لك',
];
export const ANALYSIS_MIN_MS = 4800;

function actionLabel(action) {
  if (action === 'wait_for_offer') return 'انتظر العرض المتوقع';
  if (action === 'buy_now') return 'اشترِ الآن';
  return 'غير مناسب حاليًا';
}

function OpportunityCard({ opportunity, featured, activeRole, isSubmitting, runAction }) {
  const status = opportunity.persisted?.status || 'pending';
  return (
    <article
      data-testid="recommendation-card"
      className={`rounded-3xl p-4 border ${featured ? 'bg-gradient-to-l from-coral/20 to-ink-card border-coral/35' : 'bg-ink-card border-white/5'} ${status === 'settled' ? '!bg-emerald-400/10 !border-emerald-400/25' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-black text-cream">{opportunity.merchantNameAr}</p>
          <p className="text-[11px] text-coral font-bold mt-0.5">{opportunity.occasion}</p>
        </div>
        <span className="bg-coral/15 text-coral text-xs font-black px-2.5 py-1 rounded-full shrink-0">
          {Math.round(opportunity.offerProbability * 100)}٪
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-3">
        <div className="bg-white/5 rounded-xl p-2 text-center"><span className="block text-[9px] text-cream/45">ملاءمة الشراء</span><strong className="text-xs">{Math.round(opportunity.purchaseProbability * 100)}٪</strong></div>
        <div className="bg-white/5 rounded-xl p-2 text-center"><span className="block text-[9px] text-cream/45">التوفير</span><strong className="text-xs">{opportunity.estimatedSavingSar} ر.س</strong></div>
        <div className="bg-white/5 rounded-xl p-2 text-center"><span className="block text-[9px] text-cream/45">النافذة</span><strong className="text-xs">{opportunity.windowDays} أيام</strong></div>
      </div>

      <p className="text-[11px] text-cream/60 leading-relaxed mt-3">{opportunity.explanation}</p>
      <p className="text-xs font-black text-violet mt-2">التوصية: {actionLabel(opportunity.action)}</p>

      <div className="mt-3">
        {status === 'pending' && activeRole === 'rashid' && opportunity.action === 'wait_for_offer' && (
          <div className="grid grid-cols-[1fr_auto] gap-2">
            <button disabled={isSubmitting} onClick={() => runAction(() => api.decideOffer(opportunity.offerId, 'wait'))} className="bg-coral text-ink font-black text-sm py-2.5 rounded-2xl disabled:opacity-50">
              أنتظر العرض المتوقع
            </button>
            <button disabled={isSubmitting} onClick={() => runAction(() => api.decideOffer(opportunity.offerId, 'ignore'))} className="bg-white/5 text-cream/60 font-bold text-xs px-3 rounded-2xl disabled:opacity-50">
              تجاهل
            </button>
          </div>
        )}
        {status === 'pending' && activeRole !== 'rashid' && <p className="text-[11px] text-cream/55 text-center font-bold">بانتظار قرار راشد</p>}
        {status === 'waiting' && <p className="flex justify-center items-center gap-1.5 bg-amber-400/10 text-amber-300 rounded-2xl py-2.5 text-xs font-bold"><Hourglass size={13} /> بانتظار وصول العرض</p>}
        {status === 'settled' && <p className="flex justify-center items-center gap-1.5 bg-emerald-400/10 text-emerald-300 rounded-2xl py-2.5 text-xs font-black"><CheckCircle2 size={14} /> وصل العرض وأضيف التوفير لهدف العائلة</p>}
        {status === 'ignored' && <p className="text-center text-xs text-cream/50 font-bold">تم تجاهل الفرصة</p>}
      </div>
    </article>
  );
}

export default function OpportunitiesView() {
  const {
    opportunityResult, setOpportunityResult, offers, activeRole,
    savingsAccountOpened, setActiveView, runAction, isSubmitting,
  } = useAppData();
  const [analysisStep, setAnalysisStep] = useState(-1);
  const [analysisError, setAnalysisError] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const running = useRef(false);
  const runId = useRef(0);

  useEffect(() => () => { runId.current += 1; running.current = false; }, []);

  const runAnalysis = async () => {
    if (running.current) return;
    running.current = true;
    const currentRun = ++runId.current;
    setOpportunityResult(null);
    setAnalysisError(null);
    setExpanded(false);
    setAnalysisStep(0);
    try {
      const result = await runStagedRequest({
        request: () => api.personalizedRecommendations('rashid'),
        stages: ANALYSIS_STEPS,
        minimumMs: ANALYSIS_MIN_MS,
        onStage: (index) => { if (runId.current === currentRun) setAnalysisStep(index); },
      });
      if (runId.current === currentRun) setOpportunityResult(result);
    } catch {
      if (runId.current === currentRun) setAnalysisError('تعذر إكمال التحليل. حاول مرة أخرى.');
    } finally {
      if (runId.current === currentRun) { setAnalysisStep(-1); running.current = false; }
    }
  };

  if (!savingsAccountOpened) {
    return (
      <div className="bg-ink h-full overflow-y-auto px-5 pb-28 text-cream" dir="rtl">
        <header className="pt-5 pb-4"><h1 className="text-2xl font-black">فرص التوفير</h1><p className="text-xs text-cream/50 font-bold mt-1">توصيات مخصصة قبل قرار الشراء.</p></header>
        <section className="mt-12 bg-ink-card rounded-3xl p-6 text-center">
          <TrendingUp size={34} className="mx-auto text-coral mb-3" />
          <h2 className="font-black text-lg">فعّل خطة التوفير أولًا</h2>
          <p className="text-sm text-cream/60 mt-2">نستخدم ميزانيتك لفهم مدى ملاءمة كل فرصة لك.</p>
          <button onClick={() => setActiveView('home')} className="mt-5 bg-coral text-ink font-black px-5 py-3 rounded-2xl">فعّل خطة التوفير</button>
        </section>
      </div>
    );
  }

  const opportunities = (opportunityResult?.recommendations || []).map((item) => ({
    ...item,
    persisted: offers?.predicted?.[item.offerId] || null,
  }));
  const best = opportunities[0];
  const additional = opportunities.slice(1);
  const visibleAdditional = expanded ? additional : additional.slice(0, 3);

  return (
    <div className="bg-ink h-full overflow-y-auto overflow-x-hidden font-sans text-cream" dir="rtl">
      <header className="px-5 pt-5 pb-3">
        <h1 className="text-2xl font-black">فرص التوفير</h1>
        <p className="text-xs text-cream/50 font-bold mt-1">نرتب فرص التجار حسب احتمالية العرض وملاءمتها لميزانيتك.</p>
      </header>

      <div className="px-5 pb-28 space-y-5">
        {!opportunityResult && analysisStep === -1 && !analysisError && (
          <section className="bg-gradient-to-l from-coral/15 to-ink-card border border-coral/25 rounded-3xl p-6 text-center">
            <Sparkles size={30} className="mx-auto text-coral mb-3" />
            <h2 className="font-black text-lg">اكتشف أفضل فرصة لك</h2>
            <p className="text-sm text-cream/60 mt-2 leading-relaxed">تحليل جديد لنمط مشترياتك والمواسم والحملات السابقة.</p>
            <button type="button" onClick={runAnalysis} className="mt-5 bg-coral text-ink font-black px-5 py-3 rounded-2xl inline-flex items-center gap-2"><Search size={16} /> حلّل فرص التوفير</button>
          </section>
        )}

        {analysisStep >= 0 && (
          <section className="bg-ink-card rounded-3xl p-5" aria-busy="true">
            <StagedProgress steps={ANALYSIS_STEPS} activeIndex={analysisStep} testId="analysis-progress" />
            <button type="button" disabled className="mt-4 w-full bg-coral/40 text-cream/60 font-black py-2.5 rounded-2xl cursor-wait">جارٍ تحليل الفرص…</button>
          </section>
        )}
        {analysisError && (
          <section className="bg-red-500/10 border border-red-400/20 text-red-200 rounded-3xl p-5 text-center" role="alert">
            <p className="text-sm font-bold">{analysisError}</p>
            <button type="button" onClick={runAnalysis} className="mt-4 bg-white/10 text-cream px-5 py-2.5 rounded-2xl text-sm font-black">إعادة المحاولة</button>
          </section>
        )}

        {opportunityResult && !best && <div className="bg-ink-card rounded-3xl p-6 text-center text-cream/60 font-bold">لا توجد فرصة مناسبة حاليًا.</div>}

        {best && (
          <section data-testid="best-opportunity">
            <div className="flex items-center gap-2 mb-3 px-1"><Sparkles size={16} className="text-coral" /><h2 className="font-black">أفضل فرصة لك</h2></div>
            <OpportunityCard opportunity={best} featured activeRole={activeRole} isSubmitting={isSubmitting} runAction={runAction} />
          </section>
        )}

        {visibleAdditional.length > 0 && (
          <section data-testid="additional-opportunities">
            <div className="flex items-center gap-2 mb-3 px-1"><TrendingUp size={16} className="text-violet" /><h2 className="font-black">فرص أخرى</h2></div>
            <div className="space-y-3">{visibleAdditional.map((item) => <OpportunityCard key={item.offerId || item.merchantId} opportunity={item} activeRole={activeRole} isSubmitting={isSubmitting} runAction={runAction} />)}</div>
          </section>
        )}

        {additional.length > 3 && (
          <button data-testid="opportunity-toggle" onClick={() => setExpanded((value) => !value)} className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 text-sm font-black flex items-center justify-center gap-2">
            {expanded ? 'عرض أقل' : 'عرض المزيد'} <ChevronDown size={16} className={expanded ? 'rotate-180' : ''} />
          </button>
        )}

        {opportunityResult && <button onClick={runAnalysis} className="w-full text-xs text-cream/50 font-bold py-2">إعادة التحليل</button>}
      </div>
    </div>
  );
}
