// firebase.js — initialize firebase-admin against the emulator (local) or the
// real Realtime Database (production), decided entirely by environment variables.
import "dotenv/config";
import admin from "firebase-admin";
import { AsyncLocalStorage } from "node:async_hooks";

const {
  FIREBASE_PROJECT_ID = "amad-demo",
  FIREBASE_DATABASE_URL = "https://amad-demo-default-rtdb.firebaseio.com",
  FIREBASE_DATABASE_EMULATOR_HOST,
  GOOGLE_APPLICATION_CREDENTIALS,
} = process.env;

const usingEmulator = Boolean(FIREBASE_DATABASE_EMULATOR_HOST);

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: FIREBASE_PROJECT_ID,
    databaseURL: FIREBASE_DATABASE_URL,
    // Real credentials only needed when NOT on the emulator. When the emulator
    // host is set, firebase-admin talks to it and ignores auth.
    ...(usingEmulator || !GOOGLE_APPLICATION_CREDENTIALS
      ? {}
      : { credential: admin.credential.applicationDefault() }),
  });
}

console.log(
  usingEmulator
    ? `🔧 Firebase: EMULATOR @ ${FIREBASE_DATABASE_EMULATOR_HOST}`
    : `☁️  Firebase: LIVE @ ${FIREBASE_DATABASE_URL}`
);

// Every API request runs inside a user scope. Keeping the prefixing here means
// every existing state access (pet, family, offers, notifications, etc.) is
// isolated together instead of relying on every route to remember the UUID.
export const adminDb = admin.database();
const userScope = new AsyncLocalStorage();

function scopedPath(path = "/") {
  const userId = userScope.getStore()?.userId;
  if (!userId) return path;
  const suffix = String(path).replace(/^\/+/, "");
  return suffix ? `/users/${userId}/${suffix}` : `/users/${userId}`;
}

export const db = {
  ref(path = "/") {
    return adminDb.ref(scopedPath(path));
  },
};

export function runWithUserScope(userId, callback) {
  return userScope.run({ userId }, callback);
}

export function currentUserId() {
  return userScope.getStore()?.userId || null;
}

// Administrative root access is intentionally unscoped. Application routes
// should use `db`; user-management routes use `adminDb` explicitly.
export const rootRef = adminDb.ref("/");
export default admin;
