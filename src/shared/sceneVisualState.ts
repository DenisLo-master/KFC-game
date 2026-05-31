import { PROTECTION_HOLD_SECONDS } from '../features/difficulty/config';
import type {
  AnomalyCueDescriptor,
  AnomalyKind,
  CustomerStreetPresence,
  EncounterFlowStage,
  EncounterSource,
  StreetArchetype,
} from '../features/customers/types';

export type ThreatCue = Exclude<AnomalyKind, 'normal'> | 'none';
export type ProtectionStatus = 'idle' | 'charging' | 'closed';
export type StreetAmbienceDescriptor =
  | 'wetAsphalt'
  | 'kioskSignGlow'
  | 'distantWindows'
  | 'streetLamp'
  | 'steamVent'
  | 'windTrash'
  | 'passingHeadlights';

export type WorkerIdentityVisualState = {
  uniform: 'darkOliveYellow';
  badgeVisible: boolean;
  tiredNightShift: boolean;
  serviceContext: 'kioskWindow';
  accessory: 'nameBadge';
  protocolCue: 'shiftChecklist';
};

export type VisitorPresentationVisualState = {
  threatRead: 'ordinary' | 'almostOrdinaryWrong';
  primaryMarker:
    | 'backpack'
    | 'briefcase'
    | 'deliveryBox'
    | 'shoppingBag'
    | 'walkingCane'
    | 'childHand'
    | 'workCap'
    | 'hoodie';
  silhouette: 'compact' | 'upright' | 'boxy' | 'soft' | 'stooped' | 'paired' | 'tired' | 'narrow';
  palette: string;
  cueMarker: 'none' | 'unblinkingDarkEyes' | 'tooLowSleeves' | 'fixedSmile';
};

export type StreetPedestrianVisualState = {
  archetype: StreetArchetype;
  movementIntent: CustomerStreetPresence['movementIntent'];
  futureVisitor: boolean;
  suspiciousCue: AnomalyCueDescriptor | null;
  currentOrderTarget: false;
  presentation: VisitorPresentationVisualState;
};

export type ActiveVisitorVisualState = {
  archetype: StreetArchetype;
  movementIntent: CustomerStreetPresence['movementIntent'];
  futureVisitor: boolean;
  suspiciousCue: AnomalyCueDescriptor | null;
  source: EncounterSource;
  encounterStage: EncounterFlowStage;
  currentOrderTarget: true;
  departureVariant: 'none' | 'served' | 'repelled' | 'expired' | 'replaced';
  presentation: VisitorPresentationVisualState;
};

export type StreetVisualState = {
  ambience: StreetAmbienceDescriptor[];
  workerIdentity: WorkerIdentityVisualState;
  pedestrians: StreetPedestrianVisualState[];
  activeVisitor: ActiveVisitorVisualState | null;
  suspiciousCues: AnomalyCueDescriptor[];
};

export type SceneVisualStateInput = {
  anomalyKind: AnomalyKind;
  shutterClosed: boolean;
  holdProgress: number;
  phase?: 'menu' | 'playing' | 'paused' | 'victory' | 'gameOver';
  customerStreet?: CustomerStreetPresence | null;
};

const cueColors = {
  shadowEyes: '#020617',
  longArms: '#f43f5e',
  staticSmile: '#22d3ee',
} as const;

const anomalyCueDescriptors: Record<Exclude<AnomalyKind, 'normal'>, AnomalyCueDescriptor> = {
  shadowEyes: {
    kind: 'shadowEyes',
    descriptor: 'eyes stay black when the kiosk sign catches the face',
  },
  longArms: {
    kind: 'longArms',
    descriptor: 'sleeves hang too low and elbows bend after the hands move',
  },
  staticSmile: {
    kind: 'staticSmile',
    descriptor: 'smile stays fixed while the rest of the face relaxes',
  },
};

const archetypePresentation: Record<StreetArchetype, Omit<VisitorPresentationVisualState, 'threatRead' | 'cueMarker'>> = {
  student: {
    primaryMarker: 'backpack',
    silhouette: 'compact',
    palette: '#2563eb',
  },
  officeWorker: {
    primaryMarker: 'briefcase',
    silhouette: 'upright',
    palette: '#334155',
  },
  courier: {
    primaryMarker: 'deliveryBox',
    silhouette: 'boxy',
    palette: '#f97316',
  },
  shopper: {
    primaryMarker: 'shoppingBag',
    silhouette: 'soft',
    palette: '#0f766e',
  },
  olderPerson: {
    primaryMarker: 'walkingCane',
    silhouette: 'stooped',
    palette: '#6b7280',
  },
  tiredParent: {
    primaryMarker: 'childHand',
    silhouette: 'paired',
    palette: '#7c3aed',
  },
  nightWorker: {
    primaryMarker: 'workCap',
    silhouette: 'tired',
    palette: '#365314',
  },
  teenager: {
    primaryMarker: 'hoodie',
    silhouette: 'narrow',
    palette: '#0891b2',
  },
};

const cueMarkers: Record<Exclude<AnomalyKind, 'normal'>, VisitorPresentationVisualState['cueMarker']> = {
  shadowEyes: 'unblinkingDarkEyes',
  longArms: 'tooLowSleeves',
  staticSmile: 'fixedSmile',
};

function presentationFor(
  archetype: StreetArchetype,
  suspiciousCue: AnomalyCueDescriptor | null,
): VisitorPresentationVisualState {
  return {
    ...archetypePresentation[archetype],
    threatRead: suspiciousCue ? 'almostOrdinaryWrong' : 'ordinary',
    cueMarker: suspiciousCue ? cueMarkers[suspiciousCue.kind] : 'none',
  };
}

const preShiftPedestrians: StreetPedestrianVisualState[] = [
  { archetype: 'student', movementIntent: 'passingBy', futureVisitor: false, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('student', null) },
  { archetype: 'officeWorker', movementIntent: 'approachingWindow', futureVisitor: true, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('officeWorker', null) },
  { archetype: 'courier', movementIntent: 'enteringLight', futureVisitor: true, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('courier', null) },
  { archetype: 'shopper', movementIntent: 'waiting', futureVisitor: true, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('shopper', null) },
  { archetype: 'olderPerson', movementIntent: 'leaving', futureVisitor: false, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('olderPerson', null) },
  { archetype: 'tiredParent', movementIntent: 'passingBy', futureVisitor: false, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('tiredParent', null) },
  { archetype: 'nightWorker', movementIntent: 'enteringLight', futureVisitor: true, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('nightWorker', null) },
  { archetype: 'teenager', movementIntent: 'passingBy', futureVisitor: false, suspiciousCue: null, currentOrderTarget: false, presentation: presentationFor('teenager', null) },
];

function departureVariant(stage: EncounterFlowStage): ActiveVisitorVisualState['departureVariant'] {
  if (stage === 'servedLeaving') return 'served';
  if (stage === 'repelledLeaving') return 'repelled';
  if (stage === 'expiredLeaving') return 'expired';
  if (stage === 'replaced') return 'replaced';
  return 'none';
}

export function getStreetVisualState({
  anomalyKind,
  customerStreet,
}: Pick<SceneVisualStateInput, 'anomalyKind' | 'customerStreet'>): StreetVisualState {
  const suspiciousCues = anomalyKind === 'normal' ? [] : [anomalyCueDescriptors[anomalyKind]];
  const activeVisitor = customerStreet
    ? {
        archetype: customerStreet.archetype,
        movementIntent: customerStreet.movementIntent,
        futureVisitor: customerStreet.futureVisitor,
        suspiciousCue: customerStreet.anomalyCue,
        source: customerStreet.source,
        encounterStage: customerStreet.encounterStage,
        currentOrderTarget: true as const,
        departureVariant: departureVariant(customerStreet.encounterStage),
        presentation: presentationFor(customerStreet.archetype, customerStreet.anomalyCue),
      }
    : null;

  return {
    ambience: ['wetAsphalt', 'kioskSignGlow', 'distantWindows', 'streetLamp', 'steamVent', 'windTrash', 'passingHeadlights'],
    workerIdentity: {
      uniform: 'darkOliveYellow',
      badgeVisible: true,
      tiredNightShift: true,
      serviceContext: 'kioskWindow',
      accessory: 'nameBadge',
      protocolCue: 'shiftChecklist',
    },
    pedestrians: preShiftPedestrians,
    activeVisitor,
    suspiciousCues,
  };
}

export function getSceneVisualState({ anomalyKind, shutterClosed, holdProgress, customerStreet }: SceneVisualStateInput) {
  const threatCue: ThreatCue = anomalyKind === 'normal' ? 'none' : anomalyKind;
  const anomaly = threatCue !== 'none';
  const charging = holdProgress > 0 && holdProgress < PROTECTION_HOLD_SECONDS;

  return {
    cueColors,
    threatCue,
    street: getStreetVisualState({ anomalyKind, customerStreet }),
    anomalyHaloColor: '#7f1d1d',
    customerVisible: !shutterClosed,
    safeFromAnomaly: shutterClosed,
    protectionStatus: shutterClosed ? ('closed' as const) : charging ? ('charging' as const) : ('idle' as const),
    customer: {
      bodyColor: anomaly ? '#4a1d2e' : '#2f6f73',
      headColor: anomaly ? '#d8c2b0' : '#f3c9a5',
      eyeColor: threatCue === 'shadowEyes' ? cueColors.shadowEyes : '#f8fafc',
      eyeGlow: threatCue === 'shadowEyes' ? 0.8 : 0,
      eyeScale: threatCue === 'shadowEyes' ? 1.35 : 1,
      armLength: threatCue === 'longArms' ? 1.85 : 1,
      armColor: threatCue === 'longArms' ? cueColors.longArms : anomaly ? '#4a1d2e' : '#2f6f73',
      smileColor: threatCue === 'staticSmile' ? cueColors.staticSmile : '#111827',
      smileGlow: threatCue === 'staticSmile' ? 0.9 : 0,
      haloColor: anomaly ? '#ef4444' : '#0f766e',
    },
    shutter: {
      blocksCustomer: shutterClosed,
      color: shutterClosed ? '#d1d5db' : charging ? '#ef4444' : '#4b5563',
      stripeColor: shutterClosed ? '#dc2626' : '#7f1d1d',
      glowColor: shutterClosed ? '#ef4444' : charging ? '#fb7185' : '#111827',
      opacity: shutterClosed ? 1 : charging ? 0.42 : 0,
    },
  };
}
