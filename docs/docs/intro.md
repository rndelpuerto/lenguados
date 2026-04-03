---
sidebar_position: 1
title: 'Getting Started'
description: 'Install @lenguados/math2d and run your first code'
---

# Getting Started

**lenguados** is a TypeScript monorepo for a deterministic, extensible 2D physics engine. The core package, `@lenguados/math2d`, provides math primitives with bit-exact cross-platform results, designed for networked game lockstep and high-performance simulations.

## Installation

```bash
npm install @lenguados/math2d
```

## Quick Example

```typescript
import { Vector2, Transform2, DEG_TO_RAD } from '@lenguados/math2d';

// Static methods are pure; instance methods mutate `this`
const position = Vector2.fromValues(10, 20);
const velocity = Vector2.fromValues(3, 4);

// Allocation-free: reuse `position` as output
Vector2.add(position, velocity, position);

// Fluent instance chaining
position.add(velocity).multiplyScalar(0.5);

// Decomposed transform (Scale → Rotate → Translate)
const transform = Transform2.fromValues(5, 10, 45 * DEG_TO_RAD, 1, 1);
const worldPoint = Transform2.transformPoint(transform, position);
```

## What's Next

- [**math2d**](math2d) — Architecture, design decisions, edge cases, and audit history
- [**Contributing**](contributing) — TSDoc standard, testing strategy, and design philosophy
- [**API Reference**](api) — Auto-generated TypeDoc reference for all packages
