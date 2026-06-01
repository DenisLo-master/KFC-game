import { lazy, Suspense } from 'react';
import { useGameStore } from '../app/store';
import { Hud } from '../widgets/Hud';
import { ReferenceScene } from '../widgets/ReferenceScene';

const LazyGameScene = lazy(() => import('../widgets/GameScene').then((module) => ({ default: module.GameScene })));

export function GamePage() {
  const phase = useGameStore((state) => state.phase);
  const shouldMountGameScene = phase === 'playing';

  return (
    <main className="game">
      <ReferenceScene />
      {shouldMountGameScene && (
        <Suspense fallback={null}>
          <LazyGameScene />
        </Suspense>
      )}
      <Hud />
    </main>
  );
}
