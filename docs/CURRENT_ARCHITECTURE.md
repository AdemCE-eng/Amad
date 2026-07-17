# Current architecture

## Runtime topology

Nadeem is a local-first hackathon demo with four existing pieces:

1. `cheat-controller/` is a static operator console served by Express.
2. `backend/` is an ESM Node/Express service. It owns all calculations, calls Gemini only for mascot wording, and writes complete state changes to Firebase Realtime Database.
3. Firebase Realtime Database is the source of truth. Each browser is isolated under `/users/<uuid>`; the local emulator is the default development runtime.
4. `frontend/` is a React/Vite RTL application. It reads backend/Firebase state and renders the family, reward, offer, and mascot experiences.

The approved flow is:

`operator or React client -> Express routes -> pure engines -> atomic Firebase update -> React listeners`

## Backend boundaries

- `backend/src/index.js` mounts stable routes under `/api`, exposes `/health`, and serves the cheat controller.
- `backend/src/logic/` contains pure deterministic engines. `familyEngine.js` calculates explainable savings capacity; `offerEngine.js` derives repeat-campaign predictions; `gameEngine.js` owns NXP/streaks; `petEngine.js` owns mascot state.
- `backend/src/routes/` performs I/O and atomic Firebase writes around those engines.
- `backend/src/mocks/` contains explicitly MOCK Open Banking, merchant campaign, Akthr, and Sah Sukuk data.
- `backend/src/ai/gemini.js` generates mascot text only and has deterministic fallback copy. It does not calculate financial or prediction values.

## Existing offer behavior

`offerEngine.js` must remain stable. It groups MOCK campaign history by merchant and occasion and predicts a repeat when at least two yearly records exist. Its 65%/78% values are deterministic demo rules, not a trained model. `/api/offers/predicted`, `/api/offers/decide`, and `/api/offers/settle` implement the existing demo journey. Offer settlement contributes the expected saving to the family goal and grants NXP; it does not alter Akthr.

## Existing family behavior

`familyEngine.js` calculates each family member's safe surplus and allocates the monthly goal by relative saving capacity. The route layer owns contribution, reward, and notification writes. NXP, Akthr, and money remain separate values.

## Data model

Each UUID record contains `user`, `pet`, `game`, `transactions`, `family`, `offers`, `loyalty`, `rewards`, `notifications`, and `meta` beneath `/users/<uuid>`. `user.username` is the UUID itself. The frontend never writes directly; `POST /api/session` provisions a new record through the backend. The cheat controller enumerates UUID records and applies each presenter action to all of them. The ML service is deliberately stateless with respect to Firebase and operates on pseudonymous IDs and derived/synthetic features.

## Tests and baseline

- `npm --prefix frontend run build`: passed on the isolated branch baseline.
- `npm --prefix backend test`: 24/24 passed.
- `npm --prefix backend run test:routes`: requires the Firebase emulator and backend to be running; without them it fails fast with the documented prerequisite.

## Extension seam

The personalized system is added beside, not inside, the stable offer engine:

`GET /api/ml/recommendations -> personalizedOfferService -> FastAPI when enabled -> validated result`

When ML is disabled, unavailable, slow, invalid, essential, or below threshold, the adapter returns a deterministic fallback derived from the existing offer engine. Existing route semantics and default demo behavior are unchanged.
