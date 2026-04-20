class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        this.state = 'START'; // START, PLAYING, PAUSED, GAMEOVER
        this.score = 0;
        this.level = 1;
        this.mouseX = 0;
        this.mouseY = 0;
        this.isMouseDown = false;

        this.player = new Player();
        this.background = new Background();
        this.enemies = new WaveManager(this);
        this.ui = new UI(this);
        this.bullets = [];
        this.shake = 0;

        this.initInput();
        this.loop();
    }

    initInput() {
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });
        window.addEventListener('mousedown', () => {
            if (this.state === 'START' || this.state === 'GAMEOVER') this.start();
            else if (this.state === 'PAUSED') this.state = 'PLAYING';
            else this.isMouseDown = true;
        });
        window.addEventListener('mouseup', () => this.isMouseDown = false);
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (this.state === 'PLAYING') this.state = 'PAUSED';
                else if (this.state === 'PAUSED') this.state = 'PLAYING';
            }
        });
        window.addEventListener('resize', () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        });
    }

    start() {
        audio.init();
        this.score = 0;
        this.level = 1;
        this.player = new Player();
        this.enemies = new WaveManager(this);
        this.bullets = [];
        this.state = 'PLAYING';
    }

    gameOver() {
        this.state = 'GAMEOVER';
        audio.playExplosion();
    }

    checkCollisions() {
        // Bullets vs Enemies
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            for (let j = this.enemies.enemies.length - 1; j >= 0; j--) {
                const e = this.enemies.enemies[j];
                const dx = b.x - e.x;
                const dy = b.y - e.y;
                const distSq = dx * dx + dy * dy;
                const radSum = b.radius + e.radius;

                if (distSq < radSum * radSum) {
                    // Hit!
                    b.dead = true;
                    e.dead = true;
                    this.handleEnemyDeath(e);
                    this.score += 10 * this.level;
                    this.ui.addDamageNumber(e.x, e.y, '+10');
                    audio.playExplosion();
                    
                    // Check for level up
                    if (this.score > this.level * 500) {
                        this.level++;
                        this.player.tier = Math.min(4, Math.floor(this.level / CONFIG.UPGRADES.TIER_INTERVAL) + 1);
                        audio.playPowerup();
                    }
                    break;
                }
            }
        }

        // Player vs Enemies
        for (let e of this.enemies.enemies) {
            const dx = this.player.x - e.x;
            const dy = this.player.y - e.y;
            const distSq = dx * dx + dy * dy;
            const radSum = this.player.radius + e.radius;

            if (distSq < radSum * radSum) {
                this.gameOver();
            }
        }
    }

    handleEnemyDeath(e) {
        particleSystem.emit(e.x, e.y, e.color, 15);
        
        // Medium splits into babies
        if (e.type === 'MEDIUM') {
            this.enemies.enemies.push(new Enemy(e.x - 10, e.y, 'BABY'));
            this.enemies.enemies.push(new Enemy(e.x + 10, e.y, 'BABY'));
        }

        // Powerup chance (Unleash Mode)
        if (Math.random() < 0.05) {
            this.player.isUnleash = true;
            this.player.unleashTimer = CONFIG.PLAYER.UNLEASH_DURATION;
            audio.playPowerup();
        }
    }

    update() {
        if (this.state !== 'PLAYING') return;

        this.background.update();
        this.enemies.update();
        this.player.update(this.mouseX, this.mouseY);
        this.ui.update();
        particleSystem.update();

        if (this.isMouseDown) {
            // Throttled shooting
            if (this.bullets.length === 0 || this.bullets[this.bullets.length-1].y < this.player.y - 100) {
                const newBullets = this.player.shoot();
                this.bullets.push(...newBullets);
                audio.playLaser();
            }
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            this.bullets[i].update();
            if (this.bullets[i].dead) this.bullets.splice(i, 1);
        }

        this.checkCollisions();

        if (this.shake > 0) this.shake--;
    }

    draw() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        if (this.shake > 0) {
            this.ctx.translate(Math.random() * 5 - 2.5, Math.random() * 5 - 2.5);
        }

        this.background.draw(this.ctx);
        this.enemies.draw(this.ctx);
        this.bullets.forEach(b => b.draw(this.ctx));
        this.player.draw(this.ctx);
        particleSystem.draw(this.ctx);
        
        this.ctx.restore();

        this.ui.draw(this.ctx);
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}

// Initialize game
const game = new Game();
