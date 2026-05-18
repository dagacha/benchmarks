/**
 * Main Game Loop and Logic
 */
const Game = {
    state: 'MENU',
    mouseX: 0,
    mouseY: 0,
    isMouseDown: false,
    shake: 0,
    frameCount: 0,

    init() {
        const canvas = document.getElementById('gameCanvas');
        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = false;
        
        window.addEventListener('resize', () => this.resize());
        this.resize();

        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('mousedown', () => {
            if (this.state === 'MENU' || this.state === 'GAMEOVER') {
                this.start();
            }
            this.isMouseDown = true;
            AudioSystem.init();
        });

        window.addEventListener('mouseup', () => {
            this.isMouseDown = false;
        });

        Background.init();
        Player.init();
        this.loop();
    },

    resize() {
        this.ctx.canvas.width = window.innerWidth;
        this.ctx.canvas.height = window.innerHeight;
    },

    start() {
        this.state = 'PLAYING';
        Player.hp = CONFIG.PLAYER.MAX_HEALTH;
        Player.tier = 1;
        UI.score = 0;
        UI.level = 1;
        UI.combo = 0;
        Enemies.pool = [];
        Player.bullets = [];
    },

    loop() {
        this.frameCount++;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    },

    update() {
        if (this.state !== 'PLAYING') return;

        Player.update(this.mouseX);
        if (this.isMouseDown && this.frameCount % 10 === 0) {
            Player.shoot();
            AudioSystem.playLaser();
        }

        Background.update(this.mouseX, this.mouseY);
        Enemies.update();
        Particles.update();

        // Bullet updates & Collision
        for (let i = Player.bullets.length - 1; i >= 0; i--) {
            const b = Player.bullets[i];
            b.y += b.vy;
            
            // Bullet trails
            if (this.frameCount % 2 === 0) {
                Particles.spawn(b.x, b.y, b.color, 2, 1);
            }

            if (b.y < -10) {
                Player.bullets.splice(i, 1);
                continue;
            }

            // Enemy Collision
            for (let j = Enemies.pool.length - 1; j >= 0; j--) {
                const e = Enemies.pool[j];
                const dx = b.x - (e.x + e.size / 2);
                const dy = b.y - (e.y + e.size / 2);
                const distSq = dx * dx + dy * dy;
                const rSum = b.radius + e.size / 2;
                
                if (distSq < rSum * rSum) {
                    e.hp -= 10;
                    e.hitFlash = 3;
                    AudioSystem.playHit();
                    Particles.spawn(b.x, b.y, '#FFF', 4, 5);
                    Player.bullets.splice(i, 1);
                    
                    if (e.hp <= 0) {
                        UI.score += 100 * (e.type === 'BOSS' ? 5 : 1);
                        UI.combo++;
                        AudioSystem.playExplosion(e.size / 36);
                        Particles.spawn(e.x + e.size / 2, e.y + e.size / 2, e.color, 8, 20);
                        Enemies.pool.splice(j, 1);
                    }
                    break;
                }
            }
        }

        // Enemy-Player Collision
        for (const e of Enemies.pool) {
            const dx = Player.x - (e.x + e.size / 2);
            const dy = Player.y - (e.y + e.size / 2);
            if (dx * dx + dy * dy < (Player.RADIUS + e.size / 2) ** 2) {
                Player.hp -= 1;
                this.shake = 10;
                UI.combo = 0;
            }
        }

        if (Player.hp <= 0) {
            this.state = 'GAMEOVER';
        }

        // Spawning
        if (this.frameCount % 60 === 0) {
            const type = Math.random() > 0.8 ? 'MEDIUM' : 'SMALL';
            Enemies.spawn(type);
        }
        
        if (this.shake > 0) this.shake *= CONFIG.GAME.SHAKE_DECAY;
    },

    draw() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
        this.ctx.save();
        if (this.shake > 0) {
            this.ctx.translate(Math.random() * this.shake, Math.random() * this.shake);
        }

        Background.draw(this.ctx);
        Particles.draw(this.ctx);
        Enemies.draw(this.ctx);
        
        for (const b of Player.bullets) {
            this.ctx.fillStyle = b.color;
            this.ctx.fillRect(b.x - b.radius, b.y - b.radius, b.radius * 2, b.radius * 2);
        }
        
        Player.draw(this.ctx);
        this.ctx.restore();

        if (this.state === 'MENU') UI.drawScreen(this.ctx, 'OCTOPUS INVADERS');
        if (this.state === 'GAMEOVER') UI.drawScreen(this.ctx, 'GAME OVER');
        if (this.state === 'PLAYING') UI.drawHUD(this.ctx);
    },

    S: 0
};

window.onload = () => Game.init();
