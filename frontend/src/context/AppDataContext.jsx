import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBackendData } from '../lib/useBackendData';
import { api } from '../lib/api';

// Demo-only role switch (no auth, no permissions) — which family member the
// UI is "acting as". Persisted so a refresh keeps the same role.
const ROLE_KEY = 'namo_active_role';

// Single provider for backend state + app-wide interaction state, so views
// consume `useAppData()` instead of a 20-prop drill. Views stay top-level
// components and keep local form state across Firebase-triggered re-renders.
const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const backend = useBackendData();
  const { user, pet } = backend;

  // Home-first: the app lands on Home by default and surfaces setup as
  // dismissible suggestion cards (open savings / pick a companion). The full
  // onboarding flow is still reachable on demand (a card calls setOnboarded
  // (false)) or via ?onboard=1.
  const [onboarded, setOnboarded] = useState(() =>
    !new URLSearchParams(window.location.search).get('onboard')
  );
  const [restarting, setRestarting] = useState(false);

  const [activeView, setActiveView] = useState('home');
  const [activeRole, setActiveRoleState] = useState(() => {
    const stored = localStorage.getItem(ROLE_KEY);
    // Only rashid/ahmed are valid; anything else (incl. stale pre-migration
    // values) maps to the child role.
    return stored === 'ahmed' ? 'ahmed' : 'rashid';
  });
  const setActiveRole = (role) => {
    localStorage.setItem(ROLE_KEY, role);
    setActiveRoleState(role);
  };
  const [isPetted, setIsPetted] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [flashColor, setFlashColor] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Screen-shake on health loss / green flash on heal, reacting to backend
  // pushes rather than local actions (a purchase from the cheat controller
  // shakes the app too).
  const [lastHealth, setLastHealth] = useState(null);
  useEffect(() => {
    if (!pet) return;
    if (lastHealth !== null && pet.health < lastHealth) {
      setIsShaking(true);
      setFlashColor('rgba(239, 68, 68, 0.2)');
      setTimeout(() => { setIsShaking(false); setFlashColor(null); }, 400);
    } else if (lastHealth !== null && pet.health > lastHealth) {
      setFlashColor('rgba(16, 185, 129, 0.2)');
      setTimeout(() => setFlashColor(null), 400);
    }
    setLastHealth(pet.health);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet?.health]);

  // 5-state model (shared/rafiqIdentity.js): radiant/happy/neutral/tired/sick.
  const isSick = pet?.mood === 'sick';
  const isTired = pet?.mood === 'tired';
  const isHappy = pet?.mood === 'happy' || pet?.mood === 'radiant';
  const goalProgress = user && user.goalAmount > 0
    ? Math.min(100, Math.round((user.savedAmount / user.goalAmount) * 100))
    : 0;

  // ── Budget / savings-plan derived state (single source, per docs) ──
  const budgets = user?.budgets || null;
  const budgetPeriod = user?.budgetPeriod || {};
  const savingsPlan = user?.savingsPlan || null;
  const savingsAccountOpened = user?.savingsAccountOpened ?? false;
  // What WOULD sweep into savings right now if every open period closed — the
  // "leftover heading to your savings" figure shown on Home.
  const projectedRollover = budgets
    ? Object.entries(budgets).reduce(
        (sum, [cat, cfg]) => sum + Math.max(0, cfg.limit - (budgetPeriod[cat] || 0)),
        0
      )
    : 0;

  // Tap squish — pure delight, no stats change.
  const handlePetInteraction = () => {
    if (isSick) return;
    setIsPetted(true);
    setTimeout(() => setIsPetted(false), 200);
  };

  // Wraps a backend call: errors surface in the banner; success needs no
  // local mutation — the Firebase listener delivers the new state.
  const runAction = async (fn) => {
    setIsSubmitting(true);
    setActionError(null);
    try {
      await fn();
    } catch (err) {
      setActionError(err.message === 'insufficient_funds' ? 'الرصيد غير كافٍ لإتمام هذه العملية'
        : err.message === 'invalid_goal' ? 'قيمة الهدف غير صالحة'
        : err.message === 'invalid_income' ? 'أدخل دخلاً شهرياً صحيحاً'
        : 'حدث خطأ، حاول مرة أخرى');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Full "start over" — wipes the backend to the pristine demo state (health,
  // streak, coins, achievements) AND drops back to onboarding so the operator
  // can re-pick the companion and set a fresh goal. Used between judges.
  const restartOnboarding = async () => {
    setRestarting(true);
    try {
      await api.reset();
    } catch { /* offline demo still proceeds to onboarding */ }
    localStorage.removeItem('amad_onboarded');
    setActiveView('home');
    setOnboarded(false);
    setRestarting(false);
  };

  // Two separate currencies — never merged. NXP lives in game.nxp_balance
  // (game rewards); Akthr is real campaign loyalty in /loyalty.akthrPoints.
  const nxp = backend.game?.nxp_balance ?? 0;
  const akthrPoints = backend.loyalty?.akthrPoints ?? 0;

  const value = {
    ...backend,
    onboarded, setOnboarded, restartOnboarding, restarting,
    activeView, setActiveView,
    activeRole, setActiveRole,
    nxp, akthrPoints,
    isPetted, handlePetInteraction,
    isShaking, flashColor,
    actionError, isSubmitting, runAction,
    isSick, isTired, isHappy, goalProgress,
    budgets, budgetPeriod, savingsPlan, savingsAccountOpened, projectedRollover,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
