# KFC Game

KFS Night Shift is a browser arcade game built with Vite, React, Zustand, and a
React Three Fiber tick layer. The current runtime uses a reference-backed KFS
street/interior scene with a visible worker, connected storage/kitchen/window
zones, in-world cooking/tray/service feedback, anomaly pressure, and shutter
defense.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Tests

```bash
npm run test
npm run typecheck
npm run test:browser
```

## Controls

- Mouse or touch to select interior zones and controls
- `E` quick action
- `Esc` pause or resume
- `Tab` pin order details
- Hold Shutter for anomaly defense
