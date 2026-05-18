# benchmarks

AI code generation benchmarks run on various hardware configurations.

## Table of Contents

1. [Space Shooter Challenge: Octopus Invaders](#space-shooter-challenge-octopus-invaders)
2. [Coding Tasks Benchmarks](#coding-tasks-benchmarks)

---

## Space Shooter Challenge: Octopus Invaders

A head-to-head comparison of different models generating a complete vertical space shooter game from a single ~9,000 character prompt ([octopus_invaders_prompt.md](https://github.com/sudoingX/octopus-invaders/blob/main/prompts/octopus_invaders_prompt.md)).

### Implementations

#### Dense Models
| Run | Model | Hardware | Thinking | Wall time | Decode tok/s | Lines | Fixes | Finish |
|-----|-------|----------|----------|-----------|--------------|-------|-------|--------|
| [`shooter-gamer-gemma4-31b/`](space-shooter-results/dense/shooter-gamer-gemma4-31b/) | **Gemma 4 31B** | TBD | on | TBD | TBD | TBD | TBD | TBD |
| [`space-shooter-qwen3.6-27b/`](space-shooter-results/dense/space-shooter-qwen3.6-27b/) | **Qwen3.6 27B** | TBD | on | TBD | TBD | TBD | TBD | TBD |

#### MoE Models
| Run | Model | Hardware | Thinking | Wall time | Decode tok/s | Lines | Fixes | Finish |
|-----|-------|----------|----------|-----------|--------------|-------|-------|--------|
| [`space-shooter/`](space-shooter-results/moe/space-shooter/) | **Qwen3.6-35B-A3B** (llama.cpp GGUF) | Ryzen AI Max+ 395 / Radeon 8060S | on | 5m 18s | ~50 | 1,470 | 2 | stop |
| [`space-shooter-gemma4/`](space-shooter-results/moe/space-shooter-gemma4/) | **Gemma 4 26B-A4B** (llama.cpp GGUF) | Ryzen AI Max+ 395 / Radeon 8060S | on | **4m 16s** | 40.1 | 679 | **0** | stop |
| [`space-shooter-gemma4-run2/`](space-shooter-results/moe/space-shooter-gemma4-run2/) | **Gemma 4 26B-A4B** (MLX 4-bit) | Mac M1 Max | on | 2m 8s | ~46 | ~584 | TBD | stop |
| [`space-shooter-gemma4-8bit/`](space-shooter-results/moe/space-shooter-gemma4-8bit/) | **Gemma 4 26B-A4B** (MLX 8-bit) | Mac M1 Max | on | 2m 19s | ~42.7 | ~976 | **0** | stop |
| [`space-shooter-mlx-m1max/`](space-shooter-results/moe/space-shooter-mlx-m1max/) | **Qwen3.6-35B-A3B** (MLX 4-bit) | Mac M1 Max | on | 10m 44s | 43.7 | 2,396 | TBD | length |
| [`space-shooter-mlx-m1max-notthinking/`](space-shooter-results/moe/space-shooter-mlx-m1max-notthinking/) | **Qwen3.6-35B-A3B** (MLX 4-bit) | Mac M1 Max | **off** | **3m 14s** | **50.5** | 996 | TBD | stop |
| [`space-shooter-qwen35b-mlx/`](space-shooter-results/moe/space-shooter-qwen35b-mlx/) | **Qwen3.6-35B-A3B** (MLX 8-bit) | Mac M1 Max | off | 6m 10s | 31.0 | 1,063 | TBD | stop |

### Quick Comparison (All Platforms)

| Metric | Qwen3.6 (GGUF)<br>Ryzen AI Max+ 395 | Gemma 4 Run 1 (GGUF)<br>Ryzen AI Max+ 395 | Gemma 4 Run 2 (MLX)<br>M1 Max | **Gemma 4 (MLX 8-bit)**<br>Mac | Qwen3.6 (MLX)<br>M1 Max<br>thinking on | Qwen3.6 (MLX)<br>M1 Max<br>thinking off | Qwen3.6 (MLX 8-bit)<br>M1 Max<br>full prompt |
|--------|---------------------------|-----------------------------------|----------------------------|-------------------------------|--------------------------------------|--------------------------------------|--------------------------------------|
| Parameters | 35B (3B active) | 26B (4B active) | 26B (4B active) | **26B (4B active)** | 35B (3B active) | 35B (3B active) | **35B (3B active)** |
| Format | GGUF Q4_K_XL | GGUF Q4_K_XL | MLX 4-bit | **MLX 8-bit** | MLX 4-bit | MLX 4-bit | **MLX 8-bit** |
| Thinking | on | on | on | **on** | on | **off** | **off** |
| Model config | temp=0.3 | temp=1.0/0.3 | temp=0.7 | **temp=0.7** | temp=0.3 | temp=0.3 | **temp=0.3** |
| Wall time | 5 min 18 s | **4 min 16 s** | 2m 8s | **2m 19s** | 10 min 44 s | **3 min 14 s** | **6 min 10 s** |
| Decode tok/s | ~50 | 40.1 | ~46 | **~42.7** | 43.7 | **50.5** | **31.0** |
| Output tokens | 16,083 | 10,132 | ~5,755 | **5,751** | 2,396 | 996 | **9,581** |
| Lines of code | **1,470** | 679 | ~584 | **~976** | 2,396 | 996 | **1,063** |
| Code files | 11 files | 10 files | 11 files | **11 files** | TBD | TBD | **11 files** |
| ES modules | ❌ (needed fix) | ✅ (correct) | ✅ (correct) | **✅ (correct)** | ❌ (did not work) | ❌ (did not work) | **✅ (correct)** |
| First launch | ❌ (init-order bug) | ✅ Worked | ❌ (did not work) | **✅ Worked** | ❌ (did not work) | ❌ (did not work) | **❌ Crashed** |
| Finish | stop | stop | stop | **stop** | **length** (truncated) | stop | **stop** |

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
| Ryzen AI Max+ 395 | Ryzen AI Max+ 395, 128GB | Radeon 8060S (RDNA 3.5) | llama.cpp b8672 |
| M1 Max | MacBook Pro, 64GB | M1 Max GPU | MLX |

### Running the Games

Each implementation is self-contained. Navigate to the folder and start a local server:

```bash
cd space-shooter-results/moe/space-shooter-gemma4/
python -m http.server 3001
```

Then open **http://localhost:3001** in your browser. A static server is required because ES modules cannot be loaded from `file://` URLs.

### Controls

| Input | Action |
|-------|--------|
| **Mouse** | Move ship (smooth lerp tracking) |
| **Left click (hold)** | Fire weapons |
| **Click** | Start game / Restart after game over |
| **ESC** | Pause / Resume (Qwen version) |

### License

See [LICENSE](LICENSE)

---

## Coding Tasks Benchmarks

Benchmarks of local models on real-world coding tasks.

### Tasks

- **Task A** — Generate a thread-safe LRU cache from scratch (18 automated tests)
- **Task B** — Identify 4 planted bugs in an async job queue

### Results

#### Dense Models
| Model | Task A | Task B | Decode | Prefill |
|---|---|---|---|---|
| **Gemma 4 31B** | TBD | TBD | TBD | TBD |
| **Qwen3.6 27B** | TBD | TBD | TBD | TBD |

#### MoE Models
| Model | Task A | Task B | Decode | Prefill |
|---|---|---|---|---|
| **Gemma 4 26B-A4B** | 18/18 ✅ | 4/4 ✅ | ~43 tok/s | ~930 tok/s |
| **Qwen3.5-35B-A3B** | 18/18 ✅ | 3/4 + 1 bonus 🎁 | ~55 tok/s | ~720 tok/s |
| **Qwen3.6-35B-A3B** | 18/18 ✅ | 3/4 ⚠️ | ~57 tok/s | ~930 tok/s |
| **Nemotron-3-Nano-30B-A3B** | 16/18 ⚠️ | 2.5/4 ⚠️ | ~65 tok/s | ~712 tok/s |

### Structure

```
coding-tasks/
├── README.md                    # This file
├── shared/                      # Test harness and fixtures
│   ├── test_lru.py
│   └── buggy_queue.py
├── gemma-4-26B-A4B/            # Model-specific results
├── qwen3.5-35B-A3B/
├── qwen3.6-35B-A3B/
└── nemotron-3-nano-30B-A3B/
```

See [`coding-tasks/README.md`](coding-tasks/README.md) for detailed results and analysis.

---

## Repository Structure

```
benchmarks/
├── README.md                          # This file
├── LICENSE                            # MIT License
├── space-shooter-results/             # Space shooter implementations
│   ├── dense/                           # Dense model implementations
│   │   └── space-shooter*/
│   ├── moe/                             # MoE model implementations
│   │   └── space-shooter*/
│   │       ├── README.md
│   │       ├── index.html
│   │       ├── css/styles.css
│   │       └── js/*.js
└── coding-tasks/                      # Coding task benchmarks
    ├── README.md
    ├── shared/
    └── */report.md
```

---

## Quick Start

### Space Shooter Games

```bash
cd space-shooter-results/moe/space-shooter-gemma4/
python3 -m http.server 3001
# Open http://localhost:3001
```

### Coding Tasks

```bash
cd coding-tasks
python3 shared/test_lru.py  # Run LRU cache tests
```

---

## Hardware Configurations

| Configuration | CPU/GPU | RAM | Backend |
|-------------|---------|-----|---------|
| Ryzen AI Max+ 395 | Ryzen AI Max+ 395 | 128GB | llama.cpp b8672 |
| Mac M1 Max | M1 Max GPU | 64GB | MLX |

---

## License

MIT License - See [LICENSE](LICENSE)

---

*Last updated: April 2026*
