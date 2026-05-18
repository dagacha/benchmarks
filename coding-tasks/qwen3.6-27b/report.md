# Qwen3.6-27B (Dense) — Coding Task Benchmark Report

**Model:** Qwen3.6-27B-UD-Q4_K_XL.gguf (27.3B params, 17.9 GB, dense)  
**Hardware:** Bosgame M5 — Ryzen AI Max+ 395, Radeon 8060S (RDNA 3.5), 128 GB unified RAM  
**Backend:** llama.cpp (Vulkan), flash-attn on  
**Quantization:** UD-Q4_K_XL

---

## Results at a Glance

| Task | Score | Decode | Prefill | Completion Tokens |
|---|---|---|---|---|
| **Task A — LRU Cache** | **18/18** ✅ | ~26 tok/s | ~133 tok/s | 288 |
| **Task B — Bug Finding** | **2/4** ⚠️ | ~19 tok/s | ~213 tok/s | 1,247 |

---

## Head-to-Head with Previously Benchmarked MoE Models

### Task A (LRU Cache — 18 tests)

| Model | Score | Tokens | Decode (tok/s) | Prefill (tok/s) | Type |
|---|---|---|---|---|---|
| Gemma 4 26B-A4B | 18/18 ✅ | 1,552 | ~43 | ~930 | MoE 4B active |
| Qwen3.5-35B-A3B | 18/18 ✅ | 630 | ~55 | ~720 | MoE 3B active |
| Qwen3.6-35B-A3B | 18/18 ✅ | **292** | ~57 | **~930** | MoE 3B active |
| Nemotron-3-Nano-30B-A3B | 16/18 ⚠️ | 670 | **~65** | ~712 | MoE 3B active |
| **Qwen3.6-27B (dense)** | **18/18** ✅ | **288** | ~26 | ~133 | Dense 27B |

### Task B (Bug Finding — 4 planted bugs)

| Model | Planted Found | Bonus Found | Decode (tok/s) |
|---|---|---|---|
| Gemma 4 26B-A4B | **4/4** ✅ | — | ~43 |
| Qwen3.5-35B-A3B | 3/4 | ✅ real bug | ~55 |
| Qwen3.6-35B-A3B | 3/4 | ❌ | ~57 |
| Nemotron-3-Nano-30B-A3B | 2.5/4 | — | ~65 |
| **Qwen3.6-27B (dense)** | 2/4 | ❌ | ~26 |

---

## Analysis

### Strengths
- **Task A perfect score** at just 288 tokens — most token-efficient alongside Qwen3.6-35B-A3B (292)
- Clean, idiomatic `OrderedDict` implementation — no unnecessary complexity
- Correct thread safety on first try

### Weaknesses
- **Slowest decode speed** (~19-26 tok/s) — ~2-3x slower than MoE models (~43-65 tok/s). Expected: dense 27B computes all parameters per token vs. 3-4B active in MoE.
- **Task B only 2/4** — missed the backoff off-by-one and results accumulation bugs. Worst debugging score of all five models.
- Over-investigated non-planted issues in Task B while missing real planted bugs.

### Dense vs MoE Architecture Impact
On Task A (code generation), the 27B dense model matches all MoE models perfectly, suggesting code generation is a strength regardless of architecture. On Task B (debugging), the dense model performed worst — possibly because the MoE models' larger total parameter count provides more diverse reasoning paths, even with fewer active parameters per token. The throughput penalty is severe: ~26 tok/s vs. ~43-65 tok/s for MoE models, making the dense model 2-3x slower in interactive use.
