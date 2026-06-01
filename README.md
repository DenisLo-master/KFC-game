# KFS Night Shift

KFS Night Shift is a browser MVP for a mobile-landscape-first horror service loop. The player runs a 90-second night shift at a fast-food kiosk, prepares compact orders, serves normal customers, and uses a separate red shutter action to survive anomalies.

The legacy Canvas catch-game is no longer the product entrypoint. The app launches the React/Three.js KFS Night Shift runtime from `src/main.tsx`.

## Commands

```bash
npm install
npm run dev
npm run test
npm run test:browser
npm run typecheck
npm run build
npm run preview
```

Use `npm run dev` for local development and `npm run preview` after `npm run build` to inspect the production bundle.

## Gameplay

- Before the shift starts, the menu sits over a living night street scene: the KFS kiosk reads as an island of light with wet asphalt, windows, steam, moving pedestrians and future visitors.
- Start a night shift from the main menu.
- Play through a 90-second shift with score, mistakes, threat and timer visible in the HUD.
- Prepare MVP dishes from the cooking controls and use Serve for normal customer orders.
- Correct serves increase score; wrong serves record mistakes and give feedback.
- Visitors now flow from the street to the service window, so the first and later encounters retain continuity with the pre-shift street.
- Anomalies are dangerous customers. Serving them raises danger instead of helping.
- Normal customers use readable ordinary archetypes, while anomalies stay almost ordinary but show subtle suspicious cues.
- Hold the red shutter for 2 seconds to repel an anomaly. Releasing early or reacting late fails protection.
- Pause/resume and reset are available during a shift.
- Survive until the timer expires for victory; critical mistakes or threat cause game over.

## Mobile and Tablet Support

The MVP targets phone landscape and tablet landscape. Portrait orientation shows a rotate gate before gameplay. Core actions are designed as touch-first controls with at least 44px targets, and the HUD is laid out to keep orders, status and actions readable on small landscape screens.

Desktop is supported as a secondary runtime for development and browser checks.

## Architecture

- `index.html` mounts the React root and loads `src/main.tsx`.
- `src/app/store.ts` owns deterministic shift state, customer/order flow, cooking selections, serve results, anomaly protection, pause/reset and end states.
- `src/features/*` contains cooking config, customer generation, archetype/cue metadata, order generation/matching and difficulty constants.
- `src/widgets/Hud.tsx` renders the menu, HUD, prep controls, Serve and Hold Shutter actions, pause/reset and rotate gate.
- `src/widgets/GameScene.tsx` renders the Three.js low-poly street/kiosk scene, worker identity, pedestrian/customer flow, anomaly presentation, shutter state and horror mood.
- `tests/browser/*` covers browser-visible HUD/mobile behavior, street continuity and readability; unit tests live beside feature and store modules.

## Remaining Scope and Residual Risks

- This is an MVP vertical slice, not a campaign or progression system.
- Dish variety is intentionally limited to the 3-4 item MVP set.
- Settings, expanded tutorial content, additional levels and meta-economy are out of scope.
- Build currently accepts a non-blocking chunk-size warning.
- Browser visual evidence accepted non-blocking WebGL `ReadPixels` screenshot warnings.
- Playwright is configured with `workers: 1` for WebGL stability after parallel browser crashes/timeouts were observed.
