import { useMemo } from 'react';
import { useGameStore } from '../app/store';
import { getSceneVisualState } from '../shared/sceneVisualState';

const referenceAssets = {
  exterior: '/assets/references/kfs-exterior-street.png',
  service: '/assets/references/kfs-kiosk-service.png',
  backroom: '/assets/references/kfs-backroom.png',
  lineupExpanded: '/assets/references/customer-lineup-expanded.png',
  lineupClose: '/assets/references/customer-lineup-close.png',
  anomalies05: '/assets/references/anomalous-visitors-file05.png',
  anomalies06: '/assets/references/anomalous-visitors-file06.png',
  workerMale: '/assets/references/kfs-worker-male.png',
  workerFemale: '/assets/references/kfs-worker-female.png',
} as const;

function activeVisitorAsset(anomalyKind: string) {
  if (anomalyKind === 'shadowEyes') return referenceAssets.anomalies05;
  if (anomalyKind === 'longArms' || anomalyKind === 'staticSmile') return referenceAssets.anomalies06;
  return referenceAssets.lineupClose;
}

function cueLabel(cue: string) {
  if (cue === 'shadowEyes') return 'shadow eyes';
  if (cue === 'longArms') return 'long arms';
  if (cue === 'staticSmile') return 'fixed smile';
  return 'ordinary';
}

export function ReferenceScene() {
  const phase = useGameStore((state) => state.phase);
  const currentCustomer = useGameStore((state) => state.currentCustomer);
  const shutterClosed = useGameStore((state) => state.shutterClosed);
  const holdProgress = useGameStore((state) => state.holdProgress);
  const preShiftStreet = useGameStore((state) => state.preShiftStreet);
  const isActive = phase === 'playing' || phase === 'paused';
  const visualState = getSceneVisualState({
    anomalyKind: currentCustomer?.anomalyKind ?? 'normal',
    shutterClosed,
    holdProgress,
    phase,
    customerStreet: currentCustomer?.street ?? null,
  });

  const archetypeLine = useMemo(
    () => preShiftStreet.pedestrians.map((pedestrian) => pedestrian.archetype).join(' / '),
    [preShiftStreet.pedestrians],
  );

  const visitorAsset = activeVisitorAsset(currentCustomer?.anomalyKind ?? 'normal');
  const threatCue = visualState.threatCue;

  return (
    <div
      className={`reference-scene ${isActive ? 'reference-active' : 'reference-pre-shift'} cue-${threatCue}`}
      data-testid="reference-scene"
      data-reference-mode={isActive ? 'service-window' : 'exterior-kiosk'}
      aria-hidden="true"
    >
      <img
        className="reference-bg reference-bg-exterior"
        src={referenceAssets.exterior}
        alt=""
        data-testid="reference-exterior-layer"
        decoding="async"
        draggable="false"
      />
      <img
        className="reference-bg reference-bg-service"
        src={referenceAssets.service}
        alt=""
        data-testid="reference-service-layer"
        decoding="async"
        draggable="false"
      />
      <div className="reference-grade" />
      <div className="reference-vignette" />
      <div className="rain-sheet" />
      <div className="light-sweep" />
      <div className="steam-field steam-field-left" />
      <div className="steam-field steam-field-right" />

      {!isActive && (
        <>
          <img className="reference-dossier lineup-dossier" src={referenceAssets.lineupExpanded} alt="" decoding="async" draggable="false" />
          <img className="reference-dossier anomaly-dossier" src={referenceAssets.anomalies06} alt="" decoding="async" draggable="false" />
          <img className="reference-worker worker-dossier" src={referenceAssets.workerFemale} alt="" decoding="async" draggable="false" />
          <div className="in-world-label exterior-label">
            <strong>KFS KIOSK FILE</strong>
            <span>{archetypeLine}</span>
          </div>
        </>
      )}

      {isActive && (
        <>
          <img className="reference-dossier backroom-dossier" src={referenceAssets.backroom} alt="" decoding="async" draggable="false" />
          <div
            className={`reference-visitor active-visitor-dossier visitor-${currentCustomer?.anomalyKind ?? 'normal'}`}
            data-testid="reference-active-visitor-layer"
            data-reference-src={visitorAsset}
          />
          <img className="reference-worker active-worker-dossier" src={referenceAssets.workerMale} alt="" decoding="async" draggable="false" />
          <div className="in-world-label active-label">
            <strong>CURRENT WINDOW</strong>
            <span>{cueLabel(threatCue)}</span>
          </div>
        </>
      )}
    </div>
  );
}
