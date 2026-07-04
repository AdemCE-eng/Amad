import { useEffect, useRef, useState } from 'react';
import { ANIMATION_TO_EMOTION } from './emotions';

// Resolves what the mascot should feel RIGHT NOW, by priority:
//   1. transient overrides (big health drop → crying; expire on their own)
//   2. the backend contract (pet.animationState)
//   3. idle decay — nothing happened for a while → sleeping
// Any backend event or tap wakes it up.
export function useMascotEmotion(pet, { sleepAfterMs = 45000 } = {}) {
  const [transient, setTransient] = useState(null);
  const [sleeping, setSleeping] = useState(false);
  const prevHealth = useRef(pet?.health ?? null);
  const sleepTimer = useRef(null);

  const wake = () => {
    setSleeping(false);
    clearTimeout(sleepTimer.current);
    sleepTimer.current = setTimeout(() => setSleeping(true), sleepAfterMs);
  };

  // A hit of 10+ health in one push deserves real tears before settling
  // into the backend's sad/sick pose.
  useEffect(() => {
    const h = pet?.health;
    if (h == null) return;
    if (prevHealth.current != null && prevHealth.current - h >= 10) {
      setTransient({ emotion: 'crying' });
      const t = setTimeout(() => setTransient(null), 4000);
      return () => clearTimeout(t);
    }
    prevHealth.current = h;
  }, [pet?.health]);
  useEffect(() => { prevHealth.current = pet?.health ?? prevHealth.current; }, [pet?.health]);

  // Every backend update counts as activity.
  useEffect(() => {
    wake();
    return () => clearTimeout(sleepTimer.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pet?.updatedAt]);

  const base = ANIMATION_TO_EMOTION[pet?.animationState] || 'idle';
  const emotion = transient?.emotion || (sleeping && base === 'idle' ? 'sleeping' : base);

  // poke(): tap interaction — wakes a sleeper, otherwise nothing (the tap
  // squish itself lives in the Mascot component).
  const poke = () => wake();

  return { emotion, poke };
}
