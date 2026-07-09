import React from 'react';
import {
  Bell, ShoppingCart, HeartPulse, ArrowLeftRight, Wallet, PiggyBank, ShieldAlert,
  Receipt, CreditCard, Banknote,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import Mascot from '../components/mascot/Mascot';
import { useMascotEmotion } from '../components/mascot/useMascotEmotion';
import StreakFlame from '../components/ui/StreakFlame';
import CoinPill from '../components/ui/CoinPill';
import ChallengeCard from '../components/ui/ChallengeCard';
import CountUp from '../components/ui/CountUp';

const TX_LABELS = {
  purchase: { icon: ShoppingCart, sign: '-' },
  salary: { icon: Wallet, sign: '+' },
  save: { icon: PiggyBank, sign: '-' },
  emergency: { icon: ShieldAlert, sign: '-' },
};

const QUICK_ACTIONS = [
  { label: 'دفع الفواتير', icon: Receipt },
  { label: 'الحوالات السريعة', icon: ArrowLeftRight },
  { label: 'البطاقات', icon: CreditCard },
  { label: 'التمويل', icon: Banknote },
];

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function HomeView() {
  const {
    user, pet, game, transactions,
    isSick, isSad, isHappy, goalProgress,
    isShaking, flashColor, setActiveView,
    isSubmitting, runAction,
  } = useAppData();
  const { emotion } = useMascotEmotion(pet);
  const petName = user.petName || 'سنقر';

  return (
    <div className={`bg-alinma-light min-h-screen flex flex-col font-sans transition-all duration-300 ${isShaking ? 'animate-screen-shake' : ''}`} dir="rtl">
      {flashColor && <div className="absolute inset-0 z-50 pointer-events-none transition-colors duration-300" style={{ backgroundColor: flashColor }}></div>}

      {/* Header — Alinma style: cream canvas, name + letter avatar on the
          right, line icons on the left */}
      <div className="px-5 pt-5 pb-2 flex justify-between items-center z-10">
        <div className="relative text-alinma">
          <Bell size={24} strokeWidth={1.8} />
          <span className="absolute -top-0.5 -left-0.5 bg-coral w-2.5 h-2.5 rounded-full"></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="font-black text-alinma text-lg leading-tight">{user.name}</p>
            <p className="text-[11px] text-gray-400 font-bold">🪙 {game.coins}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-coral-light flex items-center justify-center font-black text-alinma text-lg">
            {user.name?.[0] || 'ع'}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5 flex-1 overflow-y-auto pb-24 z-10">
        {/* Balance — flat on the canvas like the real app, no card */}
        <div className="text-center pt-3 pb-1">
          <p className="text-sm text-gray-500 font-bold mb-2">حساب جاري 1000 •••</p>
          <h2 className="text-4xl font-black text-alinma tracking-tight">
            <CountUp value={user.balance} /> <span className="text-base font-bold text-gray-400">ر.س</span>
          </h2>
          <span className="inline-block mt-3 bg-white px-5 py-1.5 rounded-full text-sm font-bold text-alinma shadow-sm">جاري</span>
        </div>

        {/* Streak chip strip */}
        <div className="flex justify-center">
          <StreakFlame streak={game.streak} />
        </div>

        {/* --- COMPANION WIDGET --- */}
        <div
          onClick={() => setActiveView('pet')}
          className={`relative overflow-hidden rounded-3xl p-5 cursor-pointer transition-all duration-300 transform hover:scale-[1.01] shadow-sm ${
            isSick ? 'bg-red-50' : 'bg-white'
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl overflow-hidden bg-alinma-light">
                {/* live mini mascot — same emotion pipeline as the pet room */}
                <Mascot emotion={emotion} stage={game.stage} equipped={game.equipped} size={56} track={false} />
              </div>
              <div>
                <h3 className="font-black text-alinma">مرافقك: {petName}</h3>
                <div className="flex items-center gap-1 text-xs font-bold mt-1">
                  <HeartPulse size={12} className={isSick ? 'text-red-500' : isSad ? 'text-orange-500' : 'text-emerald-500'} />
                  <span className={isSick ? 'text-red-600' : isSad ? 'text-orange-600' : 'text-emerald-600'}>{pet.health}% صحة</span>
                </div>
              </div>
            </div>
            <div className="text-center bg-alinma-light px-3 py-1.5 rounded-2xl">
              <span className="block text-[10px] font-bold text-gray-500">الهدف</span>
              <span className="block text-xl font-black text-alinma">{goalProgress}%</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed mb-4 font-medium">
            "{pet.message}"
          </p>

          {/* Goal progress bar */}
          <div className="w-full bg-alinma-light rounded-full h-2.5 mb-1.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${isSick ? 'bg-red-400' : 'bg-coral'}`}
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-gray-400 text-left font-bold">{user.savedAmount.toFixed(0)} / {user.goalAmount.toFixed(0)} ر.س</p>
        </div>

        {/* Save now — primary CTA, bank navy */}
        <button
          disabled={isSubmitting}
          onClick={() => {
            const amountStr = window.prompt('كم تبغى توفر؟ (ر.س)', '500');
            if (!amountStr) return;
            const amt = parseFloat(amountStr);
            if (!amt || amt <= 0) return;
            runAction(() => api.save(amt));
          }}
          className="w-full py-4 rounded-3xl font-black text-white bg-alinma shadow-lg shadow-alinma/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <PiggyBank size={22} />
          وفّر الآن — أطعم {petName} 🪙
        </button>

        {/* Weekly challenge strip */}
        <ChallengeCard challenge={game.activeChallenge} compact />

        {/* Quick Actions — navy squircle tiles, real-app style */}
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="bg-alinma text-white p-4 rounded-2xl">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] text-alinma font-bold text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div>
          <h3 className="font-black text-alinma mb-3 px-1">أحدث العمليات</h3>
          <div className="bg-white rounded-3xl shadow-sm divide-y divide-gray-50">
            {transactions.length === 0 && (
              <p className="p-4 text-sm text-gray-400 text-center">لا توجد عمليات بعد</p>
            )}
            {transactions.map((tx) => {
              const meta = TX_LABELS[tx.type] || TX_LABELS.purchase;
              const Icon = meta.icon;
              return (
                <div key={tx.id} className="p-4 flex justify-between items-center transition-colors hover:bg-alinma-light/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl ${tx.type === 'emergency' ? 'bg-red-50 text-red-500' : tx.type === 'salary' ? 'bg-emerald-50 text-emerald-600' : 'bg-alinma-light text-alinma'}`}>
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-bold text-alinma text-sm">{tx.label}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <div className="text-left flex flex-col items-end">
                    <p className={`font-bold text-sm ${meta.sign === '+' ? 'text-emerald-600' : 'text-alinma'}`}>{meta.sign}{Number(tx.amount).toFixed(2)}</p>
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
