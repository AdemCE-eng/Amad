import React from 'react';
import {
  Coffee, Fuel, Gamepad2, ShoppingBag, ShoppingBasket, Smartphone, Utensils,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useAppData } from '../../context/AppDataContext';
import SarAmount from './SarAmount';

// REMOVABLE_HOME_PURCHASE_ACTIONS
// Mirrors only the purchase scenarios exposed in cheat-controller/index.html.
// Delete this component and its single HomeView import/render to remove it.
const PURCHASE_ACTIONS = [
  { id: 'coffee', label: 'شراء قهوة', amount: 50, category: 'coffee', transactionLabel: 'قهوة', Icon: Coffee },
  { id: 'big-shopping', label: 'شراء كبير', amount: 2500, category: 'shopping', transactionLabel: 'تسوّق كبير', Icon: ShoppingBag },
  { id: 'daily-coffee', label: 'قهوة يومية', amount: 12, category: 'coffee', transactionLabel: 'قهوة يومية', Icon: Coffee },
  { id: 'fuel', label: 'وقود', amount: 25, category: 'gas', transactionLabel: 'وقود', Icon: Fuel },
  { id: 'groceries', label: 'بقالة', amount: 150, category: 'groceries', transactionLabel: 'بقالة', Icon: ShoppingBasket },
  { id: 'dining', label: 'مطاعم', amount: 90, category: 'dining', transactionLabel: 'مطاعم', Icon: Utensils },
  { id: 'entertainment', label: 'ترفيه', amount: 50, category: 'entertainment', transactionLabel: 'ترفيه', Icon: Gamepad2 },
  { id: 'subscriptions', label: 'اشتراكات', amount: 40, category: 'subscriptions', transactionLabel: 'اشتراكات', Icon: Smartphone },
];

export default function HomePurchaseActions() {
  const { actionError, isSubmitting, runAction } = useAppData();

  return (
    <section className="bg-ink-card rounded-3xl p-4" data-testid="home-purchase-actions" aria-label="عمليات شراء تجريبية">
      <div className="flex items-center justify-between gap-3 mb-3 px-1">
        <div>
          <h2 className="font-black">اشترِ من التجربة</h2>
          <p className="text-[10px] text-cream/45 mt-0.5">تجريبي · تسجّل العملية وتحدّث ميزانيتك</p>
        </div>
        <ShoppingBag size={18} className="text-coral shrink-0" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-2 gap-2">
        {PURCHASE_ACTIONS.map(({ id, label, amount, category, transactionLabel, Icon }) => (
          <button
            key={id}
            type="button"
            disabled={isSubmitting}
            onClick={() => runAction(() => api.purchase(amount, category, transactionLabel))}
            className="min-w-0 rounded-2xl bg-white/5 border border-white/5 p-3 text-right transition-colors hover:bg-white/10 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-coral"
          >
            <span className="flex items-center justify-between gap-2">
              <Icon size={17} className="text-coral shrink-0" aria-hidden="true" />
              <span className="text-[11px] font-black truncate">{label}</span>
            </span>
            <span className="block text-[10px] text-cream/55 font-bold mt-2"><SarAmount value={amount} /></span>
          </button>
        ))}
      </div>
      {actionError && <p role="alert" className="mt-3 rounded-2xl bg-red-500/10 px-3 py-2 text-center text-xs font-bold text-red-300">{actionError}</p>}
    </section>
  );
}
