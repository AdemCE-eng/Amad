# نامو — المرافق المالي الذكي

**نامو** is a Saudi-market hackathon prototype that combines budgeting, family saving,
gamification, distinct rewards, emergency protection, and personalized saving opportunities.
Its virtual companion **صقر** reacts to financial habits in real time: saving supports the
companion's health and progression, while compassionate safeguards avoid punishing genuine emergencies.
It is a demonstration experience, not a production banking application.

## Architecture

```
React Frontend ──HTTP──▶ Express Backend ──▶ Firebase Realtime Database
       ▲                    │                         │
       └──── live state ────┴─────────────────────────┘
                            │
                            └── optional ──▶ FastAPI ML Service
                                            CatBoost offer model
                                            HistGradientBoosting purchase model
```

Express owns application and business orchestration, and Firebase is the demo-state source of truth.
The React frontend calls Express for actions and listens to Firebase for live state. FastAPI optionally
provides predictive recommendations; when it is disabled, unavailable, or slow, Express uses the
deterministic fallback so the journey remains functional. Gemini may optionally generate pet-reaction
text when configured, but it does not calculate offer probabilities; ML models calculate predictions.

## Repo layout

| Folder | Owner | Status |
|---|---|---|
| `backend/` | Express orchestration, business logic, and optional text generation | ✅ built |
| `cheat-controller/` | Demo operator controls and ML diagnostics | ✅ built (served at `/`) |
| `docs/DATA_MODEL.md` | Backend & AI | ✅ the Firebase contract for the frontend |
| `docs/API.md` | Backend & AI | ✅ endpoint reference (for demo/debugging, not needed by frontend) |
| `frontend/` | Frontend (React) | ✅ built |
| `ml-service/` | Optional FastAPI recommendation service | ✅ built; local artifacts required |
| `visual-design/` | Offline technical visuals | ✅ screenshot-ready HTML/SVG |

## Open the project

In File Explorer, open the repository folder:

```text
Amad
```

To edit the code in VS Code, right-click the folder and choose **Open with Code**, or open a
terminal in the repository root and run:

```powershell
code .
```

To run the full demo, double-click:

```text
run-project.bat
```

## One-click Windows launch

Double-click `run-project.bat` from the project folder.

The launcher will:

- add the local Java runtime to `PATH` when it exists,
- install Firebase CLI if it is missing,
- install missing backend/frontend dependencies,
- create `backend/.env` from `backend/.env.example` if needed,
- start the Firebase Realtime Database emulator on an available port,
- seed the demo data into that emulator,
- start the backend and Cheat Controller on an available port,
- start the React frontend on an available port, wired to the selected backend and Firebase ports,
- open both browser tabs using the selected ports.

The exact ports are printed in the launcher window. If the default ports are busy, the launcher automatically picks the next available ports.
The standard launcher does not require Python: personalized opportunities use the deterministic
fallback unless the optional FastAPI service is started and enabled separately.

Keep the three terminal windows open while using the demo. Close those windows to stop the project.

## Cheat Controller — what the demo operator (PM) sees

Open `http://localhost:3000/`. Every action button has its own editable input — type any amount
before clicking, nothing is fixed:

- **🎯 تحديث هدف الادخار** — set the user's savings goal.
- **💰 إيداع راتب** — deposit a salary. Second input controls what % auto-saves (default 20%).
- **💚 مدخرات فورية** — manually move money straight into savings (heals more per SAR than salary).
- **☕ شراء قهوة / 🛍️ شراء كبير** — a small in-budget purchase vs. one that breaks the monthly budget.
- **🛡️ درع الطوارئ** — an emergency withdrawal, penalty-free while the shield has uses left.
- **Recommendation Engine** — shows ML online/fallback state, selected models, last source, and a safe fallback reason. These diagnostics are not shown in the customer UI.
- **🔄 إعادة تعيين العرض** — Panic Reset. Wipes everything back to a clean demo state in ~1s. Use
  this between judges.

If you try to spend more than the balance, nothing breaks — you'll see a red "insufficient funds"
banner and no state changes. See [`docs/API.md`](docs/API.md) for the full endpoint reference.

## Manual run on localhost (if you do not use the one-click launcher)

Use three terminals.

**1 - Firebase Realtime DB emulator**

```bash
npm install -g firebase-tools      # once
firebase emulators:start --only database
```

**2 - Backend + Cheat Controller**

```bash
cd backend
cp .env.example .env               # first run only
npm install                         # first run only
npm run seed                        # inject mock user + pet + transactions
npm run dev                         # Express on http://localhost:3000
```

**3 - React frontend**

```bash
cd frontend
npm install                         # first run only
npm run dev -- --host 127.0.0.1 --port 5173
```

**Optional - FastAPI ML recommendations**

The core application works without Python. To use locally generated model artifacts, follow
[`ml-service/README.md`](ml-service/README.md), then start a fourth terminal:

```powershell
cd ml-service
.\.venv\Scripts\python.exe -m uvicorn app.main:app --port 8001
```

Before starting Express, set these values in `backend/.env`:

```env
USE_ML_SERVICE=true
ML_SERVICE_URL=http://127.0.0.1:8001
ML_SERVICE_TIMEOUT_MS=3000
```

Generated full datasets and model binaries are intentionally ignored by Git.

## Manual run to host on LAN (if you do not use the one-click launcher)
Use three terminals.

**1 - Firebase Realtime DB emulator**

```bash
npm install -g firebase-tools      # once
firebase emulators:start --only database
```

**2 - Backend + Cheat Controller**

```bash
cd backend
cp .env.example .env
```
In .env make FIREBASE_DATABASE_EMULATOR_HOST = [YOUR IP HERE]:9000

```bash
npm run seed                        # inject mock user + pet + transactions
npm run dev                         # Express on http://localhost:3000
```

**3 - React frontend**

```bash
cd frontend
npm install                         # first run only
set VITE_FIREBASE_EMULATOR_HOST=[YOURIPADDR]:9000
set VITE_API_BASE_URL=http://[YOURIPADDR]:3000
npm run dev -- --host 0.0.0.0 --port 5173
```


Open:

- Cheat Controller: `http://localhost:3000/`
- React app: `http://localhost:5173/`
- Firebase emulator UI: `http://localhost:4000`

## Current status

- **Gemini is optional.** It can generate pet-reaction text when configured. The backend uses
  predefined fallback reactions when Gemini is disabled, unavailable, or slow. Gemini never
  calculates recommendation probabilities.
- **Personalized ML is optional.** FastAPI serves CatBoost and HistGradientBoosting predictions
  when enabled with local model artifacts; the deterministic Express fallback preserves the demo
  when the service is unavailable.
- **Firebase is still on the local emulator.** When the real Firebase project is ready: remove
  `FIREBASE_DATABASE_EMULATOR_HOST` from `backend/.env` and set `FIREBASE_DATABASE_URL` + a
  service-account key instead. No code changes required either way.

## Demo journey (نامو — approved script)

Product name **نامو**, mascot **صقر**, team **Pixel Falcon**, and demo child **راشد** (`rashid`).
Three reward types, never mixed: **NXP** (virtual in-app currency, `game.nxp_balance`),
**أكثر / Akthr** (MOCK campaign loyalty, `/loyalty/akthrPoints`), and **cashback**
(MOCK campaign-funded demo rewards).

Home → الهدف العائلي → ولّد الخطة → عرض متوقع (هاف مليون) → راشد يختار الانتظار →
المقدم يسوّي العرض من لوحة التحكم → تحديث هدف العائلة وNXP → تبديل إلى أحمد →
مكافأة راشد → العودة لراشد → إشعار المكافأة واحتفال صقر.

Canonical values (all served by the backend — the UI never hardcodes them):

| Moment | Values |
| --- | --- |
| Initial | family 3600 / 12000 ر.س · راشد contributed 300 · NXP 60 · Akthr 120 |
| Plan | أحمد 700 · سارة 400 · راشد 100 (monthly required 1200) |
| Prediction | هاف مليون · 72% · نافذة 3 أيام · توفير محتمل 15 ر.س · اليوم الوطني السعودي |
| After settle | family 3615 · راشد 315 · NXP 70 · Akthr 120 (unchanged) |
| After reward | Akthr 145 · sender ahmed · recipient rashid |

> **Data disclosure:** Akthr, Open Banking, Sah Sukuk, cashback, and merchant-campaign modules are
> deterministic **MOCK** data. The ML inputs and frozen canonical fixture are **SYNTHETIC**
> Saudi-market data; named merchant campaigns are fictional examples, not factual campaign claims.
> No real customer banking data is used.

The canonical demo uses a frozen **SYNTHETIC** fixture evaluated by the CatBoost offer model and
HistGradientBoosting purchase model. Repeated runs produce the same result. A deterministic fallback
is used when the ML service is disabled or unavailable, and no predicted promotion is guaranteed.

## Demo recovery (troubleshooting)

A full reset returns the React app to Home and restores the card **"فعّل حساب التوفير وخطّط ادخارك"**.
There is no standalone onboarding screen. The reset clears prior predictions, decisions, settlements,
mutable rewards, inventory, pet mutations, and journey state; setup then starts again from that Home card.

| Symptom | Fix |
| --- | --- |
| Frontend blank / errors | `Ctrl+C` the Vite terminal, then `npm --prefix frontend run dev` again; hard-refresh (`Ctrl+Shift+R`). |
| Backend dead (`/health` fails) | restart terminal 2: `cd backend && npm run dev`. State lives in the emulator, nothing is lost. |
| Emulator has stale/odd data | click **🔄 إعادة تعيين العرض** in the Cheat Controller (or `curl -X POST http://localhost:3000/api/reset`). Restores every node exactly (family 3600, NXP 60, Akthr 120, plan and predictions cleared). |
| ML status shows fallback | check the reason in the Cheat Controller. `ml_disabled` is the normal no-Python mode; for `ml_unavailable` or `ml_timeout`, verify FastAPI on port 8001 and the `backend/.env` values. The customer journey remains usable. |
| Offer stuck in "waiting" | click **📩 وصل عرض هاف مليون (تسوية)** in the controller — or reset and replay. |
| Reward already sent | expected — duplicates are rejected by design (`duplicate_reward`). The controller shows "تم إرسال المكافأة مسبقاً". To replay the reward beat, reset first. |
| Browser localStorage stale (wrong role, old notices) | DevTools console: `localStorage.clear()` then refresh — or just refresh: unknown roles auto-map to راشد. |
| Full panic, 10 seconds to demo | controller **إعادة تعيين العرض** → app refresh → journey from Home. |

Known limitations: single demo tenant (no production authentication or authorization); all ML data
and merchant campaigns are SYNTHETIC; predictions are probabilistic prototype results, not guaranteed
offers; generated model binaries must exist locally; notification state is demo-scoped; and pet
evolution reacts to **personal** savings only (family contributions cheer the pet but never change its stage).
