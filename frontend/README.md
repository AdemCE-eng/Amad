# Frontend (Flutter + Lottie) — STUB

Owned by the Frontend Developer. This folder is a placeholder so the monorepo stays in sync.

## Your contract

Read **[`../docs/DATA_MODEL.md`](../docs/DATA_MODEL.md)** — it defines the exact Firebase Realtime DB
tree you listen to. You never write to the DB; you only render what the backend puts there.

## Build targets

1. **Dashboard Widget** — a small card showing the pet + goal-progress %.
2. **Expanded View** — full screen: pet animation, health bar, AI message speech bubble.

## Wiring

- Listen to `/pet` → swap Lottie animation on `animationState` (`idle | happy | sad | eating | sick`),
  show `pet.message` in a speech bubble, drive the health bar off `pet.health`.
- Read `/user` → progress bar = `savedAmount / goalAmount * 100`.
- **Do NOT build login/signup.** Hardcode the app to open straight to the dashboard.

## Local testing

Point the Firebase SDK at the local emulator (`127.0.0.1:9000`) so you can develop against the same
data the backend seeds. Ask the backend dev to run `npm run seed` + `npm run dev`.
