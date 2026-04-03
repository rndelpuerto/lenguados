## Why

After 20+ iteraciones de auditoría con resultados inconsistentes, se identificó que el problema raíz es la falta de una revisión archivo-por-archivo anclada en la filosofía de la librería. Los agentes anteriores razonaban sobre descripciones en vez de leer código, aplicaban estándares externos (glMatrix, Three.js) en vez de los principios propios, y escalaban horizontalmente (más agentes) en vez de verticalmente (más profundidad por agente).

Esta revisión establece una arquitectura de agentes por capas donde cada agente es experto en UNA capa y revisa CADA archivo de esa capa contra los pilares de la librería. El resultado es un documento de mejoras concretas, verificables y priorizadas.

## What Changes

This is a **review-only** change. No code modifications. The output is a documented improvement roadmap.

- **Review every file** in `packages/math2d/src/` (16 auxiliary + 1 deterministic + 7 core + 1 types + 1 validation + 4 utils = ~30 files)
- **Document findings** as categorized, prioritized recommendations
- **Verify consistency** across all 7 core types using cross-cutting pattern analysis
- **Challenge every recommendation** against the library's 3 pillars: Completeness, Performance, Safety

### Agent Architecture (Recommended)

```
┌─────────────────────────────────────────────────────┐
│  LAYER AGENTS (depth-first, one agent per layer)    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Agent L0: Deterministic Kernels Expert             │
│  ├── deterministic-kernels.ts                       │
│  └── Criteria: fdlibm fidelity, layer isolation,    │
│      edge cases, circular dependency                │
│                                                     │
│  Agent L1a: Scalar Utilities Expert                 │
│  ├── auxiliary/scalar/*.ts (4 files)                │
│  └── Criteria: JSDoc accuracy, naming, edge cases   │
│                                                     │
│  Agent L1b: Angle Utilities Expert                  │
│  ├── auxiliary/angle/*.ts (5 files)                 │
│  └── Criteria: JSDoc examples, math correctness     │
│                                                     │
│  Agent L1c: Numeric Utilities Expert                │
│  ├── auxiliary/numeric/*.ts (4 files)               │
│  └── Criteria: safety contracts, compensation       │
│                                                     │
├─────────────────────────────────────────────────────┤
│  CORE TYPE AGENTS (one agent per type)              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Agent C1: Vector2 Expert                           │
│  ├── core/vector2.ts + test/core/vector2.*.ts       │
│  └── Criteria: API completeness, missing getters,   │
│      test coverage                                  │
│                                                     │
│  Agent C2: Complex Expert                           │
│  ├── core/complex.ts + test/core/complex.*.ts       │
│  └── Criteria: missing component-wise ops,          │
│      addScalar/subtractScalar, JSDoc                │
│                                                     │
│  Agent C3: Matrix2 Expert                           │
│  ├── core/matrix2.ts + test/core/matrix2.*.ts       │
│  └── Criteria: smoothStep consistency, naming       │
│                                                     │
│  Agent C4: Matrix3 Expert                           │
│  ├── core/matrix3.ts + test/core/matrix3.*.ts       │
│  └── Criteria: same as C3 + affine structure        │
│                                                     │
│  Agent C5: Interval Expert                          │
│  ├── core/interval.ts + test/core/interval.*.ts     │
│  └── Criteria: missing component-wise ops,          │
│      algebraic completeness                         │
│                                                     │
│  Agent C6: Rotation2 Expert                         │
│  ├── core/rotation2.ts + test/core/rotation2.*.ts   │
│  └── Criteria: conjugated getter, inversed naming,  │
│      JSDoc accuracy                                 │
│                                                     │
│  Agent C7: Transform2 Expert                        │
│  ├── core/transform2.ts + test/core/transform2.*.ts │
│  └── Criteria: composite patterns, negate absence   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  SUPPORT LAYER AGENTS                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Agent S1: Types & Validation Expert                │
│  ├── types/index.ts + validation/assert.ts          │
│  └── Criteria: interface-class match, assertions    │
│                                                     │
│  Agent S2: Utils Expert                             │
│  ├── utils/*.ts (4 files)                           │
│  └── Criteria: parse round-trip, random coverage,   │
│      *Like interface usage                          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  CROSS-CUTTING AGENTS                               │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Agent X1: Pattern Consistency Auditor              │
│  ├── Reads ALL 7 core type files                    │
│  └── Builds complete pattern tables across types    │
│      (negate triple, inverse triple, clone/copy,    │
│       equality, component-wise ops, factory         │
│       methods, predicates, etc.)                    │
│                                                     │
│  Agent X2: Barrel & Dependency Auditor              │
│  ├── index.ts files + package.json exports          │
│  └── Verifies: no circular deps, correct exports,   │
│      tree-shaking, conditional exports              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ADVERSARIAL LAYER                                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Agent A1: Philosophy Guardian                      │
│  ├── Reads: all agent reports                       │
│  ├── Reads: CLAUDE.md, math2d-patterns.md,          │
│  │   README.md, all archived OpenSpec proposals     │
│  └── Challenges every recommendation against:       │
│      1. Completeness over minimalism                │
│      2. Performance (hot-path, zero-alloc)          │
│      3. Safety (three-tier validation)              │
│      4. Determinism                                 │
│      5. "Better than any on the market"             │
│                                                     │
│  Agent A2: DX Advocate                              │
│  ├── Reads: all agent reports                       │
│  └── Ensures no recommendation:                     │
│      - Removes useful convenience                   │
│      - Adds verbosity without benefit               │
│      - Breaks discoverability                       │
│      - Creates naming confusion                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

**Total: 16 agents.** Each has a SMALL, WELL-DEFINED scope. Each reads ACTUAL CODE.

### Key Difference From Previous Architectures

| Previous (failed)                     | This (recommended)                   |
| ------------------------------------- | ------------------------------------ |
| 10+ agents all reviewing "everything" | 1 agent per file/layer               |
| Reasoned from descriptions            | Must read actual code                |
| Applied external library standards    | Must cite library's own philosophy   |
| Broad and shallow                     | Deep and focused                     |
| Reported "done" without verification  | Must show evidence (line numbers)    |
| Scaled horizontally (more agents)     | Scales vertically (deeper per agent) |

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

_None._ This is a review-only change. Recommendations may lead to future changes.

## Impact

- **No code changes.** Output is a prioritized improvement document.
- **Deliverable:** `findings.md` with categorized, prioritized recommendations organized by layer, each with:
  - File path and line number
  - Current behavior
  - Recommended change
  - Justification citing library philosophy
  - Priority (P0-P3)
  - Breaking change? (yes/no)
