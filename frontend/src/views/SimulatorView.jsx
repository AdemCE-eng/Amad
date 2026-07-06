import React, { useState } from 'react';
import { Settings, Zap } from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';

// Judge/demo control panel. Local form state lives here (not in context) so
// Firebase pushes never clobber half-typed inputs.
export default function SimulatorView() {
  const { user, pet, actionError, isSubmitting, runAction } = useAppData();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('coffee');
  const [desc, setDesc] = useState('');
  const [salaryAmount, setSalaryAmount] = useState('8000');
  const [savePercent, setSavePercent] = useState('20');

  const CATEGORY_LABELS = {
    coffee: 'مقهى',
    groceries: 'بقالة',
    dining: 'مطعم',
    transport: 'مواصلات',
  };

  const handleSimulate = (e) => {
    e.preventDefault();
    if (!amount) return;
    const amt = parseFloat(amount);
    const label = desc || CATEGORY_LABELS[category] || category;
    runAction(() => api.purchase(amt, category, label)).then(() => {
      setAmount('');
      setDesc('');
    });
  };

  const handleSalary = (e) => {
    e.preventDefault();
    const amt = parseFloat(salaryAmount);
    if (!amt) return;
    runAction(() => api.salary(amt, parseFloat(savePercent) || 0));
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6 font-sans" dir="rtl">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-700 pb-4">
          <Settings className="text-emerald-400" size={28} />
          <h1 className="text-2xl font-bold text-white">لوحة التحكم (PoC Simulator)</h1>
        </div>

        {actionError && (
          <div className="bg-red-900/60 border border-red-700 text-red-200 rounded-xl p-3 mb-6 text-sm font-bold text-center">
            {actionError}
          </div>
        )}

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-6 shadow-xl">
          <h2 className="font-bold text-lg mb-4 text-emerald-400">إيداع راتب</h2>
          <form onSubmit={handleSalary} className="space-y-3">
            <div className="flex gap-3">
              <input
                type="number" step="0.01" value={salaryAmount} onChange={(e) => setSalaryAmount(e.target.value)}
                className="flex-1 bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-bold"
                placeholder="المبلغ"
              />
              <input
                type="number" value={savePercent} onChange={(e) => setSavePercent(e.target.value)}
                className="w-24 bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-bold"
                placeholder="% ادخار"
              />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-transform active:scale-95">
              إيداع
            </button>
          </form>
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 mb-8 shadow-xl">
          <h2 className="font-bold text-lg mb-4 text-emerald-400">محاكاة عملية شرائية جديدة</h2>
          <form onSubmit={handleSimulate} className="space-y-4">

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">المبلغ (ر.س)</label>
              <input
                type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-bold"
                placeholder="مثال: 18.50"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">التصنيف</label>
              <select
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="coffee">قهوة ومطاعم</option>
                <option value="groceries">أساسيات ومقاضي</option>
                <option value="dining">مطعم</option>
                <option value="transport">مواصلات</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-400 mb-1">اسم التاجر</label>
              <input
                type="text" value={desc} onChange={(e) => setDesc(e.target.value)}
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500 font-medium"
                placeholder="مثال: هاف مليون"
              />
            </div>

            <button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl mt-4 transition-transform active:scale-95 flex justify-center items-center gap-2">
              <Zap size={20} />
              تنفيذ المعاملة
            </button>
          </form>
        </div>

        <button
          onClick={() => runAction(() => api.reset())}
          disabled={isSubmitting}
          className="w-full bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-bold py-3 rounded-xl mb-8 transition-transform active:scale-95"
        >
          🔄 إعادة تعيين العرض
        </button>

        <div className="grid grid-cols-2 gap-4 text-sm mb-24">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 mb-1">المدخرات</p>
            <p className="font-bold text-xl text-green-400">{user.savedAmount.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 mb-1">الرصيد</p>
            <p className="font-bold text-xl text-amber-400">{user.balance.toFixed(2)}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 mb-1">مزاج المرافق</p>
            <p className="font-bold text-lg text-white">{pet.mood}</p>
          </div>
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
            <p className="text-slate-400 mb-1">الصحة</p>
            <p className="font-bold text-lg text-white">{pet.health}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
