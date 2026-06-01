import { GameScene } from '../widgets/GameScene';
import { Hud } from '../widgets/Hud';
import { ReferenceScene } from '../widgets/ReferenceScene';

export function GamePage() {
  return (
    <main className="game">
      <ReferenceScene />
      <GameScene />
      <Hud />
    </main>
  );
}
