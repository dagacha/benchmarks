# Coding Task Benchmarks — Local llama.cpp Models

Benchmarks of local GGUF models (MoE and dense) on two real-world coding tasks:
- **Task A** — generate a thread-safe LRU cache from scratch (18 automated tests in `shared/test_lru.py`)
- **Task B** — identify 4 planted bugs in an async job queue (`shared/buggy_queue.py`)

**Hardware:** Bosgame M5 — Ryzen AI Max+ 395, Radeon 8060S (RDNA 3.5), 128 GB unified RAM  
**Backend:** llama.cpp b8672, Vulkan — flash-attn on, 4 parallel slots

---

## Results at a Glance

| Model | Task A | Task B | Decode | Prefill | Report |
|---|---|---|---|---|---|
| **Gemma 4 26B-A4B** (Q4_K_XL) | 18/18 ✅ | **4/4** ✅ | ~43 tok/s | ~930 tok/s | [↗](./gemma-4-26B-A4B/report.md) |
| **Qwen3.5-35B-A3B** (Q4_K_XL) | 18/18 ✅ | 3/4 + 1 bonus 🎁 | ~55 tok/s | ~720 tok/s | [↗](./qwen3.5-35B-A3B/report.md) |
| **Qwen3.6-35B-A3B** (Q4_K_XL) | 18/18 ✅ | 3/4 ⚠️ | ~57 tok/s | **~930 tok/s** 🥇 | [↗](./qwen3.6-35B-A3B/report.md) |
| **Nemotron-3-Nano-30B-A3B** (Q4_K_M) | 16/18 ⚠️ | 2.5/4 ⚠️ | **~65 tok/s** 🥇 | ~712 tok/s | [↗](./nemotron-3-nano-30B-A3B/report.md) |
| **Qwen3.6-27B** (Q4_K_XL, dense) | 18/18 ✅ | 2/4 ⚠️ | ~26 tok/s | ~133 tok/s | [↗](./qwen3.6-27b/report.md) |

---

## Head-to-Head

### Correctness

| Dimension | Gemma 4 | Qwen3.5 | Qwen3.6 MoE | Nemotron | Qwen3.6 Dense |
|---|---|---|---|---|---|
| Task A — LRU correctness | **18/18** | **18/18** | **18/18** | 16/18 | **18/18** |
| Task A — completion tokens | 1,552 | 630 | **292** 🥇 | 670 | **288** 🥇 |
| Task B — planted bugs found | **4/4** | 3/4 | 3/4 | 2/4 | 2/4 |
| Task B — bonus bugs found | — | ✅ real bug | ❌ dismissed | — | ❌ |
| Backoff off-by-one detection | ⚠️ hedged | ❌ missed | ❌ missed | ❌ not fixed | ❌ missed |

### Speed

| Dimension | Gemma 4 | Qwen3.5 | Qwen3.6 MoE | Nemotron | Qwen3.6 Dense |
|---|---|---|---|---|---|
| Decode (tok/s) | ~43 | ~55 | ~57 | **~65** 🥇 | ~26 |
| Prefill (tok/s) | ~930 | ~720 | **~930** 🥇 | ~712 | ~133 |
| Model size on disk | 15.92 GB | 22.2 GB | 20.82 GB | — | 17.9 GB |
| Architecture | MoE 4B active | MoE 3B active | MoE 3B active | MoE 3B active | **Dense 27B** |

### Qwen3.5 vs Qwen3.6 (direct comparison)

| | Qwen3.5 | Qwen3.6 | Delta |
|---|---|---|---|
| Task A tokens | 630 | **292** | **−54%** |
| Decode | ~55 tok/s | ~57 tok/s | +4% |
| Prefill | ~720 tok/s | **~930 tok/s** | **+29%** |
| File size | 22.2 GB | **20.82 GB** | −6% |
| Task B bonus bug | ✅ found | ❌ dismissed | regression |
| Verbosity | Low | Higher | regression |

---

## Rankings

| Category | 🥇 | 🥈 | 🥉 | 4th | 5th |
|---|---|---|---|---|---|
| Code generation correctness | Gemma 4 = Qwen3.5 = Qwen3.6 MoE = Qwen3.6 Dense | — | — | — | Nemotron |
| Debugging accuracy | Gemma 4 | Qwen3.5 ≈ Qwen3.6 MoE | Nemotron | Qwen3.6 Dense | — |
| Decode throughput | Nemotron | Qwen3.6 MoE | Qwen3.5 | Gemma 4 | Qwen3.6 Dense |
| Prefill throughput | Gemma 4 ≈ Qwen3.6 MoE | — | Qwen3.5 ≈ Nemotron | — | Qwen3.6 Dense |
| Token efficiency (Task A) | Qwen3.6 Dense ≈ Qwen3.6 MoE | — | Qwen3.5 | Nemotron | Gemma 4 |

---

## Recommendations by Use Case

- **Interactive coding assistant** — **Qwen3.6**. Best overall balance: correct code in fewest tokens, fast decode (~57 tok/s), and excellent prefill. Upgrade from Qwen3.5 with smaller file size.
- **Long-prompt / RAG** — **Gemma 4 or Qwen3.6** (tied on prefill ~930 tok/s). Gemma wins on debugging thoroughness; Qwen3.6 wins on token efficiency.
- **High-throughput batch generation** — **Nemotron**. Fastest decode at ~65 tok/s, but verify output: most error-prone of the four.
- **Deepest debugging** — **Gemma 4**. Only model to catch all 4 planted bugs.
- **Most token-efficient code generation** — **Qwen3.6-27B (dense)** or **Qwen3.6-35B-A3B (MoE)**. Both produce correct code in ~288-292 tokens. The MoE version is 2-3x faster.
- **Pair any with a second pass** for debugging tasks involving subtle numeric off-by-ones — none of the models reliably caught the backoff bug on first try.
- **Dense vs MoE tradeoff** — The 27B dense model matches MoE on code generation correctness but is 2-3x slower and performs worse on debugging. MoE models are generally preferred for local inference.

---

## Notes on Reproducing

All models default to thinking-token mode (`reasoning_content`). Without disabling, the full `max_tokens` budget can be consumed by silent reasoning before any visible output. Pass in the request body:

```json
{ "chat_template_kwargs": { "enable_thinking": false } }
```

Qwen3.6 is a vision model (requires `--mmproj mmproj-F16.gguf`) but vision features were not used in these tasks.

Also: llama.cpp's `--flash-attn` flag needs a value (`on`/`off`/`auto`) in recent builds.

---

## Layout

```
benchmarks/coding-tasks/
├── README.md                              (this file)
├── shared/
│   ├── test_lru.py                        (18-test harness for Task A)
│   └── buggy_queue.py                     (Task B input with planted bugs)
├── gemma-4-26B-A4B/
│   ├── lru_generated.py                   (generated LRU cache, imported by test_lru.py)
│   ├── task_a.md, task_b.md
│   ├── task_b_analysis.md, task_b_full_output.md
│   └── report.md
├── gemma-4-26B-A4B-local-endpoint/        (variant run via local MLX endpoint)
│   └── report-local-endpoint.md
├── qwen3.5-35B-A3B/
│   ├── task_a.md, task_b.md, report.md
├── qwen3.6-35B-A3B/
│   ├── task_a.md, task_b.md, report.md
├── nemotron-3-nano-30B-A3B/
│   ├── task_a.md, task_b.md, report.md
└── qwen3.6-27b/
    ├── task_a.md, task_b.md, report.md
```
