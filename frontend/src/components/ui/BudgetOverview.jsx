import React from 'react';
import { PiggyBank, ArrowDownToLine, ChevronLeft } from 'lucide-react';
import BudgetCategoryList, { budgetEntries } from '../budget/BudgetCategoryList';

// Live category-budget board on Home. Each row shows spent / limit for the
// current period + a bar; the header shows the total that WILL sweep into
// savings when the periods close (via the time machine / next day).
const HOME_CATEGORY_LIMIT = 3;

export default function BudgetOverview({ budgets, budgetPeriod = {}, projectedRollover = 0, onOpenDetails }) {
  if (!budgets || Object.keys(budgets).length === 0) return null;
  const entries = budgetEntries(budgets);
  const visibleEntries = entries.slice(0, HOME_CATEGORY_LIMIT);

  return (
    <section className="bg-ink-card rounded-3xl p-4" dir="rtl" data-testid="home-budget-summary">
      <div className="flex items-center justify-between mb-3">
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

      <BudgetCategoryList entries={visibleEntries} budgetPeriod={budgetPeriod} compact />
      {entries.length > HOME_CATEGORY_LIMIT && onOpenDetails && (
        <button type="button" onClick={onOpenDetails} className="mt-3 w-full border-t border-white/5 pt-3 flex items-center justify-between text-xs text-coral font-black" data-testid="open-budget-details">
          عرض تفاصيل الميزانية <ChevronLeft size={15} />
        </button>
      )}
    </section>
  );
}
