import { beforeEach, describe, expect, it } from 'vitest';
import { MAX_MISTAKES, MAX_THREAT, SHIFT_SECONDS } from '../features/difficulty/config';
import type { Customer } from '../features/customers/types';
import type { PreparedItem } from '../features/cooking/types';
import type { Order } from '../features/orders/types';
import { useGameStore } from './store';

const normalOrder: Order = {
  id: 'normal-order',
  lines: [{ kind: 'fries', count: 1 }],
  drink: null,
};

const normalCustomer: Customer = {
  id: 'normal-customer',
  name: 'Mason',
  anomaly: false,
  anomalyKind: 'normal',
  order: normalOrder,
  street: {
    archetype: 'student',
    movementIntent: 'approachingWindow',
    futureVisitor: true,
    anomalyCue: null,
    source: 'streetQueue',
    encounterStage: 'approaching',
  },
};

const anomalyCustomer: Customer = {
  id: 'anomaly-customer',
  name: 'Static',
  anomaly: true,
  anomalyKind: 'staticSmile',
  order: normalOrder,
  street: {
    archetype: 'nightWorker',
    movementIntent: 'waiting',
    futureVisitor: true,
    anomalyCue: {
      kind: 'staticSmile',
      descriptor: 'smile stays fixed while the rest of the face relaxes',
    },
    source: 'streetQueue',
    encounterStage: 'waiting',
  },
};

const correctTray: PreparedItem[] = [{ kind: 'fries', id: 'fries-ready' }];
const wrongTray: PreparedItem[] = [{ kind: 'nuggets', id: 'nuggets-ready' }];

function setEncounter(customer: Customer, patch: Partial<ReturnType<typeof useGameStore.getState>> = {}) {
  useGameStore.setState({
      phase: 'playing',
      currentCustomer: customer,
      currentOrder: customer.order,
      preparedItems: [],
    customerTimer: customer.anomaly ? 10 : 12,
    shiftTimer: 40,
    mistakes: 0,
    threat: 0,
    score: 0,
    served: 0,
    repelled: 0,
    holdProgress: 0,
    protectionHeld: false,
    gameOverReason: null,
    ...patch,
  });
}

describe('game store core loop', () => {
  beforeEach(() => {
    useGameStore.getState().resetToMenu();
  });

  it('starts a 90-second shift with a deterministic first normal customer', () => {
    useGameStore.getState().startShift();
    const state = useGameStore.getState();

    expect(state.phase).toBe('playing');
    expect(state.shiftTimer).toBe(SHIFT_SECONDS);
    expect(state.currentCustomer?.anomaly).toBe(false);
    expect(state.currentOrder?.lines.length).toBeGreaterThan(0);
    expect(state.score).toBe(0);
    expect(state.mistakes).toBe(0);
    expect(state.threat).toBe(0);
  });

  it('starts shift with first encounter sourced from the pre-shift street flow', () => {
    useGameStore.getState().startShift();
    const state = useGameStore.getState();

    expect(state.currentCustomer?.street.source).toBe('preShiftStreet');
    expect(state.currentCustomer?.street.encounterStage).toBe('atWindow');
    expect(state.encounterFlow).toMatchObject({
      activeCustomerId: state.currentCustomer?.id,
      activeStage: 'atWindow',
      activeSource: 'preShiftStreet',
      lastDeparture: null,
    });
    expect(state.score).toBe(0);
    expect(state.mistakes).toBe(0);
    expect(state.threat).toBe(0);
  });

  it('keeps menu street observation non-punitive and exposes pre-shift street read', () => {
    const before = useGameStore.getState();

    useGameStore.getState().tick(12);
    const state = useGameStore.getState();

    expect(state.phase).toBe('menu');
    expect(state.preShiftStreet.ambience).toContain('wetAsphalt');
    expect(state.preShiftStreet.workerIdentity.badgeVisible).toBe(true);
    expect(state.preShiftStreet.pedestrians.some((pedestrian) => pedestrian.futureVisitor)).toBe(true);
    expect(state.score).toBe(before.score);
    expect(state.mistakes).toBe(before.mistakes);
    expect(state.threat).toBe(before.threat);
    expect(state.shiftTimer).toBe(before.shiftTimer);
    expect(state.customerTimer).toBe(before.customerTimer);
    expect(state.gameOverReason).toBeNull();
  });

  it('serves a correct normal order, scores, and advances the loop', () => {
    setEncounter(normalCustomer, { preparedItems: correctTray, customerSequence: 1 });

    useGameStore.getState().serveCustomer();
    const state = useGameStore.getState();

    expect(state.phase).toBe('playing');
    expect(state.served).toBe(1);
    expect(state.score).toBeGreaterThanOrEqual(100);
    expect(state.currentCustomer?.id).not.toBe(normalCustomer.id);
    expect(state.encounterFlow.lastDeparture).toMatchObject({
      customerId: normalCustomer.id,
      stage: 'servedLeaving',
    });
    expect(state.encounterFlow.activeStage).toBe('approaching');
    expect(state.currentCustomer?.street.source).toBe('streetQueue');
  });

  it('records a wrong normal serve as a mistake without ending a healthy shift', () => {
    setEncounter(normalCustomer, { preparedItems: [] });

    useGameStore.getState().serveCustomer();
    const state = useGameStore.getState();

    expect(state.phase).toBe('playing');
    expect(state.mistakes).toBe(1);
    expect(state.score).toBe(0);
    expect(state.preparedItems).toEqual([]);
    expect(state.message).toContain('-50 score');
  });

  it('serving an anomaly raises both mistake and threat toward gameOver', () => {
    setEncounter(anomalyCustomer, { threat: MAX_THREAT - 20 });

    useGameStore.getState().serveCustomer();
    const state = useGameStore.getState();

    expect(state.phase).toBe('gameOver');
    expect(state.mistakes).toBe(1);
    expect(state.threat).toBe(MAX_THREAT);
    expect(state.gameOverReason).toContain('Threat');
  });

  it('cleans up the terminal encounter when serving an anomaly reaches the threat cap', () => {
    setEncounter(anomalyCustomer, {
      preparedItems: correctTray,
      customerTimer: 9,
      threat: MAX_THREAT - 30,
    });

    useGameStore.getState().serveCustomer();
    const state = useGameStore.getState();

    expect(state.phase).toBe('gameOver');
    expect(state.threat).toBe(MAX_THREAT);
    expect(state.currentCustomer).toBeNull();
    expect(state.currentOrder).toBeNull();
    expect(state.customerTimer).toBe(0);
    expect(state.preparedItems).toEqual([]);
  });

  it('cleans up the terminal encounter when a wrong normal serve reaches max mistakes', () => {
    setEncounter(normalCustomer, {
      preparedItems: wrongTray,
      customerTimer: 8,
      mistakes: MAX_MISTAKES - 1,
    });

    useGameStore.getState().serveCustomer();
    const state = useGameStore.getState();

    expect(state.phase).toBe('gameOver');
    expect(state.mistakes).toBe(MAX_MISTAKES);
    expect(state.currentCustomer).toBeNull();
    expect(state.currentOrder).toBeNull();
    expect(state.customerTimer).toBe(0);
    expect(state.preparedItems).toEqual([]);
  });

  it('repels an anomaly after a continuous 2-second shutter hold', () => {
    setEncounter(anomalyCustomer, { customerSequence: 2 });

    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(1.99);
    expect(useGameStore.getState().repelled).toBe(0);

    useGameStore.getState().tick(0.01);
    const state = useGameStore.getState();

    expect(state.repelled).toBe(1);
    expect(state.score).toBe(150);
    expect(state.holdProgress).toBe(0);
    expect(state.currentCustomer?.id).not.toBe(anomalyCustomer.id);
    expect(state.encounterFlow.lastDeparture).toMatchObject({
      customerId: anomalyCustomer.id,
      stage: 'repelledLeaving',
    });
    expect(state.encounterFlow.activeStage).toBe('approaching');
  });

  it('does not preserve partial shutter progress after early release', () => {
    setEncounter(anomalyCustomer);

    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(1.5);
    useGameStore.getState().endProtection();
    const state = useGameStore.getState();

    expect(state.repelled).toBe(0);
    expect(state.protectionHeld).toBe(false);
    expect(state.holdProgress).toBe(0);
  });

  it('late anomaly protection raises threat and advances the encounter', () => {
    setEncounter(anomalyCustomer, { customerTimer: 0.2, customerSequence: 2 });

    useGameStore.getState().tick(0.3);
    const state = useGameStore.getState();

    expect(state.phase).toBe('playing');
    expect(state.threat).toBeGreaterThan(22);
    expect(state.currentCustomer?.id).not.toBe(anomalyCustomer.id);
    expect(state.encounterFlow.lastDeparture).toMatchObject({
      customerId: anomalyCustomer.id,
      stage: 'expiredLeaving',
    });
    expect(state.encounterFlow.activeStage).toBe('approaching');
  });

  it('pause freezes timers, pressure, cooking progress, and shutter progress', () => {
    setEncounter(anomalyCustomer);
    useGameStore.getState().startCooking('fryer');
    useGameStore.getState().tick(0.5);
    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(0.5);
    useGameStore.getState().pause();
    const paused = useGameStore.getState();

    useGameStore.getState().tick(5);
    const state = useGameStore.getState();

    expect(state.phase).toBe('paused');
    expect(state.shiftTimer).toBe(paused.shiftTimer);
    expect(state.customerTimer).toBe(paused.customerTimer);
    expect(state.threat).toBe(paused.threat);
    expect(state.holdProgress).toBe(paused.holdProgress);
    expect(state.stations.fryer.remaining).toBe(paused.stations.fryer.remaining);
  });

  it('does not allow paused tray collection to mutate the attempt', () => {
    setEncounter(normalCustomer);
    useGameStore.getState().startCooking('fryer');
    useGameStore.getState().tick(3);
    useGameStore.getState().pause();

    useGameStore.getState().collectStation('fryer');
    const state = useGameStore.getState();

    expect(state.preparedItems).toEqual([]);
    expect(state.stations.fryer.status).toBe('ready');
  });

  it('ends in victory when the timer reaches zero without gameOver thresholds', () => {
    setEncounter(normalCustomer, {
      shiftTimer: 0.1,
      customerTimer: 5,
      holdProgress: 1.2,
      protectionHeld: true,
      shutterClosed: true,
      shutterTimer: 0.4,
      encounterFlow: {
        activeCustomerId: normalCustomer.id,
        activeStage: 'waiting',
        activeSource: 'streetQueue',
        lastDeparture: null,
      },
    });

    useGameStore.getState().tick(0.2);
    const state = useGameStore.getState();

    expect(state.phase).toBe('victory');
    expect(state.shiftTimer).toBe(0);
    expect(state.currentCustomer).toBeNull();
    expect(state.currentOrder).toBeNull();
    expect(state.customerTimer).toBe(0);
    expect(state.preparedItems).toEqual([]);
    expect(state.holdProgress).toBe(0);
    expect(state.protectionHeld).toBe(false);
    expect(state.shutterClosed).toBe(false);
    expect(state.shutterTimer).toBe(0);
    expect(state.encounterFlow).toEqual({
      activeCustomerId: null,
      activeStage: null,
      activeSource: null,
      lastDeparture: null,
    });
  });

  it('keeps gameOver precedence when a failure and timer expiry happen in the same tick', () => {
    setEncounter(normalCustomer, {
      shiftTimer: 0.1,
      customerTimer: 0.1,
      mistakes: MAX_MISTAKES - 1,
    });

    useGameStore.getState().tick(0.2);
    const state = useGameStore.getState();

    expect(state.phase).toBe('gameOver');
    expect(state.gameOverReason).toContain('mistakes');
  });

  it('does not advance to a fresh encounter when a timeout causes gameOver', () => {
    setEncounter(normalCustomer, {
      customerTimer: 0.1,
      customerSequence: 4,
      mistakes: MAX_MISTAKES - 1,
    });

    useGameStore.getState().tick(0.2);
    const state = useGameStore.getState();

    expect(state.phase).toBe('gameOver');
    expect(state.currentCustomer).toBeNull();
    expect(state.currentOrder).toBeNull();
    expect(state.customerTimer).toBe(0);
  });

  it('does not advance to a fresh encounter when a false shutter alarm causes gameOver', () => {
    setEncounter(normalCustomer, {
      customerSequence: 4,
      mistakes: MAX_MISTAKES - 1,
      holdProgress: 1.99,
      protectionHeld: true,
    });

    useGameStore.getState().tick(0.01);
    const state = useGameStore.getState();

    expect(state.phase).toBe('gameOver');
    expect(state.currentCustomer).toBeNull();
    expect(state.currentOrder).toBeNull();
    expect(state.customerTimer).toBe(0);
    expect(state.shutterClosed).toBe(false);
    expect(state.shutterTimer).toBe(0);
  });

  it('does not allow paused tray and prep controls to mutate the attempt', () => {
    setEncounter(normalCustomer, {
      preparedItems: correctTray,
      selectedDrink: 'soda',
      burgerIngredients: ['bun', 'patty', 'sauce'],
      protectionHeld: true,
      holdProgress: 1.2,
      message: 'Paused snapshot.',
    });
    useGameStore.getState().pause();

    useGameStore.getState().clearPrepared();
    useGameStore.getState().selectDrink('juice');
    useGameStore.getState().toggleBurgerIngredient('sauce');
    useGameStore.getState().endProtection();
    const state = useGameStore.getState();

    expect(state.phase).toBe('paused');
    expect(state.preparedItems).toEqual(correctTray);
    expect(state.selectedDrink).toBe('soda');
    expect(state.burgerIngredients).toEqual(['bun', 'patty', 'sauce']);
    expect(state.protectionHeld).toBe(true);
    expect(state.holdProgress).toBe(1.2);
    expect(state.message).toBe('Paused snapshot.');
  });

  it('does not allow terminal tray and prep controls to mutate gameOver', () => {
    setEncounter(normalCustomer, {
      phase: 'gameOver',
      preparedItems: correctTray,
      selectedDrink: 'soda',
      burgerIngredients: ['bun', 'patty', 'sauce'],
      protectionHeld: true,
      holdProgress: 1.2,
      message: 'Terminal snapshot.',
    });

    useGameStore.getState().clearPrepared();
    useGameStore.getState().selectDrink('juice');
    useGameStore.getState().toggleBurgerIngredient('sauce');
    useGameStore.getState().endProtection();
    const state = useGameStore.getState();

    expect(state.phase).toBe('gameOver');
    expect(state.preparedItems).toEqual(correctTray);
    expect(state.selectedDrink).toBe('soda');
    expect(state.burgerIngredients).toEqual(['bun', 'patty', 'sauce']);
    expect(state.protectionHeld).toBe(true);
    expect(state.holdProgress).toBe(1.2);
    expect(state.message).toBe('Terminal snapshot.');
  });

  it('reset returns to a clean menu state', () => {
    setEncounter(anomalyCustomer, { score: 150, mistakes: 1, threat: 20, repelled: 1 });

    useGameStore.getState().resetToMenu();
    const state = useGameStore.getState();

    expect(state.phase).toBe('menu');
    expect(state.currentCustomer).toBeNull();
    expect(state.currentOrder).toBeNull();
    expect(state.score).toBe(0);
    expect(state.mistakes).toBe(0);
    expect(state.threat).toBe(0);
    expect(state.shiftTimer).toBe(SHIFT_SECONDS);
  });
});
