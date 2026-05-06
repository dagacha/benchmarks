/*
 * ui.js - HUD rendering, start screen, game over screen.
 * All UI text in monospace font at 20px with y=40 baseline.
 */
function drawHUD(ctx) {
  ctx.font = '20px monospace';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  ctx.fillStyle = CONFIG.cyan;
  ctx.fillText('SCORE: ' + CONFIG.score, 20, 40);

  ctx.textAlign = 'center';
  ctx.fillStyle = CONFIG.yellow;
  ctx.fillText('LEVEL ' + CONFIG.level, window.innerWidth / 2, 40);

  ctx.textAlign = 'right';
  ctx.fillStyle = CONFIG.pink;
  ctx.fillText('COMBO x' + CONFIG.combo, window.innerWidth - 20, 40);

  if (player.unleashActive) {
    ctx.textAlign = 'center';
    ctx.fillStyle = CONFIG.white;
    ctx.font = 'bold 24px monospace';
    const timeLeft = Math.ceil(player.unleashTimer / 1000);
    ctx.fillText('UNLEASH! ' + timeLeft + 's', window.innerWidth / 2, 70);
    ctx.font = '20px monospace';
  }

  const healthPct = player.health / player.maxHealth;
  const barW = 200;
  const barH = 16;
  const barX = window.innerWidth / 2 - barW / 2;
  const barY = window.innerHeight - 40;

  ctx.fillStyle = '#222';
  ctx.fillRect(barX, barY, barW, barH);
  ctx.fillStyle = healthPct > 0.5 ? CONFIG.green : healthPct > 0.25 ? CONFIG.yellow : CONFIG.red;
  ctx.fillRect(barX, barY, barW * healthPct, barH);
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  ctx.fillStyle = CONFIG.white;
  ctx.font = '12px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(Math.ceil(player.health) + ' / ' + player.maxHealth, window.innerWidth / 2, barY - 16);
}

function drawStartScreenPreviews() {
  const previews = [
    { canvas: 'previewSmall', type: 'small', color: CONFIG.pink },
    { canvas: 'previewMedium', type: 'medium', color: CONFIG.blue },
    { canvas: 'previewBaby', type: 'baby', color: CONFIG.cyanLight },
    { canvas: 'previewBoss', type: 'boss', color: CONFIG.purple },
  ];

  for (const p of previews) {
    const c = document.getElementById(p.canvas);
    if (!c) continue;
    const cx = c.getContext('2d');
    cx.imageSmoothingEnabled = false;
    cx.clearRect(0, 0, c.width, c.height);
    const grid = pixelGrids[p.type];
    const rows = grid.length;
    const cols = grid[0].length;
    const totalSize = Math.min(c.width, c.height) * 0.8;
    const cellW = totalSize / cols;
    const cellH = totalSize / rows;
    const ox = (c.width - totalSize) / 2;
    const oy = (c.height - totalSize) / 2;
    cx.fillStyle = p.color;
    for (let r = 0; r < rows; r++) {
      for (let cc = 0; cc < cols; cc++) {
        if (grid[r][cc] === 1) {
          cx.fillRect(ox + cc * cellW, oy + r * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
    }
  }
}

function drawGameOver(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.fillStyle = CONFIG.red;
  ctx.font = 'bold 48px monospace';
  ctx.shadowColor = CONFIG.red;
  ctx.shadowBlur = 20;
  ctx.fillText('GAME OVER', window.innerWidth / 2, window.innerHeight / 2 - 80);
  ctx.shadowBlur = 0;

  ctx.font = '24px monospace';
  ctx.fillStyle = CONFIG.white;
  ctx.fillText('Score: ' + CONFIG.score, window.innerWidth / 2, window.innerHeight / 2 - 20);
  ctx.fillText('Level: ' + CONFIG.level, window.innerWidth / 2, window.innerHeight / 2 + 15);
  ctx.fillText('Enemies Killed: ' + CONFIG.enemiesKilled, window.innerWidth / 2, window.innerHeight / 2 + 50);

  ctx.fillStyle = CONFIG.cyan;
  ctx.font = '20px monospace';
  ctx.fillText('CLICK TO RESTART', window.innerWidth / 2, window.innerHeight / 2 + 100);
}

function drawPaused(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = CONFIG.cyan;
  ctx.font = 'bold 40px monospace';
  ctx.fillText('PAUSED', window.innerWidth / 2, window.innerHeight / 2);
  ctx.font = '18px monospace';
  ctx.fillText('Press ESC to resume', window.innerWidth / 2, window.innerHeight / 2 + 40);
}
