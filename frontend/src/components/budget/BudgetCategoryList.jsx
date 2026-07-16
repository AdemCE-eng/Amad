import React from 'react';

export const CADENCE_LABEL = { daily: 'يومي', weekly: 'أسبوعي', monthly: 'شهري' };

export function budgetEntries(budgets) {
  return Object.entries(budgets || {});
}

export default function BudgetCategoryList({ entries, budgetPeriod = {}, compact = false }) {
  return (
    <div className={compact ? 'space-y-2.5' : 'space-y-4'} data-testid="budget-category-list">
      {entries.map(([category, config]) => {
        const spent = budgetPeriod[category] || 0;
        const limit = config.limit || 0;
        const leftover = Math.max(0, limit - spent);
        const utilization = limit > 0 ? Math.min(100, Math.round((spent / limit) * 100)) : 0;
        const over = spent > limit;

        return (
          <article key={category} data-testid="budget-category-row">
            <div className="flex items-center gap-2 mb-1">
              <span className={compact ? 'text-sm' : 'text-base'} aria-hidden="true">{config.icon}</span>
              <span className={`font-bold text-cream ${compact ? 'text-xs' : 'text-sm'}`}>{config.label}</span>
              <span className="text-[9px] font-bold text-cream/40 bg-white/5 px-1.5 py-0.5 rounded-full">{CADENCE_LABEL[config.cadence]}</span>
              <span className="mr-auto text-[11px] font-bold text-cream/60">
                {spent.toLocaleString('ar-SA-u-nu-latn')} / {limit.toLocaleString('ar-SA-u-nu-latn')}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-1.5 rounded-full transition-[width] duration-700 motion-reduce:transition-none ${over ? 'bg-red-400' : 'bg-coral'}`}
                style={{ width: `${utilization}%` }}
              />
            </div>
            {!over && leftover > 0 && (
              <p className="text-[10px] text-emerald-400/80 font-bold mt-0.5">
                +{leftover.toLocaleString('ar-SA-u-nu-latn')} ر.س ستُحوّل للتوفير
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
