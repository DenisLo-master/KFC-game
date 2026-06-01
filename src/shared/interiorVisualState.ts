import type { CookingStation, StationId } from '../features/cooking/types';
import type { AnomalyKind } from '../features/customers/types';
import { PROTECTION_HOLD_SECONDS } from '../features/difficulty/config';
import { INTERIOR_STATION_ZONES } from '../features/interior/config';
import type { InteriorZone, WorkerMovementState } from '../features/interior/types';
import type { Order } from '../features/orders/types';
import type { InteractionEffect, StoragePickupState, TrayState } from '../app/store';

export type InteriorConnectedRoom = 'storage' | 'kitchen' | 'service';
export type InteriorAvailableAction = 'none' | 'storage' | 'prep' | 'startCooking' | 'collect' | 'wait' | 'serve' | 'shutter';

export type InteriorZoneVisualState = {
  id: InteriorZone;
  connectedRoom: InteriorConnectedRoom;
  workerPresent: boolean;
  workerTarget: boolean;
  actionAvailable: boolean;
  availableAction: InteriorAvailableAction;
  label: string;
};

export type InteriorWorkerVisualState = {
  currentZone: InteriorZone;
  targetZone: InteriorZone | null;
  status: WorkerMovementState['status'];
  progress: number;
  visualPosition: {
    x: number;
    y: number;
  };
  moving: boolean;
  arrived: boolean;
  pathVisible: boolean;
  path: InteriorZone[];
  availableAction: InteriorAvailableAction;
};

export type InteriorVisualState = {
  connectedInterior: true;
  worker: InteriorWorkerVisualState;
  zones: Record<InteriorZone, InteriorZoneVisualState>;
  windowPressure: InteriorWindowPressureVisualState;
  shutterDefense: InteriorShutterDefenseVisualState;
  effect: InteriorInteractionEffectVisualState;
  storage: InteriorStorageVisualState;
  stations: Record<StationId, InteriorStationVisualState>;
  tray: TrayState;
  serviceWindow: InteriorServiceWindowVisualState;
};

export type InteriorInteractionEffectVisualState = {
  kind: InteractionEffect['kind'];
  zone: InteriorZone;
  visible: boolean;
  tone: InteractionEffect['tone'];
  label: string;
  itemKind?: InteractionEffect['itemKind'];
  nextZone?: InteriorZone;
};

export type InteriorStorageVisualState = {
  pickupVisible: boolean;
  itemKind: InteractionEffect['itemKind'] | null;
  nextZone: InteriorZone | null;
};

export type InteriorStationEffectStatus = 'idle' | 'cooking' | 'ready' | 'collected' | 'invalid';

export type InteriorStationVisualState = {
  effect: {
    status: InteriorStationEffectStatus;
    visible: boolean;
    tone: InteractionEffect['tone'];
    label: string;
    itemKind?: InteractionEffect['itemKind'];
  };
};

export type InteriorServiceWindowVisualState = {
  feedback: 'none' | 'success' | 'wrong' | 'early' | 'noCustomer' | 'anomaly';
  visible: boolean;
  tone: InteractionEffect['tone'];
  label: string;
};

export type InteriorWindowPressureVisualState = {
  visible: boolean;
  anomalyVisible: boolean;
  anomalyKind: AnomalyKind;
  workerAwayFromWindow: boolean;
  defenseAvailable: boolean;
  urgency: 'neutral' | 'warning' | 'threat';
  status: 'ordinary' | 'anomaly' | 'charging' | 'repelled' | 'falseAlarm' | 'late' | 'servedAnomaly';
  tone: InteractionEffect['tone'];
  label: string;
};

export type InteriorShutterDefenseVisualState = {
  representedInWorld: true;
  visible: boolean;
  available: boolean;
  status: 'unavailable' | 'ready' | 'charging' | 'repelled' | 'falseAlarm';
  tone: InteractionEffect['tone'];
  progress: number;
  label: string;
};

type InteriorVisualStateInput = {
  workerMovement: WorkerMovementState;
  stations: Record<StationId, CookingStation>;
  currentCustomer: { anomaly: boolean; anomalyKind: AnomalyKind } | null;
  currentOrder: Order | null;
  threat: number;
  customerTimer: number;
  protectionHeld: boolean;
  holdProgress: number;
  shutterClosed: boolean;
  interactionEffect: InteractionEffect;
  storagePickup: StoragePickupState;
  trayState: TrayState;
};

const zoneRooms = {
  storage: 'storage',
  prep: 'kitchen',
  fryer: 'kitchen',
  grill: 'kitchen',
  oven: 'kitchen',
  drink: 'kitchen',
  window: 'service',
  shutter: 'service',
} as const satisfies Record<InteriorZone, InteriorConnectedRoom>;

const zoneLabels = {
  storage: 'Storage',
  prep: 'Prep tray',
  fryer: 'Fryer',
  grill: 'Grill',
  oven: 'Oven',
  drink: 'Drinks',
  window: 'Service window',
  shutter: 'Shutter',
} as const satisfies Record<InteriorZone, string>;

const allZones: InteriorZone[] = ['storage', 'prep', ...INTERIOR_STATION_ZONES, 'window', 'shutter'];

const zoneAnchors = {
  storage: { x: 6, y: 25 },
  prep: { x: 18, y: 22 },
  fryer: { x: 30, y: 22 },
  grill: { x: 42, y: 22 },
  oven: { x: 54, y: 22 },
  drink: { x: 66, y: 22 },
  window: { x: 84, y: 26 },
  shutter: { x: 84, y: 26 },
} as const satisfies Record<InteriorZone, { x: number; y: number }>;

function actionForZone(input: InteriorVisualStateInput, zone: InteriorZone): InteriorAvailableAction {
  if (zone === 'storage') return 'storage';
  if (zone === 'prep') return 'prep';
  if (zone === 'window') return input.currentCustomer && input.currentOrder ? 'serve' : 'none';
  if (zone === 'shutter') return input.currentCustomer ? 'shutter' : 'none';

  const station = input.stations[zone];
  if (station.status === 'ready') return 'collect';
  if (station.status === 'idle') return 'startCooking';
  return 'wait';
}

function isActionAvailable(action: InteriorAvailableAction) {
  return action !== 'none' && action !== 'wait';
}

function clampProgress(progress: number) {
  return Math.max(0, Math.min(1, progress));
}

function interpolatePosition(currentZone: InteriorZone, targetZone: InteriorZone | null, progress: number) {
  const current = zoneAnchors[currentZone];
  if (!targetZone) return current;

  const target = zoneAnchors[targetZone];
  const amount = clampProgress(progress);

  return {
    x: current.x + (target.x - current.x) * amount,
    y: current.y + (target.y - current.y) * amount,
  };
}

function stationEffectState(station: CookingStation, effect: InteractionEffect): InteriorStationVisualState {
  const effectTargetsStation = effect.zone === station.id;

  if (effectTargetsStation && effect.kind === 'stationCollected') {
    return {
      effect: {
        status: 'collected',
        visible: true,
        tone: effect.tone,
        label: effect.label,
        itemKind: effect.itemKind,
      },
    };
  }

  if (effectTargetsStation && effect.kind === 'invalid') {
    return {
      effect: {
        status: 'invalid',
        visible: true,
        tone: effect.tone,
        label: effect.label,
        itemKind: effect.itemKind,
      },
    };
  }

  if (station.status === 'cooking' || station.status === 'ready') {
    return {
      effect: {
        status: station.status,
        visible: true,
        tone: station.status === 'ready' ? 'ready' : 'progress',
        label: effectTargetsStation ? effect.label : `${station.label} ${station.status}.`,
        itemKind: station.product ?? undefined,
      },
    };
  }

  return {
    effect: {
      status: 'idle',
      visible: false,
      tone: 'neutral',
      label: 'Idle',
      itemKind: station.product ?? undefined,
    },
  };
}

function serviceWindowFeedback(effect: InteractionEffect): InteriorServiceWindowVisualState {
  if (effect.kind === 'serveSuccess') {
    return { feedback: 'success', visible: true, tone: effect.tone, label: effect.label };
  }
  if (effect.kind === 'serveWrong') {
    return { feedback: 'wrong', visible: true, tone: effect.tone, label: effect.label };
  }
  if (effect.kind === 'serveEarly') {
    return { feedback: 'early', visible: true, tone: effect.tone, label: effect.label };
  }
  if (effect.kind === 'serveNoCustomer') {
    return { feedback: 'noCustomer', visible: true, tone: effect.tone, label: effect.label };
  }
  if (effect.kind === 'serveAnomaly') {
    return { feedback: 'anomaly', visible: true, tone: effect.tone, label: effect.label };
  }
  return { feedback: 'none', visible: false, tone: 'neutral', label: '' };
}

function workerAwayFromWindow(movement: WorkerMovementState) {
  if (movement.status === 'moving') {
    return movement.targetZone !== 'window' && movement.targetZone !== 'shutter';
  }
  return movement.currentZone !== 'window' && movement.currentZone !== 'shutter';
}

function windowPressureState(input: InteriorVisualStateInput): InteriorWindowPressureVisualState {
  const customer = input.currentCustomer;
  const effect = input.interactionEffect;
  const pressureCustomer = effect.outcomeCustomer ?? customer;
  const anomalyKind = pressureCustomer?.anomalyKind ?? 'normal';
  const anomalyVisible = pressureCustomer?.anomaly === true || effect.kind === 'serveAnomaly' || effect.kind === 'anomalyTimeout' || effect.kind === 'shutterRepel';
  const defenseAvailable = customer !== null;
  const workerAway = workerAwayFromWindow(input.workerMovement);
  const pressureBase = {
    visible: customer !== null || effect.outcomeCustomer !== undefined || effect.kind === 'serveAnomaly' || effect.kind === 'anomalyTimeout' || effect.kind === 'shutterRepel',
    anomalyVisible,
    anomalyKind,
    workerAwayFromWindow: workerAway,
    defenseAvailable,
  };

  if (effect.kind === 'shutterRepel') {
    return { ...pressureBase, status: 'repelled', urgency: 'neutral', tone: 'success', label: effect.label };
  }
  if (effect.kind === 'shutterFalseAlarm') {
    return { ...pressureBase, anomalyVisible: false, status: 'falseAlarm', urgency: 'warning', tone: 'error', label: effect.label };
  }
  if (effect.kind === 'anomalyTimeout') {
    return { ...pressureBase, status: 'late', urgency: 'threat', tone: 'threat', label: effect.label };
  }
  if (effect.kind === 'serveAnomaly') {
    return { ...pressureBase, status: 'servedAnomaly', urgency: 'threat', tone: 'threat', label: effect.label };
  }
  if (effect.kind === 'shutterCharging' || input.protectionHeld || input.holdProgress > 0) {
    return {
      ...pressureBase,
      status: 'charging',
      urgency: customer?.anomaly ? 'threat' : 'warning',
      tone: customer?.anomaly ? 'threat' : 'warning',
      label: effect.kind === 'shutterCharging' ? effect.label : 'Shutter charging.',
    };
  }

  return {
    ...pressureBase,
    status: customer?.anomaly ? 'anomaly' : 'ordinary',
    urgency: customer?.anomaly || input.threat >= 50 ? 'threat' : input.customerTimer > 0 && input.customerTimer <= 5 ? 'warning' : 'neutral',
    tone: customer?.anomaly ? 'threat' : 'neutral',
    label: customer?.anomaly ? 'Anomaly at the window.' : 'Customer pressure at the window.',
  };
}

function shutterDefenseState(input: InteriorVisualStateInput): InteriorShutterDefenseVisualState {
  const effect = input.interactionEffect;
  if (effect.kind === 'shutterRepel') {
    return {
      representedInWorld: true,
      visible: true,
      available: false,
      status: 'repelled',
      tone: 'success',
      progress: 1,
      label: effect.label,
    };
  }
  if (effect.kind === 'shutterFalseAlarm') {
    return {
      representedInWorld: true,
      visible: true,
      available: false,
      status: 'falseAlarm',
      tone: 'error',
      progress: 1,
      label: effect.label,
    };
  }
  if (effect.kind === 'shutterCharging' || input.protectionHeld || input.holdProgress > 0) {
    return {
      representedInWorld: true,
      visible: true,
      available: input.currentCustomer !== null,
      status: 'charging',
      tone: input.currentCustomer?.anomaly ? 'threat' : 'warning',
      progress: Math.max(0, Math.min(1, input.holdProgress / PROTECTION_HOLD_SECONDS)),
      label: effect.kind === 'shutterCharging' ? effect.label : 'Shutter charging.',
    };
  }
  return {
    representedInWorld: true,
    visible: true,
    available: input.currentCustomer !== null,
    status: input.currentCustomer ? 'ready' : 'unavailable',
    tone: input.currentCustomer?.anomaly ? 'threat' : 'neutral',
    progress: input.shutterClosed ? 1 : 0,
    label: input.currentCustomer?.anomaly ? 'Hold shutter' : input.currentCustomer ? 'Shutter ready' : 'No window threat',
  };
}

export function getInteriorVisualState(input: InteriorVisualStateInput): InteriorVisualState {
  const movement = input.workerMovement;
  const moving = movement.status === 'moving' && movement.targetZone !== null;
  const currentZone = movement.currentZone;
  const targetZone = moving ? movement.targetZone : null;
  const progress = clampProgress(movement.progress);
  const visualPosition = interpolatePosition(currentZone, targetZone, progress);
  const path = targetZone ? [currentZone, targetZone] : [];
  const availableAction = moving ? 'none' : actionForZone(input, currentZone);

  const zones = allZones.reduce<Record<InteriorZone, InteriorZoneVisualState>>((accumulator, zone) => {
    const zoneAction = moving ? 'none' : actionForZone(input, zone);
    accumulator[zone] = {
      id: zone,
      connectedRoom: zoneRooms[zone],
      workerPresent: currentZone === zone,
      workerTarget: targetZone === zone,
      actionAvailable: currentZone === zone && isActionAvailable(zoneAction),
      availableAction: currentZone === zone ? zoneAction : 'none',
      label: zoneLabels[zone],
    };
    return accumulator;
  }, {} as Record<InteriorZone, InteriorZoneVisualState>);
  const effect: InteriorInteractionEffectVisualState = {
    kind: input.interactionEffect.kind,
    zone: input.interactionEffect.zone,
    visible: input.interactionEffect.kind !== 'none',
    tone: input.interactionEffect.tone,
    label: input.interactionEffect.label,
    itemKind: input.interactionEffect.itemKind,
    nextZone: input.interactionEffect.nextZone,
  };
  const stationVisuals = INTERIOR_STATION_ZONES.reduce<Record<StationId, InteriorStationVisualState>>((accumulator, stationId) => {
    accumulator[stationId] = stationEffectState(input.stations[stationId], input.interactionEffect);
    return accumulator;
  }, {} as Record<StationId, InteriorStationVisualState>);

  return {
    connectedInterior: true,
    worker: {
      currentZone,
      targetZone,
      status: movement.status,
      progress,
      visualPosition,
      moving,
      arrived: !moving && movement.status === 'arrived',
      pathVisible: moving,
      path,
      availableAction,
    },
    zones,
    windowPressure: windowPressureState(input),
    shutterDefense: shutterDefenseState(input),
    effect,
    storage: {
      pickupVisible: input.interactionEffect.kind === 'storagePickup' || input.storagePickup !== null,
      itemKind: input.interactionEffect.kind === 'storagePickup' ? input.interactionEffect.itemKind : input.storagePickup?.itemKind ?? null,
      nextZone: input.interactionEffect.kind === 'storagePickup' ? input.interactionEffect.nextZone ?? null : input.storagePickup?.nextZone ?? null,
    },
    stations: stationVisuals,
    tray: input.trayState,
    serviceWindow: serviceWindowFeedback(input.interactionEffect),
  };
}
