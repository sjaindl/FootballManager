# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This App Is

FootballManager (internally "Starting Eleven") is a fantasy football app for Austrian amateur football clubs. Users build lineups from real players, earn points based on player performance, make match predictions, and compete on a leaderboard.

## Commands

```bash
npm start              # Dev server at localhost:4200
ng build               # Production build
ng test                # Unit tests (Karma)
ng lint                # ESLint on src/**/*.ts and src/**/*.html
npx prettier --write . # Format code

firebase deploy --only firestore  # Deploy Firestore rules/indexes
firebase deploy                   # Deploy to Firebase Hosting
```

## Architecture

**Stack**: Angular 20 (standalone components) + NgRx Signals + Firebase (Firestore, Auth, Storage) + Angular Material

### State Management

All state lives in NgRx Signal Stores (`src/app/[feature]/store/*.store.ts`). Key stores:

- **AuthStore** — current user, `isSignedIn`, `uid`
- **ConfigStore** — global game config: `freeze` (lineup locked), `bets` (betting enabled), `season`
- **PlayerStore** / **FormationStore** / **LineupStore** — players, available formations, user's current lineup
- **BettingStore** — match predictions, `nextBet` computed signal
- **UserMatchdayStore** — all users' lineups + scores per matchday (loaded via `forkJoin`)
- **PointsStore** — aggregated standings
- **CoreStore** — global loading counter

Stores use `signalStore()` composed with `withState`, `withComputed`, `withMethods`, `withDevtools` (via `@angular-architects/ngrx-toolkit`). RxJS integration uses `rxMethod()` and `rxjs-interop`.

### Data Loading via Guards

Route guards in `src/app/guards/` handle data loading before navigation, e.g. `playersGuard` loads PlayerStore, `configGuard` loads ConfigStore. Each feature route declares the guards it needs. This means components receive data ready-to-use from stores without triggering their own loads.

### Firebase

- **3 Firestore databases**: `default`, `s11-test`, `s11-prod` — selected in `app.config.ts` based on `environment.production`
- **FirebaseService** (`src/app/service/firebase.service.ts`) is the single service for all Firestore reads/writes. It uses Firestore converters for type-safe serialization.
- **AuthService** (`src/app/service/auth.service.ts`) wraps Firebase Auth, populates AuthStore on `onAuthStateChanged`, creates user doc on first login.

### Key Collections

| Collection | Purpose |
|---|---|
| `users/{uid}` | User profile (userName, photoRef, formation, isAdmin) |
| `users/{uid}/lineup/lineupData` | User's current lineup |
| `users/{uid}/matchdays/{matchdayId}` | User's score per matchday |
| `players/{id}` | All players with nested `points[matchdayId]` |
| `matchDays/{id}` | Match schedule (id format: `{season}_{index}`) |
| `formations/{id}` | Valid formations (4-4-2, 5-3-2, etc.) |
| `bets/{matchdayId}` | Match prediction data |
| `config/config` | Global game config |

### Routing

Routes are in `src/app/app.routes.ts`:
- Public: `/home`, `/faq`, `/privacy`, `/prices`
- Authenticated (via `authGuard`): `/players`, `/standings`, `/profile`, `/lineup`
- Admin only (via `adminGuard`): `/admin/points`, `/admin/bets`, `/admin/news`

### UI Language

UI labels are in German (Tormann, Verteidiger, Mittelfeldspieler, Stürmer for player positions).
