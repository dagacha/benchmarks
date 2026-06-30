# Qwen3.6-27B (Dense) — Task B: Debug Async Job Queue

## Planted Bugs

| # | Bug |
|---|---|
| 1 | Mutable default argument `args: list = []` |
| 2 | `asyncio.gather(*worker_tasks)` not awaited |
| 3 | Backoff `wait = 2 ** attempt` starts at 1s instead of 2s |
| 4 | `self._results` never cleared between `run()` calls |

## Model Findings

| Bug | Found? | Notes |
|---|---|---|
| 1 — Mutable default arg | ✅ | Correct, confident, fixed with None guard |
| 2 — Unawaited gather | ✅ | Correct, confident |
| 3 — Backoff off-by-one | ❌ | Missed — did not flag |
| 4 — Results accumulation | ❌ | Missed — did not flag |

**Score: 2 / 4 planted bugs found**

### Additional Observations (non-planted)

The model raised concerns beyond the 4 planted bugs:

1. **Race condition with `self._running`** — setting `_running = False` before workers finish. Valid concern but `queue.join()` ensures all items are processed first.
2. **`fn_args[0]` discards extra args** — if jobs pass multi-element tuples, only the first arg is used. Valid for general use but not exercised in the test harness.
3. **Input validation** — tuples with <2 elements would cause unpack errors.

These are reasonable observations but none match the planted bugs #3 or #4.

### Reasoning Behaviour

The model produced a thorough, well-structured analysis with 6 enumerated findings (including the 4 above plus 2 more about input handling). It was more verbose than needed — 1,247 completion tokens — and over-investigated non-planted issues while missing the two subtle planted bugs (backoff off-by-one and results accumulation).

The model correctly identified the two most obvious bugs (mutable default, unawaited gather) with high confidence and clear fixes.

## Timing

| Metric | Value |
|---|---|
| Prompt tokens | 645 |
| Completion tokens | 1,247 |
| Decode speed | **~18.6 tok/s** |
| Prefill speed | **~213.3 tok/s** |
