# Octopus Invaders — Gemma 4 run on M1 Max MLX (thinking disabled)

A vertical space shooter built entirely from one prompt, by **Gemma 4 26B-A4B** (Unsloth 4-bit MLX quant) running locally on an Apple M1 Max with thinking mode disabled. Vanilla JavaScript, HTML5 Canvas, no libraries.

## AI-Generated

The entire game was produced **in a single shot** from the same ~9,000-char prompt: [octopus_invaders_prompt.md](https://github.com/sudoingX/octopus-invaders/blob/main/prompts/octopus_invaders_prompt.md).

- **Model:** `unsloth/gemma-4-26b-a4b-it-UD-MLX-4bit` (Unsloth dynamic 4-bit MLX, ~14 GB)
- **Backend:** mlx_vlm 0.4.4 server, Apple MLX framework
- **Server flags:** `--max-kv-size 32768 --prefill-step-size 512 --port 8080`
- **Request params:** `temperature=0.3, max_tokens=28000, enable_thinking=false`
- **Reasoning:** disabled via `enable_thinking=false`

### Generation stats

| Metric | Value |
|---|---|
| Wall time | **2 min 14 s** (134 s) |
| Prefill speed | 376.8 tok/s |
| Decode speed | **46.1 tok/s** |
| Prompt tokens | 2,257 |
| Completion tokens | 5,903 |
| Finish reason | `stop` (clean termination) |
| Peak memory | **17.0 GB** |
| Code produced | **522 lines across 9 files** |

### Manual fixes needed

Not yet tested. Output included as-is for benchmark comparison.

## Head-to-head: M1 Max, same hardware, different models

| | **Gemma 4 MLX (thinking off)** | **Qwen3.6 MLX (thinking off)** |
|---|---|---|
| Model | gemma-4-26b-a4b-it | Qwen3.6-35B-A3B |
| Active parameters | 4 B | 3 B |
| Wall time | **2m 14s** | 3m 14s |
| Completion tokens | 5,903 | 9,526 |
| Decode tok/s | 46.1 | **50.5** |
| Output lines of code | 522 | 996 |
| Peak memory | **17.0 GB** | 22.3 GB |
| Finish reason | stop (clean) | stop (clean) |

Gemma 4 completed the fastest and used the least memory, but produced the least code. Qwen3.6 generated nearly twice as much in 1 minute more. Both terminated cleanly with thinking disabled.

## Head-to-head: Gemma 4 cross-platform

| | **M1 Max MLX (thinking off)** | **Bosgame llama.cpp (thinking on)** |
|---|---|---|
| Machine | Apple M1 Max, 64 GB | Ryzen AI Max+ 395, 128 GB |
| GPU | Apple M1 Max (Metal) | Radeon 8060S (Vulkan) |
| Backend | mlx_vlm 0.4.4 | llama.cpp b8672 |
| Wall time | **2m 14s** | 4m 16s |
| Completion tokens | 5,903 | 10,132 |
| Decode tok/s | **46.1** | 40.1 |
| Output lines of code | 522 | 679 |
| Peak memory | 17.0 GB | — |
| Manual fixes | TBD | 0 |
| Finish reason | stop (clean) | stop (clean) |

The M1 Max runs Gemma 4 faster than the Bosgame desktop, with 15% higher decode speed. The Bosgame run had reasoning enabled which accounts for some of the extra output tokens.

## How to Run

1. Open a terminal in this folder.
2. Start a local server:
   ```
   python -m http.server 3005
   ```
3. Open **http://localhost:3005** in your browser.

## Project Structure

```
space-shooter-gemma4-mlx-m1max/
  index.html              Entry point
  README.md               Generated README
  css/                    (styles inlined in index.html)
  js/
    config.js             Colors, speeds, sizes, all tuning constants
    audio.js              Web Audio API procedural SFX
    particles.js          Explosions, trails, sparks
    background.js         4-layer parallax (stars, nebula, planets, comets)
    enemies.js            Pixel-art octopus types, wave spawning, boss logic
    player.js             Ship rendering, mouse tracking, weapons, tiers
    ui.js                 HUD, start/gameover screens, health bar, combo
    game.js               Main loop, state machine, collisions
```

## Hardware

- **Machine:** Apple MacBook Pro — M1 Max, 64 GB unified RAM
- **Backend:** mlx_vlm 0.4.4 (Apple MLX framework)
