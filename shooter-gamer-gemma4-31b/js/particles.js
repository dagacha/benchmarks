/**
 * Particle system for explosions, trails and effects
 */
const Particles = {
    pool: [],

    spawn(x, y, color, size = 2, count = 1, type = 'circle') {
        for (let i = 0; i < count; i++) {
            this.pool.push({
                x, y,
                color,
                vx: (Math.random() - 0.5) * 4,
                vy: (Math.random() - 0.5) * 4,
                size: Math.random() * size + 1,
                life: 1.0,
                decay: 0.02 + Math.random() * 0.02,
                type
            });
        }
    },

    update() {
        for (let i = this.pool.length - 1; i >= 0; i--) {
            const p = this.pool[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;
            if (p.life <= 0) this.pool.splice(i, 1);
        }
    },

    draw(ctx) {
        for (const p of this.pool) {
            ctx.globalAlpha = p.life;
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }
        ctx.globalAlpha = 1.0;
    }
};