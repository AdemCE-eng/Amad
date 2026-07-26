# Current architecture

## Runtime topology

Nadeem has three primary runtime components:

1. `frontend/` is an Arabic-first React/Vite application for saving, budgets,
   family goals, rewards, personalized opportunities, and Saqr progression.
2. `backend/` is an ESM Node.js/Express service. It owns financial
   calculations, validation, workflows, and all Firebase writes.
3. `ml-service/` is an optional FastAPI service for offer-opportunity and
   purchase-behavior prediction.

Firebase Realtime Database is the application state store. Local development
uses the emulator by default, with each browser isolated under
`/users/<uuid>`.

```text
React client
    │
    ▼
Express routes → pure domain engines → Firebase update → React listeners
    │
    └── recommendation adapter → FastAPI ML service
                               └→ deterministic fallback
```

## Backend boundaries

- `backend/src/index.js` mounts routes under `/api` and exposes `/health`.
- `backend/src/logic/` contains deterministic financial and game engines.
- `backend/src/routes/` performs I/O and Firebase writes around those engines.
- `backend/src/mocks/` contains explicitly labeled MOCK financial and campaign
  data.
- `backend/src/services/personalizedOfferService.js` validates ML responses and
  owns fallback behavior.
- `backend/src/ai/gemini.js` may generate mascot wording. It does not calculate
  financial values or probabilities.

## Recommendation architecture

`GET /api/ml/recommendations` calls the recommendation adapter. When enabled,
the adapter requests predictions from FastAPI, validates the response, applies
essential-category suppression, and materializes customer recommendations.

The FastAPI service combines:

- CatBoost offer-opportunity probabilities
- HistGradientBoosting purchase-behavior probabilities
- Estimated saving
- Budget relevance
- Previous user decisions

When ML is disabled, unavailable, slow, or invalid, the adapter returns a
deterministic labeled fallback. The core application does not require Python.

## Data model

Each UUID record contains `user`, `pet`, `game`, `transactions`, `family`,
`offers`, `loyalty`, `rewards`, `notifications`, and `meta` under
`/users/<uuid>`.

The frontend never writes directly to Firebase. `POST /api/session` provisions
the UUID namespace through the backend, and all later state changes pass
through validated API routes.

## Security and production boundaries

The current repository uses MOCK / SYNTHETIC
data. A production deployment would require authentication, authorization,
consent, secrets management, verified banking integrations, audit logging,
model monitoring, and drift detection.
