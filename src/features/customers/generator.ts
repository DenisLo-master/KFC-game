import { generateOrder } from '../orders/generator';
import type { DifficultyConfig } from '../difficulty/config';
import type {
  AnomalyCueDescriptor,
  Customer,
  AnomalyKind,
  EncounterFlowStage,
  EncounterSource,
  StreetArchetype,
  StreetMovementIntent,
} from './types';

const names = ['Mason', 'Ava', 'Noah', 'Mia', 'Eli', 'Zoe', 'Ivy', 'Theo'];
const anomalyKinds: Exclude<AnomalyKind, 'normal'>[] = ['shadowEyes', 'longArms', 'staticSmile'];
const streetArchetypes: StreetArchetype[] = [
  'student',
  'officeWorker',
  'courier',
  'shopper',
  'olderPerson',
  'tiredParent',
  'nightWorker',
  'teenager',
];
const movementIntents: StreetMovementIntent[] = [
  'passingBy',
  'enteringLight',
  'approachingWindow',
  'waiting',
  'leaving',
];
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

type CustomerGenerationOptions = {
  forceAnomaly?: boolean;
  forceAnomalyKind?: Exclude<AnomalyKind, 'normal'>;
  encounterSource?: EncounterSource;
  encounterStage?: EncounterFlowStage;
  now?: () => number;
  rng?: () => number;
};

export function generateCustomer(
  sequence: number,
  difficulty: DifficultyConfig,
  options: CustomerGenerationOptions = {},
): Customer {
  const rng = options.rng ?? Math.random;
  const now = options.now ?? Date.now;
  const anomaly =
    options.forceAnomaly ?? (sequence > 1 && (sequence % 5 === 0 || rng() < difficulty.anomalyChance));
  const subtle = rng() < difficulty.subtleAnomalyChance;
  const anomalyKind = options.forceAnomalyKind ?? (subtle ? 'staticSmile' : anomalyKinds[sequence % anomalyKinds.length]);

  return {
    id: `customer-${sequence}-${now()}`,
    name: names[sequence % names.length],
    anomaly,
    anomalyKind: anomaly ? anomalyKind : 'normal',
    order: generateOrder(sequence, difficulty),
    street: {
      archetype: streetArchetypes[sequence % streetArchetypes.length],
      movementIntent: movementIntents[sequence % movementIntents.length],
      futureVisitor: sequence % 2 === 1,
      anomalyCue: anomaly ? anomalyCueDescriptors[anomalyKind] : null,
      source: options.encounterSource ?? 'streetQueue',
      encounterStage: options.encounterStage ?? 'approaching',
    },
  };
}
