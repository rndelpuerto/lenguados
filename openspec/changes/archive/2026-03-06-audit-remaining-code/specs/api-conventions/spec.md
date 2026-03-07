## MODIFIED Requirements

### Requirement: Core type modules re-export their type guards consistently

All 7 core type modules (vector2, complex, rotation2, interval, matrix2, matrix3, transform2) SHALL re-export their corresponding `is*Like` type guard from `../types/`. This ensures type guards are discoverable via the core type's import path.

#### Scenario: All 7 core types re-export type guards

- **WHEN** the exports of each core type module are inspected
- **THEN** each SHALL include a re-export of its `is*Like` function:
  - `vector2.ts` → `export { isVector2Like }`
  - `complex.ts` → `export { isComplexLike }`
  - `rotation2.ts` → `export { isRotation2Like }`
  - `interval.ts` → `export { isIntervalLike }`
  - `matrix2.ts` → `export { isMatrix2Like }`
  - `matrix3.ts` → `export { isMatrix3Like }`
  - `transform2.ts` → `export { isTransform2Like }`

#### Scenario: Type guards are accessible from core barrel

- **WHEN** `import { isVector2Like } from './core'` is used
- **THEN** the import SHALL resolve correctly (re-exported through core/index.ts)
