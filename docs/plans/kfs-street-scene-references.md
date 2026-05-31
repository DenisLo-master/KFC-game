---
slug: kfs-street-scene-references
title: KFS Street Scene References
type: plan
task_mode: important
mode_reason: расширяет пользовательский pre-read перед сменой, вводит новые поведенческие и визуальные ожидания для улицы, посетителей и связки с horror service loop
curator: team-lead
status: docs_handoff_complete
created: 2026-05-31
updated: 2026-05-31
tags:
  - kfs-night-shift
  - street-scene
  - references
  - horror-service-game
  - important
---

# KFS Street Scene References

## ТЗ от scribe

### Бизнес-флоу

KFS Night Shift должен получить выразимую стартовую street-scene до начала активной смены. Перед тем как игрок нажимает старт и входит в текущий horror service loop, он видит ночной городской KFS kiosk как маленький остров света на пустоватой, мокрой и небезопасной улице. Эта сцена не заменяет основной loop обслуживания, а готовит игрока к нему: показывает место, поток прохожих, настроение района и первые признаки того, что обычные посетители могут оказаться не теми, кем кажутся.

Основной сценарий:

1. Пользователь открывает игру и попадает в pre-shift состояние перед активной сменой.
2. На экране видна внешняя street-scene: KFS kiosk, светящаяся вывеска, окно обслуживания, мокрый асфальт, фоновые дома/окна/улица и окружающие городские детали.
3. До старта смены улица выглядит живой: мимо или к киоску движутся прохожие, свет меняется, видны атмосферные micro-events вроде пара, мусора от ветра, отражений, фар или дальних окон.
4. Обычные прохожие и будущие посетители читаются как люди из reference-линейки: студент, офисный работник, курьер/доставщик, пожилой человек, женщина с покупкой, уставший родитель, ночной работник, подросток.
5. Worker identity KFS считывается через форму, бейдж, темно-оливковую/желтую палитру, рабочую tired-night-shift подачу и внутренний backroom/service контекст.
6. Игрок может до начала смены наблюдать улицу и визуально "читать" посетителей: кто просто проходит, кто приближается к окну, кто задерживается в свете киоска, кто ведет себя странно.
7. В pre-shift сцене допускаются subtle anomalous cues, но они не должны запускать наказание до активной смены: это подготовка внимания, а не gameplay failure.
8. При старте смены текущая street-scene должна логично перейти в существующий service loop: посетитель/очередь/окно обслуживания становятся источником активных customer encounters.
9. Во время активной смены уличная жизнь не исчезает полностью: ambient-динамика продолжает поддерживать ощущение ночной улицы, но не мешает HUD, заказам и действиям игрока.
10. Появление обычных клиентов и anomalies должно ощущаться продолжением той же street-scene: они приходят с улицы, приближаются к окну, становятся encounter, затем уходят/исчезают/сменяются.
11. Anomalous visitors должны выглядеть почти обычными, но давать наблюдаемые отклонения из референсов: слишком длинные конечности, неподвижная широкая улыбка, наклоненная голова, зеленоватый пар/утечка, взгляд, который не отслеживает нормально, зависание над землей, лишне-сочлененные пальцы, почти правильные пропорции с ощущением ошибки.
12. Если игрок уже видел street pre-read, дальнейшее решение Serve или shutter должно восприниматься как результат наблюдения, а не случайное угадывание.

Альтернативные исходы и edge cases на уровне поведения:

- Если игрок быстро начинает смену, он не должен терять понимание места: street mood должен быть понятен в первые секунды активного gameplay.
- Если игрок задерживается на pre-shift сцене, сцена должна оставаться живой, а не превращаться в статичную картинку.
- Ambient effects не должны перекрывать важные игровые сигналы, orders, timer, Serve/shutter decisions или readable customer cues.
- Обычные прохожие не должны выглядеть настолько пугающе, что игрок всегда выбирает защиту.
- Anomalies не должны быть настолько явными, что исчезает смысл наблюдения "they look ordinary, they aren't".
- Улица должна поддерживать horror tension, но не менять базовую цель игры: выжить в night shift через обслуживание обычных клиентов и защиту от опасных посетителей.

### Конечный результат

Пользователь получает расширенное начало и окружение KFS Night Shift: перед активной сменой игра показывает живую ночную улицу вокруг киоска, где обычные прохожие, KFS worker identity, мокрый асфальт, фоновые окна, пар, мусор от ветра, фары и свет вывески создают понятный urban horror context. Старт смены ощущается не как появление из пустоты, а как открытие окна обслуживания на уже живой улице.

После старта текущий horror service loop сохраняется: игрок по-прежнему готовит заказы, обслуживает normal customers и отражает anomalies через shutter. Новая street-scene добавляет readable pre-read и continuity: персонажи приходят из улицы, anomalies выглядят почти обычными, ambient-события усиливают напряжение, а не подменяют механику обслуживания.

### Acceptance criteria

- [ ] До активной смены пользователь видит street pre-shift сцену, а не только статичное меню или пустой service counter.
- [ ] KFS kiosk в стартовой сцене считывается как центральный "остров света" на темной ночной улице.
- [ ] Street-scene содержит признаки живой улицы: прохожие/посетители, меняющийся свет и минимум несколько ambient-событий.
- [ ] Внешнее окружение поддерживает референсы мокрого асфальта, городских окон, дальнего света, уличных фонарей, мусора/листьев и пара.
- [ ] Обычные персонажи включают узнаваемые archetypes из customer lineup, достаточные для ощущения городской очереди и прохожих.
- [ ] KFS worker identity визуально считывается через форму, бейдж/аксессуары, усталый night-shift тон и связь с service/backroom миром.
- [ ] До старта смены игрок может наблюдать движение персонажей без риска получить mistake, threat или gameOver.
- [ ] Персонажи имеют понятную динамику перемещения: проходят мимо, входят в свет киоска, подходят к окну, ждут, уходят или сменяются.
- [ ] При старте смены street pre-read логично связывается с первым активным encounter у окна обслуживания.
- [ ] Во время активной смены ambient street life остается заметной, но не мешает читать HUD, заказы и ключевые действия.
- [ ] Normal customers выглядят достаточно обычными, чтобы игрок не воспринимал каждого прохожего как угрозу.
- [ ] Anomalous visitors выглядят почти обычными, но имеют наблюдаемые отклонения из reference-набора.
- [ ] Anomaly cues поддерживают decision-making игрока: внимательное наблюдение помогает понять, когда Serve опасен и нужен shutter.
- [ ] Ambient effects усиливают horror mood, но не становятся самостоятельной причиной проигрыша.
- [ ] Стартовая сцена и активный service loop воспринимаются как один непрерывный night-shift experience, а не как две несвязанные сцены.
- [ ] Итоговое ощущение соответствует референсам: грязный, тесный, желтовато освещенный KFS kiosk на темной улице с ordinary/anomalous visitors.

### Метрики качества

- Игрок за первые секунды понимает, что место действия - ночной уличный KFS kiosk, а не абстрактная кухня или пустая сцена.
- Игрок может назвать минимум несколько признаков живой улицы после короткого наблюдения до старта смены.
- Игрок различает "обычного прохожего", "будущего посетителя у окна" и "подозрительного посетителя" по поведению или visual cues.
- Street pre-read повышает ощущение suspense перед первой активной подачей, но не замедляет старт смены для игрока, который хочет сразу играть.
- Ambient-динамика заметна в движении и свете, но не снижает читаемость orders, timer, Serve и shutter decisions.
- Anomalies сохраняют баланс "almost ordinary": они узнаваемо странные при внимательном взгляде, но не превращаются в очевидных монстров с первого кадра.
- KFS visual identity стабильно читается через kiosk, worker uniform, signage и service props.
- Новая сцена усиливает текущий horror service loop, а не создает отдельный режим с другой целью.

### Сущности

- Игрок: наблюдает улицу до старта, запускает смену, обслуживает normal customers и реагирует на anomalies.
- Street pre-shift scene: стартовое состояние перед активной сменой, где игрок читает место, настроение и поток персонажей.
- KFS kiosk: центральная точка света, окно обслуживания и визуальный якорь всего experience.
- Service window: граница между улицей и текущим service loop; место, где прохожий становится активным encounter.
- Street pedestrian: фоновый прохожий, который создает жизнь улицы и может пройти мимо без заказа.
- Future visitor: персонаж, который из street flow приближается к окну и становится customer encounter после старта или в процессе смены.
- Normal customer: обычный посетитель из городской lineup, которого можно обслуживать.
- Anomalous visitor: почти обычный посетитель с наблюдаемыми отклонениями, требующий осторожности и shutter-решения.
- KFS worker: ночной сотрудник/идентичность игрока и service контекст, считываемые через форму и рабочие детали.
- Ambient street dynamics: свет, пар, ветер, мусор, мокрые отражения, фары, окна, дальние движения и иные неагрессивные события окружения.
- Street-to-service continuity: связь между pre-read улицей и активным loop обслуживания.
- Horror tension: накопленное ощущение угрозы, которое помогает игроку внимательнее читать посетителей.

### Dependencies

- Нужна согласованность с уже утвержденным KFS Night Shift MVP: новая street-scene расширяет старт и окружение, но не переписывает базовый loop 90-секундной смены.
- Нужны 9 reference images из `docs/references` как визуальный источник для kiosk exterior/interior/backroom, worker uniforms, ordinary customer lineup и anomalous visitor cues.
- Нужен продуктовый баланс между readable ordinary visitors и readable anomalies: сцена должна поддерживать наблюдение, а не делать решение очевидным или случайным.
- Нужна непрерывность между pre-shift сценой и active shift: игрок должен понимать, что наблюдаемая улица является источником customer encounters.
- Нужна защита читаемости текущего HUD/service decisions: ambient не должен конкурировать с основной информацией смены.

### Out of scope

- Переписывание бизнес scope completed MVP как новой истории MVP.
- Новая кампания, уровни, мета-прогрессия, экономика или полноценная сюжетная глава.
- Полноценная симуляция города за пределами киоска и ближайшей улицы.
- Расширение food/service mechanics ради street-scene.
- Новые win/loss conditions, не связанные с уже существующим horror service loop.
- Техническая архитектура, implementation phases, test surfaces, имена файлов реализации и команды проверок.
- Детальная постановка cinematic cutscene, если она мешает быстрому старту активной смены.

### Non-blocking assumptions

- Street pre-read является интерактивно наблюдаемым или живым стартовым состоянием, но не отдельным уровнем с самостоятельной победой/поражением.
- Игрок может быстро стартовать смену без обязательного долгого просмотра всей ambient-сцены.
- Референсы задают настроение, archetypes и visual cues, но не требуют буквального переноса каждого персонажа или каждой детали.
- Backroom и worker uniform references важны для KFS identity и service контекста, даже если основной новый фокус находится на улице.
- Ambient-события могут быть циклическими или вариативными, если они создают ощущение живой улицы и не ломают readable gameplay.
- Визуальная стилизация может адаптироваться под текущий low-poly/horror style продукта, если сохраняет бизнес-ощущение референсов.

## Scribe clarification

Status: `SCRIBE_SCOPE_READY`.

Open questions: none.

Non-blocking assumptions are recorded above.

## TDD Acceptance Test Design

Status: `TDD_ACCEPTANCE_TESTS_READY`.

Scope basis: approved scribe scope above.

Open questions: none.

Notes: behavior-level cases below are sufficient for architectural planning. They intentionally avoid implementation surfaces and describe only observable business behavior.

### Acceptance Cases

#### ATD-01 - Pre-shift street scene is the first readable state

- Linked acceptance criteria: AC1, AC2, AC4, AC16.
- Business/user scenario: player opens the game and immediately understands the place as a night street KFS kiosk before active shift decisions begin.
- Given: the player has opened the game and has not started the shift.
- When: the first pre-shift view is shown.
- Then: the player sees an exterior street scene centered on a lit KFS kiosk, with dark urban surroundings, wet street mood, signage/light contrast, and enough environmental detail to identify the location as a dirty, tight, yellow-lit kiosk on a night street.
- Expected observable result: the start state reads as a place and mood, not as a static menu, empty counter, abstract kitchen, or disconnected backdrop.
- Edge/risk cases:
  - If the player starts quickly, the first seconds still communicate the street setting.
  - The kiosk must remain the visual anchor instead of being lost behind background details.
  - The scene must not feel like a separate cinematic that delays entry into play.
- Linked quality metric/risk: first-seconds place comprehension; KFS visual identity; risk of the start feeling abstract or disconnected.

#### ATD-02 - Street life remains alive before the shift

- Linked acceptance criteria: AC3, AC4, AC7, AC8, AC14.
- Business/user scenario: player waits on the pre-shift scene to observe the street before starting.
- Given: the player is in pre-shift and has not started active gameplay.
- When: the player remains on the scene for a short observation period.
- Then: pedestrians or future visitors move through the street, light changes are noticeable, and several ambient events such as steam, wind-blown trash, reflections, distant lights, windows, or passing light occur without causing failure or punishment.
- Expected observable result: the street feels alive and variable while remaining a safe observation state.
- Edge/risk cases:
  - Waiting must not reduce the scene to a frozen image.
  - Ambient events must not be mistaken for direct threats or fail conditions.
  - Movement variety should support observation without implying full city simulation.
- Linked quality metric/risk: player can name signs of a living street; suspense increases without turning ambient into gameplay failure.

#### ATD-03 - Ordinary street archetypes are recognizable without looking threatening

- Linked acceptance criteria: AC5, AC8, AC11.
- Business/user scenario: player watches people pass by or approach and can read ordinary city archetypes.
- Given: normal pedestrians and future visitors are present around the kiosk.
- When: the player observes their look and movement.
- Then: multiple ordinary archetypes are recognizable, such as student, office worker, courier, older person, shopper, tired parent, night worker, or teenager, and their behavior reads as human rather than automatically hostile.
- Expected observable result: the player can distinguish ordinary passersby from future customers and does not receive a visual message that every person is a threat.
- Edge/risk cases:
  - Ordinary characters must not be so horror-styled that shutter becomes the default guess.
  - Archetypes do not need literal one-to-one reference copying, but must be readable.
  - Background pedestrians must not compete with the currently important visitor.
- Linked quality metric/risk: distinction between ordinary pedestrian, future visitor, and suspicious visitor; risk of false suspicion toward all characters.

#### ATD-04 - KFS worker identity and service context are visible

- Linked acceptance criteria: AC6, AC16.
- Business/user scenario: player understands they are a tired night-shift KFS worker connected to the kiosk service world.
- Given: the pre-shift or shift context presents the worker identity.
- When: the player sees the worker-related visual cues and service surroundings.
- Then: uniform, badge or work accessories, dark olive/yellow palette, tired night-shift tone, and service/backroom cues make the worker identity clear.
- Expected observable result: the player reads the role as KFS night-shift worker, not as an anonymous spectator of a street scene.
- Edge/risk cases:
  - Worker identity must not disappear when focus shifts to the street.
  - Kiosk, uniform, signage, and service props should feel like the same brand world.
  - The worker context must support the service loop rather than becoming separate lore.
- Linked quality metric/risk: stable KFS visual identity through kiosk, worker uniform, signage, and service props.

#### ATD-05 - Pre-shift observation supports visitor pre-read without penalties

- Linked acceptance criteria: AC7, AC8, AC12, AC13.
- Business/user scenario: player studies people before the shift to understand who may become risky later.
- Given: the game is still in pre-shift observation.
- When: a person passes by, enters the kiosk light, approaches the window, waits, leaves, or behaves subtly strangely.
- Then: the player can observe these behaviors without mistake, threat, or game over, and the observed cues provide meaningful context for later Serve or shutter decisions.
- Expected observable result: pre-shift is a readable preparation moment, not a hidden failure state.
- Edge/risk cases:
  - Suspicious behavior may exist before the shift but must not punish the player before active decisions are available.
  - Cues must be noticeable enough to reward attention but not so loud that decisions become obvious.
  - If multiple people are visible, the active or soon-relevant one should remain understandable.
- Linked quality metric/risk: street pre-read improves decision-making; risk of unfair punishment before active gameplay.

#### ATD-06 - Starting the shift connects the street to the first encounter

- Linked acceptance criteria: AC9, AC15.
- Business/user scenario: player starts the shift after seeing the street and expects the first customer encounter to emerge from that world.
- Given: the player is in pre-shift and at least one possible visitor is visible or implied in the street flow.
- When: the player starts the active shift.
- Then: the game moves into the service loop in a way that makes the first encounter feel like it came from the street, through the service window, rather than appearing from nowhere.
- Expected observable result: pre-shift and active shift feel like one continuous night-shift experience.
- Edge/risk cases:
  - If the player starts immediately, continuity still reads through place, window, and customer arrival.
  - The transition must not reset the mood into an unrelated counter-only scene.
  - The first encounter should not contradict what the pre-shift scene established.
- Linked quality metric/risk: street-to-service continuity; risk of two disconnected scenes.

#### ATD-07 - Ambient street life continues during active service without reducing readability

- Linked acceptance criteria: AC10, AC14, AC15.
- Business/user scenario: player is handling active orders and threat decisions while the street remains present in the background.
- Given: the active shift has started.
- When: the player reads orders, timer, key decisions, and customer cues.
- Then: ambient street dynamics remain noticeable but do not obscure or distract from the information and actions needed for service and survival.
- Expected observable result: the street supports tension during active gameplay while the service loop remains readable and primary.
- Edge/risk cases:
  - Light flicker, steam, trash, reflections, or passing headlights must not hide important cues.
  - Ambient motion should not look like an active customer action unless intended by the encounter.
  - Horror mood must not change the win/loss goal of the shift.
- Linked quality metric/risk: ambient dynamics noticeable without lowering readability of orders, timer, Serve, and shutter decisions.

#### ATD-08 - Visitors enter and leave through believable street flow

- Linked acceptance criteria: AC8, AC9, AC10, AC15.
- Business/user scenario: player experiences normal customers and anomalies as part of the same street population.
- Given: the active shift is running and encounters are changing.
- When: a customer or suspicious visitor arrives, waits, is served or rejected, and leaves, disappears, or is replaced.
- Then: the sequence reads as someone moving from the street to the service window and then out of the active encounter, with background street life continuing around it.
- Expected observable result: encounters feel sourced from the living street rather than spawned as isolated service prompts.
- Edge/risk cases:
  - Departures should not create ambiguity about whether the encounter is still active.
  - Background pedestrians should not be confused with the current customer.
  - Anomalies may leave or vanish unnervingly, but the encounter state should remain understandable.
- Linked quality metric/risk: continuous night-shift experience; distinction between passerby, future visitor, and active encounter.

#### ATD-09 - Anomalous visitors remain almost ordinary but observably wrong

- Linked acceptance criteria: AC12, AC13, AC16.
- Business/user scenario: player inspects a visitor who appears mostly human but may be unsafe to serve.
- Given: an anomalous visitor appears in the street flow or at the service window.
- When: the player observes the visitor's body language, proportions, face, gaze, movement, vapor, or hands.
- Then: the visitor remains close enough to ordinary human presentation to create uncertainty, while one or more observable deviations signal risk to an attentive player.
- Expected observable result: the player can infer suspicion through visible cues rather than through random guessing or a blatant monster reveal.
- Edge/risk cases:
  - Deviations must not be so subtle that decisions become arbitrary.
  - Deviations must not be so extreme that the correct response is obvious immediately.
  - Visual strangeness should align with the approved reference set and not introduce unrelated threat types.
- Linked quality metric/risk: "almost ordinary" anomaly balance; risk of random guessing or overly obvious monsters.

#### ATD-10 - Serve or shutter feels based on observation

- Linked acceptance criteria: AC12, AC13, AC15.
- Business/user scenario: player uses pre-read and active visitor cues to choose whether serving is safe or shutter is needed.
- Given: the player has observed street behavior and is now facing a customer or suspicious visitor.
- When: the player chooses Serve or shutter.
- Then: the result feels traceable to previously visible behavior or current visible cues, so a careful player can learn from the decision outcome.
- Expected observable result: decisions are connected to observation and suspense, not to blind chance.
- Edge/risk cases:
  - A player who skipped pre-shift should still have enough active-shift cues to make a fair decision.
  - A player who watched pre-shift should gain useful context without receiving guaranteed answers.
  - Ambient events must not create false positives that punish reasonable observation.
- Linked quality metric/risk: observation supports Serve/shutter decision-making; suspense improves without random-feeling outcomes.

## Critical Review (architect)

Business scope is approved and TDD acceptance design is ready. No business-level objection is raised: the requested street-scene extends the existing KFS Night Shift MVP without changing the 90-second service loop, cooking mechanics, Serve/shutter rules, or win/loss conditions.

Chosen approach: evolve the existing React/Zustand/Three runtime in place. Treat the current `menu` phase as the pre-shift observation state, keep `GameScene` as the always-mounted visual world, and add deterministic visual/state contracts that let the street, pedestrians, first encounter continuity, worker identity, and almost-ordinary anomaly cues render from current game phase and customer state. This preserves the existing architecture split: `src/app/store.ts` owns gameplay state, `src/features/*` owns deterministic domain generation, `src/shared/sceneVisualState.ts` maps domain state to visual state, `src/widgets/GameScene.tsx` renders the Three scene, and `src/widgets/Hud.tsx` renders overlay/HUD controls.

Rejected alternatives:

| Alternative | Decision | Reason |
| --- | --- | --- |
| Add a separate route or cinematic prelude before the game page | Rejected | It risks making the street feel like a disconnected cutscene and adds navigation/state reset complexity without improving the approved loop. |
| Build a full simulated street system with independent AI pedestrians | Rejected | Out of scope for a tight MVP extension; higher CPU/render risk on mobile and unnecessary for the approved observation/readability outcomes. |
| Encode all street behavior only as static Three meshes | Rejected | Too static for ATD-02, ATD-05 and ATD-08; cannot prove living street, movement, approach/wait/leave continuity, or pre-read behavior through deterministic tests. |
| Replace the current kiosk/service scene with a new full exterior scene | Rejected | Too much blast radius for HUD/readability and existing service mechanics; better to layer street exterior/background and approach flow around the existing kiosk/window anchor. |

Brainstorming-lite:

| Option | Pros | Cons | Risk |
| --- | --- | --- | --- |
| A. Extend existing scene/store surfaces with deterministic street visual state | Reuses mounted scene and tests; keeps service loop intact; supports unit, browser and visual QA | Requires careful HUD/readability protection and render budget discipline | Street additions could clutter mobile view if not gated by visual state |
| B. Separate pre-shift scene component with transition into current game scene | Clear code separation for menu vs play | Higher transition complexity; risks two unrelated scenes; duplicates visual assets | Continuity from street to first encounter may feel fake |
| C. Procedural city simulation layer | Richest ambient variety | Overbuilt for approved scope; performance and test determinism cost | Mobile render regressions and unbounded behavior surface |

Selected: Option A.

Rationale: the existing architecture already renders `GameScene` under the menu overlay and has a pure `sceneVisualState` mapping seam. Extending these surfaces gives the smallest coherent path to a living pre-shift street while keeping observable gameplay behavior deterministic and testable.

Implementation constraints for downstream phases:

- Do not change base scoring, cooking, timer, mistake, threat, victory or gameOver rules except where a phase explicitly adds non-punitive pre-shift observation state.
- Keep street/pedestrian generation deterministic or injectable for tests; avoid `Math.random` directly inside render paths.
- Keep ambient effects non-interactive and non-punitive; they may inform mood and observation but must not cause mistakes, threat or gameOver before active shift.
- Protect mobile landscape readability first. Any new meshes, overlays or CSS must not obscure order, timer, Serve, shutter or key visitor cues.
- Reference images in `docs/references` are visual inputs, not implementation truth; final evidence must come from code, browser screenshots and review.

## Verified code surfaces

- Knowledge base: `docs/context`.
- Retrieval queries:
  - `KFS street scene references customer arrival queue street environment React game scene`
- Candidate cards: none.
- Retrieval result: `docs/context/PROJECT_CONTEXT_INDEX.md` is missing and `scripts/knowledge.sh` is unavailable in this repository, so architect used fallback direct inspection as allowed by `context-retrieval-prestep.md`.
- Opened planning/context surfaces:
  - `README.md`: product entrypoint is React/Three KFS Night Shift; commands include `test`, `test:browser`, `typecheck`, `build`.
  - `package.json`: Vite React/Three/Zustand app with Vitest and Playwright scripts.
  - `docs/plans/kfs-night-shift-mvp.md`: prior MVP completed with React/Zustand/Three runtime, HUD/mobile/browser visual evidence and feature expert gate patterns.
  - `docs/plans/kfs-street-scene-references.md`: approved business scope and `TDD_ACCEPTANCE_TESTS_READY` acceptance cases ATD-01 through ATD-10.
  - `docs/references/*`: nine PNG reference files are present for kiosk/street/worker/customer/anomaly visual direction.
- Opened runtime surfaces:
  - `src/app/App.tsx` and `src/pages/GamePage.tsx`: app renders `GameScene` plus `Hud` as one page.
  - `src/widgets/GameScene.tsx`: always-mounted React Three Fiber canvas; current scene already has kiosk/window, wet road/rain/smoke/light, customer body, anomaly cues, shutter and station button meshes.
  - `src/widgets/Hud.tsx`: `menu` phase overlay is current pre-shift/start surface; active HUD owns order, prep, Serve, Quick, Clear, Hold Shutter, pause/reset and rotate gate.
  - `src/app/store.ts`: gameplay phases are `menu | playing | paused | victory | gameOver`; `startShift` immediately creates first normal customer through `nextCustomer(1)`; no dedicated street/pre-shift pedestrian state yet.
  - `src/shared/sceneVisualState.ts`: pure visual-state mapper for anomaly kind, shutter visibility and customer visual cues; suitable extension point for street/visitor cue mapping.
  - `src/features/customers/generator.ts` and `types.ts`: current customers have only id/name/anomaly/anomalyKind/order; no archetype, movement role, pedestrian/future-visitor state, or street continuity metadata yet.
  - `src/styles.css`: mobile landscape HUD, overlay and orientation CSS exist; any street/menu changes must preserve small landscape action dock and overlay readability.
- Opened test surfaces:
  - `src/app/store.test.ts`: covers start shift, normal/anomaly serve, shutter hold, pause, victory/gameOver and deterministic first normal customer.
  - `src/features/customers/generator.test.ts`: covers deterministic anomaly-kind reachability.
  - `src/features/orders/core.test.ts`: covers first normal customer, forced anomaly, dish variety and matching.
  - `src/shared/sceneVisualState.test.ts`: present as pure visual state test surface.
  - `tests/browser/phase3-hud.spec.ts`: Playwright checks portrait gate, phone/tablet landscape HUD, touch targets, Serve vs Hold Shutter, pause/resume/reset.
- Drift / gaps:
  - No project KB index exists, so no context cards can be used as implementation evidence.
  - Current `menu` state is a standard overlay with explanatory tabs; it does not yet expose a living street pre-read, pedestrian flow, worker identity, or street-to-first-encounter continuity.
  - Current customer model has anomaly cues but lacks ordinary archetypes and street roles.
  - Current `GameScene` already contains exterior/horror primitives, but they are not organized as a pre-shift street reference system and may need render/readability budgeting before adding more moving elements.

## QA / Expert Coverage Matrix

All rows start as `pending` and must be closed with phase/commit-specific evidence. This is an `important` task, so TDD gates, QA, local reviewer, browser/visual evidence, render-performance evidence, and final `@feature-experts` review are required unless explicitly waived by team-lead/user with reason.

| Phase | Surface | Trigger | Required agent or evidence | Required status | Handoff artifact | Owner | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Visual/domain state contract | New street/pedestrian/archetype/pre-shift state affects observable behavior | `tdd-expert` strategy and evidence; unit tests for pure generators/selectors/state | `pass` | TDD evidence plus `npm run test` output for new/updated store/features/shared tests | team-lead, qa | pass; baseline waiver approved |
| 1 | Architecture boundary | Prevent scene-only random behavior and gameplay rule drift | local `reviewer` architecture review | `pass` | Reviewer verdict on state ownership, determinism and no scoring/timer rule drift | team-lead | pass; baseline waiver approved |
| 2 | Browser-visible pre-shift street | First state, kiosk island of light, living street and safe observation | QA Playwright/browser evidence plus screenshots | `pass` | `visual_evidence` under `.runtime/qa-artifacts/kfs-street-scene-references/phase2/` for desktop, phone landscape, tablet landscape, portrait gate | qa | pass; QA evidence 2026-05-31 |
| 2 | Render performance | New animated street meshes/effects in Three.js canvas | render performance evidence under frontend render protocol | `pass` | `render_performance_evidence` trace/Lighthouse/Web Vitals or approved fallback metrics in `.runtime/performance-artifacts/kfs-street-scene-references/phase2/` | qa | pass with fallback residual risk; QA evidence 2026-05-31 |
| 3 | Street-to-service continuity | Start shift and encounter arrival must feel sourced from street | `tdd-expert` evidence, browser interaction checks, QA report | `pass` | Unit/browser evidence for pre-shift no-penalty observation and first encounter continuity | team-lead, qa | pass; QA/reviewer approved; evidence 2026-05-31 |
| 3 | Existing gameplay loop regression | Existing cooking/Serve/shutter/timer behavior must remain intact | QA product gate and local `reviewer` | `pass` | `npm run test`, `npm run test:browser`, `npm run typecheck`, `npm run build`; reviewer verdict | qa, team-lead | pass; QA/reviewer approved; serial Playwright baseline |
| 4 | Ordinary/anomalous visitor readability | Archetypes, worker identity and almost-ordinary anomaly cues affect player decisions | Visual QA plus feature experts as needed | `pass` | Screenshot matrix and review notes for normal archetypes, suspicious visitors, worker/KFS identity and HUD readability | qa, feature-release-arbiter | pass; feature/reviewer approved; evidence 2026-05-31 |
| 4 | Visual/browser UX | Mobile landscape readability, portrait gate, HUD/action non-overlap | QA Playwright visual/browser evidence | `pass` | `visual_evidence` under `.runtime/qa-artifacts/kfs-street-scene-references/phase4/` with phone/tablet/desktop states | qa | pass; evidence 2026-05-31 |
| 4 | Render/performance risk | Additional characters, lights, steam, trash/reflections and animation loops | render performance evidence | `pass` | `render_performance_evidence` under `.runtime/performance-artifacts/kfs-street-scene-references/phase4/` | qa | pass with residual perf risk; trace evidence 2026-05-31 |
| 5 | Final important-task release readiness | All ATD cases and quality metrics must be traceable | final `@feature-experts` review coordinated by `feature-release-arbiter`, QA final gate, local reviewer | `pass` | Feature expert verdict, QA final report, local reviewer approve, command evidence and artifact path summary | feature-release-arbiter, team-lead | pass; approved through QA/reviewer with residual risks |
| 5 | Docs/plans/readme handoff | User-facing behavior and residual risks must be documented | docs/plan/readme evidence check | `pass` | Updated documentation evidence or explicit not-applicable rationale | team-lead, docs | pass; README and plan evidence updated |

## Фазы (архитектор)

### Phase 1 - Street visual state and deterministic reference contract

- Status: `completed_with_baseline_waiver`
- Goal: add the minimal deterministic domain/visual contract for street pre-read without rendering the full scene yet: ordinary archetypes, street roles, ambient event descriptors, anomaly cue descriptors, worker/KFS identity flags and phase-aware visual state.
- Surfaces: `src/app/store.ts`, `src/shared/sceneVisualState.ts`, `src/features/customers/types.ts`, `src/features/customers/generator.ts`, `src/features/customers/generator.test.ts`, `src/shared/sceneVisualState.test.ts`, `src/app/store.test.ts`, `docs/references/*`.
- TDD acceptance mapping: ATD-02, ATD-03, ATD-04, ATD-05, ATD-09, ATD-10.
- TDD strategy expectation: `requires_tdd: yes`; TDD expert should require failing tests before implementation for deterministic archetype availability, non-punitive `menu`/pre-shift observation, visual-state mapping for ordinary vs suspicious cues, and no mutation of score/mistakes/threat during pre-shift ticks or observation.
- QA checks: `npm run test`, `npm run typecheck`; inspect that no render-time randomness is introduced in React/Three components; verify existing startShift first-normal-customer test still passes.
- Reviewer focus: state ownership stays in store/features/shared, not hardcoded inside `GameScene`; no change to active shift scoring/timer/end-state rules; reference data remains compact and testable.
- Risks: over-modeling pedestrians into a city sim; adding random behavior that makes tests flaky; accidentally making pre-shift a gameplay failure state.
- Rollback: revert new street/archetype/visual-state additions and tests while leaving existing KFS MVP behavior unchanged.

#### Phase 1 TDD Strategy Gate

- Gate status: `TDD_PHASE_READY`.
- Strategy owner: `tdd-expert`.
- Developer rule: write or update the Phase 1 tests first and capture the expected RED failures before feature implementation. Do not implement street rendering in this phase.

Expected RED tests:

| Test surface | RED expectation before implementation | Acceptance mapping |
| --- | --- | --- |
| `src/features/customers/generator.test.ts` | Deterministic generation exposes ordinary customer archetypes from the approved lineup, e.g. student, office worker, courier/deliverer, older person, shopper, tired parent, night worker or teenager, without relying on render-time randomness. | ATD-03 |
| `src/features/customers/generator.test.ts` | Forced or deterministic anomalous customers expose compact cue metadata tied to existing anomaly kinds and approved "almost ordinary but wrong" references, while normal customers keep non-threatening cue metadata. | ATD-09, ATD-10 |
| `src/shared/sceneVisualState.test.ts` | `getSceneVisualState` accepts phase-aware/pre-shift street input and returns a stable street contract: kiosk/light identity, worker/KFS identity flags, ambient descriptors, visitor roles, and ordinary vs suspicious cue mapping. | ATD-02, ATD-03, ATD-04, ATD-05, ATD-09 |
| `src/shared/sceneVisualState.test.ts` | Normal/ordinary visitors remain visually safe and not auto-threatening, while anomalies remain close to ordinary presentation but expose at least one observable cue descriptor. | ATD-03, ATD-09, ATD-10 |
| `src/app/store.test.ts` | `menu`/pre-shift observation ticks or explicit observation actions do not start the shift, decrement active shift/customer timers, mutate score, mistakes or threat, create gameOver, or enable Serve/shutter penalties. | ATD-02, ATD-05 |
| `src/app/store.test.ts` | `startShift` still starts the 90-second active loop with the deterministic first normal customer and does not regress existing score, mistake, threat or encounter setup expectations. | ATD-05, ATD-10 |

Observable behavior contract:

- Phase 1 is a pure domain/visual-state contract. It may add typed street roles, archetypes, cue descriptors, ambient descriptors and worker/KFS identity flags, but the user-facing Three scene does not need to visually change until Phase 2.
- Pre-shift/menu is the safe observation state. Time may be represented for ambient descriptors only if deterministic and non-punitive; it must not affect active shift timers, customer timers, score, mistakes, threat, victory or gameOver.
- Ordinary archetypes must be reachable and testable through deterministic inputs or sequence-based generation. Tests should assert semantic fields, not pixel-level readability.
- Anomaly cues must remain tied to the existing anomaly model unless a later approved phase expands it. The contract should prove "almost ordinary with observable cue", not introduce a new monster taxonomy.
- Scene visual state should stay derived from store/customer inputs and pure helpers. React/Three components must not become the source of randomness or canonical street behavior.

Test placement:

- Add generator/archetype/cue reachability coverage in `src/features/customers/generator.test.ts`.
- Add phase-aware street/visitor/worker/ambient visual contract coverage in `src/shared/sceneVisualState.test.ts`.
- Add pre-shift safety and no-gameplay-mutation coverage in `src/app/store.test.ts`.
- Keep any new helper tests colocated with the pure helper if the developer creates a small typed helper under `src/features/customers/*` or `src/shared/*`; avoid browser tests in Phase 1 unless implementation unexpectedly touches render behavior.

Evidence expectations:

- Commit or handoff must include the initial RED evidence summary naming the failing test cases and the missing contract they prove.
- Final Phase 1 evidence must include `npm run test` and `npm run typecheck` results.
- Evidence must state that existing store tests for first normal customer, serve/shutter, pause, victory and gameOver still pass.
- Reviewer handoff must explicitly confirm no render-time randomness was added to `src/widgets/*` and no active service scoring/timer/end-state rules changed.

Non-goals for Phase 1:

- No new Three.js street rendering, animation timing, meshes, screenshots or browser visual evidence.
- No new win/loss conditions, scoring changes, timer changes, Serve/shutter rule changes or punishment during pre-shift.
- No full pedestrian AI, pathfinding, city simulation or separate route/cinematic prelude.
- No literal copying of reference images into code; references inform compact archetype and cue descriptors only.
- No README/user-facing docs change unless a later phase exposes visible behavior.

#### Phase 1 QA evidence and baseline deviation

- Team-lead verdict: `TEAM_LEAD_BASELINE_WAIVER_APPROVED`.
- Functional QA status: pass for Phase 1 reported gates: `npm run test`, `npm run typecheck`, and `npm run build`.
- TDD evidence status: approved for the scoped Phase 1 surfaces: `src/features/customers/types.ts`, `src/features/customers/generator.ts`, `src/features/customers/generator.test.ts`, `src/shared/sceneVisualState.ts`, `src/shared/sceneVisualState.test.ts`, `src/app/store.ts`, and `src/app/store.test.ts`.
- Baseline deviation: QA's only failing condition is the pre-existing dirty workspace baseline. The dirty status includes out-of-scope MVP/runtime files and untracked project surfaces observed before Phase 1 work, and `origin/dev` is absent while only `origin/main` exists.
- Decision: classify the dirty workspace finding as a pipeline/baseline deviation, not a blocking Phase 1 feature defect. The issue is waived for continuing because Phase 1 scoped files and functional gates passed.
- Next action: rerun QA, if needed, with explicit scoped-baseline instruction: evaluate Phase 1 only against the listed scoped files and command evidence, while recording the pre-existing dirty baseline as accepted team-lead waiver instead of failing the feature gate.

### Phase 2 - Pre-shift street scene and safe living ambience

- Status: `completed_qa_reviewer_approved`
- Goal: make the first visible state a living night street KFS kiosk scene with kiosk island of light, wet asphalt, background windows/lights, steam/trash/reflections/headlight-style micro-events and visible safe pedestrian/future-visitor movement before the shift starts.
- Surfaces: `src/widgets/GameScene.tsx`, `src/widgets/Hud.tsx`, `src/styles.css`, `src/shared/sceneVisualState.ts`, `tests/browser/phase3-hud.spec.ts` or new street-scene browser spec, `src/app/store.ts` only if needed for safe observation ticks.
- TDD acceptance mapping: ATD-01, ATD-02, ATD-03, ATD-05.
- TDD strategy expectation: `requires_tdd: yes`; TDD expert should require a browser-observable test or component/state test proving pre-shift is not just a static overlay and that waiting does not increase mistakes/threat or start timers.
- QA checks: Playwright visual/browser smoke on desktop, phone landscape, tablet landscape and portrait rotate gate; screenshot evidence for menu/pre-shift, short wait state and quick-start state; `npm run test`, `npm run test:browser`, `npm run typecheck`, `npm run build`.
- Reviewer focus: street elements are visible in first seconds, overlay does not hide the place identity, ambient motion is noticeable but non-punitive, and the scene remains mobile-readable.
- Risks: menu overlay can obscure the street anchor; too many meshes/lights can hurt mobile performance; ambient events may look like active threats.
- Rollback: disable or remove new pre-shift street/ambient rendering while keeping Phase 1 pure state contract for replanning.

#### Phase 2 TDD Strategy Gate

- Gate status: `TDD_PHASE_READY`.
- Strategy owner: `tdd-expert`.
- Applicability: `required`; Phase 2 changes browser-visible behavior and must run RED-first before feature implementation.
- Acceptance cases: ATD-01, ATD-02, ATD-03, ATD-05.
- Public interfaces / test entry points: browser route `/` through Playwright, DOM/HUD controls exposed by `Hud`, canvas host rendered by `GameScene`, pure street visual contract from `getSceneVisualState`, and `useGameStore` for non-punitive menu/pre-shift state checks.
- Developer rule: add or update the Phase 2 tests first, capture RED failures that prove the current menu/pre-shift surface is insufficient, then implement the smallest visible scene changes needed to make those tests green.

Expected RED tests:

| Test surface | RED expectation before implementation | Acceptance mapping |
| --- | --- | --- |
| `tests/browser/phase3-hud.spec.ts` or a new `tests/browser/street-scene.spec.ts` | On first load at `/`, the browser-observable pre-shift state exposes a readable street-scene contract rather than only the current menu panel: visible/testable KFS kiosk/street labels or accessible scene markers, a mounted canvas, and Start Shift still available without entering gameplay. | ATD-01 |
| Browser street-scene spec | The first viewport keeps the KFS kiosk/street anchor visible enough behind or around the menu overlay on desktop and phone landscape; the overlay must not fully hide the place identity. | ATD-01 |
| Browser street-scene spec | After a short wait in `menu`/pre-shift, at least one observable ambient or pedestrian state changes through deterministic animation/DOM marker/canvas-observable hook while the game remains in safe pre-shift. | ATD-02, ATD-05 |
| `src/app/store.test.ts` or existing store coverage if still sufficient | Waiting/ticking in `menu` does not start the shift, decrement shift/customer timers, mutate score, mistakes or threat, create `gameOver`, or enable Serve/shutter penalties. | ATD-02, ATD-05 |
| `src/shared/sceneVisualState.test.ts` or component-adjacent visual-state test | The Phase 1 street contract is consumed for renderable ordinary pedestrian/future-visitor states and exposes non-threatening ordinary archetype semantics for the pre-shift scene. | ATD-03 |
| Browser street-scene spec | The pre-shift scene shows or exposes ordinary pedestrian/future-visitor presence without making every visible person look like an active threat; Start Shift remains the only gameplay entry action. | ATD-03, ATD-05 |
| Existing HUD browser spec | Portrait rotate gate, phone landscape action sizing, tablet landscape touch targets, and existing Start Shift path remain usable after the pre-shift visual additions. | ATD-01, ATD-05 |

Browser-observable expectations:

- The pre-shift route must be verifiable without relying on private React state. Prefer stable `data-testid` markers for scene regions, pedestrian groups, ambient layers, and safe pre-shift status where pixel assertions alone would be brittle.
- Canvas presence alone is not enough. Tests must prove the user can observe a street/KFS kiosk context and at least one living ambience/pedestrian signal before active gameplay.
- Waiting in pre-shift must be safe. Any animation loop, `useFrame` update or store tick used for ambience must not mutate active gameplay counters or failure state.
- Ordinary pedestrian/future-visitor cues in Phase 2 can be simple silhouettes/positions/markers; detailed archetype readability can remain for Phase 4, but Phase 2 must not render every person as an obvious threat.
- Existing service HUD controls may be hidden or inert outside `playing`, but Start Shift must remain available and quick-start must still lead into the current active loop without a forced cinematic delay.

Evidence requirements:

- TDD handoff must include RED evidence naming the failing browser/component/state tests before implementation and GREEN evidence for the same tests after implementation.
- Required command evidence: targeted Playwright street-scene spec or updated `npm run test:browser`, targeted unit/component tests as applicable, plus final `npm run test`, `npm run typecheck`, and `npm run build`.
- Because Phase 2 is browser-visible, QA evidence must include `visual_evidence` in `.runtime/qa-artifacts/kfs-street-scene-references/phase2/` with screenshots for desktop, phone landscape, tablet landscape, portrait rotate gate, first-load pre-shift, short-wait pre-shift, and quick-start state.
- Evidence must explicitly state whether console errors, failed network requests, page scroll/overflow, text overlap, or HUD/action occlusion were observed.
- Render/performance evidence remains required by the coverage matrix: provide `.runtime/performance-artifacts/kfs-street-scene-references/phase2/` trace/Lighthouse/Web Vitals or an approved fallback metric summary for the new animated Three.js/DOM ambience.
- Reviewer handoff must confirm no new active-shift scoring, timer, Serve/shutter, victory or gameOver behavior was introduced in Phase 2.

Forbidden test coupling:

- Do not assert private Three.js mesh internals, exact object counts, random positions, implementation-only helper names, or full-canvas snapshots as the primary contract.
- Do not use tests that pass only because text describes the feature while no visible scene element exists.
- Do not make tests depend on wall-clock randomness; ambient variation must be deterministic, clock-driven in a controllable way, or asserted through stable observable state.

Non-goals for Phase 2:

- No street-to-first-encounter continuity implementation beyond preserving quick-start into the existing loop; Phase 3 owns encounter flow.
- No full archetype/anomaly readability pass, worker identity polish, or detailed almost-ordinary anomaly balance; Phase 4 owns that work.
- No new win/loss conditions, scoring changes, service mechanics, food mechanics, or punishment during pre-shift.
- No full city simulation, pathfinding, separate route, blocking cutscene, or heavy cinematic prelude.
- No plan/readme expansion beyond Phase 2 evidence notes unless QA/reviewer require a factual artifact summary.

#### Phase 2 QA evidence

- QA verdict: `pass`.
- Captured: 2026-05-31 13:35 UTC.
- Required command gates:
  - `npm run test`: pass, 4 test files / 34 tests.
  - `npm run test:browser`: pass, 9 Playwright tests.
  - `npm run typecheck`: pass.
  - `npm run build`: pass with existing Vite chunk-size warning for the main JS chunk.
- Visual evidence status: `pass`.
  - Artifact directory: `.runtime/qa-artifacts/kfs-street-scene-references/phase2/`.
  - Screenshots verified: `desktop-menu.png`, `desktop-menu-short-wait.png`, `phone-landscape-menu.png`, `tablet-landscape-menu.png`, `portrait-gate-menu.png`, `quick-start-playing.png`.
  - Browser probe: `.runtime/qa-artifacts/kfs-street-scene-references/phase2/qa-browser-probe.json`.
  - Findings: desktop, phone landscape and tablet landscape keep KFS kiosk/street identity visible; portrait rotate gate is visible; quick-start enters active HUD; no page overflow observed; no HUD/action overlap observed in quick-start.
  - Console/network: 0 failed requests and 0 HTTP errors. Console contained WebGL `ReadPixels` performance warnings and Chromium font debug messages, with no runtime errors observed.
- Safe pre-shift/no-punishment status: `pass`.
  - Street-scene browser spec confirmed safe observation text remains `mistakes 0 / threat 0 / shift 90`, the active HUD is hidden before start, and ambience changes while still in pre-shift.
- Render performance evidence status: `pass_with_fallback_residual_risk`.
  - Artifact directory: `.runtime/performance-artifacts/kfs-street-scene-references/phase2/`.
  - Evidence files: `phase2-lightweight-performance-note.md`, `qa-render-performance-fallback.json`.
  - Full Lighthouse/Chrome trace was not captured. Fallback used production Vite preview plus Playwright Chromium requestAnimationFrame sampling.
  - Steady-state fallback metrics after warmup: 160 samples, average frame interval 30.21ms, p95 50ms, max 50.1ms, 4 frames over 50ms, heap about 10 MB, 151 DOM nodes.
  - Residual risk: no full trace/waterfall long-task attribution; Vite chunk-size warning remains.

### Phase 3 - Street-to-service continuity and encounter flow

- Status: `completed_qa_reviewer_approved`
- Goal: connect pre-shift observation to the active service loop so the first and subsequent encounters read as arriving from the street to the service window, waiting, being served/repelled, then leaving or being replaced while background street life continues.
- Surfaces: `src/app/store.ts`, `src/widgets/GameScene.tsx`, `src/widgets/Hud.tsx`, `src/shared/sceneVisualState.ts`, `src/features/customers/*`, `src/app/store.test.ts`, browser tests under `tests/browser`.
- TDD acceptance mapping: ATD-06, ATD-07, ATD-08, ATD-10.
- TDD strategy expectation: `requires_tdd: yes`; require failing tests for startShift continuity metadata/state, pre-shift-to-first-encounter handoff, active-shift ambient non-interference, and existing Serve/shutter outcomes remaining unchanged.
- QA checks: browser interaction path from pre-shift to start, first encounter, normal serve, anomaly/shutter decision and encounter departure; verify HUD/orders/timer/actions remain readable while ambience continues; full unit/browser/typecheck/build gate.
- Reviewer focus: no new route or reset boundary between pre-shift and playing; current active customer remains unambiguous; background pedestrians cannot be mistaken for current order target.
- Risks: continuity animation can desync from store state; background characters may compete with active customer; quick-start users may miss context if first encounter appears too abruptly.
- Rollback: fall back to current immediate `startShift` encounter generation and keep street ambience purely background until continuity can be corrected.

#### Phase 3 TDD Strategy Gate

- Gate status: `TDD_PHASE_READY`.
- Strategy owner: `tdd-expert`.
- Applicability: `required`; Phase 3 changes observable store, scene and browser interaction behavior for the active service loop.
- Acceptance cases: ATD-06, ATD-07, ATD-08, ATD-10.
- Public interfaces / test entry points: `useGameStore` actions and state, `generateCustomer`, `getSceneVisualState` / `getStreetVisualState`, browser route `/`, HUD buttons and stable `data-testid` markers exposed by `Hud` and `GameScene`.
- Developer rule: add or update the Phase 3 tests first, capture RED failures proving the current immediate encounter flow lacks street-to-service continuity, then implement the smallest behavior/rendering changes needed to make those same tests green.

Expected RED tests:

| Test surface | RED expectation before implementation | Acceptance mapping |
| --- | --- | --- |
| `src/app/store.test.ts` | `startShift` preserves or derives continuity state for the first active customer from pre-shift street flow: the active customer has street metadata indicating approach/window arrival/waiting instead of appearing as an unrelated encounter. | ATD-06, ATD-10 |
| `src/app/store.test.ts` | Quick start from a fresh menu state still starts the 90-second shift and first normal customer, while also exposing a deterministic street-to-window handoff state/message without mutating score, mistakes or threat. | ATD-06, ATD-10 |
| `src/app/store.test.ts` | Normal serve, anomaly serve, anomaly shutter repel, timeout replacement and terminal cleanup advance or clear encounter-flow state consistently: current encounter becomes leaving/repelled/served/expired and the next encounter is sourced as an arriving street visitor when the loop continues. | ATD-08, ATD-10 |
| `src/shared/sceneVisualState.test.ts` | Active `playing` visual state maps the current customer street metadata into an unambiguous active-window visitor plus background pedestrians, with ambient descriptors still present and background visitors not flagged as the current order target. | ATD-07, ATD-08 |
| `src/shared/sceneVisualState.test.ts` | Served/repelled/leaving/replaced encounter states remain visually distinguishable from waiting/current-customer state, including an anomaly departure/repel variant when the shutter succeeds. | ATD-08, ATD-10 |
| `src/features/customers/generator.test.ts` | Subsequent deterministic customers remain reachable with ordinary/anomalous street metadata suitable for arrival/wait/leave flow; anomaly cue metadata remains attached to the active visitor instead of leaking to all background pedestrians. | ATD-08, ATD-10 |
| Browser street/continuity spec under `tests/browser` | From first load, Start Shift produces browser-observable continuity markers: pre-shift street is visible, Start Shift enters active HUD, current customer is marked as arriving/at-window/waiting from the street, and background ambience remains visible. | ATD-06, ATD-07 |
| Browser street/continuity spec under `tests/browser` | After serving a normal customer or holding shutter long enough to repel an anomaly in a controlled/seeded scenario, the browser shows departure/replacement flow while HUD/order/action controls stay readable and the active customer remains distinct from pedestrians. | ATD-07, ATD-08, ATD-10 |
| Existing HUD/browser specs | Portrait rotate gate, phone/tablet landscape HUD, Serve vs Hold Shutter spacing/progress, pause/resume/reset and no-scroll expectations still pass after active-shift street continuity additions. | ATD-07, ATD-10 |

Behavior surfaces to pin:

- `startShift` must not create a route, cinematic reset or disconnected scene boundary. It should transition from `menu` to `playing` through the same page, same canvas and same KFS window context.
- The first active encounter must be traceable to the street flow even when the player starts immediately. This can be represented through deterministic continuity metadata, visual-state handoff, browser markers, movement phase or equivalent observable state.
- Subsequent encounter changes must read as arrival, waiting, served/repelled/left/expired, then replacement. The active customer/order target must stay singular and unambiguous.
- Ambient street life must continue during `playing`, but remain non-punitive and secondary to HUD, order, timer, Serve and Hold Shutter readability.
- Existing service mechanics stay intact: score, mistakes, threat, shift timer, customer timer, cooking stations, Serve result, shutter hold and terminal cleanup must keep their current rules unless explicitly covered by this continuity behavior.

Browser interaction evidence requirements:

- RED evidence must include at least one browser test that fails because active service lacks observable street-to-window continuity, not because of brittle pixel snapshots or missing descriptive copy.
- GREEN evidence must include the same browser interaction path after implementation: first-load pre-shift, quick Start Shift, first active customer at/arriving to the window, active ambience continuing, normal serve departure/replacement, and anomaly/shutter departure if deterministic setup is available.
- QA visual evidence for Phase 3 must include desktop, phone landscape, tablet landscape and portrait gate screenshots under `.runtime/qa-artifacts/kfs-street-scene-references/phase3/`.
- Browser evidence must report console errors, failed requests, page overflow, text overlap, HUD/action occlusion, and whether background pedestrians were visually confused with the active customer.
- Render/performance evidence remains required if Phase 3 adds new animated meshes, loops or effects beyond reusing Phase 2 ambience.

Regression checks:

- Required targeted RED/GREEN commands: relevant `vitest` tests for store/shared/customers and relevant Playwright street/continuity spec.
- Required final gate commands: `npm run test`, `npm run test:browser`, `npm run typecheck`, `npm run build`.
- Existing store tests for deterministic first normal customer, normal serve, wrong serve, anomaly serve, shutter repel, late anomaly timeout, pause freeze, terminal cleanup and reset must remain green.
- Existing Phase 2 street browser tests and existing mobile HUD browser tests must remain green, including quick-start usability and no-scroll/touch-target expectations.
- Dirty baseline and missing `origin/dev` are accepted baseline deviations for this phase and must be recorded if observed, but they do not block this TDD strategy gate by themselves.

Forbidden test coupling:

- Do not assert private Three.js mesh counts, exact animation coordinates, frame-perfect timing, full-canvas screenshots as the primary contract, or implementation-only helper names.
- Do not make tests pass through visible explanatory text while the scene/interaction itself lacks continuity.
- Do not rely on wall-clock randomness for arrival/replacement assertions; use deterministic generation, controlled store state, stable browser markers or observable state transitions.
- Do not mock store internals in a way that bypasses the public action path for `startShift`, `serveCustomer`, shutter hold or encounter replacement.

Non-goals for Phase 3:

- No new food/service mechanics, scoring rules, win/loss conditions, campaign content, route, blocking cutscene or full city simulation.
- No Phase 4 readability polish for every archetype, worker identity pass or anomaly balance beyond what is necessary to keep active encounter continuity understandable.
- No redesign of HUD layout except targeted protection against ambience/customer-flow occlusion.
- No literal reference-image copying and no expansion of the anomaly taxonomy unless required by an already approved acceptance case.
- No plan/readme expansion beyond Phase 3 strategy/evidence notes unless QA/reviewer require a factual artifact summary.

#### Phase 3 QA/reviewer evidence

- QA verdict: `pass`.
- Reviewer status: approved per Phase 5 handoff context.
- Visual evidence status: `pass`.
  - Artifact directory: `.runtime/qa-artifacts/kfs-street-scene-references/phase3/`.
  - Evidence file: `.runtime/qa-artifacts/kfs-street-scene-references/phase3/visual-evidence.json`.
  - Screenshots verified: `desktop-pre-shift.png`, `desktop-active-first-encounter.png`, `desktop-normal-serve-replacement.png`, `desktop-anomaly-shutter-repelled.png`, `phone-landscape-active.png`, `tablet-landscape-active.png`, `portrait-gate.png`.
  - Findings: first active encounter reads as sourced from the pre-shift street; active ambience continues after start; normal serve and anomaly shutter paths expose leaving/replacement markers; active encounter marker remains separate from street ambience.
  - Responsive findings: no horizontal or vertical overflow in inspected desktop, phone landscape and tablet landscape active states; portrait rotate gate visible; HUD/order/action controls visible.
  - Console/network: no failed requests; WebGL `ReadPixels` performance warnings observed during screenshot capture, with no runtime errors recorded.
- Regression status: existing service loop rules remained in scope as unchanged: cooking, Serve, shutter, timer, mistakes, threat and terminal cleanup.
- Known deviation carried forward: dirty workspace baseline and missing `origin/dev` remain accepted baseline deviations and do not block this phase.

### Phase 4 - Visitor archetypes, worker identity and anomaly cue readability

- Status: `completed_qa_reviewer_approved`
- Goal: make ordinary archetypes, KFS worker identity and almost-ordinary anomalous visitors readable in the approved low-poly/horror style, while preserving the balance between fair observation and uncertainty.
- Surfaces: `src/features/customers/*`, `src/shared/sceneVisualState.ts`, `src/widgets/GameScene.tsx`, `src/widgets/Hud.tsx`, `src/styles.css`, `src/shared/sceneVisualState.test.ts`, `src/features/customers/generator.test.ts`, browser visual specs.
- TDD acceptance mapping: ATD-03, ATD-04, ATD-05, ATD-09, ATD-10.
- TDD strategy expectation: `requires_tdd: yes`; require tests for archetype/cue reachability and visual-state mapping, plus browser evidence rather than relying on unit tests for readability.
- QA checks: screenshot matrix for ordinary pedestrian/future visitor/current customer/anomaly states; mobile landscape and tablet landscape readability; confirm worker/KFS identity visible in pre-shift or service context; confirm ordinary customers do not look universally threatening and anomalies are not blatant monsters.
- Reviewer focus: reference alignment without literal over-copying, anomaly cue balance, no HUD overlap, no new fail conditions, and no unrelated food/service expansion.
- Risks: anomaly cues too subtle or too obvious; ordinary archetypes may become decorative labels instead of readable silhouettes/behavior; worker identity can disappear behind street focus.
- Rollback: revert specific archetype/cue rendering additions to the prior customer body/visual cue set while preserving stable gameplay state.

#### Phase 4 TDD Strategy Gate

- Gate status: `TDD_PHASE_READY`.
- Strategy owner: `tdd-expert`.
- Applicability: `required`; Phase 4 changes browser-visible readability and the domain/visual contract for ordinary archetypes, worker identity and almost-ordinary anomaly cues.
- Acceptance cases: ATD-03, ATD-04, ATD-05, ATD-09, ATD-10.
- Public interfaces / test entry points: `generateCustomer`, `getSceneVisualState` / `getStreetVisualState`, browser route `/`, stable DOM markers exposed by `Hud`, canvas-visible states rendered by `GameScene`, and CSS/layout surfaces used to keep cues readable on target viewports.
- Developer rule: add or update Phase 4 tests first, capture RED failures proving the current implementation cannot demonstrate full archetype/cue reachability and visual readability, then implement the smallest metadata/rendering/style changes needed to make the same tests green.

Phase 4 evidence-fix TDD status:

- tdd_status: `GREEN_AFTER_RED`
- RED evidence, 2026-05-31: `npx playwright test tests/browser/phase4-readability.spec.ts --project=chromium` failed 4 active-current-customer cases because `hud-topbar` stayed hidden after the new tests attempted to drive normal, `shadowEyes`, `longArms` and `staticSmile` real active customer states.
- GREEN evidence, 2026-05-31: same command passed 7/7 after adding an opt-in Phase 4 browser debug hook and HUD marker backed by `currentCustomer` / `getSceneVisualState`.
- Active screenshot matrix added under `.runtime/qa-artifacts/kfs-street-scene-references/phase4/`: `active-normal-current-customer.png`, `active-anomaly-shadowEyes.png`, `active-anomaly-longArms.png`, `active-anomaly-staticSmile.png`.
- Controlled browser path: `/?phase4-readability=1`; it exposes `window.__kfsPhase4SetActiveCustomer` only for the Phase 4 readability fixture path and does not change scoring, mistake, threat, timer, Serve or shutter rules.

Expected RED tests:

| Test surface | RED expectation before implementation | Acceptance mapping |
| --- | --- | --- |
| `src/features/customers/generator.test.ts` | Deterministic generation reaches every approved ordinary archetype (`student`, `officeWorker`, `courier`, `shopper`, `olderPerson`, `tiredParent`, `nightWorker`, `teenager`) with stable movement/future-visitor metadata and no render-time randomness. | ATD-03, ATD-05 |
| `src/features/customers/generator.test.ts` | Forced or sequence-controlled anomalous visitors expose every approved anomaly cue (`shadowEyes`, `longArms`, `staticSmile`) as compact "almost ordinary but wrong" descriptors attached only to the relevant visitor/customer. | ATD-09, ATD-10 |
| `src/shared/sceneVisualState.test.ts` | Visual state maps all approved ordinary archetypes to renderable ordinary/non-threatening presentation semantics, not only the Phase 2 subset currently present in pre-shift pedestrians. | ATD-03 |
| `src/shared/sceneVisualState.test.ts` | Worker identity remains explicit in the visual contract: dark olive/yellow uniform, badge/work accessory, tired night-shift tone and kiosk-window service context are exposed for pre-shift and active service states. | ATD-04 |
| `src/shared/sceneVisualState.test.ts` | Active normal and anomalous visitors keep the same street population shape, while anomalies expose at least one visible cue descriptor and normals expose no suspicious cue. | ATD-09, ATD-10 |
| Browser visual/readability spec under `tests/browser` | Pre-shift shows a readable ordinary archetype matrix or deterministic sampled states with KFS worker/service identity still visible and Start Shift still available. | ATD-03, ATD-04, ATD-05 |
| Browser visual/readability spec under `tests/browser` | Active current-customer states for normal, `shadowEyes`, `longArms` and `staticSmile` are browser-observable without relying only on explanatory text; screenshots show anomalies are suspicious but not blatant unrelated monsters. | ATD-09, ATD-10 |
| Existing street/HUD browser specs | Phase 2 pre-shift ambience, Phase 3 street-to-window continuity, phone/tablet landscape HUD, portrait rotate gate, Serve and Hold Shutter remain usable with no text overlap, page scroll or action occlusion. | ATD-05, ATD-10 |

Readability evidence requirements:

- Unit tests prove reachability and stable visual-state mapping; they do not by themselves prove readability. Phase 4 QA must include browser visual evidence under `.runtime/qa-artifacts/kfs-street-scene-references/phase4/`.
- Required screenshot matrix: desktop pre-shift, phone landscape pre-shift, tablet landscape pre-shift, active normal current customer, each active anomaly kind, worker/KFS identity context, and a crowded ordinary/future-visitor state where background pedestrians do not compete with the active visitor.
- Browser evidence must record the target URL, viewport sizes, seeded/control path used for each state, artifact paths, console errors, failed network requests, page overflow, text overlap, HUD/action occlusion and whether cues were readable without opening developer tools.
- Visual review must explicitly answer: ordinary archetypes are distinguishable enough for the low-poly style; ordinary people do not all look threatening; worker/KFS identity remains visible; each anomaly cue is noticeable but still close to ordinary human presentation; Serve/shutter decisions remain traceable without becoming guaranteed.
- If deterministic browser setup cannot force every anomaly/archetype through public controls, developer must add a stable test-only or public debug-safe path only with architect approval; otherwise the gate returns to architect as insufficient test surface.
- Render/performance evidence remains required if Phase 4 adds new meshes, materials, animation loops, postprocessing or heavy CSS effects beyond recoloring/reusing existing assets.

Regression gates:

- Required targeted RED/GREEN commands: relevant `vitest` tests for customers/shared visual state and the Phase 4 browser visual/readability spec.
- Required final gate commands: `npm run test`, `npm run test:browser`, `npm run typecheck`, `npm run build`.
- Existing Phase 1 generator/visual-state/store coverage, Phase 2 street-scene browser coverage, Phase 3 continuity browser coverage and mobile HUD specs must stay green.
- Existing gameplay rules must remain unchanged: no new scoring, mistake, threat, timer, win/loss, food/service, Serve or shutter behavior unless already covered by approved Phase 4 readability scope.
- Dirty baseline, missing `origin/dev`, or pre-existing untracked artifacts may be recorded as baseline deviations, but they do not waive RED-first evidence, browser screenshots or final command evidence.

Forbidden test coupling:

- Do not assert private Three.js mesh counts, exact animation coordinates, frame-perfect timing, implementation-only helper names or full-canvas screenshots as the primary contract.
- Do not make tests pass solely through labels, notes or HUD copy while the actual visible figure/cue remains unreadable.
- Do not depend on `Math.random`, wall-clock-only variation or uncontrolled customer order for archetype/anomaly coverage; use deterministic generation, controlled state, stable route setup or visible markers.
- Do not turn visual evidence into a single happy-path screenshot; Phase 4 requires ordinary, worker identity, normal active customer and every anomaly cue state.

Non-goals for Phase 4:

- No new anomaly taxonomy, monster forms, fail conditions, scoring/timer changes, food/service mechanics, campaign content, route, blocking cutscene, full city simulation or pathfinding.
- No redesign of the HUD, order panel or action dock beyond targeted protection against overlap with readability additions.
- No literal reference-image copying; references guide silhouette, palette and cue balance only.
- No final cross-phase docs/performance/expert-release closure; Phase 5 owns final readiness aggregation.

#### Phase 4 QA/reviewer evidence

- QA verdict: `pass`.
- Reviewer / feature-readiness status: approved per Phase 5 handoff context.
- TDD/readability evidence: `GREEN_AFTER_RED`.
  - RED evidence, 2026-05-31: `npx playwright test tests/browser/phase4-readability.spec.ts --project=chromium` failed 4 active current-customer cases before the Phase 4 debug hook/HUD marker was added.
  - GREEN evidence, 2026-05-31: same targeted command passed 7/7 after the opt-in fixture path exposed real active current-customer states.
  - Controlled fixture path: `/?phase4-readability=1`, with `window.__kfsPhase4SetActiveCustomer` limited to the readability fixture path.
- Visual evidence status: `pass`.
  - Artifact directory: `.runtime/qa-artifacts/kfs-street-scene-references/phase4/`.
  - Evidence file: `.runtime/qa-artifacts/kfs-street-scene-references/phase4/phase4-browser-probe.json`.
  - Screenshots verified: `desktop-pre-shift-archetypes-worker-samples.png`, `phone-landscape-pre-shift-readability.png`, `tablet-landscape-pre-shift-readability.png`, `portrait-gate-worker-context.png`, `active-normal-current-customer.png`, `active-anomaly-shadowEyes.png`, `active-anomaly-longArms.png`, `active-anomaly-staticSmile.png`, `active-anomaly-cue-samples.png`.
  - Findings: ordinary archetype samples, worker/KFS identity context, normal active customer, and each approved anomaly cue are browser-observable; screenshots report no overflow and no failed requests.
- Browser stability deviation: default parallel Playwright run previously showed browser target crashes/timeouts in this environment. The suite is now configured with `workers: 1` in `playwright.config.ts`; serial full-suite evidence passed 18/18 per probe residual-risk note.
- Render/performance evidence status: `pass_with_residual_risk`.
  - Artifact directory: `.runtime/performance-artifacts/kfs-street-scene-references/phase4/`.
  - Evidence files: `phase4-active-current-customer-render-summary.json`, `phase4-active-current-customer-render-trace.json`.
  - Metrics: 119 rAF samples while cycling active customer readability states; average frame interval 35.15ms, approximate 28.4 FPS, p95 50.1ms, max 50.1ms.
  - Residual risk: lab trace is acceptable for handoff but shows limited headroom for the animated WebGL street scene; Vite large chunk warning remains.

### Phase 5 - Final QA, performance, expert review and docs handoff

- Status: `docs_handoff_complete`
- Goal: close all important-task gates, gather browser/visual/render-performance evidence, verify every ATD case and update user-facing docs/plan evidence without changing approved business scope.
- Surfaces: `README.md` if behavior documentation changes, `docs/plans/kfs-street-scene-references.md`, `.runtime/qa-artifacts/kfs-street-scene-references/*`, `.runtime/performance-artifacts/kfs-street-scene-references/*`, `package.json` scripts, all changed source/test surfaces from prior phases.
- TDD acceptance mapping: ATD-01 through ATD-10.
- TDD strategy expectation: `requires_tdd: yes`; TDD expert verifies evidence traceability for all required behavior cases and approves/not-applicable gates per phase before QA final readiness.
- QA checks: `npm run test`, `npm run test:browser`, `npm run typecheck`, `npm run build`; final visual evidence for desktop/phone landscape/tablet landscape/portrait gate; render performance evidence for Three.js street additions; matrix status summary with artifact paths.
- Reviewer focus: final diff matches scope, no unresolved matrix rows, no regressions to completed MVP, docs/readme truth matches actual behavior, residual risks are explicit.
- Risks: visual evidence may pass one viewport but fail small landscape; performance evidence may show long tasks from added effects; feature expert may request readability rebalance.
- Rollback: revert the last behavior/visual phase that introduced blocking QA or expert findings, keep prior completed phases only if their matrix rows remain independently passing.

#### Phase 5 docs handoff evidence

- Docs verdict: `pass`.
- README updated to reflect the shipped pre-shift street scene, living street ambience, street-to-service continuity, ordinary archetypes, worker/KFS identity through the scene, and almost-ordinary anomaly cues.
- Plan matrix updated from pending to passed for Phases 3-5 based on Phase 5 handoff context that Phases 1-4 were implemented and approved through QA/reviewer.
- Evidence directories summarized:
  - Phase 2 visual: `.runtime/qa-artifacts/kfs-street-scene-references/phase2/`.
  - Phase 2 performance fallback: `.runtime/performance-artifacts/kfs-street-scene-references/phase2/`.
  - Phase 3 visual/interaction: `.runtime/qa-artifacts/kfs-street-scene-references/phase3/`.
  - Phase 4 readability visual: `.runtime/qa-artifacts/kfs-street-scene-references/phase4/`.
  - Phase 4 render trace: `.runtime/performance-artifacts/kfs-street-scene-references/phase4/`.
- Known deviations carried into final handoff:
  - Dirty workspace baseline and missing `origin/dev` were waived as pipeline/baseline deviations.
  - Playwright is configured with `workers: 1` for WebGL/R3F stability after parallel target crashes/timeouts.
  - Build accepts the existing Vite large chunk-size warning.
  - WebGL `ReadPixels` screenshot-capture warnings are non-blocking.
  - Render performance remains a residual risk: Phase 2 used fallback rAF sampling instead of full Lighthouse/trace, and Phase 4 trace shows about 28.4 FPS in the active readability fixture.
- Tests not rerun by docs role; this handoff used existing QA/reviewer evidence and artifact files only.
