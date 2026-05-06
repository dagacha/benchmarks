/*
 * particles.js - Particle system for explosions, trails, ink splatter, sparks.
 * All particle types are managed in a single array with per-type behavior.
 */
const particles = [];

function spawnExplosion(x, y, color) {
  for (let i = 0; i < CONFIG.explosionParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    const colors = ['#39FF14', '#FFD700', '#FF6B9D', '#4ECDC4', '#45B7D1', '#C084FC'];
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.02 + Math.random() * 0.02,
      size: Math.random() * 4 + 1,
      color: Math.random() < 0.3 ? CONFIG.green : colors[Math.floor(Math.random() * colors.length)],
      type: 'explosion',
    });
  }
}

function spawnInkSplatter(x, y, color) {
  for (let i = 0; i < CONFIG.inkParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 0.5;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.015,
      size: Math.random() * 6 + 2,
      color: color,
      type: 'ink',
    });
  }
}

function spawnEngineTrail(x, y) {
  particles.push({
    x: x + (Math.random() - 0.5) * 8,
    y: y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: Math.random() * 2 + 1,
    life: 1,
    decay: 0.04,
    size: Math.random() * 3 + 1,
    color: Math.random() < 0.5 ? '#FF8C00' : '#FFD700',
    type: 'engine',
  });
}

function spawnBulletTrail(x, y, color) {
  particles.push({
    x: x + (Math.random() - 0.5) * 4,
    y: y,
    vx: (Math.random() - 0.5) * 0.3,
    vy: Math.random() * 0.5 + 0.5,
    life: 1,
    decay: 0.08,
    size: Math.random() * 2 + 0.5,
    color: color,
    type: 'trail',
  });
}

function spawnSparks(x, y) {
  for (let i = 0; i < CONFIG.sparkCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      decay: 0.06,
      size: Math.random() * 2 + 1,
      color: Math.random() < 0.5 ? '#FFFFFF' : '#FFD700',
      type: 'spark',
    });
  }
}

function spawnPowerupSparkle(x, y) {
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i;
    particles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * 2,
      vy: Math.sin(angle) * 2,
      life: 1,
      decay: 0.03,
      size: 3,
      color: '#FFD700',
      type: 'sparkle',
    });
  }
}

const damageNumbers = [];
function spawnDamageNumber(x, y, value, color) {
  damageNumbers.push({
    x: x,
    y: y,
    text: '-' + Math.abs(value),
    life: 1,
    decay: 0.016,
    vy: -1.5,
    color: color || '#FFD700',
  });
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    if (p.type === 'ink') {
      p.vy += 0.02;
      p.vx *= 0.98;
      p.vy *= 0.98;
    }
    if (p.type === 'engine') {
      p.size *= 0.97;
    }
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const dn = damageNumbers[i];
    dn.y += dn.vy;
    dn.life -= dn.decay;
    if (dn.life <= 0) {
      damageNumbers.splice(i, 1);
    }
  }
}

function drawParticles(ctx) {
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (const dn of damageNumbers) {
    ctx.globalAlpha = dn.life;
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = dn.color;
    ctx.textAlign = 'center';
    ctx.fillText(dn.text, dn.x, dn.y);
  }
  ctx.globalAlpha = 1;
}
