/** @file player.js - Ship movement and weapons */
class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.x = canvas.width / 2;
        this.y = canvas.height - 100;
        this.radius = 20;
        this.health = CONFIG.PLAYER.BASE_HEALTH;
        this.tier = 1;
        this.unleashTimer = 0;
    }

    update(mouseX, mouseY) {
        // LERP movement
        this.x += (mouseX - this.x) * CONFIG.PLAYER.LERP;
        this.y += (mouseY - this.y) * CONFIG.PLAYER.LERP;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Ship Body (Pixelated F-117 style)
        ctx.fillStyle = CONFIG.COLORS.PLAYER_BASE;
        ctx.shadowBlur = 15;
        ctx.shadowColor = CONFIG.COLORS.PLAYER_GLOW;
        
        // Main triangle shape
        ctx.beginPath();
        ctx.moveTo(0, -20);
        ctx.lineTo(-15, 15);
        ctx.lineTo(15, 15);
        ctx.closePath();
        ctx.fill();

        // Glow edges
        ctx.strokeStyle = CONFIG.COLORS.PLAYER_GLOW;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }
}
