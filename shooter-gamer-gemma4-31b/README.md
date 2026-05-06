# Octopus Invaders

A pixel-art space shooter created with vanilla JavaScript and HTML5 Canvas.

## How to Run
1. Navigate to the project folder.
2. Run a local server:
   ```bash
   python3 -m http.server 3001
   ```
3. Open your browser and go to: `http://localhost:3001`

## Controls
- **Mouse**: Move ship
- **Left Click**: Shoot
- **ESC**: Pause (implemented via game state)
- **Click**: Start/Restart game

## Project Structure
- `index.html`: Entry point
- `css/styles.css`: Global styles
- `js/config.js`: Game constants
- `js/audio.js`: Procedural sounds
- `js/particles.js`: Visual effects
- `js/background.js`: Parallax stars and nebula
- `js/enemies.js`: Octopus alien logic
- `js/player.js`: Ship movement and shooting
- `js/ui.js`: HUD and menus
- `js/game.js`: Main loop and collision logic
