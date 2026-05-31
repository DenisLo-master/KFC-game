import { useMemo, type CSSProperties } from 'react';
import { useGameStore } from '../app/store';
import type { StationId } from '../features/cooking/types';
import { summarizePrepared } from '../features/orders/types';
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

function stationForProduct(product: string): StationId {
  if (product === 'fries') return 'fryer';
  if (product === 'burger') return 'grill';
  if (product === 'drink') return 'drink';
  return 'oven';
}

function stationEffectLabel(status: string, product: string | null) {
  if (status === 'ready') return `${product ?? 'food'} ready`;
  if (status === 'cooking') return `${product ?? 'food'} cooking`;
  return 'idle';
}

const stationPositions: Record<StationId, string> = {
  fryer: 'Fryer',
  grill: 'Grill',
  oven: 'Oven',
  drink: 'Drinks',
};

export function ReferenceScene() {
  const phase = useGameStore((state) => state.phase);
  const currentCustomer = useGameStore((state) => state.currentCustomer);
  const currentOrder = useGameStore((state) => state.currentOrder);
  const preparedItems = useGameStore((state) => state.preparedItems);
  const stations = useGameStore((state) => state.stations);
  const actionCue = useGameStore((state) => state.actionCue);
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
  const prepared = useMemo(() => summarizePrepared(preparedItems), [preparedItems]);
  const activeGuide = useMemo(() => {
    const readyStation = Object.values(stations).find((station) => station.status === 'ready');
    if (readyStation) {
      return {
        zone: readyStation.id,
        label: `Collect ${readyStation.product} from ${readyStation.label}`,
      };
    }

    if (currentCustomer?.anomaly) {
      return {
        zone: 'shutter',
        label: 'Anomaly cue: hold the shutter',
      };
    }

    const cookingStation = Object.values(stations).find((station) => station.status === 'cooking');
    if (cookingStation) {
      return {
        zone: cookingStation.id,
        label: `Wait for ${cookingStation.product} at ${cookingStation.label}`,
      };
    }

    const nextLine = currentOrder?.lines.find((line) => {
      const currentCount = line.kind === 'burger' ? prepared.burger : prepared[line.kind];
      return currentCount < line.count;
    });

    if (nextLine) {
      const stationId = stationForProduct(nextLine.kind);
      return {
        zone: stationId,
        label: `Start ${nextLine.kind} at ${stationPositions[stationId]}`,
      };
    }

    if (currentOrder?.drink && prepared.drink !== currentOrder.drink) {
      return {
        zone: 'drink',
        label: `Fill ${currentOrder.drink} at Drinks`,
      };
    }

    return {
      zone: 'window',
      label: preparedItems.length > 0 ? 'Serve the tray at the window' : 'Read the order at the window',
    };
  }, [currentCustomer?.anomaly, currentOrder, prepared, preparedItems.length, stations]);

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
          <div className="service-layout" data-testid="service-layout" aria-hidden="true">
            <section
              className={`service-zone storage-zone ${activeGuide.zone === 'fryer' || activeGuide.zone === 'grill' ? 'next-step' : ''}`}
              data-testid="scene-zone-storage"
            >
              <strong>Storage</strong>
              <span>tray / ingredients</span>
            </section>
            <section className="service-zone kitchen-zone" data-testid="scene-zone-kitchen">
              <strong>Kitchen Stations</strong>
              <div className="station-map">
                {(Object.keys(stations) as StationId[]).map((id) => {
                  const station = stations[id];
                  const progress =
                    station.status === 'cooking' && station.duration > 0
                      ? Math.max(0, Math.min(100, ((station.duration - station.remaining) / station.duration) * 100))
                      : station.status === 'ready'
                        ? 100
                        : 0;

                  return (
                    <div
                      key={id}
                      className={`station-marker station-${id} station-${station.status} ${
                        activeGuide.zone === id || actionCue.workerZone === id ? 'next-step' : ''
                      }`}
                      style={{ '--station-progress': `${progress}%` } as CSSProperties & Record<'--station-progress', string>}
                      data-testid={`scene-station-${id}`}
                    >
                      <strong>{stationPositions[id]}</strong>
                      <span>{stationEffectLabel(station.status, station.product)}</span>
                      <i />
                    </div>
                  );
                })}
              </div>
            </section>
            <section
              className={`service-zone window-zone ${activeGuide.zone === 'window' || activeGuide.zone === 'shutter' ? 'next-step' : ''}`}
              data-testid="scene-zone-window"
            >
              <strong>Service Window</strong>
              <span>{activeGuide.zone === 'shutter' ? 'hold shutter' : 'serve tray'}</span>
            </section>
            <div
              className={`kitchen-worker worker-at-${actionCue.workerZone} cue-${actionCue.kind}`}
              data-testid="kitchen-worker"
              data-worker-zone={actionCue.workerZone}
            >
              <span className="worker-head" />
              <span className="worker-body" />
              <span className="worker-tray" />
            </div>
            <div className="next-step-callout" data-testid="next-step-callout">
              <strong>Next</strong>
              <span>{activeGuide.label}</span>
            </div>
          </div>
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
