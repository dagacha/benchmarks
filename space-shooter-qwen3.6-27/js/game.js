/*
 * game.js - Main game loop, state machine, collision detection, screen shake.
 * Orchestrates all modules and manages game states (menu/playing/paused/gameover).
 */
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startScreen = document.getElementById('startScreen');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight - 100;
let mouseDown = false;
let shakeX = 0, shakeY = 0, shakeIntensity = 0;
let flashAlpha = 0;

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  initBackground();
  initPlayer();
  drawStartScreenPreviews();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  overlay.style.display = 'none';
  startAmbientHum();
  CONFIG.state = 'playing';
  CONFIG.score = 0;
  CONFIG.level = 1;
  CONFIG.combo = 0;
  CONFIG.comboTimer = 0;
  CONFIG.enemiesKilled = 0;
  initPlayer();
  enemies.length = 0;
  enemyBullets.length = 0;
  bullets.length = 0;
  particles.length = 0;
  damageNumbers.length = 0;
  powerups.length = 0;
  waveEnemiesRemaining = 0;
  waveEnemiesSpawned = 0;
  spawnWave();
}

function restartGame() {
  CONFIG.state = 'menu';
  CONFIG.score = 0;
  CONFIG.level = 1;
  CONFIG.combo = 0;
  CONFIG.comboTimer = 0;
  CONFIG.enemiesKilled = 0;
  stopAmbientHum();
  overlay.style.display = 'flex';
  startScreen.style.display = 'block';
  document.getElementById('startText').style.display = 'block';
  document.getElementById('controlsText').style.display = 'block';
}

function gameOver() {
  CONFIG.state = 'gameover';
  stopAmbientHum();
  shakeIntensity = CONFIG.shakeBoss;
  flashAlpha = 0.5;
}

function addShake(intensity) {
  shakeIntensity = Math.max(shakeIntensity, intensity);
}

function updateShake() {
  if (shakeIntensity > 0.5) {
    shakeX = (Math.random() - 0.5) * shakeIntensity;
    shakeY = (Math.random() - 0.5) * shakeIntensity;
    shakeIntensity *= CONFIG.shakeDecay;
  } else {
    shakeX = 0;
    shakeY = 0;
    shakeIntensity = 0;
  }
}

function checkBulletEnemyCollision() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dx = b.x - e.x;
      const dy = b.y - e.y;
      const r1 = b.width;
      const r2 = e.size / 2;
      if (dx * dx + dy * dy < (r1 + r2) * (r1 + r2)) {
        e.health -= player.unleashActive ? 3 : 1;
        e.hitFlash = 3;
        spawnSparks(b.x, b.y);
        playHit();
        spawnDamageNumber(e.x, e.y - e.size / 2, 1, '#FFD700');

        bullets.splice(i, 1);

        if (e.health <= 0) {
          const sizeLabel = e.type === 'boss' ? 'boss' : e.type === 'medium' ? 'large' : 'small';
          spawnExplosion(e.x, e.y, e.color);
          spawnInkSplatter(e.x, e.y, e.color);
          playExplosion(sizeLabel);

          if (e.type === 'medium' && !e.splitDone) {
            e.splitDone = true;
            enemies.push(createEnemy('baby', e.x - 20, e.y));
            enemies.push(createEnemy('baby', e.x + 20, e.y));
            waveEnemiesRemaining += 2;
          }

          if ((e.type === 'medium' || e.type === 'boss') && Math.random() < 0.4) {
            spawnPowerup(e.x, e.y);
          }

          const mult = player.unleashActive ? CONFIG.unleashScoreMult : 1;
          CONFIG.score += e.score * CONFIG.combo * mult;
          CONFIG.combo++;
          CONFIG.comboTimer = CONFIG.comboDecayTime;
          CONFIG.enemiesKilled++;

          const shakeAmt = e.type === 'boss' ? CONFIG.shakeBoss : e.type === 'medium' ? CONFIG.shakeMedium : CONFIG.shakeSmall;
          addShake(shakeAmt);

          enemies.splice(j, 1);
          waveEnemiesRemaining--;
          checkWaveClear();
        }
        break;
      }
    }
  }
}

function checkPlayerEnemyCollision() {
  if (player.invincible > 0) return;
  for (const e of enemies) {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const r1 = player.radius + 30;
    const r2 = e.size / 2;
    if (dx * dx + dy * dy < r1 * r1 + r2 * r2) {
      player.health -= e.type === 'boss' ? 25 : 15;
      player.invincible = CONFIG.invincibleTime;
      CONFIG.combo = 0;
      CONFIG.comboTimer = 0;
      flashAlpha = 0.3;
      addShake(CONFIG.shakePlayerHit);
      playExplosion('small');

      if (e.type !== 'boss') {
        const idx = enemies.indexOf(e);
        if (idx >= 0) {
          spawnExplosion(e.x, e.y, e.color);
          spawnInkSplatter(e.x, e.y, e.color);
          enemies.splice(idx, 1);
          waveEnemiesRemaining--;
          checkWaveClear();
        }
      }
      if (player.health <= 0) {
        gameOver();
      }
      break;
    }
  }
}

function checkPlayerBulletCollision() {
  if (player.invincible > 0) return;
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    const dx = player.x - b.x;
    const dy = player.y - b.y;
    const r1 = player.radius;
    const r2 = b.width / 2;
    if (dx * dx + dy * dy < (r1 + r2) * (r1 + r2)) {
      player.health -= 8;
      player.invincible = CONFIG.invincibleTime;
      CONFIG.combo = 0;
      CONFIG.comboTimer = 0;
      flashAlpha = 0.2;
      addShake(CONFIG.shakePlayerHit);
      spawnSparks(b.x, b.y);
      playHit();
      enemyBullets.splice(i, 1);
      if (player.health <= 0) {
        gameOver();
      }
    }
  }
}

function updateCombo() {
  if (CONFIG.combo > 0) {
    CONFIG.comboTimer -= 16;
    if (CONFIG.comboTimer <= 0) {
      CONFIG.combo = 0;
      CONFIG.comboTimer = 0;
    }
  }
}

function update() {
  if (CONFIG.state !== 'playing') return;
  updatePlayer();
  updateBullets();
  updateEnemies();
  updatePowerups();
  updateParticles();
  updateBackground();
  updateCombo();
  checkBulletEnemyCollision();
  checkPlayerEnemyCollision();
  checkPlayerBulletCollision();
}

function draw() {
  ctx.fillStyle = CONFIG.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(shakeX, shakeY);

  updateShake();

  drawBackground(ctx);

  if (CONFIG.state === 'playing' || CONFIG.state === 'paused') {
    drawPowerups(ctx);
    drawEnemies(ctx);
    drawBullets(ctx);
    drawPlayer(ctx);
    drawParticles(ctx);
    drawHUD(ctx);

    if (player.unleashActive) {
      ctx.fillStyle = 'rgba(255,255,255,' + (0.02 + Math.sin(Date.now() * 0.01) * 0.01) + ')';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }

  if (CONFIG.state === 'gameover') {
    drawEnemies(ctx);
    drawBullets(ctx);
    drawParticles(ctx);
    drawGameOver(ctx);
  }

  if (CONFIG.state === 'paused') {
    drawPaused(ctx);
  }

  ctx.restore();

  if (flashAlpha > 0) {
    ctx.fillStyle = 'rgba(255,0,0,' + flashAlpha + ')';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    flashAlpha *= 0.9;
    if (flashAlpha < 0.01) flashAlpha = 0;
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

canvas.addEventListener('mousedown', (e) => {
  mouseDown = true;
  if (CONFIG.state === 'menu') {
    startGame();
  } else if (CONFIG.state === 'gameover') {
    restartGame();
  }
});

canvas.addEventListener('mouseup', () => {
  mouseDown = false;
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && CONFIG.state === 'playing') {
    CONFIG.state = 'paused';
  } else if (e.key === 'Escape' && CONFIG.state === 'paused') {
    CONFIG.state = 'playing';
  }
});

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

init();
