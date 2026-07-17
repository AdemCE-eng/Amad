import React, { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import NestedPageHeader from '../components/ui/NestedPageHeader';
import TransactionRow from '../components/ui/TransactionRow';

const FILTERS = [
  { id: 'all', label: 'الكل' },
  { id: 'salary', label: 'إيداعات' },
  { id: 'purchase', label: 'مشتريات' },
  { id: 'save', label: 'ادخار' },
  { id: 'withdrawal', label: 'سحب من المدخرات' },
  { id: 'emergency', label: 'سحب طارئ' },
];

export default function TransactionsView() {
  const { transactions, setActiveView } = useAppData();
  const [filter, setFilter] = useState('all');
  const visible = useMemo(() => [...transactions]
    .sort((a, b) => b.timestamp - a.timestamp)
    .filter((transaction) => filter === 'all' || transaction.type === filter), [transactions, filter]);

  return (
    <div className="bg-ink h-full overflow-y-auto overflow-x-hidden text-cream" dir="rtl">
      <NestedPageHeader title="كل العمليات" subtitle="مرتبة من الأحدث إلى الأقدم." onBack={() => setActiveView('home')} />
      <div className="px-5 pb-8">
        <div className="flex gap-2 overflow-x-auto pb-3" data-testid="transaction-filters">
          {FILTERS.map((item) => <button key={item.id} onClick={() => setFilter(item.id)} className={`px-3 py-2 rounded-xl text-xs font-black whitespace-nowrap ${filter === item.id ? 'bg-coral text-ink' : 'bg-white/5 text-cream/60'}`}>{item.label}</button>)}
        </div>
        <div className="bg-ink-card rounded-3xl divide-y divide-white/5" data-testid="all-transactions">
          {visible.length === 0 ? <p className="p-8 text-center text-sm text-cream/40">لا توجد عمليات ضمن هذا التصنيف.</p> : visible.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}
        </div>
      </div>
    </div>
  );
}
