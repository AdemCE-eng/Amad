import React, { useEffect, useState } from 'react';
import { X, ShieldCheck, HeartPulse } from 'lucide-react';
import SarAmount from './SarAmount';

// In-app replacement for window.prompt() on the emergency-withdrawal flow.
// Bottom-sheet style, RTL, no browser-native dialogs anywhere in this path.
// Reason is cosmetic only (folded into the existing `label` string the
// backend already accepts) — no new field, no contract change.
const REASONS = ['ظرف صحي', 'إصلاح عاجل', 'التزام أساسي', 'سبب آخر'];

export default function EmergencyWithdrawModal({
  open,
  onClose,
  onConfirm,
  savingsBalance,
  accountBalance,
  shieldsRemaining,
  isSubmitting,
  petName = 'صقر',
}) {
  const [amount, setAmount] = useState('200');
  const [reason, setReason] = useState(null);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [usedShield, setUsedShield] = useState(false);

  // Reset transient state whenever the sheet re-opens.
  useEffect(() => {
    if (open) { setAmount('200'); setReason(null); setError(null); setDone(false); setUsedShield(false); }
  }, [open]);

  // Escape closes — but never mid-submit, so an in-flight request can't be
  // orphaned from its own confirmation UI.
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === 'Escape' && !isSubmitting) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, isSubmitting, onClose]);

  if (!open) return null;

  const amt = parseFloat(amount);
  const validAmount = Number.isFinite(amt) && amt > 0;
  const overSavings = validAmount && amt > savingsBalance;
  const shielded = shieldsRemaining > 0;
  const savingsAfter = validAmount ? Math.max(0, savingsBalance - amt) : savingsBalance;
  const accountAfter = validAmount ? accountBalance + amt : accountBalance;

  const validate = () => {
    if (!amount.trim() || Number.isNaN(amt)) return 'أدخل رقماً صحيحاً للمبلغ';
    if (amt <= 0) return 'المبلغ يجب أن يكون أكبر من صفر';
    if (amt > savingsBalance) return 'المبلغ أكبر من مدخراتك المتاحة';
    return null;
  };

  const submit = async () => {
    if (isSubmitting) return; // duplicate-submit guard
    const v = validate();
    if (v) { setError(v); return; }
    setError(null);
    const label = reason ? `سحب طارئ: ${reason}` : 'سحب طارئ';
    try {
      setUsedShield(shielded);
      await onConfirm(amt, label);
      setDone(true);
    } catch {
      setError('تعذر إتمام السحب، حاول مرة أخرى');
    }
  };

  return (
    <div className="absolute inset-0 z-[80] flex items-end justify-center" dir="rtl">
      {/* Backdrop — click closes unless a request is in flight */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />

      {/* Sheet — bottom-anchored, clears BottomNav, capped so it never
          overflows the 390px frame width or its own height */}
      <div className="relative w-full max-w-full bg-ink-card rounded-t-[2rem] pb-8 pt-3 px-5 max-h-[88%] overflow-y-auto shadow-2xl">
        <div className="w-10 h-1.5 bg-white/15 rounded-full mx-auto mb-4" />

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-cream text-lg">سحب طارئ</h2>
          <button
            onClick={() => !isSubmitting && onClose()}
            className="text-cream/50 hover:text-cream p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {done ? (
          <div className="py-6 text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${usedShield ? 'bg-emerald-400/15' : 'bg-coral/15'}`}>
              {usedShield
                ? <ShieldCheck size={30} className="text-emerald-400" />
                : <HeartPulse size={30} className="text-coral" />}
            </div>
            <p className="font-black text-cream text-lg mb-2">تم السحب بنجاح</p>
            <p className="text-sm text-cream/70 leading-relaxed mb-6">
              نُقل المبلغ من المدخرات إلى رصيد الحساب{usedShield ? `، وحمى الدرع صحة ${petName}.` : `، وتأثرت صحة ${petName} حسب نسبة السحب.`}
            </p>
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl font-black bg-coral text-ink active:scale-[0.98] transition-transform"
            >
              تم
            </button>
          </div>
        ) : (
          <>
            {/* Amount */}
            <label className="block text-[11px] font-bold text-cream/50 mb-1.5">المبلغ (⃁)</label>
            <input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(null); }}
              className="w-full bg-white/5 border border-white/10 focus:border-coral rounded-2xl px-4 py-3 text-cream font-black text-lg outline-none"
              placeholder="200"
            />
            {error && <p className="text-red-400 text-[12px] font-bold mt-1.5">{error}</p>}

            {/* Reason — optional */}
            <label className="block text-[11px] font-bold text-cream/50 mt-4 mb-2">سبب السحب (اختياري)</label>
            <div className="flex flex-wrap gap-2">
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(reason === r ? null : r)}
                  className={`px-3 py-1.5 rounded-full text-[12px] font-bold border transition-colors ${
                    reason === r ? 'bg-coral text-ink border-coral' : 'bg-white/5 text-cream/70 border-white/10'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {/* Summary before confirmation */}
            <div className="bg-white/5 rounded-2xl p-4 mt-4 space-y-2">
              <div className="flex justify-between text-[13px]">
                <span className="text-cream/60 font-bold">المدخرات الحالية</span>
                <SarAmount value={savingsBalance.toFixed(2)} className="text-cream font-black" />
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-cream/60 font-bold">المدخرات بعد السحب</span>
                <SarAmount value={savingsAfter.toFixed(2)} className={`font-black ${overSavings ? 'text-red-400' : 'text-cream'}`} />
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-cream/60 font-bold">رصيد الحساب بعد التحويل</span>
                <SarAmount value={accountAfter.toFixed(2)} className="text-emerald-300 font-black" />
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-cream/60 font-bold">دروع الطوارئ المتبقية</span>
                <span className="text-cream font-black">{shieldsRemaining}</span>
              </div>
              <div className="h-px bg-white/10 my-1" />
              <div className="flex items-center gap-2 text-[12px]">
                <HeartPulse size={14} className={shielded ? 'text-emerald-400' : 'text-red-400'} />
                <span className={shielded ? 'text-emerald-300 font-bold' : 'text-red-300 font-bold'}>
                  {shielded ? `صحة ${petName} محمية بالكامل` : `لا يوجد درع متبقٍ، قد تتأثر صحة ${petName}`}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => !isSubmitting && onClose()}
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-2xl font-black bg-white/5 text-cream/80 disabled:opacity-50"
              >
                إلغاء
              </button>
              <button
                onClick={submit}
                disabled={isSubmitting || !validAmount || overSavings}
                className="flex-[2] py-3.5 rounded-2xl font-black bg-coral text-ink active:scale-[0.98] transition-transform disabled:opacity-50"
              >
                {isSubmitting ? '...جارٍ السحب' : 'تأكيد السحب'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
