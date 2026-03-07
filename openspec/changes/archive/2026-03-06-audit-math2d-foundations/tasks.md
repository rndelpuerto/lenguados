## 1. FASE 1 — Auditoría de deterministic/ (L0, capa base)

- [x] 1.1 Leer línea a línea `src/deterministic/deterministic-kernels.ts` — inventario completo de funciones, coeficientes, argument reduction, config toggle, Safe variants
- [x] 1.2 Contrastar coeficientes polinómicos de sin/cos contra fdlibm C source original (Sun/Oracle e_sin.c, e_cos.c, k_sin.c, k_cos.c)
- [x] 1.3 Contrastar atan2, sqrt, exp, log, pow contra fdlibm C source (e_atan2.c, e_sqrt.c, e_exp.c, e_log.c, e_pow.c)
- [x] 1.4 Verificar accuracy de cada kernel: ejecutar tests con 1000+ sample points (incluyendo 0, PI/4, PI/2, PI, TAU, denormals, near-overflow) y documentar máxima desviación en ULPs
- [x] 1.5 Investigar cross-platform determinism: documentar qué operaciones Math.\* son IEEE 754 deterministic, cuáles no, y evidencia de divergencia entre V8/SpiderMonkey/JSC para Math.sin, Math.cos, Math.atan2
- [x] 1.6 Evaluar `config.useNativeMath` toggle: completeness, correctness, Web Worker implications, pattern en engines de referencia (Rapier, Photon)
- [x] 1.7 Clasificar cada función del library como MUST/MAY/SHOULD-NOT use deterministic kernel, citando IEEE 754-2019 secciones
- [x] 1.8 Evaluar sinCos: performance vs separate calls en JS, interface SinCos vs tuple vs out, benchmark con y sin fdlibm
- [x] 1.9 Trazar mapa de consumidores: qué módulos de auxiliary/ y core/ importan desde deterministic/ — listar cada función consumida y por quién, evaluar si la dependencia es directa o vía re-export
- [x] 1.10 Producir diagnóstico por entidad (✅/⚠️/🗑️/➕) para todo deterministic/
- [x] 1.11 Documentar reglas inferidas del kernel determinista y mapa de sinergia completo con auxiliary/ y core/

## 2. FASE 1 — Auditoría de auxiliary/scalar/ (constantes, aritmética, comparación, interpolación)

- [x] 2.1 Leer línea a línea `src/auxiliary/scalar/constants.ts` — verificar cada constante contra IEEE 754 double precision, Math.\*, y Wolfram Alpha
- [x] 2.2 Evaluar EPSILON (1e-10) contra gl-matrix (1e-6), three.js, Box2D, Rapier, Eigen; producir justificación o recomendación de cambio citando Higham error analysis
- [x] 2.3 Evaluar ANGLE_EPSILON (1e-12) contra precisión de output de fdlibm kernels; documentar si es más tight de lo necesario
- [x] 2.4 Evaluar MIN_SAFE_DIVISOR, ITERATIVE_TOLERANCE, SMALLEST_NORMAL; verificar contra IEEE 754-2019 section 3.4
- [x] 2.5 Evaluar GOLDEN_RATIO, GOLDEN_RATIO_CONJUGATE — ¿se usan en el codebase? ¿son math-core o utility? Trazar todos los consumidores
- [x] 2.6 Leer línea a línea `src/auxiliary/scalar/arithmetic.ts` — inventario de funciones, triality coverage, edge cases
- [x] 2.7 Contrastar scalar arithmetic contra gl-matrix, GLSL spec (clamp, mix, step, smoothstep), three.js MathUtils
- [x] 2.8 Trazar composición interna de arithmetic.ts: ¿qué funciones dentro del módulo usan a otras? ¿Hay fachadas internas (e.g., saturate → clamp)? ¿El overhead de la delegación es aceptable en hot path?
- [x] 2.9 Leer línea a línea `src/auxiliary/scalar/comparison.ts` — evaluar nearEquals, relativeEquals, tolerance strategy
- [x] 2.10 Contrastar comparison functions contra Eigen's isApprox, nalgebra's relative_eq, three.js MathUtils
- [x] 2.11 Leer línea a línea `src/auxiliary/scalar/interpolation.ts` — evaluar lerp, inverseLerp, smoothStep, smootherStep
- [x] 2.12 Contrastar interpolation contra GLSL mix/smoothstep spec, three.js lerp, Unity Mathf.Lerp
- [x] 2.13 Trazar mapa de consumidores de scalar/: qué funciones de scalar son usadas por angle/, numeric/, core/, y otros módulos — identificar primitivas críticas que son building blocks del sistema
- [x] 2.14 Producir diagnóstico por entidad (✅/⚠️/🗑️/➕) para todo auxiliary/scalar/
- [x] 2.15 Clasificar cada función por categoría de tolerancia (geometric, angular, safety, iterative)
- [x] 2.16 Leer línea a línea `src/auxiliary/scalar/index.ts` — verificar qué se exporta, qué se omite, si hay re-exports selectivos

## 3. FASE 1 — Auditoría de auxiliary/angle/ (conversión, normalización, operaciones, interpolación, unwrapping)

- [x] 3.1 Leer línea a línea `src/auxiliary/angle/conversion.ts` — verificar exactitud de conversiones, precisión de constantes derivadas, uso de constantes de scalar/
- [x] 3.2 Leer línea a línea `src/auxiliary/angle/normalization.ts` — evaluar rangos [-PI, PI) vs (-PI, PI], precision en boundaries, funciones a eliminar
- [x] 3.3 Contrastar normalización contra GLSL, Godot, three.js MathUtils, Box2D; documentar convención de industria
- [x] 3.4 Leer línea a línea `src/auxiliary/angle/operations.ts` — evaluar sinCos, angleDifference, angleDistance, angleBisector, isAngleBetween, clampAngle, angleFromVectors
- [x] 3.5 Trazar composición interna de angle/: ¿qué funciones dentro de angle/ usan a otras de angle/? ¿operations.ts usa normalization.ts? ¿interpolation.ts usa operations.ts? Documentar cada delegación y su costo
- [x] 3.6 Trazar dependencias angle/ → scalar/ y angle/ → deterministic/: qué constantes, funciones escalares y kernels usa cada función angular — ¿la dependencia es lógica? ¿hay oportunidades de composición perdidas?
- [x] 3.7 Contrastar angle operations contra three.js MathUtils, Godot angle functions, Unity Mathf.DeltaAngle
- [x] 3.8 Leer línea a línea `src/auxiliary/angle/interpolation.ts` — evaluar lerpAngle shortest-path, smoothStepAngle; trazar si delegan a scalar/interpolation (smoothStep) o reimplementan
- [x] 3.9 Contrastar angular interpolation contra Shoemake SLERP (2D), Godot lerp_angle, three.js MathUtils.lerp
- [x] 3.10 Leer línea a línea `src/auxiliary/angle/unwrapping.ts` — evaluar unwrapAngles, AngleUnwrapper streaming; trazar dependencias con normalization
- [x] 3.11 Leer línea a línea `src/auxiliary/angle/index.ts` — verificar re-exports, SinCos interface location
- [x] 3.12 Trazar consumidores de angle/: qué core types usan funciones angulares (Vector2.rotate, Rotation2.fromAngle, etc.) — identificar primitivas angulares que son building blocks de core
- [x] 3.13 Producir diagnóstico por entidad (✅/⚠️/🗑️/➕) para todo auxiliary/angle/

## 4. FASE 1 — Auditoría de auxiliary/numeric/ (guards, rounding, safety, wrapping)

- [x] 4.1 Leer línea a línea `src/auxiliary/numeric/guards.ts` — evaluar predicados, isDenormal contra IEEE 754
- [x] 4.2 Leer línea a línea `src/auxiliary/numeric/rounding.ts` — evaluar roundToInt banker's rounding, roundToPlaces, snapToGrid
- [x] 4.3 Contrastar rounding contra Math.round behavior, banker's rounding standard, GLSL round
- [x] 4.4 Leer línea a línea `src/auxiliary/numeric/safety.ts` — evaluar cada Safe function y su fallback value; trazar qué usa de scalar/ y deterministic/
- [x] 4.5 Contrastar safety fallbacks contra Box2D (clamp/skip/assert), Rapier (zero vector), gl-matrix (NaN propagation)
- [x] 4.6 Validar neumaierSum contra Neumaier 1974 paper, robustSum contra Kahan 1965, compensatedProduct contra Ogita/Rump/Oishi 2005
- [x] 4.7 Leer línea a línea `src/auxiliary/numeric/wrapping.ts` — evaluar flooredMod triality; trazar si duplica lógica con scalar/arithmetic mod
- [x] 4.8 Leer línea a línea `src/auxiliary/numeric/index.ts` — verificar re-exports, potenciales duplicaciones con scalar/
- [x] 4.9 Trazar composición intra-numeric: ¿qué funciones dentro de numeric/ usan a otras? ¿safety.ts usa guards.ts? ¿rounding.ts usa wrapping.ts?
- [x] 4.10 Trazar consumidores de numeric/: qué core types y otros módulos usan funciones numéricas — identificar cuáles son building blocks vs cuáles son standalone utilities
- [x] 4.11 Producir diagnóstico por entidad (✅/⚠️/🗑️/➕) para todo auxiliary/numeric/

## 5. FASE 1 — Auditoría de core/ (Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3, Transform2)

- [x] 5.1 Leer línea a línea `src/core/vector2.ts` — inventario completo, simetría static/instance, triality, \*CS variants, edge cases
- [x] 5.2 Trazar composición de Vector2: qué funciones de auxiliary/ y deterministic/ usa cada método — para cada delegación documentar: compone desde (módulo/función), es fachada de (alternativa más eficiente), costo de indirección
- [x] 5.3 Contrastar Vector2 API contra gl-matrix vec2, three.js Vector2, Unity float2, Godot Vector2, Box2D b2Vec2, Eigen Vector2d — producir comparison matrix
- [x] 5.4 Evaluar completitud matemática de Vector2 como espacio vectorial: add, scale, dot, cross, magnitude, normalize, project, reject, reflect, rotate, lerp, slerp — marcar ➕ para operaciones faltantes
- [x] 5.5 Identificar fachadas intra-módulo en Vector2: qué instance methods delegan a static, qué métodos componen desde otros del mismo módulo (e.g., magnitude → magnitudeSq + sqrt). Para cada fachada: ¿overhead aceptable en hot path?
- [x] 5.6 Leer línea a línea `src/core/complex.ts` — verificar algebra de campo, conjugate, reciprocal, Euler formula
- [x] 5.7 Trazar composición de Complex: dependencias con deterministic/ (exp, log, sin, cos para Euler), con auxiliary/ — documentar cada delegación
- [x] 5.8 Evaluar completitud de Complex como campo: add, multiply, conjugate, reciprocal, magnitude, normalize, fromPolar, toPolar, exp, log — marcar ➕ faltantes
- [x] 5.9 Contrastar Complex contra math.js Complex, numeric.js, y textos de referencia
- [x] 5.10 Trazar relación Complex ↔ Rotation2: ¿cómo se interconectan? ¿Complex.toRotation2 existe? ¿Rotation2.toComplex existe? ¿La equivalencia matemática (unit complex = rotation) está explotada o duplicada?
- [x] 5.11 Leer línea a línea `src/core/rotation2.ts` — verificar SO(2) group properties, conversiones, compose, inverse
- [x] 5.12 Trazar composición de Rotation2: dependencias con deterministic/ (sin, cos), auxiliary/ (angle ops), y relación bidireccional con Complex y Vector2
- [x] 5.13 Evaluar completitud de Rotation2 como grupo SO(2): compose, inverse, identity, apply, fromAngle, toAngle, toMatrix2, normalize, lerp, slerp — marcar ➕ faltantes
- [x] 5.14 Contrastar Rotation2 contra three.js Quaternion (2D equivalente), Unity quaternion patterns, Godot Transform2D rotation
- [x] 5.15 Leer línea a línea `src/core/interval.ts` — verificar set operations, containment, arithmetic, invariant min<=max
- [x] 5.16 Evaluar completitud de Interval como álgebra de intervalos: union, intersect, contains, overlaps, expand, shrink, width, center, clamp — marcar ➕ faltantes
- [x] 5.17 Contrastar Interval contra Boost.Interval, Moore interval arithmetic
- [x] 5.18 Leer línea a línea `src/core/matrix2.ts` — verificar determinant, inverse, transpose, column-major, fromRotation
- [x] 5.19 Trazar composición de Matrix2: dependencias con deterministic/ (sin, cos para fromRotation), auxiliary/, y relación con Vector2 (transformVector), Rotation2 (fromRotation)
- [x] 5.20 Evaluar completitud de Matrix2 como álgebra: multiply, determinant, inverse, transpose, fromRotation, fromScale, transformVector, eigenvalues (si aplica) — marcar ➕ faltantes
- [x] 5.21 Contrastar Matrix2 contra gl-matrix mat2, Eigen Matrix2d, GLSL mat2 spec
- [x] 5.22 Leer línea a línea `src/core/matrix3.ts` — verificar affine transforms, point vs vector, TRS decomposition, compose
- [x] 5.23 Trazar composición de Matrix3: dependencias con deterministic/, auxiliary/, y relación con Vector2 (transform), Rotation2, Matrix2, Transform2 (toMatrix3/fromMatrix3)
- [x] 5.24 Evaluar completitud de Matrix3 como transformación afín: multiply, determinant, inverse, transpose, fromTRS, fromTranslation, fromRotation, fromScale, transformPoint, transformVector, decompose — marcar ➕ faltantes
- [x] 5.25 Contrastar Matrix3 contra gl-matrix mat3, three.js Matrix3, Unity float3x3, GLSL mat3
- [x] 5.26 Leer línea a línea `src/core/transform2.ts` — verificar decomposition, compose, inverse, shear limitation
- [x] 5.27 Trazar composición de Transform2: dependencias con Rotation2 (compose rotation), Vector2 (position), Matrix3 (toMatrix3/fromMatrix3), auxiliary/ — documentar cada delegación, especialmente compose y inverse
- [x] 5.28 Evaluar completitud de Transform2 como grupo afín descompuesto: compose, inverse, identity, apply (to point, to vector, to direction), toMatrix3, fromMatrix3, fromPose, lerp — marcar ➕ faltantes
- [x] 5.29 Contrastar Transform2 contra Unity Transform, Godot Transform2D, three.js Object3D transform model
- [x] 5.30 Leer línea a línea `src/core/index.ts` — verificar re-exports, ReadonlyType aliases, freeze functions

### Análisis inter-tipo (core/ como sistema)

- [x] 5.31 Producir grafo de conversión entre tipos: Vector2 ↔ Complex, Complex ↔ Rotation2, Rotation2 → Matrix2, Transform2 ↔ Matrix3 — verificar que no hay agujeros en el grafo y que las conversiones son round-trip safe
- [x] 5.32 Verificar cross-type method consistency: producir comparison matrix con presencia de cada method family (lerp, slerp, inverse, negate, isIdentity, toArray, fromArray, clone, copy, nearEquals, exactEquals) en cada tipo
- [x] 5.33 Verificar fachadas inter-tipo: Vector2.applyRotation2 → Rotation2.apply, Vector2.applyMatrix2 → Matrix2.transformVector, etc. — para cada fachada: ¿quién posee la implementación canónica? ¿la fachada duplica lógica o delega? ¿overhead aceptable?
- [x] 5.34 Verificar SO(2) group axioms para Rotation2: closure, associativity, identity, inverse — con tests
- [x] 5.35 Verificar Complex field axioms: additive/multiplicative groups, distributivity, conjugate properties
- [x] 5.36 Verificar Matrix2 properties: det(A*B)=det(A)*det(B), A*A^-1=I, (A*B)^T=B^T\*A^T
- [x] 5.37 Verificar Transform2 round-trip through Matrix3, compose vs Matrix3 multiply
- [x] 5.38 Producir diagnóstico por entidad (✅/⚠️/🗑️/➕) para todo core/ — incluyendo operaciones faltantes por completitud matemática

## 6. FASE 1 — Auditoría de types/, validation/, utils/

- [x] 6.1 Leer línea a línea `src/types/index.ts` — verificar 7 pares Readonly/Mutable, type guards, TypeScript narrowing
- [x] 6.2 Trazar consumidores de types/: qué módulos importan *Like interfaces, qué módulos importan type guards — verificar que input params usan Readonly*Like universalmente
- [x] 6.3 Evaluar \*Like interfaces contra three.js (no duck-typing), gl-matrix (typed arrays), Eigen (templates)
- [x] 6.4 Leer línea a línea `src/validation/assert.ts` — verificar cobertura de 7 tipos, DCE guard, error messages
- [x] 6.5 Trazar consumidores de validation/: qué funciones de core/ y auxiliary/ usan assertions, dónde se valida y dónde no — ¿la política de validación es consistente?
- [x] 6.6 Evaluar validation pattern contra Box2D (compile-time), Unity (compile-time), zod (runtime, structured errors)
- [x] 6.7 Evaluar error messages: actionability, parameter naming, Safe variant suggestion
- [x] 6.8 Leer línea a línea `src/utils/parse.ts` — verificar parse/format pairs para 7 tipos, out parameter, precision
- [x] 6.9 Trazar composición de parse.ts: ¿usa constructores de core/ directamente? ¿Importa factories? ¿Usa validation?
- [x] 6.10 Leer línea a línea `src/utils/random.ts` + `random-source.ts` — verificar deterministic math usage, SeededRandomSource reproducibility
- [x] 6.11 Trazar composición de random.ts: ¿usa deterministic sin/cos/sqrt? ¿Usa factories de core/? ¿Usa auxiliary/angle para distribuciones angulares?
- [x] 6.12 Leer línea a línea `src/utils/performance.ts` — evaluar measure, MeasurementCollector, timestamp
- [x] 6.13 Evaluar public index.ts: export count, cleanliness, stale references, tree-shaking
- [x] 6.14 Producir diagnóstico por entidad (✅/⚠️/🗑️/➕) para types/, validation/, utils/

## 7. FASE 1 — Síntesis transversal

- [x] 7.1 Producir mapa de sinergia completo: para cada módulo → qué importa de otros módulos, qué exporta para otros, qué podría usar pero no usa (oportunidades perdidas), qué dependencias circulares existen o están en riesgo
- [x] 7.2 Producir inventario de fachadas: listar todas las relaciones fachada/delegación (intra-módulo e inter-módulo), con costo-beneficio de cada una: overhead, DX value, ¿hot-path safe?
- [x] 7.3 Producir inventario de primitivas building-block: funciones que son usadas por 3+ consumidores — estas son las primitivas críticas cuya firma y performance tiene efecto cascada
- [x] 7.4 Verificar completitud matemática por tipo: para cada estructura algebraica (espacio vectorial, campo, grupo, álgebra de matrices, álgebra de intervalos), listar operaciones obligatorias vs existentes vs faltantes
- [x] 7.5 Compilar inconsistencias de convención: naming, firmas, patrones que rompen coherencia del paquete
- [x] 7.6 Compilar reglas e intenciones inferidas del código — pilares de diseño no escritos
- [x] 7.7 Verificar criterios transversales: SRP, DRY, SOLID, Clean Code, sin geometría/física, DX consciente
- [x] 7.8 Producir resumen ejecutivo: patrones de inconsistencia más críticos, reglas de diseño a sostener o corregir, operaciones faltantes por prioridad

## 8. FASE 2 — Diseño de API: Convenciones del paquete

- [x] 8.1 Definir reglas definitivas de naming: suffix triality, _CS, from_, to\*, apply vs transform — con justificación externa
- [x] 8.2 Definir regla de simetría instancia/estático: qué métodos en ambas formas, cuáles solo estáticos, excepciones justificadas
- [x] 8.3 Definir estrategia de capas de API (primitiva, hot path, fachada): cuándo aplica cada una, cuándo no, con ejemplos concretos
- [x] 8.4 Definir política de hot path: out parameter, \*CS variants, breakeven point, escenarios reales
- [x] 8.5 Definir política de determinismo por defecto: qué usa fdlibm, qué usa Math.\*, toggle behavior
- [x] 8.6 Definir política de tolerancia: EPSILON por categoría, cuándo configurable, cuándo hardcoded
- [x] 8.7 Definir política de composición y delegación: cuándo un módulo debe componer desde otro vs reimplementar, cuándo una fachada se justifica, criterio de costo-beneficio para fachadas inter-tipo

## 9. FASE 2 — Diseño de API: Módulos auxiliary/

- [x] 9.1 Diseñar API definitiva de scalar/constants — lista final de constantes, valores, ubicación, consumidores esperados
- [x] 9.2 Diseñar API definitiva de scalar/arithmetic — firmas completas, triality, edge cases, documentar cuáles son primitivas building-block
- [x] 9.3 Diseñar API definitiva de scalar/comparison — firmas, tolerancias, behavior con NaN/Infinity
- [x] 9.4 Diseñar API definitiva de scalar/interpolation — firmas, extrapolation policy, triality
- [x] 9.5 Diseñar API definitiva de angle/conversion — lista final de conversiones, dependencia con scalar/constants
- [x] 9.6 Diseñar API definitiva de angle/normalization — 4 funciones finales, rangos, boundary behavior
- [x] 9.7 Diseñar API definitiva de angle/operations — sinCos, angleDifference, angleDistance, etc. — documentar qué funciones son building blocks para core/
- [x] 9.8 Diseñar API definitiva de angle/interpolation — lerpAngle shortest path, anti-podal handling, delegación a scalar/interpolation
- [x] 9.9 Diseñar API definitiva de angle/unwrapping — unwrapAngles, AngleUnwrapper
- [x] 9.10 Diseñar API definitiva de numeric/guards, rounding, safety, wrapping — firmas, fallbacks, triality, resolver overlap con scalar/

## 10. FASE 2 — Diseño de API: Core types

- [x] 10.1 Diseñar API definitiva de Vector2 — signature sheet completa, todas las operaciones, edge cases, capas (primitiva/hot path/fachada), para cada método: compone desde, es fachada de, es primitiva para
- [x] 10.2 Diseñar API definitiva de Complex — field operations, conversiones, Euler formula, relación con Rotation2 (¿Complex extiende o duplica?)
- [x] 10.3 Diseñar API definitiva de Rotation2 — SO(2) operations, conversiones completas (toMatrix2, toAngle, toComplex, toVector2), compose, apply, relación bidireccional con Complex
- [x] 10.4 Diseñar API definitiva de Interval — set operations, arithmetic, expand/shrink, scope decision (math-core vs geometry), relación con clamping de scalar/
- [x] 10.5 Diseñar API definitiva de Matrix2 — linear transforms, determinant, inverse, column-major, relación con Vector2 (transformVector) y Rotation2 (fromRotation)
- [x] 10.6 Diseñar API definitiva de Matrix3 — affine transforms, point/vector distinction, TRS, decompose, relación con Matrix2/Transform2/Vector2
- [x] 10.7 Diseñar API definitiva de Transform2 — decomposed repr, compose, inverse, shear escalation a Matrix3, fromPose, relación con Rotation2/Vector2/Matrix3
- [x] 10.8 Diseñar grafo de conversión completo entre tipos: todas las conversiones from*/to*, verificar coherencia y round-trip safety
- [x] 10.9 Diseñar fachadas inter-tipo definitivas: para cada fachada (Vector2.applyRotation2, etc.) documentar: owner de implementación canónica, overhead, veredicto mantener/eliminar/reubicar
- [x] 10.10 Producir cross-type consistency matrix final — todas las method families verificadas en todos los tipos
- [x] 10.11 Producir grafo de dependencias entre módulos — verificación DAG, zero ciclos

## 11. FASE 2 — Diseño de API: Support layers

- [x] 11.1 Diseñar API definitiva de deterministic/ — exports, Safe variant coverage, DeterministicKernels object decision, scope boundaries
- [x] 11.2 Diseñar API definitiva de types/ — 7 pares, type guards, narrowing, generic base decision
- [x] 11.3 Diseñar API definitiva de validation/ — assertions, runtime vs compile-time toggle, invariant checking decision, error message quality, cobertura de assertions en core/ y auxiliary/
- [x] 11.4 Diseñar API definitiva de utils/ — parse/format, random, performance, import paths, composición con core/ factories y deterministic/
- [x] 11.5 Diseñar API definitiva de index.ts — export surface, lean main entry, subpath strategy

## 12. FASE 2 — Síntesis de diseño

- [x] 12.1 Producir documento de decisiones de diseño justificadas — alternativas, elección, fuente externa
- [x] 12.2 Producir lista de entidades eliminadas — qué, por qué, qué la reemplaza, para que no se reintroduzcan
- [x] 12.3 Producir mapa de sinergia final — cómo se construyen unos módulos sobre otros, cadenas de composición críticas
- [x] 12.4 Producir mapa de fachadas final — todas las relaciones de delegación con costo-beneficio confirmado
- [x] 12.5 Producir checklist de implementación — lista ordenada de pasos sin ambigüedades

## 13. CIERRE — Contraste con documentación interna

- [x] 13.1 Leer toda la documentación en `packages/math2d/docs/` y subdirectorios
- [x] 13.2 Producir tabla de alineación: para cada sección de docs interna → alineado / en conflicto / desactualizado / no cubierto
- [x] 13.3 Identificar intenciones de diseño documentadas que no se reflejan en el código
- [x] 13.4 Identificar código no documentado que debería tener documentación
- [x] 13.5 Evaluar si el contraste genera revisiones al diseño de Fase 2; documentarlas con justificación
- [x] 13.6 Producir diseño final reconciliado — versión definitiva con revisiones del cierre incorporadas

## 14. Performance benchmarks y validación

- [x] 14.1 Benchmark fdlibm kernels vs native Math: sin, cos, sqrt, atan2 — documentar overhead factor
- [x] 14.2 Benchmark out parameter vs allocation: Vector2.add con/sin out en loop de 100K
- [x] 14.3 Benchmark \*CS variants: rotateCS vs rotate — determinar breakeven point N
- [x] 14.4 Benchmark fachadas inter-tipo: Vector2.applyRotation2 vs Rotation2.apply — ¿la indirección es medible?
- [x] 14.5 Benchmark fachadas intra-módulo: instance.add(other) vs static add(a, b, out) — ¿overhead de dispatch?
- [x] 14.6 Verificar tree-shaking: bundle production size, assertion elimination, side effects
- [x] 14.7 Evaluar hidden class stability: constructores de 7 core types, property initialization order
- [x] 14.8 Documentar memory layout: object overhead per instance, Float64Array comparison
