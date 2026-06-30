# Qwen3.6-27B (Dense) — Task A: LRU Cache Generation

## Prompt
Thread-safe LRU cache with O(1) get/put, `get_stats()`, `threading.Lock`.

## Model Output Highlights
- Used `collections.OrderedDict` — idiomatic and clean
- `move_to_end()` for O(1) recency updates, `popitem(last=False)` for O(1) eviction
- Lock wraps all public methods individually (fine-grained)
- Very concise: **288 completion tokens** — most token-efficient, alongside Qwen3.6-35B-A3B (292)

## Test Results (18/18 passed)

| Test | Result |
|---|---|
| get existing key | ✅ |
| get missing key | ✅ |
| evict LRU on overflow | ✅ |
| non-evicted key still present | ✅ |
| newly inserted key present | ✅ |
| get updates recency | ✅ |
| accessed key survives eviction | ✅ |
| update existing key value | ✅ |
| capacity-1 eviction | ✅ |
| capacity-1 new key | ✅ |
| stats has 'hits' | ✅ |
| stats has 'misses' | ✅ |
| stats has 'hit_rate' | ✅ |
| stats hit count correct | ✅ |
| stats miss count correct | ✅ |
| stats hit_rate correct | ✅ |
| thread safety — no exceptions (8 threads, 500 ops each) | ✅ |
| 10k gets under 50ms (O(1) check) | ✅ |

**Score: 18 / 18**

## Timing

| Metric | Value |
|---|---|
| Prompt tokens | 208 |
| Completion tokens | 288 |
| Decode speed | **~26.2 tok/s** |
| Prefill speed | **~133.2 tok/s** |

Most token-efficient model tested, alongside Qwen3.6-35B-A3B.
