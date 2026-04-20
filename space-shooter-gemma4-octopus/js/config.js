const CONFIG = {
    COLORS: {
        PLAYER_TIER_1: '#00ffff', // Cyan
        PLAYER_TIER_2: '#00ff00', // Green
        PLAYER_TIER_3: '#ffd700', // Gold
        PLAYER_TIER_4: '#ffffff', // White
        UNLEASH: '#ff00ff',      // Magenta/Pink
        ENEMY_SMALL: '#ff00ff',  // Neon Pink
        ENEMY_MEDIUM: '#00ccff', // Electric Blue
        ENEMY_BABY: '#00ffff',   // Cyan
        ENEMY_BOSS: '#9900ff',   // Purple
        BULLET: '#ffffff',
        INK: '#003366'
    },
    PLAYER: {
        LERP_SPEED: 0.35,
        BASE_SPEED: 5,
        UNLEASH_DURATION: 5000, // ms
        UNLEASH_MULTIPLIER: 3
    },
    ENEMIES: {
        SMALL_SPEED: 2,
        MEDIUM_SPEED: 1.5,
        BABY_SPEED: 4,
        BOSS_SPEED: 0.8
    },
    UPGRADES: {
        TIER_INTERVAL: 3 // Every 3 levels
    }
};

// Global helper for pixel-art rendering
// Since we can't use arc(), we use a grid of rects
const PixelArt = {
    draw(ctx, x, y, size, pattern, color) {
        ctx.fillStyle = color;
        pattern.forEach(p => {
            ctx.fillRect(
                Math.floor(x + p[0] * size), 
                Math.floor(y + p[1] * size), 
                size, 
                size
            );
        });
    }
};
