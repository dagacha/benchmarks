/*
 * player.js - Ship rendering, mouse tracking with lerp, weapons, health, upgrades.
 * Ship follows mouse cursor smoothly. Upgrades every 3 levels.
 */
const player = {
  x: 0,
  y: 0,
  radius: CONFIG.shipRadius,
  health: CONFIG.maxHealth,
  maxHealth: CONFIG.maxHealth,
  tier: 1,
  fireRateBoost: 0,
  invincible: 0,
  unleashActive: false,
  unleashTimer: 0,
  unleashStart: 0,
  tiltAngle: 0,
  tiltTarget: 0,
  lastShot: 0,
};

const bullets = [];

function initPlayer() {
  player.x = window.innerWidth / 2;
  player.y = window.innerHeight - 100;
  player.health = CONFIG.maxHealth;
  player.tier = 1;
  player.fireRateBoost = 0;
  player.invincible = 0;
  player.unleashActive = false;
  player.unleashTimer = 0;
}

function updateTier() {
  if (CONFIG.level >= 10) player.tier = 4;
  else if (CONFIG.level >= 7) player.tier = 3;
  else if (CONFIG.level >= 4) player.tier = 2;
  else player.tier = 1;
}

function updatePlayer() {
  if (CONFIG.state !== 'playing') return;

  player.x += (mouseX - player.x) * CONFIG.shipSpeed;
  player.x = Math.max(player.radius, Math.min(window.innerWidth - player.radius, player.x));
  player.y += (mouseY - player.y) * CONFIG.shipSpeed;
  player.y = Math.max(player.radius, Math.min(window.innerHeight - player.radius, player.y));

  player.tiltTarget = (mouseX - player.x) * 0.003;
  player.tiltTarget = Math.max(-0.2, Math.min(0.2, player.tiltTarget));
  player.tiltAngle += (player.tiltTarget - player.tiltAngle) * 0.2;

  if (player.invincible > 0) player.invincible -= 16;
  if (player.fireRateBoost > 0) player.fireRateBoost -= 16;

  if (player.unleashActive) {
    player.unleashTimer -= 16;
    if (player.unleashTimer <= 0) {
      player.unleashActive = false;
    }
  }

  const now = Date.now();
  let fireRate = CONFIG.fireRate[player.tier];
  if (player.fireRateBoost > 0) fireRate *= 0.5;
  if (player.unleashActive) fireRate *= 0.3;

  if (mouseDown && now - player.lastShot > fireRate) {
    shoot();
    player.lastShot = now;
  }

  if (CONFIG.state === 'playing') {
    const trailX = player.x;
    const trailY = player.y + player.radius;
    spawnEngineTrail(trailX, trailY);
  }

  updateTier();
}

function shoot() {
  const tier = player.tier;
  const count = player.unleashActive ? 7 : CONFIG.spreadCount[tier];
  const angle = player.unleashActive ? 0.5 : CONFIG.spreadAngle[tier];
  const speed = player.unleashActive ? CONFIG.unleashBulletSpeed : CONFIG.bulletSpeeds[tier];
  const width = player.unleashActive ? CONFIG.unleashBulletWidth : CONFIG.bulletWidths[tier];
  const colors = [CONFIG.cyan, '#39FF14', '#FFD700', '#FFFFFF'];
  const color = player.unleashActive ? '#FFFFFF' : colors[tier - 1];

  const startAngle = -(angle * (count - 1)) / 2;
  for (let i = 0; i < count; i++) {
    const a = startAngle + angle * i;
    bullets.push({
      x: player.x + (count % 2 === 0 ? (i - (count - 1) / 2) * 8 : 0),
      y: player.y - player.radius,
      vx: Math.sin(a) * speed * 0.3,
      vy: -speed,
      width: width,
      color: color,
      tier: tier,
      homing: player.unleashActive || (tier >= 4 && Math.random() < 0.3),
      homingTarget: null,
    });
  }
  playLaser();
}

function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];

    if (b.homing && enemies.length > 0) {
      if (!b.homingTarget || !enemies.includes(b.homingTarget)) {
        let closest = null;
        let minDist = Infinity;
        for (const e of enemies) {
          const dx = e.x - b.x;
          const dy = e.y - b.y;
          const d = dx * dx + dy * dy;
          if (d < minDist) {
            minDist = d;
            closest = e;
          }
        }
        b.homingTarget = closest;
      }
      if (b.homingTarget) {
        const dx = b.homingTarget.x - b.x;
        const bAngle = Math.atan2(b.vy, b.vx);
        const tAngle = Math.atan2(b.homingTarget.y - b.y, dx);
        let diff = tAngle - bAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        const turnRate = 0.08;
        b.vx += Math.cos(Math.PI / 2 + Math.sign(diff) * turnRate) * 0.5;
        b.vy += Math.sin(Math.PI / 2 + Math.sign(diff) * turnRate) * 0.5;
        const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
        const targetSpeed = CONFIG.bulletSpeeds[player.tier];
        b.vx = (b.vx / spd) * targetSpeed;
        b.vy = (b.vy / spd) * targetSpeed;
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

function drawBullets(ctx) {
  for (const b of bullets) {
    ctx.fillStyle = b.color;
    ctx.shadowColor = b.color;
    ctx.shadowBlur = 6;
    ctx.fillRect(b.x - b.width / 2, b.y - b.width * 2, b.width, b.width * 4);
    ctx.shadowBlur = 0;
  }
}

function drawPlayer(ctx) {
  if (player.invincible > 0 && Math.floor(player.invincible / 100) % 2 === 0) return;

  ctx.save();
  ctx.translate(player.x, player.y);
  ctx.rotate(player.tiltAngle);

  const tier = player.tier;
  const glowColor = [CONFIG.cyan, '#39FF14', '#FFD700', '#FFFFFF'][tier - 1];

  ctx.shadowColor = glowColor;
  ctx.shadowBlur = player.unleashActive ? 25 : 12;

  const bodyColor = '#2A2E35';
  const accentColor = glowColor;

  ctx.fillStyle = bodyColor;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 2;

  if (tier === 1) {
    ctx.beginPath();
    ctx.moveTo(0, -22);
    ctx.lineTo(-8, 5);
    ctx.lineTo(-12, 18);
    ctx.lineTo(-4, 14);
    ctx.lineTo(0, 20);
    ctx.lineTo(4, 14);
    ctx.lineTo(12, 18);
    ctx.lineTo(8, 5);
    ctx.closePath();
  } else if (tier === 2) {
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(-14, 2);
    ctx.lineTo(-20, 16);
    ctx.lineTo(-8, 12);
    ctx.lineTo(0, 22);
    ctx.lineTo(8, 12);
    ctx.lineTo(20, 16);
    ctx.lineTo(14, 2);
    ctx.closePath();
  } else if (tier === 3) {
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(-18, 0);
    ctx.lineTo(-24, 18);
    ctx.lineTo(-10, 14);
    ctx.lineTo(0, 24);
    ctx.lineTo(10, 14);
    ctx.lineTo(24, 18);
    ctx.lineTo(18, 0);
    ctx.closePath();
  } else {
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(-20, -4);
    ctx.lineTo(-26, 16);
    ctx.lineTo(-14, 12);
    ctx.lineTo(0, 26);
    ctx.lineTo(14, 12);
    ctx.lineTo(26, 16);
    ctx.lineTo(20, -4);
    ctx.closePath();
  }

  ctx.fill();
  ctx.stroke();

  ctx.shadowBlur = 0;

  ctx.fillStyle = accentColor;
  ctx.fillRect(-2, -34, 4, 6);

  ctx.fillStyle = '#FF8C00';
  ctx.fillRect(-6, 16, 3, 6);
  ctx.fillRect(3, 16, 3, 6);

  ctx.restore();

  if (player.unleashActive) {
    const elapsed = Date.now() - player.unleashStart;
    const progress = 1 - (player.unleashTimer / CONFIG.unleashDuration);
    ctx.strokeStyle = CONFIG.green;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 10, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - progress));
    ctx.stroke();

    ctx.shadowColor = CONFIG.white;
    ctx.shadowBlur = 30;
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius + 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
}
