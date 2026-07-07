import React, { createContext, useContext, useEffect, useState } from 'react';
import { useBackendData } from '../lib/useBackendData';
import { PET_TYPES } from '../lib/petGraphics';
import { api } from '../lib/api';

// Single provider for backend state + app-wide interaction state, so views
// consume `useAppData()` instead of a 20-prop drill. Views stay top-level
// components and keep local form state across Firebase-triggered re-renders.
const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const backend = useBackendData();
  const { user, pet } = backend;

  // Onboarding shows once per device; lives here (not in AppShell) so any
  // view can trigger a full restart, not just the initial mount check.
  const [onboarded, setOnboarded] = useState(() =>
    Boolean(localStorage.getItem('amad_onboarded')) && !new URLSearchParams(window.location.search).get('onboard')
  );
  const [restarting, setRestarting] = useState(false);

  const [activeView, setActiveView] = useState('home');
  const [petType, setPetType] = useState('falcon');
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

  const isSick = pet?.mood === 'sick';
  const isSad = pet?.mood === 'sad';
  const isHappy = pet?.mood === 'happy';
  const goalProgress = user && user.goalAmount > 0
    ? Math.min(100, Math.round((user.savedAmount / user.goalAmount) * 100))
    : 0;

  const currentPet = PET_TYPES[petType] || PET_TYPES.falcon;

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

  const value = {
    ...backend,
    onboarded, setOnboarded, restartOnboarding, restarting,
    activeView, setActiveView,
    petType, setPetType, currentPet,
    isPetted, handlePetInteraction,
    isShaking, flashColor,
    actionError, isSubmitting, runAction,
    isSick, isSad, isHappy, goalProgress,
  };

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error('useAppData must be used inside <AppDataProvider>');
  return ctx;
}
