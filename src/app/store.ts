import { create } from 'zustand';
import { createCookingStations, COOKING_DURATIONS } from '../features/cooking/config';
import type {
  BurgerIngredient,
  CookableKind,
  CookingStation,
  DrinkFlavor,
  FoodKind,
  PreparedItem,
  StationId,
} from '../features/cooking/types';
import { generateCustomer } from '../features/customers/generator';
import type { AnomalyKind, Customer, EncounterFlowStage, EncounterSource } from '../features/customers/types';
import {
  ANOMALY_SECONDS,
  getDifficulty,
  MAX_MISTAKES,
  MAX_THREAT,
  PROTECTION_HOLD_SECONDS,
  SHIFT_SECONDS,
} from '../features/difficulty/config';
import { INTERIOR_START_ZONE, isStationZone } from '../features/interior/config';
import { advanceWorkerMovement, createWorkerMovementState, startWorkerMovement } from '../features/interior/movement';
import type { InteriorZone, WorkerMovementState } from '../features/interior/types';
import { matchOrder } from '../features/orders/matcher';
import type { Order } from '../features/orders/types';
import { summarizePrepared } from '../features/orders/types';
import { getStreetVisualState, type StreetVisualState } from '../shared/sceneVisualState';

export type GamePhase = 'menu' | 'playing' | 'paused' | 'victory' | 'gameOver';
export type WorkerZone = InteriorZone;
export type ActionCueKind = 'idle' | 'pick' | 'startCooking' | 'ready' | 'serve' | 'error' | 'warning';

export type ActionCue = {
  workerZone: WorkerZone;
  kind: ActionCueKind;
  label: string;
  sequence: number;
};

export type InteractionTone = 'neutral' | 'success' | 'progress' | 'ready' | 'warning' | 'error' | 'threat';

export type InteractionEffectKind =
  | 'none'
  | 'storagePickup'
  | 'stationCooking'
  | 'stationReady'
  | 'stationCollected'
  | 'trayPartial'
  | 'trayComplete'
  | 'serveSuccess'
  | 'serveWrong'
  | 'serveEarly'
  | 'serveNoCustomer'
  | 'serveAnomaly'
  | 'shutterCharging'
  | 'shutterRepel'
  | 'shutterFalseAlarm'
  | 'anomalyTimeout'
  | 'invalid';

export type InteractionOutcomeCustomer = Pick<Customer, 'id' | 'anomaly' | 'anomalyKind' | 'street'>;

export type InteractionEffect = {
  kind: InteractionEffectKind;
  zone: InteriorZone;
  tone: InteractionTone;
  label: string;
  sequence: number;
  itemKind?: FoodKind;
  nextZone?: InteriorZone;
  outcomeCustomer?: InteractionOutcomeCustomer;
};

export type StoragePickupState = {
  itemKind: FoodKind;
  nextZone: InteriorZone;
  orderId: string;
  sequence: number;
} | null;

export type TrayProgressStatus = 'empty' | 'partial' | 'complete' | 'missing' | 'wrong';

export type TrayState = {
  status: TrayProgressStatus;
  requiredCount: number;
  preparedCount: number;
  missingCount: number;
  wrongCount: number;
};

export type EncounterDeparture = {
  customerId: string;
  stage: Extract<EncounterFlowStage, 'servedLeaving' | 'repelledLeaving' | 'expiredLeaving' | 'replaced'>;
  anomaly: boolean;
};

export type EncounterFlowState = {
  activeCustomerId: string | null;
  activeStage: EncounterFlowStage | null;
  activeSource: EncounterSource | null;
  lastDeparture: EncounterDeparture | null;
};

type GameState = {
  phase: GamePhase;
  currentCustomer: Customer | null;
  currentOrder: Order | null;
  preparedItems: PreparedItem[];
  score: number;
  mistakes: number;
  threat: number;
  served: number;
  repelled: number;
  shiftTimer: number;
  customerTimer: number;
  holdProgress: number;
  shutterClosed: boolean;
  selectedDrink: DrinkFlavor;
  burgerIngredients: BurgerIngredient[];
  stations: Record<StationId, CookingStation>;
  customerSequence: number;
  message: string;
  protectionHeld: boolean;
  shutterTimer: number;
  gameOverReason: string | null;
  level: number;
  preShiftStreet: StreetVisualState;
  encounterFlow: EncounterFlowState;
  actionCue: ActionCue;
  interactionEffect: InteractionEffect;
  storagePickup: StoragePickupState;
  trayState: TrayState;
  workerMovement: WorkerMovementState;
  startShift: () => void;
  pause: () => void;
  resume: () => void;
  resetToMenu: () => void;
  tick: (delta: number) => void;
  moveWorkerTo: (zone: InteriorZone) => void;
  interactAtCurrentZone: () => void;
  startCooking: (station: StationId, productOverride?: CookableKind) => void;
  collectStation: (station: StationId) => void;
  clearPrepared: () => void;
  selectDrink: (drink: DrinkFlavor) => void;
  toggleBurgerIngredient: (ingredient: BurgerIngredient) => void;
  serveCustomer: () => void;
  beginProtection: () => void;
  endProtection: () => void;
};

const emptyInteractionEffect: InteractionEffect = {
  kind: 'none',
  zone: 'window',
  tone: 'neutral',
  label: '',
  sequence: 0,
};

const emptyTrayState: TrayState = {
  status: 'empty',
  requiredCount: 0,
  preparedCount: 0,
  missingCount: 0,
  wrongCount: 0,
};

function expectedCount(order: Order | null): number {
  if (!order) return 0;
  return order.lines.reduce((total, line) => total + line.count, order.drink ? 1 : 0);
}

function preparedCount(items: PreparedItem[]): number {
  return items.length;
}

export function deriveTrayState(currentOrder: Order | null, preparedItems: PreparedItem[]): TrayState {
  if (!currentOrder) return emptyTrayState;

  const requiredCount = expectedCount(currentOrder);
  const currentPreparedCount = preparedCount(preparedItems);
  const prepared = summarizePrepared(preparedItems);
  const expected = { fries: 0, burger: 0, nuggets: 0, strips: 0 };
  let expectedBurgerIngredients: string | null = null;

  for (const line of currentOrder.lines) {
    expected[line.kind] += line.count;
    if (line.kind === 'burger') {
      expectedBurgerIngredients = [...(line.ingredients ?? [])].sort().join(',');
    }
  }

  const foodMissing =
    Math.max(0, expected.fries - prepared.fries) +
    Math.max(0, expected.burger - prepared.burger) +
    Math.max(0, expected.nuggets - prepared.nuggets) +
    Math.max(0, expected.strips - prepared.strips);
  const drinkMissing = currentOrder.drink && prepared.drink !== currentOrder.drink ? 1 : 0;
  const missingCount = foodMissing + drinkMissing;
  const extraCount =
    Math.max(0, prepared.fries - expected.fries) +
    Math.max(0, prepared.burger - expected.burger) +
    Math.max(0, prepared.nuggets - expected.nuggets) +
    Math.max(0, prepared.strips - expected.strips) +
    (prepared.drink && prepared.drink !== currentOrder.drink ? 1 : 0);
  const wrongBurgerCount =
    expectedBurgerIngredients && prepared.burgers.some((ingredients) => [...ingredients].sort().join(',') !== expectedBurgerIngredients)
      ? 1
      : 0;
  const wrongCount = extraCount + wrongBurgerCount;

  if (currentPreparedCount === 0) {
    return {
      status: 'empty',
      requiredCount,
      preparedCount: 0,
      missingCount: requiredCount,
      wrongCount,
    };
  }

  if (wrongCount > 0) {
    return { status: 'wrong', requiredCount, preparedCount: currentPreparedCount, missingCount, wrongCount };
  }

  if (missingCount === 0 && currentPreparedCount === requiredCount) {
    return { status: 'complete', requiredCount, preparedCount: currentPreparedCount, missingCount: 0, wrongCount: 0 };
  }

  return {
    status: currentPreparedCount > 0 ? 'partial' : 'missing',
    requiredCount,
    preparedCount: currentPreparedCount,
    missingCount,
    wrongCount,
  };
}

const initialState = {
  phase: 'menu' as GamePhase,
  currentCustomer: null,
  currentOrder: null,
  preparedItems: [],
  score: 0,
  mistakes: 0,
  threat: 0,
  served: 0,
  repelled: 0,
  shiftTimer: SHIFT_SECONDS,
  customerTimer: 0,
  holdProgress: 0,
  shutterClosed: false,
  selectedDrink: 'lemonade' as DrinkFlavor,
  burgerIngredients: ['bun', 'patty', 'sauce'] as BurgerIngredient[],
  stations: createCookingStations(),
  customerSequence: 0,
  message: 'Start the night shift.',
  protectionHeld: false,
  shutterTimer: 0,
  gameOverReason: null,
  level: 1,
  preShiftStreet: getStreetVisualState({ anomalyKind: 'normal', customerStreet: null }),
  encounterFlow: {
    activeCustomerId: null,
    activeStage: null,
    activeSource: null,
    lastDeparture: null,
  },
  actionCue: {
    workerZone: 'storage' as WorkerZone,
    kind: 'idle' as ActionCueKind,
    label: 'Clock in and open the window.',
    sequence: 0,
  },
  interactionEffect: emptyInteractionEffect,
  storagePickup: null as StoragePickupState,
  trayState: emptyTrayState,
  workerMovement: createWorkerMovementState(),
};

function nextActionCue(state: Pick<GameState, 'actionCue'>, patch: Omit<ActionCue, 'sequence'>): ActionCue {
  return {
    ...patch,
    sequence: state.actionCue.sequence + 1,
  };
}

function nextInteractionEffect(
  state: Pick<GameState, 'interactionEffect'>,
  patch: Omit<InteractionEffect, 'sequence'>,
): InteractionEffect {
  return {
    ...patch,
    sequence: state.interactionEffect.sequence + 1,
  };
}

function outcomeCustomerFor(customer: Customer): InteractionOutcomeCustomer {
  return {
    id: customer.id,
    anomaly: customer.anomaly,
    anomalyKind: customer.anomalyKind,
    street: customer.street,
  };
}

function shouldPreserveTerminalEffect(effect: InteractionEffect) {
  return effect.kind === 'anomalyTimeout' || effect.kind === 'shutterFalseAlarm' || effect.kind === 'shutterRepel';
}

function nextTrayState(state: Pick<GameState, 'currentOrder' | 'preparedItems'>, preparedItems = state.preparedItems) {
  return deriveTrayState(state.currentOrder, preparedItems);
}

function terminalEncounterCleanup(): Partial<GameState> {
  return {
    currentCustomer: null,
    currentOrder: null,
    preparedItems: [],
    storagePickup: null,
    customerTimer: 0,
    holdProgress: 0,
    protectionHeld: false,
    shutterClosed: false,
    shutterTimer: 0,
    encounterFlow: {
      activeCustomerId: null,
      activeStage: null,
      activeSource: null,
      lastDeparture: null,
    },
  };
}

function movementIntentForStage(stage: EncounterFlowStage): Customer['street']['movementIntent'] {
  if (stage === 'approaching') return 'approachingWindow';
  if (stage === 'atWindow' || stage === 'waiting') return 'waiting';
  return 'leaving';
}

function withEncounterStage(customer: Customer, source: EncounterSource, stage: EncounterFlowStage): Customer {
  return {
    ...customer,
    street: {
      ...customer.street,
      source,
      encounterStage: stage,
      movementIntent: movementIntentForStage(stage),
      futureVisitor: stage === 'approaching' || stage === 'atWindow' || stage === 'waiting',
    },
  };
}

function encounterFlowFor(customer: Customer, lastDeparture: EncounterDeparture | null): EncounterFlowState {
  return {
    activeCustomerId: customer.id,
    activeStage: customer.street.encounterStage,
    activeSource: customer.street.source,
    lastDeparture,
  };
}

function departureFor(customer: Customer, stage: EncounterDeparture['stage']): EncounterDeparture {
  return {
    customerId: customer.id,
    stage,
    anomaly: customer.anomaly,
  };
}

function stationProduct(
  station: StationId,
  selectedDrink: DrinkFlavor,
  burgerIngredients: BurgerIngredient[],
  productOverride?: CookableKind,
) {
  if (station === 'fryer') return { product: 'fries' as const };
  if (station === 'grill') return { product: 'burger' as const, burgerIngredients };
  if (station === 'oven') return { product: productOverride === 'strips' ? ('strips' as const) : ('nuggets' as const) };
  return { product: 'drink' as const, drinkFlavor: selectedDrink };
}

function itemFromStation(station: CookingStation): PreparedItem | null {
  if (station.product === 'burger') {
    return {
      kind: 'burger',
      ingredients: station.burgerIngredients ?? [],
      id: `burger-${Date.now()}-${Math.random()}`,
    };
  }

  if (station.product === 'fries' || station.product === 'nuggets' || station.product === 'strips') {
    return { kind: station.product, id: `${station.product}-${Date.now()}-${Math.random()}` };
  }

  if (station.product === 'drink' && station.drinkFlavor) {
    return { kind: 'drink', flavor: station.drinkFlavor, id: `drink-${Date.now()}-${Math.random()}` };
  }

  return null;
}

function nextCustomer(
  sequence: number,
  shiftTimer = SHIFT_SECONDS,
  source: EncounterSource = 'streetQueue',
  stage: EncounterFlowStage = 'approaching',
  lastDeparture: EncounterDeparture | null = null,
) {
  const difficulty = getDifficulty(sequence, 1 - shiftTimer / SHIFT_SECONDS);
  const customer = withEncounterStage(
    generateCustomer(sequence, difficulty, {
      encounterSource: source,
      encounterStage: stage,
    }),
    source,
    stage,
  );

  return {
    currentCustomer: customer,
    currentOrder: customer.order,
    preparedItems: [],
    storagePickup: null,
    customerTimer: customer.anomaly ? ANOMALY_SECONDS : difficulty.customerPatienceMs / 1000,
    stations: createCookingStations(),
    holdProgress: 0,
    protectionHeld: false,
    level: difficulty.level,
    encounterFlow: encounterFlowFor(customer, lastDeparture),
  };
}

function clampEndState(state: Pick<GameState, 'mistakes' | 'threat' | 'phase'>) {
  if (state.mistakes >= MAX_MISTAKES || state.threat >= MAX_THREAT) {
    return 'gameOver' as const;
  }
  return state.phase;
}

function getGameOverReason(mistakes: number, threat: number) {
  if (threat >= MAX_THREAT) return 'Threat reached 100%.';
  if (mistakes >= MAX_MISTAKES) return 'Too many mistakes.';
  return null;
}

function invalidInteractionCue(state: Pick<GameState, 'actionCue'>, zone: InteriorZone, label: string): ActionCue {
  return nextActionCue(state, {
    workerZone: zone,
    kind: 'warning',
    label,
  });
}

function stationZoneForProduct(product: FoodKind): InteriorZone {
  if (product === 'fries') return 'fryer';
  if (product === 'burger') return 'grill';
  if (product === 'drink') return 'drink';
  return 'oven';
}

function nextNeededOrderItem(order: Order, preparedItems: PreparedItem[]): { itemKind: FoodKind; nextZone: InteriorZone } | null {
  const prepared = summarizePrepared(preparedItems);
  for (const line of order.lines) {
    const count = line.kind === 'burger' ? prepared.burger : prepared[line.kind];
    if (count < line.count) {
      return {
        itemKind: line.kind,
        nextZone: stationZoneForProduct(line.kind),
      };
    }
  }

  if (order.drink && prepared.drink !== order.drink) {
    return {
      itemKind: 'drink',
      nextZone: 'drink',
    };
  }

  return null;
}

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  startShift: () =>
    set(() => {
      const customerPatch = nextCustomer(1, SHIFT_SECONDS, 'preShiftStreet', 'atWindow');
      return {
        ...initialState,
        phase: 'playing',
        customerSequence: 1,
        message: 'First visitor steps from the pre-shift street to the service window.',
        workerMovement: createWorkerMovementState(INTERIOR_START_ZONE),
        actionCue: nextActionCue(initialState, {
          workerZone: 'window',
          kind: 'pick',
          label: 'Read the first order at the service window.',
        }),
        interactionEffect: emptyInteractionEffect,
        ...customerPatch,
        trayState: deriveTrayState(customerPatch.currentOrder, customerPatch.preparedItems),
      };
    }),

  pause: () => set((state) => (state.phase === 'playing' ? { phase: 'paused' } : {})),
  resume: () => set((state) => (state.phase === 'paused' ? { phase: 'playing' } : {})),
  resetToMenu: () => set(() => ({ ...initialState, stations: createCookingStations() })),

  tick: (delta: number) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const stations = {} as Record<StationId, CookingStation>;
    let readyStationCue: { id: StationId; label: string } | null = null;
    const workerMovement = advanceWorkerMovement(state.workerMovement, delta);

    for (const [id, station] of Object.entries(state.stations) as [StationId, CookingStation][]) {
      if (station.status === 'cooking') {
        const remaining = Math.max(0, station.remaining - delta);
        if (remaining <= 0 && !readyStationCue) readyStationCue = { id, label: station.label };
        stations[id] = {
          ...station,
          remaining,
          status: remaining <= 0 ? 'ready' : 'cooking',
        };
      } else {
        stations[id] = station;
      }
    }

    let shiftTimer = Math.max(0, state.shiftTimer - delta);
    let customerTimer = Math.max(0, state.customerTimer - delta);
    let threat = state.threat + (state.currentCustomer?.anomaly ? delta * 2.6 : 0);
    let mistakes = state.mistakes;
    let message = state.message;
    let phase: GamePhase = state.phase;
    let shutterClosed = state.shutterClosed;
    let shutterTimer = Math.max(0, state.shutterTimer - delta);
    let holdProgress = state.protectionHeld
      ? Math.min(PROTECTION_HOLD_SECONDS, state.holdProgress + delta)
      : Math.max(0, state.holdProgress - delta * 2);
    let repelled = state.repelled;
    let score = state.score;
    let customerSequence = state.customerSequence;
    let customerPatch: Partial<GameState> = {};
    let actionCue = readyStationCue
      ? nextActionCue(state, {
          workerZone: readyStationCue.id,
          kind: 'ready',
          label: `${readyStationCue.label} is ready to collect.`,
        })
      : state.actionCue;
    let interactionEffect = readyStationCue
      ? nextInteractionEffect(state, {
          kind: 'stationReady',
          zone: readyStationCue.id,
          tone: 'ready',
          label: `${readyStationCue.label} is ready.`,
          itemKind: stations[readyStationCue.id].product ?? undefined,
        })
      : state.interactionEffect;

    if (shutterTimer <= 0) shutterClosed = false;

    if (holdProgress >= PROTECTION_HOLD_SECONDS && state.currentCustomer) {
      shutterClosed = true;
      shutterTimer = 0.65;
      holdProgress = 0;

      if (state.currentCustomer.anomaly) {
        repelled += 1;
        score += 150;
        message = 'Anomaly repelled. +150 score.';
        actionCue = nextActionCue(state, {
          workerZone: 'shutter',
          kind: 'serve',
          label: 'Shutter held. Threat repelled.',
        });
        interactionEffect = nextInteractionEffect(state, {
          kind: 'shutterRepel',
          zone: 'shutter',
          tone: 'success',
          label: 'Shutter repelled the anomaly.',
          outcomeCustomer: outcomeCustomerFor(state.currentCustomer),
        });
      } else {
        mistakes += 1;
        score = Math.max(0, score - 50);
        message = 'False alarm: normal customer scared away. -50 score.';
        actionCue = nextActionCue(state, {
          workerZone: 'shutter',
          kind: 'error',
          label: 'False shutter alarm.',
        });
        interactionEffect = nextInteractionEffect(state, {
          kind: 'shutterFalseAlarm',
          zone: 'shutter',
          tone: 'error',
          label: 'False shutter alarm.',
          outcomeCustomer: outcomeCustomerFor(state.currentCustomer),
        });
      }

      customerSequence += 1;
      customerPatch = nextCustomer(
        customerSequence,
        shiftTimer,
        'streetQueue',
        'approaching',
        departureFor(state.currentCustomer, state.currentCustomer.anomaly ? 'repelledLeaving' : 'replaced'),
      );
    } else if (customerTimer <= 0 && state.currentCustomer) {
      if (state.currentCustomer.anomaly) {
        threat = Math.min(MAX_THREAT, threat + 22);
        message = 'The anomaly lingered too long.';
        actionCue = nextActionCue(state, {
          workerZone: 'window',
          kind: 'warning',
          label: 'Anomaly stayed too long.',
        });
        interactionEffect = nextInteractionEffect(state, {
          kind: 'anomalyTimeout',
          zone: 'window',
          tone: 'threat',
          label: 'Anomaly pressure lingered at the window.',
          outcomeCustomer: outcomeCustomerFor(state.currentCustomer),
        });
      } else {
        mistakes += 1;
        score = Math.max(0, score - 75);
        message = 'Customer left without food. -75 score.';
        actionCue = nextActionCue(state, {
          workerZone: 'window',
          kind: 'error',
          label: 'Customer left hungry.',
        });
        interactionEffect = nextInteractionEffect(state, {
          kind: 'serveEarly',
          zone: 'window',
          tone: 'error',
          label: 'Customer left before the tray was served.',
          outcomeCustomer: outcomeCustomerFor(state.currentCustomer),
        });
      }

      customerSequence += 1;
      customerPatch = nextCustomer(
        customerSequence,
        shiftTimer,
        'streetQueue',
        'approaching',
        departureFor(state.currentCustomer, 'expiredLeaving'),
      );
    }

    if (shiftTimer <= 0) {
      phase = 'victory';
      message = 'Shift complete.';
      shiftTimer = 0;
      actionCue = nextActionCue(state, {
        workerZone: 'window',
        kind: 'serve',
        label: 'Shift complete.',
      });
      interactionEffect = nextInteractionEffect(state, {
        kind: 'serveSuccess',
        zone: 'window',
        tone: 'success',
        label: 'Shift complete.',
      });
      customerPatch = terminalEncounterCleanup();
    }

    phase = clampEndState({ mistakes, threat, phase });
    if (phase === 'gameOver') {
      customerTimer = 0;
      holdProgress = 0;
      actionCue = nextActionCue(state, {
        workerZone: 'window',
        kind: 'error',
        label: 'Shift failed.',
      });
      if (!shouldPreserveTerminalEffect(interactionEffect)) {
        interactionEffect = nextInteractionEffect(state, {
          kind: 'invalid',
          zone: 'window',
          tone: 'error',
          label: 'Shift failed.',
        });
      }
      customerPatch = terminalEncounterCleanup();
    }

    set({
      stations,
      shiftTimer,
      customerTimer,
      threat: Math.min(MAX_THREAT, threat),
      mistakes,
      message,
      phase,
      shutterClosed,
      shutterTimer,
      holdProgress,
      repelled,
      score,
      customerSequence,
      gameOverReason: phase === 'gameOver' ? getGameOverReason(mistakes, threat) : state.gameOverReason,
      actionCue,
      interactionEffect,
      workerMovement,
      trayState: deriveTrayState(customerPatch.currentOrder === undefined ? state.currentOrder : customerPatch.currentOrder ?? null, customerPatch.preparedItems ?? state.preparedItems),
      ...customerPatch,
    });
  },

  moveWorkerTo: (zone) =>
    set((state) => {
      if (state.phase !== 'playing') return {};
      return {
        workerMovement: startWorkerMovement(state.workerMovement, zone),
      };
    }),

  interactAtCurrentZone: () => {
    const state = get();
    if (state.phase !== 'playing') return;

    const zone = state.workerMovement.status === 'moving' ? state.workerMovement.targetZone : state.workerMovement.currentZone;
    if (!zone) return;

    if (state.workerMovement.status === 'moving') {
      set({
        actionCue: invalidInteractionCue(state, zone, 'Worker is still moving.'),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'invalid',
          zone,
          tone: 'warning',
          label: 'Worker is still moving.',
        }),
      });
      return;
    }

    if (isStationZone(zone)) {
      const station = state.stations[zone];
      if (station.status === 'ready') {
        get().collectStation(zone);
        return;
      }

      if (station.status === 'idle') {
        get().startCooking(zone);
        return;
      }

      set({
        actionCue: invalidInteractionCue(state, zone, `${station.label} is already cooking.`),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'invalid',
          zone,
          tone: 'warning',
          label: `${station.label} is already cooking.`,
          itemKind: station.product ?? undefined,
        }),
      });
      return;
    }

    if (zone === 'storage') {
      if (!state.currentOrder) {
        set({
          actionCue: invalidInteractionCue(state, zone, 'No active order to pick from storage.'),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'invalid',
            zone,
            tone: 'warning',
            label: 'No active order to pick from storage.',
          }),
        });
        return;
      }

      const nextNeeded = nextNeededOrderItem(state.currentOrder, state.preparedItems);
      if (!nextNeeded) {
        set({
          actionCue: invalidInteractionCue(state, zone, 'Tray already has what this ticket needs.'),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'invalid',
            zone,
            tone: 'warning',
            label: 'Tray already has what this ticket needs.',
          }),
        });
        return;
      }

      if (
        state.storagePickup?.orderId === state.currentOrder.id &&
        state.storagePickup.itemKind === nextNeeded.itemKind &&
        state.storagePickup.nextZone === nextNeeded.nextZone
      ) {
        set({
          actionCue: invalidInteractionCue(state, zone, 'Storage supply is already staged.'),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'invalid',
            zone,
            tone: 'warning',
            label: 'Storage supply is already staged.',
            itemKind: nextNeeded.itemKind,
            nextZone: nextNeeded.nextZone,
          }),
        });
        return;
      }

      set({
        storagePickup: {
          itemKind: nextNeeded.itemKind,
          nextZone: nextNeeded.nextZone,
          orderId: state.currentOrder.id,
          sequence: state.actionCue.sequence + 1,
        },
        actionCue: nextActionCue(state, {
          workerZone: zone,
          kind: 'pick',
          label: `${nextNeeded.itemKind} staged from storage.`,
        }),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'storagePickup',
          zone,
          tone: 'success',
          label: `${nextNeeded.itemKind} staged from storage.`,
          itemKind: nextNeeded.itemKind,
          nextZone: nextNeeded.nextZone,
        }),
      });
      return;
    }

    if (zone === 'prep') {
      const trayState = nextTrayState(state);
      set({
        trayState,
        actionCue: invalidInteractionCue(state, zone, trayState.status === 'complete' ? 'Tray is complete.' : 'Tray is not ready yet.'),
        interactionEffect: nextInteractionEffect(state, {
          kind: trayState.status === 'complete' ? 'trayComplete' : 'trayPartial',
          zone,
          tone: trayState.status === 'complete' ? 'success' : 'warning',
          label: trayState.status === 'complete' ? 'Tray is complete.' : 'Tray is not ready yet.',
        }),
      });
      return;
    }

    if (zone === 'window') {
      if (state.currentCustomer && state.currentOrder) {
        get().serveCustomer();
        return;
      }

      set({
        actionCue: invalidInteractionCue(state, zone, 'No customer at the service window.'),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'serveNoCustomer',
          zone,
          tone: 'warning',
          label: 'No customer at the service window.',
        }),
      });
      return;
    }

    if (zone === 'shutter') {
      if (state.currentCustomer) {
        get().beginProtection();
        return;
      }

      set({
        actionCue: invalidInteractionCue(state, zone, 'No active window threat to block.'),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'invalid',
          zone,
          tone: 'warning',
          label: 'No active window threat to block.',
        }),
      });
      return;
    }

    set({
      actionCue: invalidInteractionCue(state, zone, 'No station interaction available here.'),
      interactionEffect: nextInteractionEffect(state, {
        kind: 'invalid',
        zone,
        tone: 'warning',
        label: 'No station interaction available here.',
      }),
    });
  },

  startCooking: (stationId, productOverride) =>
    set((state) => {
      if (state.phase !== 'playing') return {};
      const station = state.stations[stationId];
      if (station.status !== 'idle') {
        return {
          workerMovement: createWorkerMovementState(stationId),
          actionCue: nextActionCue(state, {
            workerZone: stationId,
            kind: 'warning',
            label: `${station.label} is already ${station.status}.`,
          }),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'invalid',
            zone: stationId,
            tone: 'warning',
            label: `${station.label} is already ${station.status}.`,
            itemKind: station.product ?? undefined,
          }),
        };
      }
      const details = stationProduct(stationId, state.selectedDrink, state.burgerIngredients, productOverride);
      const duration = COOKING_DURATIONS[details.product];

      return {
        stations: {
          ...state.stations,
          [stationId]: {
            ...station,
            ...details,
            status: 'cooking',
            duration,
            remaining: duration,
          },
        },
        message: `${station.label} started.`,
        workerMovement: createWorkerMovementState(stationId),
        actionCue: nextActionCue(state, {
          workerZone: stationId,
          kind: 'startCooking',
          label: `${station.label} started ${details.product}.`,
        }),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'stationCooking',
          zone: stationId,
          tone: 'progress',
          label: `${station.label} started ${details.product}.`,
          itemKind: details.product,
        }),
      };
    }),

  collectStation: (stationId) =>
    set((state) => {
      if (state.phase !== 'playing') return {};
      const station = state.stations[stationId];
      if (station.status !== 'ready') {
        return {
          workerMovement: createWorkerMovementState(stationId),
          actionCue: nextActionCue(state, {
            workerZone: stationId,
            kind: 'warning',
            label: `${station.label} is not ready yet.`,
          }),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'invalid',
            zone: stationId,
            tone: 'warning',
            label: `${station.label} is not ready yet.`,
            itemKind: station.product ?? undefined,
          }),
        };
      }
      const item = itemFromStation(station);
      const preparedItems = item ? [...state.preparedItems, item] : state.preparedItems;
      const trayState = deriveTrayState(state.currentOrder, preparedItems);

      return {
        preparedItems,
        stations: {
          ...state.stations,
          [stationId]: {
            ...station,
            status: 'idle',
            product: null,
            remaining: 0,
            drinkFlavor: undefined,
            burgerIngredients: undefined,
          },
        },
        storagePickup: null,
        trayState,
        message: item ? 'Item added to tray.' : state.message,
        workerMovement: createWorkerMovementState(stationId),
        actionCue: nextActionCue(state, {
          workerZone: stationId,
          kind: 'pick',
          label: item ? `${station.label} item moved to tray.` : `${station.label} cleared.`,
        }),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'stationCollected',
          zone: stationId,
          tone: 'success',
          label: item ? `${station.label} item moved to tray.` : `${station.label} cleared.`,
          itemKind: item?.kind,
        }),
      };
    }),

  clearPrepared: () =>
    set((state) =>
      state.phase === 'playing'
        ? {
            preparedItems: [],
            storagePickup: null,
            trayState: deriveTrayState(state.currentOrder, []),
            message: 'Tray cleared.',
            workerMovement: createWorkerMovementState('storage'),
            actionCue: nextActionCue(state, {
              workerZone: 'storage',
              kind: 'pick',
              label: 'Tray cleared at storage.',
            }),
            interactionEffect: nextInteractionEffect(state, {
              kind: 'trayPartial',
              zone: 'prep',
              tone: 'warning',
              label: 'Tray cleared.',
            }),
          }
        : {},
    ),
  selectDrink: (selectedDrink) =>
    set((state) =>
      state.phase === 'playing'
        ? {
            selectedDrink,
            workerMovement: createWorkerMovementState('drink'),
            actionCue: nextActionCue(state, {
              workerZone: 'drink',
              kind: 'pick',
              label: `${selectedDrink} selected.`,
            }),
            interactionEffect: nextInteractionEffect(state, {
              kind: 'storagePickup',
              zone: 'drink',
              tone: 'success',
              label: `${selectedDrink} selected.`,
              itemKind: 'drink',
              nextZone: 'drink',
            }),
          }
        : {},
    ),
  toggleBurgerIngredient: (ingredient) =>
    set((state) => {
      if (state.phase !== 'playing') return {};
      const locked = (ingredient === 'bun' || ingredient === 'patty') && state.burgerIngredients.includes(ingredient);
      if (locked) {
        return {
          workerMovement: createWorkerMovementState('storage'),
          actionCue: nextActionCue(state, {
            workerZone: 'storage',
            kind: 'warning',
            label: `${ingredient} stays on the burger.`,
          }),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'invalid',
            zone: 'storage',
            tone: 'warning',
            label: `${ingredient} stays on the burger.`,
            itemKind: 'burger',
          }),
        };
      }

      return {
        burgerIngredients: state.burgerIngredients.includes(ingredient)
          ? state.burgerIngredients.filter((item) => item !== ingredient)
          : [...state.burgerIngredients, ingredient],
        workerMovement: createWorkerMovementState('storage'),
        actionCue: nextActionCue(state, {
          workerZone: 'storage',
          kind: 'pick',
          label: `${ingredient} toggled.`,
        }),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'storagePickup',
          zone: 'storage',
          tone: 'success',
          label: `${ingredient} toggled.`,
          itemKind: 'burger',
          nextZone: 'grill',
        }),
      };
    }),

  serveCustomer: () =>
    set((state) => {
      if (state.phase !== 'playing') return {};
      if (!state.currentCustomer || !state.currentOrder) {
        return {
          workerMovement: createWorkerMovementState('window'),
          actionCue: nextActionCue(state, {
            workerZone: 'window',
            kind: 'warning',
            label: 'No customer at the service window.',
          }),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'serveNoCustomer',
            zone: 'window',
            tone: 'warning',
            label: 'No customer at the service window.',
          }),
        };
      }
      const customerSequence = state.customerSequence + 1;

      if (state.currentCustomer.anomaly) {
        const mistakes = state.mistakes + 1;
        const threat = Math.min(MAX_THREAT, state.threat + 30);
        const phase = clampEndState({ mistakes, threat, phase: state.phase });

        return {
          mistakes,
          score: Math.max(0, state.score - 50),
          threat,
          phase,
          customerSequence,
          gameOverReason: phase === 'gameOver' ? getGameOverReason(mistakes, threat) : state.gameOverReason,
          message: phase === 'gameOver' ? 'You served an anomaly. The threat took over.' : 'Never serve an anomaly. -50 score.',
          preparedItems: [],
          storagePickup: null,
          trayState: deriveTrayState(null, []),
          workerMovement: createWorkerMovementState('window'),
          actionCue: nextActionCue(state, {
            workerZone: 'window',
            kind: 'error',
            label: 'Wrong target served.',
          }),
          interactionEffect: nextInteractionEffect(state, {
            kind: 'serveAnomaly',
            zone: 'window',
            tone: 'threat',
            label: 'Wrong target served.',
            outcomeCustomer: outcomeCustomerFor(state.currentCustomer),
          }),
          ...(phase === 'playing'
            ? (() => {
                const customerPatch = nextCustomer(customerSequence, state.shiftTimer, 'streetQueue', 'approaching', departureFor(state.currentCustomer, 'replaced'));
                return {
                  ...customerPatch,
                  trayState: deriveTrayState(customerPatch.currentOrder, customerPatch.preparedItems),
                };
              })()
            : terminalEncounterCleanup()),
        };
      }

      const result = matchOrder(state.currentOrder, state.preparedItems);
      if (!result.ok) {
        const mistakes = state.mistakes + 1;
        const phase = clampEndState({ mistakes, threat: state.threat, phase: state.phase });

        return {
          mistakes,
          score: Math.max(0, state.score - 50),
          phase,
          gameOverReason: phase === 'gameOver' ? getGameOverReason(mistakes, state.threat) : state.gameOverReason,
          message: `${result.reason} -50 score.`,
          workerMovement: createWorkerMovementState('window'),
          actionCue: nextActionCue(state, {
            workerZone: 'window',
            kind: 'error',
            label: result.reason,
          }),
          interactionEffect: nextInteractionEffect(state, {
            kind: state.preparedItems.length === 0 ? 'serveEarly' : 'serveWrong',
            zone: 'window',
            tone: 'error',
            label: result.reason,
          }),
          ...(phase === 'gameOver'
            ? { ...terminalEncounterCleanup(), trayState: deriveTrayState(null, []) }
            : { preparedItems: [], storagePickup: null, trayState: deriveTrayState(state.currentOrder, []) }),
        };
      }

      const fastBonus = state.customerTimer >= 10 ? 25 : 0;

      return {
        served: state.served + 1,
        score: state.score + 100 + fastBonus,
        customerSequence,
        message: fastBonus ? 'Correct order. Fast bonus +25.' : 'Correct order. +100 score.',
        workerMovement: createWorkerMovementState('window'),
        actionCue: nextActionCue(state, {
          workerZone: 'window',
          kind: 'serve',
          label: fastBonus ? 'Served fast at the window.' : 'Served at the window.',
        }),
        interactionEffect: nextInteractionEffect(state, {
          kind: 'serveSuccess',
          zone: 'window',
          tone: 'success',
          label: fastBonus ? 'Served fast at the window.' : 'Served at the window.',
        }),
        ...(() => {
          const customerPatch = nextCustomer(customerSequence, state.shiftTimer, 'streetQueue', 'approaching', departureFor(state.currentCustomer, 'servedLeaving'));
          return {
            ...customerPatch,
            trayState: deriveTrayState(customerPatch.currentOrder, customerPatch.preparedItems),
          };
        })(),
      };
    }),

  beginProtection: () =>
    set((state) =>
      state.phase === 'playing'
        ? {
            protectionHeld: true,
            message: 'Shutter charging.',
            workerMovement: createWorkerMovementState('shutter'),
            actionCue: nextActionCue(state, {
              workerZone: 'shutter',
              kind: 'warning',
              label: 'Holding shutter at service window.',
            }),
            interactionEffect: nextInteractionEffect(state, {
              kind: 'shutterCharging',
              zone: 'shutter',
              tone: 'threat',
              label: 'Holding shutter at service window.',
            }),
          }
        : {},
    ),
  endProtection: () =>
    set((state) => (state.phase === 'playing' ? { protectionHeld: false, holdProgress: 0 } : {})),
}));

const baseSetState = useGameStore.setState;
useGameStore.setState = ((partial: Parameters<typeof baseSetState>[0], replace?: Parameters<typeof baseSetState>[1]) => {
  baseSetState(partial as never, replace as never);
  const state = useGameStore.getState();
  baseSetState({ trayState: deriveTrayState(state.currentOrder, state.preparedItems) } as Partial<GameState>);
}) as typeof useGameStore.setState;

export function setPhase4ReadabilityActiveCustomer(
  kind: AnomalyKind,
  options: { customerTimer?: number; threat?: number } = {},
) {
  const anomaly = kind !== 'normal';
  const sequenceByKind: Record<AnomalyKind, number> = {
    normal: 1,
    shadowEyes: 15,
    longArms: 10,
    staticSmile: 5,
  };
  const sequence = sequenceByKind[kind];
  const difficulty = getDifficulty(sequence, 0.35);
  const customer = withEncounterStage(
    generateCustomer(sequence, difficulty, {
      forceAnomaly: anomaly,
      encounterSource: 'streetQueue',
      encounterStage: 'atWindow',
      now: () => 4242,
      rng: () => 0.99,
      ...(anomaly ? { forceAnomalyKind: kind } : {}),
    }),
    'streetQueue',
    'atWindow',
  );

  useGameStore.setState({
    phase: 'playing',
    currentCustomer: customer,
    currentOrder: customer.order,
    preparedItems: [],
    score: 0,
    mistakes: 0,
    threat: options.threat ?? 0,
    served: 0,
    repelled: 0,
    shiftTimer: SHIFT_SECONDS,
    customerTimer: options.customerTimer ?? (anomaly ? ANOMALY_SECONDS : difficulty.customerPatienceMs / 1000),
    holdProgress: 0,
    shutterClosed: false,
    selectedDrink: 'lemonade',
    burgerIngredients: ['bun', 'patty', 'sauce'],
    stations: createCookingStations(),
    customerSequence: sequence,
    message: `Phase 4 readability fixture: ${kind} current customer.`,
    protectionHeld: false,
    shutterTimer: 0,
    gameOverReason: null,
    level: difficulty.level,
    encounterFlow: encounterFlowFor(customer, null),
    workerMovement: createWorkerMovementState('window'),
    interactionEffect: emptyInteractionEffect,
    storagePickup: null,
    trayState: deriveTrayState(customer.order, []),
    actionCue: nextActionCue(useGameStore.getState(), {
      workerZone: 'window',
      kind: 'pick',
      label: `Phase 4 ${kind} customer at window.`,
    }),
  });
}
