import React, { useState } from 'react';
import { X, Sparkles, TrendingUp, Check, ChevronLeft } from 'lucide-react';
import { useAppData } from '../../context/AppDataContext';
import { api } from '../../lib/api';
import { burst } from '../../lib/confetti';
import Mascot from '../mascot/Mascot';

// Activation flow, three linked steps:
//   1) income      → the algorithm proposes a plan
//   2) plan (EDIT) → the user can tweak the savings target + every budget
//   3) companion   → pick + name the pet; it's bound to the plan on apply
// Applying does BOTH in one action: /api/plan/apply (opens account, installs the
// edited budgets, sets the goal) + /api/user/profile (the chosen companion).
const INCOME_PRESETS = [4000, 8000, 15000, 25000];
const CADENCE_LABEL = { daily: 'يومي', weekly: 'أسبوعي', monthly: 'شهري' };
const NAME_SUGGESTIONS = ['صقر', 'سعود', 'رزين', 'وفرة'];
const COMPANIONS = [
  { id: 'falcon', name: 'صقر', available: true },
  { id: 'camel', name: 'جمل', available: false },
  { id: 'cat', name: 'قط', available: false },
];

export default function SavingsPlanSheet({ onClose }) {
  const { runAction, isSubmitting } = useAppData();
  const [step, setStep] = useState('income');
  const [income, setIncome] = useState('8000');
  const [plan, setPlan] = useState(null);
  const [budgets, setBudgets] = useState(null);   // editable copy
  const [target, setTarget] = useState(0);        // editable monthly savings
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [petType, setPetType] = useState('falcon');
  const [petName, setPetName] = useState('');

  const incomeNum = parseFloat(income) || 0;
  const goal = Math.max(1, Math.round(target * 12));
  const ratePct = incomeNum > 0 ? Math.round((target / incomeNum) * 100) : 0;

  const compute = async () => {
    if (!incomeNum || incomeNum <= 0) return;
    setLoadingPlan(true);
    try {
      const res = await api.suggestPlan(incomeNum);
      setPlan(res.plan);
      // deep copy the budgets so edits don't mutate the response
      setBudgets(JSON.parse(JSON.stringify(res.plan.budgets)));
      setTarget(res.plan.monthlyTarget);
      setStep('plan');
    } catch { /* offline demo: stay on income step */ }
    setLoadingPlan(false);
  };

  const editLimit = (cat, value) => {
    const n = Math.max(0, Math.round(parseFloat(value) || 0));
    setBudgets((b) => ({ ...b, [cat]: { ...b[cat], limit: n } }));
  };

  const apply = () => {
    runAction(async () => {
      await api.applyPlan({ monthlyIncome: incomeNum, budgets, monthlyTarget: target, goalAmount: goal });
      await api.setProfile({ petName: petName.trim() || 'صقر', petType, goalAmount: goal });
    }).then(() => {
      burst();
      onClose();
    });
  };

  const DOTS = ['income', 'plan', 'pet'];

  return (
    <div className="absolute inset-0 z-[70] flex items-end justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full bg-ink-card rounded-t-3xl p-5 pb-8 max-h-[92%] overflow-y-auto border-t border-white/10 shadow-2xl">
        {/* header + progress dots */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {step !== 'income' && (
              <button onClick={() => setStep(step === 'pet' ? 'plan' : 'income')} className="text-cream/50 hover:text-white p-1 rotate-180"><ChevronLeft size={20} /></button>
            )}
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles size={20} className="text-coral" />
              {step === 'income' ? 'خطّط ادخارك' : step === 'plan' ? 'راجع وعدّل خطتك' : 'اختر مرافقك'}
            </h2>
          </div>
          <div className="flex items-center gap-1.5">
            {DOTS.map((d) => (
              <span key={d} className={`h-1.5 rounded-full transition-all ${d === step ? 'w-5 bg-coral' : 'w-1.5 bg-white/20'}`} />
            ))}
            <button onClick={onClose} className="text-cream/50 hover:text-white p-1 mr-1"><X size={20} /></button>
          </div>
        </div>

        {/* ── Step 1: income ── */}
        {step === 'income' && (
          <>
            <p className="text-sm text-cream/50 font-medium mb-5">
              أدخل دخلك الشهري ونقترح لك نسبة ادخار وميزانية لكل فئة — والمتبقّي من كل ميزانية يذهب تلقائياً لحساب التوفير.
            </p>
            <label className="block text-xs font-bold text-cream/60 mb-2">الدخل الشهري (ر.س)</label>
            <input
              type="number" inputMode="numeric" value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full text-center text-2xl font-black bg-white/10 text-cream border-2 border-white/15 focus:border-coral rounded-2xl py-3 outline-none"
              placeholder="مثال: 8000"
            />
            <div className="flex gap-2 mt-3 flex-wrap">
              {INCOME_PRESETS.map((p) => (
                <button
                  key={p}
                  onClick={() => setIncome(String(p))}
                  className={`px-4 py-2 rounded-full text-sm font-bold border ${String(p) === income ? 'bg-coral text-ink border-coral' : 'bg-white/10 border-white/10 text-cream/70'}`}
                >
                  {p.toLocaleString('ar-SA')}
                </button>
              ))}
            </div>
            <button
              onClick={compute}
              disabled={loadingPlan}
              className="mt-6 w-full bg-white text-ink font-black py-3.5 rounded-2xl active:scale-95 transition-transform disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <TrendingUp size={18} /> {loadingPlan ? '…' : 'احسب الخطة'}
            </button>
          </>
        )}

        {/* ── Step 2: editable plan ── */}
        {step === 'plan' && plan && budgets && (
          <>
            <div className="bg-ink-soft rounded-2xl p-4 mb-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-cream/60">الادخار الشهري (ر.س)</label>
                <span className="text-[11px] font-bold text-coral">{ratePct}% من الدخل · هدف سنوي {goal.toLocaleString('ar-SA')}</span>
              </div>
              <input
                type="number" inputMode="numeric" value={target}
                onChange={(e) => setTarget(Math.max(0, Math.round(parseFloat(e.target.value) || 0)))}
                className="mt-2 w-full text-center text-2xl font-black bg-white/10 text-emerald-400 border-2 border-white/15 focus:border-coral rounded-xl py-2.5 outline-none"
              />
            </div>

            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-black text-cream">ميزانيات الفئات</h3>
              <span className="text-[10px] text-cream/40 font-bold">عدّل أي مبلغ</span>
            </div>
            <div className="space-y-2">
              {Object.entries(budgets).map(([cat, cfg]) => (
                <div key={cat} className="bg-ink-soft rounded-2xl p-3 flex items-center gap-3">
                  <span className="text-xl">{cfg.icon}</span>
                  <span className="font-bold text-cream text-sm flex-1">{cfg.label}</span>
                  <span className="text-[10px] font-bold text-cream/40 bg-white/5 px-2 py-1 rounded-full">{CADENCE_LABEL[cfg.cadence]}</span>
                  <input
                    type="number" inputMode="numeric" value={cfg.limit}
                    onChange={(e) => editLimit(cat, e.target.value)}
                    className="w-20 text-center font-black text-white bg-white/10 border border-white/15 focus:border-coral rounded-lg py-1.5 outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={() => setStep('pet')}
              className="mt-6 w-full bg-coral text-ink font-black py-4 rounded-2xl active:scale-95 transition-transform shadow-lg shadow-coral/20 flex items-center justify-center gap-2"
            >
              التالي — اختر مرافقك <ChevronLeft size={18} />
            </button>
          </>
        )}

        {/* ── Step 3: pick + name the companion, bound to the plan ── */}
        {step === 'pet' && (
          <>
            <p className="text-sm text-cream/50 font-medium mb-3">
              مرافقك يرتبط بخطتك مباشرة — ينمو كل ما اقتربت من هدفك ({goal.toLocaleString('ar-SA')} ر.س).
            </p>
            <div className="flex justify-center my-2">
              <Mascot emotion={petName ? 'happy' : 'idle'} stage={0} size={130} />
            </div>
            <div className="flex gap-3 justify-center">
              {COMPANIONS.map((c) => (
                <button
                  key={c.id}
                  disabled={!c.available}
                  onClick={() => c.available && setPetType(c.id)}
                  className={`px-5 py-3 rounded-2xl font-bold text-sm border-2 ${
                    !c.available ? 'bg-white/5 border-white/10 text-cream/30'
                      : petType === c.id ? 'bg-white border-coral text-ink shadow-md scale-105'
                      : 'bg-white/10 border-white/10 text-cream/80'
                  }`}
                >
                  {c.name}
                  {!c.available && <span className="block text-[9px] mt-0.5">قريبًا</span>}
                </button>
              ))}
            </div>

            <input
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder="سمِّ مرافقك…"
              maxLength={20}
              className="mt-5 w-full text-center text-xl font-black bg-white/10 text-cream placeholder:text-cream/30 border-2 border-white/15 focus:border-coral rounded-2xl py-3 outline-none"
            />
            <div className="flex gap-2 mt-3 flex-wrap justify-center">
              {NAME_SUGGESTIONS.map((n) => (
                <button key={n} onClick={() => setPetName(n)} className="px-4 py-1.5 bg-white/10 border border-white/10 rounded-full text-sm font-bold text-cream/80 hover:border-coral">
                  {n}
                </button>
              ))}
            </div>

            <button
              onClick={apply}
              disabled={isSubmitting}
              className="mt-6 w-full bg-coral text-ink font-black py-4 rounded-2xl active:scale-95 transition-transform disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-coral/20"
            >
              <Check size={20} /> {isSubmitting ? '…' : `فعّل الخطة وابدأ مع ${petName.trim() || 'مرافقك'}`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
