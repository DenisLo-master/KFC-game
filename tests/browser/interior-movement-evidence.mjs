import { chromium } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { spawn } from 'node:child_process';
import { inflateSync } from 'node:zlib';

const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:4173';
const artifactDir = '.runtime/qa-artifacts/interior-movement-interactions/phase2';
const desktopArtifact = join(artifactDir, 'interior-movement-desktop-corrective.png');
const phoneArtifact = join(artifactDir, 'interior-movement-phone-landscape-corrective.png');
const reportArtifact = join(artifactDir, 'interior-movement-corrective-evidence.json');

mkdirSync(artifactDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function isReachable() {
  try {
    const response = await fetch(baseUrl, { signal: AbortSignal.timeout(500) });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(processHandle) {
  const started = Date.now();
  while (Date.now() - started < 20_000) {
    if (await isReachable()) return;
    if (processHandle.exitCode !== null) {
      throw new Error(`preview server exited early with code ${processHandle.exitCode}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`preview server did not become reachable at ${baseUrl}`);
}

async function ensurePreviewServer() {
  if (await isReachable()) return null;

  const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], {
    stdio: 'ignore',
    detached: false,
  });
  await waitForServer(server);
  return server;
}

async function visibleBox(page, testId) {
  const locator = page.getByTestId(testId);
  await locator.waitFor({ state: 'visible' });
  const box = await locator.boundingBox();
  assert(box && box.width > 0 && box.height > 0, `${testId} must have a non-zero visible box`);
  return box;
}

async function hidden(page, testId) {
  return page.getByTestId(testId).evaluate((node) => {
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.visibility === 'hidden' || style.display === 'none' || rect.width === 0 || rect.height === 0;
  });
}

function overlapArea(a, b) {
  const xOverlap = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const yOverlap = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  return xOverlap * yOverlap;
}

function readChunks(buffer) {
  const chunks = [];
  let offset = 8;
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString('ascii', offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;
  }
  return chunks;
}

function paeth(left, up, upLeft) {
  const estimate = left + up - upLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upLeftDistance = Math.abs(estimate - upLeft);
  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) return left;
  return upDistance <= upLeftDistance ? up : upLeft;
}

function pngStats(buffer) {
  const chunks = readChunks(buffer);
  const header = chunks.find((chunk) => chunk.type === 'IHDR')?.data;
  assert(header, 'PNG missing IHDR chunk');
  const width = header.readUInt32BE(0);
  const height = header.readUInt32BE(4);
  const bitDepth = header[8];
  const colorType = header[9];
  assert(bitDepth === 8, `unsupported PNG bit depth ${bitDepth}`);
  const channelsByType = { 2: 3, 6: 4 };
  const channels = channelsByType[colorType];
  assert(channels, `unsupported PNG color type ${colorType}`);

  const data = inflateSync(Buffer.concat(chunks.filter((chunk) => chunk.type === 'IDAT').map((chunk) => chunk.data)));
  const stride = width * channels;
  const pixels = Buffer.alloc(stride * height);
  let sourceOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = data[sourceOffset];
    sourceOffset += 1;
    const rowOffset = y * stride;

    for (let x = 0; x < stride; x += 1) {
      const raw = data[sourceOffset + x];
      const left = x >= channels ? pixels[rowOffset + x - channels] : 0;
      const up = y > 0 ? pixels[rowOffset + x - stride] : 0;
      const upLeft = y > 0 && x >= channels ? pixels[rowOffset + x - stride - channels] : 0;
      let value = raw;
      if (filter === 1) value = raw + left;
      if (filter === 2) value = raw + up;
      if (filter === 3) value = raw + Math.floor((left + up) / 2);
      if (filter === 4) value = raw + paeth(left, up, upLeft);
      pixels[rowOffset + x] = value & 255;
    }

    sourceOffset += stride;
  }

  let samples = 0;
  let sum = 0;
  let sumSquares = 0;
  let min = 255;
  let max = 0;
  const pixelStep = Math.max(1, Math.floor((width * height) / 40_000));

  for (let pixelIndex = 0; pixelIndex < width * height; pixelIndex += pixelStep) {
    const offset = pixelIndex * channels;
    const luminance = Math.round(0.2126 * pixels[offset] + 0.7152 * pixels[offset + 1] + 0.0722 * pixels[offset + 2]);
    samples += 1;
    sum += luminance;
    sumSquares += luminance * luminance;
    min = Math.min(min, luminance);
    max = Math.max(max, luminance);
  }

  const mean = sum / samples;
  return {
    width,
    height,
    samples,
    min,
    max,
    variance: sumSquares / samples - mean * mean,
  };
}

async function startShift(page) {
  await page.goto(baseUrl);
  await page.getByRole('button', { name: 'Start Shift' }).click();
  await page.getByTestId('interior-scene').waitFor({ state: 'visible' });
}

async function captureChecked(page, path) {
  mkdirSync(dirname(path), { recursive: true });
  const buffer = await page.screenshot({ path, animations: 'disabled' });
  const stats = pngStats(buffer);
  assert(stats.variance > 60, `${path} should be nonblank; variance was ${stats.variance.toFixed(2)}`);
  assert(stats.max - stats.min > 35, `${path} should have visible contrast`);
  return stats;
}

let server = null;
let browser = null;

try {
  server = await ensurePreviewServer();
  browser = await chromium.launch({
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--single-process', '--no-zygote'],
  });
  const page = await browser.newPage();

  await page.setViewportSize({ width: 1280, height: 720 });
  await startShift(page);
  assert(await hidden(page, 'worker-path'), 'worker path should be hidden before movement starts');
  const initialX = Number(await page.getByTestId('worker-avatar').getAttribute('data-visual-x'));
  const initialWorker = await visibleBox(page, 'worker-avatar');
  await visibleBox(page, 'zone-storage');
  await visibleBox(page, 'zone-kitchen');
  await visibleBox(page, 'zone-window');

  await page.getByTestId('zone-storage').click();
  assert(!(await hidden(page, 'worker-path')), 'worker path should be visible while moving');
  assert((await page.getByTestId('worker-avatar').getAttribute('data-target-zone')) === 'storage', 'target zone should be storage');
  const immediateX = Number(await page.getByTestId('worker-avatar').getAttribute('data-visual-x'));
  const immediateProgress = Number(await page.getByTestId('worker-avatar').getAttribute('data-progress'));
  assert(immediateProgress < 0.25, `worker should still be near movement start, got progress ${immediateProgress}`);
  assert(immediateX > 70 && immediateX <= initialX, `worker should not jump to storage immediately, got x ${immediateX}`);

  await page.waitForFunction(() => {
    const progress = Number(document.querySelector('[data-testid="worker-avatar"]')?.getAttribute('data-progress') ?? 0);
    return progress > 0.35 && progress < 0.85;
  });
  const midX = Number(await page.getByTestId('worker-avatar').getAttribute('data-visual-x'));
  const midWorker = await visibleBox(page, 'worker-avatar');
  assert(midX < initialX && midX > 6, `mid-movement x should interpolate between window and storage, got ${midX}`);
  assert(Math.abs(midWorker.x - initialWorker.x) > 30, 'visible worker box should move across the scene before arrival');

  const desktopStats = await captureChecked(page, desktopArtifact);
  await page.getByTestId('worker-avatar').waitFor({ state: 'visible' });
  await page.waitForFunction(() => document.querySelector('[data-testid="worker-avatar"]')?.getAttribute('data-current-zone') === 'storage');
  assert(await hidden(page, 'worker-path'), 'worker path should be hidden after arrival');

  await page.setViewportSize({ width: 667, height: 375 });
  await startShift(page);
  await page.getByTestId('zone-storage').click();
  assert(!(await hidden(page, 'worker-path')), 'phone worker path should be visible while moving');

  const hud = await visibleBox(page, 'hud-topbar');
  const dock = await visibleBox(page, 'action-dock');
  const worker = await visibleBox(page, 'worker-avatar');
  const anchors = await Promise.all(['zone-storage', 'zone-kitchen', 'zone-window'].map((testId) => visibleBox(page, testId)));

  for (const anchor of anchors) {
    assert(overlapArea(anchor, hud) === 0, 'phone interior anchor overlaps top HUD');
    assert(overlapArea(anchor, dock) === 0, 'phone interior anchor overlaps action dock');
  }
  assert(overlapArea(worker, hud) === 0, 'phone worker overlaps top HUD');
  assert(overlapArea(worker, dock) === 0, 'phone worker overlaps action dock');

  const phoneStats = await captureChecked(page, phoneArtifact);
  await page.waitForFunction(() => document.querySelector('[data-testid="worker-avatar"]')?.getAttribute('data-current-zone') === 'storage');
  assert(await hidden(page, 'worker-path'), 'phone worker path should be hidden after arrival');

  const report = {
    baseUrl,
    checks: {
      visibleWorkerAvatarBox: true,
      visibleInteriorAnchors: true,
      progressInterpolatesBeforeArrival: true,
      pathVisibleOnlyWhileMoving: true,
      phoneLandscapeNoHudDockOverlap: true,
    },
    artifacts: {
      desktop: desktopArtifact,
      phoneLandscape: phoneArtifact,
    },
    pixelStats: {
      desktop: desktopStats,
      phoneLandscape: phoneStats,
    },
  };
  writeFileSync(reportArtifact, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (browser) await browser.close();
  if (server) server.kill('SIGTERM');
}
