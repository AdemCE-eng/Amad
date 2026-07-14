import React, { useState } from 'react';
import {
  ArrowLeftRight, Bell, Car, ChevronLeft, Eye, EyeOff, Flame,
  HeartPulse, Receipt, Smartphone, Sparkles, TrendingUp, Users,
} from 'lucide-react';
import { useAppData } from '../context/AppDataContext';
import Mascot from '../components/mascot/Mascot';
import { useMascotEmotion } from '../components/mascot/useMascotEmotion';
import BudgetOverview from '../components/ui/BudgetOverview';
import CountUp from '../components/ui/CountUp';
import SavingsPlanSheet from '../components/ui/SavingsPlanSheet';
import TransactionRow from '../components/ui/TransactionRow';
import { STAGE_INFO } from '../lib/catalog';

const QUICK_ACTIONS = [
  { label: 'دفع الفواتير', icon: Receipt },
  { label: 'التحويلات السريعة', icon: ArrowLeftRight },
  { label: 'شحن الجوال', icon: Smartphone },
  { label: 'المخالفات المرورية', icon: Car },
];

export default function HomeView() {
  const {
    user, pet, game, transactions, family, opportunityResult,
    isShaking, flashColor, setActiveView, unreadNotificationCount,
    budgets, budgetPeriod, projectedRollover, savingsAccountOpened,
  } = useAppData();
  const { emotion } = useMascotEmotion(pet);
  const [showBalance, setShowBalance] = useState(true);
  const [planOpen, setPlanOpen] = useState(false);
  const accountOpen = savingsAccountOpened;
  const latestTransactions = [...transactions].sort((a, b) => b.timestamp - a.timestamp).slice(0, 4);
  const familyProgress = family?.goalAmount > 0 ? Math.min(100, Math.round((family.savedAmount / family.goalAmount) * 100)) : 0;
  const rashidContribution = family?.members?.rashid?.contributed ?? 0;
  const topOpportunity = opportunityResult?.recommendations?.[0] || null;
  const saqrStage = STAGE_INFO[game.stage]?.name || `المرحلة ${game.stage + 1}`;
  const saqrStatus = pet.health < 45
    ? 'يحتاج إلى عناية مالية اليوم'
    : game.streak.current > 0
      ? `سلسلتك مستمرة منذ ${game.streak.current} أيام`
      : 'مبسوط بالتزامك المالي اليوم';

  return (
    <div className={`bg-ink h-full flex flex-col font-sans text-cream transition-all ${isShaking ? 'animate-screen-shake' : ''}`} dir="rtl">
      {flashColor && <div className="absolute inset-0 z-50 pointer-events-none" style={{ backgroundColor: flashColor }} />}

      <header className="px-5 pt-4 pb-3 flex items-center justify-between z-10" data-testid="namo-home-header">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 rounded-2xl bg-gradient-to-br from-coral to-coral-deep text-ink grid place-items-center font-black text-lg shrink-0">{user.name?.trim()?.[0] || 'ر'}</span>
          <div className="min-w-0"><p className="font-black text-lg truncate">هلا، {user.name}</p><p className="text-[11px] text-cream/50 font-bold">المستوى {game.streak.current}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-violet/15 border border-violet/25 text-violet rounded-full px-3 py-2 text-[11px] font-black whitespace-nowrap">NXP {game.nxp_balance}</span>
          <div className="relative">
            <button aria-label="الإشعارات" onClick={() => setActiveView('notifications')} className="w-10 h-10 rounded-xl border border-white/10 grid place-items-center text-cream/75">
              <Bell size={19} strokeWidth={1.8} />
            </button>
            {unreadNotificationCount > 0 && <span className="absolute top-1 left-1 bg-coral-deep w-2.5 h-2.5 rounded-full ring-2 ring-ink" />}
          </div>
        </div>
      </header>

      <main className="px-5 space-y-5 flex-1 overflow-y-auto pb-28 z-10">
        <section className="bg-gradient-to-l from-ink-card to-ink-soft border border-white/5 rounded-3xl p-5" aria-label="الحساب الجاري">
          <div className="flex items-center justify-between"><div><p className="text-xs text-cream/45 font-bold">الحساب الجاري</p><p className="text-[11px] text-cream/35 mt-1" dir="ltr">SA•• •••• •••• 1000</p></div><span className="text-[10px] bg-white/5 px-3 py-1 rounded-full text-cream/60 font-bold">جاري</span></div>
          <div className="flex items-center gap-3 mt-5">
            <button aria-label={showBalance ? 'إخفاء الرصيد' : 'إظهار الرصيد'} onClick={() => setShowBalance((value) => !value)} className="w-9 h-9 rounded-xl bg-white/5 grid place-items-center text-cream/60">{showBalance ? <Eye size={18} /> : <EyeOff size={18} />}</button>
            {showBalance ? <h2 className="text-3xl font-black"><CountUp value={user.balance} /> <span className="text-sm text-cream/40">ر.س</span></h2> : <h2 className="text-3xl font-black tracking-widest">••••••••</h2>}
          </div>
          <div className="flex justify-center gap-1.5 mt-5"><span className="w-6 h-1.5 rounded-full bg-coral" /><span className="w-1.5 h-1.5 rounded-full bg-white/20" /></div>
        </section>

        <section className="grid grid-cols-4 gap-2" aria-label="الخدمات المصرفية السريعة">
          {QUICK_ACTIONS.map(({ label, icon: Icon }) => (
            <button key={label} type="button" className="min-w-0 flex flex-col items-center gap-2">
              <span className="w-12 h-12 bg-coral-tile text-ink rounded-2xl grid place-items-center"><Icon size={20} strokeWidth={1.9} /></span>
              <span className="text-[10px] text-cream/85 font-bold text-center leading-tight">{label}</span>
            </button>
          ))}
        </section>

        {!accountOpen ? (
          <button onClick={() => setPlanOpen(true)} className="w-full bg-gradient-to-l from-coral/20 to-ink-card border border-coral/35 rounded-3xl p-4 flex items-center gap-4 text-right" data-testid="home-setup-card">
            <span className="bg-coral text-ink p-3.5 rounded-2xl"><Sparkles size={21} /></span>
            <span className="flex-1"><small className="block text-coral font-black">ابدأ من هنا</small><strong className="block">فعّل حساب التوفير وخطّط ادخارك</strong><small className="block text-cream/50 mt-1">خطة ميزانية وهدف ادخار يناسبان دخلك.</small></span>
            <ChevronLeft size={18} className="text-cream/40" />
          </button>
        ) : <BudgetOverview budgets={budgets} budgetPeriod={budgetPeriod} projectedRollover={projectedRollover} />}

        {accountOpen && (
          <section className="bg-gradient-to-l from-coral/15 via-ink-card to-ink-card border border-coral/25 rounded-3xl p-4" data-testid="home-saqr-preview" aria-label="ملخص صقر">
            <div className="flex items-center gap-4">
              <div className="w-[92px] h-[92px] shrink-0 rounded-3xl bg-white/5 border border-white/5 grid place-items-center overflow-hidden" aria-hidden="true">
                <Mascot emotion={emotion} stage={game.stage} equipped={game.equipped} size={84} track={false} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[11px] text-coral font-black">رفيقك المالي</p>
                    <h2 className="font-black text-lg leading-tight">{user.petName || 'صقر'} · {saqrStage}</h2>
                  </div>
                  <span className="text-[10px] bg-white/5 border border-white/10 rounded-full px-2.5 py-1 font-bold text-cream/60 whitespace-nowrap">
                    {game.equipped ? 'إكسسوار مجهّز' : 'جاهز للنمو'}
                  </span>
                </div>
                <p className="text-[11px] text-cream/55 mt-1.5">{saqrStatus}</p>
                <div className="flex items-center gap-3 mt-2 text-[11px] font-black">
                  <span className="flex items-center gap-1 text-emerald-400"><HeartPulse size={14} /> {pet.health}%</span>
                  <span className="flex items-center gap-1 text-coin"><Flame size={14} /> {game.streak.current} أيام</span>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setActiveView('pet')} className="w-full mt-3 py-2.5 rounded-2xl bg-coral text-ink text-sm font-black flex items-center justify-center gap-1.5">
              افتح صقر <ChevronLeft size={16} />
            </button>
          </section>
        )}

        <button onClick={() => setActiveView('family')} className="w-full bg-ink-card rounded-3xl p-4 text-right" data-testid="home-family-preview">
          <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-coral font-black"><Users size={16} /> هدف العائلة</span><ChevronLeft size={17} className="text-cream/40" /></div>
          <p className="font-black mt-2">{family?.goalTitle || 'رحلة العائلة'}</p>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-3"><span className="block h-full bg-coral rounded-full" style={{ width: `${familyProgress}%` }} /></div>
          <div className="flex justify-between mt-2 text-[11px] font-bold"><span className="text-cream/55">{family?.savedAmount ?? 0} / {family?.goalAmount ?? 0} ر.س</span><span className="text-violet">مساهمة راشد {rashidContribution} ر.س</span></div>
        </button>

        <button onClick={() => setActiveView('opportunities')} className="w-full bg-ink-card rounded-3xl p-4 text-right" data-testid="home-opportunity-preview">
          <div className="flex items-center justify-between"><span className="flex items-center gap-2 text-xs text-violet font-black"><TrendingUp size={16} /> فرص التوفير</span><ChevronLeft size={17} className="text-cream/40" /></div>
          {topOpportunity ? (
            <div className="mt-2"><div className="flex justify-between gap-3"><strong>{topOpportunity.merchantNameAr}</strong><span className="text-coral font-black">{Math.round(topOpportunity.offerProbability * 100)}٪</span></div><p className="text-[11px] text-cream/50 mt-1">توفير محتمل {topOpportunity.estimatedSavingSar} ر.س</p><span className="inline-block text-xs text-coral font-black mt-3">عرض كل الفرص</span></div>
          ) : (
            <div className="mt-2"><strong>اكتشف فرص التوفير</strong><p className="text-[11px] text-cream/50 mt-1">حلّل مشترياتك للعثور على فرص مناسبة لميزانيتك.</p></div>
          )}
        </button>

        <section data-testid="home-transactions">
          <div className="flex items-center justify-between mb-3 px-1"><h2 className="font-black">أحدث العمليات</h2>{transactions.length > 4 && <button onClick={() => setActiveView('transactions')} className="text-xs text-coral font-black">عرض كل العمليات</button>}</div>
          <div className="bg-ink-card rounded-3xl divide-y divide-white/5">
            {latestTransactions.length === 0 ? <p className="p-5 text-sm text-cream/40 text-center">لا توجد عمليات بعد</p> : latestTransactions.map((transaction) => <TransactionRow key={transaction.id} transaction={transaction} />)}
          </div>
        </section>
      </main>

      {planOpen && <SavingsPlanSheet onClose={() => setPlanOpen(false)} />}
    </div>
  );
}
