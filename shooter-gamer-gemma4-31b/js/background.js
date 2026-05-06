/**
 * 4-layer parallax scrolling background
 */
const Background = {
    layers: [],
    
    init() {
        this.layers = [
            { name: 'stars', count: 100, speed: 0.5, size: [1, 2], color: '#FFF' },
            { name: 'nebula', count: 5, speed: 0.2, size: [100, 200], color: 'rgba(78, 205, 196, 0.1)' },
            { name: 'planets', count: 8, speed: 0.8, size: [40, 80], color: '#444' },
            { name: 'comets', count: 3, speed: 1.5, size: [2, 2], color: '#AAA' }
        ];
        
        this.entities = [];
        this.layers.forEach(layer => {
            for (let i = 0; i < layer.count; i++) {
                this.entities.push({
                    layer: layer.name,
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: 0,
                    vy: Math.random() * layer.speed + 0.1,
                    size: Math.random() * (layer.size[1] - layer.size[0]) + layer.size[0],
                    color: layer.color
                });
            }
        });
    },

    update(mouseX, mouseY) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const offsetX = (mouseX - centerX) * 0.01;
        const offsetY = (mouseY - centerY) * 0.01;

        for (const e of this.entities) {
            e.y += e.vy;
            if (e.y > window.innerHeight) {
                e.y = -e.size;
            }
            // Simple mouse-reactive depth shift
            e.x += offsetX * (e.vy * 10);
        }
    },

    draw(ctx) {
        for (const e of this.entities) {
            ctx.fillStyle = e.color;
            ctx.fillRect(e.x, e.y, e.size, e.size);
        }
    }
};