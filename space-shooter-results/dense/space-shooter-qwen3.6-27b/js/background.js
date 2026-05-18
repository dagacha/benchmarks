let stars = [];
let nebulae = [];
let planets = [];
let comets = [];

function initBackground() {
  stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 0.5 + 0.2,
      opacity: Math.random() * 0.5 + 0.3,
    });
  }

  nebulae = [];
  for (let i = 0; i < 5; i++) {
    nebulae.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: Math.random() * 120 + 60,
      speed: Math.random() * 0.15 + 0.05,
      color: ['#FF6B9D', '#45B7D1', '#A855F7', '#4ECDC4'][Math.floor(Math.random() * 4)],
      opacity: Math.random() * 0.03 + 0.01,
    });
  }

  planets = [];
  for (let i = 0; i < 2; i++) {
    const isFar = Math.random() > 0.5;
    planets.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      radius: isFar ? Math.random() * 20 + 10 : Math.random() * 40 + 30,
      speed: isFar ? Math.random() * 0.15 + 0.05 : Math.random() * 0.3 + 0.2,
      opacity: isFar ? 0.2 : 0.6,
      color: ['#FF6B9D44', '#45B7D144', '#FFD70044', '#A855F744'][Math.floor(Math.random() * 4)],
    });
  }

  comets = [];
}

function updateBackground(dt, mouseX, mouseY) {
  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;
  const mx = (mouseX - cx) / cx;
  const my = (mouseY - cy) / cy;

  for (const s of stars) {
    s.y += s.speed;
    s.x += mx * 0.3;
    if (s.y > window.innerHeight + 5) {
      s.y = -5;
      s.x = Math.random() * window.innerWidth;
    }
  }

  for (const n of nebulae) {
    n.y += n.speed;
    n.x += mx * 0.5;
    if (n.y - n.radius > window.innerHeight) {
      n.y = -n.radius;
      n.x = Math.random() * window.innerWidth;
    }
  }

  for (const p of planets) {
    p.y += p.speed;
    p.x += mx * 0.8;
    if (p.y - p.radius > window.innerHeight) {
      p.y = -p.radius;
      p.x = Math.random() * window.innerWidth;
    }
  }

  if (Math.random() < 0.002 && comets.length < 2) {
    comets.push({
      x: Math.random() * window.innerWidth,
      y: -20,
      vx: (Math.random() - 0.5) * 3,
      vy: Math.random() * 4 + 3,
      length: Math.random() * 80 + 40,
      opacity: 1,
    });
  }

  for (let i = comets.length - 1; i >= 0; i--) {
    const c = comets[i];
    c.x += c.vx;
    c.y += c.vy;
    c.opacity -= 0.005;
    if (c.y > window.innerHeight + 100 || c.opacity <= 0) {
      comets.splice(i, 1);
    }
  }
}

function drawBackground(ctx) {
  for (const n of nebulae) {
    const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, n.radius);
    grad.addColorStop(0, n.color);
    grad.addColorStop(1, 'transparent');
    ctx.globalAlpha = n.opacity;
    ctx.fillStyle = grad;
    ctx.fillRect(n.x - n.radius, n.y - n.radius, n.radius * 2, n.radius * 2);
  }

  for (const p of planets) {
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.radius / 2, p.y - p.radius / 2, p.radius, p.radius);
  }

  ctx.globalAlpha = 1;
  for (const s of stars) {
    ctx.globalAlpha = s.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(s.x, s.y, s.size, s.size);
  }
  ctx.globalAlpha = 1;

  for (const c of comets) {
    ctx.globalAlpha = c.opacity;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(c.x, c.y);
    ctx.lineTo(c.x - c.vx * c.length / 5, c.y - c.vy * c.length / 5);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
