# Phase 2 lightweight render/performance note

Captured: 2026-05-31T13:25:28.013Z

- Method: production Vite preview at http://127.0.0.1:4173 with Playwright Chromium screenshots.
- Scope: first-load/pre-shift street scene plus quick-start active state.
- Full trace/Lighthouse was not captured by developer; QA can replace this fallback with final protocol evidence.
- Build warning remains current: main JS chunk is larger than 500 kB after minification.

```json
[
  {
    "name": "desktop-menu",
    "viewport": {
      "width": 1280,
      "height": 720
    },
    "screenshot": ".runtime/qa-artifacts/kfs-street-scene-references/phase2/desktop-menu.png",
    "captureMs": 1037,
    "metrics": {
      "canvasCount": 1,
      "markerVisible": true,
      "heapBytes": 11200000,
      "domNodes": 151,
      "elapsedMs": 1035
    }
  },
  {
    "name": "desktop-menu-short-wait",
    "viewport": {
      "width": 1280,
      "height": 720
    },
    "screenshot": ".runtime/qa-artifacts/kfs-street-scene-references/phase2/desktop-menu-short-wait.png",
    "captureMs": 2182,
    "metrics": {
      "canvasCount": 1,
      "markerVisible": true,
      "heapBytes": 12700000,
      "domNodes": 151,
      "elapsedMs": 2181
    }
  },
  {
    "name": "phone-landscape-menu",
    "viewport": {
      "width": 667,
      "height": 375
    },
    "screenshot": ".runtime/qa-artifacts/kfs-street-scene-references/phase2/phone-landscape-menu.png",
    "captureMs": 720,
    "metrics": {
      "canvasCount": 1,
      "markerVisible": true,
      "heapBytes": 11200000,
      "domNodes": 151,
      "elapsedMs": 719
    }
  },
  {
    "name": "tablet-landscape-menu",
    "viewport": {
      "width": 1024,
      "height": 768
    },
    "screenshot": ".runtime/qa-artifacts/kfs-street-scene-references/phase2/tablet-landscape-menu.png",
    "captureMs": 977,
    "metrics": {
      "canvasCount": 1,
      "markerVisible": true,
      "heapBytes": 11200000,
      "domNodes": 151,
      "elapsedMs": 976
    }
  },
  {
    "name": "portrait-gate-menu",
    "viewport": {
      "width": 390,
      "height": 844
    },
    "screenshot": ".runtime/qa-artifacts/kfs-street-scene-references/phase2/portrait-gate-menu.png",
    "captureMs": 784,
    "metrics": {
      "canvasCount": 1,
      "markerVisible": true,
      "heapBytes": 12700000,
      "domNodes": 151,
      "elapsedMs": 783
    }
  },
  {
    "name": "quick-start-playing",
    "viewport": {
      "width": 1280,
      "height": 720
    },
    "screenshot": ".runtime/qa-artifacts/kfs-street-scene-references/phase2/quick-start-playing.png",
    "captureMs": 1032,
    "metrics": {
      "canvasCount": 1,
      "markerVisible": false,
      "heapBytes": 16100000,
      "domNodes": 107,
      "elapsedMs": 1031
    }
  }
]
```
