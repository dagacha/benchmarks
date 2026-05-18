# Octopus Invaders

A space shooter game built with vanilla JavaScript and Canvas. Pixel-art octopus aliens invade from space - defend Earth!

## How to Run

```bash
cd space-shooter
python3 -m http.server 3001
```

Then open http://localhost:3001 in your browser.

## Controls

- **MOUSE** - Move ship
- **LEFT CLICK (hold)** - Fire weapons
- **ESC** - Pause/Resume

## Features

- 4 types of pixel-art octopus enemies (small, medium, baby, boss)
- 4 ship upgrade tiers that improve every 3 levels
- Boss fights every 5 levels with multi-pattern attacks
- Combo multiplier system for consecutive kills
- Unleash mode power-up for devastating spread attacks
- Full particle system (explosions, ink splatter, engine trails, sparks)
- 4-layer parallax background with mouse-reactive depth
- Procedural audio (laser, explosions, powerups, boss warning)
- Screen shake and hit feedback

## Project Structure

```
space-shooter/
  index.html          -- Entry point, canvas setup, script imports
  css/styles.css      -- Fullscreen canvas, overlay screens
  js/
    config.js         -- All tuning constants, colors, speeds, sizes
    game.js           -- Main game loop, state machine, collision detection
    player.js         -- Ship rendering, mouse tracking, weapons, upgrades
    enemies.js        -- Octopus enemies, wave spawning, boss logic, bullets
    particles.js      -- Explosion, ink, trails, sparks, powerup effects
    background.js     -- 4-layer parallax (stars, nebula, planets, comets)
    ui.js             -- HUD, start/gameover screens, score display
    audio.js          -- Web Audio API procedural sound generation
```
