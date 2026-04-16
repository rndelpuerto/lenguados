---
sidebar_position: 3
title: Interpreting Results
description: How to read benchmark metrics — ops/sec, confidence intervals, outliers, tier comparisons, cross-library ratios, and DX analysis.
---

# Interpreting Results

This guide explains how to read the metrics shown on package performance pages.
No prior statistics background is assumed.

## Throughput (ops/sec)

The primary metric. It measures how many times an operation can execute per second.
Higher is better.

- **Millions (M)**: Typical for arithmetic operations (add, subtract, multiply)
- **Hundreds of millions**: Simple component access, scalar operations
- **Tens of millions**: Complex operations (eigendecomposition, matrix inverse)

The number is derived from the **median** execution time, not the mean, because
benchmark timing distributions are right-skewed (occasional slow outliers). The median
is more stable.

## Confidence Intervals (CI 95%)

Every measurement includes a **95% confidence interval** shown as `[lo, hi]`.
This means: if the benchmark were repeated many times, 95% of the measured medians
would fall within this range.

**How to read it:**

- Narrow CI (e.g., `[4.8, 5.2]` for a 5.0 ns median) → stable, trustworthy measurement
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

When comparing against another library (e.g., gl-matrix):

| Ratio             | Meaning                                |
| ----------------- | -------------------------------------- |
| **> 1.025**       | lenguados is faster (a "win")          |
| **0.975 - 1.025** | Effectively equivalent (a "tie")       |
| **< 0.975**       | The other library is faster (a "loss") |

The **2.5% equivalence threshold** accounts for measurement noise. Differences smaller
than 2.5% are not reliably reproducible across runs.

**Geometric mean** provides a single aggregate score across all operations in a comparison.
It weights each operation equally regardless of absolute throughput, so a 2x win on a
fast operation counts the same as a 2x win on a slow one.

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

Verifies that production builds contain **zero** assertion code, `DEV_MODE` checks, or
`NODE_ENV` references. If any are found, dead-code elimination is not working correctly.

## ULP (Unit in the Last Place)

ULP measures floating-point accuracy for deterministic math kernels:

- **0 ULP**: The result is the closest representable `float64` to the true mathematical answer
- **1 ULP**: Off by one bit in the 52-bit significand — the smallest possible rounding error
- **2+ ULP**: Unusual for elementary functions; worth investigating

For packages using fdlibm deterministic kernels, 1 ULP accuracy across all operations
means the cross-platform determinism guarantee introduces **no meaningful accuracy loss**
compared to native `Math.*`.

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

# Regenerate documentation data
npm run tools:bench:docs-data
```

Results are stored as JSON in `tools/benchmark/results/` with full statistical data
and environment metadata for reproducibility.
