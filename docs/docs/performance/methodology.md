---
sidebar_position: 2
title: Methodology
description: How lenguados benchmarks are measured — tools, statistical methods, and quality controls.
kind: benchmark-comparison
---

# Benchmark Methodology

This page explains how lenguados performance data is collected, analyzed, and reported. Understanding the methodology helps interpret the numbers on other performance pages.

## Measurement Tool

All performance benchmarks are measured with the **mitata** JavaScript micro-benchmarking library (MIT license; project home: [github.com/evanwashere/mitata](https://github.com/evanwashere/mitata)). mitata handles warm-up, iteration count selection, and high-resolution timing automatically.

Each benchmark operation runs for a minimum wall-clock duration to accumulate enough samples for statistical analysis (typically 1,000 to 100,000 or more samples per operation).

## Statistical Analysis

### Confidence Intervals

Every reported metric includes a **95% bootstrap confidence interval**: a non-parametric percentile bootstrap of the mean with **2,000 resamples**, computed over a stride subsample of at most 10,000 timing samples (a cost bound that spans the full measurement window). Bootstrap CI makes no assumptions about the underlying distribution, which is critical for benchmarks where timing distributions are typically right-skewed.

### Outlier Detection

Outliers are detected via **Tukey's method** with two thresholds:

- **Mild outliers**: values beyond 1.5x IQR from Q1/Q3
- **Severe outliers**: values beyond 3x IQR from Q1/Q3

Outlier percentages are reported alongside each measurement. High outlier rates (above 5%) indicate system noise — the median is more reliable than the mean in such cases.

### Regression Detection

Baseline comparisons apply **Welch's t-test** with two requirements:

1. **Statistical significance**: p-value < 0.05
2. **Practical significance**: effect size > 2% of baseline mean

Both conditions must be met to flag a regression. This avoids false positives from
statistically significant but practically irrelevant differences.

## Environment Controls

### Build Modes

Benchmarks run against **production builds** (assertions stripped, minified) by default.
Development builds are used only for correctness verification (dev/prod parity checks).

### Determinism

All benchmarks use the **fdlibm** deterministic math kernel by default, ensuring
cross-platform reproducibility. Native `Math.*` comparisons are run separately
when measuring the cost of determinism.

### Allocation Verification

Zero-allocation claims are verified empirically:

1. Force garbage collection (`--expose-gc`)
2. Run 100,000 iterations
3. Measure heap growth via `process.memoryUsage()`
4. Report bytes-per-operation

Any operation claiming zero allocation must show 0 bytes/op.

## Cross-Library Comparison Fairness

When comparing against external libraries (see the dedicated comparison pages listed on the package performance indexes):

- Same hardware, same process, same session
- Same input data for equivalent operations
- Production builds for both libraries
- Warm-up runs before measurement
- **Paired adjacent execution**: each operation's benchmarks for both libraries are registered adjacently, so every compared pair runs under near-identical machine state — separated blocks would let thermal and load drift hit the libraries differentially
- **2.5% equivalence threshold**: operations within 2.5% of each other are reported as ties, not wins or losses — a single-run classification convention; run-to-run variance is larger (see [Interpreting Results](./interpreting-results))

## Reproducibility

All benchmark results include:

- **Timestamp**: When the benchmark ran
- **Node.js version**: Runtime version
- **CPU model**: Processor and core count
- **OS**: Platform and kernel version
- **Commit hash**: Exact code version

Results are stored as JSON with full statistical data. Summary files committed to the
repository allow documentation to render without re-running benchmarks.

## References

- Kalibera, T. and Jones, R. (2013). _Rigorous Benchmarking in Reasonable Time_.
  Proceedings of the 2013 ACM SIGPLAN International Symposium on Memory Management (ISMM '13).
- Marr, S. and Daloze, T. (2016). _Cross-Language Compiler Benchmarking: Are We Fast Yet?_
  Proceedings of the Dynamic Languages Symposium (DLS).
- Tukey, J.W. (1977). _Exploratory Data Analysis_. Addison-Wesley.

## Running Benchmarks Locally

```bash
# Full benchmark suite
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
