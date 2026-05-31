import type { Order } from '../orders/types';

export type AnomalyKind = 'shadowEyes' | 'longArms' | 'staticSmile' | 'normal';
export type StreetArchetype =
  | 'student'
  | 'officeWorker'
  | 'courier'
  | 'shopper'
  | 'olderPerson'
  | 'tiredParent'
  | 'nightWorker'
  | 'teenager';
export type StreetMovementIntent = 'passingBy' | 'enteringLight' | 'approachingWindow' | 'waiting' | 'leaving';
export type EncounterSource = 'preShiftStreet' | 'streetQueue';
export type EncounterFlowStage =
  | 'approaching'
  | 'atWindow'
  | 'waiting'
  | 'servedLeaving'
  | 'repelledLeaving'
  | 'expiredLeaving'
  | 'replaced';

export type AnomalyCueDescriptor = {
  kind: Exclude<AnomalyKind, 'normal'>;
  descriptor: string;
};

export type CustomerStreetPresence = {
  archetype: StreetArchetype;
  movementIntent: StreetMovementIntent;
  futureVisitor: boolean;
  anomalyCue: AnomalyCueDescriptor | null;
  source: EncounterSource;
  encounterStage: EncounterFlowStage;
};

export type Customer = {
  id: string;
  name: string;
  anomaly: boolean;
  anomalyKind: AnomalyKind;
  order: Order;
  street: CustomerStreetPresence;
};
