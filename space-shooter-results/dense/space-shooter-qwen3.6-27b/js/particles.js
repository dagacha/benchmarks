const particles = [];

function spawnExplosion(x, y, size, color) {
  const count = Math.floor(size / 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;
    const radius = Math.random() * (size / 4) + 2;
    const colors = ['#39FF14', '#FF6B9D', '#45B7D1', '#FFD700', '#FF4444', '#A855F7', color];
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1,
      decay: Math.random() * 0.03 + 0.02,
    });
  }
  for (let i = 0; i < 8; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 3 + 1,
      color: '#39FF14',
      life: 1,
      decay: Math.random() * 0.04 + 0.03,
    });
  }
}

function spawnInkSplatter(x, y, color) {
  for (let i = 0; i < 15; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 4 + 2,
      color,
      life: 1,
      decay: Math.random() * 0.015 + 0.01,
    });
  }
}

function spawnEngineTrail(x, y) {
  particles.push({
    x: x + (Math.random() - 0.5) * 6,
    y: y + (Math.random() - 0.5) * 4,
    vx: (Math.random() - 0.5) * 0.5,
    vy: Math.random() * 2 + 1,
    radius: Math.random() * 2 + 1,
    color: Math.random() > 0.5 ? '#FF8C00' : '#FFD700',
    life: 1,
    decay: 0.05,
  });
}

function spawnBulletTrail(x, y, color) {
  particles.push({
    x: x + (Math.random() - 0.5) * 4,
    y: y + (Math.random() - 0.5) * 4,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 1.5 + 0.5,
    color,
    life: 1,
    decay: 0.08,
  });
}

function spawnSpark(x, y) {
  for (let i = 0; i < 4; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 3 + 1;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 2 + 1,
      color: Math.random() > 0.5 ? '#FFFFFF' : '#FFD700',
      life: 1,
      decay: 0.06,
    });
  }
}

function spawnPowerupSparkle(x, y) {
  for (let i = 0; i < 10; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: Math.random() * 2 + 1,
      color: '#FFD700',
      life: 1,
      decay: 0.03,
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= p.decay;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles(ctx) {
  for (const p of particles) {
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
  }
  ctx.globalAlpha = 1;
}
