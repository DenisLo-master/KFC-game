import { expect, test, type Locator, type Page } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { inflateSync } from 'node:zlib';

const artifactDir = '.runtime/qa-artifacts/interior-movement-interactions/phase5';

type Box = { x: number; y: number; width: number; height: number };
type PngPixels = { width: number; height: number; data: Uint8Array };
type ViewportScenario = {
  name: string;
  width: number;
  height: number;
};

const viewports: ViewportScenario[] = [
  { name: 'desktop-1280x720', width: 1280, height: 720 },
  { name: 'phone-667x375', width: 667, height: 375 },
  { name: 'small-landscape-568x320', width: 568, height: 320 },
  { name: 'tablet-1024x768', width: 1024, height: 768 },
];

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
  const rgba = new Uint8Array(width * height * 4);
  let rawOffset = 0;
  let rgbaOffset = 0;
  let previous = new Uint8Array(rowLength);

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[rawOffset];
    rawOffset += 1;
    const row = inflated.slice(rawOffset, rawOffset + rowLength);
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
    distinctColorBuckets: buckets.size,
    lumaVariance: lumaSquaredSum / Math.max(totalSamples, 1) - meanLuma * meanLuma,
    nonBackgroundRatio: nonBackgroundSamples / Math.max(totalSamples, 1),
  };
}

function overlapArea(a: Box, b: Box) {
  const x = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const y = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return x * y;
}

async function visibleBox(locator: Locator, label: string) {
  await expect(locator, `${label} should be visible`).toBeVisible();
  const box = await locator.boundingBox();
  expect(box, `${label} should have a real layout box`).not.toBeNull();
  expect(box!.width, `${label} width`).toBeGreaterThan(0);
  expect(box!.height, `${label} height`).toBeGreaterThan(0);
  return box!;
}

async function visibleBoxes(page: Page, entries: readonly (readonly [string, Locator])[]) {
  const boxes = new Map<string, Box>();
  for (const [label, locator] of entries) {
    boxes.set(label, await visibleBox(locator, label));
  }
  return boxes;
}

async function assertNoScroll(page: Page, label: string) {
  const scrollState = await page.evaluate(() => ({
    bodyScrollHeight: document.body.scrollHeight,
    bodyScrollWidth: document.body.scrollWidth,
    docScrollHeight: document.documentElement.scrollHeight,
    docScrollWidth: document.documentElement.scrollWidth,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  }));

  expect(scrollState.bodyScrollHeight, `${label} body height scroll`).toBeLessThanOrEqual(scrollState.innerHeight);
  expect(scrollState.docScrollHeight, `${label} document height scroll`).toBeLessThanOrEqual(scrollState.innerHeight);
  expect(scrollState.bodyScrollWidth, `${label} body width scroll`).toBeLessThanOrEqual(scrollState.innerWidth);
  expect(scrollState.docScrollWidth, `${label} document width scroll`).toBeLessThanOrEqual(scrollState.innerWidth);
}

async function assertCriticalControls(page: Page, label: string) {
  const controls = [
    ['Pause', page.getByRole('button', { name: /^Pause/i })],
    ['Reset', page.getByRole('button', { name: /^Reset/i })],
    ['Fryer', page.getByRole('button', { name: /^Fryer/i })],
    ['Grill Burger', page.getByRole('button', { name: /^Grill Burger/i })],
    ['Oven nuggets', page.getByRole('button', { name: /^Oven nuggets/i })],
    ['Oven strips', page.getByRole('button', { name: /^Oven strips/i })],
    ['Drink', page.getByRole('button', { name: /^Drink/i })],
    ['Serve', page.getByTestId('serve-action')],
    ['Quick', page.getByRole('button', { name: /^Quick/i })],
    ['Clear', page.getByRole('button', { name: /^Clear/i })],
    ['Hold Shutter', page.getByTestId('shutter-action')],
  ] as const;
  const viewport = page.viewportSize();
  expect(viewport).not.toBeNull();

  for (const [controlLabel, locator] of controls) {
    const box = await visibleBox(locator, `${label} ${controlLabel}`);
    expect(box.width, `${label} ${controlLabel} width`).toBeGreaterThanOrEqual(44);
    expect(box.height, `${label} ${controlLabel} height`).toBeGreaterThanOrEqual(44);
    expect(box.x, `${label} ${controlLabel} left edge`).toBeGreaterThanOrEqual(0);
    expect(box.y, `${label} ${controlLabel} top edge`).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, `${label} ${controlLabel} right edge`).toBeLessThanOrEqual(viewport!.width);
    expect(box.y + box.height, `${label} ${controlLabel} bottom edge`).toBeLessThanOrEqual(viewport!.height);
  }
}

async function assertReleaseLayout(page: Page, label: string) {
  const boxes = await visibleBoxes(page, [
    ['worker avatar', page.getByTestId('worker-avatar')],
    ['worker path', page.getByTestId('worker-path')],
    ['storage pickup', page.getByTestId('storage-pickup-effect')],
    ['interaction effect', page.getByTestId('interaction-effect')],
    ['tray world state', page.getByTestId('tray-world-state')],
    ['anomaly pressure', page.getByTestId('anomaly-window-pressure')],
    ['shutter defense', page.getByTestId('shutter-defense-world')],
    ['HUD topbar', page.getByTestId('hud-topbar')],
    ['action dock', page.getByTestId('action-dock')],
    ['order panel', page.getByTestId('order-panel')],
    ['prep panel', page.getByTestId('prep-panel')],
  ]);

  const noOverlapPairs = [
    ['worker avatar', 'HUD topbar'],
    ['worker avatar', 'action dock'],
    ['worker avatar', 'order panel'],
    ['worker avatar', 'prep panel'],
    ['worker path', 'HUD topbar'],
    ['worker path', 'action dock'],
    ['worker path', 'order panel'],
    ['worker path', 'prep panel'],
    ['storage pickup', 'worker avatar'],
    ['storage pickup', 'HUD topbar'],
    ['storage pickup', 'action dock'],
    ['storage pickup', 'order panel'],
    ['storage pickup', 'prep panel'],
    ['interaction effect', 'worker avatar'],
    ['interaction effect', 'HUD topbar'],
    ['interaction effect', 'action dock'],
    ['interaction effect', 'order panel'],
    ['interaction effect', 'prep panel'],
    ['tray world state', 'worker avatar'],
    ['tray world state', 'HUD topbar'],
    ['tray world state', 'action dock'],
    ['tray world state', 'order panel'],
    ['tray world state', 'prep panel'],
    ['anomaly pressure', 'worker avatar'],
    ['anomaly pressure', 'HUD topbar'],
    ['anomaly pressure', 'action dock'],
    ['anomaly pressure', 'order panel'],
    ['anomaly pressure', 'prep panel'],
    ['anomaly pressure', 'shutter defense'],
    ['storage pickup', 'interaction effect'],
    ['storage pickup', 'tray world state'],
    ['storage pickup', 'anomaly pressure'],
    ['storage pickup', 'shutter defense'],
    ['interaction effect', 'tray world state'],
    ['interaction effect', 'anomaly pressure'],
    ['interaction effect', 'shutter defense'],
    ['tray world state', 'anomaly pressure'],
    ['tray world state', 'shutter defense'],
    ['shutter defense', 'worker avatar'],
    ['shutter defense', 'HUD topbar'],
    ['shutter defense', 'action dock'],
    ['shutter defense', 'order panel'],
    ['shutter defense', 'prep panel'],
    ['order panel', 'action dock'],
    ['prep panel', 'action dock'],
    ['order panel', 'prep panel'],
  ] as const;

  for (const [a, b] of noOverlapPairs) {
    expect(overlapArea(boxes.get(a)!, boxes.get(b)!), `${label}: ${a} overlaps ${b}`).toBe(0);
  }
}

async function captureAndAssertNonblank(page: Page, path: string, label: string) {
  mkdirSync(dirname(path), { recursive: true });
  const screenshot = await page.screenshot({ path, animations: 'disabled' });
  const variance = getPixelVariance(decodePngRgba(screenshot));
  expect(variance.distinctColorBuckets, `${label} distinct colors`).toBeGreaterThan(18);
  expect(variance.lumaVariance, `${label} luma variance`).toBeGreaterThan(120);
  expect(variance.nonBackgroundRatio, `${label} non-background ratio`).toBeGreaterThan(0.28);
}

async function openPhase4Fixture(page: Page, kind: 'normal' | 'shadowEyes' | 'longArms' | 'staticSmile') {
  await page.goto('/?phase4-readability=1');
  await page.waitForFunction(() => typeof window.__kfsPhase4SetActiveCustomer === 'function');
  await page.evaluate((activeKind) => window.__kfsPhase4SetActiveCustomer?.(activeKind), kind);
  await expect(page.getByTestId('interior-scene')).toBeVisible();
}

async function prepareReleaseState(page: Page) {
  await openPhase4Fixture(page, 'staticSmile');
  await page.getByTestId('zone-storage').click();
  await expect(page.getByTestId('worker-avatar')).toHaveAttribute('data-current-zone', 'storage', { timeout: 8000 });
  await page.getByTestId('zone-storage').click();
  await expect(page.getByTestId('storage-pickup-effect')).toHaveAttribute('data-effect-kind', 'storagePickup');
  await page.getByTestId('zone-window').click();
  await expect(page.getByTestId('worker-path')).toBeVisible();
  await expect(page.getByTestId('anomaly-window-pressure')).toHaveAttribute('data-pressure-visible', 'true');
  await expect(page.getByTestId('shutter-defense-world')).toHaveAttribute('data-represented-in-world', 'true');
}

test.describe('Phase 5 responsive release matrix', () => {
  test('keeps the final interior runtime playable and non-overlapping across release viewports', async ({ page }) => {
    test.setTimeout(120_000);

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await prepareReleaseState(page);

      await assertNoScroll(page, viewport.name);
      await assertCriticalControls(page, viewport.name);
      await assertReleaseLayout(page, viewport.name);
      await expect(page.getByTestId('reference-scene')).toHaveAttribute('data-reference-mode', 'service-window');
      await expect(page.getByTestId('interior-scene')).toHaveAttribute('data-connected-interior', 'true');
      await expect(page.getByTestId('reference-service-layer')).toBeVisible();
      await expect(page.getByTestId('reference-active-visitor-layer')).toHaveAttribute('data-anomaly-kind', 'staticSmile');

      await captureAndAssertNonblank(page, `${artifactDir}/release-matrix-${viewport.name}.png`, viewport.name);
    }
  });
});

declare global {
  interface Window {
    __kfsPhase4SetActiveCustomer?: (kind: 'normal' | 'shadowEyes' | 'longArms' | 'staticSmile') => void;
  }
}
