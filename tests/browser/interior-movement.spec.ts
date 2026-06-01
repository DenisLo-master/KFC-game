import { expect, test, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const artifactDir = '.runtime/qa-artifacts/interior-movement-interactions/phase2';
type Box = { x: number; y: number; width: number; height: number };

async function startShift(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Shift' }).click();
  await expect(page.getByTestId('interior-scene')).toBeVisible();
}

async function captureArtifact(page: Page, path: string) {
  mkdirSync(dirname(path), { recursive: true });
  await page.screenshot({ path, animations: 'disabled' });
}

async function visibleBox(page: Page, testId: string) {
  const locator = page.getByTestId(testId);
  await expect(locator).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${testId} should have a real visible layout box`).not.toBeNull();
  expect(box!.width, `${testId} width`).toBeGreaterThan(0);
  expect(box!.height, `${testId} height`).toBeGreaterThan(0);
  return box!;
}

function overlapArea(a: Box, b: Box) {
  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return xOverlap * yOverlap;
}

async function visualWorkerX(page: Page) {
  const raw = await page.getByTestId('worker-avatar').getAttribute('data-visual-x');
  expect(raw).not.toBeNull();
  return Number(raw);
}

async function visualWorkerProgress(page: Page) {
  const raw = await page.getByTestId('worker-avatar').getAttribute('data-progress');
  expect(raw).not.toBeNull();
  return Number(raw);
}

test.describe('Phase 2 connected interior movement scene', () => {
  test('validates connected interior movement on desktop and phone landscape with one page lifecycle', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await startShift(page);

    await expect(page.getByTestId('interior-scene')).toHaveAttribute('data-connected-interior', 'true');
    await expect(page.getByTestId('zone-storage')).toBeVisible();
    await expect(page.getByTestId('zone-kitchen')).toBeVisible();
    await expect(page.getByTestId('zone-window')).toBeVisible();
    await visibleBox(page, 'zone-storage');
    await visibleBox(page, 'zone-kitchen');
    await visibleBox(page, 'zone-window');
    await visibleBox(page, 'worker-avatar');
    await expect(page.getByTestId('worker-path')).toBeHidden();
    await expect(page.getByTestId('reference-active-visitor-layer')).toBeVisible();

    const worker = page.getByTestId('worker-avatar');
    await expect(worker).toHaveAttribute('data-current-zone', 'window');
    await expect(worker).toHaveAttribute('data-target-zone', '');
    await expect(worker).toHaveAttribute('data-movement-status', 'arrived');
    await expect(worker).toHaveAttribute('data-arrived', 'true');
    await expect(worker).toHaveAttribute('data-progress', '1.00');
    await expect(worker).toHaveAttribute('data-action-available', /serve|window/);

    const initialWorkerBox = await visibleBox(page, 'worker-avatar');
    const initialX = await visualWorkerX(page);

    await page.getByTestId('zone-storage').click();

    await expect(worker).toHaveAttribute('data-current-zone', 'window');
    await expect(worker).toHaveAttribute('data-target-zone', 'storage');
    await expect(worker).toHaveAttribute('data-movement-status', 'moving');
    await expect(worker).toHaveAttribute('data-path-visible', 'true');
    expect(await visualWorkerProgress(page)).toBeLessThan(0.25);
    const immediateMoveX = await visualWorkerX(page);
    expect(immediateMoveX).toBeGreaterThan(70);
    expect(immediateMoveX).toBeLessThanOrEqual(initialX);
    await expect(page.getByTestId('worker-path')).toBeVisible();
    await expect(page.getByTestId('worker-path')).toHaveAttribute('data-path', 'window storage');
    await expect(page.getByTestId('zone-storage')).toHaveAttribute('data-worker-target', 'true');

    await page.waitForFunction(() => {
      const progress = Number(document.querySelector('[data-testid="worker-avatar"]')?.getAttribute('data-progress') ?? 0);
      return progress > 0.35 && progress < 0.85;
    });
    const midMoveX = await visualWorkerX(page);
    const midMoveBox = await visibleBox(page, 'worker-avatar');
    expect(midMoveX).toBeLessThan(initialX);
    expect(midMoveX).toBeGreaterThan(6);
    expect(Math.abs(midMoveBox.x - initialWorkerBox.x)).toBeGreaterThan(30);
    await captureArtifact(page, `${artifactDir}/interior-movement-desktop.png`);

    await expect(worker).toHaveAttribute('data-current-zone', 'storage', { timeout: 1800 });
    await expect(worker).toHaveAttribute('data-target-zone', '');
    await expect(worker).toHaveAttribute('data-movement-status', 'arrived');
    await expect(worker).toHaveAttribute('data-arrived', 'true');
    await expect(worker).toHaveAttribute('data-path-visible', 'false');
    await expect(page.getByTestId('worker-path')).toBeHidden();
    await expect(worker).toHaveAttribute('data-action-available', 'storage');
    expect(await visualWorkerX(page)).toBe(6);

    await page.setViewportSize({ width: 667, height: 375 });
    await startShift(page);
    await page.getByTestId('zone-storage').click();
    await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-target-zone', 'storage');
    await expect(page.getByTestId('hud-topbar')).toBeVisible();
    await expect(page.getByTestId('action-dock')).toBeVisible();
    await expect(page.getByTestId('worker-path')).toBeVisible();

    const hud = await visibleBox(page, 'hud-topbar');
    const dock = await visibleBox(page, 'action-dock');
    const phoneWorker = await visibleBox(page, 'worker-avatar');
    const anchors = await Promise.all([visibleBox(page, 'zone-storage'), visibleBox(page, 'zone-kitchen'), visibleBox(page, 'zone-window')]);

    for (const [index, anchor] of anchors.entries()) {
      expect(overlapArea(anchor, hud), `anchor ${index} should not overlap the top HUD`).toBe(0);
      expect(overlapArea(anchor, dock), `anchor ${index} should not overlap the action dock`).toBe(0);
    }
    expect(overlapArea(phoneWorker, hud), 'worker should not overlap the top HUD').toBe(0);
    expect(overlapArea(phoneWorker, dock), 'worker should not overlap the action dock').toBe(0);

    await captureArtifact(page, `${artifactDir}/interior-movement-phone-landscape.png`);

    await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', 'storage', { timeout: 1800 });
    await expect(page.getByTestId('worker-path')).toBeHidden();
  });
});
