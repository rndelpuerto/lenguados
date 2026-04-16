---
sidebar_position: 1
title: Performance Overview
description: Performance philosophy and design patterns shared across all lenguados packages.
---

# Performance Overview

lenguados is a deterministic, extensible 2D physics engine designed for real-time applications
where math operations execute millions of times per frame. Every package in the monorepo
shares a set of performance principles that make this possible.

## Why Performance Matters

In game loops, physics simulations, and procedural generation, the inner loop is
dominated by vector arithmetic, matrix transforms, and collision queries. A 10%
regression in a function called 10 million times per frame translates to a dropped
frame. lenguados treats throughput as a first-class design constraint, not an afterthought.

## Shared Design Patterns

All lenguados packages follow these patterns to achieve consistent, predictable performance:

### Zero Allocation

Static methods accept an optional `out` parameter as the last argument. When provided,
the result is written into the existing object instead of allocating a new one. This
eliminates garbage collection pressure in hot loops.

```typescript
// Allocating — convenient for one-off use
const result = Vector2.add(a, b);

// Zero-alloc — reuses 'out' in tight loops
Vector2.add(a, b, out);
```

### Validation Tiers

Every operation that can fail offers up to three variants:

| Tier          | Suffix      | Behavior                            | When to Use                                  |
| ------------- | ----------- | ----------------------------------- | -------------------------------------------- |
| **default**   | (none)      | Validates inputs, throws on invalid | Development, correctness-first code          |
| **safe**      | `Safe`      | Validates, returns a fallback value | Production, graceful degradation             |
| **unchecked** | `Unchecked` | No validation                       | Hot loops with trusted, pre-validated inputs |

In production builds, `default` tier assertions are stripped via dead-code elimination,
making it equivalent to `unchecked` at runtime — you get safety during development and
speed in production with zero code changes.

### Pre-computed Variants (`*CS`)

Operations that internally compute `sin`/`cos` offer `*CS` variants that accept
pre-computed values. When the same angle is used across multiple operations in a loop,
computing the trigonometric pair once and passing it to all `*CS` methods avoids
redundant transcendental calls.

### Cross-Platform Determinism

Packages that require reproducible results (networked simulations, replay systems,
deterministic testing) use [fdlibm](https://www.netlib.org/fdlibm/)-based math kernels.
These produce bit-identical results across platforms at the cost of ~10-30% throughput
compared to platform-specific `Math.*` implementations.

### Dead-Code Elimination

All packages declare `"sideEffects": false` and use conditional exports
(`development` vs `default`). Bundlers strip validation code, debug logging, and
development-only branches from production builds automatically.

## How Benchmarks Are Organized

Each package maintains its own performance documentation with metrics specific to its
domain. The general performance section covers methodology and how to interpret results:

| Page                                           | What You'll Find                                                    |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| [Methodology](./methodology)                   | How benchmarks are measured: tools, statistics, controls            |
| [Interpreting Results](./interpreting-results) | How to read ops/sec, confidence intervals, tier comparisons, ratios |

## Package Performance

Each package has detailed performance analysis in its own documentation section:

- **[@lenguados/math2d](../packages/math2d/performance)** — Throughput across 300+ operations,
  tier comparisons, cross-library benchmarks vs gl-matrix, numerical accuracy analysis,
  and bundle size metrics

As more packages are added to the engine, their performance documentation will follow
the same structure.
