# lenguados

[![npm version](https://img.shields.io/npm/v/@lenguados/math2d.svg)](https://www.npmjs.com/package/@lenguados/math2d)
[![Benchmarks](https://img.shields.io/github/actions/workflow/status/rndelpuerto/lenguados/bench.yml?branch=main&label=benchmarks)](https://github.com/rndelpuerto/lenguados/actions/workflows/bench.yml)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@lenguados/math2d)](https://bundlephobia.com/package/@lenguados/math2d)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

> Deterministic, zero-allocation 2D math library for games and simulations

**lenguados** is a TypeScript monorepo for a deterministic, extensible 2D physics engine. The core `@lenguados/math2d` package provides math primitives with bit-exact cross-platform results, designed for networked game lockstep and high-performance simulations.

## Highlights

- **Cross-platform determinism** -- fdlibm-based math kernels guarantee bit-exact results across all JS engines, OSes, and CPUs
- **Zero-allocation patterns** -- static methods with `out` parameter reuse objects in hot paths, minimizing GC pressure
- **Tree-shakeable validation** -- dev-only assertions are eliminated from production bundles at the library build step; conditional exports select the development or production artifacts
- **Strict/Safe/Unchecked triality** -- three error-handling tiers per fallible operation to match your safety needs
- **TypeScript-first** -- strict mode, `Readonly*Like` structural interfaces, full TSDoc coverage

## Quick Start

```bash
npm install @lenguados/math2d
```

```typescript
import { Vector2, Transform2, DEG_TO_RAD } from '@lenguados/math2d';

// Create vectors -- static methods are pure, instance methods mutate `this`
const position = Vector2.fromValues(10, 20);
const velocity = Vector2.fromValues(3, 4);

// Allocation-free hot path: reuse `position` as output
Vector2.add(position, velocity, position); // position is now (13, 24)

// Fluent instance chaining
position.add(velocity).multiplyScalar(0.5);

// Rotation via decomposed transform (Scale -> Rotate -> Translate)
const transform = Transform2.fromValues(5, 10, 45 * DEG_TO_RAD, 1, 1);
const worldPoint = Transform2.transformPoint(transform, position);
```

## Packages

| Package                                    | Description                                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------------------ |
| [`@lenguados/math2d`](packages/math2d)     | Core 2D math library -- Vector2, Matrix2/3, Rotation2, Complex, Interval, Transform2 |
| [`@lenguados/common`](packages/common)     | Shared utilities                                                                     |
| [`@lenguados/examples`](packages/examples) | Interactive demos and visual tests                                                   |

## Development

```bash
git clone https://github.com/rndelpuerto/lenguados.git
cd lenguados
nvm install   # installs 24.14.1 from .nvmrc
nvm use
npm install
npm run build
npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full contributor guide.

## Documentation

- [math2d README](packages/math2d/README.md) -- API overview, key concepts, performance tips
- [Architecture](ARCHITECTURE.md) -- monorepo topology and package relationships
- [math2d Architecture](packages/math2d/ARCHITECTURE.md) -- layered architecture and design patterns
- [Contributing](CONTRIBUTING.md) -- setup, workflow, commit conventions, math2d API conventions
- [Changelog](CHANGELOG.md) -- version history
- [Docs Site](https://rndelpuerto.github.io/lenguados/docs/) -- deep-dives, design decisions, edge cases, and API reference

## Stability

lenguados is **pre-1.0** software and follows [Semantic Versioning](https://semver.org/spec/v2.0.0.html) `0.x` semantics:

- **Minor releases (`0.X.0`) may contain breaking changes.** Every breaking change is documented in the [Changelog](CHANGELOG.md).
- **Patch releases (`0.x.Y`)** are backward-compatible bug fixes.
- Only the latest `0.x` release receives security fixes — see the [Security Policy](SECURITY.md) for supported versions and the private vulnerability-reporting process.

## License

Released under the [Apache License 2.0](LICENSE). You must keep the `LICENSE` and `NOTICE` files in any distribution or derivative work.
