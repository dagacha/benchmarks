/*
 * enemies.js - Pixel-art octopus enemies with wave spawning and boss logic.
 * All octopus types use grid-based fillRect rendering (pixel art style).
 */
const enemies = [];
const enemyBullets = [];
const powerups = [];
let waveEnemiesRemaining = 0;
let waveEnemiesSpawned = 0;
let waveSpawnTimer = 0;
let currentWave = 0;
let bossActive = false;

const pixelGrids = {
  small: [
    [0,0,0,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,0,1,1,0,1,1,0],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,0,0],
  ],
  medium: [
    [0,0,0,0,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,1,1,1,0,1,1,0,1,1,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,0,0,1,1,0,0,0],
    [0,0,1,0,0,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,0,0,1,0,0],
  ],
  baby: [
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [0,1,0,1,0,1,0],
    [0,1,1,1,1,1,0],
    [0,0,1,0,1,0,0],
    [0,0,1,0,1,0,0],
  ],
  boss: [
    [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,0,1,1,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,0,1,1,1,1,0,1,1,0,0,0],
    [0,0,1,0,0,0,1,1,1,1,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0],
    [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
  ],
};

const tentacleRows = {
  small: [6, 7],
  medium: [6, 7, 8],
  baby: [4, 5],
  boss: [7, 8, 9, 10],
};

function createEnemy(type, x, y) {
  return {
    type: type,
    x: x || Math.random() * (window.innerWidth - 100) + 50,
    y: y || -CONFIG.enemySizes[type],
    size: CONFIG.enemySizes[type],
    health: CONFIG.enemyHealth[type],
    maxHealth: CONFIG.enemyHealth[type],
    speed: CONFIG.enemySpeed[type],
    color: CONFIG.enemyColors[type],
    score: CONFIG.enemyScores[type],
    vx: 0,
    vy: 0,
    sineOffset: Math.random() * Math.PI * 2,
    sineAmp: type === 'small' ? 60 + Math.random() * 40 : 0,
    hitFlash: 0,
    shootTimer: Math.random() * 2000,
    tentacleFrame: 0,
    alive: true,
    time: 0,
    splitDone: false,
    barrageTimer: 0,
    phase: 1,
  };
}

function drawPixelOctopus(ctx, enemy) {
  const grid = pixelGrids[enemy.type];
  const rows = grid.length;
  const cols = grid[0].length;
  const cellW = enemy.size / cols;
  const cellH = enemy.size / rows;
  const x = enemy.x - enemy.size / 2;
  const y = enemy.y - enemy.size / 2;

  const tentacles = tentacleRows[enemy.type];
  const frame = Math.floor(enemy.tentacleFrame) % 2;

  ctx.fillStyle = enemy.hitFlash > 0 ? CONFIG.white : enemy.color;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 1) {
        let draw = true;
        if (tentacles && tentacles.includes(r) && frame === 1) {
          if (c % 2 === 0) draw = false;
        }
        if (tentacles && tentacles.includes(r) && frame === 0) {
          if (c % 2 === 1) draw = false;
        }
        if (draw) {
          ctx.fillRect(x + c * cellW, y + r * cellH, cellW + 0.5, cellH + 0.5);
        }
      }
    }
  }

  if (enemy.type === 'boss') {
    ctx.shadowColor = '#C084FC';
    ctx.shadowBlur = 20;
    ctx.fillStyle = CONFIG.purple;
    ctx.font = 'bold 10px monospace';
    ctx.shadowBlur = 0;

    const hpPct = enemy.health / enemy.maxHealth;
    const barW = enemy.size * 1.2;
    const barH = 8;
    const barX = enemy.x - barW / 2;
    const barY = y - 15;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = hpPct > 0.5 ? '#39FF14' : hpPct > 0.25 ? '#FFD700' : '#FF3333';
    ctx.fillRect(barX, barY, barW * hpPct, barH);
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
  }
}

function spawnWave() {
  currentWave++;
  bossActive = false;
  const isBossLevel = CONFIG.level >= 5 && CONFIG.level % CONFIG.bossEvery === 0;
  if (isBossLevel) {
    playBossWarning();
    const boss = createEnemy('boss', window.innerWidth / 2, -CONFIG.enemySizes.boss);
    enemies.push(boss);
    waveEnemiesRemaining = 1;
    waveEnemiesSpawned = 1;
    bossActive = true;
    return;
  }
  const count = CONFIG.waveEnemyBase + CONFIG.level * CONFIG.waveEnemyGrowth;
  waveEnemiesRemaining = count;
  waveEnemiesSpawned = 0;
  waveSpawnTimer = 0;
}

function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.time++;
    e.tentacleFrame += 0.05;
    if (e.hitFlash > 0) e.hitFlash--;

    if (e.type === 'boss') {
      e.vy = CONFIG.enemySpeed.boss;
      if (e.y > 120) {
        e.vy = Math.sin(e.time * 0.02) * 0.5;
      }
      e.shootTimer -= 16;
      if (e.shootTimer <= 0) {
        bossShoot(e);
        e.shootTimer = 800;
      }
      e.barrageTimer -= 16;
      if (e.health < e.maxHealth * 0.5 && e.phase === 1) {
        e.phase = 2;
      }
      if (e.phase >= 2 && e.barrageTimer <= 0) {
        bossBarrage(e);
        e.barrageTimer = 3000;
      }
    } else if (e.type === 'small') {
      e.vy = CONFIG.enemySpeed.small;
      e.vx = Math.sin(e.time * 0.05 + e.sineOffset) * e.sineAmp * 0.02;
    } else if (e.type === 'medium') {
      e.vy = CONFIG.enemySpeed.medium;
      e.vx = Math.sin(e.time * 0.03 + e.sineOffset) * 30 * 0.02;
      e.shootTimer -= 16;
      if (e.shootTimer <= 0 && e.y > 50 && e.y < window.innerHeight - 100) {
        mediumShoot(e);
        e.shootTimer = 1500 + Math.random() * 1000;
      }
    } else if (e.type === 'baby') {
      e.vy = CONFIG.enemySpeed.baby;
      const dx = player.x - e.x;
      e.vx = dx * 0.01;
    }

    e.x += e.vx;
    e.y += e.vy;

    if (e.y > window.innerHeight + e.size && e.type !== 'boss') {
      enemies.splice(i, 1);
      waveEnemiesRemaining--;
    }
  }

  if (!bossActive && waveEnemiesSpawned < (waveEnemiesRemaining + 99) && waveEnemiesRemaining > 0) {
    waveSpawnTimer -= 16;
    if (waveSpawnTimer <= 0) {
      const typeRoll = Math.random();
      let type;
      if (CONFIG.level >= 3 && typeRoll > 0.7) {
        type = 'medium';
      } else {
        type = 'small';
      }
      enemies.push(createEnemy(type));
      waveEnemiesSpawned++;
      waveSpawnTimer = CONFIG.spawnInterval;
    }
  }

  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    if (b.y > window.innerHeight + 20 || b.x < -20 || b.x > window.innerWidth + 20) {
      enemyBullets.splice(i, 1);
    }
  }
}

function bossShoot(boss) {
  const dx = player.x - boss.x;
  const dy = player.y - boss.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const speed = 3;
  enemyBullets.push({
    x: boss.x,
    y: boss.y + boss.size / 2,
    vx: (dx / dist) * speed,
    vy: (dy / dist) * speed,
    width: 8,
    color: CONFIG.purple,
  });
}

function bossBarrage(boss) {
  for (let i = 0; i < 12; i++) {
    const angle = (Math.PI * 2 / 12) * i;
    enemyBullets.push({
      x: boss.x,
      y: boss.y,
      vx: Math.cos(angle) * 2.5,
      vy: Math.sin(angle) * 2.5,
      width: 6,
      color: CONFIG.purple,
    });
  }
}

function mediumShoot(e) {
  enemyBullets.push({
    x: e.x,
    y: e.y + e.size / 2,
    vx: 0,
    vy: 3,
    width: 4,
    color: CONFIG.blue,
  });
}

function drawEnemies(ctx) {
  for (const e of enemies) {
    drawPixelOctopus(ctx, e);
  }
  for (const b of enemyBullets) {
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.width / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function checkWaveClear() {
  if (waveEnemiesRemaining <= 0 && enemies.length === 0 && !bossActive) {
    CONFIG.level++;
    spawnWave();
  }
}

function spawnPowerup(x, y) {
  const types = ['health', 'weapon'];
  const type = types[Math.floor(Math.random() * types.length)];
  powerups.push({
    x: x,
    y: y,
    vy: 1.5,
    size: 14,
    type: type,
    active: true,
    glow: 0,
  });
}

function updatePowerups() {
  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.y += p.vy;
    p.glow += 0.1;
    const dx = player.x - p.x;
    const dy = player.y - p.y;
    if (Math.sqrt(dx * dx + dy * dy) < p.size + player.radius) {
      if (p.type === 'health') {
        player.health = Math.min(CONFIG.maxHealth, player.health + 20);
      } else if (p.type === 'weapon') {
        player.fireRateBoost = 5000;
      }
      playPowerup();
      spawnPowerupSparkle(p.x, p.y);
      powerups.splice(i, 1);
    }
    if (p.y > window.innerHeight + 20) {
      powerups.splice(i, 1);
    }
  }
}

function drawPowerups(ctx) {
  for (const p of powerups) {
    ctx.save();
    ctx.shadowColor = p.type === 'health' ? CONFIG.green : CONFIG.yellow;
    ctx.shadowBlur = 10 + Math.sin(p.glow) * 5;
    ctx.fillStyle = p.type === 'health' ? CONFIG.green : CONFIG.yellow;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = CONFIG.white;
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(p.type === 'health' ? '+' : 'W', p.x, p.y);
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}
