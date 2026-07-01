// firebase.js — initialize firebase-admin against the emulator (local) or the
// real Realtime Database (production), decided entirely by environment variables.
import "dotenv/config";
import admin from "firebase-admin";

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

export const db = admin.database();
export const rootRef = db.ref("/");
export default admin;
