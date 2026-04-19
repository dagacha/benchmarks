# benchmarks
Benchmarks of various AI experiments.

## Space Shooter Benchmark

Same ~9,000-char prompt ([octopus_invaders_prompt.md](https://github.com/sudoingX/octopus-invaders/blob/main/prompts/octopus_invaders_prompt.md)), different models and hardware.

### Results

| Run | Model | Hardware | Thinking | Wall time | Decode tok/s | Lines of code | Fixes needed | Finish |
|---|---|---|---|---|---|---|---|---|
| [space-shooter](./space-shooter/) | Qwen3.6-35B-A3B (llama.cpp GGUF) | Bosgame M5 / Radeon 8060S | on | 5m 18s | ~50 | 1,470 | 2 | stop |
| [space-shooter-gemma4](./space-shooter-gemma4/) | Gemma 4 26B-A4B (llama.cpp GGUF) | Bosgame M5 / Radeon 8060S | on | 4m 16s | 40.1 | 679 | 0 | stop |
| [space-shooter-mlx-m1max](./space-shooter-mlx-m1max/) | Qwen3.6-35B-A3B (MLX 4-bit) | MacBook Pro M1 Max 64GB | on | 10m 44s | 43.7 | 2,396 | TBD | length |
| [space-shooter-mlx-m1max-notthinking](./space-shooter-mlx-m1max-notthinking/) | Qwen3.6-35B-A3B (MLX 4-bit) | MacBook Pro M1 Max 64GB | off | 3m 14s | 50.5 | 996 | TBD | stop |
| [space-shooter-gemma4-mlx-m1max](./space-shooter-gemma4-mlx-m1max/) | Gemma 4 26B-A4B (MLX 4-bit) | MacBook Pro M1 Max 64GB | off | **2m 14s** | 46.1 | 522 | TBD | stop |
