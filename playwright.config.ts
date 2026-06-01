import { defineConfig, devices } from '@playwright/test';

const browserSpecFiles = [
  'interior-anomaly.spec.ts',
  'interior-interactions.spec.ts',
  'interior-movement.spec.ts',
  'phase3-hud.spec.ts',
  'phase4-readability.spec.ts',
  'phase5-release.spec.ts',
  'street-scene.spec.ts',
] as const;

export default defineConfig({
  testDir: './tests/browser',
  timeout: 30_000,
  // The browser suite drives a WebGL/R3F scene. CI and local headless Chromium
  // can crash under parallel canvas load, so the default gate is intentionally
  // serial instead of requiring callers to remember --workers=1.
  workers: 1,
  // Each browser spec owns a Playwright project so Chromium is relaunched
  // between screenshot-heavy WebGL files instead of being reused after
  // ReadPixels pressure. Keep retries disabled so product failures are not
  // masked by infrastructure recovery.
  retries: 0,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    launchOptions: {
      args: ['--single-process', '--no-zygote'],
    },
  },
  projects: browserSpecFiles.map((specFile) => ({
    name: `chromium-${specFile.replace('.spec.ts', '')}`,
    testMatch: `**/${specFile}`,
    use: { ...devices['Desktop Chrome'] },
  })),
  webServer: {
    command: 'npm run build && npm run preview -- --port 4173',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
