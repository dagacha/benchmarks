const bullets = [];
const damageNumbers = [];

function spawnDamageNumber(x, y, text, color) {
  damageNumbers.push({
    x, y, text, color,
    life: 1,
    vy: -1.5,
  });
}

function updateDamageNumbers() {
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const d = damageNumbers[i];
    d.y += d.vy;
    d.life -= 0.016;
    if (d.life <= 0) {
      damageNumbers.splice(i, 1);
    }
  }
}

function drawDamageNumbers(ctx) {
  for (const d of damageNumbers) {
    ctx.globalAlpha = d.life;
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = d.color;
    ctx.textAlign = 'center';
    ctx.fillText(d.text, d.x, d.y);
  }
  ctx.globalAlpha = 1;
}

function drawHUD(ctx) {
  ctx.font = '20px monospace';
  ctx.textAlign = 'left';
  ctx.fillStyle = CONFIG.colors.cyan;
  ctx.fillText(`SCORE: ${CONFIG.score}`, 20, 40);

  ctx.textAlign = 'center';
  ctx.fillStyle = CONFIG.colors.white;
  ctx.fillText(`LEVEL ${CONFIG.level}`, window.innerWidth / 2, 40);

  ctx.textAlign = 'right';
  ctx.fillStyle = CONFIG.combo > 1 ? CONFIG.colors.gold : CONFIG.colors.cyan;
  ctx.fillText(`COMBO x${CONFIG.combo}`, window.innerWidth - 20, 40);

  const barWidth = 200;
  const barHeight = 12;
  const barX = window.innerWidth / 2 - barWidth / 2;
  const barY = window.innerHeight - 30;
  const healthPct = player ? player.health / CONFIG.playerMaxHealth : 1;

  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
  ctx.fillStyle = healthPct > 0.5 ? CONFIG.colors.green :
                  healthPct > 0.25 ? CONFIG.colors.orange : CONFIG.colors.red;
  ctx.fillRect(barX, barY, barWidth * healthPct, barHeight);

  if (CONFIG.unleashActive) {
    const elapsed = CONFIG.unleashDuration - CONFIG.unleashTimer;
    const pct = elapsed / CONFIG.unleashDuration;
    ctx.textAlign = 'center';
    ctx.fillStyle = CONFIG.colors.white;
    ctx.font = 'bold 18px monospace';
    ctx.shadowColor = CONFIG.colors.white;
    ctx.shadowBlur = 10;
    ctx.fillText('UNLEASH ACTIVE', window.innerWidth / 2, 70);
    ctx.shadowBlur = 0;
    ctx.font = '14px monospace';
    ctx.fillStyle = CONFIG.colors.green;
    ctx.fillText(`${(pct * 5).toFixed(1)}s`, window.innerWidth / 2, 90);
  }

  if (player) {
    ctx.textAlign = 'left';
    ctx.font = '14px monospace';
    ctx.fillStyle = '#8b949e';
    ctx.fillText(`TIER ${player.tier}`, 20, 65);
  }
}

function drawMenu(ctx) {
  const title = document.getElementById('startScreen');
  if (title) title.style.display = 'flex';
  const go = document.getElementById('gameOverScreen');
  if (go) go.style.display = 'none';
}

function drawGameOver(ctx) {
  const title = document.getElementById('startScreen');
  if (title) title.style.display = 'none';
  const go = document.getElementById('gameOverScreen');
  if (go) {
    go.style.display = 'flex';
    document.getElementById('finalScore').textContent = `SCORE: ${CONFIG.score}`;
    document.getElementById('finalLevel').textContent = `LEVEL: ${CONFIG.level}`;
    document.getElementById('finalKills').textContent = `ENEMIES KILLED: ${CONFIG.enemiesKilled}`;
  }
}
