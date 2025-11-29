# Changelog

All notable changes to `@lenguados/math2d` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.7.0] - 2025-11-20

### Added

#### New Core Types

- `Complex` - Complex number implementation with full arithmetic support
- `Interval` - Interval arithmetic for uncertainty propagation
- `Quaternion2` - 2D quaternion representation (alternative to Rotation2)
- `Transform2` - Decomposed transform with position, rotation, and scale
- `Rotation2` - Enhanced 2D rotation using unit complex representation

#### Auxiliary Modules

- `auxiliary/scalar` - Scalar math operations (arithmetic, comparison, interpolation)
- `auxiliary/angle` - Angular math (normalization, conversion, interpolation)
- `auxiliary/numeric` - Numeric safety and precision operations

#### Performance Optimizations

- `Vector2Batch` - High-performance batch operations using TypedArrays
- Object pooling system with pre-configured pools for all core types
- Memory-efficient operations with output parameters

#### Developer Experience

- Runtime validation system with configurable modes
- Comprehensive TypeScript types with strict null checks
- Modular architecture enabling better tree-shaking

### Changed

#### Module Organization

- Library reorganized into modular structure:
  - `auxiliary/` - Low-level scalar and angular operations
  - `core/` - Core mathematical types
  - `batch/` - Batch operations
  - `pool/` - Object pooling
  - `validation/` - Runtime validation
- All functions now imported from specific modules for better tree-shaking

#### API Improvements

- Vector2 now uses auxiliary modules for all operations
- Matrix types use column-major order consistently
- All types support output parameters to reduce allocations

### Removed

#### Deprecated Methods

- `Vector2.fuzzyEquals()` - use `Vector2.equals()` with epsilon
- `Vector2.fuzzyZero()` - use `Vector2.isZero()` with epsilon
- `Vector2.distanceToSq()` - use `Vector2.distanceSq()`
- `Vector2.lengthSquared()` - use `Vector2.lengthSq()`

#### Extracted Utilities

- `parse.ts` - Will be moved to `@lenguados/math2d-utils`
- `random.ts` - Will be moved to `@lenguados/math2d-utils`

### Fixed

- Improved numerical stability in all operations
- Better handling of edge cases (NaN, Infinity, denormals)
- Consistent error handling across all modules

### Migration

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

## [0.6.0] - Previous Release

### Added

- Initial implementation of Vector2, Matrix2, Matrix3
- Basic scalar and angle utilities
- Simple numeric operations

### Known Issues

- No batch operations
- Memory allocation overhead in hot paths
- Limited type coverage
