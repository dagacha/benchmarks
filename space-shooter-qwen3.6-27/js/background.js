/*
 * background.js - 4-layer parallax scrolling background.
 * Stars, nebulae, planets, comets - all scroll downward (vertical shooter).
 * Reacts to mouse position for depth feel.
 */
const bgStars = [];
const bgNebulae = [];
const bgPlanets = [];
const bgComets = [];
let mouseX = 0, mouseY = 0;

function initBackground() {
  for (let i = 0; i < CONFIG.starCount; i++) {
    bgStars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() < 0.7 ? 1 : 2,
      speed: 0.3 + Math.random() * 0.4,
      opacity: 0.3 + Math.random() * 0.5,
    });
  }
  for (let i = 0; i < CONFIG.nebulaCount; i++) {
    bgNebulae.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: 80 + Math.random() * 120,
      speed: 0.2 + Math.random() * 0.3,
      opacity: 0.01 + Math.random() * 0.02,
      color: ['#4ECDC4', '#FF6B9D', '#45B7D1', '#C084FC'][Math.floor(Math.random() * 4)],
    });
  }
  for (let i = 0; i < 2; i++) {
    bgPlanets.push(createPlanet(true));
  }
}

function createPlanet(initial) {
  const far = Math.random() > 0.5;
  return {
    x: initial ? Math.random() * window.innerWidth : Math.random() * window.innerWidth,
    y: initial ? Math.random() * window.innerHeight : -100,
    radius: far ? 20 + Math.random() * 20 : 60 + Math.random() * 40,
    speed: far ? 0.1 + Math.random() * 0.1 : 0.5 + Math.random() * 0.3,
    opacity: far ? 0.3 + Math.random() * 0.1 : 0.7,
    color: far
      ? `hsl(${Math.random() * 360}, 30%, ${20 + Math.random() * 15}%)`
      : `hsl(${Math.random() * 360}, 50%, ${30 + Math.random() * 20}%)`,
  };
}

function spawnComet() {
  if (Math.random() < 0.003) {
    bgComets.push({
      x: Math.random() * window.innerWidth,
      y: -50,
      vx: (Math.random() - 0.5) * 3,
      vy: 3 + Math.random() * 4,
      length: 60 + Math.random() * 80,
      life: 1,
      decay: 0.008,
    });
  }
}

function updateBackground() {
  const depthX = (mouseX / window.innerWidth - 0.5) * 15;
  const depthY = (mouseY / window.innerHeight - 0.5) * 5;
  for (const s of bgStars) {
    s.y += s.speed;
    s.x += depthX * 0.1;
    if (s.y > window.innerHeight + 5) {
      s.y = -5;
      s.x = Math.random() * window.innerWidth;
    }
  }
  for (const n of bgNebulae) {
    n.y += n.speed;
    n.x += depthX * 0.2;
    if (n.y > window.innerHeight + n.radius) {
      n.y = -n.radius;
      n.x = Math.random() * window.innerWidth;
    }
  }
  for (let i = bgPlanets.length - 1; i >= 0; i--) {
    const p = bgPlanets[i];
    p.y += p.speed;
    p.x += depthX * 0.15;
    if (p.y > window.innerHeight + p.radius + 50) {
      bgPlanets[i] = createPlanet(false);
    }
  }
  for (let i = bgComets.length - 1; i >= 0; i--) {
    const c = bgComets[i];
    c.x += c.vx;
    c.y += c.vy;
    c.life -= c.decay;
    if (c.life <= 0 || c.y > window.innerHeight + 100) {
      bgComets.splice(i, 1);
    }
  }
  spawnComet();
}

function drawBackground(ctx) {
  for (const s of bgStars) {
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
  ctx.globalAlpha = 1;
  for (const n of bgNebulae) {
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
    grad.addColorStop(0, n.color);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = n.opacity;
    ctx.fillStyle = grad;
    ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
  }
  ctx.globalAlpha = 1;
  for (const p of bgPlanets) {
    ctx.globalAlpha = p.opacity;
    const grad = ctx.createRadialGradient(p.x - p.radius * 0.3, p.y - p.radius * 0.3, 0, p.x, p.y, p.radius);
    grad.addColorStop(0, p.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  for (const c of bgComets) {
    ctx.globalAlpha = c.life * 0.8;
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x - c.vx * c.length / 4, c.y - c.vy * c.length / 4);
    ctx.stroke();
    ctx.globalAlpha = c.life;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(c.x, c.y, 2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}
