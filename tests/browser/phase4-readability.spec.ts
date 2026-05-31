import { expect, test } from '@playwright/test';

type ActiveCueCase = {
  kind: 'normal' | 'shadowEyes' | 'longArms' | 'staticSmile';
  label: RegExp;
  marker: RegExp;
  artifact: string;
};

const activeCueCases: ActiveCueCase[] = [
  {
    kind: 'normal',
    label: /normal/i,
    marker: /ordinary/i,
    artifact: '.runtime/qa-artifacts/kfs-street-scene-references/phase4/active-normal-current-customer.png',
  },
  {
    kind: 'shadowEyes',
    label: /shadow eyes/i,
    marker: /unblinking dark eyes/i,
    artifact: '.runtime/qa-artifacts/kfs-street-scene-references/phase4/active-anomaly-shadowEyes.png',
  },
  {
    kind: 'longArms',
    label: /long arms/i,
    marker: /too-low sleeves/i,
    artifact: '.runtime/qa-artifacts/kfs-street-scene-references/phase4/active-anomaly-longArms.png',
  },
  {
    kind: 'staticSmile',
    label: /static smile/i,
    marker: /fixed smile/i,
    artifact: '.runtime/qa-artifacts/kfs-street-scene-references/phase4/active-anomaly-staticSmile.png',
  },
];

async function captureArtifact(page: import('@playwright/test').Page, path: string) {
  try {
    await page.screenshot({ path, animations: 'disabled' });
  } catch (error) {
    await page.waitForTimeout(250);
    await page.screenshot({ path, animations: 'disabled' });
  }
}

test.describe('Phase 4 visitor readability', () => {
  test('pre-shift exposes all ordinary archetypes and KFS worker identity', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await expect(page.getByTestId('pre-shift-street')).toBeVisible();
    await expect(page.getByTestId('worker-identity-context')).toContainText(/KFS worker/i);
    await expect(page.getByTestId('worker-identity-context')).toContainText(/badge/i);
    await expect(page.getByTestId('worker-identity-context')).toContainText(/shift checklist/i);

    const matrix = page.getByTestId('ordinary-archetype-matrix');
    await expect(matrix).toBeVisible();
    for (const archetype of ['student', 'office worker', 'courier', 'shopper', 'older person', 'tired parent', 'night worker', 'teenager']) {
      await expect(matrix).toContainText(new RegExp(archetype, 'i'));
    }
    await expect(matrix).toContainText(/ordinary/i);
    await expect(page.getByRole('button', { name: 'Start Shift' })).toBeVisible();
  });

  test('phone landscape keeps archetype and worker identity readable before start', async ({ page }) => {
    await page.setViewportSize({ width: 667, height: 375 });
    await page.goto('/');

    await expect(page.getByTestId('orientation-gate')).toBeHidden();
    await expect(page.getByTestId('ordinary-archetype-matrix')).toBeVisible();
    await expect(page.getByTestId('worker-identity-context')).toBeVisible();

    const hasPageScroll = await page.evaluate(() => document.documentElement.scrollHeight > window.innerHeight);
    expect(hasPageScroll).toBe(false);
  });

  test('browser-visible active visitor samples cover normal and approved anomaly cues', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    const samples = page.getByTestId('visitor-readability-samples');
    await expect(samples).toBeVisible();
    await expect(page.getByTestId('sample-normal')).toContainText(/normal/i);
    await expect(page.getByTestId('sample-shadowEyes')).toContainText(/shadow eyes/i);
    await expect(page.getByTestId('sample-longArms')).toContainText(/long arms/i);
    await expect(page.getByTestId('sample-staticSmile')).toContainText(/static smile/i);
    await expect(page.getByTestId('sample-normal')).toContainText(/ordinary/i);
    await expect(page.getByTestId('sample-shadowEyes')).toContainText(/unblinking dark eyes/i);
    await expect(page.getByTestId('sample-longArms')).toContainText(/too-low sleeves/i);
    await expect(page.getByTestId('sample-staticSmile')).toContainText(/fixed smile/i);
  });

  for (const cue of activeCueCases) {
    test(`active current customer exposes readable ${cue.kind} state`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('/?phase4-readability=1');
      await page.waitForFunction(() => typeof window.__kfsPhase4SetActiveCustomer === 'function');

      await page.evaluate((kind) => {
        if (!window.__kfsPhase4SetActiveCustomer) {
          throw new Error('Phase 4 active customer debug hook is unavailable.');
        }
        window.__kfsPhase4SetActiveCustomer(kind);
      }, cue.kind);

      const activeCue = page.getByTestId('active-current-customer-readability');
      const sceneCue = page.getByTestId('active-scene-readability-layer');
      await expect(page.getByTestId('hud-topbar')).toBeVisible();
      await expect(page.getByTestId('order-panel')).toBeVisible();
      await expect(activeCue).toBeVisible();
      await expect(activeCue).toContainText(/current customer/i);
      await expect(activeCue).toContainText(cue.label);
      await expect(activeCue).toContainText(cue.marker);
      await expect(activeCue).toHaveAttribute('data-current-order-target', 'true');
      await expect(activeCue).toHaveAttribute('data-anomaly-kind', cue.kind);
      await expect(sceneCue).toBeVisible();
      await expect(sceneCue).toHaveAttribute('data-current-order-target', 'true');
      await expect(sceneCue).toHaveAttribute('data-anomaly-kind', cue.kind);
      await expect(page.getByTestId('serve-action')).toBeVisible();
      await expect(page.getByTestId('shutter-action')).toBeVisible();

      await captureArtifact(page, cue.artifact);
    });
  }
});

declare global {
  interface Window {
    __kfsPhase4SetActiveCustomer?: (kind: ActiveCueCase['kind']) => void;
  }
}
