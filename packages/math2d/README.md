# @lenguados/math2d

Pure mathematical primitives and operations for 2D graphics and physics.

## Features

- 🚀 **High Performance** - Minimal allocations, cache-friendly operations, batch processing
- 🔧 **Modular Design** - Import only what you need for optimal bundle size
- 🎯 **Type Safe** - Full TypeScript support with strict typing
- 🔢 **Deterministic** - Reproducible results across platforms
- 🛡️ **Robust** - Careful handling of edge cases and numerical precision
- 🧪 **Well Tested** - Comprehensive test coverage with property-based testing

## Installation

```bash
npm install @lenguados/math2d
```

```bash
yarn add @lenguados/math2d
```

```bash
pnpm add @lenguados/math2d
```

## Quick Start

```typescript
import { Vector2, Matrix3, Transform2 } from '@lenguados/math2d';

// Create vectors
const position = new Vector2(100, 50);
const velocity = new Vector2(10, 0);

// Vector operations
const newPos = position.add(velocity);
const distance = position.distanceTo(newPos);
const normalized = velocity.normalize();

// Transformations
const transform = new Transform2();
transform.position.set(100, 50);
transform.rotation = Math.PI / 4; // 45 degrees
transform.scale.set(2, 2);

// Apply transform to a point
const point = new Vector2(10, 10);
const transformed = transform.transformPoint(point);

// Matrix operations
const matrix = Matrix3.fromTransform(
 new Vector2(100, 50), // translation
 Math.PI / 4, // rotation
 new Vector2(2, 2), // scale
);
```

## Core Types

### Vector2

2D vector with x and y components.

```typescript
const v = new Vector2(3, 4);
const length = v.length(); // 5
const normalized = v.normalize(); // Vector2(0.6, 0.8)
const rotated = v.rotate(Math.PI / 2); // Vector2(-4, 3)
```

### Complex

Complex numbers for advanced 2D rotations and transformations.

```typescript
const z = new Complex(3, 4);
const magnitude = z.magnitude(); // 5
const conjugate = z.conjugate(); // Complex(3, -4)
const product = z.multiply(conjugate); // Complex(25, 0)
```

### Matrix2 & Matrix3

2x2 and 3x3 matrices for linear and affine transformations.

```typescript
const rot = Matrix2.fromRotation(Math.PI / 4);
const scale = Matrix2.fromScale(new Vector2(2, 3));
const combined = rot.multiply(scale);

const affine = Matrix3.fromTransform(
 new Vector2(100, 50), // translation
 Math.PI / 4, // rotation
 2, // uniform scale
);
```

### Transform2

Decomposed 2D transform for intuitive manipulation.

```typescript
const transform = new Transform2();
transform.position.set(100, 50);
transform.rotation = Math.PI / 4;
transform.scale.set(2, 2);

// Combine transforms
const parent = new Transform2();
const child = new Transform2();
const combined = parent.multiply(child);
```

## Performance Features

### Batch Operations

Process arrays of vectors efficiently with SIMD-friendly operations:

```typescript
import { Vector2Batch } from '@lenguados/math2d/batch';

const batch = new Vector2Batch(1000);
batch.fill(new Vector2(1, 0));

// Rotate all vectors at once
batch.rotate(Math.PI / 4);

// Normalize all vectors
const normalized = batch.normalize();

// Apply a 2×2 matrix or full Transform2 to every vector
const matrix = Matrix2.fromRotation(Math.PI / 3);
batch.transformMatrix(matrix);

const transform = Transform2.fromValues(3, -1, Math.PI / 4, 2, 0.5);
batch.transformTransform(transform);

// Apply packed Transform2 batches without extra allocations
const packed = Transform2Batch.toFloat32Array([transform]);
batch.transformByPackedTransforms(packed);

// Get statistics
const min = batch.min(); // Minimum values
const max = batch.max(); // Maximum values
const mean = batch.mean(); // Average vector
```

### SIMD Placeholders

Prepare for WebAssembly SIMD kernels without breaking determinism:

```typescript
import { SimdDetector, Vector2BatchSimd } from '@lenguados/math2d/batch';

if (SimdDetector.detect()) {
 Vector2BatchSimd.register({
  rotate(source, angle, out) {
   // Plug in your SIMD-accelerated routine
   return false; // Return true when handled to skip scalar fallback
  },
 });
}
```

If no SIMD implementation is registered (or the runtime lacks support), all batch operations automatically fall back to the scalar reference paths.

### Profiling Helpers

Collect timing data and produce summaries for hot paths:

```typescript
import { MeasurementCollector, measure } from '@lenguados/math2d/utils';

// Instrument a critical section
const collector = new MeasurementCollector<void>();
collector.record(measure('integrate', () => stepSimulation()));

// Summaries can be logged or fed into your telemetry pipeline
for (const formatted of collector.formatSummaries()) {
 console.log(formatted);
}
```

### Object Pooling

Reduce garbage collection pressure with built-in object pools:

```typescript
import { TypePools, withVector2, withVector2s } from '@lenguados/math2d/pool';

// Use temporary vectors from pool
const length = withVector2((v) => {
 v.set(3, 4);
 return v.length();
});

// Multiple temporary vectors
const result = withVector2s(3, (v1, v2, v3) => {
 v1.set(1, 0);
 v2.set(0, 1);
 v3.copy(v1).add(v2);
 return v3.clone(); // Return a copy
});

// Manual pool management
const v = TypePools.vector2.acquire();
// ... use vector ...
TypePools.vector2.release(v);

// Non-throwing acquisition and trimming
const maybeVector = TypePools.tryVector2();
TypePools.trimAll(64); // Keep at most 64 preallocated instances per pool
```

### Microbenchmarks

Run the built-in microbenchmark harness (powered by `tinybench`) to compare batch operations:

```bash
npm run benchmark
```

The script outputs ops/sec and mean execution time for the most common `Vector2Batch` transforms, helping you track performance regressions during refactors.

## Auxiliary Functions

Import specialized math functions as needed:

```typescript
// Scalar operations
import { clamp, lerp, smoothStep } from '@lenguados/math2d/auxiliary/scalar';

const clamped = clamp(value, 0, 1);
const interpolated = lerp(start, end, 0.5);
const smooth = smoothStep(0, 1, t);

// Angular operations
import { normalizeRadians, lerpAngle } from '@lenguados/math2d/auxiliary/angle';

const angle = normalizeRadians(angle); // [-PI, PI]
const interpolated = lerpAngle(startAngle, endAngle, 0.5);

// Numeric safety
import { safeDiv, safeSqrt } from '@lenguados/math2d/auxiliary/numeric';

const ratio = safeDiv(numerator, denominator); // Handles division by zero
const length = safeSqrt(x * x + y * y); // Handles negative values
```

## Validation and Debugging

Enable runtime validation for development:

```typescript
import { setValidationConfig, ValidationMode } from '@lenguados/math2d/validation';

// Enable strict validation in development
if (process.env.NODE_ENV === 'development') {
 setValidationConfig({ mode: ValidationMode.STRICT });
}

// Custom error handling
setValidationConfig({
 logger: (message) => {
  console.error('Math validation failed:', message);
 },
});

// Debug utilities
import { ValidationDebug } from '@lenguados/math2d/validation';

ValidationDebug.enableHistory();
// ... run your code ...
ValidationDebug.logStats(); // View error statistics
```

## Examples

### Physics Simulation

```typescript
class Particle {
 position = new Vector2();
 velocity = new Vector2();

 update(dt: number, gravity: Vector2) {
  // Update velocity
  this.velocity.add(gravity.scale(dt, tempVec));

  // Update position
  this.position.add(this.velocity.scale(dt, tempVec));
 }
}

// Use batch operations for many particles
const positions = new Vector2Batch(1000);
const velocities = new Vector2Batch(1000);

// Update all particles at once
velocities.addScalar(gravity.scale(dt));
positions.add(velocities.scale(dt));
```

### Graphics Transformation

```typescript
// Camera system
class Camera {
 transform = new Transform2();

 worldToScreen(worldPos: Vector2): Vector2 {
  return this.transform.inverse().transformPoint(worldPos);
 }

 screenToWorld(screenPos: Vector2): Vector2 {
  return this.transform.transformPoint(screenPos);
 }
}

// Scene graph
class Node {
 localTransform = new Transform2();
 worldTransform = new Transform2();

 updateWorldTransform(parent?: Node) {
  if (parent) {
   parent.worldTransform.multiply(this.localTransform, this.worldTransform);
  } else {
   this.worldTransform.copy(this.localTransform);
  }
 }
}
```

## API Documentation

Full API documentation is available at [lenguados.dev/math2d](https://lenguados.dev/math2d).

## Migration from v0.6.x

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache-2.0 License - see the [LICENSE](../../LICENSE) file for details.
