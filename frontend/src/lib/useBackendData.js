import { useEffect, useState } from 'react';
import { watch } from './firebase';

// Live view of the backend's Firebase Realtime DB state. Read-only — the
// frontend never writes to the DB, per docs/DATA_MODEL.md.
export function useBackendData(userId) {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [emergencyShield, setEmergencyShield] = useState(null);
  const [game, setGame] = useState(null);
  const [transactions, setTransactions] = useState([]);
  // Phase 2A: family goal, contribution plan, Akthr loyalty, notifications.
  const [family, setFamily] = useState(null);
  const [contributionPlan, setContributionPlan] = useState(null);
  const [loyalty, setLoyalty] = useState(null);
  const [notifications, setNotifications] = useState(null);
  const [offers, setOffers] = useState(null);

  useEffect(() => {
    if (!userId) return undefined;
    const userPath = (path) => `/users/${userId}${path}`;
    const unsubs = [
      watch(userPath('/user'), setUser),
      watch(userPath('/pet'), setPet),
      watch(userPath('/emergencyShield'), setEmergencyShield),
      // RTDB drops nulls/empty objects — normalize so views never guard.
      watch(userPath('/game'), (g) => setGame({
        day: g?.day ?? 1,
        streak: { current: 0, best: 0, freezesLeft: 0, status: 'alive', ...(g?.streak || {}) },
        nxp_balance: g?.nxp_balance ?? 0,
        stage: g?.stage ?? 0,
        achievements: g?.achievements || {},
        activeChallenge: g?.activeChallenge || null,
        inventory: g?.inventory || {},
        equipped: g?.equipped ?? null,
        lastCelebration: g?.lastCelebration || { type: 'none', id: 'none', at: 0 },
        lastSaveReward: g?.lastSaveReward || { nxp: 0, pctOfIncome: 0, at: 0 },
      })),
      watch(userPath('/transactions'), (val) => {
        const list = Object.entries(val || {}).map(([id, tx]) => ({ id, ...tx }));
        list.sort((a, b) => b.timestamp - a.timestamp);
        setTransactions(list);
      }),
      // Family goal, plan, loyalty (Akthr only — NXP stays in /game.nxp_balance),
      // and per-role notifications. RTDB drops empty nodes → default to null.
      watch(userPath('/family'), (f) => setFamily(f || null)),
      watch(userPath('/contributionPlan'), (p) => setContributionPlan(p || null)),
      watch(userPath('/loyalty'), (l) => setLoyalty(l || { akthrPoints: 0 })),
      watch(userPath('/notifications'), (n) => setNotifications(n || null)),
      watch(userPath('/offers'), (o) => setOffers(o || null)),
    ];
    return () => unsubs.forEach((unsub) => unsub());
  }, [userId]);

  return {
    user,
    pet,
    emergencyShield,
    game,
    transactions,
    family,
    contributionPlan,
    loyalty,
    notifications,
    offers,
    loading: !user || !pet || !emergencyShield || !game,
  };
}
