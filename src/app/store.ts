import { create } from 'zustand';
import { createCookingStations, COOKING_DURATIONS } from '../features/cooking/config';
import type {
  BurgerIngredient,
  CookableKind,
  CookingStation,
  DrinkFlavor,
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
import { matchOrder } from '../features/orders/matcher';
import type { Order } from '../features/orders/types';
import { getStreetVisualState, type StreetVisualState } from '../shared/sceneVisualState';

export type GamePhase = 'menu' | 'playing' | 'paused' | 'victory' | 'gameOver';
export type WorkerZone = 'storage' | 'fryer' | 'grill' | 'oven' | 'drink' | 'window' | 'shutter';
export type ActionCueKind = 'idle' | 'pick' | 'startCooking' | 'ready' | 'serve' | 'error' | 'warning';

export type ActionCue = {
  workerZone: WorkerZone;
  kind: ActionCueKind;
  label: string;
  sequence: number;
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
  startShift: () => void;
  pause: () => void;
  resume: () => void;
  resetToMenu: () => void;
  tick: (delta: number) => void;
  startCooking: (station: StationId, productOverride?: CookableKind) => void;
  collectStation: (station: StationId) => void;
  clearPrepared: () => void;
  selectDrink: (drink: DrinkFlavor) => void;
  toggleBurgerIngredient: (ingredient: BurgerIngredient) => void;
  serveCustomer: () => void;
  beginProtection: () => void;
  endProtection: () => void;
};

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
};

function nextActionCue(state: Pick<GameState, 'actionCue'>, patch: Omit<ActionCue, 'sequence'>): ActionCue {
  return {
    ...patch,
    sequence: state.actionCue.sequence + 1,
  };
}

function terminalEncounterCleanup(): Partial<GameState> {
  return {
    currentCustomer: null,
    currentOrder: null,
    preparedItems: [],
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

export const useGameStore = create<GameState>((set, get) => ({
  ...initialState,

  startShift: () =>
    set(() => ({
      ...initialState,
      phase: 'playing',
      customerSequence: 1,
      message: 'First visitor steps from the pre-shift street to the service window.',
      actionCue: nextActionCue(initialState, {
        workerZone: 'window',
        kind: 'pick',
        label: 'Read the first order at the service window.',
      }),
      ...nextCustomer(1, SHIFT_SECONDS, 'preShiftStreet', 'atWindow'),
    })),

  pause: () => set((state) => (state.phase === 'playing' ? { phase: 'paused' } : {})),
  resume: () => set((state) => (state.phase === 'paused' ? { phase: 'playing' } : {})),
  resetToMenu: () => set(() => ({ ...initialState, stations: createCookingStations() })),

  tick: (delta: number) => {
    const state = get();
    if (state.phase !== 'playing') return;

    const stations = {} as Record<StationId, CookingStation>;
    let readyStationCue: { id: StationId; label: string } | null = null;

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
      } else {
        mistakes += 1;
        score = Math.max(0, score - 50);
        message = 'False alarm: normal customer scared away. -50 score.';
        actionCue = nextActionCue(state, {
          workerZone: 'shutter',
          kind: 'error',
          label: 'False shutter alarm.',
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
      } else {
        mistakes += 1;
        score = Math.max(0, score - 75);
        message = 'Customer left without food. -75 score.';
        actionCue = nextActionCue(state, {
          workerZone: 'window',
          kind: 'error',
          label: 'Customer left hungry.',
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
      ...customerPatch,
    });
  },

  startCooking: (stationId, productOverride) =>
    set((state) => {
      if (state.phase !== 'playing') return {};
      const station = state.stations[stationId];
      if (station.status !== 'idle') {
        return {
          actionCue: nextActionCue(state, {
            workerZone: stationId,
            kind: 'warning',
            label: `${station.label} is already ${station.status}.`,
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
        actionCue: nextActionCue(state, {
          workerZone: stationId,
          kind: 'startCooking',
          label: `${station.label} started ${details.product}.`,
        }),
      };
    }),

  collectStation: (stationId) =>
    set((state) => {
      if (state.phase !== 'playing') return {};
      const station = state.stations[stationId];
      if (station.status !== 'ready') {
        return {
          actionCue: nextActionCue(state, {
            workerZone: stationId,
            kind: 'warning',
            label: `${station.label} is not ready yet.`,
          }),
        };
      }
      const item = itemFromStation(station);

      return {
        preparedItems: item ? [...state.preparedItems, item] : state.preparedItems,
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
        message: item ? 'Item added to tray.' : state.message,
        actionCue: nextActionCue(state, {
          workerZone: stationId,
          kind: 'pick',
          label: item ? `${station.label} item moved to tray.` : `${station.label} cleared.`,
        }),
      };
    }),

  clearPrepared: () =>
    set((state) =>
      state.phase === 'playing'
        ? {
            preparedItems: [],
            message: 'Tray cleared.',
            actionCue: nextActionCue(state, {
              workerZone: 'storage',
              kind: 'pick',
              label: 'Tray cleared at storage.',
            }),
          }
        : {},
    ),
  selectDrink: (selectedDrink) =>
    set((state) =>
      state.phase === 'playing'
        ? {
            selectedDrink,
            actionCue: nextActionCue(state, {
              workerZone: 'drink',
              kind: 'pick',
              label: `${selectedDrink} selected.`,
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
          actionCue: nextActionCue(state, {
            workerZone: 'storage',
            kind: 'warning',
            label: `${ingredient} stays on the burger.`,
          }),
        };
      }

      return {
        burgerIngredients: state.burgerIngredients.includes(ingredient)
          ? state.burgerIngredients.filter((item) => item !== ingredient)
          : [...state.burgerIngredients, ingredient],
        actionCue: nextActionCue(state, {
          workerZone: 'storage',
          kind: 'pick',
          label: `${ingredient} toggled.`,
        }),
      };
    }),

  serveCustomer: () =>
    set((state) => {
      if (state.phase !== 'playing' || !state.currentCustomer || !state.currentOrder) return {};
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
          actionCue: nextActionCue(state, {
            workerZone: 'window',
            kind: 'error',
            label: 'Wrong target served.',
          }),
          ...(phase === 'playing'
            ? nextCustomer(customerSequence, state.shiftTimer, 'streetQueue', 'approaching', departureFor(state.currentCustomer, 'replaced'))
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
          actionCue: nextActionCue(state, {
            workerZone: 'window',
            kind: 'error',
            label: result.reason,
          }),
          ...(phase === 'gameOver' ? terminalEncounterCleanup() : { preparedItems: [] }),
        };
      }

      const fastBonus = state.customerTimer >= 10 ? 25 : 0;

      return {
        served: state.served + 1,
        score: state.score + 100 + fastBonus,
        customerSequence,
        message: fastBonus ? 'Correct order. Fast bonus +25.' : 'Correct order. +100 score.',
        actionCue: nextActionCue(state, {
          workerZone: 'window',
          kind: 'serve',
          label: fastBonus ? 'Served fast at the window.' : 'Served at the window.',
        }),
        ...nextCustomer(customerSequence, state.shiftTimer, 'streetQueue', 'approaching', departureFor(state.currentCustomer, 'servedLeaving')),
      };
    }),

  beginProtection: () =>
    set((state) =>
      state.phase === 'playing'
        ? {
            protectionHeld: true,
            message: 'Shutter charging.',
            actionCue: nextActionCue(state, {
              workerZone: 'shutter',
              kind: 'warning',
              label: 'Holding shutter at service window.',
            }),
          }
        : {},
    ),
  endProtection: () =>
    set((state) => (state.phase === 'playing' ? { protectionHeld: false, holdProgress: 0 } : {})),
}));

export function setPhase4ReadabilityActiveCustomer(kind: AnomalyKind) {
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
    threat: 0,
    served: 0,
    repelled: 0,
    shiftTimer: SHIFT_SECONDS,
    customerTimer: anomaly ? ANOMALY_SECONDS : difficulty.customerPatienceMs / 1000,
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
    actionCue: nextActionCue(useGameStore.getState(), {
      workerZone: 'window',
      kind: 'pick',
      label: `Phase 4 ${kind} customer at window.`,
    }),
  });
}
