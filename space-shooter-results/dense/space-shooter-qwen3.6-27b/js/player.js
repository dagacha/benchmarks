let player = null;

function initPlayer() {
  player = {
    x: window.innerWidth / 2,
    y: window.innerHeight - 100,
    radius: CONFIG.playerRadius,
    health: CONFIG.playerMaxHealth,
    tier: 1,
    mouseX: window.innerWidth / 2,
    mouseY: window.innerHeight - 100,
    tilt: 0,
  };
}

function updatePlayer() {
  if (!player) return;
  const targetX = player.mouseX;
  const targetY = player.mouseY;
  const dx = targetX - player.x;
  const dy = targetY - player.y;
  player.x += dx * CONFIG.playerSpeed;
  player.y += dy * CONFIG.playerSpeed;
  player.tilt = dx * 0.05;
  player.tilt = Math.max(-15, Math.min(15, player.tilt));
  player.tier = Math.min(4, Math.floor((CONFIG.level - 1) / 3) + 1);
  spawnEngineTrail(player.x - 8, player.y + 18);
  spawnEngineTrail(player.x + 8, player.y + 18);
}

function shoot() {
  if (!player) return;
  const now = Date.now();
  const rate = CONFIG.unleashActive ? CONFIG.fireRate / 3 : CONFIG.fireRate;
  if (now - CONFIG.lastShot < rate) return;
  CONFIG.lastShot = now;
  playLaser();

  const speed = CONFIG.bulletSpeeds[player.tier - 1];
  const colors = [CONFIG.colors.cyan, CONFIG.colors.green, CONFIG.colors.gold, CONFIG.colors.white];
  const color = colors[player.tier - 1];
  const isUnleash = CONFIG.unleashActive;

  if (player.tier === 1) {
    bullets.push({
      x: player.x,
      y: player.y - 20,
      vx: 0,
      vy: -speed,
      width: isUnleash ? 6 : 3,
      color: isUnleash ? CONFIG.colors.white : color,
    });
  } else if (player.tier === 2) {
    bullets.push(
      { x: player.x - 8, y: player.y - 15, vx: 0, vy: -speed, width: isUnleash ? 5 : 3, color },
      { x: player.x + 8, y: player.y - 15, vx: 0, vy: -speed, width: isUnleash ? 5 : 3, color }
    );
  } else if (player.tier === 3) {
    bullets.push(
      { x: player.x, y: player.y - 20, vx: 0, vy: -speed, width: isUnleash ? 5 : 3, color },
      { x: player.x - 12, y: player.y - 12, vx: -1.5, vy: -speed, width: isUnleash ? 5 : 3, color },
      { x: player.x + 12, y: player.y - 12, vx: 1.5, vy: -speed, width: isUnleash ? 5 : 3, color }
    );
  } else {
    bullets.push(
      { x: player.x, y: player.y - 20, vx: 0, vy: -speed, width: isUnleash ? 6 : 4, color, homing: true },
      { x: player.x - 10, y: player.y - 15, vx: -1, vy: -speed, width: isUnleash ? 5 : 3, color },
      { x: player.x + 10, y: player.y - 15, vx: 1, vy: -speed, width: isUnleash ? 5 : 3, color },
      { x: player.x - 18, y: player.y - 10, vx: -2.5, vy: -speed * 0.9, width: isUnleash ? 5 : 3, color },
      { x: player.x + 18, y: player.y - 10, vx: 2.5, vy: -speed * 0.9, width: isUnleash ? 5 : 3, color }
    );
  }
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    if (b.homing && enemies.length > 0) {
      let nearest = null;
      let nearDist = Infinity;
      for (const e of enemies) {
        const d = (e.x - b.x) ** 2 + (e.y - b.y) ** 2;
        if (d < nearDist) { nearDist = d; nearest = e; }
      }
      if (nearest) {
        const angle = Math.atan2(nearest.y - b.y, nearest.x - b.x);
        b.vx += Math.cos(angle) * 0.3;
      }
    }
    b.x += b.vx;
    b.y += b.vy;
    spawnBulletTrail(b.x, b.y, b.color);
    if (b.y < -20 || b.x < -20 || b.x > window.innerWidth + 20) {
      bullets.splice(i, 1);
    }
  }
}

function drawPlayer(ctx) {
  if (!player) return;
  const tier = player.tier;
  const x = player.x;
  const y = player.y;
  const isUnleash = CONFIG.unleashActive;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(player.tilt * Math.PI / 180);

  const glowColor = isUnleash ? '#FFFFFF' :
    tier >= 4 ? '#FFFFFF' : tier >= 3 ? CONFIG.colors.gold :
    tier >= 2 ? CONFIG.colors.green : CONFIG.colors.cyan;

  ctx.shadowColor = glowColor;
  ctx.shadowBlur = isUnleash ? 30 : 15;
  ctx.fillStyle = '#2D3748';

  if (tier === 1) {
    ctx.fillRect(-3, -20, 6, 25);
    ctx.fillRect(-8, -8, 16, 8);
    ctx.fillRect(-10, 0, 6, 12);
    ctx.fillRect(4, 0, 6, 12);
  } else if (tier === 2) {
    ctx.fillRect(-4, -22, 8, 28);
    ctx.fillRect(-12, -5, 24, 10);
    ctx.fillRect(-14, 3, 8, 14);
    ctx.fillRect(6, 3, 8, 14);
    ctx.fillRect(-6, -18, 3, 6);
    ctx.fillRect(3, -18, 3, 6);
  } else if (tier === 3) {
    ctx.fillRect(-5, -25, 10, 30);
    ctx.fillRect(-18, -2, 36, 12);
    ctx.fillRect(-20, 8, 10, 12);
    ctx.fillRect(10, 8, 10, 12);
    ctx.fillRect(-8, -20, 4, 8);
    ctx.fillRect(4, -20, 4, 8);
    ctx.fillRect(-3, -28, 6, 6);
  } else {
    ctx.fillRect(-5, -28, 10, 35);
    ctx.fillRect(-22, 0, 44, 10);
    ctx.fillRect(-24, 10, 12, 10);
    ctx.fillRect(12, 10, 12, 10);
    ctx.fillRect(-10, -22, 5, 10);
    ctx.fillRect(5, -22, 5, 10);
    ctx.fillRect(-3, -32, 6, 8);
    ctx.fillRect(-15, -8, 30, 3);
  }

  ctx.shadowBlur = 0;
  ctx.fillStyle = glowColor;
  if (tier >= 2) {
    ctx.fillRect(-2, -26, 4, 3);
  }
  if (tier >= 3) {
    ctx.fillRect(-16, -2, 32, 2);
  }
  if (tier >= 4) {
    ctx.fillRect(-20, 0, 40, 1);
    const shimmer = Math.sin(Date.now() * 0.005) * 0.5 + 0.5;
    ctx.globalAlpha = shimmer * 0.5;
    ctx.fillStyle = CONFIG.colors.cyan;
    ctx.fillRect(-22, 0, 44, 10);
    ctx.globalAlpha = 1;
  }

  if (isUnleash) {
    const elapsed = CONFIG.unleashDuration - CONFIG.unleashTimer;
    const pct = 1 - elapsed / CONFIG.unleashDuration;
    ctx.strokeStyle = CONFIG.colors.green;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 40, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.stroke();
  }

  ctx.restore();
}
