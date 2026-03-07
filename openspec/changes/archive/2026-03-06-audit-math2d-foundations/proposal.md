## Why

La auditoría anterior (`auditoria-math2d`) resolvió inconsistencias internas (naming, simetría, cobertura de variantes). Pero las decisiones de diseño subyacentes — valores de tolerancia, modelo de determinismo, patrones de API, estrategias de optimización, estructura algebraica — nunca fueron validadas contra fuentes externas. Cada pilar del proyecto se eligió por intuición o conveniencia, no por evidencia. Una librería matemática que aspira a grado comercial necesita que cada decisión fundacional esté respaldada por literatura científica de renombre y por las prácticas probadas de bibliotecas líderes del mercado. Sin esta validación, el proyecto corre el riesgo de propagar errores sutiles, adoptar antipatrones, o elegir tradeoffs inferiores que se solidifican conforme crece el codebase.

## What Changes

- Auditar y documentar la justificación científica de cada constante numérica (EPSILON = 1e-10, ANGLE_EPSILON = 1e-12, MIN_SAFE_DIVISOR, tolerancias de comparación), contrastando contra IEEE 754, Goldberg, Higham, y las prácticas de gl-matrix, three.js, Box2D, Rapier
- Validar la estrategia de determinismo (fdlibm polynomial kernels) contra crlibm, MPFR, Sun/Oracle fdlibm original, y los enfoques de lockstep de motores como Photon, Deterministic Lockstep (Glenn Fiedler), y RollbackNetcode
- Evaluar los patrones de API (static+instance duality, out parameter, *Like interfaces, triality, *CS variants, chaining) contra glm (C++), gl-matrix, three.js/MathUtils, Unity.Mathematics, Rapier, nalgebra, y Eigen
- Verificar la corrección algebraica de las operaciones (composición de transforms, relación Complex/Rotation2, inversas de matrices, interpolación angular) contra textos de referencia: "Geometric Algebra for Computer Science" (Dorst), "Mathematics for 3D Game Programming" (Lengyel), Lie group theory
- Analizar la arquitectura de performance (allocation avoidance via out, pre-computed CS, tree-shaking de validación, branch prediction en triality) contra V8 TurboFan optimization guides, benchmarks de gl-matrix, y Unity Burst/DOTS patterns
- Evaluar los patrones de DX (TypeScript strict mode integration, error messages, discoverability, ergonomía de API) contra las mejores prácticas de librerías TypeScript modernas (zod, effect-ts, ts-pattern) y feedback patterns de APIs numéricas (numpy, Eigen)
- **BREAKING**: Cualquier constante, convención o patrón que la auditoría demuestre insuficiente será candidato a cambio, documentando la justificación externa y el plan de migración

## Capabilities

### New Capabilities

- `numerical-foundations`: Auditoría de todas las constantes numéricas, estrategias de tolerancia, aritmética compensada, y funciones safe — validadas contra IEEE 754-2019, Goldberg ("What Every Computer Scientist Should Know About Floating-Point Arithmetic"), Higham ("Accuracy and Stability of Numerical Algorithms"), Muller et al. ("Handbook of Floating-Point Arithmetic"), y las implementaciones de gl-matrix, three.js, Box2D, Rapier
- `determinism-guarantees`: Validación del modelo de determinismo cross-platform — kernels fdlibm, política de uso de Math.\* nativo vs determinista, scope de garantías L0 — contra la implementación original de Sun/Oracle fdlibm, crlibm (INRIA), el paper de Lefèvre & Muller sobre correctly-rounded functions, y los modelos de determinismo de Photon Engine, Glenn Fiedler (Gaffer On Games), GGPO, y Rollback Netcode
- `api-design-validation`: Evaluación de cada patrón de API (static/instance duality, out parameter, *Like duck-typing, Strict/Safe/Unchecked triality, *CS variants, freeze/readonly, chaining) contra las APIs de GLM (OpenGL Mathematics), gl-matrix (Brandon Jones), three.js (Mr.doob), Unity.Mathematics (Unity DOTS), nalgebra (Rust), Eigen (C++), y Box2D (Erin Catto)
- `algebraic-correctness`: Verificación de la estructura matemática formal — grupo de rotaciones SO(2), álgebra de Lie se(2), composición de transforms, inversas, identidades, edge cases geométricos — contra Dorst et al. ("Geometric Algebra for Computer Science"), Lengyel ("Foundations of Game Engine Development Vol. 1: Mathematics"), Shoemake (quaternion interpolation), y Eberly ("Geometric Tools for Computer Graphics")
- `performance-architecture`: Análisis de las estrategias de optimización — object pooling via out, pre-computed cos/sin, tree-shaking condicional, layout de memoria, inlining hints — contra V8 Hidden Classes y TurboFan optimization (Vyacheslav Egorov), benchmarks publicados de gl-matrix, tres.js y cannon.js, y los patterns de Unity Burst compiler y Data-Oriented Design (Mike Acton)
- `dx-quality`: Evaluación de developer experience — ergonomía de TypeScript strict mode, calidad de mensajes de error, discoverability de API, coherencia de convenciones, testing patterns — contra los estándares de librerías TS exitosas (zod, drizzle-orm, tRPC), las guías de API design de Microsoft (TypeScript handbook), Google (API Design Guide), y los principios de "API Design for C++" (Reddy)

### Modified Capabilities

- `api-conventions`: Las convenciones actuales pueden requerir ajustes basados en los hallazgos de `api-design-validation` y `numerical-foundations` — particularmente en valores de tolerancia, naming patterns, y política de determinismo por defecto
- `auxiliary-api`: Los hallazgos de `numerical-foundations` pueden impactar constantes, funciones safe, y estrategias de rounding
- `core-types-api`: Los hallazgos de `algebraic-correctness` pueden revelar gaps en identidades matemáticas, composición, o edge cases
- `support-layers-api`: Los hallazgos de `determinism-guarantees` y `performance-architecture` pueden impactar la capa determinista, el sistema de validación, y las utilidades

## Impact

- **Code**: Las 6 capas de `packages/math2d/src/` — cada una sujeta a hallazgos de la auditoría. Los cambios más probables están en `auxiliary/scalar/constants.ts` (tolerancias), `deterministic/` (política de uso), `validation/` (calidad de mensajes), y los core types (corrección algebraica)
- **Tests**: Nuevos tests basados en reference values de implementaciones científicas (fdlibm, crlibm). Property-based tests reforzados con invariantes algebraicos formales (SO(2) closure, transform associativity)
- **API surface**: Potenciales breaking changes en constantes numéricas si la auditoría demuestra que los valores actuales son subóptimos. Cambios aditivos donde se identifiquen gaps
- **Bundle size**: Impacto mínimo esperado — la auditoría prioriza corrección y ergonomía sobre nuevas features
- **Deterministic guarantees**: Rollback plan: branch `pre-audit-foundations` creado antes de cualquier cambio al kernel determinista. Tests de regresión bit-exact ejecutados contra snapshot de valores de referencia antes de merge
- **Documentation**: Cada decisión de diseño quedará documentada con sus fuentes externas, creando un "decision log" que sirve como referencia permanente para contribuidores
