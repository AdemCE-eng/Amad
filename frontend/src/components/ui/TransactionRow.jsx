import React from 'react';
import { PiggyBank, ShieldAlert, ShoppingCart, Sparkles, Wallet } from 'lucide-react';
import SarAmount from './SarAmount';

export const TRANSACTION_META = {
  purchase: { icon: ShoppingCart, sign: '-', color: 'text-coral' },
  salary: { icon: Wallet, sign: '+', color: 'text-emerald-400' },
  save: { icon: PiggyBank, sign: '-', color: 'text-coral' },
  emergency: { icon: ShieldAlert, sign: '-', color: 'text-red-400' },
  reward: { icon: Sparkles, sign: '+', color: 'text-violet' },
};

export function formatTransactionDate(timestamp) {
  if (!timestamp) return '';
  return new Date(timestamp).toLocaleString('ar-SA-u-nu-latn', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function TransactionRow({ transaction }) {
  const meta = TRANSACTION_META[transaction.type] || TRANSACTION_META.purchase;
  const Icon = meta.icon;
  return (
    <article className="p-4 flex justify-between items-center gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`p-3 rounded-2xl bg-white/5 shrink-0 ${meta.color}`}><Icon size={19} strokeWidth={1.8} /></div>
        <div className="min-w-0"><p className="font-bold text-cream text-sm truncate">{transaction.label}</p><time className="text-[10px] text-cream/40">{formatTransactionDate(transaction.timestamp)}</time></div>
      </div>
      <p className={`font-black text-sm whitespace-nowrap ${meta.sign === '+' ? 'text-emerald-400' : 'text-cream'}`}><SarAmount value={Number(transaction.amount).toFixed(2)} prefix={meta.sign} /></p>
    </article>
  );
}
