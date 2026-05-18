const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let lastTime = 0;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight - 100;
let mouseDown = false;
let drawCount = 0;

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.imageSmoothingEnabled = false;
  initBackground();
  initPlayer();
  drawMenu();
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  window.addEventListener('mousedown', (e) => {
    mouseDown = true;
    initAudio();
    if (CONFIG.state === 'menu') {
      startGame();
    } else if (CONFIG.state === 'gameover') {
      restartGame();
    }
  });
  window.addEventListener('mouseup', () => { mouseDown = false; });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (CONFIG.state === 'playing') CONFIG.state = 'paused';
      else if (CONFIG.state === 'paused') CONFIG.state = 'playing';
    }
  });
  requestAnimationFrame(gameLoop);
}

function startGame() {
  CONFIG.state = 'playing';
  CONFIG.score = 0;
  CONFIG.level = 1;
  CONFIG.combo = 0;
  CONFIG.comboTimer = 0;
  CONFIG.enemiesKilled = 0;
  CONFIG.unleashActive = false;
  CONFIG.waveActive = false;
  enemies.length = 0;
  enemyBullets.length = 0;
  bullets.length = 0;
  particles.length = 0;
  damageNumbers.length = 0;
  powerups.length = 0;
  initPlayer();
  initBackground();
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameOverScreen').style.display = 'none';
  spawnWave();
}

function restartGame() {
  startGame();
}

function gameLoop(timestamp) {
  const dt = timestamp - lastTime;
  lastTime = timestamp;
  drawCount++;

  ctx.fillStyle = CONFIG.colors.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (player) {
    player.mouseX = mouseX;
    player.mouseY = mouseY;
  }

  updateBackground(dt, mouseX, mouseY);
  drawBackground(ctx);

  if (CONFIG.state === 'playing') {
    if (mouseDown) shoot();
    updatePlayer();
    updateBullets();
    updateEnemies(dt);
    updateParticles();
    updateDamageNumbers();
    checkCollisions();
    updateCombo(dt);
    updateUnleash(dt);
    updateScreenShake(dt);

    ctx.save();
    ctx.translate(CONFIG.shakeX, CONFIG.shakeY);

    if (CONFIG.unleashActive) {
      const shift = Math.sin(Date.now() * 0.01) * 2;
      ctx.shadowColor = `rgba(255,0,0,0.3)`;
      ctx.shadowBlur = 10;
    }

    for (let i = 0; i < enemies.length; i++) {
      drawEnemy(ctx, enemies[i]);
    }
    drawEnemyBullets(ctx);
    drawPowerups(ctx);
    drawBullets(ctx);
    drawPlayer(ctx);
    drawParticles(ctx);
    drawDamageNumbers(ctx);

    if (CONFIG.unleashActive) {
      ctx.shadowBlur = 0;
      const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, canvas.height * 0.3, canvas.width / 2, canvas.height / 2, canvas.height * 0.8);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(1, 'rgba(255,255,255,0.03)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.restore();
    drawHUD(ctx);
  } else if (CONFIG.state === 'menu') {
    drawParticles(ctx);
    drawMenu(ctx);
  } else if (CONFIG.state === 'gameover') {
    for (let i = 0; i < enemies.length; i++) {
      drawEnemy(ctx, enemies[i]);
    }
    drawParticles(ctx);
    drawPlayer(ctx);
    drawGameOver(ctx);
    updateScreenShake(dt);
  } else if (CONFIG.state === 'paused') {
    for (let i = 0; i < enemies.length; i++) {
      drawEnemy(ctx, enemies[i]);
    }
    drawPlayer(ctx);
    drawParticles(ctx);
    ctx.font = '48px monospace';
    ctx.fillStyle = CONFIG.colors.white;
    ctx.textAlign = 'center';
    ctx.fillText('PAUSED', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px monospace';
    ctx.fillText('Press ESC to resume', canvas.width / 2, canvas.height / 2 + 40);
  }

  requestAnimationFrame(gameLoop);
}

function drawBullets(ctx) {
  for (const b of bullets) {
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 8;
    ctx.fillRect(b.x - b.width / 2, b.y - b.width, b.width, b.width * 3);
  }
  ctx.shadowBlur = 0;
}

function checkCollisions() {
  if (!player) return;

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const dx = b.x - e.x;
      const dy = b.y - e.y;
      const distSq = dx * dx + dy * dy;
      const r1 = b.width;
      const r2 = e.size / 2;
      if (distSq < (r1 + r2) * (r1 + r2)) {
        bullets.splice(i, 1);
        e.health -= CONFIG.unleashActive ? 5 : 1;
        e.hitFlash = 3;
        spawnSpark(b.x, b.y);
        spawnDamageNumber(e.x, e.y - e.size / 2, `-${CONFIG.unleashActive ? 5 : 1}`, CONFIG.colors.yellow || '#FFD700');
        playHit();
        if (e.health <= 0) {
          killEnemy(j, e);
        }
        break;
      }
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    const dx = b.x - player.x;
    const dy = b.y - player.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < (b.width + player.radius) * (b.width + player.radius)) {
      enemyBullets.splice(i, 1);
      player.health -= 10;
      CONFIG.combo = 0;
      CONFIG.shakeDuration = 6;
      CONFIG.shakeIntensity = 5;
      spawnSpark(player.x, player.y);
      playHit();
      if (player.health <= 0) {
        CONFIG.state = 'gameover';
        CONFIG.shakeDuration = 30;
        CONFIG.shakeIntensity = 15;
        spawnExplosion(player.x, player.y, 60, CONFIG.colors.cyan);
      }
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const dx = e.x - player.x;
    const dy = e.y - player.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < (e.size / 2 + player.radius + 30) * (e.size / 2 + player.radius + 30)) {
      player.health -= 20;
      CONFIG.combo = 0;
      CONFIG.shakeDuration = 10;
      CONFIG.shakeIntensity = 8;
      spawnSpark(player.x, player.y);
      if (e.type !== 'boss') {
        e.health = 0;
        killEnemy(i, e);
      } else {
        e.hitFlash = 5;
        e.y -= 30;
      }
      playHit();
      if (player.health <= 0) {
        CONFIG.state = 'gameover';
        CONFIG.shakeDuration = 30;
        CONFIG.shakeIntensity = 15;
        spawnExplosion(player.x, player.y, 60, CONFIG.colors.cyan);
      }
    }
  }

  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    const dx = p.x - player.x;
    const dy = p.y - player.y;
    const distSq = dx * dx + dy * dy;
    if (distSq < (12 + player.radius) * (12 + player.radius)) {
      powerups.splice(i, 1);
      playPowerup();
      if (p.type === 'weapon') {
        CONFIG.unleashActive = true;
        CONFIG.unleashTimer = CONFIG.unleashDuration;
        playUnleashDrone();
      } else if (p.type === 'health') {
        player.health = Math.min(player.health + 20, CONFIG.playerMaxHealth);
      }
      spawnDamageNumber(p.x, p.y, 'POWERUP!', CONFIG.colors.gold);
    }
  }
}

function updateCombo(dt) {
  if (CONFIG.combo > 0) {
    CONFIG.comboTimer -= dt;
    if (CONFIG.comboTimer <= 0) {
      CONFIG.combo = 0;
    }
  }
}

function updateUnleash(dt) {
  if (CONFIG.unleashActive) {
    CONFIG.unleashTimer -= dt;
    if (CONFIG.unleashTimer <= 0) {
      CONFIG.unleashActive = false;
    }
  }
}

function updateScreenShake(dt) {
  if (CONFIG.shakeDuration > 0) {
    CONFIG.shakeX = (Math.random() - 0.5) * CONFIG.shakeIntensity * 2;
    CONFIG.shakeY = (Math.random() - 0.5) * CONFIG.shakeIntensity * 2;
    CONFIG.shakeDuration--;
    CONFIG.shakeIntensity *= 0.95;
  } else {
    CONFIG.shakeX = 0;
    CONFIG.shakeY = 0;
  }
}

init();
