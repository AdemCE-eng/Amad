// seed.js — inject mock user, pet, and synthetic Arabic POS transactions.
// Run with: npm run seed
import { db } from "./firebase.js";
import { initialState } from "./logic/petEngine.js";

// Synthetic Arabic POS history (no real customer data — safe for the demo).
// The PM's larger dataset can be dropped in here later using the same shape.
const now = Date.now();
const hour = 3600_000;
const SEED_TRANSACTIONS = [
  { type: "salary", amount: 8000, category: "income", label: "إيداع راتب", timestamp: now - 120 * hour },
  { type: "purchase", amount: 45, category: "coffee", label: "قهوة الصباح", timestamp: now - 90 * hour },
  { type: "purchase", amount: 320, category: "groceries", label: "بقالة", timestamp: now - 72 * hour },
  { type: "purchase", amount: 55, category: "transport", label: "بنزين", timestamp: now - 48 * hour },
  { type: "purchase", amount: 210, category: "dining", label: "مطعم", timestamp: now - 30 * hour },
  { type: "purchase", amount: 50, category: "coffee", label: "قهوة", timestamp: now - 6 * hour },
];

async function seed() {
  const fresh = initialState();
  await db.ref("/").set({
    user: fresh.user,
    pet: fresh.pet,
    emergencyShield: fresh.emergencyShield,
    game: fresh.game,
    meta: { ...fresh.meta, lastEvent: "idle" },
    transactions: null,
  });

  for (const t of SEED_TRANSACTIONS) {
    await db.ref("/transactions").push(t);
  }

  console.log("🌱 Seed complete:");
  console.log(`   user: ${fresh.user.name}  goal=${fresh.user.goalAmount}  saved=${fresh.user.savedAmount}`);
  console.log(`   pet:  health=${fresh.pet.health}  mood=${fresh.pet.mood}`);
  console.log(`   transactions: ${SEED_TRANSACTIONS.length}`);
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
