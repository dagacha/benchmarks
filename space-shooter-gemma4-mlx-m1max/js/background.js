/** @file background.js - 4-layer parallax system */
class Background {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.stars = Array.from({length: 100}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            s: Math.random() * 2
        }));
        this.planets = Array.from({length: 5}, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: 20 + Math.random() * 60,
            speed: 0.1 + Math.random() * 0.5,
            opacity: 0.2 + Math.random() * 0.4
        }));
    }

    update(mouseX, mouseY) {
        // Parallax effect based on mouse
        const dx = (mouseX - window.innerWidth/2) * 0.01;
        const dy = (mouseY - window.innerHeight/2) * 0.01;

        this.stars.forEach(s => {
            s.y += 0.5 + dy * 0.1;
            s.x += dx * 0.1;
            if (s.y > this.canvas.height) s.y = 0;
            if (s.x > this.canvas.width) s.x = 0;
            if (s.x < 0) s.x = this.canvas.width;
        });

        this.planets.forEach(p => {
            p.y += p.speed;
            if (p.y > this.canvas.height + p.r) p.y = -p.r;
        });
    }

    draw(ctx) {
        ctx.fillStyle = '#0D1117';
        ctx.fillRect(0, 0, this.canvas.width, this.canvashes.height);

        // Stars
        ctx.fillStyle = '#FFF';
        this.stars.forEach(s => ctx.fillRect(s.x, s.y, s.s, s.s));

        // Planets
        this.planets.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = '#1A2639';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalAlpha = 1.0;
        });
    }
}
