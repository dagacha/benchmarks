/**
 * Game configuration and tuning constants
 */
const CONFIG = {
    COLORS: {
        SPACE: '#0D1117',
        PLAYER_GLOW: '#4ECDC4',
        PLAYER_BODY: '#2C3E50',
        ENEMY_SMALL: '#FF00FF', // Neon Pink
        ENEMY_MEDIUM: '#00FFFF', // Electric Blue
        ENEMY_BABY: '#00FFFF', // Cyan
        ENEMY_BOSS: '#A020F0', // Purple
        BULLET_CYAN: '#00FFFF',
        BULLET_GREEN: '#00FF00',
        BULLET_GOLD: '#FFD700',
        BULLET_WHITE: '#FFFFFF',
        HIT_WHITE: '#FFFFFF',
        TEXT_COLOR: '#FFFFFF',
        ACCENT: '#4ECDC4'
    },
    PLAYER: {
        RADIUS: 20,
        LERP_FACTOR: 0.35,
        MAX_HEALTH: 100,
        SPEED: 5
    },
    BULLETS: {
        TIER_1_SPEED: 8,
        TIER_2_SPEED: 10,
        TIER_3_SPEED: 12,
        TIER_4_SPEED: 14
    },
    ENEMIES: {
        SMALL_SIZE: 36,
        MEDIUM_SIZE: 48,
        BABY_SIZE: 20,
        BOSS_SIZE: 150,
        SINE_AMPLITUDE: 50,
        SINE_FREQUENCY: 0.05
    },
    GAME: {
        FPS: 60,
        SHAKE_DECAY: 0.9,
        UNLEASH_DURATION: 5000,
        BOSS_INTERVAL: 5
    }
};