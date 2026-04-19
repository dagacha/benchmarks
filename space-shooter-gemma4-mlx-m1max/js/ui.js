/** @file ui.js - HUD and Menus */
class UI {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    drawHUD(score, level, combo, health) {
        this.ctx.font = CONFIG.UI.FONT_SIZE + ' ' + CONFIG.UI.FONT;
        this.ctx.fillStyle = '#FFF';
        
        // Score
        this.ctx.fillText(`SCORE: ${score}`, 20, 40);
        // Level
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`LEVEL ${level}`, this.canvas.width/2, 40);
        // Combo
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`COMBO x${combo}`, this.canvas.width - 20, 40);
        
        // Health Bar
        const barW = 200;
        const barX = this.canvas.width/2 - barW/2;
        this.ctx.strokeStyle = '#FFF';
        this.ctx.strokeRect(barX, this.canvas.height - 40, barW, 10);
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillRect(barX, this.canvas.height - 40, (health/100) * barW, 10);
        this.ctx.textAlign = 'left';
    }

    drawMenu(title, sub) {
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#FFF';
        this.ctx.font = '60px monospace';
        this.ctx.fillText(title, this.canvas.width/2, this.canvas.height/2 - 40);
        this.ctx.font = '20px monospace';
        this.ctx.fillText(sub, this.canvas.width/2, this.canvas.height/2 + 20);
    }
}
