# benchmarks

AI code generation benchmarks run on various hardware configurations.

## Space Shooter Challenge: Octopus Invaders

A head-to-head comparison of different models generating a complete vertical space shooter game from a single ~9,000 character prompt ([octopus_invaders_prompt.md](https://github.com/sudoingX/octopus-invaders/blob/main/prompts/octopus_invaders_prompt.md)).

### Implementations

| Run | Model | Hardware | Thinking | Wall time | Decode tok/s | Lines | Fixes | Finish |
|-----|-------|----------|----------|-----------|--------------|-------|-------|--------|
| [`space-shooter/`](space-shooter/) | **Qwen3.6-35B-A3B** (llama.cpp GGUF) | Bosgame M5 / Radeon 8060S | on | 5m 18s | ~50 | 1,470 | 2 | stop |
| [`space-shooter-gemma4/`](space-shooter-gemma4/) | **Gemma 4 26B-A4B** (llama.cpp GGUF) | Bosgame M5 / Radeon 8060S | on | **4m 16s** | 40.1 | 679 | **0** | stop |
| [`space-shooter-gemma4-run2/`](space-shooter-gemma4-run2/) | **Gemma 4 26B-A4B** (MLX 4-bit) | Bosgame M5 / Radeon 8060S | on | TBD | ~46 | ~584 | TBD | stop |
| [`space-shooter-mlx-m1max/`](space-shooter-mlx-m1max/) | **Qwen3.6-35B-A3B** (MLX 4-bit) | MacBook Pro M1 Max 64GB | on | 10m 44s | 43.7 | 2,396 | TBD | length |
| [`space-shooter-mlx-m1max-notthinking/`](space-shooter-mlx-m1max-notthinking/) | **Qwen3.6-35B-A3B** (MLX 4-bit) | MacBook Pro M1 Max 64GB | **off** | **3m 14s** | **50.5** | 996 | TBD | stop |

### Quick Comparison (Bosgame M5 Runs)

| Metric | Qwen3.6-35B | Gemma 4 (Run 1) | Gemma 4 (Run 2) |
|--------|-------------|-----------------|-----------------|
| Parameters | 35B (3B active) | 26B (4B active) | 26B (4B active) |
| Format | GGUF Q4_K_XL | GGUF Q4_K_XL | MLX 4-bit |
| Model config | temp=0.3, reasoning=1024 | temp=1.0, temp=0.3 | temp=0.7 |
| Wall time | 5 min 18 s | **4 min 16 s** | TBD |
| Output tokens | 16,083 | 10,132 | ~5,755 |
| Lines of code | **1,470** | 679 | ~584 |
| Code blocks | 11 files | 10 files | 11 files |
| ES modules | ❌ (needed fix) | ✅ (correct) | ✅ (correct) |
| First launch | ❌ (init-order bug) | ✅ Worked | ❌ (did not work) |

### Features Across Implementations

**Common to all:**
- Pure vanilla JavaScript, no libraries or frameworks
- HTML5 Canvas rendering
- Pixel-art octopus enemies via `fillRect` grids
- 4-layer parallax background (stars, nebula, planets, comets)
- Web Audio API procedural sound effects
- Circle-to-circle collision detection
- Mouse control with smooth tracking
- Click to fire weapons

**Unique to Qwen3.6:**
- Homing missiles
- Multi-phase boss health bars
- Chromatic aberration effects
- Screen flash on damage
- Ink barrage attacks
- Damage numbers
- Powerup pickups with aura
- Combo system with 3x score multiplier (Unleash mode)

**Unique to Gemma 4:**
- Cleaner, more compact code base
- Working immediately with zero manual fixes
- Correct ES module usage from the start
- Mouse-reactive parallax depth

### Hardware Used

| Configuration | Machine | GPU | Backend |
|-------------|---------|-----|---------|
| Bosgame M5 | Ryzen AI Max+ 395, 128GB | Radeon 8060S (RDNA 3.5) | llama.cpp b8672 / MLX |
| M1 Max | MacBook Pro, 64GB | M1 Max GPU | MLX |

### Running the Games

Each implementation is self-contained. Navigate to the folder and start a local server:

```bash
cd space-shooter-gemma4/
python -m http.server 3002
```

Then open **http://localhost:3002** in your browser. A static server is required because ES modules cannot be loaded from `file://` URLs.

### Controls

| Input | Action |
|-------|--------|
| **Mouse** | Move ship (smooth lerp tracking) |
| **Left click (hold)** | Fire weapons |
| **Click** | Start game / Restart after game over |
| **ESC** | Pause / Resume (Qwen version) |

### License

See [LICENSE](LICENSE)
