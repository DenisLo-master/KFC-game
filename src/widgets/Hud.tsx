import { useEffect, useMemo, useState, type CSSProperties, type PointerEvent } from 'react';
import { setPhase4ReadabilityActiveCustomer, useGameStore } from '../app/store';
import type { BurgerIngredient, DrinkFlavor, StationId } from '../features/cooking/types';
import { PROTECTION_HOLD_SECONDS } from '../features/difficulty/config';
import type { AnomalyKind, Customer } from '../features/customers/types';
import { summarizePrepared } from '../features/orders/types';
import { getAudioEnabled, installAudioUnlock, playGameSound, setAudioEnabled, type GameSound } from '../shared/audio';
import { formatTime } from '../shared/format';
import { getSceneVisualState, type StreetPedestrianVisualState } from '../shared/sceneVisualState';

const drinkOptions: DrinkFlavor[] = ['lemonade', 'soda', 'smoothie', 'juice'];
const burgerIngredients: BurgerIngredient[] = ['bun', 'patty', 'lettuce', 'tomato', 'sauce'];
const stationIds: StationId[] = ['fryer', 'grill', 'oven', 'drink'];

function ingredientsLabel(ingredients?: BurgerIngredient[]) {
  return ingredients?.length ? ` (${ingredients.join(', ')})` : '';
}

function stationButtonLabel(stationId: StationId, product?: 'nuggets' | 'strips') {
  const station = useGameStore.getState().stations[stationId];
  if (station.status === 'ready') return `Collect ${station.product}`;
  if (station.status === 'cooking') return `${station.product} ${formatTime(station.remaining)}`;
  if (stationId === 'oven') return `Oven ${product}`;
  if (stationId === 'grill') return 'Grill Burger';
  if (stationId === 'drink') return 'Drink';
  return 'Fryer';
}

function stationForOrderLine(kind: string): StationId {
  if (kind === 'fries') return 'fryer';
  if (kind === 'burger') return 'grill';
  if (kind === 'drink') return 'drink';
  return 'oven';
}

const archetypeLabels: Record<StreetPedestrianVisualState['archetype'], string> = {
  student: 'student',
  officeWorker: 'office worker',
  courier: 'courier',
  shopper: 'shopper',
  olderPerson: 'older person',
  tiredParent: 'tired parent',
  nightWorker: 'night worker',
  teenager: 'teenager',
};

const markerLabels: Record<StreetPedestrianVisualState['presentation']['primaryMarker'], string> = {
  backpack: 'backpack',
  briefcase: 'briefcase',
  deliveryBox: 'delivery box',
  shoppingBag: 'shopping bag',
  walkingCane: 'cane',
  childHand: 'child',
  workCap: 'work cap',
  hoodie: 'hoodie',
};

const cueLabels: Record<'none' | 'unblinkingDarkEyes' | 'tooLowSleeves' | 'fixedSmile', string> = {
  none: 'ordinary',
  unblinkingDarkEyes: 'unblinking dark eyes',
  tooLowSleeves: 'too-low sleeves',
  fixedSmile: 'fixed smile',
};

const sampleCueLabels: Record<AnomalyKind, string> = {
  normal: 'normal',
  shadowEyes: 'shadow eyes',
  longArms: 'long arms',
  staticSmile: 'static smile',
};

declare global {
  interface Window {
    __kfsPhase4SetActiveCustomer?: typeof setPhase4ReadabilityActiveCustomer;
  }
}

function VisitorReadabilitySamples() {
  const samples: AnomalyKind[] = ['normal', 'shadowEyes', 'longArms', 'staticSmile'];

  return (
    <div className="visitor-readability-samples" data-testid="visitor-readability-samples" aria-label="active visitor readability samples">
      {samples.map((kind) => {
        const cue =
          kind === 'normal'
            ? null
            : {
                kind,
                descriptor: kind === 'shadowEyes'
                  ? 'eyes stay black when the kiosk sign catches the face'
                  : kind === 'longArms'
                    ? 'sleeves hang too low and elbows bend after the hands move'
                    : 'smile stays fixed while the rest of the face relaxes',
              };
        const state = getSceneVisualState({
          anomalyKind: kind,
          shutterClosed: false,
          holdProgress: 0,
          phase: 'playing',
          customerStreet: {
            archetype: kind === 'longArms' ? 'courier' : kind === 'staticSmile' ? 'nightWorker' : 'shopper',
            movementIntent: 'waiting',
            futureVisitor: true,
            anomalyCue: cue,
            source: 'streetQueue',
            encounterStage: 'atWindow',
          },
        });
        const presentation = state.street.activeVisitor?.presentation;

        return (
          <div
            key={kind}
            className={`visitor-sample ${kind}`}
            data-testid={`sample-${kind}`}
            aria-label={`${sampleCueLabels[kind]} ${presentation ? cueLabels[presentation.cueMarker] : 'ordinary'}`}
          >
            <span className="sample-figure" aria-hidden="true">
              <span className="sample-head" />
              <span className="sample-eye left-eye" />
              <span className="sample-eye right-eye" />
              <span className="sample-mouth" />
              <span className="sample-arm left-arm" />
              <span className="sample-arm right-arm" />
            </span>
            <strong>{sampleCueLabels[kind]}</strong>
            <span>{presentation ? cueLabels[presentation.cueMarker] : 'ordinary'}</span>
          </div>
        );
      })}
    </div>
  );
}

function PreShiftStreetStatus() {
  const phase = useGameStore((state) => state.phase);
  const mistakes = useGameStore((state) => state.mistakes);
  const threat = useGameStore((state) => state.threat);
  const shiftTimer = useGameStore((state) => state.shiftTimer);
  const street = useGameStore((state) => state.preShiftStreet);
  const [pulse, setPulse] = useState(0);
  const ambienceLabel = useMemo(() => street.ambience.join(', '), [street.ambience]);
  const pedestrianLabel = useMemo(
    () =>
      street.pedestrians
        .map((pedestrian) => `${pedestrian.futureVisitor ? 'future visitor' : 'passerby'} ${pedestrian.archetype} ${pedestrian.movementIntent}`)
        .join(', '),
    [street.pedestrians],
  );

  useEffect(() => {
    if (phase !== 'menu') return;
    const id = window.setInterval(() => setPulse((value) => (value + 1) % 4), 800);
    return () => window.clearInterval(id);
  }, [phase]);

  if (phase !== 'menu') return null;

  return (
    <section className="pre-shift-street" data-testid="pre-shift-street" aria-label="KFS pre-shift street observation">
      <div className="pre-shift-visual" aria-hidden="true">
        <div className="urban-block block-left">
          <span />
          <span />
          <span />
        </div>
        <div className="urban-block block-right">
          <span />
          <span />
          <span />
        </div>
        <div className="street-lamp" />
        <div className="kiosk-visual">
          <div className="kiosk-sign">KFS</div>
          <div className="kiosk-window" />
          <div className="worker-badge" />
        </div>
        <div className="light-island" />
        <div className="wet-road">
          <span />
          <span />
          <span />
        </div>
        <div className="headlight-sweep" />
        <div className="steam steam-one" />
        <div className="steam steam-two" />
        <div className="trash trash-one" />
        <div className="trash trash-two" />
        <div className="pedestrian student" />
        <div className="pedestrian courier" />
        <div className="pedestrian office" />
      </div>
      <div className="street-chip-row">
        <div className="street-chip kiosk-chip" data-testid="street-kiosk-anchor" aria-label="KFS kiosk island of light">
          <strong>KFS kiosk</strong>
          <span>night window</span>
        </div>
        <div
          className="street-chip ambient-chip"
          data-testid="street-ambient-layer"
          data-ambient-pulse={pulse}
          aria-label={`wet asphalt ambience with ${ambienceLabel}`}
        >
          <strong>wet asphalt</strong>
          <span>{pulse % 2 === 0 ? 'steam and sign glow' : 'headlights and windows'}</span>
        </div>
        <div className="street-chip pedestrian-chip" data-testid="street-pedestrian-flow" aria-label={pedestrianLabel}>
          <strong>future visitor</strong>
          <span>ordinary pedestrians</span>
        </div>
        <div className="street-chip safe-chip" data-testid="pre-shift-safety">
          <strong>safe observation</strong>
          <span>
            mistakes {mistakes} / threat {Math.round(threat)} / shift {Math.round(shiftTimer)}
          </span>
        </div>
      </div>
      <div className="worker-identity-context" data-testid="worker-identity-context">
        <strong>KFS worker</strong>
        <span>olive-yellow uniform</span>
        <span>apron sleeves</span>
        <span>badge</span>
        <span>shift checklist</span>
        <span>spatula</span>
      </div>
      <div className="ordinary-archetype-matrix" data-testid="ordinary-archetype-matrix" aria-label="ordinary street archetypes">
        {street.pedestrians.map((pedestrian) => (
          <div
            key={pedestrian.archetype}
            className={`archetype-tile archetype-${pedestrian.archetype}`}
            aria-label={`${archetypeLabels[pedestrian.archetype]} ${markerLabels[pedestrian.presentation.primaryMarker]} ordinary`}
          >
            <span className="archetype-icon" aria-hidden="true" />
            <strong>{archetypeLabels[pedestrian.archetype]}</strong>
            <span>{markerLabels[pedestrian.presentation.primaryMarker]} / ordinary</span>
          </div>
        ))}
      </div>
      <VisitorReadabilitySamples />
    </section>
  );
}

function Overlay() {
  const phase = useGameStore((state) => state.phase);
  const startShift = useGameStore((state) => state.startShift);
  const resume = useGameStore((state) => state.resume);
  const resetToMenu = useGameStore((state) => state.resetToMenu);
  const score = useGameStore((state) => state.score);
  const served = useGameStore((state) => state.served);
  const repelled = useGameStore((state) => state.repelled);
  const mistakes = useGameStore((state) => state.mistakes);
  const gameOverReason = useGameStore((state) => state.gameOverReason);
  const [menuTab, setMenuTab] = useState<'start' | 'how' | 'settings'>('start');
  const [audioEnabled, setAudioEnabledState] = useState(() => getAudioEnabled());

  if (phase === 'playing') return null;

  const title =
    phase === 'victory' ? 'Shift Complete' : phase === 'gameOver' ? 'Game Over' : phase === 'paused' ? 'Paused' : 'KFS Night Shift';
  const action = phase === 'paused' ? resume : startShift;
  const actionLabel = phase === 'paused' ? 'Resume' : phase === 'menu' ? 'Start Shift' : 'Restart';

  return (
    <div className="overlay">
      <div className="overlay-panel">
        <h1>{title}</h1>
        {phase === 'gameOver' && <p>{gameOverReason ?? 'Night shift failed.'}</p>}
        {phase !== 'menu' && (
          <dl className="final-stats">
            <div>
              <dt>Score</dt>
              <dd>{score}</dd>
            </div>
            <div>
              <dt>Served</dt>
              <dd>{served}</dd>
            </div>
            <div>
              <dt>Repelled</dt>
              <dd>{repelled}</dd>
            </div>
            <div>
              <dt>Mistakes</dt>
              <dd>{mistakes}</dd>
            </div>
          </dl>
        )}
        {phase === 'menu' && (
          <>
            <div className="menu-tabs" role="tablist" aria-label="Main menu">
              <button type="button" className={menuTab === 'start' ? 'active' : 'secondary'} onClick={() => setMenuTab('start')}>
                Start
              </button>
              <button type="button" className={menuTab === 'how' ? 'active' : 'secondary'} onClick={() => setMenuTab('how')}>
                How to play
              </button>
              <button type="button" className={menuTab === 'settings' ? 'active' : 'secondary'} onClick={() => setMenuTab('settings')}>
                Settings
              </button>
            </div>
            {menuTab === 'start' && <p>The KFS window is lit over wet asphalt. Open service when the next visitor reaches the glass.</p>}
            {menuTab === 'how' && (
              <ul className="how-list">
                <li>Esc pauses or resumes the shift.</li>
                <li>Tab pins the expanded ticket and anomaly notes.</li>
                <li>E runs the quick action: collect ready food, serve a tray, or start the next obvious station.</li>
                <li>Touch players can use the Quick button and Hold Shutter button in the bottom dock.</li>
              </ul>
            )}
            {menuTab === 'settings' && (
              <div className="settings-list">
                <label>
                  <input
                    type="checkbox"
                    data-testid="audio-toggle"
                    checked={audioEnabled}
                    onChange={(event) => {
                      const enabled = event.currentTarget.checked;
                      setAudioEnabledState(enabled);
                      setAudioEnabled(enabled);
                    }}
                  />{' '}
                  Audio cues
                </label>
                <label>
                  <input type="checkbox" defaultChecked /> Reference quality
                </label>
              </div>
            )}
          </>
        )}
        <div className="overlay-actions">
          <button type="button" onClick={action}>
            {actionLabel}
          </button>
          {phase !== 'menu' && (
            <button type="button" className="secondary" onClick={resetToMenu}>
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function sourceLabel(source: 'preShiftStreet' | 'streetQueue' | null) {
  if (source === 'preShiftStreet') return 'pre-shift street';
  if (source === 'streetQueue') return 'street queue';
  return 'street';
}

function stageLabel(stage: string | null) {
  if (stage === 'atWindow') return 'at window';
  if (stage === 'servedLeaving') return 'served leaving';
  if (stage === 'repelledLeaving') return 'repelled leaving';
  if (stage === 'expiredLeaving') return 'expired leaving';
  if (stage === 'approaching') return 'approaching';
  if (stage === 'waiting') return 'waiting';
  if (stage === 'replaced') return 'replaced';
  return 'observing';
}

function ActiveEncounterFlowStatus() {
  const phase = useGameStore((state) => state.phase);
  const encounterFlow = useGameStore((state) => state.encounterFlow);
  const street = useGameStore((state) => state.preShiftStreet);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    if (phase !== 'playing') return;
    const id = window.setInterval(() => setPulse((value) => (value + 1) % 4), 800);
    return () => window.clearInterval(id);
  }, [phase]);

  if (phase !== 'playing') return null;

  const departure = encounterFlow.lastDeparture ? stageLabel(encounterFlow.lastDeparture.stage) : null;
  const replacement = encounterFlow.lastDeparture ? `replacement ${stageLabel(encounterFlow.activeStage)}` : null;

  return (
    <div className="encounter-flow-strip">
      <span data-testid="active-encounter-flow">
        {sourceLabel(encounterFlow.activeSource)} / {stageLabel(encounterFlow.activeStage)}
        {departure ? ` / ${departure}` : ''}
        {replacement ? ` / ${replacement}` : ''}
      </span>
      <span
        data-testid="active-street-ambience"
        data-ambient-pulse={pulse}
        aria-label={`active street ambience ${street.ambience.join(', ')}`}
      >
        street ambience {pulse % 2 === 0 ? 'steam' : 'headlights'}
      </span>
    </div>
  );
}

function ActiveCurrentCustomerReadability({ customer }: { customer: Customer }) {
  const state = getSceneVisualState({
    anomalyKind: customer.anomalyKind,
    shutterClosed: false,
    holdProgress: 0,
    phase: 'playing',
    customerStreet: customer.street,
  });
  const activeVisitor = state.street.activeVisitor;
  const cueMarker = activeVisitor?.presentation.cueMarker ?? 'none';

  return (
    <div
      className="active-current-customer-readability"
      data-testid="active-current-customer-readability"
      data-anomaly-kind={customer.anomalyKind}
      data-cue-marker={cueMarker}
      data-current-order-target={activeVisitor?.currentOrderTarget ? 'true' : 'false'}
      aria-label={`current customer ${sampleCueLabels[customer.anomalyKind]} ${cueLabels[cueMarker]}`}
    >
      <strong>Current customer</strong>
      <span>{sampleCueLabels[customer.anomalyKind]}</span>
      <span>{cueLabels[cueMarker]}</span>
    </div>
  );
}

function ActiveSceneReadabilityLayer({ customer }: { customer: Customer | null }) {
  if (!customer) return null;

  const state = getSceneVisualState({
    anomalyKind: customer.anomalyKind,
    shutterClosed: false,
    holdProgress: 0,
    phase: 'playing',
    customerStreet: customer.street,
  });
  const cueMarker = state.street.activeVisitor?.presentation.cueMarker ?? 'none';

  return (
    <div
      className={`active-scene-readability-layer cue-${customer.anomalyKind}`}
      data-testid="active-scene-readability-layer"
      data-anomaly-kind={customer.anomalyKind}
      data-cue-marker={cueMarker}
      data-current-order-target={state.street.activeVisitor?.currentOrderTarget ? 'true' : 'false'}
      aria-label={`scene current customer ${sampleCueLabels[customer.anomalyKind]} ${cueLabels[cueMarker]}`}
    >
      <div className="scene-target-ring" aria-hidden="true" />
      <div className="scene-current-visitor" aria-hidden="true">
        <span className="scene-head" />
        <span className="scene-eye scene-eye-left" />
        <span className="scene-eye scene-eye-right" />
        <span className="scene-mouth" />
        <span className="scene-arm scene-arm-left" />
        <span className="scene-arm scene-arm-right" />
        <span className="scene-cue-bar" />
      </div>
      <div className="scene-cue-label">
        <strong>Current</strong>
        <span>{cueLabels[cueMarker]}</span>
      </div>
    </div>
  );
}

export function Hud() {
  const phase = useGameStore((state) => state.phase);
  const currentCustomer = useGameStore((state) => state.currentCustomer);
  const currentOrder = useGameStore((state) => state.currentOrder);
  const preparedItems = useGameStore((state) => state.preparedItems);
  const score = useGameStore((state) => state.score);
  const mistakes = useGameStore((state) => state.mistakes);
  const threat = useGameStore((state) => state.threat);
  const served = useGameStore((state) => state.served);
  const repelled = useGameStore((state) => state.repelled);
  const shiftTimer = useGameStore((state) => state.shiftTimer);
  const customerTimer = useGameStore((state) => state.customerTimer);
  const holdProgress = useGameStore((state) => state.holdProgress);
  const selectedDrink = useGameStore((state) => state.selectedDrink);
  const selectedBurgerIngredients = useGameStore((state) => state.burgerIngredients);
  const stations = useGameStore((state) => state.stations);
  const message = useGameStore((state) => state.message);
  const actionCue = useGameStore((state) => state.actionCue);
  const level = useGameStore((state) => state.level);
  const selectDrink = useGameStore((state) => state.selectDrink);
  const toggleBurgerIngredient = useGameStore((state) => state.toggleBurgerIngredient);
  const serveCustomer = useGameStore((state) => state.serveCustomer);
  const clearPrepared = useGameStore((state) => state.clearPrepared);
  const pause = useGameStore((state) => state.pause);
  const resetToMenu = useGameStore((state) => state.resetToMenu);
  const startCooking = useGameStore((state) => state.startCooking);
  const collectStation = useGameStore((state) => state.collectStation);
  const beginProtection = useGameStore((state) => state.beginProtection);
  const endProtection = useGameStore((state) => state.endProtection);
  const prepared = summarizePrepared(preparedItems);
  const [expandedOrderPinned, setExpandedOrderPinned] = useState(false);
  const holdPercent = Math.round((holdProgress / PROTECTION_HOLD_SECONDS) * 100);
  const gameplayGuide = useMemo(() => {
    const readyStation = stationIds.find((stationId) => stations[stationId].status === 'ready');
    if (readyStation) {
      return {
        zone: readyStation,
        label: `Collect ${stations[readyStation].product} from ${stations[readyStation].label}`,
      };
    }

    if (currentCustomer?.anomaly) {
      return {
        zone: 'shutter',
        label: 'Anomaly cue: hold the shutter instead of serving',
      };
    }

    const cookingStation = stationIds.find((stationId) => stations[stationId].status === 'cooking');
    if (cookingStation) {
      return {
        zone: cookingStation,
        label: `Cooking ${stations[cookingStation].product} at ${stations[cookingStation].label}`,
      };
    }

    const nextLine = currentOrder?.lines.find((line) => {
      const currentCount = line.kind === 'burger' ? prepared.burger : prepared[line.kind];
      return currentCount < line.count;
    });
    if (nextLine) {
      const stationId = stationForOrderLine(nextLine.kind);
      return {
        zone: stationId,
        label: `Start ${nextLine.kind} at ${stations[stationId].label}`,
      };
    }

    if (currentOrder?.drink && prepared.drink !== currentOrder.drink) {
      return {
        zone: 'drink',
        label: `Fill ${currentOrder.drink} at Dispenser`,
      };
    }

    return {
      zone: 'window',
      label: preparedItems.length > 0 ? 'Serve the tray at the window' : 'Read the order at the window',
    };
  }, [currentCustomer?.anomaly, currentOrder, prepared, preparedItems.length, stations]);

  useEffect(() => {
    installAudioUnlock();
  }, []);

  useEffect(() => {
    if (actionCue.sequence <= 0 || actionCue.kind === 'idle') return;
    playGameSound(actionCue.kind as GameSound);
  }, [actionCue.kind, actionCue.sequence]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('phase4-readability')) return;

    window.__kfsPhase4SetActiveCustomer = setPhase4ReadabilityActiveCustomer;
    return () => {
      delete window.__kfsPhase4SetActiveCustomer;
    };
  }, []);

  const runStation = (stationId: StationId, product?: 'nuggets' | 'strips') => {
    if (stations[stationId].status === 'ready') {
      collectStation(stationId);
      return;
    }
    startCooking(stationId, product);
  };

  const quickInteract = () => {
    const readyStation = stationIds.find((stationId) => stations[stationId].status === 'ready');
    if (readyStation) {
      collectStation(readyStation);
      return;
    }

    if (preparedItems.length > 0) {
      serveCustomer();
      return;
    }

    const firstLine = currentOrder?.lines[0];
    if (!firstLine) return;
    if (firstLine.kind === 'fries') runStation('fryer');
    if (firstLine.kind === 'burger') runStation('grill');
    if (firstLine.kind === 'nuggets') runStation('oven', 'nuggets');
    if (firstLine.kind === 'strips') runStation('oven', 'strips');
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        if (useGameStore.getState().phase === 'playing') pause();
        else if (useGameStore.getState().phase === 'paused') useGameStore.getState().resume();
      }
      if (event.key === 'Tab') {
        event.preventDefault();
        setExpandedOrderPinned((value) => !value);
      }
      if (event.key.toLowerCase() === 'e') {
        event.preventDefault();
        if (useGameStore.getState().phase === 'playing') quickInteract();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const holdStart = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    beginProtection();
  };
  const holdEnd = (event: PointerEvent<HTMLButtonElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    endProtection();
  };

  return (
    <div className="hud-layer">
      <PreShiftStreetStatus />
      <div className="play-hud" aria-hidden={phase !== 'playing'}>
      <ActiveSceneReadabilityLayer customer={currentCustomer} />
      <div className={`gameplay-guide guide-${gameplayGuide.zone}`} data-testid="gameplay-guide">
        <strong>Next step</strong>
        <span>{gameplayGuide.label}</span>
      </div>
      <div className="topbar" data-testid="hud-topbar">
        <div>
          <span>Score</span>
          <strong>{score}</strong>
        </div>
        <div>
          <span>Shift</span>
          <strong>{formatTime(shiftTimer)}</strong>
        </div>
        <div>
          <span>Customer</span>
          <strong>{formatTime(customerTimer)}</strong>
        </div>
        <div>
          <span>Mistakes</span>
          <strong>{mistakes}/3</strong>
        </div>
        <div>
          <span>Threat</span>
          <strong>{Math.round(threat)}%</strong>
        </div>
        <button type="button" className="secondary compact" onClick={pause} disabled={phase !== 'playing'}>
          Pause
        </button>
        <button type="button" className="secondary compact" onClick={resetToMenu} disabled={phase !== 'playing'}>
          Reset
        </button>
      </div>

      <aside className={`panel left-panel terminal-panel ${expandedOrderPinned ? 'expanded-order' : ''}`} data-testid="order-panel">
        <div className="panel-title">
          <h2>Order</h2>
          <button
            type="button"
            className="secondary compact"
            onClick={() => setExpandedOrderPinned((value) => !value)}
            aria-pressed={expandedOrderPinned}
          >
            Tab
          </button>
          <span>Lv {level}</span>
        </div>
        {currentCustomer && currentOrder ? (
          <>
            <div className="customer-row">
              <strong>{currentCustomer.name}</strong>
              <span>{stageLabel(currentCustomer.street.encounterStage)}</span>
            </div>
            <ActiveCurrentCustomerReadability customer={currentCustomer} />
            <ActiveEncounterFlowStatus />
            <ul className="order-list">
              {currentOrder.lines.map((line) => (
                <li key={`${line.kind}-${line.ingredients?.join('-') ?? ''}`}>
                  <span>
                    {line.count} x {line.kind}
                    {line.kind === 'burger' ? ingredientsLabel(line.ingredients) : ''}
                  </span>
                </li>
              ))}
              <li>
                <span>{currentOrder.drink ? `1 x ${currentOrder.drink}` : 'no drink'}</span>
              </li>
            </ul>
          </>
        ) : (
          <p>No customer.</p>
        )}
        <div className="hint-list">
          <span>Esc pause</span>
          <span>E quick</span>
          <span>Tab details</span>
        </div>
        {expandedOrderPinned && (
          <div className="order-details">
            <strong>Inspect before serving</strong>
            <span>Shadow eyes, long arms, or a fixed glowing smile means hold the shutter instead of serving.</span>
          </div>
        )}
        <div className={`message message-${actionCue.kind}`}>
          <strong>{message}</strong>
          <span>{actionCue.label}</span>
        </div>
      </aside>

      <aside className="panel right-panel station-board-panel" data-testid="prep-panel">
        <h2>Prep</h2>
        <div className="tray-grid">
          <span>Fries</span>
          <strong>{prepared.fries}</strong>
          <span>Burgers</span>
          <strong>{prepared.burger}</strong>
          <span>Nuggets</span>
          <strong>{prepared.nuggets}</strong>
          <span>Strips</span>
          <strong>{prepared.strips}</strong>
          <span>Drink</span>
          <strong>{prepared.drink ?? '-'}</strong>
        </div>

        <div className="ingredient-tabs" aria-label="Burger ingredients">
          {burgerIngredients.map((ingredient) => (
            <button
              type="button"
              key={ingredient}
              className={selectedBurgerIngredients.includes(ingredient) ? 'active' : 'secondary'}
              onClick={() => toggleBurgerIngredient(ingredient)}
            >
              {ingredient}
            </button>
          ))}
        </div>

        <div className="drink-tabs">
          {drinkOptions.map((drink) => (
            <button
              type="button"
              key={drink}
              className={drink === selectedDrink ? 'active' : 'secondary'}
              onClick={() => selectDrink(drink)}
            >
              {drink}
            </button>
          ))}
        </div>

        <div className="station-list">
          {stationIds.map((id) => {
            const station = stations[id];
            const progress =
              station.status === 'cooking' && station.duration > 0
                ? Math.max(0, Math.min(100, ((station.duration - station.remaining) / station.duration) * 100))
                : station.status === 'ready'
                  ? 100
                  : 0;
            return (
              <div
                key={id}
                className={`station-row station-feedback station-${station.status} ${gameplayGuide.zone === id ? 'next-step' : ''}`}
                style={{ '--station-progress': `${progress}%` } as CSSProperties & Record<'--station-progress', string>}
                data-testid={`prep-station-${id}`}
              >
                <span>{station.label}</span>
                <strong>
                  {station.status === 'cooking'
                    ? `${station.product} ${formatTime(station.remaining)}`
                    : station.status === 'ready'
                      ? `${station.product} ready`
                      : 'idle'}
                </strong>
                <i aria-hidden="true" />
              </div>
            );
          })}
        </div>
      </aside>

      <div className="action-dock" data-testid="action-dock">
        <button
          type="button"
          className={gameplayGuide.zone === 'fryer' ? 'next-step' : undefined}
          onClick={() => runStation('fryer')}
          disabled={phase !== 'playing' || stations.fryer.status === 'cooking'}
        >
          {stationButtonLabel('fryer')}
        </button>
        <button
          type="button"
          className={gameplayGuide.zone === 'grill' ? 'next-step' : undefined}
          onClick={() => runStation('grill')}
          disabled={phase !== 'playing' || stations.grill.status === 'cooking'}
        >
          {stationButtonLabel('grill')}
        </button>
        <button
          type="button"
          className={gameplayGuide.zone === 'oven' ? 'next-step' : undefined}
          onClick={() => runStation('oven', 'nuggets')}
          disabled={phase !== 'playing' || stations.oven.status === 'cooking'}
        >
          {stationButtonLabel('oven', 'nuggets')}
        </button>
        <button type="button" onClick={() => runStation('oven', 'strips')} disabled={phase !== 'playing' || stations.oven.status === 'cooking'}>
          {stationButtonLabel('oven', 'strips')}
        </button>
        <button
          type="button"
          className={gameplayGuide.zone === 'drink' ? 'next-step' : undefined}
          onClick={() => runStation('drink')}
          disabled={phase !== 'playing' || stations.drink.status === 'cooking'}
        >
          {stationButtonLabel('drink')}
        </button>
        <button
          type="button"
          className={`serve-button ${gameplayGuide.zone === 'window' ? 'next-step' : ''}`}
          data-testid="serve-action"
          onClick={serveCustomer}
          disabled={phase !== 'playing'}
        >
          Serve
        </button>
        <button type="button" className="secondary" onClick={quickInteract} disabled={phase !== 'playing'}>
          Quick
        </button>
        <button type="button" className="secondary" onClick={clearPrepared} disabled={phase !== 'playing'}>
          Clear
        </button>
        <div className="shutter-control">
          <button
            type="button"
            className={`hold-button ${gameplayGuide.zone === 'shutter' ? 'next-step' : ''}`}
            data-testid="shutter-action"
            onPointerDown={holdStart}
            onPointerUp={holdEnd}
            onPointerCancel={holdEnd}
            onPointerLeave={holdEnd}
            disabled={phase !== 'playing'}
          >
            Hold Shutter
          </button>
          <div
            className="hold-progress"
            role="progressbar"
            aria-label="Shutter hold"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={holdPercent}
          >
            <span style={{ width: `${holdPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="bottom-status">
        <span>Served {served}</span>
        <span>Repelled {repelled}</span>
        <span>Protection {holdPercent}%</span>
      </div>
      </div>

      <div className="orientation-overlay" data-testid="orientation-gate">
        <div>Please rotate your device horizontally.</div>
      </div>

      <Overlay />
    </div>
  );
}
