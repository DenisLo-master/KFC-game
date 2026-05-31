import { expect, test } from '@playwright/test';

test.describe('Phase 2 pre-shift street scene', () => {
  test('first load exposes a KFS street scene while keeping quick start available', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.getByTestId('pre-shift-street')).toBeVisible();
    await expect(page.getByTestId('street-kiosk-anchor')).toContainText(/KFS kiosk/i);
    await expect(page.getByTestId('street-ambient-layer')).toContainText(/wet asphalt/i);
    await expect(page.getByTestId('street-pedestrian-flow')).toContainText(/future visitor/i);
    await expect(page.getByTestId('pre-shift-safety')).toContainText(/safe observation/i);
    await expect(page.getByRole('button', { name: 'Start Shift' })).toBeVisible();
  });

  test('pre-shift ambience changes while waiting without starting gameplay or penalties', async ({ page }) => {
    await page.setViewportSize({ width: 960, height: 540 });
    await page.goto('/');

    const ambience = page.getByTestId('street-ambient-layer');
    const firstPulse = await ambience.getAttribute('data-ambient-pulse');

    await page.waitForFunction(
      ({ testId, first }) => document.querySelector(`[data-testid="${testId}"]`)?.getAttribute('data-ambient-pulse') !== first,
      { testId: 'street-ambient-layer', first: firstPulse },
      { timeout: 2500 },
    );

    await expect(page.getByTestId('pre-shift-safety')).toContainText(/mistakes 0/i);
    await expect(page.getByTestId('pre-shift-safety')).toContainText(/threat 0/i);
    await expect(page.getByTestId('pre-shift-safety')).toContainText(/shift 90/i);
    await expect(page.getByTestId('hud-topbar')).toBeHidden();

    const nextPulse = await ambience.getAttribute('data-ambient-pulse');
    expect(nextPulse).not.toBe(firstPulse);
  });

  test('phone landscape menu keeps street identity visible behind the overlay', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');

    await expect(page.getByTestId('orientation-gate')).toBeHidden();
    await expect(page.getByTestId('pre-shift-street')).toBeVisible();
    await expect(page.getByTestId('street-kiosk-anchor')).toBeVisible();
    await expect(page.getByTestId('street-pedestrian-flow')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Shift' })).toBeVisible();
  });

  test('start shift exposes street-to-window encounter continuity while ambience remains active', async ({ page }) => {
    await page.setViewportSize({ width: 960, height: 540 });
    await page.goto('/');

    const ambience = page.getByTestId('street-ambient-layer');
    const firstPulse = await ambience.getAttribute('data-ambient-pulse');

    await page.getByRole('button', { name: 'Start Shift' }).click();

    await expect(page.getByTestId('hud-topbar')).toBeVisible();
    await expect(page.getByTestId('active-encounter-flow')).toContainText(/pre-shift street/i);
    await expect(page.getByTestId('active-encounter-flow')).toContainText(/at window/i);
    await expect(page.getByTestId('active-street-ambience')).toBeVisible();
    await expect(page.getByTestId('order-panel')).toBeVisible();
    await expect(page.getByTestId('action-dock')).toBeVisible();

    await page.waitForTimeout(1200);
    const nextPulse = await page.getByTestId('active-street-ambience').getAttribute('data-ambient-pulse');
    expect(nextPulse).not.toBe(firstPulse);
  });

  test('normal serve exposes departure and replacement flow without hiding controls', async ({ page }) => {
    await page.setViewportSize({ width: 960, height: 540 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Start Shift' }).click();

    await page.getByRole('button', { name: /^Fryer/i }).click();
    await expect(page.getByRole('button', { name: /^Collect fries/i })).toBeVisible({ timeout: 5000 });
    await page.getByRole('button', { name: /^Collect fries/i }).click();
    await page.getByTestId('serve-action').click();

    await expect(page.getByTestId('active-encounter-flow')).toContainText(/served leaving/i);
    await expect(page.getByTestId('active-encounter-flow')).toContainText(/replacement approaching/i);
    await expect(page.getByTestId('serve-action')).toBeVisible();
    await expect(page.getByTestId('shutter-action')).toBeVisible();
  });
});
