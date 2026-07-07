# المرافق المالي الذكي — AI Financial Companion

A gamified virtual pet embedded in the **Alinma Bank** app (Hackathon — Gamification track).
The pet's health, mood, and animations react in real time to the user's financial habits:
**saving heals the pet, breaking the budget makes it sick.**

## Architecture

```
Cheat Controller (buttons)  ──HTTP──▶  Express Backend  ──▶  Firebase Realtime DB  ──▶  React Frontend
                                        (all math + AI)        (single source of truth)   (listens + animates)
```

The backend owns **all** business logic. The Cheat Controller and the Flutter app never compute
anything — the controller triggers endpoints, and the frontend only listens to Firebase.

## Repo layout

| Folder | Owner | Status |
|---|---|---|
| `backend/` | Backend & AI | ✅ built — real Gemini AI live |
| `cheat-controller/` | Backend & AI | ✅ built (served at `/`) |
| `docs/DATA_MODEL.md` | Backend & AI | ✅ the Firebase contract for the frontend |
| `docs/API.md` | Backend & AI | ✅ endpoint reference (for demo/debugging, not needed by frontend) |
| `frontend/` | Frontend (React) | ✅ built |
| `design/` | UI/UX Designer | 🔲 stub |

## Open the project

In File Explorer, open:

```text
D:\guedr\Desktop\Adam\Projects\Amad
```

To edit the code in VS Code, right-click the folder and choose **Open with Code**, or run:

```powershell
code "D:\guedr\Desktop\Adam\Projects\Amad"
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

Keep the three terminal windows open while using the demo. Close those windows to stop the project.

## Cheat Controller — what the demo operator (PM) sees

Open `http://localhost:3000/`. Every action button has its own editable input — type any amount
before clicking, nothing is fixed:

- **🎯 تحديث هدف الادخار** — set the user's savings goal.
- **💰 إيداع راتب** — deposit a salary. Second input controls what % auto-saves (default 20%).
- **💚 مدخرات فورية** — manually move money straight into savings (heals more per SAR than salary).
- **☕ شراء قهوة / 🛍️ شراء كبير** — a small in-budget purchase vs. one that breaks the monthly budget.
- **🛡️ درع الطوارئ** — an emergency withdrawal, penalty-free while the shield has uses left.
- **🔄 إعادة تعيين العرض** — Panic Reset. Wipes everything back to a clean demo state in ~1s. Use
  this between judges.

If you try to spend more than the balance, nothing breaks — you'll see a red "insufficient funds"
banner and no state changes. See [`docs/API.md`](docs/API.md) for the full endpoint reference.

## Manual run (if you do not use the one-click launcher)

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

Open:

- Cheat Controller: `http://localhost:3000/`
- React app: `http://localhost:5173/`
- Firebase emulator UI: `http://localhost:4000`

## Current status

- **Gemini AI is live** (`USE_MOCK_AI=false` in `backend/.env`, real key set) — pet messages are
  genuine AI reactions, not the hardcoded fallback array. Falls back automatically if a call is
  slow or fails, so this is safe to leave on.
- **Firebase is still on the local emulator.** When the real Firebase project is ready: remove
  `FIREBASE_DATABASE_EMULATOR_HOST` from `backend/.env` and set `FIREBASE_DATABASE_URL` + a
  service-account key instead. No code changes required either way.
