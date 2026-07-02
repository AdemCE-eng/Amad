import { useEffect, useState } from 'react';
import { watch } from './firebase';

// Live view of the backend's Firebase Realtime DB state. Read-only — the
// frontend never writes to the DB, per docs/DATA_MODEL.md.
export function useBackendData() {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [emergencyShield, setEmergencyShield] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const unsubs = [
      watch('/user', setUser),
      watch('/pet', setPet),
      watch('/emergencyShield', setEmergencyShield),
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
    transactions,
    loading: !user || !pet || !emergencyShield,
  };
}
