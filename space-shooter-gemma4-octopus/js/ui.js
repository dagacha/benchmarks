class UI {
    constructor(game) {
        this.game = game;
        this.damageNumbers = [];
    }

    addDamageNumber(x, y, text) {
        this.damageNumbers.push({ x, y, text, life: 60 });
    }

    update() {
        for (let i = this.damageNumbers.length - 1; i >= 0; i--) {
            this.damageNumbers[i].y -= 1;
            this.damageNumbers[i].life--;
            if (this.damageNumbers[i].life <= 0) this.damageNumbers.splice(i, 1);
        }
    }

    draw(ctx) {
        ctx.font = '20px monospace';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${this.game.score}`, 20, 40);
        ctx.fillText(`LEVEL: ${this.game.level}`, 20, 65);
        ctx.fillText(`TIER: ${this.game.player.tier}`, 20, 90);

        if (this.game.player.isUnleash) {
            ctx.fillStyle = CONFIG.COLORS.UNLEASH;
            ctx.fillText(`UNLEASH: ${(this.game.player.unleashTimer/1000).toFixed(1)}s`, 20, 115);
        }

        // Damage numbers
        ctx.textAlign = 'center';
        this.damageNumbers.forEach(d => {
            ctx.globalAlpha = d.life / 60;
            ctx.fillText(d.text, d.x, d.y);
        });
        ctx.globalAlpha = 1.0;

        if (this.game.state === 'START') {
            this.drawOverlay(ctx, 'OCTOPUS INVADERS', 'CLICK TO START');
        } else if (this.game.state === 'GAMEOVER') {
            this.drawOverlay(ctx, 'GAME OVER', `FINAL SCORE: ${this.game.score} - CLICK TO RESTART`);
        } else if (this.game.state === 'PAUSED') {
            this.drawOverlay(ctx, 'PAUSED', 'CLICK TO RESUME');
        }
    }

    drawOverlay(ctx, title, subtitle) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.font = '50px monospace';
        ctx.fillText(title, window.innerWidth / 2, window.innerHeight / 2 - 20);
        ctx.font = '20px monospace';
        ctx.fillText(subtitle, window.innerWidth / 2, window.innerHeight / 2 + 30);
    }
}
