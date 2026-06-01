import { useMemo, type CSSProperties, type KeyboardEvent } from 'react';
import { useGameStore } from '../app/store';
import type { StationId } from '../features/cooking/types';
import type { InteriorZone } from '../features/interior/types';
import { summarizePrepared } from '../features/orders/types';
import { getInteriorVisualState } from '../shared/interiorVisualState';
import { getSceneVisualState, type SceneEncounterOutcome } from '../shared/sceneVisualState';

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

function encounterOutcomeForEffect(kind: string): SceneEncounterOutcome {
  if (kind === 'shutterCharging') return 'shutterCharging';
  if (kind === 'shutterRepel') return 'shutterRepel';
  if (kind === 'shutterFalseAlarm') return 'shutterFalseAlarm';
  if (kind === 'anomalyTimeout') return 'anomalyTimeout';
  if (kind === 'serveAnomaly') return 'serveAnomaly';
  return 'none';
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
  const interactionEffect = useGameStore((state) => state.interactionEffect);
  const storagePickup = useGameStore((state) => state.storagePickup);
  const trayState = useGameStore((state) => state.trayState);
  const workerMovement = useGameStore((state) => state.workerMovement);
  const threat = useGameStore((state) => state.threat);
  const customerTimer = useGameStore((state) => state.customerTimer);
  const protectionHeld = useGameStore((state) => state.protectionHeld);
  const moveWorkerTo = useGameStore((state) => state.moveWorkerTo);
  const interactAtCurrentZone = useGameStore((state) => state.interactAtCurrentZone);
  const shutterClosed = useGameStore((state) => state.shutterClosed);
  const holdProgress = useGameStore((state) => state.holdProgress);
  const preShiftStreet = useGameStore((state) => state.preShiftStreet);
  const isActive = phase === 'playing' || phase === 'paused';
  const visualCustomer = interactionEffect.outcomeCustomer ?? currentCustomer;
  const visualState = getSceneVisualState({
    anomalyKind: visualCustomer?.anomalyKind ?? 'normal',
    shutterClosed,
    holdProgress,
    phase,
    customerStreet: visualCustomer?.street ?? null,
    encounterOutcome: encounterOutcomeForEffect(interactionEffect.kind),
  });

  const archetypeLine = useMemo(
    () => preShiftStreet.pedestrians.map((pedestrian) => pedestrian.archetype).join(' / '),
    [preShiftStreet.pedestrians],
  );

  const visitorAsset = activeVisitorAsset(visualCustomer?.anomalyKind ?? 'normal');
  const threatCue = visualState.threatCue;
  const interiorVisualState = getInteriorVisualState({
    workerMovement,
    stations,
    currentCustomer,
    currentOrder,
    threat,
    customerTimer,
    protectionHeld,
    holdProgress,
    shutterClosed,
    interactionEffect,
    storagePickup,
    trayState,
  });
  const workerZone = interiorVisualState.worker.currentZone;
  const workerVisualPosition = interiorVisualState.worker.visualPosition;
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

  const moveToZone = (zone: InteriorZone) => {
    if (!isActive) return;
    if (workerMovement.status !== 'moving' && workerMovement.currentZone === zone) {
      interactAtCurrentZone();
      return;
    }
    moveWorkerTo(zone);
  };

  const useShutterDefense = () => {
    if (!isActive) return;
    if (workerMovement.status !== 'moving' && workerMovement.currentZone === 'shutter') {
      interactAtCurrentZone();
      return;
    }
    moveWorkerTo('shutter');
  };

  const onZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>, zone: InteriorZone) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    event.preventDefault();
    moveToZone(zone);
  };

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
        fetchPriority="high"
        draggable="false"
      />
      <img
        className="reference-bg reference-bg-service"
        src={referenceAssets.service}
        alt=""
        data-testid="reference-service-layer"
        decoding="async"
        fetchPriority="low"
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
          <img
            className="reference-dossier lineup-dossier"
            src={referenceAssets.lineupExpanded}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable="false"
          />
          <img
            className="reference-dossier anomaly-dossier"
            src={referenceAssets.anomalies06}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable="false"
          />
          <img
            className="reference-worker worker-dossier"
            src={referenceAssets.workerFemale}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable="false"
          />
          <div className="in-world-label exterior-label">
            <strong>KFS KIOSK FILE</strong>
            <span>{archetypeLine}</span>
          </div>
        </>
      )}

      {isActive && (
        <>
          <img
            className="reference-dossier backroom-dossier"
            src={referenceAssets.backroom}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable="false"
          />
          <div className="service-layout" data-testid="service-layout" aria-hidden="true">
            <div
              className="interior-scene"
              data-testid="interior-scene"
              data-connected-interior={interiorVisualState.connectedInterior}
              data-worker-current-zone={interiorVisualState.worker.currentZone}
              data-worker-target-zone={interiorVisualState.worker.targetZone ?? ''}
              data-worker-status={interiorVisualState.worker.status}
            >
              <div className="interior-floor" />
              <div className="interior-connector storage-to-kitchen" />
              <div className="interior-connector kitchen-to-window" />
              <div
                className="zone-hit storage-zone-hit"
                role="button"
                tabIndex={0}
                data-testid="zone-storage"
                data-worker-present={interiorVisualState.zones.storage.workerPresent}
                data-worker-target={interiorVisualState.zones.storage.workerTarget}
                data-action-available={interiorVisualState.zones.storage.actionAvailable}
                onClick={() => moveToZone('storage')}
                onKeyDown={(event) => onZoneKeyDown(event, 'storage')}
              >
                <section
                  className={`service-zone storage-zone ${
                    activeGuide.zone === 'fryer' || activeGuide.zone === 'grill' || interiorVisualState.zones.storage.workerTarget ? 'next-step' : ''
                  }`}
                  data-testid="scene-zone-storage"
                >
                  <strong>Storage</strong>
                  <span>tray / ingredients</span>
                  <div
                    className={`storage-pickup-effect ${interiorVisualState.storage.pickupVisible ? 'effect-visible' : 'effect-hidden'}`}
                    data-testid="storage-pickup-effect"
                    data-effect-kind={interiorVisualState.effect.kind === 'storagePickup' ? interiorVisualState.effect.kind : ''}
                    data-item-kind={interiorVisualState.storage.itemKind ?? ''}
                    data-next-zone={interiorVisualState.storage.nextZone ?? ''}
                  >
                    <strong>{interiorVisualState.storage.itemKind ?? 'supply'}</strong>
                    <span>staged</span>
                  </div>
                </section>
              </div>
              <div
                className="zone-hit kitchen-zone-hit"
                role="button"
                tabIndex={0}
                data-testid="zone-kitchen"
                data-worker-present={['prep', 'fryer', 'grill', 'oven', 'drink'].includes(interiorVisualState.worker.currentZone)}
                data-worker-target={['prep', 'fryer', 'grill', 'oven', 'drink'].includes(interiorVisualState.worker.targetZone ?? '')}
                onClick={() => moveToZone(activeGuide.zone === 'fryer' || activeGuide.zone === 'grill' || activeGuide.zone === 'oven' || activeGuide.zone === 'drink' ? activeGuide.zone : 'prep')}
                onKeyDown={(event) =>
                  onZoneKeyDown(
                    event,
                    activeGuide.zone === 'fryer' || activeGuide.zone === 'grill' || activeGuide.zone === 'oven' || activeGuide.zone === 'drink'
                      ? activeGuide.zone
                      : 'prep',
                  )
                }
              >
                <section className="service-zone kitchen-zone" data-testid="scene-zone-kitchen">
                  <strong>Kitchen Stations</strong>
                  <span>connected prep line</span>
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
                          role="button"
                          tabIndex={0}
                          className={`station-marker station-${id} station-${station.status} ${
                            activeGuide.zone === id || workerZone === id || actionCue.workerZone === id ? 'next-step' : ''
                          }`}
                          style={{ '--station-progress': `${progress}%` } as CSSProperties & Record<'--station-progress', string>}
                          data-testid={`scene-station-${id}`}
                          data-worker-present={interiorVisualState.zones[id].workerPresent}
                          data-worker-target={interiorVisualState.zones[id].workerTarget}
                          data-action-available={interiorVisualState.zones[id].actionAvailable}
                          onClick={(event) => {
                            event.stopPropagation();
                            moveToZone(id);
                          }}
                          onKeyDown={(event) => {
                            event.stopPropagation();
                            onZoneKeyDown(event, id);
                          }}
                        >
                          <strong>{stationPositions[id]}</strong>
                          <span>{stationEffectLabel(station.status, station.product)}</span>
                          <em
                            className={`station-world-effect effect-${interiorVisualState.stations[id].effect.status} ${
                              interiorVisualState.stations[id].effect.visible ? 'effect-visible' : 'effect-hidden'
                            }`}
                            data-testid={`station-effect-${id}`}
                            data-station-effect={interiorVisualState.stations[id].effect.status}
                            data-effect-tone={interiorVisualState.stations[id].effect.tone}
                            data-item-kind={interiorVisualState.stations[id].effect.itemKind ?? ''}
                          >
                            {interiorVisualState.stations[id].effect.status}
                          </em>
                          <i />
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
              <div
                className="zone-hit window-zone-hit"
                role="button"
                tabIndex={0}
                data-testid="zone-window"
                data-worker-present={interiorVisualState.zones.window.workerPresent || interiorVisualState.zones.shutter.workerPresent}
                data-worker-target={interiorVisualState.zones.window.workerTarget || interiorVisualState.zones.shutter.workerTarget}
                data-action-available={interiorVisualState.zones.window.actionAvailable || interiorVisualState.zones.shutter.actionAvailable}
                onClick={() => moveToZone(activeGuide.zone === 'shutter' ? 'shutter' : 'window')}
                onKeyDown={(event) => onZoneKeyDown(event, activeGuide.zone === 'shutter' ? 'shutter' : 'window')}
              >
                <section
                  className={`service-zone window-zone ${activeGuide.zone === 'window' || activeGuide.zone === 'shutter' ? 'next-step' : ''}`}
                  data-testid="scene-zone-window"
                >
                  <strong>Service Window</strong>
                  <span>{activeGuide.zone === 'shutter' ? 'hold shutter' : 'serve tray'}</span>
                  <div
                    className={`anomaly-window-pressure pressure-${interiorVisualState.windowPressure.status} tone-${interiorVisualState.windowPressure.tone} ${
                      interiorVisualState.windowPressure.visible ? 'effect-visible' : 'effect-hidden'
                    }`}
                    data-testid="anomaly-window-pressure"
                    data-pressure-visible={interiorVisualState.windowPressure.visible}
                    data-anomaly-visible={interiorVisualState.windowPressure.anomalyVisible}
                    data-anomaly-kind={interiorVisualState.windowPressure.anomalyKind}
                    data-worker-away={interiorVisualState.windowPressure.workerAwayFromWindow}
                    data-defense-available={interiorVisualState.windowPressure.defenseAvailable}
                    data-pressure-status={interiorVisualState.windowPressure.status}
                    data-pressure-urgency={interiorVisualState.windowPressure.urgency}
                    data-effect-tone={interiorVisualState.windowPressure.tone}
                  >
                    <strong>{interiorVisualState.windowPressure.anomalyVisible ? 'Anomaly' : 'Window'}</strong>
                    <span>{interiorVisualState.windowPressure.label}</span>
                  </div>
                  <div
                    role="button"
                    tabIndex={0}
                    className={`shutter-defense-world defense-${interiorVisualState.shutterDefense.status} tone-${interiorVisualState.shutterDefense.tone}`}
                    data-testid="shutter-defense-world"
                    data-represented-in-world={interiorVisualState.shutterDefense.representedInWorld}
                    data-defense-visible={interiorVisualState.shutterDefense.visible}
                    data-defense-available={interiorVisualState.shutterDefense.available}
                    data-defense-status={interiorVisualState.shutterDefense.status}
                    data-effect-tone={interiorVisualState.shutterDefense.tone}
                    data-defense-progress={interiorVisualState.shutterDefense.progress.toFixed(2)}
                    onClick={(event) => {
                      event.stopPropagation();
                      useShutterDefense();
                    }}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key !== 'Enter' && event.key !== ' ') return;
                      event.preventDefault();
                      useShutterDefense();
                    }}
                  >
                    <strong>Shutter</strong>
                    <span>{interiorVisualState.shutterDefense.label}</span>
                    <i style={{ width: `${Math.round(interiorVisualState.shutterDefense.progress * 100)}%` }} />
                  </div>
                  <div
                    className={`service-window-feedback feedback-${interiorVisualState.serviceWindow.feedback} ${
                      interiorVisualState.serviceWindow.visible ? 'effect-visible' : 'effect-hidden'
                    }`}
                    data-testid="service-window-feedback"
                    data-service-feedback={interiorVisualState.serviceWindow.feedback}
                    data-effect-tone={interiorVisualState.serviceWindow.tone}
                  >
                    <strong>{interiorVisualState.serviceWindow.feedback}</strong>
                    <span>{interiorVisualState.serviceWindow.label || 'window ready'}</span>
                  </div>
                </section>
              </div>
              <div
                className={`interaction-effect effect-${interiorVisualState.effect.kind} tone-${interiorVisualState.effect.tone} ${
                  interiorVisualState.effect.visible ? 'effect-visible' : 'effect-hidden'
                }`}
                data-testid="interaction-effect"
                data-effect-kind={interiorVisualState.effect.kind}
                data-effect-zone={interiorVisualState.effect.zone}
                data-effect-tone={interiorVisualState.effect.tone}
                data-item-kind={interiorVisualState.effect.itemKind ?? ''}
              >
                <strong>{interiorVisualState.effect.kind}</strong>
                <span>{interiorVisualState.effect.label || 'waiting'}</span>
              </div>
              <div
                className={`invalid-action-feedback ${
                  interiorVisualState.effect.kind === 'invalid' ? 'effect-visible' : 'effect-hidden'
                }`}
                data-testid="invalid-action-feedback"
                data-effect-kind={interiorVisualState.effect.kind === 'invalid' ? 'invalid' : ''}
                data-effect-zone={interiorVisualState.effect.zone}
              >
                <strong>Blocked</strong>
                <span>{interiorVisualState.effect.label}</span>
              </div>
              <div
                className={`tray-world-state tray-${interiorVisualState.tray.status}`}
                data-testid="tray-world-state"
                data-tray-status={interiorVisualState.tray.status}
                data-prepared-count={interiorVisualState.tray.preparedCount}
                data-required-count={interiorVisualState.tray.requiredCount}
                data-missing-count={interiorVisualState.tray.missingCount}
                data-wrong-count={interiorVisualState.tray.wrongCount}
                style={
                  {
                    '--tray-fill':
                      interiorVisualState.tray.requiredCount > 0
                        ? `${Math.round((interiorVisualState.tray.preparedCount / interiorVisualState.tray.requiredCount) * 100)}`
                        : '0',
                  } as CSSProperties & Record<'--tray-fill', string>
                }
              >
                <strong>Tray</strong>
                <span>
                  {interiorVisualState.tray.preparedCount}/{interiorVisualState.tray.requiredCount}
                </span>
                <i />
              </div>
              <div
                className={`worker-path ${interiorVisualState.worker.pathVisible ? 'path-visible' : 'path-hidden'} path-${interiorVisualState.worker.currentZone}-to-${
                  interiorVisualState.worker.targetZone ?? interiorVisualState.worker.currentZone
                }`}
                data-testid="worker-path"
                data-path={interiorVisualState.worker.path.join(' ')}
                data-path-visible={interiorVisualState.worker.pathVisible}
                style={{ '--worker-progress': `${Math.round(interiorVisualState.worker.progress * 100)}%` } as CSSProperties & Record<'--worker-progress', string>}
              />
            <div
              className={`kitchen-worker worker-at-${workerZone} worker-${workerMovement.status} cue-${actionCue.kind}`}
              data-testid="kitchen-worker"
              data-worker-zone={workerZone}
              data-worker-current-zone={workerMovement.currentZone}
              data-worker-target-zone={workerMovement.targetZone ?? ''}
              data-worker-status={workerMovement.status}
              data-worker-progress={interiorVisualState.worker.progress.toFixed(2)}
              data-worker-visual-x={workerVisualPosition.x.toFixed(2)}
              data-worker-visual-y={workerVisualPosition.y.toFixed(2)}
              style={
                {
                  left: `${workerVisualPosition.x}%`,
                  bottom: `${workerVisualPosition.y}%`,
                } as CSSProperties
              }
            >
              <span
                className="worker-avatar-visible"
                data-testid="worker-avatar"
                data-current-zone={interiorVisualState.worker.currentZone}
                data-target-zone={interiorVisualState.worker.targetZone ?? ''}
                data-movement-status={interiorVisualState.worker.status}
                data-arrived={interiorVisualState.worker.arrived}
                data-path-visible={interiorVisualState.worker.pathVisible}
                data-action-available={interiorVisualState.worker.availableAction}
                data-progress={interiorVisualState.worker.progress.toFixed(2)}
                data-visual-x={workerVisualPosition.x.toFixed(2)}
                data-visual-y={workerVisualPosition.y.toFixed(2)}
              >
                <span className="worker-head" />
                <span className="worker-body" />
                <span className="worker-tray" />
              </span>
            </div>
            <div className="next-step-callout" data-testid="next-step-callout">
              <strong>Next</strong>
              <span>{activeGuide.label}</span>
            </div>
            </div>
          </div>
          <div
            className={`reference-visitor active-visitor-dossier visitor-${visualCustomer?.anomalyKind ?? 'normal'}`}
            data-testid="reference-active-visitor-layer"
            data-reference-src={visitorAsset}
            data-anomaly-kind={visualCustomer?.anomalyKind ?? 'normal'}
            data-presentation-cue={visualState.street.activeVisitor?.presentation.cueMarker ?? 'none'}
            data-presentation-threat-read={visualState.street.activeVisitor?.presentation.threatRead ?? 'ordinary'}
          />
          <img
            className="reference-worker active-worker-dossier"
            src={referenceAssets.workerMale}
            alt=""
            loading="lazy"
            decoding="async"
            fetchPriority="low"
            draggable="false"
          />
          <div className="in-world-label active-label">
            <strong>CURRENT WINDOW</strong>
            <span>{cueLabel(threatCue)}</span>
          </div>
        </>
      )}
    </div>
  );
}
