import React from 'react';
import { ArrowDownToLine, PiggyBank, WalletCards } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import BudgetCategoryList, { budgetEntries } from '../components/budget/BudgetCategoryList';
import NestedPageHeader from '../components/ui/NestedPageHeader';

export default function BudgetDetailsView() {
  const { user, budgets, budgetPeriod, projectedRollover, setActiveView } = useAppData();
  const entries = budgetEntries(budgets);
  const totalLimit = entries.reduce((sum, [, config]) => sum + (config.limit || 0), 0);
  const totalSpent = entries.reduce((sum, [category]) => sum + (budgetPeriod[category] || 0), 0);

  return (
    <div className="bg-ink h-full overflow-y-auto overflow-x-hidden text-cream" dir="rtl">
      <NestedPageHeader title="تفاصيل الميزانية" subtitle="كل الفئات ودورة التوفير المرتبطة بها." onBack={() => setActiveView('home')} />
      <main className="px-5 pb-10 space-y-5">
        <section className="bg-gradient-to-l from-coral/15 to-ink-card border border-coral/20 rounded-3xl p-4" data-testid="budget-overall-summary">
          <div className="flex items-center gap-2 text-coral font-black text-sm"><PiggyBank size={17} /> ملخص الميزانية</div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="bg-white/5 rounded-2xl p-3"><span className="block text-[10px] text-cream/45 font-bold">المستخدم حاليًا</span><strong className="text-lg">{totalSpent.toLocaleString('ar-SA')} <small className="text-cream/40">ر.س</small></strong></div>
            <div className="bg-white/5 rounded-2xl p-3"><span className="block text-[10px] text-cream/45 font-bold">حدود الفئات</span><strong className="text-lg">{totalLimit.toLocaleString('ar-SA')} <small className="text-cream/40">ر.س</small></strong></div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="flex items-center gap-2 bg-emerald-400/10 text-emerald-300 rounded-2xl p-3"><ArrowDownToLine size={16} /><span><small className="block text-[9px] font-bold">متوقع للتوفير</small><strong>{Math.round(projectedRollover).toLocaleString('ar-SA')} ر.س</strong></span></div>
            <div className="flex items-center gap-2 bg-violet/10 text-violet rounded-2xl p-3"><WalletCards size={16} /><span><small className="block text-[9px] font-bold">تم ترحيله سابقًا</small><strong>{(user.rolloverTotal || 0).toLocaleString('ar-SA')} ر.س</strong></span></div>
          </div>
        </section>

        <section className="bg-ink-card rounded-3xl p-4" data-testid="budget-details-categories">
          <div className="flex items-center justify-between mb-4"><h2 className="font-black">كل فئات الميزانية</h2><span className="text-[10px] text-cream/40 font-bold">{entries.length} فئات</span></div>
          <BudgetCategoryList entries={entries} budgetPeriod={budgetPeriod} />
        </section>
      </main>
    </div>
  );
}
