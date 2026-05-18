/**
 * HUD and Game UI
 */
const UI = {
    score: 0,
    level: 1,
    combo: 0,

    drawHUD(ctx) {
        ctx.fillStyle = CONFIG.COLORS.TEXT_COLOR;
        ctx.font = '20px monospace';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${this.score}`, 20, 40);
        
        ctx.textAlign = 'center';
        ctx.fillText(`LEVEL: ${this.level}`, window.innerWidth / 2, 40);
        
        ctx.textAlign = 'right';
        ctx.fillText(`COMBO: x${this.combo}`, window.innerWidth - 20, 40);
        
        // Health bar
        const barW = 200;
        const barH = 10;
        const barX = (window.innerWidth - barW) / 2;
        ctx.fillStyle = '#333';
        ctx.fillRect(barX, window.innerHeight - 50, barW, barH);
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(barX, window.innerHeight - 50, barW * (Player.hp / Player.maxHp), barH);
    },

    drawScreen(ctx, text) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = '#FFF';
        ctx.font = '40px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(text, window.innerWidth / 2, window.innerHeight / 2);
        ctx.font = '20px monospace';
        ctx.fillText('CLICK TO START', window.innerWidth / 2, window.innerHeight / 2 + 50);
    }
};