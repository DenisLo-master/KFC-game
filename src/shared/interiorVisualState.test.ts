import { describe, expect, it } from 'vitest';
import { useGameStore } from '../app/store';
import { getInteriorVisualState } from './interiorVisualState';

describe('interior visual state mapping', () => {
  it('derives worker path, arrival, and action availability from durable workerMovement', () => {
    useGameStore.getState().resetToMenu();
    useGameStore.getState().startShift();

    const started = getInteriorVisualState(useGameStore.getState());

    expect(started.worker).toMatchObject({
      currentZone: 'window',
      targetZone: null,
      status: 'arrived',
      progress: 1,
      visualPosition: { x: 84, y: 26 },
      arrived: true,
      moving: false,
      pathVisible: false,
      availableAction: 'serve',
    });
    expect(started.zones.window).toMatchObject({
      connectedRoom: 'service',
      workerPresent: true,
      actionAvailable: true,
    });

    useGameStore.getState().moveWorkerTo('storage');
    const moving = getInteriorVisualState(useGameStore.getState());

    expect(moving.worker).toMatchObject({
      currentZone: 'window',
      targetZone: 'storage',
      status: 'moving',
      progress: 0,
      visualPosition: { x: 84, y: 26 },
      arrived: false,
      moving: true,
      pathVisible: true,
      path: ['window', 'storage'],
      availableAction: 'none',
    });
    expect(moving.zones.storage).toMatchObject({
      connectedRoom: 'storage',
      workerTarget: true,
      actionAvailable: false,
    });
    expect(moving.zones.window.workerPresent).toBe(true);

    useGameStore.getState().tick(0.625);
    const halfway = getInteriorVisualState(useGameStore.getState());

    expect(halfway.worker).toMatchObject({
      currentZone: 'window',
      targetZone: 'storage',
      status: 'moving',
      progress: 0.5,
      visualPosition: { x: 45, y: 25.5 },
      moving: true,
      arrived: false,
    });

    useGameStore.getState().tick(2);
    const arrived = getInteriorVisualState(useGameStore.getState());

    expect(arrived.worker).toMatchObject({
      currentZone: 'storage',
      targetZone: null,
      status: 'arrived',
      arrived: true,
      moving: false,
      pathVisible: false,
      availableAction: 'storage',
    });
    expect(arrived.zones.storage).toMatchObject({
      workerPresent: true,
      workerTarget: false,
      actionAvailable: true,
    });
  });

  it('exposes Phase 3 interaction effects and tray state for in-world rendering', () => {
    useGameStore.getState().resetToMenu();
    useGameStore.getState().startShift();
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

    useGameStore.getState().interactAtCurrentZone();
    const pickup = getInteriorVisualState(useGameStore.getState());

    expect(pickup.effect).toMatchObject({
      kind: 'storagePickup',
      zone: 'storage',
      visible: true,
      tone: 'success',
    });
    expect(pickup.storage).toMatchObject({
      pickupVisible: true,
      itemKind: expect.any(String),
    });

    useGameStore.getState().startCooking('fryer');
    const cooking = getInteriorVisualState(useGameStore.getState());
    expect(cooking.stations.fryer.effect).toMatchObject({
      status: 'cooking',
      visible: true,
      tone: 'progress',
    });

    useGameStore.getState().tick(3);
    const ready = getInteriorVisualState(useGameStore.getState());
    expect(ready.stations.fryer.effect).toMatchObject({
      status: 'ready',
      visible: true,
      tone: 'ready',
    });

    useGameStore.getState().collectStation('fryer');
    const collected = getInteriorVisualState(useGameStore.getState());
    expect(collected.stations.fryer.effect).toMatchObject({
      status: 'collected',
      visible: true,
      tone: 'success',
    });
    expect(collected.tray).toMatchObject({
      status: 'complete',
      preparedCount: 1,
      missingCount: 0,
    });

    useGameStore.getState().serveCustomer();
    const served = getInteriorVisualState(useGameStore.getState());
    expect(served.serviceWindow).toMatchObject({
      feedback: 'success',
      visible: true,
    });
  });

  it('exposes anomaly pressure and shutter defense in the connected interior while the worker is away', () => {
    useGameStore.getState().resetToMenu();
    useGameStore.getState().startShift();
    useGameStore.setState({
      currentCustomer: {
        id: 'anomaly-visual',
        name: 'Static',
        anomaly: true,
        anomalyKind: 'staticSmile',
        order: {
          id: 'anomaly-order',
          lines: [{ kind: 'fries', count: 1 }],
          drink: null,
        },
        street: {
          archetype: 'nightWorker',
          movementIntent: 'waiting',
          futureVisitor: true,
          anomalyCue: {
            kind: 'staticSmile',
            descriptor: 'smile stays fixed while the rest of the face relaxes',
          },
          source: 'streetQueue',
          encounterStage: 'atWindow',
        },
      },
      workerMovement: {
        currentZone: 'storage',
        targetZone: null,
        status: 'arrived',
        progress: 1,
        elapsed: 0,
        duration: 0,
        lastArrivedZone: 'storage',
      },
      threat: 18,
      customerTimer: 6,
      protectionHeld: false,
      holdProgress: 0,
      shutterClosed: false,
    });
    useGameStore.getState().startCooking('fryer');
    useGameStore.getState().moveWorkerTo('storage');

    const state = getInteriorVisualState(useGameStore.getState());

    expect(state.windowPressure).toMatchObject({
      visible: true,
      anomalyVisible: true,
      anomalyKind: 'staticSmile',
      workerAwayFromWindow: true,
      defenseAvailable: true,
      urgency: 'threat',
    });
    expect(state.shutterDefense).toMatchObject({
      representedInWorld: true,
      visible: true,
      available: true,
      status: 'ready',
      tone: 'threat',
    });
  });

  it('keeps outcome window pressure tied to the departed anomaly after the next customer is generated', () => {
    useGameStore.getState().resetToMenu();
    useGameStore.getState().startShift();
    useGameStore.setState({
      currentCustomer: {
        id: 'departed-static',
        name: 'Static',
        anomaly: true,
        anomalyKind: 'staticSmile',
        order: {
          id: 'departed-order',
          lines: [{ kind: 'fries', count: 1 }],
          drink: null,
        },
        street: {
          archetype: 'nightWorker',
          movementIntent: 'waiting',
          futureVisitor: true,
          anomalyCue: {
            kind: 'staticSmile',
            descriptor: 'smile stays fixed while the rest of the face relaxes',
          },
          source: 'streetQueue',
          encounterStage: 'atWindow',
        },
      },
      customerSequence: 2,
    });

    useGameStore.getState().beginProtection();
    useGameStore.getState().tick(2);
    const state = getInteriorVisualState(useGameStore.getState());

    expect(useGameStore.getState().currentCustomer?.id).not.toBe('departed-static');
    expect(state.windowPressure).toMatchObject({
      visible: true,
      anomalyVisible: true,
      anomalyKind: 'staticSmile',
      status: 'repelled',
      tone: 'success',
    });
  });
});
