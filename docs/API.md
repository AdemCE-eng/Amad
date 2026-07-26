# Backend API Reference

The React customer application calls these endpoints through `frontend/src/lib/api.js`.
They are documented here for local development, testing, and integration work.

Every mutating endpoint follows the same flow: **read current state → run the pet-health math →
generate optional companion wording → one Firebase write → respond with the new state.**
The React frontend observes the result through its Firebase listener.

## Endpoints

| Method | Path | Body | What it does |
|---|---|---|---|
| POST | `/api/simulate/salary` | `{ amount, savePercent? }` | Deposits `amount`. `savePercent` (0-100, default 20) is how much auto-routes to Instant Savings. Pet always heals + gets happy. |
| POST | `/api/simulate/save` | `{ amount }` | Manual **Instant Savings** top-up — the full amount moves from balance to savings (bigger heal per SAR than salary's auto-save slice). |
| POST | `/api/simulate/purchase` | `{ amount, category, label }` | A spend. Small dip if within the monthly budget; big penalty (pet gets sick) if it breaks the budget. |
| POST | `/api/simulate/emergency` | `{ amount, label }` | A withdrawal protected by the **Emergency Shield** — no health penalty while `usesRemaining > 0`. Once the shield is used up, it behaves like a normal purchase. |
| POST | `/api/user/goal` | `{ goalAmount }` | Changes the user's personal savings goal. Settings-only — doesn't touch health/mood/AI message. |
| POST | `/api/reset` | — | Restores the UUID-scoped local state: health 100, shield restored, and transactions cleared. |
| GET | `/api/state` | — | Read-only snapshot of `/user`, `/pet`, `/emergencyShield`, `/meta`. Useful for debugging. |
| POST | `/api/plan/suggest` | `{ monthlyIncome }` | Previews a savings plan with a recommended save rate, monthly target, and category budgets. Does not write state. |
| POST | `/api/plan/apply` | `{ monthlyIncome, budgets?, monthlyTarget?, goalAmount? }` | Applies the reviewed plan, opens savings, and persists the income, targets, and category budgets. |
| POST | `/api/savings/open` | — | Opens the savings account without applying a complete savings plan. |
| GET | `/api/ml/recommendations?userId=rashid` | — | Optional personalized recommendation. Uses only a pseudonymous ID and falls back to the existing deterministic offer engine when ML is disabled or unavailable. |

## Money rules

- **Balance can't go negative.** `purchase`, `emergency`, and `save` all check the amount against
  the current balance first. If it's too much, the request is rejected with
  `{ ok: false, error: "insufficient_funds" }` and **nothing changes** — no health hit, no
  transaction logged. The customer application surfaces the validation error.
- **Salary is the only deposit**, and it's the only place `balance` goes up.
- `goalAmount` must be a positive number, or the request is rejected the same way
  (`error: "invalid_goal"`).

## AI response time

Optional generated companion wording may add network latency. If text generation
is disabled, slow, or unavailable, the backend uses deterministic Arabic copy so
the pet never shows a blank message.
