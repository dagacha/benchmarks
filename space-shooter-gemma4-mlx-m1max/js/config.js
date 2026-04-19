/** @file config.js - All tuning constants and game settings */
const CONFIG = {
    COLORS: {
        BG: '#0D1117',
        PLAYER_BASE: '#2C3E50',
        PLAYER_GLOW: '#4ECDC4',
        SMALL_OCTO: '#FF00FF', // Pink
        MED_OCTO: '#00FFFF',   // Blue
        BABY_OCTO: '#00FFCC',  // Cyan
        BOSS_OCTO: '#9B59B6',  // Purple
        EXPLOSION: '#2ECC71',
        UNLEASH: '#FFFFFF'
    },
    PLAYER: {
        LERP: 0.35,
        BASE_HEALTH: 100,
        START_RADIUS: 20
    },
    ENEMY: {
        SMALL: { size: 36, hp: 1, speed: 2, color: '#FF00FF' },
        MEDIUM: { size: 48, hp: 3, speed: 1.5, color: '#00FFFF' },
        BABY: { size: 20, hp: 1, speed: 4, color: '#00FFCC' },
        BOSS: { size: 150, hp: 100, speed: 0.5, color: '#9B59B6' }
    },
    BULLETS: {
        TIER_1: 8,
        TIER_2: 10,
        TIER_3: 12,
        TIER_4: 14
    },
    UI: {
        FONT: 'monospace',
        FONT_SIZE: '20px'
    }
};
