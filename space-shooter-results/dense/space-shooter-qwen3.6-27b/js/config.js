const CONFIG = {
  // Colors
  colors: {
    bg: '#0D1117',
    cyan: '#4ECDC4',
    pink: '#FF6B9D',
    blue: '#45B7D1',
    cyanLight: '#7FFFD4',
    purple: '#A855F7',
    gold: '#FFD700',
    white: '#FFFFFF',
    green: '#39FF14',
    orange: '#FF8C00',
    red: '#FF4444',
  },

  // Player
  playerSpeed: 0.35,
  playerRadius: 20,
  playerMaxHealth: 100,

  // Bullet speeds per tier
  bulletSpeeds: [8, 10, 12, 14],

  // Enemy sizes
  enemySizes: {
    small: 36,
    medium: 48,
    baby: 20,
    boss: 150,
  },

  // Enemy health
  enemyHealth: {
    small: 10,
    medium: 25,
    baby: 5,
    boss: 200,
  },

  // Enemy speeds
  enemySpeeds: {
    small: 1.5,
    medium: 1,
    baby: 2.5,
    boss: 0.5,
  },

  // Game state
  state: 'menu',
  score: 0,
  level: 1,
  combo: 0,
  comboTimer: 0,
  enemiesKilled: 0,
  comboTimeout: 2000,

  // Screen shake
  shakeX: 0,
  shakeY: 0,
  shakeDuration: 0,
  shakeIntensity: 0,

  // Unleash mode
  unleashActive: false,
  unleashTimer: 0,
  unleashDuration: 5000,
  unleashMultiplier: 3,

  // Wave tracking
  waveActive: false,
  enemiesInWave: 0,
  waveEnemyCount: 0,
  spawnTimer: 0,

  // Fire rate
  fireRate: 150,
  lastShot: 0,
};
