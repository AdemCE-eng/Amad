import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBackendData } from '../lib/useBackendData';
import { api } from '../lib/api';
import { CANONICAL_DEMO_ROLE, clearDemoBrowserState } from '../lib/demoReset';
import { useUserNotifications } from '../lib/useUserNotifications';

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

  const [restarting, setRestarting] = useState(false);
  const [demoResetVersion, setDemoResetVersion] = useState(0);

  const [activeView, setActiveView] = useState('home');
  const [petActiveTab, setPetActiveTab] = useState('status');
  const [opportunityResult, setOpportunityResult] = useState(null);
  const [activeRole, setActiveRoleState] = useState(() => {
    const stored = localStorage.getItem(ROLE_KEY);
    return ['rashid', 'ahmed', 'sarah'].includes(stored) ? stored : CANONICAL_DEMO_ROLE;
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
  const notificationState = useUserNotifications(activeRole);

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

  // Full presentation reset. The backend restores canonical Firebase state;
  // the frontend returns Home and remounts every view so no analysis, loading,
  // notice, setup-step, or cached visual state can flash from the prior run.
  // Setup then begins only from Home's existing savings-plan card.
  const restartDemo = async () => {
    setRestarting(true);
    setActionError(null);
    try {
      await api.reset();
      clearDemoBrowserState();
      setActiveRoleState(CANONICAL_DEMO_ROLE);
      setActiveView('home');
      setPetActiveTab('status');
      setOpportunityResult(null);
      setIsPetted(false);
      setIsShaking(false);
      setFlashColor(null);
      setLastHealth(null);
      setDemoResetVersion((version) => version + 1);
      return true;
    } catch {
      setActionError('تعذر إعادة حالة العرض. تأكد من تشغيل الخادم وحاول مرة أخرى.');
      return false;
    } finally {
      setRestarting(false);
    }
  };

  // Two separate currencies — never merged. NXP lives in game.nxp_balance
  // (game rewards); Akthr is real campaign loyalty in /loyalty.akthrPoints.
  const nxp = backend.game?.nxp_balance ?? 0;
  const akthrPoints = backend.loyalty?.akthrPoints ?? 0;

  const value = {
    ...backend,
    restartDemo, restarting, demoResetVersion,
    activeView, setActiveView,
    petActiveTab, setPetActiveTab,
    opportunityResult, setOpportunityResult,
    activeRole, setActiveRole,
    ...notificationState,
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
