import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const artifactDir = '.runtime/qa-artifacts/interior-movement-interactions/phase4';

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

async function assertNoCriticalOverlap(page: Page, locator: Locator, label: string) {
  const box = await visibleBox(locator, label);
  const criticalLocators = [
    ['HUD topbar', page.getByTestId('hud-topbar')],
    ['action dock', page.getByTestId('action-dock')],
    ['order panel', page.getByTestId('order-panel')],
    ['prep panel', page.getByTestId('prep-panel')],
    ['worker avatar', page.getByTestId('worker-avatar')],
  ] as const;

  for (const [criticalLabel, criticalLocator] of criticalLocators) {
    const criticalBox = await visibleBox(criticalLocator, criticalLabel);
    expect(overlapArea(box, criticalBox), `${label} overlaps ${criticalLabel}`).toBe(0);
  }
}

async function openPhase4Fixture(
  page: Page,
  kind: 'normal' | 'shadowEyes' | 'longArms' | 'staticSmile',
  options: { customerTimer?: number; threat?: number } = {},
) {
  await page.goto('/?phase4-readability=1');
  await page.waitForFunction(() => typeof window.__kfsPhase4SetActiveCustomer === 'function');
  await page.evaluate(
    ({ activeKind, fixtureOptions }) => {
      window.__kfsPhase4SetActiveCustomer?.(activeKind, fixtureOptions);
    },
    { activeKind: kind, fixtureOptions: options },
  );
  await expect(page.getByTestId('interior-scene')).toBeVisible();
}

async function clickZoneAndWait(page: Page, zoneTestId: string, arrivedZone: string) {
  await page.getByTestId(zoneTestId).click();
  await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', arrivedZone, { timeout: 8000 });
}

test.describe('Phase 4 interior anomaly pressure', () => {
  test('keeps anomaly pressure and shutter defense visible during movement, cooking, storage effects, and outcomes', async ({ page }) => {
    test.setTimeout(90_000);
    await page.setViewportSize({ width: 1280, height: 720 });
    await openPhase4Fixture(page, 'staticSmile');

    await page.getByTestId('zone-storage').click();
    const pressureWhileMoving = page.getByTestId('anomaly-window-pressure');
    await visibleBox(pressureWhileMoving, 'anomaly pressure while moving');
    await expect(pressureWhileMoving).toHaveAttribute('data-pressure-visible', 'true');
    await expect(pressureWhileMoving).toHaveAttribute('data-anomaly-kind', 'staticSmile');
    await expect(pressureWhileMoving).toHaveAttribute('data-worker-away', 'true');
    await expect(pressureWhileMoving).toHaveAttribute('data-defense-available', 'true');
    await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-target-zone', 'storage');
    await captureArtifact(page, `${artifactDir}/anomaly-pressure-moving.png`);

    await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', 'storage', { timeout: 8000 });
    await page.getByTestId('zone-storage').click();
    await visibleBox(page.getByTestId('storage-pickup-effect'), 'storage effect with anomaly pressure');
    await visibleBox(pressureWhileMoving, 'anomaly pressure during storage effect');
    await captureArtifact(page, `${artifactDir}/anomaly-pressure-storage-effect.png`);

    await clickZoneAndWait(page, 'scene-station-fryer', 'fryer');
    await page.getByTestId('scene-station-fryer').click();
    await expect(page.getByTestId('station-effect-fryer')).toHaveAttribute('data-station-effect', 'cooking');
    await visibleBox(pressureWhileMoving, 'anomaly pressure during cooking');
    await captureArtifact(page, `${artifactDir}/anomaly-pressure-cooking.png`);

    await page.getByTestId('shutter-defense-world').click();
    await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', 'shutter', { timeout: 8000 });
    await page.getByTestId('shutter-defense-world').click();
    const defense = page.getByTestId('shutter-defense-world');
    await expect(defense).toHaveAttribute('data-defense-status', 'charging');
    await expect(page.getByTestId('interaction-effect')).toHaveAttribute('data-effect-kind', 'shutterCharging');
    await captureArtifact(page, `${artifactDir}/shutter-charging.png`);

    await expect(page.getByTestId('interaction-effect')).toHaveAttribute('data-effect-kind', 'shutterRepel', { timeout: 4000 });
    await expect(defense).toHaveAttribute('data-defense-status', 'repelled');
    await expect(pressureWhileMoving).toHaveAttribute('data-pressure-status', 'repelled');
    await expect(pressureWhileMoving).toHaveAttribute('data-anomaly-kind', 'staticSmile');
    await expect(page.getByTestId('reference-active-visitor-layer')).toHaveAttribute('data-anomaly-kind', 'staticSmile');
    await expect(page.getByTestId('reference-active-visitor-layer')).toHaveAttribute('data-presentation-cue', 'fixedSmile');
    await captureArtifact(page, `${artifactDir}/shutter-repel.png`);

    await openPhase4Fixture(page, 'staticSmile');
    await page.getByTestId('serve-action').click();
    await expect(page.getByTestId('service-window-feedback')).toHaveAttribute('data-service-feedback', 'anomaly');
    await expect(page.getByTestId('interaction-effect')).toHaveAttribute('data-effect-kind', 'serveAnomaly');
    await captureArtifact(page, `${artifactDir}/serve-anomaly.png`);

    await openPhase4Fixture(page, 'normal');
    await page.getByTestId('shutter-defense-world').click();
    await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', 'shutter', { timeout: 8000 });
    await page.getByTestId('shutter-defense-world').click();
    await expect(page.getByTestId('interaction-effect')).toHaveAttribute('data-effect-kind', 'shutterFalseAlarm', { timeout: 4000 });
    await captureArtifact(page, `${artifactDir}/false-alarm.png`);

    await openPhase4Fixture(page, 'longArms', { customerTimer: 0.2 });
    await expect(page.getByTestId('interaction-effect')).toHaveAttribute('data-effect-kind', 'anomalyTimeout', { timeout: 4000 });
    await expect(page.getByTestId('anomaly-window-pressure')).toHaveAttribute('data-pressure-status', 'late');
    await expect(page.getByTestId('anomaly-window-pressure')).toHaveAttribute('data-anomaly-kind', 'longArms');
    await expect(page.getByTestId('reference-active-visitor-layer')).toHaveAttribute('data-presentation-cue', 'tooLowSleeves');
    await captureArtifact(page, `${artifactDir}/late-anomaly-timeout.png`);

    await page.setViewportSize({ width: 667, height: 375 });
    await openPhase4Fixture(page, 'shadowEyes');
    await page.getByTestId('zone-storage').click();
    await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', 'storage', { timeout: 8000 });
    await assertNoCriticalOverlap(page, page.getByTestId('anomaly-window-pressure'), 'phone anomaly pressure');
    await assertNoCriticalOverlap(page, page.getByTestId('shutter-defense-world'), 'phone shutter defense');
    await captureArtifact(page, `${artifactDir}/phone-landscape-anomaly-pressure.png`);
  });
});

declare global {
  interface Window {
    __kfsPhase4SetActiveCustomer?: (
      kind: 'normal' | 'shadowEyes' | 'longArms' | 'staticSmile',
      options?: { customerTimer?: number; threat?: number },
    ) => void;
  }
}
