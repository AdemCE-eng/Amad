import React from 'react';
import { PiggyBank, ArrowDownToLine } from 'lucide-react';

// Live category-budget board on Home. Each row shows spent / limit for the
// current period + a bar; the header shows the total that WILL sweep into
// savings when the periods close (via the time machine / next day).
const CADENCE_LABEL = { daily: 'يومي', weekly: 'أسبوعي', monthly: 'شهري' };

export default function BudgetOverview({ budgets, budgetPeriod = {}, projectedRollover = 0 }) {
  if (!budgets || Object.keys(budgets).length === 0) return null;

  return (
    <div className="bg-ink-card rounded-3xl p-4" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-coral-tile text-ink p-2 rounded-xl"><PiggyBank size={18} strokeWidth={1.9} /></div>
          <h3 className="font-black text-white">ميزانية المشتريات</h3>
        </div>
        <div className="text-left">
          <p className="text-[10px] text-cream/50 font-bold flex items-center gap-1 justify-end">
            <ArrowDownToLine size={11} /> المتبقّي للتوفير
          </p>
          <p className="text-lg font-black text-emerald-400 leading-tight">
            {Math.round(projectedRollover).toLocaleString('ar-SA')} <span className="text-[11px] text-cream/40">ر.س</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(budgets).map(([cat, cfg]) => {
          const spent = budgetPeriod[cat] || 0;
          const limit = cfg.limit || 0;
          const leftover = Math.max(0, limit - spent);
          const pct = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
          const over = spent > limit;
          return (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">{cfg.icon}</span>
                <span className="font-bold text-cream text-sm">{cfg.label}</span>
                <span className="text-[9px] font-bold text-cream/40 bg-white/5 px-1.5 py-0.5 rounded-full">{CADENCE_LABEL[cfg.cadence]}</span>
                <span className="mr-auto text-[11px] font-bold text-cream/60">
                  {spent.toLocaleString('ar-SA')} / {limit.toLocaleString('ar-SA')}
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${over ? 'bg-red-400' : 'bg-coral'}`}
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              {!over && leftover > 0 && (
                <p className="text-[10px] text-emerald-400/80 font-bold mt-0.5">
                  +{leftover.toLocaleString('ar-SA')} ر.س ستُحوّل للتوفير
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
