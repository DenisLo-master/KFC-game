import './styles.css';

const canvas = document.querySelector('#game');
const ctx = canvas.getContext('2d');
const scoreEl = document.querySelector('#score');
const bestEl = document.querySelector('#best');
const livesEl = document.querySelector('#lives');
const startBtn = document.querySelector('#start');
const pauseBtn = document.querySelector('#pause');
const restartBtn = document.querySelector('#restart');

const state = {
  running: false,
  paused: false,
  score: 0,
  best: Number(localStorage.getItem('kfc-game-best') || 0),
  lives: 3,
  lastTime: 0,
  spawnTimer: 0,
  input: 0,
  player: {
    x: canvas.width / 2 - 70,
    y: canvas.height - 72,
    width: 140,
    height: 34,
    speed: 520
  },
  drops: []
};

const dropTypes = [
  { kind: 'bucket', points: 20, color: '#f3382f', rim: '#fff4d6', size: 34 },
  { kind: 'wing', points: 10, color: '#d98b3a', rim: '#8c3f19', size: 26 },
  { kind: 'bomb', points: -1, color: '#262626', rim: '#f4c542', size: 28 }
];

bestEl.textContent = state.best;

function resetGame() {
  state.running = true;
  state.paused = false;
  state.score = 0;
  state.lives = 3;
  state.spawnTimer = 0;
  state.drops = [];
  state.player.x = canvas.width / 2 - state.player.width / 2;
  state.lastTime = performance.now();
  syncHud();
}

function syncHud() {
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  bestEl.textContent = state.best;
}

function spawnDrop() {
  const type = dropTypes[Math.floor(Math.random() * dropTypes.length)];
  state.drops.push({
    ...type,
    x: 40 + Math.random() * (canvas.width - 80),
    y: -40,
    vy: 145 + Math.random() * 120 + Math.min(state.score, 500) * 0.2,
    wobble: Math.random() * Math.PI * 2
  });
}

function update(delta) {
  if (!state.running || state.paused) return;

  state.player.x += state.input * state.player.speed * delta;
  state.player.x = Math.max(16, Math.min(canvas.width - state.player.width - 16, state.player.x));

  state.spawnTimer -= delta;
  if (state.spawnTimer <= 0) {
    spawnDrop();
    state.spawnTimer = Math.max(0.42, 1.05 - state.score / 900);
  }

  for (const drop of state.drops) {
    drop.y += drop.vy * delta;
    drop.wobble += delta * 5;
  }

  state.drops = state.drops.filter((drop) => {
    const hit =
      drop.y + drop.size > state.player.y &&
      drop.y < state.player.y + state.player.height &&
      drop.x > state.player.x &&
      drop.x < state.player.x + state.player.width;

    if (hit) {
      if (drop.kind === 'bomb') {
        state.lives -= 1;
      } else {
        state.score += drop.points;
      }
      finishIfNeeded();
      syncHud();
      return false;
    }

    if (drop.y > canvas.height + 50) {
      if (drop.kind !== 'bomb') {
        state.lives -= 1;
        finishIfNeeded();
        syncHud();
      }
      return false;
    }

    return true;
  });
}

function finishIfNeeded() {
  if (state.lives > 0) return;

  state.running = false;
  state.paused = false;
  state.best = Math.max(state.best, state.score);
  localStorage.setItem('kfc-game-best', String(state.best));
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#fff7e8');
  gradient.addColorStop(0.58, '#ffd166');
  gradient.addColorStop(1, '#2b2d42');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.62)';
  for (let i = 0; i < 7; i += 1) {
    const x = 70 + i * 145;
    ctx.fillRect(x, 0, 24, canvas.height);
  }

  ctx.fillStyle = '#1f2933';
  ctx.fillRect(0, canvas.height - 38, canvas.width, 38);
}

function drawPlayer() {
  const { x, y, width, height } = state.player;
  ctx.fillStyle = '#ffffff';
  roundRect(x, y, width, height, 12);
  ctx.fill();
  ctx.fillStyle = '#d71920';
  roundRect(x + 12, y + 7, width - 24, height - 14, 8);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 18px Inter, system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('CATCH', x + width / 2, y + 23);
}

function drawDrop(drop) {
  const x = drop.x + Math.sin(drop.wobble) * 8;
  const y = drop.y;

  if (drop.kind === 'bucket') {
    ctx.fillStyle = drop.color;
    roundRect(x - 20, y - 6, 40, 44, 8);
    ctx.fill();
    ctx.fillStyle = drop.rim;
    ctx.fillRect(x - 24, y - 10, 48, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x - 7, y + 3, 14, 28);
    return;
  }

  if (drop.kind === 'bomb') {
    ctx.fillStyle = drop.color;
    ctx.beginPath();
    ctx.arc(x, y, drop.size / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = drop.rim;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + 8, y - 12);
    ctx.quadraticCurveTo(x + 26, y - 28, x + 18, y - 36);
    ctx.stroke();
    return;
  }

  ctx.fillStyle = drop.color;
  ctx.beginPath();
  ctx.ellipse(x, y, drop.size * 0.65, drop.size * 0.42, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = drop.rim;
  ctx.lineWidth = 4;
  ctx.stroke();
}

function drawOverlay() {
  if (state.running && !state.paused) return;

  ctx.fillStyle = 'rgba(31, 41, 51, 0.62)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = '800 44px Inter, system-ui, sans-serif';

  const title = state.lives <= 0 ? 'Game Over' : state.paused ? 'Paused' : 'KFC Game';
  ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 20);
  ctx.font = '600 20px Inter, system-ui, sans-serif';
  ctx.fillText('Use arrows, A/D, touch, or mouse to move', canvas.width / 2, canvas.height / 2 + 24);
}

function draw() {
  drawBackground();
  state.drops.forEach(drawDrop);
  drawPlayer();
  drawOverlay();
}

function loop(time) {
  const delta = Math.min((time - state.lastTime) / 1000, 0.033);
  state.lastTime = time;
  update(delta);
  draw();
  requestAnimationFrame(loop);
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
}

function setPointerPosition(clientX) {
  const rect = canvas.getBoundingClientRect();
  const ratio = canvas.width / rect.width;
  state.player.x = (clientX - rect.left) * ratio - state.player.width / 2;
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') state.input = -1;
  if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') state.input = 1;
  if (event.key === ' ') state.paused = !state.paused;
});

window.addEventListener('keyup', (event) => {
  if (['ArrowLeft', 'ArrowRight', 'a', 'd'].includes(event.key.toLowerCase())) state.input = 0;
});

canvas.addEventListener('pointermove', (event) => setPointerPosition(event.clientX));
canvas.addEventListener('pointerdown', (event) => {
  setPointerPosition(event.clientX);
  if (!state.running) resetGame();
});

startBtn.addEventListener('click', () => {
  if (!state.running) resetGame();
  state.paused = false;
});

pauseBtn.addEventListener('click', () => {
  if (state.running) state.paused = !state.paused;
});

restartBtn.addEventListener('click', resetGame);

syncHud();
draw();
requestAnimationFrame(loop);
