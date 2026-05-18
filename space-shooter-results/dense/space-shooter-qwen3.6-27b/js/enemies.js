const enemies = [];
const enemyBullets = [];
const powerups = [];

const smallGrid = [
  [0,0,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1],
  [1,1,0,1,1,0,1,1],
  [1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,0],
  [0,0,1,0,0,1,0,0],
  [0,1,0,1,1,0,1,0],
];

const mediumGrid = [
  [0,0,0,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1],
  [1,1,0,1,1,1,1,0,1,1],
  [1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,0,0],
  [0,0,0,1,0,0,1,0,0,0],
  [0,0,1,0,1,1,0,1,0,0],
];

const babyGrid = [
  [0,1,1,1,0],
  [1,1,1,1,1],
  [1,0,1,0,1],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,1,0,1,0],
];

const bossGrid = [
  [0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,0,1,1,1,1,1,1,0,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [0,1,1,1,1,1,1,1,1,1,1,0],
  [0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,0,0,1,0,0,0,0],
  [0,0,0,1,0,1,1,0,1,0,0,0],
];

let tentacleFrame = 0;
let tentacleTimer = 0;

function createEnemy(type, x, y) {
  const baseX = x || Math.random() * (window.innerWidth - 100) + 50;
  return {
    type,
    x: baseX,
    y: y || -50,
    size: CONFIG.enemySizes[type],
    health: CONFIG.enemyHealth[type],
    maxHealth: CONFIG.enemyHealth[type],
    speed: CONFIG.enemySpeeds[type],
    color: {
      small: CONFIG.colors.pink,
      medium: CONFIG.colors.blue,
      baby: CONFIG.colors.cyanLight,
      boss: CONFIG.colors.purple,
    }[type],
    hitFlash: 0,
    angle: 0,
    amplitude: Math.random() * 60 + 30,
    frequency: Math.random() * 0.02 + 0.01,
    shootTimer: Math.random() * 120 + 60,
    baseX: baseX,
  };
}

function spawnWave() {
  const isBossLevel = CONFIG.level % 5 === 0 && CONFIG.level > 0;
  if (isBossLevel) {
    playBossWarning();
    enemies.push(createEnemy('boss', window.innerWidth / 2, -150));
  } else {
    const count = Math.floor(5 + CONFIG.level * 2);
    CONFIG.waveEnemyCount = count;
    CONFIG.spawnTimer = 0;
    for (let i = 0; i < Math.min(5, count); i++) {
      enemies.push(createEnemy('small'));
    }
    if (CONFIG.level >= 3) {
      for (let i = 0; i < Math.floor(CONFIG.level / 3); i++) {
        enemies.push(createEnemy('medium'));
      }
    }
  }
  CONFIG.waveActive = true;
}

function updateEnemies(dt) {
  tentacleTimer += dt;
  if (tentacleTimer > 300) {
    tentacleFrame = 1 - tentacleFrame;
    tentacleTimer = 0;
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    e.angle += e.frequency;
    e.x = e.baseX + Math.sin(e.angle) * e.amplitude;
    if (e.type === 'boss') {
      if (e.y < 100) e.y += e.speed;
      e.shootTimer -= 1;
      if (e.shootTimer <= 0) {
        bossShoot(e);
        e.shootTimer = 30;
      }
    } else if (e.type === 'medium') {
      e.y += e.speed;
      e.shootTimer -= 1;
      if (e.shootTimer <= 0) {
        enemyBullets.push({
          x: e.x,
          y: e.y + e.size / 2,
          vx: (player ? player.x : window.innerWidth / 2 - e.x) * 0.01,
          vy: 3,
          width: 4,
          color: CONFIG.colors.blue,
        });
        e.shootTimer = 90;
      }
    } else {
      e.y += e.speed;
    }
    if (e.hitFlash > 0) e.hitFlash--;
    if (e.y > window.innerHeight + 100 && e.type !== 'boss') {
      enemies.splice(i, 1);
      CONFIG.enemiesInWave--;
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

  if (CONFIG.waveActive && enemies.length === 0) {
    CONFIG.waveActive = false;
    CONFIG.level++;
    setTimeout(spawnWave, 1500);
  }

  if (CONFIG.waveActive && CONFIG.spawnTimer < CONFIG.waveEnemyCount - enemies.length) {
    if (Math.random() < 0.03) {
      enemies.push(createEnemy('small'));
      CONFIG.spawnTimer++;
    }
  }

  for (let i = powerups.length - 1; i >= 0; i--) {
    const p = powerups[i];
    p.y += 1;
    p.angle += 0.05;
    if (p.y > window.innerHeight + 50) {
      powerups.splice(i, 1);
    }
  }
}

function bossShoot(boss) {
  const pattern = Math.floor(Math.random() * 3);
  if (pattern === 0) {
    for (let i = -2; i <= 2; i++) {
      enemyBullets.push({
        x: boss.x + i * 20,
        y: boss.y + boss.size / 2,
        vx: i * 0.8,
        vy: 3,
        width: 6,
        color: CONFIG.colors.purple,
      });
    }
  } else if (pattern === 1) {
    const px = player ? player.x : window.innerWidth / 2;
    const py = player ? player.y : window.innerHeight - 100;
    const angle = Math.atan2(py - boss.y, px - boss.x);
    for (let i = -1; i <= 1; i++) {
      const a = angle + i * 0.3;
      enemyBullets.push({
        x: boss.x,
        y: boss.y + boss.size / 2,
        vx: Math.cos(a) * 3.5,
        vy: Math.sin(a) * 3.5,
        width: 6,
        color: CONFIG.colors.purple,
      });
    }
  } else {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const a = (Math.PI * 2 / count) * i;
      enemyBullets.push({
        x: boss.x,
        y: boss.y + boss.size / 2,
        vx: Math.cos(a) * 2.5,
        vy: Math.sin(a) * 2.5,
        width: 5,
        color: CONFIG.colors.purple,
      });
    }
  }
}

function drawEnemy(ctx, e) {
  const grid = e.type === 'small' ? smallGrid :
               e.type === 'medium' ? mediumGrid :
               e.type === 'baby' ? babyGrid : bossGrid;
  const rows = grid.length;
  const cols = grid[0].length;
  const cellW = e.size / cols;
  const cellH = e.size / rows;
  const x = e.x - e.size / 2;
  const y = e.y - e.size / 2;

  if (e.hitFlash > 0) {
    ctx.fillStyle = CONFIG.colors.white;
  } else {
    ctx.fillStyle = e.color;
  }

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (grid[row][col] === 1) {
        const isTentacle = row >= rows - 2;
        if (isTentacle && tentacleFrame === 1) {
          if (grid[row][col] === 1 && col % 2 === 1) continue;
        }
        ctx.fillRect(x + col * cellW, y + row * cellH, cellW + 0.5, cellH + 0.5);
      }
    }
  }

  if (e.type === 'boss' && e.health < e.maxHealth) {
    const barW = e.size;
    const barH = 6;
    const barX = e.x - barW / 2;
    const barY = y - 15;
    ctx.fillStyle = '#333';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.fillStyle = e.health > e.maxHealth * 0.5 ? CONFIG.colors.green :
                    e.health > e.maxHealth * 0.25 ? CONFIG.colors.orange : CONFIG.colors.red;
    ctx.fillRect(barX, barY, barW * (e.health / e.maxHealth), barH);
  }
}

function drawEnemyBullets(ctx) {
  for (const b of enemyBullets) {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.width, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPowerups(ctx) {
  for (const p of powerups) {
    const r = 12;
    const pulse = Math.sin(p.angle * 3) * 3;
    ctx.save();
    ctx.shadowColor = CONFIG.colors.gold;
    ctx.shadowBlur = 15 + pulse;
    ctx.fillStyle = CONFIG.colors.gold;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r + pulse * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    spawnPowerupSparkle(p.x, p.y);
  }
}

function killEnemy(index, e) {
  spawnExplosion(e.x, e.y, e.size, e.color);
  spawnInkSplatter(e.x, e.y, e.color);

  const baseScore = { small: 10, medium: 25, baby: 5, boss: 500 }[e.type];
  const mult = CONFIG.unleashActive ? CONFIG.unleashMultiplier : 1;
  CONFIG.score += baseScore * CONFIG.combo * mult;
  CONFIG.enemiesKilled++;
  CONFIG.combo++;
  CONFIG.comboTimer = CONFIG.comboTimeout;

  if ((e.type === 'medium' || e.type === 'boss') && Math.random() < 0.5) {
    powerups.push({
      x: e.x,
      y: e.y,
      angle: 0,
      type: 'weapon',
    });
  }

  if (e.type === 'medium') {
    for (let i = 0; i < 2; i++) {
      enemies.push(createEnemy('baby', e.x + (i === 0 ? -20 : 20), e.y));
    }
  }

  enemies.splice(index, 1);
  CONFIG.shakeDuration = e.type === 'boss' ? 20 : 8;
  CONFIG.shakeIntensity = e.type === 'boss' ? 12 : 4;
  playExplosion(e.size);
}
