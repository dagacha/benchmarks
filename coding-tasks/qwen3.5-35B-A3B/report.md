# Qwen3.5-35B-A3B — Coding Benchmark Report
**Date:** 2026-04-15  
**Model:** `Qwen3.5-35B-A3B-UD-Q4_K_XL.gguf` (22.2 GB)  
**Hardware:** Bosgame M5 — Ryzen AI Max+ 395, Radeon 8060S (RDNA 3.5), 128 GB unified RAM  
**Backend:** llama.cpp b8672, Vulkan — port 8080, ctx 16384, 4 parallel slots, flash-attn on

---

## Results Summary

| Task | Score | Notes |
|---|---|---|
| **A — LRU Cache generation** | **18 / 18** ✅ | Perfect; used fewer tokens than Gemma, added extra input validation |
| **B — Debug async job queue** | **3 / 4** ⚠️ + **1 bonus** | Missed planted backoff bug; discovered a genuine unlisted bug |

---

## Task A — LRU Cache (Code Generation)

**Verdict:** Perfect, and notably more concise than Gemma (630 vs 1552 completion tokens). The model added unprompted improvements: capacity validation in `__init__`, an `_evict_lru` helper with an empty-cache safety guard. All 18 tests passed on first run.

---

## Task B — Async Job Queue (Debugging)

**Planted bugs found: 3 / 4**

| # | Bug | Found? |
|---|---|---|
| 1 | Mutable default `args: list = []` | ✅ |
| 2 | `asyncio.gather` not awaited | ✅ |
| 3 | Backoff `2 ** attempt` (starts 1s not 2s) | ❌ |
| 4 | `self._results` not cleared between runs | ✅ |

**Bonus bug discovered (not planted):**  
`task_done()` is called inside a `finally` block that fires even on `asyncio.TimeoutError` (empty queue poll). `task_done()` must only follow a successful `get()`. This would cause `ValueError: task_done() called too many times` and potential premature `join()` return. **This is a real, correct finding.**

**Reasoning style:** With `enable_thinking=false`, Qwen externalises its deliberation in the response body. The model visibly reconsidered "Bug 3" three times — first accepting the backoff, then questioning it, then ultimately redirecting to the `task_done` issue. This transparency is useful for understanding model confidence.

---

## Speed

| Measurement | Prefill | Decode |
|---|---|---|
| Standalone benchmark (284-token prompt, 300 gen) | **742 tok/s** | **56.2 tok/s** |
| Task A (182-token prompt, 630 gen) | **591 tok/s** | **56.0 tok/s** |
| Task B (703-token prompt, 3393 gen) | **825 tok/s** | **54.6 tok/s** |

**Typical operating range: ~54–56 tok/s decode, ~591–825 tok/s prefill**

---

---

**Note:** For comparison across all models, see the main [README.md](../../README.md).
