import { initializeApp } from 'firebase/app';
import { getDatabase, connectDatabaseEmulator, ref, onValue } from 'firebase/database';

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'amad-demo';
const databaseURL =
  import.meta.env.VITE_FIREBASE_DATABASE_URL ||
  `https://${projectId}-default-rtdb.firebaseio.com`;
const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST || '127.0.0.1:9000';

const app = initializeApp({ projectId, databaseURL });
export const db = getDatabase(app);

if (import.meta.env.DEV && emulatorHost) {
  const [host, port] = emulatorHost.split(':');
  connectDatabaseEmulator(db, host, Number(port));
}

// Subscribes to a DB path and calls onData with every value, including null.
// Returns the unsubscribe function.
export function watch(path, onData) {
  return onValue(ref(db, path), (snapshot) => onData(snapshot.val()));
}
