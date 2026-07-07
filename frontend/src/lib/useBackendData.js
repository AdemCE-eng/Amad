import { useEffect, useState } from 'react';
import { watch } from './firebase';

// Live view of the backend's Firebase Realtime DB state. Read-only — the
// frontend never writes to the DB, per docs/DATA_MODEL.md.
export function useBackendData() {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [emergencyShield, setEmergencyShield] = useState(null);
  const [game, setGame] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubs = [
      watch('/user', setUser),
      watch('/pet', setPet),
      watch('/emergencyShield', setEmergencyShield),
      // RTDB drops nulls/empty objects — normalize so views never guard.
      watch('/game', (g) => setGame({
        day: g?.day ?? 1,
        streak: { current: 0, best: 0, freezesLeft: 0, status: 'alive', ...(g?.streak || {}) },
        coins: g?.coins ?? 0,
        stage: g?.stage ?? 0,
        achievements: g?.achievements || {},
        activeChallenge: g?.activeChallenge || null,
        inventory: g?.inventory || {},
        equipped: g?.equipped ?? null,
        lastCelebration: g?.lastCelebration || { type: 'none', id: 'none', at: 0 },
      })),
      watch('/transactions', (val) => {
        const list = Object.entries(val || {}).map(([id, tx]) => ({ id, ...tx }));
        list.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(list);
      }),
    ];
    return () => unsubs.forEach((unsub) => unsub());
  }, []);

  return {
    user,
    pet,
    emergencyShield,
    game,
    transactions,
    loading: !user || !pet || !emergencyShield || !game,
  };
}
