/**
 * Enemy types and spawning logic
 */
const Enemies = {
    types: {
        SMALL: {
            grid: [
                [0,1,1,0],
                [1,1,1,1],
                [1,0,0,1],
                [0,1,1,0]
            ],
            color: CONFIG.COLORS.ENEMY_SMALL,
            size: CONFIG.ENEMIES.SMALL_SIZE,
            hp: 10
        },
        MEDIUM: {
            grid: [
                [0,1,1,1,0],
                [1,1,1,1,1],
                [1,0,1,0,1],
                [1,1,1,1,1],
                [0,1,0,1,0]
            ],
            color: CONFIG.COLORS.ENEMY_MEDIUM,
            size: CONFIG.ENEMIES.MEDIUM_SIZE,
            hp: 30
        },
        BABY: {
            grid: [
                [0,1,0],
                [1,1,1],
                [0,1,0]
            ],
            color: CONFIG.COLORS.ENEMY_BABY,
            size: CONFIG.ENEMIES.BABY_SIZE,
            hp: 5
        },
        BOSS: {
            grid: [
                [0,0,1,1,1,1,0,0],
                [0,1,1,1,1,1,1,0],
                [1,1,0,1,1,0,1,1],
                [1,1,1,1,1,1,1,1],
                [1,1,0,1,1,0,1,1],
                [0,1,1,1,1,1,1,0],
                [0,0,1,1,1,1,0,0],
                [0,0,1,0,0,1,0,0]
            ],
            color: CONFIG.COLORS.ENEMY_BOSS,
            size: CONFIG.ENEMIES.BOSS_SIZE,
            hp: 500
        }
    },

    pool: [],

    spawn(type) {
        const t = this.types[type];
        this.pool.push({
            type,
            x: Math.random() * (window.innerWidth - t.size),
            y: -t.size,
            vx: 0,
            vy: 1 + Math.random() * 2,
            hp: t.hp,
            maxHp: t.hp,
            size: t.size,
            color: t.color,
            grid: t.grid,
            hitFlash: 0,
            sineX: Math.random() * 100
        });
    },

    update() {
        for (let i = this.pool.length - 1; i >= 0; i--) {
            const e = this.pool[i];
            e.y += e.vy;
            
            if (e.type === 'SMALL') {
                e.x += Math.sin(e.sineX) * 2;
                e.sineX += CONFIG.ENEMIES.SINE_FREQUENCY;
            }

            if (e.y > window.innerHeight + e.size) {
                this.pool.splice(i, 1);
            }
        }
    },

    draw(ctx) {
        for (const e of this.pool) {
            const cellW = e.size / e.grid[0].length;
            const cellH = e.size / e.grid.length;

            ctx.fillStyle = e.hitFlash > 0 ? CONFIG.COLORS.HIT_WHITE : e.color;
            if (e.hitFlash > 0) e.hitFlash--;

            for (let row = 0; row < e.grid.length; row++) {
                for (let col = 0; col < e.grid[row].length; col++) {
                    if (e.grid[row][col]) {
                        ctx.fillRect(e.x + col * cellW, e.y + row * cellH, cellW, cellH);
                    }
                }
            }
        }
    }
};