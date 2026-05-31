import { expect, test, type Locator, type Page } from '@playwright/test';

async function startShift(page: Page) {
  await page.goto('/');
  await page.getByRole('button', { name: 'Start Shift' }).click();
  await expect(page.getByTestId('hud-topbar')).toBeVisible();
}

async function expectMinTouchTarget(locator: Locator) {
  const box = await locator.boundingBox();
  expect(box, `${await locator.textContent()} should be measurable`).not.toBeNull();
  expect(box!.width, `${await locator.textContent()} width`).toBeGreaterThanOrEqual(44);
  expect(box!.height, `${await locator.textContent()} height`).toBeGreaterThanOrEqual(44);
}

async function expectWithinViewport(locator: Locator, page: Page) {
  const box = await locator.boundingBox();
  const viewport = page.viewportSize();
  expect(box, `${await locator.textContent()} should be measurable`).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(box!.x, `${await locator.textContent()} left edge`).toBeGreaterThanOrEqual(0);
  expect(box!.y, `${await locator.textContent()} top edge`).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width, `${await locator.textContent()} right edge`).toBeLessThanOrEqual(viewport!.width);
  expect(box!.y + box!.height, `${await locator.textContent()} bottom edge`).toBeLessThanOrEqual(viewport!.height);
}

test.describe('Phase 3 mobile HUD acceptance', () => {
  test('AT-02 gates phone portrait with a rotate prompt before gameplay', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await expect(page.getByTestId('orientation-gate')).toBeVisible();
    await expect(page.getByText(/rotate your device horizontally/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Shift' })).toBeVisible();
  });

  test('AT-03/05 keeps the phone landscape HUD and primary controls visible without page scroll', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await startShift(page);

    await expect(page.getByTestId('orientation-gate')).toBeHidden();
    await expect(page.getByTestId('hud-topbar')).toContainText(/Score/);
    await expect(page.getByTestId('hud-topbar')).toContainText(/Mistakes/);
    await expect(page.getByTestId('hud-topbar')).toContainText(/Threat/);
    await expect(page.getByTestId('hud-topbar')).toContainText(/Shift/);
    await expect(page.getByTestId('order-panel')).toBeVisible();
    await expect(page.getByTestId('prep-panel')).toBeVisible();
    await expect(page.getByTestId('action-dock')).toBeVisible();
    await expect(page.getByRole('button', { name: /^Fryer/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Grill Burger/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Oven nuggets/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Oven strips/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Drink/i })).toBeVisible();

    const hasPageScroll = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
    expect(hasPageScroll).toBe(false);
  });

  test('AT-03/05 keeps tablet landscape HUD controls large enough for touch', async ({ page }) => {
    await page.setViewportSize({ width: 1024, height: 768 });
    await startShift(page);

    await expect(page.getByTestId('orientation-gate')).toBeHidden();
    await expectMinTouchTarget(page.getByRole('button', { name: /^Pause/i }));
    await expectMinTouchTarget(page.getByRole('button', { name: /^Reset/i }));
    await expectMinTouchTarget(page.getByRole('button', { name: /^Serve$/i }));
    await expectMinTouchTarget(page.getByRole('button', { name: /hold shutter/i }));
  });

  test('AT-03/05 keeps very small landscape action dock within its own bounds', async ({ page }) => {
    await page.setViewportSize({ width: 568, height: 320 });
    await startShift(page);

    const dock = page.getByTestId('action-dock');
    await expect(dock).toBeVisible();

    const dockOverflow = await dock.evaluate((element) => element.scrollWidth > element.clientWidth);
    expect(dockOverflow).toBe(false);

    const keyControls = [
      page.getByRole('button', { name: /^Fryer/i }),
      page.getByRole('button', { name: /^Grill Burger/i }),
      page.getByRole('button', { name: /^Oven nuggets/i }),
      page.getByRole('button', { name: /^Oven strips/i }),
      page.getByRole('button', { name: /^Drink/i }),
      page.getByRole('button', { name: /^Serve$/i }),
      page.getByRole('button', { name: /hold shutter/i }),
    ];

    for (const control of keyControls) {
      await expect(control).toBeVisible();
      await expectMinTouchTarget(control);
      await expectWithinViewport(control, page);
    }
  });

  test('AT-10/11 separates Serve from Hold Shutter and exposes hold progress', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await startShift(page);

    const serve = page.getByTestId('serve-action');
    const shutter = page.getByTestId('shutter-action');
    await expect(serve).toBeVisible();
    await expect(shutter).toBeVisible();
    await expect(page.getByRole('progressbar', { name: /shutter hold/i })).toBeVisible();

    const serveBox = await serve.boundingBox();
    const shutterBox = await shutter.boundingBox();
    expect(serveBox).not.toBeNull();
    expect(shutterBox).not.toBeNull();
    expect(shutterBox!.x - (serveBox!.x + serveBox!.width)).toBeGreaterThanOrEqual(12);

    await shutter.dispatchEvent('pointerdown', { pointerId: 1, pointerType: 'touch', isPrimary: true });
    await expect(page.getByRole('progressbar', { name: /shutter hold/i })).toHaveAttribute('aria-valuenow', /[1-9]\d*/);
    await shutter.dispatchEvent('pointerup', { pointerId: 1, pointerType: 'touch', isPrimary: true });
  });

  test('active service view exposes zones, worker movement, station feedback, and next-step guidance', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await startShift(page);

    await expect(page.getByTestId('service-layout')).toBeVisible();
    await expect(page.getByTestId('scene-zone-storage')).toBeVisible();
    await expect(page.getByTestId('scene-zone-storage')).toContainText(/Storage/i);
    await expect(page.getByTestId('scene-zone-kitchen')).toBeVisible();
    await expect(page.getByTestId('scene-zone-kitchen')).toContainText(/Kitchen Stations/i);
    await expect(page.getByTestId('scene-zone-window')).toBeVisible();
    await expect(page.getByTestId('scene-zone-window')).toContainText(/Service Window/i);
    await expect(page.getByTestId('gameplay-guide')).toBeVisible();
    await expect(page.getByTestId('gameplay-guide')).toContainText(/Start/i);
    await expect(page.getByTestId('next-step-callout')).toBeVisible();
    await expect(page.getByTestId('next-step-callout')).toContainText(/Next/i);
    await expect(page.getByTestId('kitchen-worker')).toHaveAttribute('data-worker-zone', 'window');

    await page.getByRole('button', { name: /^Fryer/i }).click();
    await expect(page.getByTestId('kitchen-worker')).toHaveAttribute('data-worker-zone', 'fryer');
    await expect(page.getByTestId('scene-station-fryer')).toContainText(/cooking/i);
    await expect(page.getByTestId('prep-station-fryer')).toContainText(/fries/i);

    await expect(page.getByRole('button', { name: /^Collect fries/i })).toBeVisible({ timeout: 4500 });
    await expect(page.getByTestId('scene-station-fryer')).toContainText(/ready/i);
  });

  test('AT-12 pause, resume, and reset are visible and usable without keyboard', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await startShift(page);

    await expect(page.getByRole('button', { name: /^Pause/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Reset/i })).toBeVisible();

    await page.getByRole('button', { name: /^Pause/i }).click();
    await expect(page.getByRole('heading', { name: 'Paused' })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Resume/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Reset/i })).toBeVisible();

    await page.getByRole('button', { name: /^Resume/i }).click();
    await expect(page.getByTestId('hud-topbar')).toBeVisible();

    await page.getByRole('button', { name: /^Reset/i }).click();
    await expect(page.getByRole('button', { name: 'Start Shift' })).toBeVisible();
  });
});
