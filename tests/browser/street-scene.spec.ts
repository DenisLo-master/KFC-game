import { expect, test } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { inflateSync } from 'node:zlib';

type PngPixels = {
  width: number;
  height: number;
  data: Uint8Array;
};

function concatBytes(chunks: Uint8Array[]) {
  const totalLength = chunks.reduce((total, chunk) => total + chunk.length, 0);
  const bytes = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}

function decodePngRgba(png: Uint8Array): PngPixels {
  let offset = 8;
  let width = 0;
  let height = 0;
  let colorType = 0;
  const idatChunks: Uint8Array[] = [];

  while (offset < png.length) {
    const length = (png[offset] << 24) | (png[offset + 1] << 16) | (png[offset + 2] << 8) | png[offset + 3];
    const type = String.fromCharCode(png[offset + 4], png[offset + 5], png[offset + 6], png[offset + 7]);
    const dataStart = offset + 8;
    const dataEnd = dataStart + length;

    if (type === 'IHDR') {
      width = (png[dataStart] << 24) | (png[dataStart + 1] << 16) | (png[dataStart + 2] << 8) | png[dataStart + 3];
      height = (png[dataStart + 4] << 24) | (png[dataStart + 5] << 16) | (png[dataStart + 6] << 8) | png[dataStart + 7];
      colorType = png[dataStart + 9];
      const bitDepth = png[dataStart + 8];
      if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
        throw new Error(`Unsupported PNG format: bitDepth=${bitDepth}, colorType=${colorType}`);
      }
    } else if (type === 'IDAT') {
      idatChunks.push(png.slice(dataStart, dataEnd));
    } else if (type === 'IEND') {
      break;
    }

    offset = dataEnd + 4;
  }

  const channels = colorType === 6 ? 4 : 3;
  const rowLength = width * channels;
  const inflated = inflateSync(concatBytes(idatChunks));
  const rawRows = new Uint8Array(inflated);
  const rgba = new Uint8Array(width * height * 4);
  let rawOffset = 0;
  let rgbaOffset = 0;
  let previous = new Uint8Array(rowLength);

  for (let y = 0; y < height; y += 1) {
    const filter = rawRows[rawOffset];
    rawOffset += 1;
    const row = rawRows.slice(rawOffset, rawOffset + rowLength);
    rawOffset += rowLength;
    const unfiltered = new Uint8Array(rowLength);

    for (let x = 0; x < rowLength; x += 1) {
      const left = x >= channels ? unfiltered[x - channels] : 0;
      const up = previous[x] ?? 0;
      const upLeft = x >= channels ? previous[x - channels] : 0;
      const paethP = left + up - upLeft;
      const paethA = Math.abs(paethP - left);
      const paethB = Math.abs(paethP - up);
      const paethC = Math.abs(paethP - upLeft);
      const paeth = paethA <= paethB && paethA <= paethC ? left : paethB <= paethC ? up : upLeft;
      const predictor = filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth : 0;
      unfiltered[x] = (row[x] + predictor) & 255;
    }

    for (let x = 0; x < width; x += 1) {
      const sourceOffset = x * channels;
      rgba[rgbaOffset] = unfiltered[sourceOffset];
      rgba[rgbaOffset + 1] = unfiltered[sourceOffset + 1];
      rgba[rgbaOffset + 2] = unfiltered[sourceOffset + 2];
      rgba[rgbaOffset + 3] = colorType === 6 ? unfiltered[sourceOffset + 3] : 255;
      rgbaOffset += 4;
    }

    previous = unfiltered;
  }

  return { width, height, data: rgba };
}

function getPixelVariance(pixels: PngPixels) {
  const buckets = new Set<string>();
  const background = { r: 9, g: 11, b: 13 };
  let totalSamples = 0;
  let nonBackgroundSamples = 0;
  let lumaSum = 0;
  let lumaSquaredSum = 0;

  for (let y = 0; y < pixels.height; y += 8) {
    for (let x = 0; x < pixels.width; x += 8) {
      const offset = (y * pixels.width + x) * 4;
      const r = pixels.data[offset];
      const g = pixels.data[offset + 1];
      const b = pixels.data[offset + 2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const distanceFromBackground = Math.abs(r - background.r) + Math.abs(g - background.g) + Math.abs(b - background.b);

      totalSamples += 1;
      lumaSum += luma;
      lumaSquaredSum += luma * luma;
      buckets.add(`${Math.round(r / 24)}-${Math.round(g / 24)}-${Math.round(b / 24)}`);
      if (distanceFromBackground > 28) {
        nonBackgroundSamples += 1;
      }
    }
  }

  const meanLuma = lumaSum / Math.max(totalSamples, 1);
  return {
    width: pixels.width,
    height: pixels.height,
    distinctColorBuckets: buckets.size,
    lumaVariance: lumaSquaredSum / Math.max(totalSamples, 1) - meanLuma * meanLuma,
    nonBackgroundRatio: nonBackgroundSamples / Math.max(totalSamples, 1),
  };
}

async function waitForReferenceArt(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const exterior = document.querySelector('[data-testid="reference-exterior-layer"]');
    const service = document.querySelector('[data-testid="reference-service-layer"]');
    return [exterior, service].every((element) => element instanceof HTMLImageElement && element.complete && element.naturalWidth > 1000);
  });
}

async function captureArtifact(page: import('@playwright/test').Page, path: string) {
  mkdirSync(dirname(path), { recursive: true });
  await page.screenshot({ path, animations: 'disabled' });
}

test.describe('Phase 2 pre-shift street scene', () => {
  test('first load exposes a KFS street scene while keeping quick start available', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await waitForReferenceArt(page);

    await expect(page.locator('canvas')).toBeVisible();
    await expect(page.getByTestId('reference-scene')).toHaveAttribute('data-reference-mode', 'exterior-kiosk');
    await expect(page.getByTestId('reference-exterior-layer')).toBeVisible();
    await expect(page.getByTestId('pre-shift-street')).toBeVisible();
    await expect(page.getByTestId('street-kiosk-anchor')).toContainText(/KFS kiosk/i);
    await expect(page.getByTestId('street-ambient-layer')).toContainText(/wet asphalt/i);
    await expect(page.getByTestId('street-pedestrian-flow')).toContainText(/future visitor/i);
    await expect(page.getByTestId('pre-shift-safety')).toContainText(/safe observation/i);
    await expect(page.getByRole('button', { name: 'Start Shift' })).toBeVisible();
  });

  test('reference-backed frame renders a nonblank kiosk scene on desktop and phone landscape', async ({ page }) => {
    for (const viewport of [
      { width: 1280, height: 720 },
      { width: 667, height: 375 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await waitForReferenceArt(page);
      await page.waitForTimeout(350);

      const renderState = getPixelVariance(decodePngRgba(await page.screenshot({ animations: 'disabled' })));

      expect(renderState.width).toBeGreaterThan(300);
      expect(renderState.height).toBeGreaterThan(200);
      expect(renderState.distinctColorBuckets).toBeGreaterThan(18);
      expect(renderState.lumaVariance).toBeGreaterThan(120);
      expect(renderState.nonBackgroundRatio).toBeGreaterThan(0.28);
    }
  });

  test('captures visual acceptance artifacts for reference-backed pre-shift', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await waitForReferenceArt(page);

    await captureArtifact(page, '.runtime/qa-artifacts/kfs-street-scene-references/phase5/pre-shift-reference-desktop.png');

    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');
    await waitForReferenceArt(page);
    await captureArtifact(page, '.runtime/qa-artifacts/kfs-street-scene-references/phase5/pre-shift-reference-mobile.png');
  });

  test('pre-shift ambience changes while waiting without starting gameplay or penalties', async ({ page }) => {
    await page.setViewportSize({ width: 960, height: 540 });
    await page.goto('/');
    await waitForReferenceArt(page);

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
    await waitForReferenceArt(page);

    await expect(page.getByTestId('orientation-gate')).toBeHidden();
    await expect(page.getByTestId('pre-shift-street')).toBeVisible();
    await expect(page.getByTestId('street-kiosk-anchor')).toBeVisible();
    await expect(page.getByTestId('street-pedestrian-flow')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Shift' })).toBeVisible();
  });

  test('start shift exposes street-to-window encounter continuity while ambience remains active', async ({ page }) => {
    await page.setViewportSize({ width: 960, height: 540 });
    await page.goto('/');
    await waitForReferenceArt(page);

    const ambience = page.getByTestId('street-ambient-layer');
    const firstPulse = await ambience.getAttribute('data-ambient-pulse');

    await page.getByRole('button', { name: 'Start Shift' }).click();

    await expect(page.getByTestId('reference-scene')).toHaveAttribute('data-reference-mode', 'service-window');
    await expect(page.getByTestId('reference-service-layer')).toBeVisible();
    await expect(page.getByTestId('reference-active-visitor-layer')).toBeVisible();
    await expect(page.getByTestId('hud-topbar')).toBeVisible();
    await expect(page.getByTestId('active-encounter-flow')).toContainText(/pre-shift street/i);
    await expect(page.getByTestId('active-encounter-flow')).toContainText(/at window/i);
    await expect(page.getByTestId('active-street-ambience')).toBeVisible();
    await expect(page.getByTestId('order-panel')).toBeVisible();
    await expect(page.getByTestId('action-dock')).toBeVisible();

    await page.waitForTimeout(1200);
    const nextPulse = await page.getByTestId('active-street-ambience').getAttribute('data-ambient-pulse');
    expect(nextPulse).not.toBe(firstPulse);

    await captureArtifact(page, '.runtime/qa-artifacts/kfs-street-scene-references/phase5/active-service-reference.png');
  });

  test('normal serve exposes departure and replacement flow without hiding controls', async ({ page }) => {
    await page.setViewportSize({ width: 960, height: 540 });
    await page.goto('/');
    await waitForReferenceArt(page);
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
