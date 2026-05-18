# Gemma 4 26B-A4B — Coding Benchmark Report
**Date:** 2026-04-15  
**Model:** `gemma-4-26B-A4B-it-UD-Q4_K_XL.gguf` (15.92 GB, re-downloaded fresh)  
**Hardware:** Bosgame M5 — Ryzen AI Max+ 395, Radeon 8060S (RDNA 3.5), 128 GB unified RAM  
**Backend:** llama.cpp b8672, Vulkan — port 8083, ctx 65536, 4 parallel slots, flash-attn on

---

## Results Summary

| Task | Score | Notes |
|---|---|---|
| **A — LRU Cache generation** | **18 / 18** ✅ | All correctness, eviction, thread-safety, O(1) tests passed |
| **B — Debug async job queue** | **4 / 4** ✅ | All bugs found; slight hesitation on backoff off-by-one |

---

## Task A — LRU Cache (Code Generation)

**Prompt:** implement a thread-safe LRU cache (doubly-linked list + hash map, O(1), `get_stats()`, `threading.Lock`)

**Verdict:** Perfect. The model produced idiomatic, clean Python on the first try:
- Sentinel head/tail nodes (correct approach for avoiding edge-case branches)
- All operations correctly lock-protected
- `get_stats()` handles zero-request division gracefully
- 10,000 `get` calls in < 50 ms ✅

---

## Task B — Async Job Queue (Debugging)

**Prompt:** find 4 planted bugs and provide a corrected version

**Bugs planted:**
1. Mutable default argument `args: list = []`
2. `asyncio.gather(*worker_tasks)` not awaited
3. Backoff `2 ** attempt` starts at 1 s instead of 2 s
4. `self._results` never cleared between `run()` calls

**Verdict:** Found all 4. Bugs 1, 2, 4 were identified confidently with accurate descriptions. Bug 3 was found but explained with some hedging — the model correctly fixed it in code (`2 ** (attempt + 1)`) while being less certain in the prose.

**Gotcha discovered:** Gemma 4 uses thinking tokens by default via `reasoning_content`. With default settings, the entire token budget gets consumed by internal reasoning before any visible output is produced. Fix: pass `chat_template_kwargs: {"enable_thinking": false}` in the request.

---

## Speed

| Measurement | Prefill | Decode |
|---|---|---|
| Standalone benchmark (286-token prompt, 300 gen) | **867 tok/s** | **47.3 tok/s** |
| Task A (194-token prompt, 1552 gen) | ~866 tok/s* | **42.0 tok/s** |
| Task B (778-token prompt, 1248 gen) | **1,007 tok/s** | **43.6 tok/s** |

\* Estimated from wall clock; Task B has exact llama.cpp timings.

**Typical operating range: ~42–44 tok/s decode, ~867–1,007 tok/s prefill**

Decode speed is slightly below the standalone benchmark figure (47 tok/s) — likely because the benchmark used a warmed-up context while these were cold runs with cache_prompt=false.

---

**Note:** For comparison across all models, see the main [README.md](../../README.md).
