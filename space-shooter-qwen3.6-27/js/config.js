/*
 * config.js - All tuning constants, color palettes, speeds, sizes.
 * Single source of truth for game configuration.
 */
const CONFIG = {
  // Colors
  bg: '#0D1117',
  cyan: '#4ECDC4',
  pink: '#FF6B9D',
  blue: '#45B7D1',
  cyanLight: '#7FFFD4',
  purple: '#C084FC',
  orange: '#FF8C00',
  yellow: '#FFD700',
  green: '#39FF14',
  white: '#FFFFFF',
  gray: '#3A3F47',
  red: '#FF3333',
  darkRed: '#8B0000',

  // Player
  shipRadius: 20,
  shipSpeed: 0.35,
  maxHealth: 100,
  invincibleTime: 1500,

  // Bullets
  bulletSpeeds: { 1: 8, 2: 10, 3: 12, 4: 14 },
  bulletWidths: { 1: 3, 2: 4, 3: 5, 4: 6 },
  fireRate: { 1: 200, 2: 160, 3: 120, 4: 90 },
  spreadCount: { 1: 1, 2: 2, 3: 3, 4: 5 },
  spreadAngle: { 1: 0, 2: 0.15, 3: 0.25, 4: 0.35 },

  // Enemy sizes
  enemySizes: { small: 36, medium: 48, baby: 20, boss: 150 },
  enemyHealth: { small: 1, medium: 3, baby: 1, boss: 50 },
  enemySpeed: { small: 1.5, medium: 1, baby: 2.5, boss: 0.5 },
  enemyColors: { small: '#FF6B9D', medium: '#45B7D1', baby: '#7FFFD4', boss: '#C084FC' },
  enemyScores: { small: 10, medium: 25, baby: 5, boss: 500 },

  // Wave
  waveEnemyBase: 5,
  waveEnemyGrowth: 2,
  spawnInterval: 400,
  bossEvery: 5,

  // Unleash
  unleashDuration: 5000,
  unleashScoreMult: 3,
  unleashBulletSpeed: 16,
  unleashBulletWidth: 8,

  // Particles
  engineTrailRate: 1,
  explosionParticleCount: 25,
  inkParticleCount: 15,
  sparkCount: 4,

  // Background
  starCount: 80,
  nebulaCount: 5,
  planetMaxCount: 2,

  // Screen shake
  shakeDecay: 0.9,
  shakeSmall: 3,
  shakeMedium: 5,
  shakeLarge: 10,
  shakeBoss: 15,
  shakePlayerHit: 4,

  // Game state
  state: 'menu',
  score: 0,
  level: 1,
  combo: 0,
  comboTimer: 0,
  comboDecayTime: 2000,
  enemiesKilled: 0,
};
