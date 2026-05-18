# Octopus Invaders

A space shooter game where you battle pixelated octopus aliens invading from deep space.

## How to Run

```bash
python3 -m http.server 3001
```

Then open http://localhost:3001 in your browser.

## Controls

- **Mouse** - Move your ship
- **Left Click (hold)** - Fire weapons
- **ESC** - Pause / Resume

## Enemy Types

- **Small Octopus** (pink) - Basic grunt, moves in sine wave patterns
- **Medium Octopus** (blue) - Shoots back at you, splits into 2 babies on death
- **Baby Octopus** (cyan) - Fast but fragile, spawned by medium octopi
- **Boss Octopus** (purple) - Appears every 5 levels, has tentacle barrage attacks

## Features

- Pixel-art octopus enemies rendered with grid-based fillRect
- 4-layer parallax scrolling background (stars, nebulae, planets, comets)
- Ship upgrade system (4 tiers, upgrades every 3 levels)
- Combo multiplier system
- Unleash mode powerup (5-second spread beam frenzy)
- Procedural audio (laser, explosions, powerups, boss warning)
- Screen shake and hit feedback effects
- Full particle system (explosions, ink splatter, engine trails, sparks)

## Project Structure

```
space-shooter/
  index.html          - Entry point, canvas setup, script imports
  css/styles.css      - Fullscreen canvas styling
  js/
    config.js         - All tuning constants and color palettes
    audio.js          - Procedural Web Audio API sounds
    particles.js      - Particle system (explosions, trails, sparks)
    background.js     - 4-layer parallax scrolling background
    enemies.js        - Pixel octopus enemies, wave spawning, boss logic
    player.js         - Ship rendering, mouse tracking, weapons, upgrades
    ui.js             - HUD, start screen, game over screen
    game.js           - Main game loop, state machine, collision detection
```
