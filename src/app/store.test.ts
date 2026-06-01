import { beforeEach, describe, expect, it } from 'vitest';
import { MAX_MISTAKES, MAX_THREAT, SHIFT_SECONDS } from '../features/difficulty/config';
import type { Customer } from '../features/customers/types';
import type { PreparedItem } from '../features/cooking/types';
import type { Order } from '../features/orders/types';
import { INTERIOR_START_ZONE } from '../features/interior/config';
import { useGameStore } from './store';

const normalOrder: Order = {
  id: 'normal-order',
  lines: [{ kind: 'fries', count: 1 }],
  drink: null,
};

const comboOrder: Order = {
  id: 'combo-order',
  lines: [
    { kind: 'fries', count: 1 },
    { kind: 'nuggets', count: 1 },
  ],
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
const comboPartialTray: PreparedItem[] = [{ kind: 'fries', id: 'fries-ready' }];
const comboCompleteTray: PreparedItem[] = [
  { kind: 'fries', id: 'fries-ready' },
  { kind: 'nuggets', id: 'nuggets-ready' },
];

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

function placeWorkerAtStorage() {
  useGameStore.setState({
    workerMovement: {
      currentZone: 'storage',
      targetZone: null,
      status: 'arrived',
      progress: 1,
      elapsed: 0,
      duration: 0,
      lastArrivedZone: 'storage',
    },
  });
}

function stageStoragePickup() {
  placeWorkerAtStorage();
  useGameStore.getState().interactAtCurrentZone();
  const pickup = useGameStore.getState().storagePickup;
  expect(pickup).not.toBeNull();
  return pickup!;
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
    expect(state.actionCue).toMatchObject({
      workerZone: 'window',
      kind: 'pick',
    });
  });

  it('starts shift with durable worker movement state separate from transient action cue', () => {
    useGameStore.getState().startShift();
    const state = useGameStore.getState();

    expect(state.workerMovement).toMatchObject({
      currentZone: INTERIOR_START_ZONE,
      targetZone: null,
      status: 'arrived',
      progress: 1,
      lastArrivedZone: INTERIOR_START_ZONE,
    });
    expect(state.workerMovement).not.toBe(state.actionCue);

    const actionCueBefore = state.actionCue;
    useGameStore.getState().moveWorkerTo('fryer');
    const moving = useGameStore.getState();

    expect(moving.workerMovement).toMatchObject({
      currentZone: INTERIOR_START_ZONE,
      targetZone: 'fryer',
      status: 'moving',
      progress: 0,
    });
    expect(moving.actionCue).toBe(actionCueBefore);
  });

  it('moves the worker to a target zone through tick while service timers and cooking progress continue', () => {
    setEncounter(normalCustomer);
    useGameStore.getState().startCooking('fryer');
    useGameStore.setState({
      workerMovement: {
        currentZone: 'window',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'window',
      },
    });
    const beforeMove = useGameStore.getState();

    useGameStore.getState().moveWorkerTo('fryer');
    useGameStore.getState().tick(0.5);
    const moving = useGameStore.getState();

    expect(moving.workerMovement.status).toBe('moving');
    expect(moving.workerMovement.progress).toBeGreaterThan(0);
    expect(moving.workerMovement.currentZone).toBe('window');
    expect(moving.customerTimer).toBeLessThan(beforeMove.customerTimer);
    expect(moving.shiftTimer).toBeLessThan(beforeMove.shiftTimer);
    expect(moving.stations.fryer.remaining).toBeLessThan(beforeMove.stations.fryer.remaining);

    useGameStore.getState().tick(2);
    const arrived = useGameStore.getState();

    expect(arrived.workerMovement).toMatchObject({
      currentZone: 'fryer',
      targetZone: null,
      status: 'arrived',
      progress: 1,
      lastArrivedZone: 'fryer',
    });
  });

  it('retargets movement without corrupting orders, stations, tray, or timers', () => {
    setEncounter(normalCustomer, { preparedItems: correctTray });
    useGameStore.getState().startCooking('fryer');
    useGameStore.setState({
      workerMovement: {
        currentZone: 'window',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'window',
      },
    });
    useGameStore.getState().moveWorkerTo('fryer');
    useGameStore.getState().tick(0.25);
    const beforeRetarget = useGameStore.getState();

    useGameStore.getState().moveWorkerTo('storage');
    const retargeted = useGameStore.getState();

    expect(retargeted.workerMovement).toMatchObject({
      currentZone: beforeRetarget.workerMovement.currentZone,
      targetZone: 'storage',
      status: 'moving',
      progress: 0,
    });
    expect(retargeted.currentOrder).toEqual(beforeRetarget.currentOrder);
    expect(retargeted.currentCustomer).toEqual(beforeRetarget.currentCustomer);
    expect(retargeted.preparedItems).toEqual(beforeRetarget.preparedItems);
    expect(retargeted.stations).toEqual(beforeRetarget.stations);
    expect(retargeted.customerTimer).toBe(beforeRetarget.customerTimer);
    expect(retargeted.shiftTimer).toBe(beforeRetarget.shiftTimer);
  });

  it('interacts with the current station zone to start and collect cooking through movement state', () => {
    setEncounter(normalCustomer);
    useGameStore.setState({
      workerMovement: {
        currentZone: 'fryer',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'fryer',
      },
    });

    useGameStore.getState().interactAtCurrentZone();
    const started = useGameStore.getState();

    expect(started.stations.fryer.status).toBe('cooking');
    expect(started.actionCue).toMatchObject({
      workerZone: 'fryer',
      kind: 'startCooking',
    });

    useGameStore.getState().tick(5);
    useGameStore.getState().interactAtCurrentZone();
    const collected = useGameStore.getState();

    expect(collected.preparedItems).toHaveLength(1);
    expect(collected.stations.fryer.status).toBe('idle');
    expect(collected.actionCue).toMatchObject({
      workerZone: 'fryer',
      kind: 'pick',
    });
  });

  it('keeps durable worker movement current for legacy direct station actions without coupling it to actionCue', () => {
    setEncounter(normalCustomer);
    useGameStore.setState({
      workerMovement: {
        currentZone: 'window',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'window',
      },
    });

    useGameStore.getState().startCooking('fryer');
    const started = useGameStore.getState();

    expect(started.workerMovement).toMatchObject({
      currentZone: 'fryer',
      targetZone: null,
      status: 'arrived',
      progress: 1,
      lastArrivedZone: 'fryer',
    });
    expect(started.actionCue).toMatchObject({
      workerZone: 'fryer',
      kind: 'startCooking',
    });
    expect(started.workerMovement).not.toBe(started.actionCue);

    useGameStore.getState().tick(5);
    useGameStore.setState({
      workerMovement: {
        currentZone: 'storage',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'storage',
      },
    });
    useGameStore.getState().collectStation('fryer');
    const collected = useGameStore.getState();

    expect(collected.workerMovement).toMatchObject({
      currentZone: 'fryer',
      targetZone: null,
      status: 'arrived',
      progress: 1,
      lastArrivedZone: 'fryer',
    });
    expect(collected.preparedItems).toHaveLength(1);
    expect(collected.actionCue).toMatchObject({
      workerZone: 'fryer',
      kind: 'pick',
    });
    expect(collected.workerMovement).not.toBe(collected.actionCue);
  });

  it('records invalid current-zone interaction feedback without mutating protected gameplay state', () => {
    setEncounter(normalCustomer, { preparedItems: correctTray });
    useGameStore.setState({
      workerMovement: {
        currentZone: 'storage',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'storage',
      },
    });
    const before = useGameStore.getState();

    useGameStore.getState().interactAtCurrentZone();
    const state = useGameStore.getState();

    expect(state.actionCue.sequence).toBe(before.actionCue.sequence + 1);
    expect(state.actionCue).toMatchObject({
      workerZone: 'storage',
      kind: 'warning',
    });
    expect(state.currentOrder).toEqual(before.currentOrder);
    expect(state.currentCustomer).toEqual(before.currentCustomer);
    expect(state.preparedItems).toEqual(before.preparedItems);
    expect(state.stations).toEqual(before.stations);
    expect(state.score).toBe(before.score);
    expect(state.mistakes).toBe(before.mistakes);
    expect(state.threat).toBe(before.threat);
    expect(state.customerTimer).toBe(before.customerTimer);
    expect(state.shiftTimer).toBe(before.shiftTimer);
  });

  it('keeps prep current-zone interaction as a clear warning without mutating protected gameplay state', () => {
    for (const zone of ['prep'] as const) {
      setEncounter(normalCustomer, { preparedItems: correctTray });
      useGameStore.setState({
        workerMovement: {
          currentZone: zone,
          targetZone: null,
          status: 'arrived',
          progress: 1,
          elapsed: 0,
          duration: 0,
          lastArrivedZone: zone,
        },
      });
      const before = useGameStore.getState();

      useGameStore.getState().interactAtCurrentZone();
      const state = useGameStore.getState();

      expect(state.actionCue.sequence).toBe(before.actionCue.sequence + 1);
      expect(state.actionCue).toMatchObject({
        workerZone: zone,
        kind: 'warning',
      });
      expect(state.currentOrder).toEqual(before.currentOrder);
      expect(state.currentCustomer).toEqual(before.currentCustomer);
      expect(state.preparedItems).toEqual(before.preparedItems);
      expect(state.stations).toEqual(before.stations);
      expect(state.score).toBe(before.score);
      expect(state.mistakes).toBe(before.mistakes);
      expect(state.threat).toBe(before.threat);
      expect(state.customerTimer).toBe(before.customerTimer);
      expect(state.shiftTimer).toBe(before.shiftTimer);
      expect(state.protectionHeld).toBe(before.protectionHeld);
      expect(state.holdProgress).toBe(before.holdProgress);
      expect(state.shutterClosed).toBe(before.shutterClosed);
    }
  });

  it('records storage pickup feedback for the active order next needed step without mutating protected service state', () => {
    setEncounter(normalCustomer, { preparedItems: [], customerTimer: 12, shiftTimer: 40 });
    placeWorkerAtStorage();
    const before = useGameStore.getState();

    useGameStore.getState().interactAtCurrentZone();
    const state = useGameStore.getState();

    expect(state.interactionEffect).toMatchObject({
      kind: 'storagePickup',
      zone: 'storage',
      itemKind: 'fries',
      nextZone: 'fryer',
      tone: 'success',
    });
    expect(state.storagePickup).toMatchObject({
      itemKind: 'fries',
      nextZone: 'fryer',
      orderId: normalOrder.id,
    });
    expect(state.actionCue).toMatchObject({
      workerZone: 'storage',
      kind: 'pick',
    });
    expect(state.workerMovement.currentZone).toBe('storage');
    expect(state.currentOrder).toEqual(before.currentOrder);
    expect(state.currentCustomer).toEqual(before.currentCustomer);
    expect(state.preparedItems).toEqual(before.preparedItems);
    expect(state.stations).toEqual(before.stations);
    expect(state.customerTimer).toBe(before.customerTimer);
    expect(state.shiftTimer).toBe(before.shiftTimer);
  });

  it('clears staged storage pickup when serving advances to the next customer and does not attach it to the next order', () => {
    setEncounter(normalCustomer, { preparedItems: [], customerSequence: 1 });
    const stalePickup = stageStoragePickup();
    expect(stalePickup.orderId).toBe(normalOrder.id);

    useGameStore.setState({ preparedItems: correctTray });
    useGameStore.getState().serveCustomer();
    const advanced = useGameStore.getState();

    expect(advanced.currentCustomer?.id).not.toBe(normalCustomer.id);
    expect(advanced.currentOrder?.id).not.toBe(normalOrder.id);
    expect(advanced.storagePickup).toBeNull();

    placeWorkerAtStorage();
    useGameStore.getState().interactAtCurrentZone();
    const nextPickup = useGameStore.getState().storagePickup;

    expect(nextPickup).not.toBeNull();
    expect(nextPickup?.orderId).toBe(useGameStore.getState().currentOrder?.id);
    expect(nextPickup?.orderId).not.toBe(stalePickup.orderId);
  });

  it('clears staged storage pickup when an encounter expires into the next customer', () => {
    setEncounter(normalCustomer, { customerTimer: 0.1, customerSequence: 2 });
    stageStoragePickup();

    useGameStore.getState().tick(0.2);
    const state = useGameStore.getState();

    expect(state.phase).toBe('playing');
    expect(state.currentCustomer?.id).not.toBe(normalCustomer.id);
    expect(state.encounterFlow.lastDeparture).toMatchObject({
      customerId: normalCustomer.id,
      stage: 'expiredLeaving',
    });
    expect(state.storagePickup).toBeNull();
  });

  it('clears staged storage pickup when an anomaly is repelled into the next customer', () => {
    setEncounter(anomalyCustomer, { customerSequence: 2 });
    stageStoragePickup();

    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(2);
    const state = useGameStore.getState();

    expect(state.phase).toBe('playing');
    expect(state.currentCustomer?.id).not.toBe(anomalyCustomer.id);
    expect(state.encounterFlow.lastDeparture).toMatchObject({
      customerId: anomalyCustomer.id,
      stage: 'repelledLeaving',
    });
    expect(state.storagePickup).toBeNull();
  });

  it('clears staged storage pickup through terminal encounter cleanup and reset', () => {
    setEncounter(anomalyCustomer, {
      preparedItems: [],
      customerTimer: 9,
      threat: MAX_THREAT - 30,
    });
    stageStoragePickup();

    useGameStore.getState().serveCustomer();
    const terminal = useGameStore.getState();

    expect(terminal.phase).toBe('gameOver');
    expect(terminal.currentCustomer).toBeNull();
    expect(terminal.currentOrder).toBeNull();
    expect(terminal.storagePickup).toBeNull();

    setEncounter(normalCustomer);
    stageStoragePickup();
    useGameStore.getState().resetToMenu();

    expect(useGameStore.getState().phase).toBe('menu');
    expect(useGameStore.getState().storagePickup).toBeNull();
  });

  it('records invalid interaction feedback without mutating protected state when the worker is moving', () => {
    setEncounter(normalCustomer, {
      preparedItems: correctTray,
      customerTimer: 12,
      shiftTimer: 40,
      protectionHeld: true,
      holdProgress: 0.5,
      shutterClosed: true,
    });
    useGameStore.setState({
      workerMovement: {
        currentZone: 'window',
        targetZone: 'storage',
        status: 'moving',
        progress: 0.3,
        elapsed: 0.3,
        duration: 1,
        lastArrivedZone: 'window',
      },
    });
    const before = useGameStore.getState();

    useGameStore.getState().interactAtCurrentZone();
    const state = useGameStore.getState();

    expect(state.interactionEffect).toMatchObject({
      kind: 'invalid',
      zone: 'storage',
      tone: 'warning',
    });
    expect(state.currentOrder).toEqual(before.currentOrder);
    expect(state.currentCustomer).toEqual(before.currentCustomer);
    expect(state.preparedItems).toEqual(before.preparedItems);
    expect(state.stations).toEqual(before.stations);
    expect(state.score).toBe(before.score);
    expect(state.mistakes).toBe(before.mistakes);
    expect(state.threat).toBe(before.threat);
    expect(state.customerTimer).toBe(before.customerTimer);
    expect(state.shiftTimer).toBe(before.shiftTimer);
    expect(state.protectionHeld).toBe(before.protectionHeld);
    expect(state.holdProgress).toBe(before.holdProgress);
    expect(state.shutterClosed).toBe(before.shutterClosed);
  });

  it('records station cooking, ready, and collected world effects while keeping prepared items authoritative', () => {
    setEncounter(normalCustomer);

    useGameStore.getState().startCooking('fryer');
    const cooking = useGameStore.getState();
    expect(cooking.interactionEffect).toMatchObject({
      kind: 'stationCooking',
      zone: 'fryer',
      itemKind: 'fries',
      tone: 'progress',
    });

    useGameStore.getState().tick(3);
    const ready = useGameStore.getState();
    expect(ready.stations.fryer.status).toBe('ready');
    expect(ready.interactionEffect).toMatchObject({
      kind: 'stationReady',
      zone: 'fryer',
      itemKind: 'fries',
      tone: 'ready',
    });

    useGameStore.getState().collectStation('fryer');
    const collected = useGameStore.getState();
    expect(collected.preparedItems).toHaveLength(1);
    expect(collected.interactionEffect).toMatchObject({
      kind: 'stationCollected',
      zone: 'fryer',
      itemKind: 'fries',
      tone: 'success',
    });
  });

  it('derives tray progress as partial and complete from the active order and prepared items', () => {
    setEncounter({ ...normalCustomer, order: comboOrder }, { currentOrder: comboOrder, preparedItems: comboPartialTray });
    expect(useGameStore.getState().trayState).toMatchObject({
      status: 'partial',
      requiredCount: 2,
      preparedCount: 1,
      missingCount: 1,
    });

    useGameStore.setState({ preparedItems: comboCompleteTray });
    expect(useGameStore.getState().trayState).toMatchObject({
      status: 'complete',
      requiredCount: 2,
      preparedCount: 2,
      missingCount: 0,
    });

    useGameStore.setState({ currentOrder: normalOrder, preparedItems: wrongTray });
    expect(useGameStore.getState().trayState).toMatchObject({
      status: 'wrong',
      requiredCount: 1,
      preparedCount: 1,
    });
  });

  it('records distinct service feedback for correct, early, wrong, no-customer, and anomaly serving outcomes', () => {
    setEncounter(normalCustomer, { preparedItems: correctTray, customerSequence: 1 });
    useGameStore.getState().serveCustomer();
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'serveSuccess',
      zone: 'window',
      tone: 'success',
    });

    setEncounter(normalCustomer, { preparedItems: [], customerSequence: 1 });
    useGameStore.getState().serveCustomer();
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'serveEarly',
      zone: 'window',
      tone: 'error',
    });

    setEncounter(normalCustomer, { preparedItems: wrongTray, customerSequence: 1 });
    useGameStore.getState().serveCustomer();
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'serveWrong',
      zone: 'window',
      tone: 'error',
    });

    useGameStore.setState({
      phase: 'playing',
      currentCustomer: null,
      currentOrder: null,
      workerMovement: {
        currentZone: 'window',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'window',
      },
    });
    useGameStore.getState().interactAtCurrentZone();
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'serveNoCustomer',
      zone: 'window',
      tone: 'warning',
    });

    setEncounter(anomalyCustomer, { preparedItems: correctTray, customerSequence: 1 });
    useGameStore.getState().serveCustomer();
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'serveAnomaly',
      zone: 'window',
      tone: 'threat',
    });
  });

  it('interacts at the service window by serving through the existing order rules', () => {
    setEncounter(normalCustomer, { preparedItems: correctTray, customerSequence: 1 });
    useGameStore.setState({
      workerMovement: {
        currentZone: 'window',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'window',
      },
    });

    useGameStore.getState().interactAtCurrentZone();
    const state = useGameStore.getState();

    expect(state.served).toBe(1);
    expect(state.score).toBeGreaterThanOrEqual(100);
    expect(state.actionCue).toMatchObject({
      workerZone: 'window',
      kind: 'serve',
    });
    expect(state.workerMovement.currentZone).toBe('window');
  });

  it('interacts at the shutter by starting protection without immediately mutating score, mistakes, or threat', () => {
    setEncounter(anomalyCustomer, { customerSequence: 2 });
    useGameStore.setState({
      workerMovement: {
        currentZone: 'shutter',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'shutter',
      },
    });
    const before = useGameStore.getState();

    useGameStore.getState().interactAtCurrentZone();
    const state = useGameStore.getState();

    expect(state.protectionHeld).toBe(true);
    expect(state.holdProgress).toBe(0);
    expect(state.score).toBe(before.score);
    expect(state.mistakes).toBe(before.mistakes);
    expect(state.threat).toBe(before.threat);
    expect(state.actionCue).toMatchObject({
      workerZone: 'shutter',
      kind: 'warning',
    });
    expect(state.workerMovement.currentZone).toBe('shutter');
  });

  it('keeps anomaly pressure, movement, cooking, and visible interaction effects active together', () => {
    setEncounter(anomalyCustomer, { customerTimer: 10, shiftTimer: 40 });
    useGameStore.getState().startCooking('fryer');
    useGameStore.getState().moveWorkerTo('storage');
    useGameStore.getState().interactAtCurrentZone();
    const before = useGameStore.getState();

    useGameStore.getState().tick(0.5);
    const state = useGameStore.getState();

    expect(state.workerMovement.status).toBe('moving');
    expect(state.workerMovement.progress).toBeGreaterThan(before.workerMovement.progress);
    expect(state.stations.fryer.status).toBe('cooking');
    expect(state.stations.fryer.remaining).toBeLessThan(before.stations.fryer.remaining);
    expect(state.customerTimer).toBeLessThan(before.customerTimer);
    expect(state.shiftTimer).toBeLessThan(before.shiftTimer);
    expect(state.threat).toBeGreaterThan(before.threat);
    expect(state.interactionEffect.kind).not.toBe('none');
  });

  it('records shutter defense as explicit interior feedback when reached from a non-window zone', () => {
    setEncounter(anomalyCustomer, { customerSequence: 2 });
    useGameStore.setState({
      workerMovement: {
        currentZone: 'storage',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'storage',
      },
    });

    useGameStore.getState().moveWorkerTo('shutter');
    useGameStore.getState().tick(2);
    useGameStore.getState().interactAtCurrentZone();
    const state = useGameStore.getState();

    expect(state.workerMovement.currentZone).toBe('shutter');
    expect(state.protectionHeld).toBe(true);
    expect(state.interactionEffect).toMatchObject({
      kind: 'shutterCharging',
      zone: 'shutter',
      tone: 'threat',
    });
    expect(state.interactionEffect.kind).not.toBe('invalid');
  });

  it('records distinct anomaly serve, shutter repel, false alarm, and late timeout effects', () => {
    setEncounter(anomalyCustomer, { preparedItems: correctTray, customerSequence: 1 });
    useGameStore.getState().serveCustomer();
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'serveAnomaly',
      zone: 'window',
      tone: 'threat',
    });

    setEncounter(anomalyCustomer, { customerSequence: 2 });
    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(2);
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'shutterRepel',
      zone: 'shutter',
      tone: 'success',
    });

    setEncounter(normalCustomer, { customerSequence: 2 });
    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(2);
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'shutterFalseAlarm',
      zone: 'shutter',
      tone: 'error',
    });

    setEncounter(anomalyCustomer, { customerTimer: 0.2, customerSequence: 2 });
    useGameStore.getState().tick(0.3);
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'anomalyTimeout',
      zone: 'window',
      tone: 'threat',
    });
  });

  it('preserves Phase 4 anomaly and shutter effects when the outcome reaches a terminal threshold', () => {
    setEncounter(anomalyCustomer, {
      customerTimer: 0.1,
      customerSequence: 2,
      threat: MAX_THREAT - 22,
    });
    useGameStore.getState().tick(0.2);
    expect(useGameStore.getState()).toMatchObject({
      phase: 'gameOver',
      gameOverReason: 'Threat reached 100%.',
      interactionEffect: {
        kind: 'anomalyTimeout',
        zone: 'window',
        tone: 'threat',
      },
    });

    setEncounter(normalCustomer, {
      customerSequence: 2,
      mistakes: MAX_MISTAKES - 1,
      holdProgress: 1.99,
      protectionHeld: true,
    });
    useGameStore.getState().tick(0.01);
    expect(useGameStore.getState()).toMatchObject({
      phase: 'gameOver',
      gameOverReason: 'Too many mistakes.',
      interactionEffect: {
        kind: 'shutterFalseAlarm',
        zone: 'shutter',
        tone: 'error',
      },
    });

    setEncounter(anomalyCustomer, {
      customerSequence: 2,
      threat: MAX_THREAT - 0.01,
      holdProgress: 1.99,
      protectionHeld: true,
    });
    useGameStore.getState().tick(0.01);
    expect(useGameStore.getState()).toMatchObject({
      phase: 'gameOver',
      gameOverReason: 'Threat reached 100%.',
      interactionEffect: {
        kind: 'shutterRepel',
        zone: 'shutter',
        tone: 'success',
      },
    });
  });

  it('attaches departed customer context to anomaly and shutter outcome effects', () => {
    setEncounter(anomalyCustomer, { customerSequence: 2 });
    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(2);
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'shutterRepel',
      outcomeCustomer: {
        id: anomalyCustomer.id,
        anomaly: true,
        anomalyKind: 'staticSmile',
        street: {
          archetype: 'nightWorker',
        },
      },
    });
    expect(useGameStore.getState().currentCustomer?.id).not.toBe(anomalyCustomer.id);

    setEncounter(anomalyCustomer, { customerTimer: 0.2, customerSequence: 2 });
    useGameStore.getState().tick(0.3);
    expect(useGameStore.getState().interactionEffect).toMatchObject({
      kind: 'anomalyTimeout',
      outcomeCustomer: {
        id: anomalyCustomer.id,
        anomalyKind: 'staticSmile',
      },
    });
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

  it('moves the worker cue from station start to ready and collect feedback', () => {
    setEncounter(normalCustomer);

    useGameStore.getState().startCooking('fryer');
    const started = useGameStore.getState();
    expect(started.actionCue).toMatchObject({
      workerZone: 'fryer',
      kind: 'startCooking',
    });

    useGameStore.getState().tick(3);
    const ready = useGameStore.getState();
    expect(ready.stations.fryer.status).toBe('ready');
    expect(ready.actionCue).toMatchObject({
      workerZone: 'fryer',
      kind: 'ready',
    });

    useGameStore.getState().collectStation('fryer');
    const collected = useGameStore.getState();
    expect(collected.preparedItems).toHaveLength(1);
    expect(collected.actionCue).toMatchObject({
      workerZone: 'fryer',
      kind: 'pick',
    });
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
