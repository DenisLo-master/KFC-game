import { describe, expect, it } from 'vitest';
import { PROTECTION_HOLD_SECONDS } from '../features/difficulty/config';
import { getSceneVisualState } from './sceneVisualState';

describe('scene visual state contract', () => {
  it('maps all approved ordinary archetypes to non-threatening render presentations', () => {
    const state = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'menu',
    });

    expect(state.street.pedestrians.map((pedestrian) => pedestrian.archetype)).toEqual([
      'student',
      'officeWorker',
      'courier',
      'shopper',
      'olderPerson',
      'tiredParent',
      'nightWorker',
      'teenager',
    ]);
    expect(state.street.pedestrians.every((pedestrian) => pedestrian.presentation.threatRead === 'ordinary')).toBe(true);
    expect(state.street.pedestrians.map((pedestrian) => pedestrian.presentation.primaryMarker)).toEqual([
      'backpack',
      'briefcase',
      'deliveryBox',
      'shoppingBag',
      'walkingCane',
      'childHand',
      'workCap',
      'hoodie',
    ]);
  });

  it('keeps worker identity explicit for pre-shift and active service contexts', () => {
    const preShift = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'menu',
    });
    const active = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'playing',
    });

    expect(preShift.street.workerIdentity).toMatchObject({
      uniform: 'darkOliveYellow',
      badgeVisible: true,
      tiredNightShift: true,
      serviceContext: 'kioskWindow',
      accessory: 'nameBadge',
      protocolCue: 'shiftChecklist',
    });
    expect(active.street.workerIdentity).toEqual(preShift.street.workerIdentity);
  });

  it('maps anomaly cues as almost-ordinary visible descriptors without leaking them to normal visitors', () => {
    const normal = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'playing',
      customerStreet: {
        archetype: 'shopper',
        movementIntent: 'waiting',
        futureVisitor: true,
        anomalyCue: null,
        source: 'streetQueue',
        encounterStage: 'atWindow',
      },
    });
    const shadow = getSceneVisualState({
      anomalyKind: 'shadowEyes',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'playing',
      customerStreet: {
        archetype: 'officeWorker',
        movementIntent: 'waiting',
        futureVisitor: true,
        anomalyCue: {
          kind: 'shadowEyes',
          descriptor: 'eyes stay black when the kiosk sign catches the face',
        },
        source: 'streetQueue',
        encounterStage: 'atWindow',
      },
    });

    expect(normal.street.activeVisitor?.suspiciousCue).toBeNull();
    expect(normal.street.activeVisitor?.presentation.threatRead).toBe('ordinary');
    expect(shadow.street.activeVisitor?.presentation.threatRead).toBe('almostOrdinaryWrong');
    expect(shadow.street.activeVisitor?.presentation.cueMarker).toBe('unblinkingDarkEyes');
    expect(shadow.street.pedestrians.every((pedestrian) => pedestrian.suspiciousCue === null)).toBe(true);
  });

  it('exposes pre-shift street ambience, worker identity, and ordinary pedestrian states', () => {
    const state = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'menu',
    });

    expect(state.street.ambience).toEqual(
      expect.arrayContaining(['wetAsphalt', 'kioskSignGlow', 'distantWindows', 'steamVent']),
    );
    expect(state.street.workerIdentity).toMatchObject({
      uniform: 'darkOliveYellow',
      badgeVisible: true,
      serviceContext: 'kioskWindow',
    });
    expect(state.street.pedestrians.length).toBeGreaterThanOrEqual(3);
    expect(state.street.pedestrians.some((pedestrian) => pedestrian.futureVisitor)).toBe(true);
    expect(state.street.suspiciousCues).toEqual([]);
  });

  it('keeps ordinary and suspicious street cues distinct and testable', () => {
    const state = getSceneVisualState({
      anomalyKind: 'staticSmile',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'playing',
    });

    expect(state.street.suspiciousCues).toEqual([
      {
        kind: 'staticSmile',
        descriptor: 'smile stays fixed while the rest of the face relaxes',
      },
    ]);
    expect(state.street.pedestrians.every((pedestrian) => pedestrian.suspiciousCue === null)).toBe(true);
  });

  it('maps active street metadata into a singular current visitor at the service window', () => {
    const state = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'playing',
      customerStreet: {
        archetype: 'courier',
        movementIntent: 'waiting',
        futureVisitor: true,
        anomalyCue: null,
        source: 'preShiftStreet',
        encounterStage: 'atWindow',
      },
    });

    expect(state.street.activeVisitor).toMatchObject({
      archetype: 'courier',
      encounterStage: 'atWindow',
      source: 'preShiftStreet',
      currentOrderTarget: true,
    });
    expect(state.street.pedestrians.every((pedestrian) => pedestrian.currentOrderTarget === false)).toBe(true);
    expect(state.street.ambience).toContain('passingHeadlights');
  });

  it('keeps served and repelled departures distinguishable from the current waiting visitor', () => {
    const served = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'playing',
      customerStreet: {
        archetype: 'student',
        movementIntent: 'leaving',
        futureVisitor: false,
        anomalyCue: null,
        source: 'streetQueue',
        encounterStage: 'servedLeaving',
      },
    });
    const repelled = getSceneVisualState({
      anomalyKind: 'staticSmile',
      shutterClosed: true,
      holdProgress: 0,
      phase: 'playing',
      customerStreet: {
        archetype: 'nightWorker',
        movementIntent: 'leaving',
        futureVisitor: false,
        anomalyCue: {
          kind: 'staticSmile',
          descriptor: 'smile stays fixed while the rest of the face relaxes',
        },
        source: 'streetQueue',
        encounterStage: 'repelledLeaving',
      },
    });

    expect(served.street.activeVisitor?.encounterStage).toBe('servedLeaving');
    expect(served.street.activeVisitor?.departureVariant).toBe('served');
    expect(repelled.street.activeVisitor?.encounterStage).toBe('repelledLeaving');
    expect(repelled.street.activeVisitor?.departureVariant).toBe('repelled');
  });

  it('keeps normal customers visually safe and unblocked', () => {
    const state = getSceneVisualState({
      anomalyKind: 'normal',
      shutterClosed: false,
      holdProgress: 0,
    });

    expect(state.customerVisible).toBe(true);
    expect(state.threatCue).toBe('none');
    expect(state.customer.bodyColor).not.toBe(state.anomalyHaloColor);
    expect(state.shutter.blocksCustomer).toBe(false);
    expect(state.protectionStatus).toBe('idle');
  });

  it('maps shadow eyes to a distinct anomaly cue', () => {
    const state = getSceneVisualState({
      anomalyKind: 'shadowEyes',
      shutterClosed: false,
      holdProgress: 0,
    });

    expect(state.threatCue).toBe('shadowEyes');
    expect(state.customer.eyeColor).toBe(state.cueColors.shadowEyes);
    expect(state.customer.eyeGlow).toBe(0);
    expect(state.customer.armLength).toBe(1);
    expect(state.customer.smileGlow).toBe(0);
  });

  it('maps long arms to a distinct anomaly cue', () => {
    const state = getSceneVisualState({
      anomalyKind: 'longArms',
      shutterClosed: false,
      holdProgress: 0,
    });

    expect(state.threatCue).toBe('longArms');
    expect(state.customer.armLength).toBeGreaterThan(1.5);
    expect(state.customer.eyeColor).not.toBe(state.cueColors.shadowEyes);
    expect(state.customer.smileGlow).toBe(0);
  });

  it('maps static smile to a distinct anomaly cue', () => {
    const state = getSceneVisualState({
      anomalyKind: 'staticSmile',
      shutterClosed: false,
      holdProgress: 0,
    });

    expect(state.threatCue).toBe('staticSmile');
    expect(state.customer.smileColor).toBe(state.cueColors.staticSmile);
    expect(state.customer.smileGlow).toBeGreaterThan(0);
    expect(state.customer.armLength).toBe(1);
  });

  it('hides the customer behind a closed shutter with a distinct barrier state', () => {
    const state = getSceneVisualState({
      anomalyKind: 'staticSmile',
      shutterClosed: true,
      holdProgress: 0,
    });

    expect(state.customerVisible).toBe(false);
    expect(state.shutter.blocksCustomer).toBe(true);
    expect(state.shutter.opacity).toBe(1);
    expect(state.shutter.color).not.toBe(state.customer.bodyColor);
    expect(state.protectionStatus).toBe('closed');
  });

  it('treats a partial hold as charging, not safe or repelled', () => {
    const state = getSceneVisualState({
      anomalyKind: 'shadowEyes',
      shutterClosed: false,
      holdProgress: PROTECTION_HOLD_SECONDS / 2,
    });

    expect(state.customerVisible).toBe(true);
    expect(state.shutter.blocksCustomer).toBe(false);
    expect(state.protectionStatus).toBe('charging');
    expect(state.safeFromAnomaly).toBe(false);
  });

  it('keeps anomaly pressure, shutter charging, repel, and late-reaction states visually distinct', () => {
    const charging = getSceneVisualState({
      anomalyKind: 'longArms',
      shutterClosed: false,
      holdProgress: PROTECTION_HOLD_SECONDS / 2,
      phase: 'playing',
      encounterOutcome: 'shutterCharging',
    });
    const repelled = getSceneVisualState({
      anomalyKind: 'longArms',
      shutterClosed: true,
      holdProgress: 0,
      phase: 'playing',
      encounterOutcome: 'shutterRepel',
    });
    const late = getSceneVisualState({
      anomalyKind: 'longArms',
      shutterClosed: false,
      holdProgress: 0,
      phase: 'playing',
      encounterOutcome: 'anomalyTimeout',
    });

    expect(charging.windowPressure).toMatchObject({
      visible: true,
      anomalyVisible: true,
      status: 'charging',
      tone: 'threat',
    });
    expect(repelled.windowPressure).toMatchObject({
      visible: true,
      anomalyVisible: true,
      status: 'repelled',
      tone: 'success',
    });
    expect(late.windowPressure).toMatchObject({
      visible: true,
      anomalyVisible: true,
      status: 'late',
      tone: 'threat',
    });
    expect(charging.windowPressure.status).not.toBe(repelled.windowPressure.status);
    expect(late.windowPressure.status).not.toBe('servedAnomaly');
  });
});
