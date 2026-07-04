---
sidebar_position: 3
title: Interpreting Results
description: How to read benchmark metrics — ops/sec, confidence intervals, outliers, tier comparisons, cross-library ratios, and DX analysis.
kind: benchmark-comparison
---

# Interpreting Results

This guide explains how to read the metrics shown on package performance pages.
No prior statistics background is assumed.

## Throughput (ops/sec)

The primary metric. It measures how many times an operation can execute per second.
Higher is better.

- **Billions (G)**: Trivial scalar kernels (clamp, lerp, step)
- **Hundreds of millions (M)**: Simple component arithmetic (add, dot, multiplyScalar)
- **Tens of millions**: Transcendental kernels and matrix operations (sin, atan2, inverse, eigendecompose)
- **Millions**: Heavy composite operations (slerp, transform conversions)

The number is derived from the **mean** execution time (`ops/sec = 1e9 / mean_ns`), following established conventions in micro-benchmark reporting. The mean is the natural reciprocal for throughput and the correct estimand for bootstrap confidence intervals and hypothesis tests.

## Confidence Intervals (CI 95%)

Every measurement records a **95% confidence interval** as `[lo, hi]` in the stored
summary data (`tools/benchmark/results/`); the documentation tables currently surface
ops/sec, median, and sample counts. The interval means: if the benchmark were repeated
many times, 95% of the measured means would fall within this range. Computed via
non-parametric percentile bootstrap (Efron & Tibshirani, 1993) — no normality
assumption required.

**How to read it:**

- Narrow CI (e.g., `[4.8, 5.2]` for a 5.0 ns mean) → stable, trustworthy measurement
- Wide CI (e.g., `[3.0, 7.0]`) → noisy measurement, likely due to system load

If two operations have overlapping CIs, their performance difference is **not statistically significant**.

## Outlier Percentage

The percentage of samples flagged as outliers by Tukey's method. Outliers are timing
samples that fall far outside the typical range, usually caused by OS interrupts,
garbage collection, or CPU frequency scaling.

**How to read it:**

- **< 5%**: Normal. The measurement is clean.
- **5-15%**: Elevated. The median is still reliable, but the mean may be skewed.
- **> 15%**: High system noise. Consider re-running on a quieter machine.

## Validation Tier Comparisons

Operations with `Safe` and `Unchecked` variants show grouped bar charts comparing
throughput across tiers:

| Tier          | What It Measures                            |
| ------------- | ------------------------------------------- |
| **default**   | Full validation active (development builds) |
| **safe**      | Validation + fallback return (all builds)   |
| **unchecked** | No validation at all                        |

**Speedup ratio** (e.g., `1.15x`) shows how much faster `unchecked` is compared to
`default`. In production builds, `default` assertions are eliminated, so the
real-world speedup is typically smaller than the development-mode measurement shows.

## Cross-Library Comparison Ratios

When comparing against an external library (see dedicated comparison pages linked from each package's performance index):

| Ratio             | Meaning                                |
| ----------------- | -------------------------------------- |
| **> 1.025**       | lenguados is faster (a "win")          |
| **0.975 - 1.025** | Effectively equivalent (a "tie")       |
| **< 0.975**       | The other library is faster (a "loss") |

The **2.5% equivalence threshold** is a classification convention for a single run:
differences below it are within the measurement resolution of that run, so they are
reported as ties rather than wins or losses. It is **not** a reproducibility bound —
run-to-run variance on a shared machine is far larger than 2.5%, because thermal state,
background load, and JIT/GC state shift between runs.

**Geometric mean** provides a single aggregate score across all operations in a comparison.
It weights each operation equally regardless of absolute throughput, so a 2x win on a
fast operation counts the same as a 2x win on a slow one. Like every wall-clock figure,
it is a single-run estimate: read it as a band, not a point. Back-to-back runs of the
identical build on the same machine can shift the aggregate by double-digit percentages,
so only shifts well beyond that envelope indicate a real change.

## Bundle Size & DX Metrics

### Raw vs Gzip

- **Raw bytes**: Uncompressed file size. Relevant for parse time.
- **Gzip bytes**: Compressed size. Relevant for network transfer.

Gzip sizes are what users actually download. A 3 KB gzip library is comparable to a
small SVG icon.

### Tree-Shaking Reduction

Shows how much of the library a bundler can eliminate when only a subset of types is imported.
A **reduction of 80%+** means the library is highly modular — importing one type does not
pull in unrelated code.

### Assertion Elimination

Verifies that production builds eliminate assertion function bodies and call sites via
dead-code elimination (DCE). Assertion function names may still appear as empty export
stubs — this is expected, since they are part of the public API surface.

## ULP (Unit in the Last Place)

ULP measures floating-point accuracy for deterministic math kernels:

- **0 ULP**: The result is the closest representable `float64` to the true mathematical answer
- **1 ULP**: Off by one bit in the 52-bit significand — the smallest possible rounding error
- **2+ ULP**: Measured on tangent, inverse-trigonometric, and composite functions, where
  rounding compounds across internal steps; for sin, cos, log, exp, and hypot, more than
  1 ULP is worth investigating

The fdlibm deterministic kernels target 1 ULP or less for the primitive trigonometric,
exponential, and logarithmic functions; composite functions such as `pow` may reach
single-digit ULP. At these magnitudes the cross-platform determinism guarantee introduces
**no meaningful accuracy loss** compared to native `Math.*` — see each package's accuracy
page for the measured per-function maxima.

## Running Benchmarks Locally

All benchmark commands are available from the repository root:

```bash
# Full benchmark suite (all packages)
npm run tools:bench:all

# Performance benchmarks only
npm run tools:bench

# Filter by suite or tier
npm run tools:bench -- --suite=vector2
npm run tools:bench -- --tier=unchecked

# Cross-library comparison
npm run tools:bench:compare

# Stress tests (numerical accuracy)
npm run tools:bench:stress

# DX analysis (bundle size, tree-shaking)
npm run tools:bench:dx

# Bundle-size budget gate (fails when a budgeted import exceeds its gzip budget)
npm run tools:bench:size

# Generate summaries (consumed by docs build)
npm run tools:bench:summarize
```

Results are stored as JSON in `tools/benchmark/results/` with full statistical data
and environment metadata for reproducibility.
