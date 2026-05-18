/**
 * Player ship and controls
 */
const Player = {
    x: 0,
    y: 0,
    targetX: 0,
    hp: CONFIG.PLAYER.MAX_HEALTH,
    maxHp: CONFIG.PLAYER.MAX_HEALTH,
    tier: 1,
    unleashTimer: 0,
    bullets: [],

    init() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight - 100;
        this.targetX = this.x;
    },

    update(mouseX) {
        this.targetX = mouseX;
        this.x += (this.targetX - this.x) * CONFIG.PLAYER.LERP_FACTOR;

        if (this.unleashTimer > 0) {
            this.unleashTimer -= 16.67;
        }

        // Engine trails
        Particles.spawn(this.x + CONFIG.PLAYER.RADIUS, this.y + CONFIG.PLAYER.RADIUS, '#FFA500', 4, 1);
    },

    shoot() {
        const speed = CONFIG.BULLETS[`TIER_${this.tier}_SPEED`];
        const color = this.tier === 1 ? CONFIG.COLORS.BULLET_CYAN : 
                      this.tier === 2 ? CONFIG.COLORS.BULLET_GREEN : 
                      this.tier === 3 ? CONFIG.COLORS.BULLET_GOLD : CONFIG.COLORS.BULLET_WHITE;
        
        const bulletCount = this.tier;
        for (let i = 0; i < bulletCount; i++) {
            const offset = (i - (bulletCount - 1) / 2) * 15;
            this.bullets.push({
                x: this.x + CONFIG.PLAYER.RADIUS + offset,
                y: this.y,
                vy: -speed,
                color: color,
                radius: 3
            });
        }
    },

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Ship body
        ctx.fillStyle = CONFIG.COLORS.PLAYER_BODY;
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-15, 10);
        ctx.lineTo(15, 10);
        ctx.closePath();
        ctx.fill();
        
        // Glow
        ctx.strokeStyle = CONFIG.COLORS.PLAYER_GLOW;
        ctx.lineWidth = 2;
        ctx.stroke();

        if (this.unleashTimer > 0) {
            ctx.strokeStyle = '#FFF';
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }
};