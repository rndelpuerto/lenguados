# Determinism Guarantees

## Overview

`@lenguados/math2d` provides deterministic mathematical operations through the `DeterministicMath` class for scenarios requiring reproducible results.

## Guarantee Levels

| Level  | Name                  | Guarantee                           | Status      |
| ------ | --------------------- | ----------------------------------- | ----------- |
| **L0** | Cross-Platform Exact  | Bit-identical across all JS engines | ✅ Default  |
| **L1** | Engine-Consistent     | Same results within the same engine | ✅ Fallback |
| **L2** | Invocation-Consistent | Same results in same invocation     | ✅ Always   |

## L0 Implementation (Default)

### Trigonometry (sin/cos)

Uses **precomputed tables** from `trig-tables.ts`:

- **131,072 sin/cos values** stored as constants
- Generated offline for reproducibility
- Bit-exact across V8, SpiderMonkey, JavaScriptCore
- Linear interpolation between entries

### Square Root (sqrt)

Uses **Fast Inverse Square Root** (Quake III algorithm):

- Bit manipulation via `BigUint64Array`
- Magic constant `0x5FE6EB50C7B537A9n`
- Newton-Raphson refinement (3 iterations by default)
- No dependency on `Math.sqrt`

### Arc Tangent (atan2)

Uses **CORDIC-like algorithm**:

- Iterative coordinate rotation
- Converges to ~1e-10 precision
- No dependency on `Math.atan2`

```typescript
import { DeterministicMath } from '@lenguados/math2d';

// L0 deterministic operations
const sin = DeterministicMath.sin(angle);
const cos = DeterministicMath.cos(angle);
const root = DeterministicMath.sqrt(value);
const angle = DeterministicMath.atan2(y, x);
```

## L1 Fallback

For custom table sizes, values are generated at runtime using `Math.sin/cos`:

```typescript
DeterministicMath.configure({ tableSize: 4096 }); // L1 only
```

> **Note:** L1 is consistent within the same JS engine but may produce
> slightly different results across V8, SpiderMonkey, and JavaScriptCore.

## Configuration Options

| Option           | Default | Description                          |
| ---------------- | ------- | ------------------------------------ |
| `tableSize`      | 65536   | Lookup table entries (power of 2)    |
| `sqrtIterations` | 3       | Newton-Raphson refinement iterations |

```typescript
DeterministicMath.configure({
 tableSize: 4096, // Smaller table, less memory
 sqrtIterations: 2, // Fewer iterations, less precision
});
```

## Constants

| Constant          | Value   | Usage                     |
| ----------------- | ------- | ------------------------- |
| `TRIG_TABLE_SIZE` | 131,072 | L0 precomputed table size |
| `ANGLE_EPSILON`   | 1e-12   | Near-zero angle threshold |
| `EPSILON`         | 1e-10   | General float comparison  |

## When to Use

| Use Case                  | Recommended Level |
| ------------------------- | ----------------- |
| Replay systems            | L0 or L1          |
| Multiplayer lockstep      | L0 (required)     |
| Deterministic tests       | L1 (sufficient)   |
| Single-platform games     | L1                |
| Cross-browser consistency | L0                |
