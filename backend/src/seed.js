// seed.js — create one isolated UUID demo record. New browser visitors are
// provisioned the same way through POST /api/session.
// Run with: npm run seed
import { randomUUID } from "node:crypto";
import { adminDb } from "./firebase.js";
import { freshUserRecord, normalizeUserId } from "./services/userStore.js";

async function seed() {
  const userId = normalizeUserId(process.env.NADEEM_SEED_USER_ID) || randomUUID();
  const record = freshUserRecord(userId);

  await adminDb.ref("/users").set({ [userId]: record });

  // Remove the retired single-user layout so Firebase only shows the current
  // /users/{uuid} model after an explicit seed/reset operation.
  await adminDb.ref("/").update({
    user: null,
    pet: null,
    emergencyShield: null,
    game: null,
    family: null,
    offers: null,
    loyalty: null,
    contributionPlan: null,
    notifications: null,
    userNotifications: null,
    meta: null,
    transactions: null,
  });

  console.log("🌱 Seed complete:");
  console.log(`   UUID username: ${userId}`);
  console.log(`   path: /users/${userId}`);
  console.log(`   pet: health=${record.pet.health} mood=${record.pet.mood}`);
  console.log(`   transactions: ${Object.keys(record.transactions || {}).length}`);
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed:", error);
  process.exit(1);
});
