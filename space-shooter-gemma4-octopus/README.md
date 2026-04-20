# Octopus Invaders - Gemma 4 26B One-Shot

A fast-paced, vertical space shooter built entirely with vanilla JavaScript and HTML5 Canvas. No libraries, no frameworks.

## AI-Generated

This game was generated **in a single shot** by **Gemma 4 26B** (running locally via llama.cpp on Apple Silicon with MLX).

- **Model:** gemma-4-26B-A4B
- **Prompt:** [Octopus Invaders Technical Specification](https://github.com/sudoingX/octopus-invaders/blob/main/prompts/octopus_invaders_prompt.md) (~9,000 chars)
- **Generation time:** ~3.6 minutes (9,141 tokens at ~42 tok/s)
- **Temperature:** 0.3
- **Context:** 262,144 tokens (262K)
- **Total output:** 23,020 chars across 10 files

## How to Run

1. Open a terminal in this folder
2. Start a local server:
   ```
   python -m http.server 3001
   ```
3. Open **http://localhost:3001** in your browser
4. Click to start playing

## Controls

| Input | Action |
|---|---|
| **Mouse** | Move ship (smooth lerp tracking) |
| **Left click (hold)** | Fire weapons |
| **ESC** | Pause / Resume |
| **Click** | Start game / Restart after game over |

## Features

- Pixel-art octopus enemies (small, medium, baby, boss)
- 4-layer parallax scrolling background
- Procedural audio via Web Audio API (laser, explosions, powerups)
- Full particle system (explosions, ink splatter, engine trails)
- Ship upgrade tiers every 3 levels
- Boss fights every 5 levels
- UNLEASH mode with 3x score multiplier
- Hit feedback: white flash, damage numbers

## Project Structure

```
space-shooter-gemma4-octopus/
  index.html              Entry point
  README.md               This file
  css/styles.css          Fullscreen canvas, cursor hidden
  js/
    config.js             Color palette, speeds, constants
    audio.js              Web Audio API procedural sound
    particles.js          Explosions, trails, sparks
    background.js         4-layer parallax scrolling
    enemies.js            Pixel-art octopus types, boss logic
    player.js             Ship rendering, mouse tracking, upgrades
    ui.js                 HUD, screens, counters
    game.js               Main loop, state machine, collisions
```

## Hardware Used

- **Model:** Gemma 4 26B (Q4_0 quantization, ~17GB)
- **Server:** llama.cpp with MLX backend
- **Host:** Apple Silicon (MLX optimized)
