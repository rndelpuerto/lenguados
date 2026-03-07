## Context

`@lenguados/math2d` es un paquete de matematica 2D pura con arquitectura en capas:
deterministic (fdlibm) -> auxiliary (scalar/angle/numeric) -> core (7 tipos) -> utils.
Una auditoria linea a linea de los ~15,000 LOC revela un paquete bien estructurado
con inconsistencias puntuales que impiden escalar con confianza.

Estado actual: 79 funciones auxiliary, 7 core types con ~250 metodos combinados,
18 funciones deterministas, 21 assertions, 50+ utils. 38 archivos de test, 700+ tests,
0 skipped, cobertura >90%.

El paquete es cimiento: sobre el se construiran geometrias (AABB, Circle, Line, Ray)
y algoritmos fisicos. Cada decision de API aqui se propaga a todo lo que venga despues.

## Goals / Non-Goals

**Goals:**

- Especificacion formal de todas las convenciones de API (naming, firmas, variantes, capas)
- Consolidacion de redundancias en auxiliary sin perder funcionalidad
- Simetria completa entre core types (mismos patrones, mismas familias de metodos)
- Cobertura uniforme de validation para los 7 tipos
- Limpieza de exports y docs obsoletas
- Cero ambiguedades: la implementacion posterior no requiere decisiones adicionales

**Non-Goals:**

- Agregar tipos nuevos (AABB, Circle, Line, Ray) — cambio futuro
- Modificar el kernel determinista (fdlibm estable)
- Reestructurar la arquitectura de capas (es correcta)
- Mover utils a paquetes separados (planificado para v2.0)
- Optimizacion de performance (allocation patterns ya son buenos)
- Cambiar el build system o CI/CD

## Decisions

### D1: Naming — suffix `*Safe` / `*Unchecked`, nunca prefix

**Decision**: Todas las variantes de error handling usan suffix: `divideSafe`, `normalizeSafe`, `sqrtSafe`.

**Racional**: El core ya usa suffix consistentemente (60+ metodos). Solo numeric/safety usa prefix
(`safeDivide`, `safeReciprocal`, `safeLog`, `safePow`, `safeLerp`). El suffix es dominante y
simetrico con `*Unchecked` y `*CS`.

**Alternativas descartadas**:

- Mantener ambos: confunde a contribuidores. Descartado.
- Cambiar a prefix: requiere renombrar 60+ metodos existentes. Descartado.

**Migracion**: Renombrar los 6 prefixed y mantener re-exports deprecated por una version minor.

### D2: Consolidar angle normalization de 6 a 4 funciones

**Decision**: Mantener `normalizeRadians` ([-PI, PI)), `normalizeRadiansPositive` ([0, TAU)),
`normalizeDegrees` ([-180, 180)), `normalizeDegreesPositive` ([0, 360)). Eliminar
`normalizeRadiansAround` y `wrapAngle`.

**Racional**: `normalizeRadiansAround(angle, center)` se compone trivialmente:
`normalizeRadians(angle - center) + center`. `wrapAngle(angle, period)` duplica `loop()`.
4 funciones cubren el 99% de casos de uso en gamedev.

**Alternativas descartadas**:

- Mantener las 6: costo de mantenimiento y curva de aprendizaje. Descartado.
- Reducir a 2 (solo radianes): conversiones a grados son comunes en gamedev. Descartado.

### D3: Strict variant throws, Safe returns fallback — sin excepciones

**Decision**: `remap()` strict debe lanzar error cuando `inMin === inMax`.
`remapSafe()` retorna `outMin`. El comportamiento actual de `remap()` retornando
midpoint viola el contrato strict/Safe.

**Racional**: Toda funcion strict lanza en input invalido. Toda Safe retorna fallback.
Sin excepciones a esta regla. glMatrix y three.js siguen el mismo patron.

### D4: Matrix2.transformVector ya existe — verificado

**Decision**: Ninguna accion requerida. `Matrix2.transformVector` ya existe como static
(matrix2.ts:1460) e instancia (matrix2.ts:2484). La paridad con Matrix3 esta completa.

**Verificacion**: Confirmado via grep en el codigo fuente actual.

### D5: Conversiones `to*` — parcialmente existentes

**Decision**: `Rotation2.toVector2(out?)` y `Rotation2.toComplex(out?)` YA EXISTEN
(rotation2.ts:1528, 1508). Solo falta agregar:

- `Rotation2.toMatrix2(out?)` — NO existe (verificado)
- `Complex.toVector2(out?)` — NO existe (verificado)

**Racional**: `from*` factories existen en los tipos destino. `to*` en el tipo source
habilita cadenas fluidas: `rotation.toMatrix2().transformVector(v)`.

### D6: Interval set operations — parcialmente existentes

**Decision**: `Interval.union` YA EXISTE (static interval.ts:1036, instance interval.ts:1498).
`Interval.intersect` YA EXISTE (static interval.ts:1062, instance interval.ts:1479) y retorna
`Interval | undefined` para conjuntos disjuntos — este es el comportamiento CORRECTO y
documentado (exhaustive_edge_cases.md). NO se cambia a retornar `[0, 0]`.

Solo falta agregar:

- `Interval.expand(interval, delta, out?)` static + instance `expand(delta)` — el getter
  `expanded` actual solo usa EPSILON fijo; se necesita version parametrizada
- `Interval.shrink(interval, delta, out?)` static + instance `shrink(delta)` — nuevo

**Racional**: Box2D `b2AABB_Union` sigue el mismo patron de convex hull. El retorno
`undefined` para interseccion vacia es correcto matematicamente (conjunto vacio ∅) y esta
documentado como limitacion de chaining que el usuario debe manejar explicitamente.

### D6b: Transform2 NO implementa API Triple — decision intencional

**Decision**: Transform2 NO tiene variantes Safe/Unchecked para inverse/multiply. Esto es
intencional: Transform2 no tiene operaciones naturalmente degeneradas (a diferencia de
normalize en Vector2 o inverse en Matrix2 con determinante 0).

**Racional**: Documentado en la auditoria Phase 1 original. Si scale contiene ceros,
el usuario debe escalar a Matrix3 (ver module_interoperability.md §1.1).
La tabla de familias de metodos en core-types-api refleja esto.

### D7: Validation assertions completas para los 7 tipos

**Decision**: Agregar `assertComplex(real, imag)`, `assertInterval(min, max)`,
`assertTransform2(px, py, cos, sin, sx, sy)` component-level.

**Racional**: Vector2, Matrix2, Matrix3, Rotation2 tienen component assertions.
Complex, Interval, Transform2 solo tienen shape assertions (`assert*Like`). Simetria
requiere ambos niveles para todos los tipos.

### D8: Orden de implementacion bottom-up

**Decision**: auxiliary -> validation -> core -> utils/index.

**Racional**: Cambios en capas bajas pueden afectar capas altas. Bottom-up garantiza
estabilidad por capa.

## Risks / Trade-offs

**[Breaking changes en naming auxiliary]** -> Mitigado con re-exports deprecated por una
version minor. Rotura limitada a 6 funciones con import nombrado.

**[Eliminar normalizeRadiansAround y wrapAngle]** -> Bajo riesgo. Ambas son wrappers finos
sobre `loop()`. Composicion trivial documentada en guia de migracion.

**[Interval.intersect retorna undefined para disjuntos]** -> Comportamiento correcto y
documentado. Representa conjunto vacio (∅). Rompe chaining fluido pero es matematicamente
preciso. Usuarios verifican con `intersects()` primero.

**[Rotation2 drift por acumulacion de multiplicaciones]** -> Documentado en
module_interoperability.md. El constructor NO auto-normaliza (costo de sqrt). El
desarrollador debe llamar `.normalize()` periodicamente (~cada 60 frames).

**[Scope creep]** -> La auditoria revelo muchas mejoras posibles. Este cambio se limita
a normalizacion y simetria. Non-goals explicitos.

**[Test churn]** -> Renombrar funciones requiere actualizar tests. Mitigado con IDE
refactoring y aliases deprecated temporales.
