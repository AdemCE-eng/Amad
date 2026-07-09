import React, { useState } from 'react';
import {
  Bell, Sun, Edit3, Eye, EyeOff, ShoppingCart, HeartPulse, ArrowLeftRight,
  Wallet, PiggyBank, ShieldAlert, Receipt, Smartphone, Car, Zap, ChevronLeft,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import { api } from '../lib/api';
import Mascot from '../components/mascot/Mascot';
import { useMascotEmotion } from '../components/mascot/useMascotEmotion';
import StreakFlame from '../components/ui/StreakFlame';
import ChallengeCard from '../components/ui/ChallengeCard';
import CountUp from '../components/ui/CountUp';

const TX_LABELS = {
  purchase: { icon: ShoppingCart, sign: '-' },
  salary: { icon: Wallet, sign: '+' },
  save: { icon: PiggyBank, sign: '-' },
  emergency: { icon: ShieldAlert, sign: '-' },
};

// Same four tiles as the real app's home
const QUICK_ACTIONS = [
  { label: 'دفع الفواتير', icon: Receipt },
  { label: 'الحوالات السريعة', icon: ArrowLeftRight },
  { label: 'شحن الجوال', icon: Smartphone },
  { label: 'المخالفات المرورية', icon: Car },
];

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' });
}

export default function HomeView() {
  const {
    user, pet, game, transactions,
    isSick, isSad, goalProgress,
    isShaking, flashColor, setActiveView,
    isSubmitting, runAction,
  } = useAppData();
  const { emotion } = useMascotEmotion(pet);
  const petName = user.petName || 'سنقر';
  const [showBalance, setShowBalance] = useState(true);

  const promptSave = () => {
    const amountStr = window.prompt('كم تبغى توفر؟ (ر.س)', '500');
    if (!amountStr) return;
    const amt = parseFloat(amountStr);
    if (!amt || amt <= 0) return;
    runAction(() => api.save(amt));
  };

  return (
    <div className={`bg-ink min-h-screen flex flex-col font-sans text-cream transition-all duration-300 ${isShaking ? 'animate-screen-shake' : ''}`} dir="rtl">
      {flashColor && <div className="absolute inset-0 z-50 pointer-events-none transition-colors duration-300" style={{ backgroundColor: flashColor }}></div>}

      {/* Header — dark Alinma: avatar + name right, line icons left */}
      <div className="px-5 pt-5 pb-2 flex justify-between items-center z-10">
        <div className="flex items-center gap-4 text-cream/90">
          <span className="border border-white/15 rounded-xl p-1.5"><Sun size={18} strokeWidth={1.8} /></span>
          <Edit3 size={20} strokeWidth={1.8} />
          <div className="relative">
            <Bell size={20} strokeWidth={1.8} />
            <span className="absolute -top-0.5 -left-0.5 bg-coral-deep w-2 h-2 rounded-full"></span>
          </div>
          <span className="w-4 h-6 rounded-md bg-coral inline-block" title="alinma"></span>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="font-black text-cream text-lg leading-tight">{user.name}</p>
            <p className="text-[11px] text-violet font-bold">✦ {game.coins}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center font-black text-cream text-lg">
            {game.streak.current}
          </div>
        </div>
      </div>

      <div className="px-5 space-y-5 flex-1 overflow-y-auto pb-28 z-10">
        {/* Balance — flat, centered, maskable like the real app */}
        <div className="text-center pt-2 pb-1">
          <p className="text-sm text-cream/50 font-bold mb-2">حساب جاري 1000 •••</p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setShowBalance((v) => !v)} className="text-cream/60">
              {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
            {showBalance ? (
              <h2 className="text-4xl font-black text-cream tracking-tight">
                <CountUp value={user.balance} /> <span className="text-base font-bold text-cream/40">ر.س</span>
              </h2>
            ) : (
              <h2 className="text-4xl font-black text-cream tracking-widest">••••••••</h2>
            )}
          </div>
          <span className="inline-block mt-3 bg-ink-soft px-6 py-1.5 rounded-full text-sm font-bold text-cream/90">جاري</span>
          <div className="flex justify-center gap-1.5 mt-4">
            <span className="w-6 h-1.5 rounded-full bg-coral"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
          </div>
        </div>

        {/* Featured product banner — رفيق gets the AutoFlow treatment */}
        <div className="bg-ink-card rounded-3xl p-5 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-coral text-xs font-black mb-1">جديد الإنماء</p>
              <h3 className="text-2xl font-black text-white leading-snug">رفيق — مرافق مالي يحس فيك</h3>
              <p className="text-sm text-cream/60 font-medium mt-1.5">يفرح لما توفر، ويتعب لما تسرف — وينمو معك.</p>
              <button
                onClick={() => setActiveView('pet')}
                className="mt-4 bg-white text-ink font-black text-sm px-5 py-2.5 rounded-2xl flex items-center gap-1 active:scale-95 transition-transform"
              >
                اكتشف رفيق
                <ChevronLeft size={16} />
              </button>
            </div>
            <div className="w-24 flex-shrink-0 flex items-center justify-center">
              <Mascot emotion={emotion} stage={game.stage} equipped={game.equipped} size={96} track={false} />
            </div>
          </div>
        </div>

        {/* Quick actions — coral squircles, navy icons (real dark-mode style) */}
        <div className="grid grid-cols-4 gap-3">
          {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="bg-coral-tile text-ink p-4 rounded-2xl">
                <Icon size={20} strokeWidth={1.9} />
              </div>
              <span className="text-[11px] text-cream/90 font-bold text-center leading-tight">{label}</span>
            </div>
          ))}
        </div>

        {/* Suggested template — the save action, styled like the mockup */}
        <button
          disabled={isSubmitting}
          onClick={promptSave}
          className="w-full bg-ink-soft rounded-3xl p-4 flex items-center gap-4 text-right active:scale-[0.99] transition-transform disabled:opacity-50"
        >
          <div className="bg-coral-tile text-ink p-3.5 rounded-2xl flex-shrink-0">
            <Zap size={22} strokeWidth={1.9} />
          </div>
          <div className="flex-1">
            <p className="text-[11px] text-cream/50 font-bold">قالب مقترح لك</p>
            <p className="font-black text-white">وفّر الآن — أطعم {petName} 🪙</p>
            <p className="text-[11px] text-cream/50 font-bold mt-0.5">قالب معتمد • تحت تحكمك الكامل</p>
          </div>
          <ChevronLeft size={18} className="text-cream/40 flex-shrink-0" />
        </button>

        {/* Companion status — live health/goal at a glance */}
        <div
          onClick={() => setActiveView('pet')}
          className={`rounded-3xl p-4 cursor-pointer transition-all ${isSick ? 'bg-red-950/60 border border-red-500/30' : 'bg-ink-card'}`}
        >
          <div className="flex items-center gap-3 mb-3">
            <StreakFlame streak={game.streak} />
            <div className="flex items-center gap-1 text-xs font-bold mr-auto">
              <HeartPulse size={13} className={isSick ? 'text-red-400' : isSad ? 'text-orange-400' : 'text-emerald-400'} />
              <span className={isSick ? 'text-red-400' : isSad ? 'text-orange-400' : 'text-emerald-400'}>{pet.health}%</span>
            </div>
            <span className="text-xs font-black text-cream/70">الهدف {goalProgress}%</span>
          </div>
          <p className="text-sm text-cream/70 font-medium mb-3">"{pet.message}"</p>
          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-1000 ease-out ${isSick ? 'bg-red-400' : 'bg-coral'}`}
              style={{ width: `${goalProgress}%` }}
            ></div>
          </div>
          <p className="text-[10px] text-cream/40 text-left font-bold mt-1.5">{user.savedAmount.toFixed(0)} / {user.goalAmount.toFixed(0)} ر.س</p>
        </div>

        {/* Weekly challenge strip */}
        <ChallengeCard challenge={game.activeChallenge} compact dark />

        {/* Transactions */}
        <div>
          <h3 className="font-black text-cream mb-3 px-1">أحدث العمليات</h3>
          <div className="bg-ink-card rounded-3xl divide-y divide-white/5">
            {transactions.length === 0 && (
              <p className="p-4 text-sm text-cream/40 text-center">لا توجد عمليات بعد</p>
            )}
            {transactions.map((tx) => {
              const meta = TX_LABELS[tx.type] || TX_LABELS.purchase;
              const Icon = meta.icon;
              return (
                <div key={tx.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-2xl bg-white/5 ${tx.type === 'emergency' ? 'text-red-400' : tx.type === 'salary' ? 'text-emerald-400' : 'text-coral'}`}>
                      <Icon size={20} strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="font-bold text-cream text-sm">{tx.label}</p>
                      <p className="text-[11px] text-cream/40 mt-0.5">{formatDate(tx.timestamp)}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-sm ${meta.sign === '+' ? 'text-emerald-400' : 'text-cream'}`}>{meta.sign}{Number(tx.amount).toFixed(2)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
