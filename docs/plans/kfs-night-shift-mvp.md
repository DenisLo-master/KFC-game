---
slug: kfs-night-shift-mvp
title: KFS Night Shift MVP
type: plan
task_mode: important
mode_reason: значимое пользовательское поведение, новый browser game runtime, mobile landscape UX, высокий риск несоответствия prompt
curator: team-lead
status: completed
created: 2026-05-31
updated: 2026-05-31
tags:
  - kfs-night-shift
  - browser-game
  - horror-service-game
  - mobile-landscape
  - mvp
---

# KFS Night Shift MVP

## ТЗ от scribe

### Бизнес-флоу

KFS Night Shift становится единственным запускаемым продуктом для пользователя: при входе в игру пользователь попадает в меню ночной смены, запускает смену и играет законченный MVP-loop в формате mobile-landscape-first horror service game.

Основной сценарий:

1. Пользователь открывает игру и видит понятный стартовый экран с названием, mood ночной смены и действием старта.
2. Если устройство находится в портретной ориентации, пользователь получает явный rotate gate: игра просит повернуть устройство в landscape до начала полноценного gameplay.
3. После старта начинается 90-секундная смена в ночном fast-food kiosk KFS.
4. В течение смены игрок обслуживает входящих клиентов, читает заказ, готовит позиции из ограниченного MVP-набора блюд и решает, можно ли обслуживать посетителя.
5. Первый обычный клиент должен дать игроку безопасный вход в loop: принять заказ, собрать блюдо, нажать Serve и получить понятный результат.
6. При правильной подаче обычному клиенту растет score, состояние смены остается контролируемым.
7. При неправильной подаче обычному клиенту фиксируется mistake, игрок получает понятную обратную связь и продолжает смену, пока не наступило gameOver-условие.
8. Иногда вместо обычного клиента появляется anomaly. Ее нельзя обслуживать как обычного клиента.
9. Для anomaly игрок должен удержать red shutter / protection button 2 секунды. Это отдельное защитное действие, визуально и ментально отличимое от Serve.
10. Если игрок успешно удержал shutter, anomaly считается отраженной, угроза снижается или не растет до критического состояния, смена продолжается.
11. Если игрок обслуживает anomaly, не удерживает shutter достаточно долго или реагирует слишком поздно, растет threat и/или mistakes, а игра может прийти к gameOver.
12. HUD во время смены показывает score, mistakes, threat, shift timer и доступные действия так, чтобы пользователь мог играть в phone landscape и tablet landscape без чтения мелкого текста.
13. Игрок может поставить смену на паузу и сбросить попытку, не теряя понимание текущего состояния.
14. Если игрок доживает до конца 90-секундной смены без gameOver, он получает victory state.
15. Если threat/mistakes достигают критического состояния до конца смены, игрок получает gameOver state с возможностью начать заново.

Альтернативные исходы и edge cases на уровне поведения:

- Нажатие Serve без корректно собранного заказа считается ошибочной подачей или неуспешным действием с понятной обратной связью.
- Serve и Hold Shutter не должны конкурировать за одно и то же намерение игрока: игрок должен понимать, когда он обслуживает, а когда защищается.
- Прерывание удержания shutter до 2 секунд не считается успешной защитой.
- Истечение таймера смены приводит к victory только если gameOver не наступил раньше.
- Reset возвращает игрока к началу попытки, а не к непонятному промежуточному состоянию.
- Pause останавливает давление смены для игрока и позволяет продолжить без потери контекста.

### Конечный результат

Пользователь получает один завершенный playable MVP: KFS Night Shift запускается как основной продукт, предлагает старт смены, обучает через первого обычного клиента, дает готовить 3-4 типа блюд, различать обычных клиентов и anomalies, принимать решения Serve / Hold Shutter, проходить 90-секундную смену до victory или проигрывать через gameOver.

Игра должна ощущаться как читаемый night-shift horror service loop: мрачная атмосфера, визуальный smoke / horror mood, понятная угроза от anomalies, компактный touch-first HUD, крупные элементы управления и отсутствие зависимости от старой Canvas catch-game как пользовательского entrypoint.

### Acceptance criteria

- [ ] При открытии продукта пользователь видит KFS Night Shift как основной playable experience, без необходимости запускать старую Canvas catch-game.
- [ ] Стартовый экран позволяет начать смену и задает настроение ночного fast-food horror kiosk.
- [ ] В портретной ориентации до gameplay показывается rotate gate с просьбой повернуть устройство в landscape.
- [ ] В phone landscape и tablet landscape основные действия остаются читаемыми и доступны через touch targets не меньше 44px.
- [ ] HUD во время смены показывает score, mistakes, threat и 90-секундный shift timer.
- [ ] Первая обычная customer encounter позволяет пройти полный безопасный loop: заказ, сбор блюда, Serve, успешный результат.
- [ ] MVP поддерживает 3-4 различимых типа блюд, достаточных для проверки cooking/service loop.
- [ ] Correct serve обычному клиенту увеличивает score и дает понятную положительную обратную связь.
- [ ] Wrong serve обычному клиенту фиксирует mistake и дает понятную отрицательную обратную связь.
- [ ] Anomaly encounter ясно отличается от normal customer на уровне игрового восприятия.
- [ ] Serve anomaly считается ошибочным или опасным действием и приближает gameOver через threat/mistakes.
- [ ] Red shutter / protection button визуально и ментально отделен от Serve.
- [ ] Удержание shutter 2 секунды успешно отражает anomaly.
- [ ] Отпускание shutter раньше 2 секунд не засчитывается как успешная защита.
- [ ] Отсутствие своевременной защиты от anomaly повышает угрозу и может привести к gameOver.
- [ ] По истечении 90 секунд без gameOver показывается victory state.
- [ ] При достижении критического threat/mistakes до конца смены показывается gameOver state.
- [ ] Pause позволяет остановить смену и вернуться к игре без потери текущего состояния.
- [ ] Reset позволяет начать попытку заново из понятного стартового состояния.
- [ ] Visual horror mood, включая smoke или сопоставимый визуальный эффект, заметен во время gameplay и не мешает читать HUD.

### Метрики бизнес-успеха / качества

- Игрок на phone landscape может понять основную цель и начать смену без внешних инструкций.
- Игрок проходит первый normal customer loop без путаницы между Serve и защитным shutter-действием.
- В течение одной 90-секундной попытки игрок встречает как минимум один normal customer service loop и один anomaly defense loop.
- Все ключевые исходы MVP наблюдаемы в игре: correct serve, wrong serve, anomaly success defense, anomaly fail, victory, gameOver.
- Touch-first UX не требует точных мелких нажатий: основные действия соответствуют минимальному размеру 44px и не перекрываются.
- Horror mood считывается в первые секунды gameplay, но не снижает понятность заказов, таймера и действий.

### Задействованные сущности

- Игрок: принимает решения, готовит заказ, обслуживает обычных клиентов, защищается от anomalies, управляет паузой и reset.
- Смена: 90-секундная игровая попытка с началом, активным gameplay, victory или gameOver.
- Normal customer: безопасный клиент, которого можно обслужить после корректного приготовления заказа.
- Anomaly: опасный посетитель, которого нельзя обслуживать; требует удержания shutter 2 секунды.
- Заказ: пользовательская цель на конкретную encounter; определяет, что нужно приготовить и подать.
- Блюдо: один из 3-4 MVP-типов готовки, используемых для проверки service loop.
- Serve action: действие подачи собранного заказа обычному клиенту.
- Red shutter / protection action: защитное действие против anomaly, требующее удержания 2 секунды.
- Score: показатель успешного обслуживания.
- Mistakes: показатель ошибок игрока при обслуживании или неверной реакции.
- Threat: показатель опасности от anomalies и провалов защиты.
- Shift timer: оставшееся время до победного окончания смены.
- Victory state: состояние успешного завершения смены.
- GameOver state: состояние провала смены.
- Pause state: временная остановка активной попытки.
- Reset: возврат к началу новой попытки.

### Dependencies

- Требуется согласованное продуктово-игровое понимание MVP как mobile-landscape-first vertical slice.
- Требуется, чтобы KFS Night Shift был пользовательским entrypoint для MVP вместо старой Canvas catch-game.
- Требуется читаемый набор визуальных признаков normal customers и anomalies, достаточный для принятия решения игроком.
- Требуется согласованная граница MVP по набору блюд: 3-4 типа достаточно для первой завершенной версии.

### Out of scope

- Полный список блюд из исходной идеи, если он перегружает touch HUD для MVP.
- Расширенные настройки, если они не меняют фактический gameplay.
- Дополнительные уровни, длинная кампания, прогрессия между сменами и мета-экономика.
- Сложные сценарии обучения за пределами первого понятного normal customer loop.
- Детализация технической архитектуры, интерфейсов, внутренних модулей, файлов реализации и команд проверки.
- Архитекторские фазы и технический план реализации.

### Non-blocking assumptions

- Старая Canvas catch-game выходит из пользовательского entrypoint для MVP.
- MVP shift длится 90 секунд.
- MVP может ограничить блюда 3-4 типами, если полный список из prompt перегружает touch HUD; исходный prompt полный список фиксируется как future expansion или phased scope.
- Desktop поддерживается, но primary UX target - phone landscape/tablet landscape.
- Settings не обязательны в MVP, если не дают реального gameplay effect.

## TDD Acceptance Test Design

Gate status: `TDD_ACCEPTANCE_TESTS_READY`.

Approved acceptance behavior cases:

| Case | Behavior target | Primary surfaces | Phase mapping |
| --- | --- | --- | --- |
| AT-01 | Entrypoint/start opens KFS Night Shift, not legacy catch game | `index.html`, `src/main.tsx`, `src/app/App.tsx`, `src/pages/GamePage.tsx`, `package.json` | Phase 1 |
| AT-02 | Portrait orientation blocks gameplay with landscape rotate gate | `src/widgets/Hud.tsx`, `src/styles.css`, browser viewport behavior | Phase 3 |
| AT-03 | HUD exposes score, mistakes, threat, shift timer and shift state | `src/app/store.ts`, `src/widgets/Hud.tsx`, `src/styles.css` | Phase 2, Phase 3 |
| AT-04 | First normal customer gives a safe complete order/serve loop | `src/app/store.ts`, `src/features/customers/generator.ts`, `src/features/orders/generator.ts`, `src/features/orders/matcher.ts`, `src/widgets/Hud.tsx` | Phase 2 |
| AT-05 | MVP has 3-4 distinct dish/prep options | `src/features/cooking/*`, `src/features/orders/*`, `src/widgets/Hud.tsx` | Phase 2, Phase 3 |
| AT-06 | Correct serve normal customer increases score and feedback | `src/app/store.ts`, `src/features/orders/matcher.ts`, `src/widgets/Hud.tsx` | Phase 2 |
| AT-07 | Wrong serve normal customer records mistake and feedback | `src/app/store.ts`, `src/features/orders/matcher.ts`, `src/widgets/Hud.tsx` | Phase 2 |
| AT-08 | Anomaly is recognizable as non-normal customer | `src/features/customers/generator.ts`, `src/widgets/GameScene.tsx`, `src/widgets/Hud.tsx` | Phase 2, Phase 4 |
| AT-09 | Serving anomaly fails and raises danger toward gameOver | `src/app/store.ts`, `src/widgets/Hud.tsx` | Phase 2 |
| AT-10 | Holding red shutter for 2 seconds repels anomaly | `src/app/store.ts`, `src/features/difficulty/config.ts`, `src/widgets/Hud.tsx`, `src/widgets/GameScene.tsx` | Phase 2, Phase 3 |
| AT-11 | Releasing shutter early or reacting late fails protection | `src/app/store.ts`, `src/widgets/Hud.tsx`, `src/widgets/GameScene.tsx` | Phase 2, Phase 3 |
| AT-12 | End states, pause and reset are observable and recoverable | `src/app/store.ts`, `src/widgets/Hud.tsx`, `src/pages/GamePage.tsx` | Phase 2, Phase 3, Phase 5 |

TDD strategy expectation:

- For Phase 1, require a failing entrypoint/build smoke test or equivalent pre-fix evidence proving the legacy `src/main.js` canvas path is still the launched product.
- For Phase 2, require deterministic unit coverage around store transitions and pure generators/matcher for AT-03 through AT-12 before implementation changes.
- For Phase 3, require browser behavior tests or Playwright-style acceptance checks for orientation, touch targets, pause/reset and HUD readability.
- For Phase 4, require visual evidence, not only unit tests: desktop, phone landscape, tablet landscape and portrait rotate gate screenshots.
- For Phase 5, require evidence collation against every AT case and final release-readiness review before `ready/<slug>`.

## Critical Review (architect)

Business scope is approved and no business-level objection is raised. The current repository already contains two competing runtime paths: the shipped `index.html` points to legacy `src/main.js` canvas catch-game, while a newer React/Zustand/Three KFS Night Shift implementation exists in `src/main.tsx`, `src/app/store.ts`, `src/widgets/Hud.tsx`, `src/widgets/GameScene.tsx` and `src/features/*`. The phase plan therefore must first align the runtime entrypoint and dependency/build surface before gameplay polish.

Brainstorming-lite:

| Approach | Decision | Rationale |
| --- | --- | --- |
| Keep legacy canvas `src/main.js` and rewrite it into the service-loop game | Rejected | It conflicts with existing FSD-style React/Three surfaces, would duplicate already-present domain code, and keeps the wrong entrypoint architecture. |
| Promote the React/Zustand/Three runtime as the only playable MVP and retire the legacy canvas entrypoint from user launch | Selected | This matches the existing KFS domain modules, separates scene/HUD/state responsibilities, and directly addresses AT-01 with the least architectural churn. |
| Build a third runtime from scratch | Rejected | Too much scope for MVP, duplicates current work, and increases verification risk without a stronger product outcome. |

Architecture constraints for the dev team:

- Treat `src/app/store.ts` and `src/features/*` as the behavior source of truth after Phase 1, not `src/main.js`.
- Keep business behavior deterministic where AT tests need it: first normal customer, forced anomaly paths, 90-second timer, threshold-based gameOver and reset.
- Do not add broad abstractions until tests show repeated complexity; keep the vertical slice small and observable.
- Any dependency or entrypoint manifest change must be verified by install/build/typecheck evidence, because `package.json` currently lists only `vite` while React/Three/Zustand/TypeScript imports exist in source.

## Verified code surfaces

- Knowledge base: `docs/context`.
- Retrieval queries:
  - `KFS Night Shift mobile landscape horror service loop entrypoint HUD anomaly`
- Candidate cards: none.
- Retrieval result: `docs/context` does not exist in this repository; `scripts/knowledge.sh` is not present in the opened file list, so verification used fallback direct file inspection.
- Git status evidence: worktree already contains untracked project files including `AGENTS.md`, `docs/`, `src/app/`, `src/features/`, `src/main.tsx`, `src/pages/`, `src/shared/`, `src/widgets/`, `tsconfig.json`.
- Opened config/runtime surfaces:
  - `package.json`: Vite scripts only; devDependencies show only `vite`.
  - `package-lock.json`: root package mirrors only `vite` devDependency.
  - `index.html`: mounts legacy `.game-shell`, legacy HUD/canvas controls, and imports `/src/main.js`; no `#root` element for React entrypoint.
  - `src/main.js`: legacy canvas catch game with score/best/lives/drop-catching loop.
  - `src/main.tsx`: React root entrypoint expecting `#root`, imports `App` and `styles.css`.
  - `tsconfig.json`: strict React JSX TypeScript config includes `src`.
- Opened product runtime surfaces:
  - `src/app/App.tsx`, `src/pages/GamePage.tsx`: route to `GameScene` plus `Hud`.
  - `src/app/store.ts`: Zustand game state for menu/playing/paused/victory/gameOver, shift timer, customer/order, cooking, serve, anomaly protection.
  - `src/widgets/Hud.tsx`: overlay/menu, HUD stats, prep controls, Serve/Quick/Clear/Hold Shutter, orientation overlay.
  - `src/widgets/GameScene.tsx`: React Three Fiber low-poly kiosk/customer scene, anomaly visuals, shutter mesh, tick loop.
  - `src/features/cooking/*`: station config and dish/prepared item types.
  - `src/features/customers/*`: normal/anomaly customer generation.
  - `src/features/orders/*`: order generation, matching and prepared summary.
  - `src/features/difficulty/config.ts`: `SHIFT_SECONDS = 90`, `PROTECTION_HOLD_SECONDS = 2`, mistake/threat caps.
  - `src/styles.css`: currently styled for legacy canvas shell, not verified as React HUD/game styles.
- Confirmed drift:
  - User-facing entrypoint is still the old canvas catch-game.
  - React KFS runtime exists but is not mounted by `index.html`.
  - Runtime imports require dependencies not declared in `package.json`.
  - Current CSS opened in `src/styles.css` targets legacy classes; React classes such as `.game`, `.hud-layer`, `.overlay`, `.action-dock`, `.orientation-overlay` are not present in the opened stylesheet.
- Tests/config evidence:
  - No test files or test scripts were found in the read-only file list.
  - `npm run build` exists, but no typecheck/test scripts are declared yet.

## QA / Expert Coverage Matrix

All rows start as `pending` and must be closed with commit-specific evidence before final readiness.

| Phase | Surface | Trigger | Required agent or evidence | Required status | Handoff artifact | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Runtime entrypoint/build | `index.html` previously launched legacy canvas; React entrypoint/deps drift addressed | `tdd-expert` strategy and evidence approved; QA typecheck/build/static/browser smoke pass | `pass` | TDD evidence approved; QA confirmed KFS surface renders and legacy entrypoint is absent | team-lead, qa | pass |
| 1 | Runtime source removal/retirement decision | Legacy `src/main.js` must not remain user entrypoint | local `reviewer` architectural review | `pass` | Reviewer approved Phase 1 with no blocking findings; file-surface check confirms legacy absent from user-facing launch | team-lead | pass |
| 2 | Game state/order/anomaly behavior | AT-03 through AT-12 core transitions | `tdd-expert` strategy and post-dev evidence; QA behavior checks | `pass` | TDD evidence approved after RED recovery and final shutter cleanup fix; QA PASS: `npm run test` 22 tests, typecheck/build pass | team-lead, qa | pass |
| 2 | Deterministic acceptance paths | First normal loop and anomaly cases must be reliably testable | local `reviewer` plus QA edge-case verification | `pass` | Reviewer APPROVE after shutter cleanup; no blocking findings; Phase 3/4 visual/mobile scope remains deferred | team-lead, qa | pass |
| 3 | Browser-visible mobile HUD | Phone/tablet landscape, portrait rotate gate, 44px targets | QA visual mobile screenshots and behavior evidence | `pass` | QA PASS with visual artifacts in `.runtime/qa-artifacts/kfs-night-shift-mvp/phase3/`, including 568x320 landscape after fix; touch targets and HUD readability verified | qa | pass |
| 3 | UI state controls | Pause/resume/reset, Serve vs Hold Shutter separation | `tdd-expert` applicable strategy; QA interaction checks; local reviewer | `pass` | TDD evidence approved; QA interaction checks pass; reviewer approved after small landscape fix | team-lead, qa | pass |
| 4 | 3D scene/horror mood | Low-poly scene, customer/anomaly readability, smoke/fog/mood | Visual QA screenshots/canvas evidence; local reviewer | `pass` | QA PASS after readability fix with artifacts in `.runtime/qa-artifacts/kfs-night-shift-mvp/phase4/after-readability-fix/`; reviewer approved | qa | pass |
| 4 | Render/performance risk | Three.js/mobile canvas render-critical surface | QA performance sanity or frontend-render performance evidence | `pass` | Commands pass: `npm run test` 29 tests, `npm run test:browser` 6 checks, typecheck/build pass; residual warnings accepted as non-blocking | qa | pass |
| 5 | Release readiness | All AT cases and docs evidence must be traceable | QA final build/typecheck/behavior evidence, reviewer, final `@feature-experts` review | `pass` | Final QA PASS, local reviewer approve, `@feature-experts` PASS score 88/100, command evidence and artifact paths recorded | team-lead, feature-release-arbiter | pass |
| 5 | Plan/docs handoff | Plan must reflect completed evidence without changing scribe section | docs/plan evidence check | `pass` | README updated for KFS Night Shift MVP and plan Phase 5 evidence recorded without changing scribe business section | team-lead | pass |

Final gate requirement: `ready/<slug>` is blocked until TDD strategy/evidence, QA build/typecheck/behavior checks, visual mobile screenshots, local reviewer verdict and final `@feature-experts` review are all `pass` or explicitly waived by team-lead/user with recorded reason.

## Фазы (архитектор)

### Phase 1 runtime alignment and entrypoint

- Status: `completed`
- Goal: make KFS Night Shift the launched product surface and remove the current mismatch between legacy canvas entrypoint and React KFS runtime.
- Surfaces: `index.html`, `package.json`, `package-lock.json`, `src/main.tsx`, `src/main.js`, `src/app/App.tsx`, `src/pages/GamePage.tsx`, `src/styles.css`, `tsconfig.json`.
- AT mapping: AT-01 primary; AT-02/AT-03 as smoke preconditions.
- TDD strategy expectation: `requires_tdd: yes`; `tdd-expert` must define an entrypoint/build smoke strategy with pre-fix evidence that the old canvas path is launched and post-fix evidence that React KFS starts from the root entrypoint.
- QA checks: install/build/typecheck evidence as available, browser smoke for menu/start launch, confirm legacy catch-game is not user-facing.
- QA / Expert Coverage Matrix: covered by global rows Phase 1 runtime entrypoint/build and runtime source retirement decision.
- Reviewer focus: dependency manifest correctness, `index.html` root/mount correctness, no split-brain between `src/main.js` and `src/main.tsx`, no accidental rewrite of gameplay behavior in this phase.
- Rollback: restore previous `index.html` script/root contract and dependency manifest, leaving React runtime files untouched for replanning.
- Risks: package manifest drift may block build before gameplay work; retiring `src/main.js` without clear entrypoint evidence can hide regressions.

Evidence:

- Developer handoff complete for Phase 1 runtime alignment.
- TDD evidence approved: `TDD_EVIDENCE_APPROVED`.
- QA verdict: pass; typecheck, build, static checks and browser smoke passed; KFS surface renders; legacy catch-game surface is absent.
- Reviewer verdict: approve; no blocking findings.

### Phase 2 game state/order/anomaly core loop

- Status: `completed`
- Goal: make core behavior deterministic and acceptance-testable: 90-second shift, first normal order loop, dish variety, serve outcomes, anomaly danger/protection, victory/gameOver.
- Surfaces: `src/app/store.ts`, `src/features/difficulty/config.ts`, `src/features/customers/generator.ts`, `src/features/customers/types.ts`, `src/features/orders/generator.ts`, `src/features/orders/matcher.ts`, `src/features/orders/types.ts`, `src/features/cooking/config.ts`, `src/features/cooking/types.ts`.
- AT mapping: AT-03, AT-04, AT-05, AT-06, AT-07, AT-08, AT-09, AT-10, AT-11, AT-12.
- TDD strategy expectation: `requires_tdd: yes`; `tdd-expert` must require failing-first tests for store transitions and pure matcher/generator behavior, including deterministic first customer and forced anomaly scenarios.
- QA checks: behavior evidence for correct serve, wrong serve, serving anomaly, successful 2-second shutter hold, early release fail, late/no protection fail, timer victory, mistake/threat gameOver, pause/resume/reset.
- QA / Expert Coverage Matrix: covered by global rows Phase 2 game state/order/anomaly behavior and deterministic acceptance paths.
- Reviewer focus: no hidden random-only acceptance paths, no timer progression while paused, no Serve/Shutter intent collision, clear state reset boundaries.
- Rollback: revert behavior changes to previous store/features while keeping Phase 1 entrypoint if already verified; disable new deterministic hooks only if they leak into product UX.
- Risks: random customer generation can make AT cases flaky; timer/anomaly interactions can produce race conditions if not isolated in tests.

Evidence:

- Developer handoff complete for Phase 2 core loop and tests.
- TDD evidence approved: `TDD_EVIDENCE_APPROVED`; RED recovery accepted, including final captured RED fixes for shutter cleanup behavior.
- QA verdict: pass; `npm run test` passed with 22 tests; typecheck and build passed.
- Reviewer verdict: approve; no blocking findings after final shutter cleanup.
- Residual: build chunk-size warning remains non-blocking; Phase 3/4 visual and mobile scope is deferred to their owning phases.

### Phase 3 mobile-landscape HUD and controls

- Status: `completed`
- Goal: make the HUD and controls playable in phone landscape and tablet landscape, with portrait rotate gate before gameplay and clear separation between Serve and Hold Shutter.
- Surfaces: `src/widgets/Hud.tsx`, `src/styles.css`, `src/app/store.ts`, `src/shared/format.ts`, `src/pages/GamePage.tsx`.
- AT mapping: AT-02, AT-03, AT-05, AT-10, AT-11, AT-12.
- TDD strategy expectation: `requires_tdd: yes`; `tdd-expert` should require component/browser-level checks where practical for phase/state rendering, and mark purely visual assertions for QA screenshot evidence.
- QA checks: phone portrait rotate gate, phone landscape gameplay, tablet landscape gameplay, touch targets at least 44px for primary actions, pause/resume/reset flow, shutter hold progress visible and separate from Serve.
- QA / Expert Coverage Matrix: covered by global rows Phase 3 browser-visible mobile HUD and UI state controls.
- Reviewer focus: responsive constraints, no overlapping HUD/action dock, no tiny text in core controls, no in-app explanatory wall of text replacing playable affordances.
- Rollback: revert CSS/HUD layout changes while preserving Phase 2 state behavior; temporarily simplify nonessential controls before changing acceptance behavior.
- Risks: dense prep controls can overflow mobile landscape; orientation overlay can accidentally cover desktop/tablet landscape if media queries are too broad.

Evidence:

- Developer handoff complete for Phase 3 mobile-landscape HUD and controls.
- TDD evidence approved: `TDD_EVIDENCE_APPROVED`.
- QA verdict: pass; `npm run test:browser` passed with 6/6 browser checks, `npm run test` passed with 22/22 tests, typecheck and build passed.
- QA visual artifacts: `.runtime/qa-artifacts/kfs-night-shift-mvp/phase3/`; coverage includes portrait rotate gate, phone landscape, tablet landscape, and 568x320 landscape evidence after fix.
- Reviewer verdict: approve after small landscape fix.
- Residual: build chunk-size warning and WebGL `ReadPixels` screenshot warning remain non-blocking.

### Phase 4 low-poly scene/horror mood and feedback

- Status: `completed`
- Goal: make the visible scene support the horror service-loop mood and provide readable normal/anomaly feedback without blocking HUD readability.
- Surfaces: `src/widgets/GameScene.tsx`, `src/widgets/Hud.tsx`, `src/styles.css`, `src/features/customers/types.ts`, `src/features/customers/generator.ts`.
- AT mapping: AT-08, AT-10, AT-11 plus visual mood acceptance from business criteria.
- TDD strategy expectation: `requires_tdd: partial`; use TDD only for data/prop/state conditions that select visual states; require visual QA evidence for actual scene readability and mood.
- QA checks: screenshots for normal customer, each anomaly cue if reachable/deterministic, shutter closed state, horror mood/smoke/fog or equivalent, HUD readability over scene on desktop and mobile landscape.
- QA / Expert Coverage Matrix: covered by global rows Phase 4 3D scene/horror mood and render/performance risk.
- Reviewer focus: anomaly cues are visible enough to support decisions, scene does not depend on inaccessible color-only signals, Three.js additions do not create mobile performance hazards.
- Rollback: revert scene/material/effect changes to the last readable low-poly baseline; keep behavior and HUD phases intact.
- Risks: visual effects can obscure orders/HUD; render-heavy mood effects can harm mobile responsiveness.

Evidence:

- Developer handoff complete for Phase 4 low-poly scene/horror mood and feedback.
- TDD evidence approved: `TDD_EVIDENCE_APPROVED`.
- QA first verdict: fail on visual readability; developer completed readability fix.
- QA final verdict: pass after readability fix; artifacts under `.runtime/qa-artifacts/kfs-night-shift-mvp/phase4/after-readability-fix/`.
- Reviewer verdict: approve; no blockers.
- Commands pass: `npm run test` passed with 29 tests; `npm run test:browser` passed with 6 browser checks; typecheck and build passed.
- Residual: build chunk-size warning, WebGL `ReadPixels` screenshot warnings, and minor non-critical phone message clipping are accepted as non-blocking.

### Phase 5 verification/docs/release readiness

- Status: `completed`
- Goal: close all acceptance evidence and produce a release-ready handoff without starting unrelated scope.
- Surfaces: `docs/plans/kfs-night-shift-mvp.md`, `README.md` if release instructions need alignment, test/build artifacts, QA screenshots/evidence paths.
- AT mapping: AT-01 through AT-12.
- TDD strategy expectation: `requires_tdd: no new product behavior`; TDD evidence from Phases 1-4 must be complete and linked. Any late behavior fix re-enters the relevant earlier phase gate.
- QA checks: final build/typecheck, full AT behavior pass, visual mobile screenshot set, pause/reset/victory/gameOver smoke, no legacy catch-game entrypoint.
- QA / Expert Coverage Matrix: covered by global rows Phase 5 release readiness and plan/docs handoff.
- Reviewer focus: evidence completeness, no acceptance gaps hidden as assumptions, no runtime source changes outside planned surfaces, final `@feature-experts` verdict recorded.
- Rollback: if final verification fails, return to the owning phase with the failing AT case; do not patch release docs to mask failing behavior.
- Risks: missing test scripts can reduce evidence quality unless Phase 1/2 adds appropriate commands; final review can block if visual evidence is stale or not tied to the verified build.

Evidence:

- Final QA verdict: PASS.
- Local reviewer verdict: approve.
- Final `@feature-experts` verdict: PASS/approve, score 88/100.
- Final command evidence: `npm run test` passed with 29 tests; `npm run test:browser` passed with 6 browser checks; `npm run typecheck` passed; `npm run build` passed.
- Release docs evidence: `README.md` updated to describe KFS Night Shift MVP, commands, mobile landscape/tablet support, gameplay mechanics, architecture summary, remaining scope and residual risks.
- Plan evidence: Phase 5 status completed; QA / Expert Coverage Matrix Phase 5 rows updated to pass; scribe business section left unchanged.
- Artifact paths:
  - `.runtime/qa-artifacts/kfs-night-shift-mvp/phase3/`
  - `.runtime/qa-artifacts/kfs-night-shift-mvp/phase3/visual-evidence.json`
  - `.runtime/qa-artifacts/kfs-night-shift-mvp/phase3/visual-evidence-after-568x320-fix.json`
  - `.runtime/qa-artifacts/kfs-night-shift-mvp/phase4/after-readability-fix/`
  - `.runtime/qa-artifacts/kfs-night-shift-mvp/phase4/after-readability-fix/render-sanity-performance-note.json`
  - `test-results/.last-run.json`
- Residual accepted risks: build chunk-size warning, WebGL `ReadPixels` screenshot warning and minor non-critical phone message clipping remain non-blocking.
