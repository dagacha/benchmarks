class ParallaxLayer {
    constructor(count, speed, color, sizeRange) {
        this.count = count;
        this.speed = speed;
        this.color = color;
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * sizeRange + 1
            });
        }
    }

    update() {
        this.stars.forEach(s => {
            s.y += this.speed;
            if (s.y > window.innerHeight) {
                s.y = -10;
                s.x = Math.random() * window.innerWidth;
            }
        });
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        this.stars.forEach(s => {
            ctx.fillRect(Math.floor(s.x), Math.floor(s.y), Math.floor(s.size), Math.floor(s.size));
        });
    }
}

class Background {
    constructor() {
        this.layers = [
            new ParallaxLayer(50, 0.5, '#111', 1),
            new ParallaxLayer(30, 1.2, '#333', 2),
            new ParallaxLayer(15, 2.5, '#555', 3),
            new ParallaxLayer(5, 4.0, '#777', 4)
        ];
    }

    update() {
        this.layers.forEach(l => l.update());
    }

    draw(ctx) {
        this.layers.forEach(l => l.draw(ctx));
    }
}

const background = new Background();
