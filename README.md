# المرافق المالي الذكي — AI Financial Companion

A gamified virtual pet embedded in the **Alinma Bank** app (Hackathon — Gamification track).
The pet's health, mood, and animations react in real time to the user's financial habits:
**saving heals the pet, breaking the budget makes it sick.**

## Architecture

```
Cheat Controller (buttons)  ──HTTP──▶  Express Backend  ──▶  Firebase Realtime DB  ──▶  Flutter Frontend
                                        (all math + AI)        (single source of truth)   (listens + animates)
```

The backend owns **all** business logic. The Cheat Controller and the Flutter app never compute
anything — the controller triggers endpoints, and the frontend only listens to Firebase.

## Repo layout

| Folder | Owner | Status |
|---|---|---|
| `backend/` | Backend & AI | ✅ built |
| `cheat-controller/` | Backend & AI | ✅ built (served at `/`) |
| `docs/DATA_MODEL.md` | Backend & AI | ✅ the Firebase contract for the frontend |
| `frontend/` | Frontend (Flutter) | 🔲 stub |
| `design/` | UI/UX Designer | 🔲 stub |

## Run it locally (no cloud credentials needed)

Two terminals.

**1 — Firebase Realtime DB emulator**
```bash
npm install -g firebase-tools      # once
firebase emulators:start --only database
```

**2 — Backend + Cheat Controller**
```bash
cd backend
cp .env.example .env               # defaults are emulator + mock AI
npm install
npm run seed                       # inject mock user + pet + transactions
npm run dev                        # Express on http://localhost:3000
```

Open **http://localhost:3000/** → the Cheat Controller. Click the buttons and watch the
pet state change live in the emulator UI (http://localhost:4000).

## Going live (when credentials arrive)

Edit `backend/.env`:
- Set `USE_MOCK_AI=false` and `GEMINI_API_KEY=...` for real AI flavor text.
- Remove `FIREBASE_DATABASE_EMULATOR_HOST` and set `FIREBASE_DATABASE_URL` + a service-account
  key to point at the real Firebase project.

No code changes required.
