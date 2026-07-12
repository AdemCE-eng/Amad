# Firebase Realtime DB — Schema Contract

This is the **shared contract** between the backend and the Flutter frontend. The frontend should
attach listeners to `/pet` (and read `/user` for goal progress) and switch Lottie animations based
on the `mood` and `animationState` strings. **The frontend never writes to the DB.**

## Full tree

```jsonc
{
  "user": {
    "name": "Adam",
    "income": 8000,               // monthly income (SAR) — NXP save rewards scale to % of this
    "goalAmount": 5000,           // the user's personal savings goal (SAR)
    "savedAmount": 1200,          // progress toward the goal (SAR)
    "allTimeHighBalance": 1200,   // high-water mark of savedAmount (anti-farming): deposits
                                  //   earn NXP only above this; withdrawals never lower it
    "balance": 8000,              // account balance (SAR)
    "monthlyBudget": 3000,        // budget ceiling for the month (SAR)
    "spentThisMonth": 1400        // spent so far this month (SAR)
  },

  "pet": {
    "health": 100,             // integer 0–100
    "mood": "radiant",         // radiant | happy | neutral | tired | sick (5 bands, see below)
    "animationState": "idle",  // idle | radiant | happy | tired | sad | eating | sick | celebrate
    "message": "أنا سعيد بمدخراتك!",  // AI flavor text (Arabic), shown in a speech bubble
    "updatedAt": 1719849600000 // epoch ms of last update
  },

  "emergencyShield": {
    "usesRemaining": 1         // how many penalty-free emergency withdrawals are left
  },

  "transactions": {
    "<pushId>": {
      "type": "purchase",      // purchase | salary | save | emergency
      "amount": 50,            // SAR
      "category": "coffee",
      "label": "قهوة",         // Arabic display label
      "timestamp": 1719849600000
    }
  },

  "meta": {
    "currentDate": 1719849600000, // Timestamp for notifications about holidays and certain celebrations
    "lastEvent": "idle"           // last action processed: salary | save | purchase | emergency | reset | idle
  }
}
```

## Enums the frontend cares about

| Field | Values | Frontend meaning |
|---|---|---|
| `pet.mood` | `radiant`, `happy`, `neutral`, `tired`, `sick` | tint / expression (the 5 states) |
| `pet.animationState` | `idle`, `radiant`, `happy`, `tired`, `sad`, `eating`, `sick`, `celebrate` | mascot emotion |

## Derived value (compute on frontend, do NOT store)

**Goal progress %** = `user.savedAmount / user.goalAmount * 100` → progress bar.

## Health → mood bands (backend authoritative — the single source is `shared/rafiqIdentity.js`)

The 5 named states with fixed % bands. Both the backend `moodFromHealth`, the
fallback/Gemini voice, and the mascot visual treatment key off these.

| health | state |
|---|---|
| 90–100 | radiant |
| 70–89 | happy |
| 40–69 | neutral |
| 15–39 | tired |
| 0–14 | sick |

**Goal-secured spending shield:** once `savedAmount >= goalAmount`, ordinary
spending (in- or over-budget) applies **no** health loss — budget/streak/quest
accounting still runs, and saving can still raise health. Health earned by
saving can't be undone by spending once the goal is met.

---

## `/game` — gamification state (added for the mascot rebuild)

```jsonc
"game": {
  "day": 7,                       // demo-clock day (advances ONLY via POST /api/demo/advance-day)
  "streak": {
    "current": 6, "best": 6,
    "freezesLeft": 1,             // compassion shields — earned weekly, consumed on a bad day
    "status": "alive"             // alive | frozen (shield consumed today, streak survived)
  },
  "coins": 60,                    // earned via streaks/achievements/challenges — never real money
  "stage": 0,                     // 0 egg (<30% of goal) | 1 chick (30-79%) | 2 falcon (>=80%)
  "today": { "spent": 0, "saved": 0, "overBudget": false, "coffees": 0 },
  "achievements": { "first_save": { "unlockedAt": 0 } },  // unlocked only; catalog: GET /api/catalog
  "activeChallenge": { "id": "less_coffee", "title": "…", "limit": 3, "used": 1, "reward": 50, "status": "active" },
  // ^ rotates through gameEngine's CHALLENGE_POOL: completing one immediately
  //   swaps in the next (wraps) — status never rests at "done"
  "inventory": { "shemagh": true },
  "equipped": "shemagh",          // itemId | null — frontend renders it ON the mascot
  "lastCelebration": { "type": "evolution|achievement|streak|challenge|shop", "id": "…", "at": 0 },
  "lastSaveReward": { "nxp": 25, "pctOfIncome": 5, "at": 0 }  // last save's income-relative NXP receipt (at-keyed, like lastCelebration)
  // ^ nxp:0 = anti-farming case: the deposit only refilled savings back toward
  //   allTimeHighBalance, so no reward. Home/Pet Room show a distinct "back to
  //   your best" message instead of a +NXP line.
}
```

- `user` gains `petName` + `petType` (set via POST /api/user/profile from onboarding).
- `pet.animationState` gains `celebrate`.
- Frontend celebration overlays key off `lastCelebration.at` changing — replays impossible.
- Save/salary events grant NXP relative to income on NEW savings only: `5 NXP per
  1% of user.income saved`, clamped to 5–150 (gameEngine's SAVE_NXP_* tunables),
  applied to `max(0, savedAmount - allTimeHighBalance)` so redeposits earn 0.
- New endpoints: POST `/api/demo/advance-day`, `/api/demo/complete-challenge`,
  `/api/demo/set-income-profile {profileId: student|employee|executive}`,
  `/api/shop/buy {itemId}`, `/api/pet/equip {itemId|null}`, `/api/user/profile`,
  GET `/api/catalog`.
