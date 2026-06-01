import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const artifactDir = '.runtime/qa-artifacts/interior-movement-interactions/phase3';

async function startShift(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Shift' }).click();
  await expect(page.getByTestId('interior-scene')).toBeVisible();
}

async function captureArtifact(page: Page, path: string) {
  mkdirSync(dirname(path), { recursive: true });
  await page.screenshot({ path, animations: 'disabled' });
}

async function visibleBox(locator: Locator, label: string) {
  await expect(locator, `${label} should be visible`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${label} should have a real layout box`).not.toBeNull();
  expect(box!.width, `${label} width`).toBeGreaterThan(0);
  expect(box!.height, `${label} height`).toBeGreaterThan(0);
  return box!;
}

function overlapArea(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
) {
  const x = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return x * y;
}

async function assertNoHudOverlap(page: Page, locator: Locator, label: string) {
  const effectBox = await visibleBox(locator, label);
  const hudLocators = [
    ['HUD topbar', page.getByTestId('hud-topbar')],
    ['action dock', page.getByTestId('action-dock')],
    ['order side panel', page.getByTestId('order-panel')],
    ['prep side panel', page.getByTestId('prep-panel')],
  ] as const;

  for (const [hudLabel, hudLocator] of hudLocators) {
    const hudBox = await visibleBox(hudLocator, hudLabel);
    expect(overlapArea(effectBox, hudBox), `${label} overlaps ${hudLabel}`).toBe(0);
  }
}

async function assertNoWorkerOverlap(page: Page, locator: Locator, label: string) {
  const effectBox = await visibleBox(locator, label);
  const workerBox = await visibleBox(page.getByTestId('worker-avatar'), 'worker avatar');

  expect(overlapArea(effectBox, workerBox), `${label} overlaps worker avatar`).toBe(0);
}

async function clickZoneAndWait(page: Page, zoneTestId: string, arrivedZone: string) {
  await page.getByTestId(zoneTestId).click();
  await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', arrivedZone, { timeout: 8000 });
}

test.describe('Phase 3 in-world interaction feedback', () => {
  test('renders storage, station, tray, service, and invalid effects in the connected interior', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 720 });
    await startShift(page);

    await clickZoneAndWait(page, 'zone-storage', 'storage');
    await page.getByTestId('zone-storage').click();
    const storageEffect = page.getByTestId('storage-pickup-effect');
    await visibleBox(storageEffect, 'storage pickup effect');
    await expect(storageEffect).toHaveAttribute('data-effect-kind', 'storagePickup');
    await expect(storageEffect).toHaveAttribute('data-item-kind', 'fries');
    await captureArtifact(page, `${artifactDir}/storage-pickup.png`);

    await page.getByTestId('zone-storage').click();
    const invalidEffect = page.getByTestId('invalid-action-feedback');
    await visibleBox(invalidEffect, 'invalid action feedback');
    await expect(invalidEffect).toHaveAttribute('data-effect-kind', 'invalid');
    await captureArtifact(page, `${artifactDir}/invalid-action.png`);

    await clickZoneAndWait(page, 'scene-station-fryer', 'fryer');
    await page.getByTestId('scene-station-fryer').click();
    const stationEffect = page.getByTestId('station-effect-fryer');
    await visibleBox(stationEffect, 'station cooking effect');
    await expect(stationEffect).toHaveAttribute('data-station-effect', 'cooking');
    await captureArtifact(page, `${artifactDir}/station-cooking.png`);

    await expect(stationEffect).toHaveAttribute('data-station-effect', 'ready', { timeout: 4000 });
    await captureArtifact(page, `${artifactDir}/station-ready.png`);

    await page.getByRole('button', { name: /Collect fries/i }).click();
    await expect(stationEffect).toHaveAttribute('data-station-effect', 'collected');
    await captureArtifact(page, `${artifactDir}/station-collected.png`);

    const trayState = page.getByTestId('tray-world-state');
    await visibleBox(trayState, 'tray world state');
    await expect(trayState).toHaveAttribute('data-tray-status', 'complete');
    await expect(trayState).toHaveAttribute('data-missing-count', '0');
    await captureArtifact(page, `${artifactDir}/tray-complete.png`);

    await clickZoneAndWait(page, 'zone-window', 'window');
    await page.getByTestId('zone-window').click();
    const serviceFeedback = page.getByTestId('service-window-feedback');
    await visibleBox(serviceFeedback, 'service window feedback');
    await expect(serviceFeedback).toHaveAttribute('data-service-feedback', 'success');
    await captureArtifact(page, `${artifactDir}/service-success.png`);

    await page.setViewportSize({ width: 667, height: 375 });
    await startShift(page);
    await clickZoneAndWait(page, 'zone-storage', 'storage');
    await page.getByTestId('zone-storage').click();
    await assertNoHudOverlap(page, page.getByTestId('storage-pickup-effect'), 'phone storage pickup effect');
    await assertNoHudOverlap(page, page.getByTestId('interaction-effect'), 'phone storage interaction effect');
    await assertNoHudOverlap(page, page.getByTestId('tray-world-state'), 'phone tray world state');
    await assertNoWorkerOverlap(page, page.getByTestId('storage-pickup-effect'), 'phone storage pickup effect');
    await assertNoWorkerOverlap(page, page.getByTestId('interaction-effect'), 'phone storage interaction effect');
    await captureArtifact(page, `${artifactDir}/phone-landscape-storage-pickup-readable.png`);

    await page.getByTestId('zone-storage').click();
    await assertNoHudOverlap(page, page.getByTestId('invalid-action-feedback'), 'phone invalid action feedback');
    await assertNoWorkerOverlap(page, page.getByTestId('invalid-action-feedback'), 'phone invalid action feedback');

    await clickZoneAndWait(page, 'scene-station-fryer', 'fryer');
    await page.getByTestId('scene-station-fryer').click();
    const phoneStationEffect = page.getByTestId('station-effect-fryer');
    await expect(phoneStationEffect).toHaveAttribute('data-station-effect', 'cooking');
    await assertNoHudOverlap(page, phoneStationEffect, 'phone station cooking effect');

    await expect(phoneStationEffect).toHaveAttribute('data-station-effect', 'ready', { timeout: 4000 });
    await assertNoHudOverlap(page, phoneStationEffect, 'phone station ready effect');

    await page.getByRole('button', { name: /Collect fries/i }).click();
    await expect(phoneStationEffect).toHaveAttribute('data-station-effect', 'collected');
    await assertNoHudOverlap(page, phoneStationEffect, 'phone station collected effect');
    await assertNoHudOverlap(page, page.getByTestId('tray-world-state'), 'phone complete tray world state');

    await clickZoneAndWait(page, 'zone-window', 'window');
    await page.getByTestId('zone-window').click();
    await assertNoHudOverlap(page, page.getByTestId('service-window-feedback'), 'phone service window feedback');
    await captureArtifact(page, `${artifactDir}/phone-landscape-service-readable.png`);
    await captureArtifact(page, `${artifactDir}/phone-landscape-interactions.png`);
  });
});
