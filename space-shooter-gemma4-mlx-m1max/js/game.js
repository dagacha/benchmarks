/** @file game.js - Main Loop and State Machine */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.audio = new AudioManager();
        this.particles = new ParticleSystem();
        this.bg = new Background(this.canvas);
        this.ui = new UI(this.canvas);
        this.player = new Player(this.canvas);
        
        this.enemies = [];
        this.bullets = [];
        this.score = 0;
        this.level = 1;
        this.combo = 1;
        this.gameState = 'MENU'; // MENU, PLAYING, GAMEOVER
        
        this.mouseX = 0;
        this.mouseY = 0;
        this.isShooting = false;
        this.shake = 0;

        this.initInput();
        this.loop();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    initInput() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        window.addEventListener('mousedown', () => {
            if(this.gameState === 'MENU') this.gameState = 'PLAYING';
            else if(this.gameState === 'GAMEOVER') location.reload();
            else this.isShooting = true;
        });
        window.addEventListener('mouseup', () => this.isShooting = false);
    }

    spawnEnemy() {
        if (Math.random() < 0.02) {
            const types = ['SMALL', 'MEDIUM'];
            const type = types[Math.floor(Math.random() * types.length)];
            this.enemies.push(new Enemy(type, Math.random() * this.canvas.width, -50, this.level));
        }
    }

    update() {
        if (this.gameState !== 'PLAYING') return;

        this.shake *= 0.9;
        this.player.update(this.mouseX, this.mouseY);
        this.bg.update(this.mouseX, this.mouseY);
        this.particles.update();
        this.spawnEnemy();

        // Shooting
        if (this.isShooting && Date.now() % 5 === 0) {
            this.bullets.push({ x: this.player.x, y: this.player.y, vy: -10, color: CONFIG.COLORS.PLAYER_GLOW });
            this.audio.playLaser();
        }

        // Bullets
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.y += b.vy;
            if (b.y < 0) this.bullets.splice(i, 1);
        }

        // Enemies & Collision
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.update();

            // Bullet vs Enemy
            for (let j = this.bullets.length - 1; j >= 0; j--) {
                const b = this.bullets[j];
                const dx = b.x - e.x;
                const dy = b.y - e.y;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < e.radius) {
                    e.hp--;
                    e.hitFlash = 3;
                    this.bullets.splice(j, 1);
                    this.audio.playHit();
                    this.particles.spawn(b.x, b.y, '#FFF', 5, 10);
                    
                    if (e.hp <= 0) {
                        this.score += 100 * this.combo;
                        this.enemies.splice(i, 1);
                        this.audio.playExplosion(e.size/50);
                        this.shake = 10;
                        break;
                    }
                }
            }

            // Player vs Enemy
            const dx = this.player.x - e.x;
            const dy = this.player.y - e.y;
            if (Math.sqrt(dx*dx + dy*dy) < e.radius + 20) {
                this.player.health -= 10;
                this.shake = 20;
                this.enemies.splice(i, 1);
                if(this.player.health <= 0) this.gameState = 'GAMEOVER';
            }

            if (e.y > this.canvas.height + 50) this.enemies.splice(i, 1);
        }
    }

    draw() {
        this.ctx.save();
        if (this.shake > 1) {
            this.ctx.translate(Math.random()*this.shake, Math.random()*this.shake);
        }

        this.bg.draw(this.ctx);
        this.particles.draw(this.ctx);
        this.enemies.forEach(e => e.draw(this.ctx));
        this.bullets.forEach(b => {
            this.ctx.fillStyle = b.color;
            this.ctx.fillRect(b.x-2, b.y-2, 4, 4);
        });
        this.player.draw(this.ctx);

        if (this.gameState === 'MENU') {
            this.ui.drawMenu("OCTOPUS INVADERS", "CLICK TO START");
        } else if (this.gameState === 'GAMEOVER') {
            this.ui.drawMenu("GAME OVER", `SCORE: ${this.score} - CLICK TO RESTART`);
        } else {
            this.ui.drawHUD(this.score, this.level, this.combo, this.player.health);
        }
        this.ctx.restore();
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Start the game
new Game();
