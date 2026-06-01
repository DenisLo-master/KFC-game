---
slug: interior-movement-interactions
title: "Full interior movement and interaction layer for storage and cooking room"
type: plan
curator: team-lead
status: completed
task_mode: important
mode_reason: "The scope changes core player interaction, visual presentation, and moment-to-moment UX. It is important because the user explicitly requested `important`, and because this is a major product feel upgrade rather than a cosmetic tweak."
closure_mode: standard
closure_mode_reason: "2026-06-01 integration/closure pass was explicitly requested as Developer Team standard mode; external feature-release-arbiter review was not run in this closure pass."
created: 2026-05-31
updated: 2026-06-01
tags:
  - gameplay
  - interior
  - movement
  - interaction
  - visual-direction
---

# Task Card

## Scribe Status

```yaml
scribe_clarification:
  status: SCRIBE_SCOPE_READY
  open_questions: []
  non_blocking_assumptions:
    - The main character is the KFS night-shift worker already present in the current experience.
    - The initial MVP focuses on two connected interior areas: storage and cooking room/service prep area.
    - The result should feel like a full interactive interior layer, not a separate mini-game or isolated overlay.
    - The visual direction continues the current KFS reference set, especially the backroom, service kiosk, worker, visitors, rain, steam, grime, warm signage, and horror-service mood.
    - New supporting visuals may be created beyond the existing reference files if they preserve the same product mood.
```

## User Scope

> продумай перещение гл героя по интерьеру: склад и компаната готовки , надо делать не в стиле мини игры, а полноценный интерактив с визулизацией эффектов взаимодействия. С красивой графиков как продолжение моих референсов, не ограничивайся референс файлами доделывай, запускай important

## Business Goal

Turn the current KFS Night Shift service loop from mostly station/HUD-driven interaction into a more physical interior experience where the main character visibly moves through the storage and cooking room, performs actions in place, and receives clear visual feedback from every interaction.

The player should feel that the worker is actually inside the KFS backroom during the night shift: moving between shelves, prep counters, cooking stations, tray area, and service window while the horror-service pressure continues.

## Business Flow

1. Player starts or continues the night shift.
2. The active interior view presents the worker inside the KFS environment, with storage and cooking room readable as connected playable areas.
3. The player directs the worker to relevant zones: storage, prep surface, fryer, grill, oven, drinks, tray pickup, service window, and shutter/window defense area.
4. When the worker moves, the character visibly travels through the interior instead of actions happening only as abstract button presses.
5. When the worker reaches an interaction zone, the player can trigger the relevant action for the current order or threat state.
6. Each interaction has an observable effect:
   - picking ingredients or tray items;
   - starting cooking;
   - food cooking and becoming ready;
   - collecting prepared food;
   - carrying or placing items on the tray;
   - serving at the window;
   - reacting to anomaly/shutter moments;
   - failing or attempting an invalid action.
7. The game continues to communicate current objective pressure: active order, timer, mistakes, threat, anomaly cues, station readiness, and next useful action.
8. The new interaction layer remains a continuation of the existing night-shift flow rather than a new mode that interrupts the shift.
9. On mobile landscape and tablet landscape, the player can still read the environment, move, interact, and understand feedback without UI overlap.

## Desired Outcome

The player sees a polished interior scene that expands the current reference-driven KFS style into an interactive worker movement loop:

- storage and cooking room feel spatially connected;
- the main character has a clear location and movement path;
- every important service action produces visual feedback in the world;
- cooking, collection, serving, errors, and anomaly pressure are readable without relying only on HUD text;
- the experience feels like a full gameplay layer with atmospheric visuals, not a mini-game panel.

## Acceptance Criteria

- [x] During active gameplay, the main character is visibly present in the interior and has a readable current position.
- [x] The player can direct the main character between storage and cooking/service zones.
- [x] Storage and cooking room are presented as connected KFS interior spaces, not as disconnected cards or a separate mini-game.
- [x] Movement is understandable: the player can tell where the worker is going, when the worker has arrived, and which interaction is available there.
- [x] Interactions at storage, cooking stations, tray/prep area, service window, and shutter/window defense produce clear visual feedback.
- [x] Cooking states are visually distinct: idle, started/cooking, ready, collected, and invalid action.
- [x] Prepared items and tray progress are represented in-world enough that the player can understand service progress without reading only the HUD.
- [x] Anomaly pressure remains integrated with the interior loop and does not disappear while the player is moving or cooking.
- [x] Visual style extends the existing KFS references: dark fast-food interior, warm yellow signage, grimy surfaces, shelves, boxes, prep counter, steam, wet/night mood, and subtle horror cues.
- [x] The feature may add new visual assets or generated visuals beyond the reference files when needed to complete the scene.
- [x] The experience remains playable on mobile landscape and tablet landscape with no incoherent overlap between controls, character, interaction labels, and critical HUD data.
- [x] The final result keeps the existing shift goals recognizable: prepare orders, serve normal customers, avoid serving anomalies, use shutter defense, survive the shift.

## Metrics And Quality Criteria

- Player can understand the next useful action from the interior scene and feedback within a few seconds during a normal order.
- Movement and interaction feedback should reduce the feeling of abstract button-only gameplay.
- Visual readability must hold across desktop, phone landscape, and tablet landscape.
- Interaction feedback must distinguish success, progress, ready state, warning/error, and threat state.
- The scene should look like a continuation of the current reference art, not a generic kitchen or clean bright restaurant.
- The interaction loop should preserve the current shift tension rather than slowing the game into a detached exploration mode.

## Business Entities

- Main character / KFS worker: the playable night-shift employee who moves through the interior and performs actions.
- Storage area: shelves, boxes, ingredients, tray supplies, and cleanup/prep-related items.
- Cooking room / service prep area: fryer, grill, oven, drinks, prep counter, tray, and service flow.
- Service window: connection between interior service work and incoming customers/anomalies.
- Shutter / defense interaction: panic-response element for anomaly handling.
- Order: requested food/drink set that drives the worker's next useful actions.
- Prepared item: food or drink created through station interactions and placed into service flow.
- Station state: idle, cooking, ready, collected, blocked/invalid.
- Interaction effect: visual result of an action, including pickup, steam, sizzle, light pulse, tray change, warning, serve feedback, and threat feedback.
- Reference visual language: KFS backroom, kiosk service area, workers, visitors/anomalies, grime, signage, steam, rain/night mood.

## Dependencies

- Current KFS Night Shift gameplay loop, including orders, station states, prepared items, serving, anomaly handling, shutter defense, timers, score, mistakes, and threat.
- Existing reference assets and current visual direction.
- Mobile-landscape-first product constraint.
- User approval of this business task card before TDD acceptance design and architecture.

## Assumptions

- "Глав герой" means the KFS worker/player character, not a new named protagonist.
- "Склад и комната готовки" are the first priority interior spaces; exterior street remains relevant but is not the focus of this task.
- The feature should upgrade the current active gameplay experience rather than add a separate exploration level.
- The player should not lose the fast service-loop clarity while gaining movement and world interaction.
- Visual additions are allowed if they match the current references and improve completeness.

## Out Of Scope

- Campaign/story progression outside the current night-shift loop.
- New restaurant locations beyond the KFS interior spaces described here.
- Full inventory economy or long-form resource management.
- New customer/anomaly taxonomy unless needed only to preserve existing pressure in the interior loop.
- Final technical architecture, file/module decisions, test design, implementation phases, or asset production plan; those belong to later pipeline roles after approval.

## Approval Gate Before TDD And Architecture

This business task card is approved by the user.

Approval evidence: user confirmed the scribe scope with "ок".

Because `task_mode: important`, the next pipeline steps are:

- TDD expert creates behavior-level acceptance test cases from this approved business plan.
- Architect performs critical review and writes the phase plan in this same file.
- Developer Team executes only through the approved pipeline.
- Mandatory feature expert review is required before final handoff.

## TDD Acceptance Test Design Gate

```yaml
tdd_acceptance_test_design:
  verdict: TDD_ACCEPTANCE_TESTS_READY
  scope_level: behavior
  open_questions: []
  notes: "Acceptance cases are derived from the approved business flow, acceptance criteria, metrics, risks, entities, and assumptions. They intentionally avoid technical implementation, architecture, interface, mock, and runner details."
```

### Acceptance Criterion Links

- AC-1: Main character is visibly present in the interior and has a readable current position.
- AC-2: Player can direct the main character between storage and cooking/service zones.
- AC-3: Storage and cooking room are connected KFS interior spaces, not disconnected cards or a separate mini-game.
- AC-4: Movement communicates destination, arrival, and available interaction.
- AC-5: Storage, cooking stations, tray/prep area, service window, and shutter/window defense interactions produce clear visual feedback.
- AC-6: Cooking states are visually distinct: idle, started/cooking, ready, collected, and invalid action.
- AC-7: Prepared items and tray progress are represented in-world enough to understand service progress without relying only on HUD.
- AC-8: Anomaly pressure remains integrated with the interior loop while moving or cooking.
- AC-9: Visual style extends the existing KFS reference language: dark fast-food interior, warm yellow signage, grime, shelves, boxes, prep counter, steam, wet/night mood, and subtle horror cues.
- AC-10: New visual assets or generated visuals may be added when needed to complete the scene.
- AC-11: Experience remains playable on mobile landscape and tablet landscape without incoherent overlap between controls, character, interaction labels, and critical HUD data.
- AC-12: Existing shift goals remain recognizable: prepare orders, serve normal customers, avoid serving anomalies, use shutter defense, survive the shift.

### Behavior Acceptance Cases

#### ATD-1: Interior Presence And Position Readability

- Linked acceptance criteria: AC-1, AC-3, AC-9.
- Business/user scenario: A player begins or continues the night shift and needs to understand that the worker is physically inside the KFS backroom rather than operating from an abstract control panel.
- Given: Active gameplay is visible and the shift loop is running.
- When: The player looks at the main play area before taking an action.
- Then: The worker's current location is visually readable inside a connected storage and cooking/service interior.
- Expected observable result: The player can identify where the worker is, which room or zone the worker occupies, and that both interior areas belong to one continuous KFS workspace.
- Edge/risk cases:
  - The worker must not be hidden behind critical interface elements during normal play.
  - The interior must not read as detached cards, a popup, or a separate mini-game surface.
  - Dark horror mood must not make position unreadable.
- Metric/risk linkage: Supports visual readability across device classes and reduces abstract button-only gameplay risk.

#### ATD-2: Directed Movement Between Work Zones

- Linked acceptance criteria: AC-2, AC-4, AC-11.
- Business/user scenario: A player chooses where the worker should go next during an order or threat situation.
- Given: The worker is in one playable interior zone and at least one other relevant zone is reachable.
- When: The player directs the worker toward storage, prep, cooking, service, or defense area.
- Then: The worker visibly travels toward the intended zone and arrival is clear.
- Expected observable result: The player can tell the destination, movement progress, arrival moment, and next available action without losing shift context.
- Edge/risk cases:
  - Direction feedback must remain understandable when the player changes intent quickly.
  - Movement must not block awareness of order timer, threat pressure, mistakes, or station readiness.
  - Mobile and tablet landscape controls must not cover the worker, destination feedback, or critical HUD.
- Metric/risk linkage: Protects the metric that the next useful action is understandable within a few seconds and prevents the loop from feeling like detached exploration.

#### ATD-3: Contextual Interaction Availability

- Linked acceptance criteria: AC-4, AC-5, AC-12.
- Business/user scenario: A player reaches a zone and needs to know what can be done there for the current order or threat state.
- Given: The worker has arrived at a zone that may support one or more relevant actions.
- When: The player pauses or attempts to interact at that zone.
- Then: The available action is communicated clearly, and unavailable or invalid actions receive understandable feedback.
- Expected observable result: The player can distinguish "action available", "action in progress", "nothing useful here", and "wrong action for the current state".
- Edge/risk cases:
  - Invalid actions must not appear as silent failures.
  - Interaction cues must not rely only on text labels when visual feedback can carry the meaning.
  - Cues must remain readable during simultaneous order pressure or anomaly pressure.
- Metric/risk linkage: Supports interaction feedback quality and reduces player confusion during fast service pressure.

#### ATD-4: Storage Pickup Feedback

- Linked acceptance criteria: AC-5, AC-7, AC-12.
- Business/user scenario: A player sends the worker to storage to collect an ingredient, tray item, or supply needed for the active order.
- Given: The active order or service flow requires an item associated with storage.
- When: The worker interacts with the correct storage area.
- Then: Pickup feedback is visible in the world and the service flow reflects that progress.
- Expected observable result: The player can see that an item was collected or prepared for the next step, and can infer the next useful action.
- Edge/risk cases:
  - Picking the wrong or unavailable item must produce visible warning/error feedback.
  - Pickup feedback must not be confused with cooking completion or serving completion.
  - Storage visual density must not hide the interaction result.
- Metric/risk linkage: Reinforces in-world service progress and distinguishes success from warning/error states.

#### ATD-5: Cooking State Progression

- Linked acceptance criteria: AC-5, AC-6, AC-7, AC-12.
- Business/user scenario: A player starts cooking at a station, tracks readiness, collects the item, and continues the service sequence.
- Given: The worker has reached a cooking station and the current order requires that station.
- When: The player starts cooking, waits through progress, and collects the prepared item.
- Then: Idle, cooking, ready, collected, and invalid states are visually distinct.
- Expected observable result: The player can identify whether the station is unused, actively cooking, ready to collect, already collected, or rejecting the attempted action.
- Edge/risk cases:
  - Ready state must be noticeable without forcing the player to read only HUD text.
  - Multiple station states must not collapse into the same visual effect.
  - Invalid collection or duplicate collection attempts must be clearly rejected.
- Metric/risk linkage: Directly supports the quality criterion that interaction feedback distinguishes success, progress, ready state, warning/error, and threat state.

#### ATD-6: Tray And Service Progress In The World

- Linked acceptance criteria: AC-5, AC-7, AC-12.
- Business/user scenario: A player assembles prepared items and needs to understand whether the order is ready to serve.
- Given: One or more prepared items have been collected or placed into the service flow.
- When: The player moves through prep/tray and service window actions.
- Then: Tray progress and service readiness are represented in the scene enough to understand current order progress without relying only on HUD text.
- Expected observable result: The player can tell whether an order is incomplete, ready to serve, served correctly, or blocked by a missing/wrong item.
- Edge/risk cases:
  - Partial tray state must be distinguishable from complete tray state.
  - Serving too early or with wrong items must produce visible feedback.
  - Service feedback must preserve recognition of normal customers versus anomaly risk.
- Metric/risk linkage: Reduces abstract button-only gameplay and protects the existing shift goal of preparing and serving correct orders.

#### ATD-7: Anomaly Pressure During Movement And Cooking

- Linked acceptance criteria: AC-5, AC-8, AC-12.
- Business/user scenario: A player is cooking or moving while anomaly pressure escalates and must still notice and respond.
- Given: The shift is active and anomaly or shutter/defense pressure can occur.
- When: Pressure appears while the worker is away from the service window or in the middle of another action.
- Then: Threat cues remain integrated with the interior loop and the player can respond through the appropriate defense interaction.
- Expected observable result: The player can notice the threat, understand urgency, and see feedback from a successful or failed defense response.
- Edge/risk cases:
  - Movement or cooking effects must not hide threat cues.
  - Defense interaction must not feel like leaving the interior layer for a separate mode.
  - Threat feedback must be visually distinct from routine warning/error feedback.
- Metric/risk linkage: Preserves current shift tension and mitigates the risk that interior movement slows or detaches the survival loop.

#### ATD-8: KFS Visual Continuity And Added Visual Completeness

- Linked acceptance criteria: AC-3, AC-9, AC-10.
- Business/user scenario: A player familiar with the current KFS reference mood sees the expanded interior and expects it to feel like the same product world.
- Given: The interior layer is visible during active gameplay.
- When: The player observes storage, cooking/service areas, interaction effects, and environmental mood.
- Then: The scene extends the existing dark fast-food, wet-night, grime, warm-signage, steam, and subtle horror visual language; any new visuals feel consistent and complete the scene.
- Expected observable result: The expanded interior reads as KFS backroom/service space rather than a generic clean kitchen or unrelated restaurant.
- Edge/risk cases:
  - New visual additions must not dilute the horror-service mood.
  - The scene must not depend on reference files so narrowly that missing areas feel unfinished.
  - Atmospheric effects must not reduce gameplay readability.
- Metric/risk linkage: Protects visual style quality and reduces risk of the scene feeling generic or disconnected from references.

#### ATD-9: Landscape Device Playability

- Linked acceptance criteria: AC-1, AC-2, AC-4, AC-5, AC-11.
- Business/user scenario: A player uses desktop, phone landscape, or tablet landscape and expects the same movement and interaction loop to remain playable.
- Given: Active gameplay is displayed on a supported landscape layout.
- When: The player moves between zones, reads interaction cues, responds to feedback, and monitors critical shift information.
- Then: Controls, character, interaction labels, visual effects, and critical HUD data remain coherent and non-overlapping.
- Expected observable result: The player can perform the core order and threat loop without losing the worker, controls, interaction state, or critical shift information behind overlapping visual elements.
- Edge/risk cases:
  - Smaller landscape screens must not hide arrival or interaction feedback.
  - Larger tablet landscape must not spread critical cues so far apart that the next useful action becomes unclear.
  - Visual effects must not cover controls or critical status at the moment they are needed.
- Metric/risk linkage: Directly supports visual readability across desktop, phone landscape, and tablet landscape.

### TDD Gate Handoff Notes For Architect

- The architect should map these behavior cases into phases and future test surfaces without changing their business meaning silently.
- Technical test placement, public entry points, data shape, mocks, asset production sequence, and runner commands are intentionally not defined at this gate.
- Highest behavior risks to preserve in phase planning: interior must not become a detached mini-game; movement must not hide order/threat pressure; feedback states must stay visually distinct; mobile and tablet landscape layouts must remain playable.

## Architect Section

```yaml
architect_gate:
  verdict: ARCHITECT_PHASE_APPROVED
  owner: architect
  reports_to: team-lead
  curator: team-lead
  task_mode: important
  business_scope: approved
  tdd_acceptance_gate: TDD_ACCEPTANCE_TESTS_READY
  runtime_phase_plan_projection: not-supported
  runtime_projection_reason: "This Codex runtime does not expose an app_server_turn_plan_updated or equivalent persistent runtime plan event tool; the persisted plan file is the source of truth."
  cross_engine_review: "not requested at phase-plan stage"
```

### Dirty Worktree Note

Observed before architect edits:

- Current branch: `codex/kfs-street-scene-references`, not `work/interior-movement-interactions`.
- Existing dirty/unrelated files: `.runtime/qa-artifacts/kfs-street-scene-references/phase4/*.png`, `.runtime/qa-artifacts/kfs-street-scene-references/phase5/*.png`, and `src/styles.css`.
- Existing untracked path: `docs/plans/`.
- Architect edit scope for this task: `docs/plans/interior-movement-interactions.md` only.

Team-lead should create or route implementation through `.worktrees/interior-movement-interactions/` on `work/interior-movement-interactions` from `origin/dev` before developer work, per team protocol.

### Retrieval And Verified Surfaces

- Knowledge base: `docs/context`.
- Retrieval queries attempted:
  - `interior movement worker storage cooking room interaction visual feedback KFS night shift`
  - `gameplay loop orders cooking stations tray service window anomaly shutter defense`
  - `responsive mobile landscape KFS visual scene assets QA Playwright`
- Candidate cards: none. `docs/context` is absent in this checkout and `scripts/knowledge.sh` is missing, so vector and lexical retrieval could not run.
- Fallback search: `rg --files`, targeted `rg`, and direct file opens across source, tests, config, README, references, and current plan.
- Opened implementation surfaces:
  - `src/app/store.ts`: owns `GamePhase`, cooking state, `preparedItems`, `WorkerZone`, `ActionCue`, order/customer timers, anomaly threat, shutter protection, station start/collect, serve, pause/reset, and Phase 4 debug hook.
  - `src/widgets/ReferenceScene.tsx`: renders reference-backed active service view, `service-layout`, storage/kitchen/window zones, station markers, `kitchen-worker` position from `actionCue.workerZone`, active guide, visitor layers, and backroom/worker reference assets.
  - `src/widgets/GameScene.tsx`: R3F canvas tick loop and invisible hot zones for fryer, grill, oven, drink, and shutter.
  - `src/widgets/Hud.tsx`: HUD, order/prep panels, gameplay guide, station buttons, tray summary, Serve, Quick, Clear, Hold Shutter, mobile orientation gate, active customer/anomaly readability layer.
  - `src/pages/GamePage.tsx`, `src/app/App.tsx`, `src/main.tsx`: runtime composition and React entrypoint.
  - `src/shared/sceneVisualState.ts`: visual-state contract for street ambience, worker identity, anomaly cues, shutter state, active visitor presentation.
  - `src/features/cooking/types.ts`, `src/features/cooking/config.ts`: station ids and station statuses currently limited to `idle | cooking | ready`.
  - `src/features/orders/*`, `src/features/customers/*`, `src/features/difficulty/config.ts`: order matching, generation, anomaly/customer flow, difficulty and timing inputs.
  - `src/styles.css`: HUD, service layout, worker marker, station feedback, responsive mobile/tablet landscape rules.
  - `public/assets/references/*.png`, `docs/references/*.png`: existing KFS reference art pool.
- Opened test/config surfaces:
  - `src/app/store.test.ts`: existing unit coverage for shift start, serving, anomaly/shutter, pause immutability, station ready/collect action cues, reset.
  - `src/shared/sceneVisualState.test.ts`: existing visual-state contract tests for worker identity, ordinary/anomaly cues, active visitor, shutter.
  - `src/features/orders/core.test.ts`, `src/features/customers/generator.test.ts`: order/customer behavior surfaces.
  - `tests/browser/phase3-hud.spec.ts`: mobile HUD, touch controls, current service-layout/worker/station visible checks.
  - `tests/browser/phase4-readability.spec.ts`: active visitor and anomaly visual readability, debug hook screenshots.
  - `tests/browser/street-scene.spec.ts`: reference-backed scene, pixel variance, active service continuity, artifact capture.
  - `package.json`: `npm run test`, `npm run typecheck`, `npm run build`, `npm run test:browser`.
  - `playwright.config.ts`: serial Chromium browser gate with production build/preview on `127.0.0.1:4173`.
- Markdown/code drift:
  - `README.md` still states `GameScene.tsx` renders the low-poly street/kiosk scene. Actual opened code shows `ReferenceScene.tsx` now owns the reference-backed service/interior visual layer while `GameScene.tsx` mainly provides R3F ticking and invisible interaction planes.
  - Business plan asks for full movement/interior interaction. Current code has an `actionCue.workerZone` marker jump/transition and visual zones, but no first-class worker movement path, movement intent, arrival state, storage/tray world model, or invalid interaction model beyond cue messages.

### Critical Review

Decision: proceed with a phased enhancement of the existing KFS runtime, not a separate mini-game or route.

- The accepted scope is feasible within the current React/Zustand/ReferenceScene architecture if worker movement becomes first-class state and the existing visual service layer is extended.
- The risky part is not adding art. The risky part is preserving the fast order/anomaly loop while inserting movement, arrival, and in-world feedback. Movement must be lightweight and intent-driven, not a free-roam simulation.
- Current `ActionCue` is useful as a feedback/event channel but is overloaded as the worker location source. The implementation should split durable worker movement state from transient action feedback.
- Current cooking stations have only `idle | cooking | ready`. The accepted behavior also needs collected/invalid feedback. Do not mutate station status into every UI effect if a separate transient effect/event record is clearer.
- Current storage is mostly a HUD concept. Storage should become a real interaction zone in state and visual scene, but the existing order and ingredient models should stay authoritative.
- The ReferenceScene asset-backed approach is the lowest-risk way to preserve the KFS mood. Full 3D interior rebuild would increase scope and threaten mobile readability.
- Mobile landscape is a release risk because current panels and action dock already compete with the service layout. Each phase must include viewport checks at desktop, phone landscape, and tablet landscape.

### Brainstorming-lite

Option A, selected: extend the current single active gameplay view with first-class interior movement state, richer ReferenceScene world feedback, and existing HUD controls adapted to zone-aware actions.

- Pros: preserves current shift loop, tests, assets, anomaly model, and mobile controls; avoids route/mode split; compatible with the business requirement that this is not a mini-game.
- Cons: requires careful separation between state, scene, and HUD so `actionCue` does not become a catch-all.

Option B, rejected: build a separate canvas/Three.js interior mini-scene with custom navigation and a new service loop adapter.

- Rejection reason: high regression risk, duplicates current order/anomaly logic, and conflicts with the approved "not mini-game" direction.

Option C, rejected for MVP: full free-roam pathfinding/navigation across a 2D/3D room map.

- Rejection reason: adds pathfinding, collision, and camera complexity that is not required for the accepted behavior. Directed zone movement is enough for current ACs.

### Architecture Direction

- Keep `src/app/store.ts` as the authoritative game state for shift, order, anomaly, station, tray, and worker movement state.
- Add a first-class interior model, likely near `src/features/interior/`:
  - zone ids: storage, prep/tray, fryer, grill, oven, drink, service window, shutter;
  - zone metadata: label, room, visual anchor, action capabilities;
  - worker movement state: current zone, target zone, status `idle | moving | arrived | interacting`, progress, last arrived zone;
  - interaction effect events: pickup, start cooking, ready, collect, place tray, serve, shutter, invalid/warning.
- Keep `ActionCue` or replace it with a narrower feedback event after migration. The worker's actual position should not be inferred only from the last action cue.
- Extend `ReferenceScene.tsx` to render the connected storage/cooking/service room as the main active scene, using existing reference art plus scene-native overlays for shelves, counters, station effects, tray state, worker movement path/arrival, and anomaly/window pressure.
- Keep `GameScene.tsx` as tick/input plane only if needed. If interaction is mostly DOM-driven after the interior refactor, keep the canvas light and avoid duplicating scene visuals.
- Keep HUD as support, not the primary experience. HUD must expose critical timers/order/threat and zone/action controls, while ReferenceScene carries position, station state, tray progress, and interaction feedback.
- Use existing test ids where stable, but add explicit test ids for future behavior: `interior-scene`, `worker-avatar`, `worker-path`, `zone-storage`, `zone-prep`, `zone-window`, `tray-world-state`, `interaction-effect`, `invalid-action-feedback`.
- Generated/new bitmap assets are allowed only if they match the KFS dark fast-food reference language and are integrated through `public/assets/references` or a clearly named new asset folder with browser evidence.

### ATD Mapping Summary

| Acceptance case | Primary phase | Future test surfaces |
| --- | --- | --- |
| ATD-1 Interior Presence And Position Readability | Phase 2 | `src/shared/interiorVisualState.test.ts`, `tests/browser/interior-movement.spec.ts`, visual artifacts |
| ATD-2 Directed Movement Between Work Zones | Phase 1, Phase 2 | `src/app/store.test.ts`, `tests/browser/interior-movement.spec.ts` |
| ATD-3 Contextual Interaction Availability | Phase 1, Phase 3 | `src/app/store.test.ts`, `tests/browser/interior-interactions.spec.ts` |
| ATD-4 Storage Pickup Feedback | Phase 3 | `src/app/store.test.ts`, `tests/browser/interior-interactions.spec.ts` |
| ATD-5 Cooking State Progression | Phase 1, Phase 3 | `src/app/store.test.ts`, existing station tests, browser station feedback tests |
| ATD-6 Tray And Service Progress In The World | Phase 3 | `src/features/orders/core.test.ts`, `src/app/store.test.ts`, browser tray-world tests |
| ATD-7 Anomaly Pressure During Movement And Cooking | Phase 4 | `src/app/store.test.ts`, `src/shared/sceneVisualState.test.ts`, browser anomaly/shutter tests |
| ATD-8 KFS Visual Continuity And Added Visual Completeness | Phase 2, Phase 5 | `tests/browser/street-scene.spec.ts`, new visual artifacts, feature expert visual review |
| ATD-9 Landscape Device Playability | Phase 5 | `tests/browser/phase3-hud.spec.ts`, new browser layout tests, visual artifacts |

## Phases

### Phase 1: Interior State And Movement Contract

Status: completed
Started: 2026-06-01 05:08 +0000
Completed: 2026-06-01 05:18 +0000
Linked acceptance cases: ATD-2, ATD-3, ATD-5
requires_tdd: yes
requires_debugging_protocol: no

Goal: introduce a durable, testable interior movement and zone-interaction contract without changing the visual layer first.

Likely files/modules touched:

- `src/app/store.ts`
- `src/app/store.test.ts`
- `src/features/cooking/types.ts`
- `src/features/cooking/config.ts`
- new `src/features/interior/types.ts`
- new `src/features/interior/config.ts`
- optional new `src/features/interior/movement.ts`

Implementation direction:

- Add interior zone definitions for storage, prep/tray, fryer, grill, oven, drink, window, and shutter.
- Add worker movement state separate from `ActionCue`, with current zone, target zone, movement status, progress, and arrival information.
- Add public store actions such as `moveWorkerTo(zone)`, `interactAtCurrentZone()`, and/or zone-aware wrappers around station/tray/window/shutter actions.
- Preserve existing direct actions during migration, but route them through movement/interaction state where possible.
- Keep current order, station, prepared item, anomaly, and shutter rules authoritative.
- Model invalid interaction feedback as a transient event/cue, not silent no-op.

Test strategy:

- TDD-expert strategy gate before developer work must approve unit tests for movement start, retargeting, arrival, and invalid interaction.
- Add failing Vitest cases in `src/app/store.test.ts` before implementation:
  - worker starts at window or configured starting zone after `startShift`;
  - moving to storage/fryer/window sets target and eventually arrives through `tick`;
  - retargeting during movement updates destination without corrupting order/timers;
  - station start/collect feedback maps to worker movement/zone state;
  - invalid zone interaction records warning/error feedback.
- Run `npm run test` and `npm run typecheck`.

#### Phase 1 TDD Strategy Gate

```yaml
tdd_strategy_gate:
  verdict: TDD_PHASE_READY
  checked_phase: "Phase 1: Interior State And Movement Contract"
  applicability: required
  acceptance_cases:
    - ATD-2
    - ATD-3
    - ATD-5
  public_interfaces:
    - "useGameStore.getState().startShift()"
    - "useGameStore.getState().tick(delta)"
    - "new public movement action: moveWorkerTo(zone)"
    - "new public zone interaction action: interactAtCurrentZone() or equivalent explicit zone-aware store action"
    - "existing station actions: startCooking(station), collectStation(station)"
  behaviors_to_pin:
    - "startShift initializes durable worker movement state independently from actionCue"
    - "moveWorkerTo records target zone, moving status, and preserves shift/customer/cooking timers"
    - "tick advances movement progress to arrived/current zone without pausing customer, anomaly, or station progress"
    - "retargeting during movement replaces target cleanly without corrupting current order, stations, prepared items, or timers"
    - "interactAtCurrentZone maps valid station-zone actions to start/collect feedback while preserving existing station rules"
    - "invalid current-zone interactions produce warning/error feedback and do not silently mutate tray, station, order, score, mistakes, or threat"
  first_red_test: "src/app/store.test.ts: starts shift with a durable worker movement state at the configured starting zone, separate from actionCue"
  required_commands:
    red: "npm run test -- src/app/store.test.ts"
    green:
      - "npm run test -- src/app/store.test.ts"
      - "npm run test"
      - "npm run typecheck"
  forbidden_test_coupling:
    - "Do not assert private helper names, movement duration constants, CSS class names, or DOM layout in Phase 1 unit tests."
    - "Do not keep worker position assertions tied only to actionCue.workerZone."
    - "Do not mock Zustand internals, Date/Math randomness unless an existing test pattern requires deterministic prepared item ids."
  notes: "Phase 1 has enough observable behavior and test surfaces through the store contract. Browser tests remain Phase 2+ because Phase 1 intentionally does not change the visual layer."
```

Developer TDD evidence expectations:

- Attach `tdd_status.applied: yes` with the first failing test diff/snippet and RED output for `npm run test -- src/app/store.test.ts`.
- Show GREEN output for the same targeted command after the minimal implementation.
- Show final `npm run test` and `npm run typecheck` outputs before TDD evidence handoff.
- Explain any preserved legacy direct actions and how they coexist with the new movement contract during migration.

#### Phase 1 Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  tdd_status:
    applied: yes
    red_evidence:
      prior_gate_observation: "QA/TDD/reviewer already observed RED for missing interior config, durable workerMovement, and public movement/action APIs after Phase 1 tests were introduced."
      corrective_red_command: "npx vitest run src/app/store.test.ts --maxWorkers=1"
      corrective_red_result: "failed: 4 failed / 30 total; failures covered legacy direct station movement sync, storage/prep warning labels, window interaction serve routing, and shutter interaction protection routing."
    green_evidence:
      targeted_store_test:
        command: "npx vitest run src/app/store.test.ts --maxWorkers=1"
        result: "passed: 1 file, 30 tests"
      all_src_tests:
        command: "npx vitest run src --maxWorkers=1"
        result: "passed: 4 files, 52 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
    process_limit_workaround: "Plain Vitest/npm test spawned too many workers in this container and hit pthread_create limits; reran Vitest with --maxWorkers=1 for targeted and all-src verification."
  implementation_notes:
    - "index.html now mounts the restored React runtime via #root and /src/main.tsx instead of the stale /src/main.js canvas entry."
    - "Legacy startCooking/collectStation direct calls now synchronize durable workerMovement to the operated station while keeping actionCue transient and backward compatible."
    - "interactAtCurrentZone() now has explicit Phase 1 behavior for storage, prep, window, and shutter: storage/prep produce clear warning feedback without protected state mutation; window routes through serveCustomer(); shutter routes through beginProtection()."
  corrective_pass:
    reviewer_findings_addressed:
      - "Restored the coherent React/KFS baseline stylesheet from local branch codex/kfs-street-scene-references into src/styles.css; grep confirmed .game, .reference-scene, and .hud-layer selectors."
      - "ReferenceScene now derives the rendered kitchen-worker zone from durable workerMovement via getVisibleWorkerZone(), while preserving actionCue classes for transient cue effects."
      - "Added minimal src/features/interior/movement.test.ts coverage for durable visible-zone mapping instead of adding browser tests for this Phase 1 correction."
    verification:
      all_src_tests: "npx vitest run src --maxWorkers=1 passed: 5 files, 53 tests"
      typecheck: "npm run typecheck passed"
      build: "npm run build passed; Vite emitted existing public asset resolution notices and >500 kB chunk-size warning"
```

QA evidence expectations for Phase 1:

- Re-run `npm run test` and `npm run typecheck`.
- Confirm no production browser visual claims are made for Phase 1.
- Confirm existing action/timer/anomaly/station tests still pass while new worker movement tests cover ATD-2, ATD-3, and ATD-5.

Reviewer checks:

- Verify worker position is no longer derived only from `actionCue`.
- Verify timers, anomaly threat, cooking progress, and pause immutability remain intact.
- Verify types do not couple visual CSS names to store state.
- Verify no mini-game phase, route, or detached loop was introduced.

Risks:

- Store can become too large if all interior behavior is inlined.
- Existing browser tests may rely on `data-worker-zone` from `actionCue`.

Rollback:

- Revert new interior state/actions and tests; keep existing `ActionCue` behavior unchanged.
- Because this phase is state-first and no asset migration is required, rollback is local to store/types/tests.

#### QA / Expert Coverage Matrix

| surface | trigger | required_agent_or_evidence | required_status | handoff_artifact | owner | status |
| --- | --- | --- | --- | --- | --- | --- |
| state/gameplay | New movement and interaction state | tdd-expert strategy and evidence gates | pass | `tdd_status` plus Vitest output | team-lead | pass |
| state/gameplay | Store actions affect timers, stations, tray, anomaly loop | qa product gate | pass | QA report with `npm run test` and `npm run typecheck` | qa | pass |
| code architecture | New interior module boundaries | local reviewer | pass | review report | team-lead | pass |
| release risk | Important task behavior change | qa-reliability-reviewer | pass | local QA/reviewer evidence accepted for standard closure; no external expert run | team-lead | waived |

### Phase 2: Connected Interior Scene And Worker Movement Visualization

Status: completed
Started: 2026-06-01 05:08 +0000
Completed: 2026-06-01 05:18 +0000
Linked acceptance cases: ATD-1, ATD-2, ATD-8
requires_tdd: yes
requires_debugging_protocol: no

Goal: make the connected storage/cooking/service interior and visible worker movement the primary active scene, preserving KFS visual language.

Likely files/modules touched:

- `src/widgets/ReferenceScene.tsx`
- `src/widgets/GameScene.tsx`
- `src/styles.css`
- new or extended `src/shared/interiorVisualState.ts`
- new `src/shared/interiorVisualState.test.ts`
- `public/assets/references/*` or a new asset folder if new visuals are generated
- `tests/browser/interior-movement.spec.ts`

Implementation direction:

- Render storage and cooking/service as a single continuous KFS workspace, not disconnected labels or cards.
- Replace jump-only worker marker behavior with movement progress, path/intent feedback, arrival state, and available-action state.
- Add visual anchors for storage shelves/boxes, prep/tray area, fryer, grill, oven, drinks, service window, and shutter.
- Keep visitor/anomaly window pressure visible while the worker is elsewhere.
- Use existing `kfs-backroom.png`, `kfs-kiosk-service.png`, worker references, steam/rain/grime/signage mood as baseline. Add new bitmap assets only if needed for missing interior completeness.

Test strategy:

- Add/extend Vitest for any pure `interiorVisualState` mapping.
- Add Playwright checks:
  - `interior-scene`, `zone-storage`, `zone-kitchen` or station zones, `zone-window`, `worker-avatar`, and `worker-path` visible after start;
  - worker has stable initial zone and movement/arrival attributes after selecting another zone;
  - desktop and phone landscape screenshots are nonblank and include worker/interior anchors.
- Run `npm run test`, `npm run typecheck`, `npm run build`, `npm run test:browser`.
- Capture visual evidence under a new `.runtime/qa-artifacts/interior-movement-interactions/phase2/` path.

#### Phase 2 TDD Strategy Gate

```yaml
tdd_strategy_gate:
  verdict: TDD_PHASE_READY
  checked_phase: "Phase 2: Connected Interior Scene And Worker Movement Visualization"
  applicability: required
  acceptance_cases:
    - ATD-1
    - ATD-2
    - ATD-8
  current_baseline:
    - "Phase 1 durable workerMovement exists and ReferenceScene reads it through getVisibleWorkerZone()."
    - "No tests/ browser directory or playwright.config.ts exists in this worktree yet; Phase 2 must add the browser test surface before production visual changes are accepted."
    - "No public asset directory exists in this worktree; KFS visual continuity must be proven by loaded scene assets or explicitly added matching visual assets."
  public_interfaces:
    - "useGameStore.getState().startShift()"
    - "useGameStore.getState().moveWorkerTo(zone)"
    - "useGameStore.getState().tick(delta)"
    - "ReferenceScene rendered DOM test contract after startShift"
    - "new/extended pure interior visual mapping helper, e.g. getInteriorVisualState(state)"
  required_red_tests:
    - file: "src/shared/interiorVisualState.test.ts"
      expectation: "fails until durable workerMovement maps to scene-safe attributes for current zone, target zone, movement status, path visibility, arrival cue, and available action state without reading actionCue as the worker position source."
    - file: "tests/browser/interior-movement.spec.ts"
      expectation: "fails until active gameplay renders interior-scene, zone-storage, zone-kitchen/stations, zone-window, worker-avatar, worker-path, and movement/arrival/action availability attributes."
    - file: "tests/browser/interior-movement.spec.ts"
      expectation: "fails until selecting a zone or invoking movement changes worker data attributes from arrived/current zone to moving/target zone, then to arrived/current zone after tick/runtime progress."
    - file: "tests/browser/interior-movement.spec.ts"
      expectation: "fails until desktop and phone landscape screenshots are nonblank and include worker/interior anchors with no critical overlap."
  behaviors_to_pin:
    - "active gameplay presents one connected storage/cooking/service KFS workspace, not disconnected cards or a separate mini-game panel"
    - "worker visualization is driven by durable workerMovement and exposes current zone, target zone, status, progress/path, and arrival state as observable DOM attributes"
    - "available action state is visible at the arrived/current zone and does not depend only on HUD text"
    - "KFS continuity is visible through dark fast-food backroom/service styling, warm signage, grime/shelves/counters/steam/rain mood, and loaded or generated matching assets"
    - "visitor/anomaly window pressure remains visible while worker is away from the window"
    - "desktop and phone landscape layouts keep worker, path, arrival cue, zone anchors, and critical HUD/action controls readable"
  first_red_test: "src/shared/interiorVisualState.test.ts: derives worker path/arrival/action-availability visual state from workerMovement after startShift and moveWorkerTo('storage')"
  required_commands:
    red:
      - "npm run test -- src/shared/interiorVisualState.test.ts"
      - "npm run test:browser -- tests/browser/interior-movement.spec.ts"
    green:
      - "npm run test -- src/shared/interiorVisualState.test.ts"
      - "npm run test"
      - "npm run typecheck"
      - "npm run build"
      - "npm run test:browser -- tests/browser/interior-movement.spec.ts"
      - "npm run test:browser"
  evidence_expectations:
    - "RED output for the pure visual-state test and browser spec before production visual implementation."
    - "GREEN output for targeted Vitest, all Vitest, typecheck, build, targeted browser spec, and full browser gate."
    - "Screenshots saved under .runtime/qa-artifacts/interior-movement-interactions/phase2/ for desktop and phone landscape, plus tablet landscape if already available in the browser matrix."
    - "Browser evidence must show connected storage/cooking/service interior, worker path, arrival state, action availability attributes, and KFS visual continuity."
  forbidden_test_coupling:
    - "Do not assert CSS class names, exact animation durations, pixel-perfect coordinates, private helper names, or asset filenames unless the filename is the user-visible asset contract."
    - "Do not make worker position assertions rely only on actionCue.workerZone."
    - "Do not use screenshot-only tests as the sole proof of movement state; assert semantic DOM/data attributes plus visual artifacts."
  notes: "Phase 2 is ready for developer TDD. Browser harness and missing asset directory are required setup/work items for the phase, not reasons to bypass RED tests."
```

Reviewer checks:

- Verify visual scene is not a set of disconnected cards.
- Verify worker remains visible and readable against dark mood.
- Verify pointer/canvas layers do not block HUD controls.
- Verify asset paths are production-build safe.

Risks:

- CSS/asset layering may hide the worker or critical HUD on small landscape screens.
- New art could drift into a generic kitchen style.
- R3F canvas plus DOM visual layers may create confusing input hit areas.

Rollback:

- Keep Phase 1 state contract, revert ReferenceScene/CSS/asset additions, restore previous service-layout rendering.

#### QA / Expert Coverage Matrix

| surface | trigger | required_agent_or_evidence | required_status | handoff_artifact | owner | status |
| --- | --- | --- | --- | --- | --- | --- |
| browser-visible UI | New interior scene, worker movement, KFS visual layer | visual-interface-qa or QA visual evidence | pass | screenshots for desktop and phone landscape | feature-release-arbiter | pass |
| React/UI responsiveness | Movement visualization and state-driven rendering | react-interface-responsiveness-architect | pass | local reviewer plus browser overlap/responsiveness matrix accepted for standard closure | team-lead | waived |
| render/performance | Layered reference assets, animations, possible canvas/DOM overlap | frontend-render-performance-reviewer or approved performance evidence | pass | performance evidence or waiver | feature-release-arbiter | pass |
| state/visual contract | Interior visual mapping | tdd-expert strategy and evidence gates | pass | `tdd_status`, Vitest output | team-lead | pass |
| implementation | Scene module/CSS changes | qa product gate and local reviewer | pass | QA report, review report, browser output | qa/team-lead | pass |

#### Phase 2 Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  tdd_status:
    applied: yes
    red_evidence:
      pure_visual_state:
        command: "npx vitest run src/shared/interiorVisualState.test.ts --maxWorkers=1"
        result: "failed before implementation: Cannot find module './interiorVisualState' imported from src/shared/interiorVisualState.test.ts"
      required_npm_targeted_attempt:
        command: "npm run test -- src/shared/interiorVisualState.test.ts"
        result: "environment failure before test collection: pthread_create Resource temporarily unavailable / ERR_IPC_CHANNEL_CLOSED"
      browser_spec:
        command: "npm run test:browser -- tests/browser/interior-movement.spec.ts"
        result: "spec present and RED, but Chromium failed at launcher before semantic assertions because cgroup pids.current was ~429/512 and Chromium hit pthread_create Resource temporarily unavailable"
    green_evidence:
      targeted_visual_state:
        command: "npx vitest run src/shared/interiorVisualState.test.ts --maxWorkers=1"
        result: "passed: 1 file, 1 test"
      all_src_tests:
        command: "npx vitest run src --maxWorkers=1"
        result: "passed: 6 files, 54 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      browser_runner:
        command: "npm run test:browser -- tests/browser/interior-movement.spec.ts --workers=1"
        result: "blocked by environment: Chromium launcher hit cgroup PID/thread cap even with --single-process --no-zygote"
      direct_playwright_evidence:
        command: "direct Playwright chromium.launch() script against npm run preview -- --port 4173"
        result: "passed DOM assertions for connected interior, zone anchors, worker movement/path/arrival attributes, HUD/action visibility, and captured screenshots"
    visual_artifacts:
      desktop: ".runtime/qa-artifacts/interior-movement-interactions/phase2/interior-movement-desktop.png"
      phone_landscape: ".runtime/qa-artifacts/interior-movement-interactions/phase2/interior-movement-phone-landscape.png"
  implementation_notes:
    - "Restored missing public reference assets, tests/browser baseline specs, and playwright.config.ts from local codex/kfs-street-scene-references before Phase 2 tests."
    - "Added src/shared/interiorVisualState.ts as a pure mapping from durable workerMovement plus stations/order/customer state into current/target zones, moving/arrived/path visibility, connected room, and action availability attributes."
    - "Extended ReferenceScene with a connected interior-scene contract while preserving existing service-layout, scene-zone-*, scene-station-*, and kitchen-worker test ids from Phase 1/baseline."
    - "Worker avatar/path now expose data-current-zone, data-target-zone, data-movement-status, data-arrived, data-path-visible, data-action-available, and data-path attributes driven by workerMovement."
    - "Playwright config now allows reusing an existing preview server and constrains Chromium launch with --single-process --no-zygote for this low-PID container."
  corrective_pass_after_review_qa_blocked:
    applied_at: "2026-06-01T05:35:02Z"
    reason: "Addressed REVIEW_BLOCKED/QA_BLOCKED findings for Phase 2 visual movement coherence, visible browser contract, and 667x375 phone landscape overlap risk."
    fixes:
      - "Worker visual position now interpolates from durable workerMovement.currentZone to targetZone using workerMovement.progress; current zone remains durable until arrival."
      - "Removed left/bottom CSS transitions from the worker so CSS timing no longer contradicts INTERIOR_MOVEMENT_SECONDS; per-frame state progress drives position."
      - "worker-avatar test id now belongs to a visible non-zero avatar element instead of a transparent proxy span."
      - "worker-path is visibility-hidden when arrived/idle and visible only while movement is active; browser spec asserts both states."
      - "Phone landscape compact anchors were moved below the HUD and above the action dock; direct evidence checks no overlap among anchors, worker, HUD, and dock at 667x375."
      - "Added direct Playwright evidence script with visible box checks, interpolation checks, path visibility checks, phone overlap checks, screenshots, and PNG variance checks."
    commands:
      targeted_unit:
        command: "npx vitest run src/shared/interiorVisualState.test.ts src/features/interior/movement.test.ts --maxWorkers=1"
        result: "passed: 2 files, 2 tests"
      all_src_tests:
        command: "npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 54 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      official_targeted_browser_attempt:
        command: "npm run test:browser -- tests/browser/interior-movement.spec.ts --workers=1"
        result: "blocked by environment before assertions: Chromium launcher hit pthread_create Resource temporarily unavailable"
      direct_playwright_evidence:
        command: "node tests/browser/interior-movement-evidence.mjs"
        result: "passed visible worker/avatar/anchor box checks, movement interpolation checks, path moving/arrived visibility checks, 667x375 overlap checks, and PNG variance checks"
    visual_artifacts:
      desktop: ".runtime/qa-artifacts/interior-movement-interactions/phase2/interior-movement-desktop-corrective.png"
      phone_landscape: ".runtime/qa-artifacts/interior-movement-interactions/phase2/interior-movement-phone-landscape-corrective.png"
      direct_evidence_report: ".runtime/qa-artifacts/interior-movement-interactions/phase2/interior-movement-corrective-evidence.json"
  browser_spec_stability_pass:
    applied_at: "2026-06-01T05:50:20Z"
    reason: "Reviewer-blocked official Playwright suite still launched a new page per case in the PID-limited runtime; the movement case passed in isolation and direct evidence passed, but the suite failed at browserContext.newPage after Chromium closed."
    strategy_change:
      - "Collapsed the three official browser cases into one semantic scenario that reuses the same Playwright page lifecycle."
      - "Preserved assertions for connected interior anchors, visible worker/avatar boxes, movement interpolation, path visible while moving, path hidden after arrival, available action state, desktop evidence screenshot, and 667x375 HUD/dock overlap checks."
      - "Kept desktop and phone landscape validation in the official spec while avoiding extra browser page/context creation."
    commands:
      repro_before_change:
        command: "npx playwright test tests/browser/interior-movement.spec.ts --workers=1"
        result: "failed as 3-test suite: first and third tests passed, second failed at browserContext.newPage because the target page/context/browser had closed"
      official_targeted_browser:
        command: "npx playwright test tests/browser/interior-movement.spec.ts --workers=1"
        result: "passed: 1 test"
      direct_playwright_evidence:
        command: "node tests/browser/interior-movement-evidence.mjs"
        result: "passed visible worker/avatar/anchor box checks, movement interpolation checks, path moving/arrived visibility checks, 667x375 overlap checks, and PNG variance checks"
      all_src_tests:
        command: "npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 54 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
```

### Phase 3: In-world Storage, Cooking, Tray, Serving, And Invalid Feedback

Status: completed
Started: 2026-06-01 06:03 +0000
Completed: 2026-06-01 06:11 +0000
Linked acceptance cases: ATD-3, ATD-4, ATD-5, ATD-6
requires_tdd: yes
requires_debugging_protocol: no

Goal: make interactions produce readable in-world effects for pickup, cooking, ready, collected, tray progress, service, and invalid attempts.

Likely files/modules touched:

- `src/app/store.ts`
- `src/features/interior/*`
- `src/features/orders/matcher.ts` if tray readiness needs helper output
- `src/widgets/ReferenceScene.tsx`
- `src/widgets/Hud.tsx`
- `src/styles.css`
- `src/app/store.test.ts`
- `tests/browser/interior-interactions.spec.ts`

Implementation direction:

- Add storage pickup interaction tied to burger ingredients, tray supplies, or next needed order step.
- Add prep/tray world state that reflects partial and complete order progress.
- Make station states visually distinct in-world: idle, cooking/progress, ready, collected event, invalid/warning event.
- Make serve success, wrong/early serve, and anomaly serve visibly different at the service window.
- Keep HUD tray and station panels as secondary confirmations.
- Avoid adding a full inventory economy; stay within the accepted service loop.

Test strategy:

- Add failing Vitest cases for:
  - storage interaction records pickup feedback and next useful action;
  - wrong/unavailable pickup records invalid feedback;
  - cooking ready/collect creates a collected event and prepared item;
  - tray partial/complete state can be derived for the active order;
  - wrong/early serve and correct serve create distinct interaction feedback.
- Add Playwright checks for:
  - visible storage pickup effect;
  - station cooking/ready/collected effect;
  - tray world state changes after collection;
  - invalid action feedback visible and not silent;
  - serving state visible at window.
- Run `npm run test`, `npm run typecheck`, `npm run build`, `npm run test:browser`.

#### Phase 3 TDD Strategy Gate

```yaml
tdd_strategy_gate:
  verdict: TDD_PHASE_READY
  checked_phase: "Phase 3: In-world Storage, Cooking, Tray, Serving, And Invalid Feedback"
  applicability: required
  acceptance_cases:
    - ATD-3
    - ATD-4
    - ATD-5
    - ATD-6
  baseline_observed:
    - "Phase 1/2 store and scene contracts are present: workerMovement, moveWorkerTo(zone), interactAtCurrentZone(), getInteriorVisualState(state), and connected interior browser tests."
    - "Current storage and prep interactions intentionally return Phase 1 warning feedback and do not yet model pickup or tray staging."
    - "Current station and serve behavior mutates the correct core gameplay state, but in-world Phase 3 feedback is mostly actionCue/HUD text rather than an explicit world interaction/effect contract."
    - "Focused baseline command passed before this gate update: npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts --maxWorkers=1."
  public_interfaces:
    - "useGameStore.getState().startShift()"
    - "useGameStore.getState().moveWorkerTo(zone)"
    - "useGameStore.getState().tick(delta)"
    - "useGameStore.getState().interactAtCurrentZone()"
    - "existing direct actions: startCooking(station), collectStation(station), serveCustomer(), clearPrepared(), selectDrink(drink), toggleBurgerIngredient(ingredient)"
    - "getInteriorVisualState(state) or a new pure Phase 3 visual-state helper derived from public store state"
    - "ReferenceScene rendered DOM contract after startShift"
  required_red_tests:
    - file: "src/app/store.test.ts"
      expectation: "fails until an arrived storage-zone interaction can create a pickup/supply feedback event for the current order's next needed step, leaves workerMovement at storage, advances action feedback sequence, and preserves customer/order/timer/station state except for the intended pickup/tray-supply state."
    - file: "src/app/store.test.ts"
      expectation: "fails until wrong, unavailable, duplicate, moving-worker, or not-useful storage/prep interactions create invalid/warning feedback without mutating protected state: currentOrder, currentCustomer, preparedItems, stations, score, mistakes, threat, customerTimer, shiftTimer, protectionHeld, holdProgress, shutterClosed."
    - file: "src/app/store.test.ts"
      expectation: "fails until station start, ready tick, and collect create distinct world-effect records or equivalent observable feedback for cooking, ready, and collected while preserving preparedItems and station reset rules."
    - file: "src/app/store.test.ts"
      expectation: "fails until tray progress can be derived as partial versus complete for the active order from preparedItems/currentOrder without duplicating order-matching authority."
    - file: "src/app/store.test.ts"
      expectation: "fails until service-window outcomes create distinct feedback for correct serve, wrong/early normal serve, and anomaly serve while keeping existing score/mistake/threat/encounter rules authoritative."
    - file: "src/shared/interiorVisualState.test.ts or new src/shared/interiorInteractionVisualState.test.ts"
      expectation: "fails until pure visual state exposes storage pickup feedback, station effect state, tray partial/complete/missing state, service-window feedback, and invalid feedback from store state without reading DOM or CSS."
    - file: "tests/browser/interior-interactions.spec.ts"
      expectation: "fails until browser-visible active gameplay shows storage pickup, station cooking/ready/collected effects, tray-world partial and complete states, service-window feedback, and invalid-action feedback as in-world elements, not HUD-only text."
  behaviors_to_pin:
    - "storage pickup/feedback is contextual to the active order or next useful service step and is visually distinct from cooking ready, collected, and served feedback"
    - "station in-world effects distinguish idle, cooking/progress, ready, collected, and invalid/warning attempts"
    - "collected station items remain the source of preparedItems; visual collected effects do not invent separate food inventory"
    - "tray world state is derived from currentOrder plus preparedItems and distinguishes empty, partial, complete, missing/wrong, and served/cleared transitions"
    - "service window feedback distinguishes correct normal serve, early/wrong normal serve, anomaly served, and no-customer/invalid attempts"
    - "invalid action feedback is visible and increments only transient feedback/effect state unless the existing core rule intentionally penalizes the player, such as wrong serve or serving an anomaly"
    - "browser evidence proves effects are present in the connected interior scene with stable semantic data attributes/test ids and visible non-zero layout boxes"
  first_red_test: "src/app/store.test.ts: arrived storage interaction records pickup feedback for the active order's next needed step instead of the current Phase 1 'Storage pickup is not available' warning."
  required_commands:
    red:
      - "npm run test -- src/app/store.test.ts"
      - "npm run test -- src/shared/interiorVisualState.test.ts"
      - "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1"
    green:
      - "npm run test -- src/app/store.test.ts"
      - "npm run test -- src/shared/interiorVisualState.test.ts"
      - "npm run test"
      - "npm run typecheck"
      - "npm run build"
      - "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1"
      - "npm run test:browser"
  evidence_expectations:
    - "RED output for each new/changed Phase 3 unit and browser test before production implementation."
    - "GREEN output for targeted store tests, targeted pure visual-state tests, all Vitest, typecheck, build, targeted browser spec, and full browser gate after implementation."
    - "If this low-PID runtime blocks official Playwright, provide the official failing launcher output plus a direct Playwright evidence script only as supplemental evidence; the official targeted browser spec still remains the preferred gate."
    - "Screenshots or video notes saved under .runtime/qa-artifacts/interior-movement-interactions/phase3/ for storage pickup, station cooking/ready/collected, tray partial, tray complete, service success/error, invalid action, desktop, phone landscape, and tablet landscape if available."
    - "Browser assertions must verify visible non-zero boxes and semantic attributes for interaction-effect, storage pickup, station effect, tray-world-state, service-window feedback, and invalid-action feedback."
  forbidden_test_coupling:
    - "Do not assert private helper names, exact animation durations, CSS class names, pixel-perfect coordinates, randomized prepared item ids, or exact generated customer identities."
    - "Do not make browser tests pass from HUD message text alone; Phase 3 evidence must be in the world/interior scene."
    - "Do not duplicate order matching in tests beyond concise fixtures; use currentOrder/preparedItems expectations and existing matcher semantics."
    - "Do not convert storage/tray into a full inventory economy or require free-roam/pathfinding behavior."
  status_note: "Phase 3 may proceed to developer TDD. The first developer step is to add these RED tests, capture failing output, then implement the minimal production behavior needed to turn them green."
```

Developer TDD evidence expectations:

- Attach `tdd_status.applied: yes` with RED snippets for the first failing storage pickup test, station effect test, tray progress test, service feedback test, invalid protected-state test, and browser-visible effects spec.
- Show GREEN output for targeted Phase 3 unit tests, all source tests, typecheck, build, targeted browser spec, and full browser gate.
- Include artifact paths from `.runtime/qa-artifacts/interior-movement-interactions/phase3/` and note whether they came from official Playwright or supplemental direct evidence.
- Explain the final Phase 3 public visual contract: store effect field(s), pure visual-state field(s), and ReferenceScene test ids/data attributes used by browser tests.

#### Phase 3 Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  agent_display:
    team_id: developer-team
    nickname: developer
    tag: developer
    color: green
    color_hex: "#16A34A"
    role: developer
    current_subtask: "Implemented Phase 3 in-world storage, station, tray, service, and invalid feedback."
    expected_output: "TDD red/green evidence, browser artifacts, and handoff for QA/reviewer."
    status: done
  tdd_status:
    applied: yes
    red_evidence:
      store:
        command: "npm run test -- src/app/store.test.ts"
        result: "failed before implementation: 5 failed / 35 store tests; missing interactionEffect for storagePickup, invalid moving interaction, stationCooking/stationReady/stationCollected, trayState partial/complete/wrong, and service feedback outcomes."
      visual_state:
        command: "npm run test -- src/shared/interiorVisualState.test.ts"
        result: "environment hit pthread_create / ERR_IPC_CHANNEL_CLOSED with default worker fanout; same RED was observed in the combined targeted run as missing pickup.effect from getInteriorVisualState()."
      browser:
        command: "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1"
        result: "failed before implementation: storage-pickup-effect element not found in the connected interior scene."
    green_evidence:
      targeted_store:
        command: "npm run test -- src/app/store.test.ts --maxWorkers=1"
        result: "passed: 6 files, 60 tests"
      targeted_visual_state:
        command: "npm run test -- src/shared/interiorVisualState.test.ts --maxWorkers=1"
        result: "passed: 6 files, 60 tests"
      all_src_tests:
        command: "npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 60 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      official_targeted_browser:
        command: "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1"
        result: "passed: 1 chromium test"
      direct_evidence_script:
        command: "not added"
        result: "not needed; official targeted Playwright spec passed and captured artifacts"
  implementation_notes:
    - "Store now exposes interactionEffect, storagePickup, and derived trayState for Phase 3 feedback while preserving preparedItems and matchOrder as the order authority."
    - "interactAtCurrentZone() now stages contextual storage pickup, records protected-state invalid feedback while moving/duplicating/no-customer, and keeps prep/tray as a derived visual state rather than a full inventory economy."
    - "Station start, tick-ready, and collect create distinct stationCooking, stationReady, and stationCollected world effects while collected items still enter preparedItems through existing station collection rules."
    - "Service outcomes now record serveSuccess, serveEarly, serveWrong, serveNoCustomer, and serveAnomaly feedback while preserving score/mistake/threat/customer progression rules."
    - "getInteriorVisualState() exposes effect, storage, stations, tray, and serviceWindow fields for scene rendering without DOM/CSS reads."
    - "ReferenceScene renders storage-pickup-effect, station-effect-<id>, tray-world-state, service-window-feedback, interaction-effect, and invalid-action-feedback as in-world nodes with semantic data attributes."
  visual_artifacts:
    source: "official Playwright targeted browser spec"
    storage_pickup: ".runtime/qa-artifacts/interior-movement-interactions/phase3/storage-pickup.png"
    invalid_action: ".runtime/qa-artifacts/interior-movement-interactions/phase3/invalid-action.png"
    station_cooking: ".runtime/qa-artifacts/interior-movement-interactions/phase3/station-cooking.png"
    station_ready: ".runtime/qa-artifacts/interior-movement-interactions/phase3/station-ready.png"
    station_collected: ".runtime/qa-artifacts/interior-movement-interactions/phase3/station-collected.png"
    tray_complete: ".runtime/qa-artifacts/interior-movement-interactions/phase3/tray-complete.png"
    service_success: ".runtime/qa-artifacts/interior-movement-interactions/phase3/service-success.png"
    phone_landscape: ".runtime/qa-artifacts/interior-movement-interactions/phase3/phone-landscape-interactions.png"
  scope_notes:
    - "No broad redesign, new dependency, full inventory economy, free-roam movement, or asset generation was introduced."
    - "Phase 1/2 movement and connected interior contracts were preserved; browser spec remains a one-scenario official targeted gate for low-PID stability."
  corrective_pass_after_review_blocked:
    applied_at: "2026-06-01T06:36:00Z"
    reason: "Addressed REVIEW_BLOCKED findings for stale storagePickup crossing encounter boundaries and insufficient phone-landscape in-world effect readability evidence."
    fixes:
      - "nextCustomer() and terminalEncounterCleanup() now clear storagePickup with the rest of prepared/order context, covering served replacement, timeout expiry, repel/replaced flow, victory/gameOver cleanup, and reset through initial state."
      - "Added store regressions proving staged storage pickup is cleared on serve-to-next-customer, timeout-to-next-customer, anomaly repel-to-next-customer, terminal cleanup, and reset, plus proof that a new storage pickup attaches to the new order id rather than the stale order."
      - "Strengthened tests/browser/interior-interactions.spec.ts with 667x375 non-overlap assertions for storage pickup, interaction effect, invalid feedback, station cooking/ready/collected, tray state, and service feedback against hud-topbar, action-dock, order-panel, and prep-panel."
      - "Adjusted compact landscape effect placement so invalid feedback and service-window feedback stay inside the readable scene band without changing the Phase 3 visual style."
    green_evidence:
      targeted_store:
        command: "npm run test -- src/app/store.test.ts --maxWorkers=1"
        result: "passed: 6 files, 64 tests"
      targeted_visual_state:
        command: "npm run test -- src/shared/interiorVisualState.test.ts --maxWorkers=1"
        result: "passed: 6 files, 64 tests"
      all_src_tests:
        command: "npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 64 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      official_targeted_browser:
        command: "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1"
        result: "passed: 1 chromium test with phone-landscape non-overlap assertions"
    added_visual_artifacts:
      phone_storage_pickup_readable: ".runtime/qa-artifacts/interior-movement-interactions/phase3/phone-landscape-storage-pickup-readable.png"
      phone_service_readable: ".runtime/qa-artifacts/interior-movement-interactions/phase3/phone-landscape-service-readable.png"
  corrective_pass_after_mobile_overlap_regression:
    applied_at: "2026-06-01T06:55:46Z"
    reason: "Addressed Phase 3 667x375 overlap against worker-avatar and Phase 2 standalone movement anchor regression."
    debugging_protocol:
      symptom: "At 667x375, storage pickup/generic/invalid effects could cover worker-avatar; standalone tests/browser/interior-movement.spec.ts failed because zone-storage overlapped hud-topbar by 484.5px area."
      expected: "Storage pickup, generic interaction effect, invalid feedback, movement anchors, worker, HUD, panels, and action dock have zero incoherent overlap in the supported phone-landscape scene."
      reproduction: "reliable"
      hypotheses_ruled_out:
        - "Browser spec threshold issue: rejected because measured boxes showed zone-storage y=57.625 while hud-topbar extended to y=64, producing a real 484.5px overlap."
        - "HUD-only assertion coverage sufficient: rejected because new worker-avatar overlap assertion failed before the fix with storage pickup overlap area 1008."
      root_cause: "Compact landscape side zone and effect placement used the same central band as the worker; the window side anchor's content box also extended into the top HUD band."
      fix_summary: "Kept the visual style, lowered the compact window anchor below the HUD, and shifted storage-related pickup/generic/invalid feedback into the free central scene corridor away from the storage worker."
      verification:
        - "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1 failed before CSS fix on phone storage pickup effect overlaps worker avatar, received overlap area 1008."
        - "npm run test:browser -- tests/browser/interior-movement.spec.ts --workers=1 failed before CSS fix on anchor 0 should not overlap the top HUD, received overlap area 484.5."
        - "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1 passed after fix."
        - "npm run test:browser -- tests/browser/interior-movement.spec.ts --workers=1 passed after fix."
      residual_risks: "none for the targeted 667x375 overlap regression; broader final responsive polish remains Phase 5 scope."
    fixes:
      - "Added browser assertions that measure storage pickup, generic interaction effect, and invalid feedback overlap against worker-avatar, not only HUD/panels."
      - "Moved compact landscape storage pickup and storage-scoped generic/invalid feedback to x=300+ within the free scene corridor, away from the storage worker at x=231.9-273.9."
      - "Lowered compact landscape window-zone-hit so standalone Phase 2 movement anchors do not overlap the top HUD."
    green_evidence:
      all_src_tests:
        command: "npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 64 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      phase3_browser:
        command: "npm run test:browser -- tests/browser/interior-interactions.spec.ts --workers=1"
        result: "passed: 1 chromium test; regenerated Phase 3 phone artifacts"
      phase2_browser_standalone:
        command: "npm run test:browser -- tests/browser/interior-movement.spec.ts --workers=1"
        result: "passed: 1 chromium test"
    regenerated_visual_artifacts:
      phone_storage_pickup_readable: ".runtime/qa-artifacts/interior-movement-interactions/phase3/phone-landscape-storage-pickup-readable.png"
      phone_service_readable: ".runtime/qa-artifacts/interior-movement-interactions/phase3/phone-landscape-service-readable.png"
      phone_interactions: ".runtime/qa-artifacts/interior-movement-interactions/phase3/phone-landscape-interactions.png"
```

Reviewer checks:

- Verify interaction feedback is not HUD-only.
- Verify station state and transient effects are not conflated in a way that breaks order matching.
- Verify invalid interactions do not mutate order/tray/station state incorrectly.
- Verify storage and tray additions do not introduce full inventory scope.

Risks:

- Too many effect types can make state hard to test.
- Tray visuals may disagree with `preparedItems` if derived state is duplicated.
- Existing quick action behavior can become inconsistent with movement-gated interaction.

Rollback:

- Revert in-world effect/tray visual additions while preserving Phase 1 movement state.
- Keep existing HUD station/tray controls as fallback for service loop continuity.

#### QA / Expert Coverage Matrix

| surface | trigger | required_agent_or_evidence | required_status | handoff_artifact | owner | status |
| --- | --- | --- | --- | --- | --- | --- |
| state/gameplay | Storage, station, tray, service interactions | tdd-expert strategy and evidence gates | pass | `tdd_status`, Vitest output | team-lead | pass |
| browser-visible UI | In-world effects and invalid feedback | visual-interface-qa or QA visual evidence | pass | screenshots/video notes for interaction states | feature-release-arbiter | pass |
| reliability | Tray/order matching and invalid attempts | qa-reliability-reviewer | pass | local QA/reviewer evidence accepted for standard closure | team-lead | waived |
| implementation | Store, order, scene, HUD integration | qa product gate and local reviewer | pass | QA report, review report | qa/team-lead | pass |

### Phase 4: Anomaly And Shutter Pressure Integrated With Movement

Status: completed
Started: 2026-06-01 07:13 +0000
Completed: 2026-06-01 07:23 +0000
Linked acceptance cases: ATD-7, ATD-6
requires_tdd: yes
requires_debugging_protocol: no

Goal: keep anomaly pressure, active visitor readability, and shutter defense active and understandable while the worker moves or cooks.

Likely files/modules touched:

- `src/app/store.ts`
- `src/shared/sceneVisualState.ts`
- `src/shared/interiorVisualState.ts`
- `src/widgets/ReferenceScene.tsx`
- `src/widgets/Hud.tsx`
- `src/styles.css`
- `src/app/store.test.ts`
- `src/shared/sceneVisualState.test.ts`
- `tests/browser/phase4-readability.spec.ts`
- `tests/browser/interior-anomaly.spec.ts`

Implementation direction:

- Preserve existing anomaly timing and threat behavior during worker movement.
- Show window/anomaly pressure in the interior even when worker is at storage/cooking zones.
- Make shutter defense a zone/action in the same interior layer, not a separate mode.
- Ensure shutter feedback is visually distinct from routine invalid/warning feedback.
- Preserve normal-vs-anomaly service rules and current customer readability.

Test strategy:

- Add failing Vitest cases:
  - anomaly threat increases while worker is moving/cooking;
  - shutter interaction can be initiated from movement flow or after moving to shutter zone;
  - successful/failed shutter creates distinct feedback and advances encounter as before;
  - serving anomaly still penalizes and can gameOver.
- Add Playwright checks:
  - active anomaly cue remains visible while worker is at storage/cooking;
  - Hold Shutter feedback is visible and distinct;
  - existing phase4 readability debug hook still works.
- Run `npm run test`, `npm run typecheck`, `npm run build`, `npm run test:browser`.

#### Phase 4 TDD Strategy Gate

```yaml
tdd_strategy_gate:
  verdict: TDD_PHASE_READY
  checked_phase: "Phase 4: Anomaly And Shutter Pressure Integrated With Movement"
  applicability: required
  acceptance_cases:
    - ATD-7
    - ATD-6
  current_baseline_observation:
    command: "npx vitest run src/app/store.test.ts src/shared/sceneVisualState.test.ts src/shared/interiorVisualState.test.ts --maxWorkers=1"
    result: "passed before Phase 4 RED additions: 3 files, 54 tests"
  public_interfaces:
    - "useGameStore.getState().tick(delta)"
    - "useGameStore.getState().moveWorkerTo(zone)"
    - "useGameStore.getState().interactAtCurrentZone()"
    - "useGameStore.getState().beginProtection() / endProtection()"
    - "useGameStore.getState().serveCustomer()"
    - "getInteriorVisualState(storeState)"
    - "getSceneVisualState(sceneInput)"
    - "window.__kfsPhase4SetActiveCustomer(kind)"
  red_tests:
    - file: "src/app/store.test.ts"
      expectation: "fails until anomaly customerTimer, shiftTimer, threat, worker movement progress, and station cooking progress all continue while the worker is moving, cooking, or carrying a visible storage/interior effect."
    - file: "src/app/store.test.ts"
      expectation: "fails until shutter defense can be reached through the interior flow from a non-window zone and records explicit shutter-defense feedback instead of generic invalid/warning feedback."
    - file: "src/app/store.test.ts"
      expectation: "fails until anomaly serve, successful shutter repel, false shutter alarm, and late anomaly timeout produce distinct observable effect kinds/tones/messages while preserving score, mistakes, threat, repelled count, gameOver, and encounter advancement rules."
    - file: "src/shared/interiorVisualState.test.ts"
      expectation: "fails until interior visual state exposes window/anomaly pressure and shutter-defense representation while the worker is at storage, moving, cooking, or interacting with storage/prep, without relying only on HUD text."
    - file: "src/shared/sceneVisualState.test.ts"
      expectation: "fails until scene visual state keeps active anomaly/customer cues, shutter charging, shutter closed, repel/departure, and late-reaction states visually distinct from ordinary customer and routine invalid/warning states."
    - file: "tests/browser/interior-anomaly.spec.ts"
      expectation: "fails until connected active interior shows active anomaly/window pressure while the worker is away from the window, while station/storage effects are visible, and exposes semantic attributes for anomaly kind, pressure visibility, defense availability, and current worker zone."
    - file: "tests/browser/interior-anomaly.spec.ts"
      expectation: "fails until browser-visible shutter interaction from the connected interior shows charging/repel feedback distinct from service success, serve-anomaly feedback distinct from late timeout, and no incoherent overlap on desktop and 667x375 phone landscape."
  behaviors_to_pin:
    - "anomaly/customer pressure remains visible and semantically testable while workerMovement.status is moving"
    - "anomaly/customer pressure remains visible while any station is cooking/ready and while storage pickup or tray/service effects are visible"
    - "window and shutter defense are represented as accessible interior zones/actions, not only HUD controls or a separate mode"
    - "successful shutter repel feedback is distinct from correct normal serve feedback"
    - "false shutter alarm feedback is distinct from routine invalid action feedback"
    - "late anomaly timeout feedback is distinct from directly serving an anomaly"
    - "serve-anomaly, repel, false-alarm, and late-timeout outcomes preserve existing score/mistake/threat/repelled/gameOver/encounter rules"
    - "shift timer, customer timer, anomaly threat, shutter hold progress, movement progress, and cooking progress continue during movement and visible interaction effects"
    - "browser evidence shows anomaly/window pressure inside the connected interior while worker is at storage/cooking and while defense remains reachable"
  required_commands:
    red:
      - "npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts src/shared/sceneVisualState.test.ts --maxWorkers=1"
      - "npm run test:browser -- tests/browser/interior-anomaly.spec.ts --workers=1"
    green:
      - "npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts src/shared/sceneVisualState.test.ts --maxWorkers=1"
      - "npm run test"
      - "npm run typecheck"
      - "npm run build"
      - "npm run test:browser -- tests/browser/interior-anomaly.spec.ts --workers=1"
      - "npm run test:browser -- tests/browser/phase4-readability.spec.ts --workers=1"
  evidence_expectations:
    - "Attach RED output for each new/changed Phase 4 unit and browser spec before production implementation."
    - "Attach GREEN output for targeted unit tests, all source tests, typecheck, build, interior-anomaly browser spec, and existing phase4-readability browser spec."
    - "Capture screenshots under .runtime/qa-artifacts/interior-movement-interactions/phase4/ for anomaly pressure while moving, anomaly pressure while cooking/storage effect is visible, shutter charging, shutter repel, false alarm or late timeout, serve anomaly, desktop, and 667x375 phone landscape."
    - "Browser assertions must verify visible non-zero boxes and semantic data attributes for anomaly/window pressure, shutter defense, active visitor, worker zone/status, interaction effect, and service/window feedback."
  forbidden_test_coupling:
    - "Do not assert CSS class names, exact animation timing constants, private helper names, or pixel-perfect coordinates."
    - "Do not accept HUD-only anomaly proof; Phase 4 requires browser-visible pressure in the connected interior scene."
    - "Do not collapse shutter repel into serveSuccess, false alarm into generic invalid, or late anomaly timeout into direct serveAnomaly feedback."
    - "Do not pause anomaly threat, customer timer, shift timer, cooking progress, or movement progress while storage/cooking/service effects are visible."
  status_note: "Phase 4 may proceed to developer TDD. The first developer step is to add these RED tests and capture failing output before implementing production changes."
```

Reviewer checks:

- Verify anomaly pressure cannot be hidden by movement/cooking effects.
- Verify shutter path/interaction remains reachable on mobile landscape.
- Verify no regression in existing anomaly cue samples and active visitor artifacts.

Risks:

- Moving the worker to shutter before defense may slow the survival loop too much.
- Additional visual effects can obscure subtle anomaly cues.

Rollback:

- Revert anomaly/interior integration to existing HUD + current customer layer while keeping movement/cooking phases.
- Preserve original shutter store behavior from pre-phase code.

#### QA / Expert Coverage Matrix

| surface | trigger | required_agent_or_evidence | required_status | handoff_artifact | owner | status |
| --- | --- | --- | --- | --- | --- | --- |
| state/gameplay | Anomaly threat and shutter behavior during movement | tdd-expert strategy and evidence gates | pass | `tdd_status`, Vitest output | team-lead | pass |
| browser-visible UI | Active anomaly readability plus interior effects | visual-interface-qa | pass | anomaly screenshots for normal/shadowEyes/longArms/staticSmile | feature-release-arbiter | pass |
| reliability | Survival loop regression risk | qa-reliability-reviewer | pass | local QA/reviewer evidence accepted for standard closure | team-lead | waived |
| implementation | Store, visual state, HUD, scene integration | qa product gate and local reviewer | pass | QA report, review report | qa/team-lead | pass |

#### Phase 4 Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  agent_display:
    team_id: developer-team
    nickname: developer
    tag: developer
    color: green
    color_hex: "#16A34A"
    role: developer
    current_subtask: "Implemented Phase 4 anomaly pressure during movement and cooking."
    expected_output: "TDD red/green evidence, browser artifacts, and handoff for QA/reviewer."
    status: done
  tdd_status:
    applied: yes
    red_evidence:
      targeted_unit:
        command: "npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts src/shared/sceneVisualState.test.ts --maxWorkers=1"
        result: "failed before implementation: 4 failed / 59 total; missing shutterCharging/shutterRepel effects, missing interior windowPressure/shutterDefense visual state, and missing scene windowPressure outcome state."
      browser:
        command: "npm run test:browser -- tests/browser/interior-anomaly.spec.ts --workers=1"
        result: "failed before implementation: anomaly-window-pressure element not found in the connected interior scene."
    green_evidence:
      targeted_unit:
        command: "npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts src/shared/sceneVisualState.test.ts --maxWorkers=1"
        result: "passed: 3 files, 59 tests"
      all_src_tests:
        command: "npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 69 tests"
      typecheck:
        command: "npm run typecheck"
        result: "passed"
      build:
        command: "npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      interior_anomaly_browser:
        command: "npm run test:browser -- tests/browser/interior-anomaly.spec.ts --workers=1"
        result: "passed: 1 chromium test"
      existing_phase4_readability:
        command: "npm run test:browser -- tests/browser/phase4-readability.spec.ts --workers=1"
        result: "partially blocked by environment: 4 passed / 7 total; the 3 failures were browserContext.newPage target-closed setup failures after Chromium closed, not assertion failures. Retry attempts hit EAGAIN/timeout under the low PID/thread cap."
  implementation_notes:
    - "Store interactionEffect now distinguishes shutterCharging, shutterRepel, shutterFalseAlarm, and anomalyTimeout from serveSuccess, invalid, and serveAnomaly."
    - "Anomaly threat, customer timer, shift timer, worker movement, station cooking, shutter hold, and visible effects continue during movement/cooking/storage pressure scenarios."
    - "getInteriorVisualState() now exposes windowPressure and shutterDefense for in-world rendering while the worker is moving, at storage, or cooking."
    - "getSceneVisualState() now exposes distinct windowPressure statuses for charging, repelled, false alarm, late timeout, direct anomaly serve, and ordinary/anomaly pressure."
    - "ReferenceScene renders anomaly-window-pressure and shutter-defense-world as connected interior elements with semantic data attributes; shutter defense can be reached and activated from the world layer."
    - "Phase 4 debug hook accepts optional customerTimer/threat overrides so late-timeout browser evidence is deterministic without waiting through a full encounter."
  visual_artifacts:
    source: "official Playwright targeted interior-anomaly browser spec"
    anomaly_pressure_moving: ".runtime/qa-artifacts/interior-movement-interactions/phase4/anomaly-pressure-moving.png"
    anomaly_pressure_storage_effect: ".runtime/qa-artifacts/interior-movement-interactions/phase4/anomaly-pressure-storage-effect.png"
    anomaly_pressure_cooking: ".runtime/qa-artifacts/interior-movement-interactions/phase4/anomaly-pressure-cooking.png"
    shutter_charging: ".runtime/qa-artifacts/interior-movement-interactions/phase4/shutter-charging.png"
    shutter_repel: ".runtime/qa-artifacts/interior-movement-interactions/phase4/shutter-repel.png"
    serve_anomaly: ".runtime/qa-artifacts/interior-movement-interactions/phase4/serve-anomaly.png"
    false_alarm: ".runtime/qa-artifacts/interior-movement-interactions/phase4/false-alarm.png"
    late_anomaly_timeout: ".runtime/qa-artifacts/interior-movement-interactions/phase4/late-anomaly-timeout.png"
    phone_landscape_anomaly_pressure: ".runtime/qa-artifacts/interior-movement-interactions/phase4/phone-landscape-anomaly-pressure.png"
  scope_notes:
    - "No broad redesign, new dependency, new route, free-roam movement, or detached anomaly mode was introduced."
    - "Phase 1-3 source tests are included in the 69-test all-src pass; Phase 2/3 browser specs were not rerun in this phase except through preserved source contracts."
```

#### Phase 4 Corrective Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  agent_display:
    team_id: developer-team
    nickname: developer
    tag: developer
    color: green
    color_hex: "#16A34A"
    role: developer
    current_subtask: "Corrective pass after REVIEW_BLOCKED/TDD/QA blocked for Phase 4 anomaly and shutter outcomes."
    expected_output: "Bug fixes, RED/GREEN evidence, browser artifacts, and blocker notes."
    status: done
  corrective_scope:
    - "Preserved anomalyTimeout, shutterFalseAlarm, and shutterRepel interactionEffect kinds when the same tick reaches gameOver thresholds."
    - "Attached departed/outcome customer snapshots to Phase 4 outcome effects so in-world pressure and active visitor presentation do not read from the newly generated currentCustomer."
    - "Kept the interior-anomaly storage-to-fryer sequence semantically strong; the targeted spec still waits for worker data-current-zone=fryer before starting fryer cooking."
  tdd_status:
    applied: yes
    red_evidence:
      targeted_unit:
        command: "GOMAXPROCS=2 npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts src/shared/sceneVisualState.test.ts --maxWorkers=1"
        result: "failed before fix: 3 failures; terminal anomalyTimeout was overwritten by invalid, outcomeCustomer was missing on shutterRepel/anomalyTimeout, and outcome pressure used the newly generated customer anomalyKind."
    green_evidence:
      targeted_unit:
        command: "GOMAXPROCS=2 npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts src/shared/sceneVisualState.test.ts --maxWorkers=1"
        result: "passed: 3 files, 62 tests"
      all_src_tests:
        command: "GOMAXPROCS=2 npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 72 tests"
      typecheck:
        command: "GOMAXPROCS=2 npm run typecheck"
        result: "passed"
      build:
        command: "GOMAXPROCS=2 npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      interior_anomaly_browser:
        command: "GOMAXPROCS=2 npm run test:browser -- tests/browser/interior-anomaly.spec.ts --workers=1"
        result: "passed: 1 chromium test"
      phase4_readability_subset:
        command: "GOMAXPROCS=2 npm run test:browser -- tests/browser/phase4-readability.spec.ts --workers=1 --grep \"active current customer exposes readable (normal|staticSmile) state\""
        result: "partial environment blocker: normal case passed; staticSmile failed at browserContext.newPage target-closed setup before assertions."
      phase4_readability_static_retry:
        command: "GOMAXPROCS=2 npm run test:browser -- tests/browser/phase4-readability.spec.ts --workers=1 --grep \"active current customer exposes readable staticSmile state\""
        result: "passed: 1 chromium test"
  debugging_protocol:
    symptom: "Phase 4 outcome effects and visuals could collapse to generic invalid or show the next generated customer after repelled/expired outcomes."
    expected: "Terminal threshold outcomes keep their distinct Phase 4 effect kind and visuals refer to the departed/repelled/expired customer context."
    reproduction: reliable
    hypotheses_ruled_out:
      - "HUD-only mismatch: rejected because failing assertions were on store interactionEffect and in-world interiorVisualState.windowPressure."
      - "Browser-only sequencing issue: rejected for the core bugs because targeted Vitest reproduced the invalid overwrite and wrong anomalyKind without Playwright."
    root_cause: "tick() replaced every gameOver outcome effect with a generic invalid effect after clampEndState(), and visual pressure derived anomalyKind/presentation only from currentCustomer after nextCustomer() advanced the encounter."
    fix_summary: "Added outcomeCustomer snapshots to Phase 4 outcome effects, preserved those effect kinds through terminal cleanup, and mapped interior/reference visuals from the snapshot while the outcome effect is visible."
    verification:
      - "GOMAXPROCS=2 npx vitest run src/app/store.test.ts src/shared/interiorVisualState.test.ts src/shared/sceneVisualState.test.ts --maxWorkers=1: passed"
      - "GOMAXPROCS=2 npm run test:browser -- tests/browser/interior-anomaly.spec.ts --workers=1: passed"
    residual_risks: "Full phase4-readability suite remains sensitive to target-closed browser setup failures in this low-PID runtime; individual retried case passed."
```

### Phase 5: Responsive Polish, Visual Completeness, And Release Gate

Status: completed
Started: 2026-06-01 07:55 +0000
Completed: 2026-06-01 09:12 +0000
Linked acceptance cases: ATD-8, ATD-9, ATD-1, ATD-2, ATD-5
requires_tdd: yes
requires_debugging_protocol: no

Goal: close desktop, phone landscape, and tablet landscape playability; complete visual polish; prepare final important-mode evidence.

Likely files/modules touched:

- `src/styles.css`
- `src/widgets/ReferenceScene.tsx`
- `src/widgets/Hud.tsx`
- `tests/browser/phase3-hud.spec.ts`
- `tests/browser/street-scene.spec.ts`
- `tests/browser/interior-movement.spec.ts`
- `tests/browser/interior-interactions.spec.ts`
- `.runtime/qa-artifacts/interior-movement-interactions/*` for generated QA evidence only
- `README.md` or docs only if team-lead opens a docs/knowledge sync phase

Implementation direction:

- Tune layout for desktop, 667x375 phone landscape, 568x320 very small landscape, and 1024x768 tablet landscape.
- Ensure no incoherent overlap between worker, movement path, interaction labels, action dock, order panel, prep/tray, visitor/anomaly cues, and topbar.
- Verify touch targets remain at least 44px for critical controls.
- Capture final visual evidence for normal order, cooking ready, tray complete, invalid action, anomaly pressure, shutter success/failure, phone landscape, tablet landscape.
- Update README/docs only if team-lead assigns docs work after implementation drift is known.

Test strategy:

- Add/extend Playwright checks:
  - no page scroll in supported landscape layouts;
  - key controls within viewport and large enough;
  - worker/interior/tray/anomaly elements have non-overlapping bounding boxes with critical HUD/action dock;
  - screenshot/pixel checks for nonblank, reference-backed active interior.
- Run full local gate:
  - `npm run test`
  - `npm run typecheck`
  - `npm run build`
  - `npm run test:browser`
- QA must provide visual artifacts and note any WebGL/browser screenshot warnings separately from verdict.

Reviewer checks:

- Verify the feature still reads as one continuous night-shift loop.
- Verify visual polish matches KFS references and does not drift to a clean/generic kitchen.
- Verify mobile/tablet landscape criteria are covered by tests and screenshots.
- Verify no stale README claims remain if docs phase is included.

Risks:

- Responsive fixes can regress desktop or existing Phase 3 HUD checks.
- Visual effects can pass tests but still be too subtle; feature experts must review actual screenshots.
- Browser artifacts in `.runtime` may already be dirty from unrelated work; QA should write to a task-specific artifact folder.

Rollback:

- Revert polish CSS/scene changes to Phase 4 state if layout regressions are severe.
- Keep state-level phases if functional tests remain green and only visual polish is problematic.

#### QA / Expert Coverage Matrix

| surface | trigger | required_agent_or_evidence | required_status | handoff_artifact | owner | status |
| --- | --- | --- | --- | --- | --- | --- |
| browser-visible UI | Final desktop/phone/tablet interior playability | qa visual evidence and visual-interface-qa | pass | screenshots and QA report | qa/feature-release-arbiter | pass |
| responsive React UI | Control/label overlap and movement readability | react-interface-responsiveness-architect | pass | browser release matrix plus local reviewer evidence accepted for standard closure | team-lead | waived |
| render/performance | Final asset/effect load and animation density | frontend-render-performance-reviewer or approved evidence | pass | performance evidence | feature-release-arbiter | pass |
| important release gate | Important-mode feature readiness | feature-release-arbiter coordinating @feature-experts | approve | external Expert Team not run because 2026-06-01 closure request specified Developer Team standard mode | team-lead | waived |
| regression gate | Full local test/build/browser suite | qa product gate and local reviewer | pass | `npm run test`, `typecheck`, `build`, `test:browser`; review report | qa/team-lead | pass |
| docs/knowledge | README/code drift or new usage docs after implementation | docs update or not-applicable reason | pass or not-applicable | docs sync evidence or explicit N/A | team-lead | pass |

#### Phase 5 Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  agent_display: "developer-team"
  current_subtask: "Implemented Phase 5 responsive polish, visual completeness, release matrix tests, artifacts, and README drift sync."
  tdd_status:
    applied: yes
    red_evidence:
      TDD_RED_EVIDENCE_LIMITATION:
        status: "no concrete behavioral RED runner excerpt found"
        searched_locations:
          - "docs/plans/interior-movement-interactions.md"
          - "test-results/.last-run.json"
          - ".runtime/qa-artifacts/**"
          - "node_modules/.vite/vitest/**/results.json"
          - "workspace-local *.log/*.json/*.txt artifacts outside node_modules"
        result: "Only the summarized Phase 5 RED statement below was present. No preserved Playwright runner excerpt, failure screenshot metadata, or test-first timestamp artifact was found for the behavioral Phase 5 RED."
        protocol_note: "A concrete RED cannot be reconstructed without rerunning against a pre-polish condition or rewriting history, which is outside this corrective evidence pass. GREEN evidence is preserved for TDD expert review; the expert must accept with this limitation or make the final protocol call."
      collection_caveat:
        command: "GOMAXPROCS=2 npm run test:browser -- tests/browser/phase5-release.spec.ts --workers=1"
        result: "No tests found because Playwright testDir is already tests/browser; reran with the spec basename."
      summarized_red_only:
        command: "GOMAXPROCS=2 npm run test:browser -- phase5-release.spec.ts --workers=1"
        result: "Existing plan summary says this failed because desktop-1280x720 storage pickup overlapped the action dock, and later strengthened overlap checks exposed additional worker/effect/tray/anomaly/shutter compact-layout collisions before CSS polish. This is not backed by a preserved runner excerpt in the current workspace."
    green_evidence:
      phase5_release_matrix:
        command: "GOMAXPROCS=2 npm run test:browser -- phase5-release.spec.ts --workers=1"
        result: "passed: 1 browser test; validated 1280x720, 667x375, 568x320, and 1024x768 in one page lifecycle with no document/body scroll, critical controls in viewport and >=44px, non-overlap matrix, KFS continuity, and nonblank pixel-variance screenshots."
      existing_targeted_browser_specs:
        - command: "GOMAXPROCS=2 npm run test:browser -- interior-movement.spec.ts --workers=1"
          result: "passed: 1 test"
        - command: "GOMAXPROCS=2 npm run test:browser -- interior-interactions.spec.ts --workers=1"
          result: "passed: 1 test"
        - command: "GOMAXPROCS=2 npm run test:browser -- interior-anomaly.spec.ts --workers=1"
          result: "passed: 1 test"
        - command: "GOMAXPROCS=2 npm run test:browser -- phase3-hud.spec.ts --workers=1"
          result: "multi-case run hit target-closed lifecycle failures; failed cases passed when retried individually with --grep for phone landscape HUD, very small landscape, and active service view."
        - command: "GOMAXPROCS=2 npm run test:browser -- street-scene.spec.ts --workers=1"
          result: "multi-case run hit target-closed lifecycle failures; failed cases passed when retried individually with --grep for reference-backed frame, pre-shift ambience, and start shift exposes."
        - command: "GOMAXPROCS=2 npm run test:browser -- phase4-readability.spec.ts --workers=1"
          result: "multi-case run hit target-closed lifecycle failures; failed cases passed when retried individually with --grep for phone landscape keeps, readable normal state, and readable longArms state."
      unit_suite:
        command: "GOMAXPROCS=2 npm run test -- --maxWorkers=1"
        result: "passed: 6 files, 72 tests"
      typecheck:
        command: "GOMAXPROCS=2 npm run typecheck"
        result: "passed"
      build:
        command: "GOMAXPROCS=2 npm run build"
        result: "passed; Vite emitted the existing >500 kB chunk-size warning"
      full_browser_attempt:
        command: "GOMAXPROCS=2 npm run test:browser -- --workers=1"
        result: "attempted; failed 12/25 with browserContext.newPage target-closed lifecycle errors after 13 passes, matching the known low-PID/WebGL browser lifecycle caveat rather than assertion failures."
  implementation_notes:
    - "Added tests/browser/phase5-release.spec.ts as the final release viewport matrix with one page lifecycle per scenario, screenshot artifact capture, pixel variance checks, no-scroll assertions, touch target checks, non-overlap pairs, and KFS visual continuity assertions."
    - "Tuned responsive CSS for compact and very small landscape layouts: side anchors, storage pickup/effect badges, tray state, service/window/anomaly/shutter stack, panel/dock spacing, and feedback placement."
    - "Kept gameplay scope unchanged; changes are layout, visual feedback positioning, browser release coverage, and README documentation drift sync."
    - "README now describes the current Vite/React/Zustand/R3F/reference-backed interior movement runtime instead of the stale canvas-only app."
  visual_artifacts:
    - ".runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-desktop-1280x720.png"
    - ".runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-phone-667x375.png"
    - ".runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-small-landscape-568x320.png"
    - ".runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-tablet-1024x768.png"
  residual_risks:
    - "Full browser suite remains unstable in this constrained runtime because repeated Chromium page/context lifecycles can close unexpectedly; targeted release matrix and individually retried affected cases passed."
    - "Vite chunk-size warning remains non-blocking and pre-existing for release-gate purposes."
```

#### Corrective Performance Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  agent_display:
    team_id: developer-team
    nickname: developer
    tag: developer
    color: green
    color_hex: "#16A34A"
    role: developer
    current_subtask: "Corrective performance pass after final performance expert blocked."
    expected_output: "Code-split Three/Fiber path, avoid inactive canvas work, add image/motion gates, and verify release specs."
    status: done
  applied_at: "2026-06-01T09:04:43Z"
  changed_files:
    - "src/pages/GamePage.tsx"
    - "src/widgets/GameScene.tsx"
    - "src/widgets/Hud.tsx"
    - "src/widgets/ReferenceScene.tsx"
    - "src/shared/usePrefersReducedMotion.ts"
    - "src/styles.css"
    - "tests/browser/street-scene.spec.ts"
    - "tests/browser/phase3-hud.spec.ts"
    - "docs/plans/interior-movement-interactions.md"
  performance_fixes:
    - "GameScene is now loaded through React.lazy/Suspense, moving @react-three/fiber and three out of the initial React application chunk."
    - "GameScene/Canvas mounts only while phase === playing; menu, paused, victory, and gameOver keep the DOM/reference scene but do not keep the WebGL canvas or R3F frame loop active."
    - "The menu does not need canvas effects because ReferenceScene and PreShiftStreetStatus already provide the pre-shift street visuals through DOM/CSS; gameplay canvas is preserved for active hit planes and active tick loop."
    - "Non-critical dossier/worker/backroom images now use loading='lazy', decoding='async', and low fetch priority; the first-viewport exterior keeps high fetch priority, while the initially hidden service layer is low priority."
    - "Decorative continuous CSS animations are gated under prefers-reduced-motion; GameScene skips the R3F rain/steam decorative loop and HUD street pulse intervals stop for reduced-motion users."
  build_chunk_stats:
    before:
      command: "GOMAXPROCS=2 npm run build"
      result: "passed; 68 modules; dist/assets/index-BZrXYRj9.js 1,040.73 kB / gzip 285.11 kB; css 50.46 kB / gzip 11.16 kB; emitted >500 kB warning."
    after:
      command: "GOMAXPROCS=2 npm run build"
      result: "passed; 70 modules; dist/assets/index-DOcRzlny.js 216.66 kB / gzip 65.06 kB; lazy dist/assets/GameScene-CVpOp6-C.js 822.85 kB / gzip 220.08 kB; css 50.82 kB / gzip 11.29 kB; emitted >500 kB warning for lazy GameScene chunk."
    delta:
      initial_js: "-824.07 kB minified / -220.05 kB gzip"
      note: "The warning remains because the deferred Three/Fiber chunk is still larger than 500 kB; it is no longer in the initial React chunk."
  verification:
    unit_suite:
      command: "GOMAXPROCS=2 npm run test -- --maxWorkers=1"
      result: "passed: 6 files, 72 tests"
    typecheck:
      command: "GOMAXPROCS=2 npm run typecheck"
      result: "passed"
    build:
      command: "GOMAXPROCS=2 npm run build"
      result: "passed with deferred GameScene chunk and remaining lazy-chunk size warning"
    phase5_release:
      command: "GOMAXPROCS=2 npm run test:browser -- phase5-release.spec.ts --workers=1"
      result: "passed: 1 chromium test"
    movement:
      command: "GOMAXPROCS=2 npm run test:browser -- interior-movement.spec.ts --workers=1"
      result: "passed: 1 chromium test"
    interactions:
      command: "GOMAXPROCS=2 npm run test:browser -- interior-interactions.spec.ts --workers=1"
      result: "passed: 1 chromium test"
    anomaly:
      command: "GOMAXPROCS=2 npm run test:browser -- interior-anomaly.spec.ts --workers=1"
      result: "passed: 1 chromium test"
    canvas_pause_gate:
      command: "GOMAXPROCS=2 npm run test:browser -- phase3-hud.spec.ts --workers=1 --grep \"pause, resume, and reset\""
      result: "passed: 1 chromium test; verifies canvas mounted during play and unmounted on pause/reset."
    street_canvas_gate:
      command: "GOMAXPROCS=2 npm run test:browser -- street-scene.spec.ts --workers=1 --grep \"first load exposes|start shift exposes\""
      result: "environment partial: first case passed and second case failed at browserContext.newPage target-closed setup after first case; retrying start-shift alone passed."
    street_canvas_retry:
      command: "GOMAXPROCS=2 npm run test:browser -- street-scene.spec.ts --workers=1 --grep \"start shift exposes\""
      result: "passed: 1 chromium test"
  remaining_performance_risks:
    - "The lazy GameScene chunk is still 822.85 kB minified because Three/Fiber remain large dependencies; deeper vendor/manual chunking or replacing the canvas hit layer would be a separate design decision."
    - "Reference PNG assets are large, about 17 MB total on disk. This pass adds loading/fetch hints for non-critical images but does not compress or replace artwork."
    - "Official multi-case browser specs can still hit Chromium target-closed lifecycle failures in this low-PID runtime; targeted specs and retries passed."
```

#### Corrective Full Browser Stability Developer Evidence Handoff

```yaml
developer_evidence_handoff:
  role: developer
  agent_display:
    team_id: developer-team
    nickname: developer
    tag: developer
    color: green
    color_hex: "#16A34A"
    role: developer
    current_subtask: "Corrective pass for final full Playwright browser-suite stability after QA/reviewer blocked."
    expected_output: "Stable full npm run test:browser result without weakening product assertions, plus core gate evidence."
    status: done
  applied_at: "2026-06-01T10:12:43Z"
  debugging_protocol:
    symptom: "Full GOMAXPROCS=2 npm run test:browser previously failed after targeted specs passed, with browserContext.newPage/browser.newContext target-closed setup failures and WebGL ReadPixels stall logs."
    expected: "Full browser gate exits green while preserving Phase 5, movement, interaction, anomaly, HUD, readability, and street-scene product assertions."
    reproduction: "QA-debugger found the browser suite passes one file at a time, and a temporary config with one Playwright project per spec file, workers=1, --single-process --no-zygote, and retries=0 passed 7/7."
    hypotheses_ruled_out:
      - "Product assertion regression: rejected because failing attempts ended at browserContext.newPage/browser.newContext before the app assertions ran, and retries executed the same assertions successfully."
      - "Additional Chromium GL flags are safer: rejected because --use-gl=swiftshader caused headless-shell GL implementation SIGTRAP failures, and --use-angle=swiftshader slowed runtime-driven movement enough to create real assertion timeouts."
    root_cause: "Same single-process Chromium was reused across WebGL screenshot-heavy spec files and could close after canvas ReadPixels pressure. Clean browser lifecycle per spec file avoids the target-closed setup failures."
    fix_summary: "Changed playwright.config.ts to create one Chromium Playwright project per browser spec file via testMatch while preserving workers=1 and --single-process --no-zygote. Removed retry masking by setting retries: 0."
    residual_risks: "No retry-recovered browser flakies remained in the verified full suite. The normal Vitest command can still hit this container's worker IPC/PID limit unless run with --maxWorkers=1."
  changed_files:
    - "playwright.config.ts"
    - "docs/plans/interior-movement-interactions.md"
  implementation_notes:
    - "playwright.config.ts now enumerates the seven browser spec files and maps each file to a separate Chromium project name, e.g. chromium-interior-anomaly and chromium-street-scene."
    - "workers remains 1, Chromium launch args remain --single-process and --no-zygote, trace remains retain-on-failure, and retries is explicitly 0."
    - "No product specs were skipped, weakened, or edited in this pass; the already-collapsed one-scenario browser specs remain intact."
  verification:
    full_browser_before:
      command: "GOMAXPROCS=2 npm run test:browser"
      result: "failed before fix: 13 passed / 12 failed; failures were target-closed setup failures after WebGL ReadPixels stall logs."
    full_browser_final:
      command: "GOMAXPROCS=2 npm run test:browser"
      result: "passed by exit code: 7 passed across 7 per-file Chromium projects, retries=0, no flaky/retry recovery reported."
    unit_suite_default_attempt:
      command: "GOMAXPROCS=2 npm run test"
      result: "environment failure: Vitest tinypool worker IPC closed with ERR_IPC_CHANNEL_CLOSED before test results."
    unit_suite_green:
      command: "GOMAXPROCS=2 npm run test -- --maxWorkers=1"
      result: "passed: 6 files, 72 tests"
    typecheck:
      command: "GOMAXPROCS=2 npm run typecheck"
      result: "passed"
    build:
      command: "GOMAXPROCS=2 npm run build"
      result: "passed; Vite emitted the existing deferred GameScene chunk-size warning."
```

### Standard Closure Handoff

```yaml
phase_plan:
  persisted_path: docs/plans/interior-movement-interactions.md
  owner: architect
  status: completed
  phases:
    phase_1: completed
    phase_2: completed
    phase_3: completed
    phase_4: completed
    phase_5: completed
  runtime_projection: not-supported
  runtime_event_type: none
  last_synced_at: 2026-06-01T11:08:00Z
  runtime_projection_reason: "This Codex runtime does not expose an app_server_turn_plan_updated or equivalent persistent runtime plan event tool; the persisted plan file is the source of truth."

integration_closure:
  role: team-lead
  mode: standard
  status: completed
  applied_to_main_workspace: /workspace/KFC-game
  source_worktree: /workspace/KFC-game/.worktrees/interior-movement-interactions
  integration_note: "Feature implementation, tests, reference assets, docs plan, and task-specific QA artifacts were synced into the main workspace without deleting existing untracked files or reverting unrelated dirty runtime artifacts."
  extra_fix_after_integration:
    - "Added vitest.config.ts so `npm run test -- --maxWorkers=1` excludes nested `.worktrees/**` tests and measures only the main workspace."
    - "Fixed final Phase 5 release-matrix layout regressions found after integration: tablet anomaly/worker overlap and very-small-landscape worker/panel plus badge/panel overlap."

tdd_expert_closure:
  acceptance_design_gate: TDD_ACCEPTANCE_TESTS_READY
  phase_strategy_gates: pass
  phase_evidence_gates:
    phase_1: TDD_EVIDENCE_APPROVED
    phase_2: TDD_EVIDENCE_APPROVED
    phase_3: TDD_EVIDENCE_APPROVED
    phase_4: TDD_EVIDENCE_APPROVED
    phase_5: TDD_EVIDENCE_APPROVED_WITH_ACCEPTED_LIMITATION
  phase_5_red_limitation:
    status: accepted_limitation
    accepted_by: team-lead
    reason: "The preserved workspace does not contain a concrete pre-fix Phase 5 RED runner excerpt. Reconstructing it would require rerunning against a pre-polish state or rewriting history. Current closure adds no new feature behavior beyond integration/responsive fixes and is covered by green release-matrix/browser evidence."
    compensating_evidence:
      - "GOMAXPROCS=2 npm run test -- --maxWorkers=1: passed, 6 files / 72 tests."
      - "GOMAXPROCS=2 npm run test:browser -- phase5-release.spec.ts --workers=1: failed before closure CSS fix on tablet/small-landscape overlap, then passed after fix."
      - "GOMAXPROCS=2 npm run test:browser: passed, 7 browser specs."
    residual_risk: "Historical Phase 5 strict TDD ordering cannot be independently proven from preserved artifacts."

qa_closure:
  verdict: pass
  commands:
    unit:
      command: "GOMAXPROCS=2 npm run test -- --maxWorkers=1"
      result: "passed: 6 files, 72 tests"
    typecheck:
      command: "GOMAXPROCS=2 npm run typecheck"
      result: "passed"
    build:
      command: "GOMAXPROCS=2 npm run build"
      result: "passed: 70 modules; initial JS 216.66 kB / gzip 65.06 kB; lazy GameScene chunk 822.85 kB / gzip 220.08 kB; Vite emitted the known >500 kB lazy chunk warning"
    browser:
      command: "GOMAXPROCS=2 npm run test:browser"
      result: "passed: 7 specs across per-file Chromium projects"
  visual_evidence:
    status: pass
    artifact_dir: "/workspace/KFC-game/.runtime/qa-artifacts/interior-movement-interactions"
    final_artifacts:
      - "/workspace/KFC-game/.runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-desktop-1280x720.png"
      - "/workspace/KFC-game/.runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-phone-667x375.png"
      - "/workspace/KFC-game/.runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-small-landscape-568x320.png"
      - "/workspace/KFC-game/.runtime/qa-artifacts/interior-movement-interactions/phase5/release-matrix-tablet-1024x768.png"
    console_network_findings: "No release-blocking console/network findings from the Playwright gate."
    accessibility_findings: "Critical controls remained in viewport and at least 44px in the release matrix."
    visual_findings: "No remaining incoherent overlap in the final browser gate."
  render_performance_evidence:
    status: pass
    tools:
      - "Vite production build chunk stats"
      - "Playwright release matrix runtime smoke"
    findings: "Initial bundle was code-split; Three/Fiber remains in a deferred GameScene chunk that still triggers Vite's size warning."
    residual_risks:
      - "Lazy GameScene chunk remains 822.85 kB minified because Three/Fiber are large dependencies."
      - "Reference PNG assets remain large and were not compressed in this scope."

reviewer_closure:
  verdict: pass
  notes:
    - "No detached mini-game route was introduced; movement/interactions remain inside the current night-shift loop."
    - "The final browser gate covers interior movement, storage/cooking/tray/service feedback, anomaly/shutter pressure, HUD readability, and street/reference continuity."
    - "Nested `.worktrees/**` test contamination is now excluded from Vitest gate evidence."

docs_closure:
  verdict: pass
  updated_artifacts:
    - "README.md"
    - "docs/plans/interior-movement-interactions.md"
  knowledge_sync:
    status: not-applicable
    reason: "This checkout has no docs/context index and no scripts/knowledge.sh gate; the docs role updated README and this plan artifact only."

qa_expert_coverage_matrix_summary:
  status: closed
  required_rows:
    pass:
      - "TDD strategy/evidence gates for state, movement, visual mapping, interactions, anomaly/shutter, and regression coverage."
      - "QA product gate: unit, typecheck, build, full browser suite."
      - "Visual evidence: Phase 2-5 artifacts under /workspace/KFC-game/.runtime/qa-artifacts/interior-movement-interactions."
      - "Render/performance evidence: code-split build stats and browser matrix."
      - "Local reviewer: architecture, gameplay loop continuity, responsive overlap, and test isolation."
      - "Docs: README drift and plan closure updated."
    waived:
      - "External feature-release-arbiter / @feature-experts review: waived for this 2026-06-01 Developer Team standard closure pass requested by the user."
      - "Dedicated qa-reliability-reviewer and react-interface-responsiveness-architect subagent verdicts: waived in favor of local QA/reviewer evidence because this run was explicitly a single-agent Developer Team standard closure."
      - "Historical concrete Phase 5 RED runner excerpt: accepted limitation; current GREEN and closure-regression evidence is preserved."
  blocked_rows: []
  pending_rows: []

expert_team_review:
  status: waived_for_standard_closure
  reason: "The original task card remains historically marked important, but the 2026-06-01 user request explicitly asked for a Developer Team standard integration/closure pass with roles in one agent. No external feature-release-arbiter run was available in this closure scope."

final_team_lead_verdict:
  status: ready_for_user_review_in_main_workspace
  ready_branch: not-created
  reason_ready_branch_not_created: "User asked to integrate/close in the main workspace, not to push a ready/<slug> branch."
```
