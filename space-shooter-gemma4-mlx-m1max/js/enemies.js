/** @file enemies.js - Pixel-art octopus logic */
class Enemy {
    constructor(type, x, y, level) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.size = CONFIG.ENEMY[type].size;
        this.hp = CONFIG.ENEMY[type].hp;
        this.maxHp = this.hp;
        this.speed = CONFIG.ENEMY[type].speed;
        this.color = CONFIG.ENEMY[type].color;
        this.radius = this.size / 2;
        this.hitFlash = 0;
        this.angle = 0;
    }

    update() {
        this.y += this.speed;
        this.angle += 0.05;
        if (this.hitFlash > 0) this.hitFlash--;
    }

    draw(ctx) {
        const cellSize = this.size / 8;
        const offsetX = this.x - this.size/2;
        const offsetY = this.y - this.size/2;

        // Pixel grid pattern (simplified for brevity)
        // In a full build, these would be 8x8 arrays
        ctx.fillStyle = this.hitFlash > 0 ? '#FFF' : this.color;
        
        // Body
        ctx.fillRect(offsetX + cellSize*2, offsetY + cellSize*2, cellSize*4, cellSize*4);
        
        // Tentacles (animated)
        const wave = Math.sin(this.angle) * 2;
        for(let i=0; i<4; i++) {
            ctx.fillRect(offsetX + cellSize*(i+2), offsetY + cellSize*6 + wave, cellSize, cellSize*2);
        }
    }
}
