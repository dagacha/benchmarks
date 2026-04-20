const ENEMY_PATTERNS = {
    SMALL: [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]],
    MEDIUM: [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[1,1],[2,1],[3,1],[4,1],[0,2],[1,2],[2,2],[3,2],[4,2],[0,3],[1,3],[2,3],[3,3],[4,3],[0,4],[1,4],[2,4],[3,4],[4,4]],
    BABY: [[0,0],[1,0],[0,1],[1,1]],
    BOSS: [[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[0,1],[1,1],[2,1],[3,1],[4,1],[5,1],[6,1],[0,2],[1,2],[2,2],[3,2],[4,2],[5,2],[6,2],[0,3],[1,3],[2,3],[3,3],[4,3],[5,3],[6,3],[0,4],[1,4],[2,4],[3,4],[4,4],[5,4],[6,4]]
};

class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.dead = false;
        this.radius = 0;
        this.timer = 0;

        switch(type) {
            case 'SMALL':
                this.radius = 18;
                this.color = CONFIG.COLORS.ENEMY_SMALL;
                this.pattern = ENEMY_PATTERNS.SMALL;
                this.speedY = CONFIG.ENEMIES.SMALL_SPEED;
                this.vx = Math.sin(x) * 2;
                break;
            case 'MEDIUM':
                this.radius = 24;
                this.color = CONFIG.COLORS.ENEMY_MEDIUM;
                this.pattern = ENEMY_PATTERNS.MEDIUM;
                this.speedY = CONFIG.ENEMIES.MEDIUM_SPEED;
                break;
            case 'BABY':
                this.radius = 10;
                this.color = CONFIG.COLORS.ENEMY_BABY;
                this.pattern = ENEMY_PATTERNS.BABY;
                this.speedY = CONFIG.ENEMIES.BABY_SPEED;
                this.vx = (Math.random() - 0.5) * 4;
                break;
            case 'BOSS':
                this.radius = 75;
                this.color = CONFIG.COLORS.ENEMY_BOSS;
                this.pattern = ENEMY_PATTERNS.BOSS;
                this.speedY = CONFIG.ENEMIES.BOSS_SPEED;
                break;
        }
    }

    update() {
        this.timer += 0.05;
        if (this.type === 'SMALL') {
            this.x += Math.sin(this.timer) * 2;
        } else if (this.type === 'BABY') {
            this.x += this.vx;
        }
        this.y += this.speedY;

        if (this.y > window.innerHeight + 100) this.dead = true;
    }

    draw(ctx) {
        const size = this.radius / 3;
        PixelArt.draw(ctx, this.x - this.radius, this.y - this.radius, size, this.pattern, this.color);
    }
}

class WaveManager {
    constructor(game) {
        this.game = game;
        this.enemies = [];
        this.spawnTimer = 0;
    }

    spawn() {
        const level = this.game.level;
        
        // Boss logic
        if (level > 0 && level % 5 === 0 && this.enemies.filter(e => e.type === 'BOSS').length === 0) {
            this.enemies.push(new Enemy(window.innerWidth/2, -100, 'BOSS'));
            return;
        }

        // Regular spawning
        this.spawnTimer++;
        if (this.spawnTimer > Math.max(10, 60 - level)) {
            this.spawnTimer = 0;
            const x = Math.random() * (window.innerWidth - 100) + 50;
            const rand = Math.random();
            
            if (rand < 0.6) this.enemies.push(new Enemy(x, -50, 'SMALL'));
            else if (rand < 0.9) this.enemies.push(new Enemy(x, -50, 'MEDIUM'));
            else this.enemies.push(new Enemy(x, -50, 'BABY'));
        }
    }

    update() {
        this.spawn();
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.update();
            if (e.dead) this.enemies.splice(i, 1);
        }
    }

    draw(ctx) {
        this.enemies.forEach(e => e.draw(ctx));
    }
}
