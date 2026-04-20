class Bullet {
    constructor(x, y, angle = 0, speed = 10, color = CONFIG.COLORS.BULLET) {
        this.x = x;
        this.y = y;
        this.vx = Math.sin(angle) * speed;
        this.vy = -Math.cos(angle) * speed;
        this.radius = 4;
        this.color = color;
        this.dead = false;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -20 || this.x < -20 || this.x > window.innerWidth + 20) this.dead = true;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(Math.floor(this.x - 2), Math.floor(this.y - 5), 4, 10);
    }
}

class Player {
    constructor() {
        this.x = window.innerWidth / 2;
        this.y = window.innerHeight - 100;
        this.radius = 20;
        this.tier = 1;
        this.unleashTimer = 0;
        this.isUnleash = false;
        this.flash = 0;
        this.pattern = [[0,0],[1,0],[2,0],[1,1],[1,2]]; // Simple ship shape
    }

    update(mouseX, mouseY) {
        this.x += (mouseX - this.x) * CONFIG.PLAYER.LERP_SPEED;
        this.y += (mouseY - this.y) * CONFIG.PLAYER.LERP_SPEED;

        if (this.unleashTimer > 0) {
            this.unleashTimer -= 16.67; // approx ms per frame
            if (this.unleashTimer <= 0) this.isUnleash = false;
        }

        if (this.flash > 0) this.flash--;
    }

    shoot() {
        const bullets = [];
        const color = this.isUnleash ? CONFIG.COLORS.UNLEASH : this.getColor();

        if (this.tier === 1) {
            bullets.push(new Bullet(this.x, this.y));
        } else if (this.tier === 2) {
            bullets.push(new Bullet(this.x - 10, this.y));
            bullets.push(new Bullet(this.x + 10, this.y));
        } else if (this.tier === 3) {
            bullets.push(new Bullet(this.x, this.y));
            bullets.push(new Bullet(this.x - 15, this.y, -0.2));
            bullets.push(new Bullet(this.x + 15, this.y, 0.2));
        } else {
            // Tier 4: Spread + Homing (simulated by wider spread)
            bullets.push(new Bullet(this.x, this.y));
            bullets.push(new Bullet(this.x - 20, this.y, -0.4));
            bullets.push(new Bullet(this.x + 20, this.y, 0.4));
            bullets.push(new Bullet(this.x - 35, this.y, -0.7));
            bullets.push(new Bullet(this.x + 35, this.y, 0.7));
        }

        if (this.isUnleash) {
            // Unleash mode: Massive beams
            for(let i=-2; i<=2; i++) {
                bullets.push(new Bullet(this.x, this.y, i * 0.2, 15, CONFIG.COLORS.UNLEASH));
            }
        }

        return bullets;
    }

    getColor() {
        if (this.tier === 1) return CONFIG.COLORS.PLAYER_TIER_1;
        if (this.tier === 2) return CONFIG.COLORS.PLAYER_TIER_2;
        if (this.tier === 3) return CONFIG.COLORS.PLAYER_TIER_3;
        return CONFIG.COLORS.PLAYER_TIER_4;
    }

    draw(ctx) {
        let color = this.getColor();
        if (this.isUnleash) color = CONFIG.COLORS.UNLEASH;
        if (this.flash > 0) color = '#ffffff';

        // Draw ship using pixel pattern
        PixelArt.draw(ctx, this.x - this.radius, this.y - this.radius, 8, this.pattern, color);
        
        // Glow effect for high tiers
        if (this.tier >= 3) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x - this.radius - 2, this.y - this.radius - 2, this.radius*2 + 4, this.radius*2 + 4);
        }
    }
}
