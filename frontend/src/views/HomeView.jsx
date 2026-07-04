import React from 'react';
import {
  Bell, Menu, ShoppingCart, HeartPulse, ArrowLeftRight, Wallet, PiggyBank, ShieldAlert,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';

const TX_LABELS = {
  purchase: { icon: ShoppingCart, sign: '-' },
  salary: { icon: Wallet, sign: '+' },
  save: { icon: PiggyBank, sign: '-' },
  emergency: { icon: ShieldAlert, sign: '-' },
};

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function HomeView() {
  const {
    user, pet, transactions, currentPet,
    isSick, isSad, isHappy, goalProgress,
    isShaking, flashColor, setActiveView,
  } = useAppData();
  const CurrentPetGraphic = currentPet.Graphic;

  return (
    <div className={`bg-gray-50 min-h-screen flex flex-col font-sans transition-all duration-300 ${isShaking ? 'animate-screen-shake' : ''}`} dir="rtl">
      {flashColor && <div className="absolute inset-0 z-50 pointer-events-none transition-colors duration-300" style={{ backgroundColor: flashColor }}></div>}

      {/* Header */}
      <div className="bg-alinma text-white p-4 flex justify-between items-center rounded-b-2xl shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-lg"><Menu size={24} /></div>
          <h1 className="text-xl font-bold tracking-wider">alinma <span className="font-light">الإنماء</span></h1>
        </div>
        <div className="relative bg-white/20 p-2 rounded-lg">
          <Bell size={24} />
          <span className="absolute top-1 right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 overflow-y-auto pb-24 z-10">
        {/* Welcome & Balance Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm mb-1">مرحباً بك، {user.name}</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-gray-400 mb-1">الحساب الجاري المتميز</p>
              <h2 className="text-3xl font-bold text-alinma-dark">{user.balance.toFixed(2)} <span className="text-sm text-gray-500">ر.س</span></h2>
            </div>
            <img src={`https://api.dicebear.com/7.x/initials/svg?seed=A&backgroundColor=009C8E`} alt="avatar" className="w-12 h-12 rounded-full border-2 border-alinma" />
          </div>
        </div>

        {/* --- COMPANION WIDGET --- */}
        <div
          onClick={() => setActiveView('pet')}
          className={`relative overflow-hidden rounded-2xl p-5 shadow-sm border cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
            isSick ? 'bg-red-50 border-red-300 shadow-red-100' :
            isSad ? 'bg-orange-50 border-orange-300 shadow-orange-100' :
            isHappy ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-300 shadow-green-100' :
            'bg-gradient-to-r from-orange-50 to-amber-50 border-amber-300 shadow-amber-100'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-14 h-14 flex items-center justify-center rounded-full border-2 overflow-hidden bg-white/80 p-1 ${
                isSick ? 'border-red-400' : 'border-alinma'
              }`}>
                <div className={`w-full h-full transform ${isSick ? 'grayscale opacity-70 rotate-90 scale-90' : ''}`}>
                  <CurrentPetGraphic />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">مرافقك: {currentPet.name}</h3>
                <div className="flex items-center gap-1 text-xs font-bold mt-1">
                  <HeartPulse size={12} className={isSick ? 'text-red-500' : 'text-green-500'} />
                  <span className={isSick ? 'text-red-600' : 'text-green-600'}>{pet.health}% صحة</span>
                </div>
              </div>
            </div>
            <div className="text-center bg-white px-3 py-1 rounded-xl shadow-sm border border-gray-100">
              <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">الهدف</span>
              <span className="block text-xl font-black text-alinma-dark">{goalProgress}%</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 leading-relaxed mb-4 font-medium italic">
            "{pet.message}"
          </p>

          {/* Goal progress bar */}
          <div className="w-full bg-white/60 rounded-full h-3 mb-1 overflow-hidden border border-gray-200">
            <div
              className={`h-3 rounded-full transition-all duration-1000 ease-out ${isSick ? 'bg-red-400' : 'bg-coin'}`}
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-500 text-left font-bold">{user.savedAmount.toFixed(0)} / {user.goalAmount.toFixed(0)} ر.س</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {['التحويل', 'سداد الفواتير', 'البطاقات', 'التمويل'].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-alinma border border-gray-100">
                <ArrowLeftRight size={20} />
              </div>
              <span className="text-xs text-gray-600 font-medium">{item}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div>
          <h3 className="font-bold text-gray-800 mb-3 px-1">أحدث العمليات</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
            {transactions.length === 0 && (
              <p className="p-4 text-sm text-gray-400 text-center">لا توجد عمليات بعد</p>
            )}
            {transactions.map((tx) => {
              const meta = TX_LABELS[tx.type] || TX_LABELS.purchase;
              const Icon = meta.icon;
              return (
                <div key={tx.id} className="p-4 flex justify-between items-center transition-colors hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${tx.type === 'emergency' ? 'bg-red-50 text-red-500' : tx.type === 'salary' ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-500'}`}>
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{tx.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-left flex flex-col items-end">
                    <p className={`font-bold text-sm ${meta.sign === '+' ? 'text-green-600' : 'text-gray-800'}`}>{meta.sign}{Number(tx.amount).toFixed(2)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
