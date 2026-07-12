# Firebase Realtime DB — Schema Contract

This is the **shared contract** between the backend and the Flutter frontend. The frontend should
attach listeners to `/pet` (and read `/user` for goal progress) and switch Lottie animations based
on the `mood` and `animationState` strings. **The frontend never writes to the DB.**

## Full tree

```jsonc
{
  "user": {
    "name": "راشد",
    "goalAmount": 5000,        // the user's personal savings goal (SAR)
    "savedAmount": 1200,       // progress toward the goal (SAR)
    "balance": 8000,           // account balance (SAR)
    "monthlyBudget": 3000,     // budget ceiling for the month (SAR)
    "spentThisMonth": 1400     // spent so far this month (SAR)
  },

  "pet": {
    "health": 100,             // integer 0–100
    "mood": "happy",           // happy | neutral | sad | sick
    "animationState": "idle",  // idle | happy | sad | eating | sick
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
    "lastEvent": "idle"        // last action processed: salary | save | purchase | emergency | reset | idle
  }
}
```

## Enums the frontend cares about

| Field | Values | Frontend meaning |
|---|---|---|
| `pet.mood` | `happy`, `neutral`, `sad`, `sick` | tint / expression |
| `pet.animationState` | `idle`, `happy`, `sad`, `eating`, `sick` | which Lottie file to play |

## Derived value (compute on frontend, do NOT store)

**Goal progress %** = `user.savedAmount / user.goalAmount * 100` → progress bar.

## Health → mood bands (backend authoritative — listed for reference only)

| health | mood |
|---|---|
| ≥ 80 | happy |
| 50–79 | neutral |
| 20–49 | sad |
| < 20 | sick |

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
  "inventory": { "shemagh": true },
  "equipped": "shemagh",          // itemId | null — frontend renders it ON the mascot
  "lastCelebration": { "type": "evolution|achievement|streak|challenge|shop", "id": "…", "at": 0 }
}
```

- `user` gains `petName` + `petType` (set via POST /api/user/profile from onboarding).
- `pet.animationState` gains `celebrate`.
- Frontend celebration overlays key off `lastCelebration.at` changing — replays impossible.
- New endpoints: POST `/api/demo/advance-day`, `/api/demo/complete-challenge`,
  `/api/shop/buy {itemId}`, `/api/pet/equip {itemId|null}`, `/api/user/profile`,
  GET `/api/catalog`.
