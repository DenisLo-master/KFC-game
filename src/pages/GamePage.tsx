import { GameScene } from '../widgets/GameScene';
import { Hud } from '../widgets/Hud';

export function GamePage() {
  return (
    <main className="game">
      <GameScene />
      <Hud />
    </main>
  );
}
