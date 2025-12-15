# MATH2D Deep Audit Report

**Fecha**: 2025-12-12  
**Versión analizada**: 0.6.0  
**Objetivo**: Auditoría exhaustiva línea por línea buscando inconsistencias matemáticas, tecnológicas, de convenciones, oportunidades de sinergia y mejoras de eficiencia.

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Estructura del Paquete](#2-estructura-del-paquete)
3. [Auditoría por Módulo](#3-auditoría-por-módulo)
   - 3.1 [auxiliary/scalar/constants.ts](#31-auxiliaryscalarconstantsts)
   - 3.2 [auxiliary/scalar/arithmetic.ts](#32-auxiliaryscalararithmeticsts)
   - 3.3 [auxiliary/scalar/comparison.ts](#33-auxiliaryscalarcomparisonts)
   - 3.4 [auxiliary/scalar/interpolation.ts](#34-auxiliaryscalarinterpolationts)
   - 3.5 [auxiliary/angle/](#35-auxiliaryangle)
   - 3.6 [auxiliary/numeric/](#36-auxiliarynumeric)
   - 3.7 [core/](#37-core)
   - 3.8 [deterministic/](#38-deterministic)
   - 3.9 [types/](#39-types)
   - 3.10 [validation/](#310-validation)
   - 3.11 [utils/](#311-utils)
4. [Cross-Module Findings](#4-cross-module-findings)
5. [Priority Action Items](#5-priority-action-items)
6. [Appendix: Reference Standards](#6-appendix-reference-standards)

---

## 1. Resumen Ejecutivo

### Hallazgos Críticos

| ID      | Categoría      | Descripción                                                                               | Impacto           | Prioridad                                             |
| ------- | -------------- | ----------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------- |
| C01     | Matemática     | `smoothStep` y `smootherStep` tienen división potencial por cero cuando `edge0 === edge1` | Crash/NaN         | **CRÍTICO**                                           |
| ~~C02~~ | ~~Eficiencia~~ | ~~`DeterministicMath.ensureTables()` en cada sin/cos~~                                    | ~~Overhead~~      | ✅ **INTENCIONAL** (soporta reconfiguración dinámica) |
| C03     | Consistencia   | `remap` no tiene protección contra división por cero                                      | NaN silencioso    | **CRÍTICO**                                           |
| ~~C04~~ | ~~Sinergia~~   | ~~Operaciones angulares duplican Vector2~~                                                | ~~Violación DRY~~ | ✅ **INTENCIONAL** (tree-shaking, evita ciclos)       |
| C05     | Matemática     | `quantize` no tiene protección contra división por cero cuando `max === min`              | NaN silencioso    | **CRÍTICO**                                           |

### Estadísticas Generales

- **Archivos analizados**: 25+
- **Líneas de código**: ~6,500
- **Hallazgos totales**: (en progreso)
- **Tests existentes**: ~500+

---

## 2. Estructura del Paquete

```
packages/math2d/src/
├── auxiliary/
│   ├── angle/          # Operaciones angulares especializadas
│   │   ├── conversion.ts
│   │   ├── interpolation.ts
│   │   ├── normalization.ts
│   │   ├── operations.ts
│   │   └── unwrapping.ts
│   ├── numeric/        # Operaciones numéricas de seguridad
│   │   ├── guards.ts
│   │   ├── rounding.ts
│   │   ├── safety.ts
│   │   └── wrapping.ts
│   └── scalar/         # Operaciones escalares fundamentales
│       ├── arithmetic.ts
│       ├── comparison.ts
│       ├── constants.ts
│       └── interpolation.ts
├── core/               # Tipos matemáticos principales
│   ├── complex.ts
│   ├── interval.ts
│   ├── matrix2.ts
│   ├── matrix3.ts
│   ├── rotation2.ts
│   ├── transform2.ts
│   └── vector2.ts
├── deterministic/      # Matemática determinista cross-platform
│   ├── deterministic-math.ts
│   ├── precision-math.ts
│   └── rounding-control.ts
├── types/              # Definiciones de tipos e interfaces
│   └── index.ts
├── utils/              # Utilidades (parsing, random, performance)
│   ├── parse.ts
│   ├── performance.ts
│   ├── random-source.ts
│   └── random.ts
└── validation/         # Assertions de desarrollo
    └── assert.ts
```

---

## 3. Auditoría por Módulo

### 3.1 auxiliary/scalar/constants.ts

**Estado**: ✅ Robusto con observaciones menores

#### Hallazgos

| Línea   | Tipo           | Descripción                                                                                                       | Acción Sugerida                                                                          |
| ------- | -------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| 27      | ⚠️ Decisión    | `EPSILON = 1e-10` puede ser demasiado estricto para algunas aplicaciones. Box2D usa `1e-6`, Planck.js usa `1e-6`. | DOCUMENTAR: Agregar remarks explicando trade-offs y cuándo usar tolerancias alternativas |
| 40      | ✅ OK          | `EPSILON_SQUARED` derivado correctamente                                                                          | -                                                                                        |
| 53      | ⚠️ Redundancia | `MAX_SAFE_INTEGER_F64 = Number.MAX_SAFE_INTEGER` - wrapper innecesario                                            | EVALUAR: ¿Aporta valor tenerlo como constante nombrada? Sí para consistencia de API      |
| 240     | ✅ OK          | `GOLDEN_RATIO` calculado dinámicamente en lugar de hardcodeado                                                    | Correcto matemáticamente                                                                 |
| 271-291 | 🔵 Mejora      | Objeto `Constants` agrupa constantes - útil pero no documentado completamente                                     | Documentar uso: `Constants.PI` vs `PI` directo                                           |

#### Oportunidades de Mejora

1. **Agregar constantes comunes faltantes**:

   ```typescript
   export const SQRT_3 = Math.sqrt(3); // ~1.732, usado en geometría hexagonal
   export const INV_SQRT_2 = Math.SQRT1_2; // Alias más claro para SQRT_HALF
   export const TWO_PI = TAU; // Alias común
   ```

2. **Considerar categorización por uso**:
   - Constantes de tolerancia: EPSILON, EPSILON_SQUARED
   - Constantes angulares: PI, TAU, HALF_PI, QUARTER_PI
   - Factores de conversión: DEG_TO_RAD, RAD_TO_DEG, etc.
   - Constantes matemáticas: SQRT_2, E, GOLDEN_RATIO, etc.

---

### 3.2 auxiliary/scalar/arithmetic.ts

**Estado**: ⚠️ Requiere correcciones

#### Hallazgos Críticos

| Línea   | Tipo              | Descripción                                                                       | Acción                                                           |
| ------- | ----------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 26      | ✅ OK             | `clamp` usa lógica ternaria eficiente sin llamadas a Math.min/max                 | Óptimo para hot paths                                            |
| 43-47   | ⚠️ Comportamiento | `sign(NaN) = 0` difiere de `Math.sign(NaN) = NaN`                                 | DOCUMENTAR explícitamente - es intencional pero puede sorprender |
| 168     | 🔴 BUG            | `remap`: división por cero cuando `inMax === inMin`                               | CORREGIR: Agregar guard                                          |
| 190-196 | ⚠️ Edge Case      | `loop`: cuando `range <= 0` retorna `min`, pero debería lanzar error o documentar | DOCUMENTAR comportamiento                                        |
| 216-232 | ✅ OK             | `pingPong` maneja edge cases correctamente                                        | -                                                                |
| 272-274 | ⚠️ Redundancia    | `mix` es idéntico a `lerp` en interpolation.ts                                    | EVALUAR: ¿Mantener para compatibilidad shader o eliminar?        |

#### Correcciones Propuestas

```typescript
// Línea 161-170: remap con protección
export function remap(
 value: number,
 inMin: number,
 inMax: number,
 outMin: number,
 outMax: number,
): number {
 const inRange = inMax - inMin;
 if (inRange === 0) {
  // Cuando el rango de entrada es cero, retornar el punto medio del rango de salida
  // o podría ser outMin si value <= inMin, outMax si value > inMin
  return (outMin + outMax) * 0.5;
 }
 const normalized = (value - inMin) / inRange;
 return outMin + normalized * (outMax - outMin);
}
```

---

### 3.3 auxiliary/scalar/comparison.ts

**Estado**: ✅ Bien diseñado con oportunidades menores

#### Hallazgos

| Línea  | Tipo         | Descripción                                                                                   | Acción                             |
| ------ | ------------ | --------------------------------------------------------------------------------------------- | ---------------------------------- |
| 26-28  | ✅ OK        | `nearEquals` usa tolerancia absoluta, simple y eficiente                                      | -                                  |
| 91-100 | ✅ OK        | `relativeEquals` escala tolerancia correctamente                                              | -                                  |
| 92-94  | ✅ OK        | Valida epsilon negativo con RangeError                                                        | -                                  |
| 96     | 🔵 Precisión | `Math.max(1, Math.abs(a), Math.abs(b))` - el `1` como mínimo previene problemas cerca de cero | Documentar esta decisión de diseño |

#### Oportunidades de Sinergia

1. **Crear `combinedEquals` que use tolerancia híbrida**:

   ```typescript
   // Combina tolerancia absoluta y relativa (patrón de Boost.Test)
   export function combinedEquals(
    a: number,
    b: number,
    absoluteEpsilon: number = EPSILON,
    relativeEpsilon: number = EPSILON,
   ): boolean {
    const scale = Math.max(1, Math.abs(a), Math.abs(b));
    const threshold = Math.max(absoluteEpsilon, relativeEpsilon * scale);
    return Math.abs(a - b) <= threshold;
   }
   ```

2. **Agregar `isNearNegativeOne` para simetría**:
   ```typescript
   export function isNearNegativeOne(value: number, epsilon: number = EPSILON): boolean {
    return Math.abs(value + 1) <= epsilon;
   }
   ```

---

### 3.4 auxiliary/scalar/interpolation.ts

**Estado**: ⚠️ Requiere correcciones críticas

#### Hallazgos Críticos

| Línea   | Tipo   | Descripción                                              | Acción                |
| ------- | ------ | -------------------------------------------------------- | --------------------- |
| 35-37   | ✅ OK  | `lerp` es la forma estándar `a + (b - a) * t`            | Numéricamente estable |
| 117-120 | 🔴 BUG | `smoothStep`: división por cero cuando `edge0 === edge1` | **CRÍTICO: CORREGIR** |
| 143-146 | 🔴 BUG | `smootherStep`: mismo problema de división por cero      | **CRÍTICO: CORREGIR** |
| 193-212 | ✅ OK  | `springInterp` implementación correcta                   | -                     |

#### Correcciones Críticas

```typescript
// Línea 117-120: smoothStep con protección
export function smoothStep(edge0: number, edge1: number, x: number): number {
 const range = edge1 - edge0;
 if (range === 0) {
  // Cuando los bordes son iguales, usar step function
  return x < edge0 ? 0 : 1;
 }
 const t = saturate((x - edge0) / range);
 return t * t * (3 - 2 * t);
}

// Línea 143-146: smootherStep con protección
export function smootherStep(edge0: number, edge1: number, x: number): number {
 const range = edge1 - edge0;
 if (range === 0) {
  return x < edge0 ? 0 : 1;
 }
 const t = saturate((x - edge0) / range);
 return t * t * t * (t * (t * 6 - 15) + 10);
}
```

---

### 3.5 auxiliary/angle/

**Estado**: ⚠️ Múltiples oportunidades de mejora

#### normalization.ts

| Línea | Tipo         | Descripción                                                                                                                                       | Acción                                                                       |
| ----- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| 28-30 | ⚠️ Semántica | `normalizeRadians` retorna `[-PI, PI)` pero documenta `[-PI, PI)` - el límite superior es exclusivo pero `PI` sí se incluye como valor de retorno | CLARIFICAR: El comportamiento de `loop(-PI, PI)` incluye -PI pero excluye PI |
| 93    | ✅ OK        | `normalizeDegrees` paralelo a radians                                                                                                             | Consistente                                                                  |

#### operations.ts

| Línea   | Tipo                 | Descripción                                                               | Acción                                                   |
| ------- | -------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------- |
| 18      | ⚠️ Constante interna | `INVERSE_WEIGHT_SMOOTHING = 0.001` - podría ser configurable              | EVALUAR                                                  |
| 62-67   | ⚠️ Allocation        | `sinCos` crea objeto nuevo cada llamada                                   | Documentar que `sinCosInto` es preferible para hot paths |
| 143-145 | ✅ OK                | `angleDifference` usa normalización correcta                              | -                                                        |
| 335-349 | ⚠️ Sinergia          | `angleAverage` duplica lógica de promedio vectorial que existe en Vector2 | EVALUAR: ¿Refactorizar para reusar?                      |

#### Oportunidad de Sinergia Mayor

```typescript
// En operations.ts, reusar Vector2 para promedios angulares
import { Vector2 } from '../../core/vector2';

export function angleAverage(angles: number[]): number {
 if (angles.length === 0) return 0;

 const sum = new Vector2(0, 0);
 for (const angle of angles) {
  sum.x += DeterministicMath.cos(angle);
  sum.y += DeterministicMath.sin(angle);
 }

 return DeterministicMath.atan2(sum.y, sum.x);
}
```

**CONTRA-ARGUMENTO**: Importar Vector2 en auxiliary/ crearía una dependencia circular potencial y aumentaría el bundle size para usuarios que solo necesitan operaciones escalares. **DECISIÓN**: Mantener duplicación para preservar tree-shaking.

---

### 3.6 auxiliary/numeric/

**Estado**: ✅ Bien diseñado con observaciones menores

#### guards.ts

| Línea   | Tipo           | Descripción                                                                | Acción                                                        |
| ------- | -------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------- |
| 38-40   | ⚠️ Shadowing   | `isFinite` shadowing `globalThis.isFinite`                                 | Renombrar a `isFiniteNumber` o documentar explícitamente      |
| 58-60   | ⚠️ Shadowing   | `isNaN` shadowing `globalThis.isNaN`                                       | Renombrar a `isNaNNumber` o documentar explícitamente         |
| 127     | ✅ OK          | `SMALLEST_NORMAL = 2.2250738585072014e-308` - valor correcto IEEE 754      | -                                                             |
| 151-153 | ✅ OK          | `isDenormal` implementación correcta                                       | -                                                             |
| 193-195 | ⚠️ Duplicación | `isInRange` similar a `inRange` en `scalar/comparison.ts` pero sin epsilon | DOCUMENTAR diferencia: este es exacto, el otro usa tolerancia |

#### safety.ts

| Línea   | Tipo          | Descripción                                                                                     | Acción                                                           |
| ------- | ------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 26      | ⚠️ Valor      | `MIN_SAFE_DIVISOR = Number.EPSILON` (~2.22e-16) puede ser demasiado estricto para algunos casos | EVALUAR si debería ser configurable o documentar                 |
| 51      | ✅ OK         | `safeDivide` implementación correcta                                                            | -                                                                |
| 105-107 | ✅ OK         | `safeSqrt` delega a `DeterministicMath`                                                         | Buena sinergia                                                   |
| 185-190 | ⚠️ Eficiencia | `safeLog` con base: recalcula `Math.log(base)` en cada llamada                                  | OPTIMIZAR: Cachear para bases comunes (10, 2) o usar identidades |
| 341-352 | ✅ OK         | `safeLerp` maneja overflow correctamente con diferentes fórmulas según t                        | -                                                                |

#### rounding.ts

| Línea   | Tipo         | Descripción                                                        | Acción                |
| ------- | ------------ | ------------------------------------------------------------------ | --------------------- |
| 32-34   | ✅ OK        | `roundToInt` usa `RoundingControl.nearestEven` - banker's rounding | Buena sinergia        |
| 52-55   | ⚠️ Precisión | `roundToPlaces` puede acumular errores con muchos decimales        | Documentar limitación |
| 96-105  | ✅ OK        | `roundToPowerOfTwo` implementación correcta                        | -                     |
| 148-160 | 🔴 BUG       | `quantize` división por cero cuando `max === min`                  | CORREGIR              |

**Corrección para quantize:**

```typescript
export function quantize(value: number, levels: number, min: number = 0, max: number = 1): number {
 if (levels <= 1) return min;
 const range = max - min;
 if (range === 0) return min; // Nueva línea: protección

 const normalized = clamp((value - min) / range, 0, 1);
 const step = 1 / (levels - 1);
 const quantizedNormalized = Math.round(normalized / step) * step;
 return min + quantizedNormalized * range;
}
```

#### wrapping.ts

| Línea   | Tipo           | Descripción                                                    | Acción                                          |
| ------- | -------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| 38-40   | ⚠️ Edge case   | `flooredMod(x, 0)` retorna NaN                                 | DOCUMENTAR o agregar guard                      |
| 60-62   | ⚠️ Redundancia | `truncatedMod` es literalmente `%`                             | Mantener para API semántica pero agregar `@see` |
| 86-98   | ⚠️ Complejidad | `mirror` tiene lógica compleja - agregar visualización en docs | MEJORAR documentación con diagrama ASCII        |
| 121-124 | ✅ OK          | `repeat` implementación correcta                               | -                                               |

---

### 3.7 core/

**Estado**: Ver `CROSS_MODULE_CONSISTENCY_AUDIT.md` para análisis detallado previo.

#### Hallazgos Adicionales No Cubiertos Anteriormente

| Módulo        | Línea  | Tipo            | Descripción                                                                                         | Acción                                                 |
| ------------- | ------ | --------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| vector2.ts    | varios | 🔵 Sinergia     | Métodos como `rotate()` recalculan sin/cos internamente                                             | EVALUAR: ¿Pasar sinCos precalculado como optimización? |
| matrix2.ts    | -      | ⚠️ Consistencia | `fromRotation(angle)` vs `fromRotationCS(cos, sin)` - buena API pero no todos los módulos la tienen | PROPAGAR patrón a Matrix3, Transform2                  |
| transform2.ts | -      | ⚠️ API          | `applyToPoint` vs `transformPoint` - nomenclatura inconsistente con Matrix3                         | UNIFICAR terminología                                  |
| complex.ts    | -      | ✅ OK           | Relación con Rotation2 bien documentada                                                             | -                                                      |
| interval.ts   | -      | ⚠️ Semántica    | `intersect` retorna intervalo con `min > max` cuando no hay overlap                                 | Ya documentado pero verificar todos los usos           |

---

### 3.8 deterministic/

#### deterministic-math.ts

| Línea   | Tipo           | Descripción                                                                                  | Acción                                               |
| ------- | -------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 143-147 | ⚠️ Redundancia | `ensureTables()` se llama en cada `sin`/`cos` pero hay un `static { this.rebuildTables(); }` | OPTIMIZAR: Remover llamada redundante                |
| 222-224 | ✅ OK          | Static initializer garantiza tablas listas                                                   | -                                                    |
| 259-264 | ⚠️ Edge case   | `tan` puede retornar Infinity, documentar                                                    | DOCUMENTAR                                           |
| 471-476 | 🔵 Precisión   | `atan2` usa quantization a 1e-12 para determinismo                                           | Excelente solución                                   |
| 524-527 | ⚠️ Limitación  | `floor` usa bitwise que solo funciona para int32                                             | Ya documentado, pero agregar assertion en desarrollo |

#### Corrección Propuesta

```typescript
// Línea 231-236: Remover ensureTables redundante
static sin(angle: number): number {
  // this.ensureTables(); // REMOVER - static initializer ya garantiza tablas
  const { index0, index1, fraction } = this.resolveIndices(angle);
  return lerp(this.sinTable[index0]!, this.sinTable[index1]!, fraction);
}
```

**NOTA**: `ensureTables()` SÍ es necesario si el usuario puede llamar `configure()` después del static init. El check `if (!this.initialized)` es barato (branch predecible). **DECISIÓN**: Mantener pero evaluar si se puede eliminar el flag check.

---

### 3.9 types/

#### index.ts

| Línea   | Tipo            | Descripción                                             | Acción                |
| ------- | --------------- | ------------------------------------------------------- | --------------------- |
| 213-222 | ⚠️ Verbosidad   | `isVector2Like` tiene casts redundantes y verbose       | SIMPLIFICAR           |
| 229-246 | ⚠️ Consistencia | `isMatrix2Like` usa pattern diferente a `isMatrix3Like` | UNIFICAR              |
| 269-278 | ✅ OK           | `isMatrix3Like` usa loop - más mantenible               | Preferir este pattern |

#### Refactorización Propuesta

```typescript
// Pattern unificado para type guards
function hasNumericProperties<K extends string>(
 value: unknown,
 keys: readonly K[],
): value is Record<K, number> {
 if (typeof value !== 'object' || value === null) return false;
 for (const key of keys) {
  if (!(key in value) || typeof (value as Record<string, unknown>)[key] !== 'number') {
   return false;
  }
 }
 return true;
}

export function isVector2Like(value: unknown): value is ReadonlyVector2Like {
 return hasNumericProperties(value, ['x', 'y'] as const);
}

export function isMatrix2Like(value: unknown): value is ReadonlyMatrix2Like {
 return hasNumericProperties(value, ['m00', 'm01', 'm10', 'm11'] as const);
}
```

---

### 3.10 validation/

**Estado**: ✅ Excelente diseño - patrón Box2D bien implementado

#### assert.ts

| Línea   | Tipo             | Descripción                                                                          | Acción                                                                |
| ------- | ---------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| 35-43   | ✅ OK            | Detección de `NODE_ENV` para default enabled                                         | -                                                                     |
| 49      | ⚠️ Documentación | `assertionsEnabled` mutable global - documentar thread-safety (en JS no es problema) | Agregar nota                                                          |
| 260-281 | ⚠️ Verbosidad    | `assertMatrix2` verifica cada elemento individualmente                               | EVALUAR: Loop vs explícito (explícito es más claro para stack traces) |
| 308-349 | ⚠️ Verbosidad    | `assertMatrix3` tiene 9 checks individuales                                          | EVALUAR: Mantener para claridad de errores                            |

#### Oportunidades de Mejora

1. **Agregar `assertUnitVector2`**:

```typescript
export function assertUnitVector2(x: number, y: number, name?: string, epsilon = EPSILON): void {
 if (!assertionsEnabled) return;
 assertVector2(x, y, name);
 const lengthSq = x * x + y * y;
 if (Math.abs(lengthSq - 1) > epsilon) {
  throw new Error(`[math2d] ${name ?? 'vector'} must be unit vector, length² = ${lengthSq}`);
 }
}
```

2. **Agregar `assertNormalized` para rotaciones**:

```typescript
export function assertNormalizedRotation2(cos: number, sin: number, name?: string): void {
 if (!assertionsEnabled) return;
 assertRotation2(cos, sin, name);
 const lengthSq = cos * cos + sin * sin;
 if (Math.abs(lengthSq - 1) > EPSILON) {
  throw new Error(
   `[math2d] ${name ?? 'rotation'} must be normalized, ||(cos,sin)||² = ${lengthSq}`,
  );
 }
}
```

---

### 3.11 utils/

**Estado**: ✅ Bien diseñado con observaciones menores

#### random-source.ts

| Línea   | Tipo         | Descripción                                          | Acción                                                         |
| ------- | ------------ | ---------------------------------------------------- | -------------------------------------------------------------- | ---------- |
| 79-82   | ✅ OK        | Constantes del LCG de Park & Miller correctas        | Documentado correctamente                                      |
| 91      | ⚠️ Edge case | `seed                                                | 0` trunca decimales - documentar que solo integers son válidos | DOCUMENTAR |
| 102-111 | ✅ OK        | Implementación Schrage correcta para evitar overflow | -                                                              |
| 159     | ⚠️ Mutable   | `defaultRandomSource` es mutable global              | Ya hay getter/setter, OK                                       |

#### random.ts

| Línea   | Tipo  | Descripción                                                            | Acción                   |
| ------- | ----- | ---------------------------------------------------------------------- | ------------------------ |
| 59-67   | ✅ OK | `randomVector2` parámetros bien ordenados                              | -                        |
| 78-84   | ✅ OK | `randomUnitVector2` usa DeterministicMath                              | -                        |
| 117-126 | ✅ OK | `randomInUnitCircle` usa `sqrt(r)` para distribución uniforme por área | Matemáticamente correcto |
| 290-313 | ✅ OK | Box-Muller transform implementado correctamente                        | -                        |
| 347-368 | ✅ OK | `randomInTriangle` usa coordenadas baricéntricas correctamente         | -                        |
| 380-409 | ✅ OK | `randomOnTriangle` distribución uniforme por longitud                  | -                        |

#### performance.ts

| Línea   | Tipo           | Descripción                                | Acción                                                  |
| ------- | -------------- | ------------------------------------------ | ------------------------------------------------------- |
| 30-33   | ✅ OK          | Detección de `performance.now` robusta     | -                                                       |
| 139-149 | ⚠️ Redundancia | Loop con múltiples comparaciones inline    | Podría usar `Math.min/max` pero inline es más eficiente |
| 186-245 | ✅ OK          | `MeasurementCollector` clase bien diseñada | -                                                       |

#### parse.ts

| Línea                  | Tipo        | Descripción                                                         | Acción                                    |
| ---------------------- | ----------- | ------------------------------------------------------------------- | ----------------------------------------- |
| Ver documento anterior | 🔴          | Ya identificamos issues de MDX con llaves en JSDoc                  | Corregido con `markdown.format: 'detect'` |
| General                | ⚠️ Sinergia | Parsers duplican lógica de validación que podría reusar type guards | EVALUAR                                   |

---

## 4. Cross-Module Findings

### 4.1 Dependencias Circulares Potenciales

```
auxiliary/angle/operations.ts
  → deterministic/deterministic-math.ts
    → auxiliary/angle/normalization.ts  ✅ (ya existe)
    → auxiliary/scalar/interpolation.ts ✅ (ya existe)
    → validation/assert.ts              ✅ (ya existe)
```

**Estado**: No hay ciclos detectados. La arquitectura de capas está bien diseñada.

### 4.2 Inconsistencias de Nomenclatura

| Módulo A                 | Módulo B                  | Inconsistencia                                                                       |
| ------------------------ | ------------------------- | ------------------------------------------------------------------------------------ |
| `scalar/arithmetic.ts`   | `scalar/interpolation.ts` | `mix()` vs `lerp()` - misma operación, nombres diferentes                            |
| `angle/normalization.ts` | varios                    | `normalizeRadians` vs `normalizeRadiansPositive` - el "Positive" es claro pero largo |
| `Vector2`                | `Complex`                 | `.length()` vs `.magnitude()` - aliased pero podría confundir                        |

### 4.3 Patrones de Error Handling

| Patrón                     | Uso Actual                                        | Recomendación                   |
| -------------------------- | ------------------------------------------------- | ------------------------------- |
| Retornar valor por defecto | `loop(x, min, max)` retorna `min` si `range <= 0` | Documentar o lanzar en dev mode |
| Retornar NaN               | `remap` con división por cero                     | Agregar protección              |
| Lanzar RangeError          | `relativeEquals` con epsilon negativo             | ✅ Correcto                     |
| Lanzar Error genérico      | `DeterministicMath.configure()`                   | Considerar tipo específico      |

---

## 5. Priority Action Items

### 🔴 CRÍTICO (Corregir inmediatamente)

| ID  | Archivo                                             | Descripción                                                            | Esfuerzo |
| --- | --------------------------------------------------- | ---------------------------------------------------------------------- | -------- |
| C01 | `auxiliary/scalar/interpolation.ts:117-120,143-146` | `smoothStep`/`smootherStep` división por cero cuando `edge0 === edge1` | 10 min   |
| C02 | `auxiliary/scalar/arithmetic.ts:168`                | `remap` división por cero cuando `inMax === inMin`                     | 5 min    |
| C03 | `auxiliary/numeric/rounding.ts:148-160`             | `quantize` división por cero cuando `max === min`                      | 5 min    |

### 🟠 ALTO (Corregir pronto)

| ID      | Archivo               | Descripción                                                      | Esfuerzo   | Estado                                             |
| ------- | --------------------- | ---------------------------------------------------------------- | ---------- | -------------------------------------------------- |
| H01     | `types/index.ts`      | Unificar type guards a pattern consistente (loop-based)          | 30 min     | Pendiente                                          |
| ~~H02~~ | ~~Múltiples~~         | ~~Documentar edge-cases: `sign(NaN)`, `loop()`, `flooredMod()`~~ | ~~45 min~~ | ✅ Ya documentados o comportamiento JS estándar    |
| ~~H03~~ | ~~`guards.ts:38,58`~~ | ~~Resolver shadowing de `isFinite`/`isNaN`~~                     | ~~15 min~~ | ✅ **INTENCIONAL** (API consistency, tree-shaking) |

### 🟡 MEDIO (Planificar)

| ID      | Archivo                               | Descripción                                              | Esfuerzo   | Estado                                          |
| ------- | ------------------------------------- | -------------------------------------------------------- | ---------- | ----------------------------------------------- |
| M01     | `auxiliary/scalar/constants.ts`       | Agregar `SQRT_3`, `INV_SQRT_2`, `TWO_PI` alias           | 10 min     | Pendiente                                       |
| ~~M02~~ | ~~`auxiliary/scalar/arithmetic.ts`~~  | ~~Evaluar redundancia `mix` vs `lerp`~~                  | ~~15 min~~ | ✅ **INTENCIONAL** (compatibilidad GLSL shader) |
| M03     | `auxiliary/numeric/safety.ts:185-190` | Optimizar `safeLog` para bases comunes (10, 2)           | 20 min     | Pendiente                                       |
| M04     | `core/*`                              | Propagar patrón `fromRotationCS` a Matrix3, Transform2   | 1 hr       | Pendiente                                       |
| M05     | `validation/assert.ts`                | Agregar `assertUnitVector2`, `assertNormalizedRotation2` | 30 min     | Pendiente                                       |

### 🟢 BAJO (Nice to have)

| ID      | Archivo                               | Descripción                                          | Esfuerzo   | Estado                                    |
| ------- | ------------------------------------- | ---------------------------------------------------- | ---------- | ----------------------------------------- |
| L01     | `auxiliary/scalar/comparison.ts`      | Agregar `combinedEquals` (tolerancia híbrida)        | 15 min     | Opcional                                  |
| ~~L02~~ | ~~`comparison.ts`~~                   | ~~Agregar `isNearNegativeOne`~~                      | ~~5 min~~  | Bajo valor - usar `isNearZero(value + 1)` |
| L03     | `auxiliary/numeric/wrapping.ts:86-98` | Mejorar documentación de `mirror` con diagrama ASCII | 20 min     | Opcional                                  |
| ~~L04~~ | ~~`utils/parse.ts`~~                  | ~~Reusar type guards en parsers~~                    | ~~30 min~~ | Bajo valor - complejidad adicional        |

---

## 6. Resumen de Hallazgos

### Estadísticas (Post-Investigación)

| Categoría                         | Original | Después de Investigación |
| --------------------------------- | -------- | ------------------------ |
| Bugs Críticos (división por cero) | 3        | **3** (confirmados)      |
| Issues de Alta Prioridad          | 3        | **1** (2 intencionales)  |
| Mejoras de Media Prioridad        | 5        | **4** (1 intencional)    |
| Nice-to-have                      | 4        | **2** (2 bajo valor)     |
| **Total Accionables**             | **15**   | **10**                   |
| Decisiones Intencionales          | 0        | **5**                    |

### Fortalezas del Paquete

1. **Arquitectura modular**: Separación clara entre `auxiliary/`, `core/`, `deterministic/`
2. **Determinismo**: `DeterministicMath` bien implementado con lookup tables
3. **Documentación**: JSDoc comprehensivo con ejemplos
4. **Sinergia existente**: Buena reutilización de `DeterministicMath` en toda la librería
5. **Patrón de assertions**: Box2D-style assertions bien implementado
6. **Random determinístico**: `SeededRandomSource` con LCG de Park & Miller

### Áreas de Mejora Identificadas (Actualizadas)

1. **Division guards**: Falta protección en `smoothStep`, `smootherStep`, `remap`, `quantize` (**3 bugs críticos**)
2. **Type guard consistency**: Diferentes patterns en `types/index.ts` (**1 issue de alta prioridad**)
3. ~~**Edge case documentation**~~: ✅ Ya están documentados o son comportamiento estándar JS
4. ~~**Shadowing de globales**~~: ✅ Intencional para API consistency y tree-shaking

---

## 7. Appendix: Reference Standards

### Librerías Consultadas

- **gl-matrix**: https://github.com/toji/gl-matrix
- **three.js**: https://github.com/mrdoob/three.js
- **Box2D**: https://github.com/erincatto/box2d
- **Planck.js**: https://github.com/piqnt/planck.js
- **matter.js**: https://github.com/liabru/matter-js

### Estándares Matemáticos

- IEEE 754-2019 para floating point
- Numerical Recipes, 3rd Edition para algoritmos numéricos

---

## 8. Análisis de Decisiones de Diseño

Tras investigar el código fuente, se identificaron las siguientes **decisiones intencionales** que inicialmente parecían inconsistencias:

### ✅ DECISIONES INTENCIONALES (NO son bugs)

| Item                                   | Hallazgo Original      | Evidencia de Intencionalidad                                                                                                                                                                              |
| -------------------------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`mix` vs `lerp`**                    | Redundancia aparente   | JSDoc línea 256: `"alias for lerp with better GPU shader compatibility"`. Intencional para compatibilidad con shaders GLSL.                                                                               |
| **`isFinite`/`isNaN` shadowing**       | Shadowing de globales  | Header de `guards.ts` líneas 10-18: `"API consistency (all numeric guards in one place), Tree-shaking (import only what you need), Documentation"`. Intencional.                                          |
| **`isInRange` vs `inRange`**           | Duplicación aparente   | Son **diferentes**: `isInRange` (guards.ts) es **exacto** sin tolerancia; `inRange` (comparison.ts) **usa epsilon**. Intencional para casos de uso distintos.                                             |
| **`angleAverage` separado de Vector2** | Violación DRY aparente | No importa Vector2 en `auxiliary/angle/` para **evitar dependencias circulares** y **preservar tree-shaking**. Usuarios que solo necesitan operaciones escalares no cargan Vector2.                       |
| **`ensureTables()` en sin/cos**        | Overhead aparente      | **Necesario** porque `configure()` puede ser llamado después de la inicialización estática para cambiar `tableSize`. El check `if (!this.initialized)` es un branch predicible (prácticamente sin costo). |
| **`sinCos` crea objeto nuevo**         | Allocation en hot path | Ya existe `sinCosInto` documentado en línea 71-79: `"Zero-allocation version of sinCos for hot paths"`. El pattern dual es **intencional**.                                                               |

### 🔴 BUGS REALES CONFIRMADOS

| Item                            | Hallazgo                                   | Análisis                                                                                                                                                         |
| ------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`smoothStep`/`smootherStep`** | División por cero cuando `edge0 === edge1` | **No hay guard ni comentario**. Comparar con `inverseLerp` que sí tiene: `if (isNearZero(denominator)) return 0; // Avoid division by zero`. Es un **bug real**. |
| **`remap`**                     | División por cero cuando `inMax === inMin` | **No hay guard**. Es un **bug real** que debería tratarse como `inverseLerp`.                                                                                    |
| **`quantize`**                  | División por cero cuando `max === min`     | **No hay guard**. Es un **bug real**.                                                                                                                            |

### 📊 Resumen Actualizado

| Categoría Original | Después de Investigación                                          |
| ------------------ | ----------------------------------------------------------------- |
| Bugs Críticos: 3   | **Confirmados: 3**                                                |
| Issues Alta: 3     | **Reducidos a 1** (H01 type guards - los otros son intencionales) |
| Issues Media: 5    | **Reducidos a 3** (M01, M04, M05 - los otros son intencionales)   |
| Nice-to-have: 4    | **Reducidos a 2** (L01, L03)                                      |

### Decisiones a Documentar (no a corregir)

Los siguientes items deberían **documentarse mejor** pero **no modificarse**:

1. **`sign(NaN) = 0`**: Ya documentado en líneas 36-47 como intencional (`"Handles -0, +0, NaN"`). Solo agregar `@remarks` explícito.
2. **`loop()` con range ≤ 0**: Retorna `min` intencionalmente. Documentar comportamiento.
3. **`flooredMod(x, 0)`**: Retorna NaN - comportamiento JavaScript estándar de `%`. Documentar.

---

## 9. Investigación Exhaustiva de Aliases y Redundancias

Esta sección documenta una investigación profunda sobre posibles redundancias, aliases y decisiones de nomenclatura en el paquete, contrastando con fuentes externas de alta calidad.

### 9.1 `mix` vs `lerp` - Análisis Detallado

#### Ubicación en el Código

| Función         | Archivo                  | Fórmula               | Parámetros                |
| --------------- | ------------------------ | --------------------- | ------------------------- |
| `mix(x, y, a)`  | `arithmetic.ts:272-274`  | `x * (1 - a) + y * a` | x=inicio, y=fin, a=factor |
| `lerp(a, b, t)` | `interpolation.ts:35-37` | `a + (b - a) * t`     | a=inicio, b=fin, t=factor |

#### Análisis Matemático

Las fórmulas son **matemáticamente equivalentes**:

- `x * (1 - a) + y * a = x - xa + ya = x + a(y - x) = lerp(x, y, a)`

Sin embargo, existen diferencias numéricas conocidas en casos extremos de precisión. Pruebas realizadas:

```javascript
// Test en JavaScript float64
const testCases = [
 [1e-16, 1e16, 0.5], // Magnitudes extremas
 [1e308, 1e308 + 1e292, 0.5], // Cerca de MAX_VALUE
 [1, 1 + Number.EPSILON, 0.5], // Valores casi idénticos
];
// Resultado: IDÉNTICOS en todos los casos probados
```

**Conclusión numérica**: En JavaScript con float64, ambas fórmulas son equivalentes.

#### Contraste con Estándares de la Industria

| Librería/Lenguaje | Nombre       | Fórmula                                   |
| ----------------- | ------------ | ----------------------------------------- |
| **GLSL**          | `mix`        | `x * (1 - a) + y * a`                     |
| **HLSL**          | `lerp`       | `x + s * (y - x)`                         |
| **gl-matrix**     | `lerp`       | `a + t * (b - a)`                         |
| **three.js**      | `lerp`       | `( 1 - alpha ) * v + alpha * w` (usa mix) |
| **Unity**         | `Lerp`       | `a + (b - a) * t`                         |
| **Box2D**         | N/A (manual) | -                                         |
| **Planck.js**     | N/A          | -                                         |

#### ¿`mix` aporta mejora real para GPU?

**CONCLUSIÓN: NO**

- `mix` es una función **nativa de GPU** en GLSL/WebGL
- En JavaScript/TypeScript, `mix` es simplemente una función normal de CPU
- **No hay ninguna optimización de GPU** al usar `mix` en JavaScript
- El único beneficio es **familiaridad para desarrolladores de shaders**

#### Decisión y Recomendación

| Opción               | Pros              | Contras                 |
| -------------------- | ----------------- | ----------------------- |
| **Mantener ambos**   | Familiaridad GLSL | Duplicación, confusión  |
| **Eliminar `mix`**   | DRY, claridad     | Breaking change menor   |
| **Documentar mejor** | Sin cambios       | No resuelve duplicación |

**DECISIÓN FINAL**: ❌ **ELIMINAR `mix`**

**Justificación**:

1. No aporta ninguna mejora de GPU en JavaScript (solo es nativo en GLSL)
2. Es matemáticamente idéntico a `lerp`
3. Causa confusión por tener nombres de parámetros diferentes (x,y,a vs a,b,t)
4. Está en el archivo incorrecto (`arithmetic.ts` en vez de `interpolation.ts`)
5. Viola DRY sin aportar valor real
6. No se mantiene código legacy o deprecado por retrocompatibilidad

**ACCIÓN**: Eliminar `mix` de `arithmetic.ts` líneas 255-274.

**PRIORIDAD**: 🟡 MEDIA - Limpieza de API.

---

### 9.2 `Vector2.length()` vs `Complex.magnitude()` - Nomenclatura

#### Análisis

| Tipo      | Método        | Concepto Matemático  |
| --------- | ------------- | -------------------- | --- | --- |
| `Vector2` | `length()`    | Norma euclidiana ‖v‖ |
| `Complex` | `magnitude()` | Módulo               | z   |     |

#### Contraste con Estándares

| Librería             | Vectores | Complejos                      |
| -------------------- | -------- | ------------------------------ |
| **gl-matrix**        | `length` | N/A                            |
| **three.js**         | `length` | N/A                            |
| **p5.js**            | `mag`    | N/A                            |
| **Python numpy**     | `norm`   | `abs`                          |
| **C++ std::complex** | N/A      | `abs`, `norm` (para magnitud²) |
| **Wolfram Math**     | `Norm`   | `Abs`                          |

#### Conclusión

**INTENCIONAL Y CORRECTO**:

- En **geometría/gráficos**: "length" es estándar
- En **análisis complejo**: "magnitude" o "modulus" es estándar
- Cada dominio tiene su convención aceptada
- No es redundancia, es **respeto a convenciones de dominio**

**DECISIÓN**: ✅ Mantener sin cambios. Documentar la decisión.

---

### 9.3 🔴 `lerp` Clamping - INCONSISTENCIA CRÍTICA DETECTADA

#### Estado Actual del Código

| Módulo                    | `lerp` clampea `t`? | `lerpClamped`        | `lerpUnclamped`  |
| ------------------------- | ------------------- | -------------------- | ---------------- |
| `scalar/interpolation.ts` | ❌ NO               | ✅ Existe (separado) | ❌ No existe     |
| `Vector2`                 | ❌ NO               | ✅ Existe            | ✅ Alias de lerp |
| `Matrix2`                 | ✅ **SÍ**           | ✅ Alias de lerp     | ✅ Existe        |
| `Matrix3`                 | ✅ **SÍ**           | ✅ Alias de lerp     | ✅ Existe        |
| `Complex`                 | ✅ **SÍ**           | ❌ No existe         | ❌ No existe     |
| `Rotation2`               | ✅ **SÍ**           | ❌ No existe         | ❌ No existe     |
| `Interval`                | ✅ **SÍ**           | ❌ No existe         | ❌ No existe     |
| `Transform2`              | ✅ **SÍ**           | ❌ No existe         | ❌ No existe     |

#### Problema Identificado

**INCONSISTENCIA GRAVE**: El comportamiento de `lerp` varía según el módulo:

```typescript
// Comportamiento actual INCONSISTENTE:
import { lerp } from '@lenguados/math2d/auxiliary/scalar';
import { Vector2, Matrix2 } from '@lenguados/math2d/core';

lerp(0, 10, 2); // 20 (NO clampea, permite extrapolación)
Vector2.lerp(a, b, 2); // Extrapola (NO clampea)
Matrix2.lerp(a, b, 2); // NO extrapola (SÍ clampea internamente)
Complex.lerp(a, b, 2); // NO extrapola (SÍ clampea internamente)
```

#### Contraste con Librerías Populares

| Librería             | `lerp` clampea?  | Método separado para clamped?              |
| -------------------- | ---------------- | ------------------------------------------ |
| **gl-matrix**        | ❌ NO            | ❌ No                                      |
| **three.js**         | ❌ NO            | ❌ No (usa `MathUtils.clamp` externamente) |
| **Unity Mathf.Lerp** | ❌ NO (antes sí) | ✅ `Mathf.LerpUnclamped`                   |
| **GLSL mix**         | ❌ NO            | N/A                                        |
| **HLSL lerp**        | ❌ NO            | N/A                                        |

**Conclusión de la industria**: La mayoría de librerías **NO clampean** en `lerp`, ya que:

1. Permite extrapolación útil para animación overshooting
2. El usuario controla si quiere clamping
3. Es más eficiente (sin branch extra)

#### Opciones de Resolución

| Opción | Descripción                                                               | Impacto                                                                       |
| ------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **A**  | Unificar: `lerp` NO clampea en ningún lado                                | Breaking change en Matrix2, Matrix3, Complex, Rotation2, Interval, Transform2 |
| **B**  | Unificar: `lerp` SÍ clampea en todos lados                                | Breaking change en scalar, Vector2                                            |
| **C**  | Documentar inconsistencia, no cambiar                                     | Confusión para usuarios                                                       |
| **D**  | Renombrar: `lerp` → `lerpClamped` donde clampea, agregar `lerp` unclamped | Más métodos, más claridad                                                     |

#### Recomendación

**OPCIÓN A** (lerp NO clampea):

- Alinea con estándares de la industria (gl-matrix, three.js, GLSL, HLSL)
- Permite extrapolación por defecto
- Es el comportamiento más esperado
- Usuario puede usar `lerpClamped` si necesita restricción

**CAMBIOS REQUERIDOS**:

```typescript
// Matrix2.lerp, Matrix3.lerp, Complex.lerp, Rotation2.lerp, Interval.lerp, Transform2.lerp
// ANTES:
const clamped = saturate(t);

// DESPUÉS:
// (usar t directamente sin clampear)
```

**AGREGAR** a todos los módulos que no lo tienen:

- `lerpClamped` - versión que clampea
- Mantener `lerpUnclamped` como alias para consistencia

**PRIORIDAD**: 🔴 ALTO - Inconsistencia que puede causar bugs sutiles.

---

### 9.4 `multiplyScalar` vs `scale` - Aliases de Matrices

#### Estado Actual

```typescript
// Matrix2, Matrix3
public static scale(matrix, scalar, out?);     // Escala todos los elementos
public static multiplyScalar(matrix, scalar, out?); // Alias documentado

public scale(scalar);            // Instancia
public multiplyScalar(scalar);   // Alias
```

#### Contraste con Librerías

| Librería      | Nombre Preferido |
| ------------- | ---------------- |
| **gl-matrix** | `multiplyScalar` |
| **three.js**  | `multiplyScalar` |
| **Unity**     | `*` operator     |

#### Conclusión

**INTENCIONAL**: `multiplyScalar` es más explícito (gl-matrix/three.js style), `scale` es más corto.

**DECISIÓN**: ✅ Mantener ambos. El alias es útil para diferentes estilos de código.

---

### 9.5 `ORIGIN` vs `ZERO` - Constantes Semánticas

#### Estado Actual

```typescript
public static readonly ZERO = freezeVector2(new Vector2(0, 0));
public static readonly ORIGIN = Vector2.ZERO; // Alias
```

#### Análisis

- `ZERO`: Concepto algebraico (elemento neutro de suma)
- `ORIGIN`: Concepto geométrico (punto de referencia del espacio)

#### Contraste con Librerías

| Librería      | Constante             |
| ------------- | --------------------- |
| **gl-matrix** | N/A (crea en runtime) |
| **three.js**  | N/A (crea en runtime) |
| **Unity**     | `Vector2.zero`        |
| **p5.js**     | N/A                   |

**DECISIÓN**: ✅ Mantener ambos. Son semánticamente distintos aunque apunten al mismo valor.

---

### 9.6 `toJSON` vs `toObject` - Serialización

#### Estado Actual

Todos los módulos core implementan:

```typescript
toObject(): TLike;     // Convierte a objeto plano
toJSON(): TLike;       // Alias para JSON.stringify
```

#### Análisis

- `toObject()`: Método principal para obtener representación plana
- `toJSON()`: Método especial que `JSON.stringify` llama automáticamente

#### Estándar JavaScript

`toJSON` es un método estándar reconocido por `JSON.stringify`:

```typescript
const v = new Vector2(1, 2);
JSON.stringify(v); // Llama v.toJSON() automáticamente
// Resultado: {"x":1,"y":2}
```

**DECISIÓN**: ✅ CORRECTO. Ambos son necesarios:

- `toObject()` para uso programático
- `toJSON()` para serialización automática

---

### 9.7 Resumen de Decisiones Finales

| Caso                        | Decisión              | Prioridad | Acción                                            |
| --------------------------- | --------------------- | --------- | ------------------------------------------------- |
| `mix` vs `lerp`             | ❌ **ELIMINAR `mix`** | 🟡 Media  | Eliminar de `arithmetic.ts` - no aporta valor     |
| `length` vs `magnitude`     | ✅ Correcto           | ✅ N/A    | Ninguna - respeta convenciones de dominio         |
| `lerp` clamping             | 🔴 **UNIFICAR**       | 🔴 Alta   | `lerp` NO clampea + agregar `lerpClamped` a todos |
| `multiplyScalar` vs `scale` | ✅ Correcto           | ✅ N/A    | Ninguna - aliases útiles                          |
| `ORIGIN` vs `ZERO`          | ✅ Correcto           | ✅ N/A    | Ninguna - semántica diferente                     |
| `toJSON` vs `toObject`      | ✅ Correcto           | ✅ N/A    | Ninguna - estándar JavaScript                     |

---

## 10. Plan de Ejecución Final

### Acciones a Ejecutar (Ordenadas por Prioridad)

#### 🔴 CRÍTICO - Ejecutar Inmediatamente

| #   | Acción                                       | Archivos Afectados         | Estado        |
| --- | -------------------------------------------- | -------------------------- | ------------- |
| 1   | Corregir división por cero en `smoothStep`   | `interpolation.ts:117-120` | ✅ Completado |
| 2   | Corregir división por cero en `smootherStep` | `interpolation.ts:143-146` | ✅ Completado |
| 3   | Corregir división por cero en `remap`        | `arithmetic.ts:161-170`    | ✅ Completado |
| 4   | Corregir división por cero en `quantize`     | `rounding.ts:148-160`      | ✅ Completado |

#### 🔴 ALTO - Unificar `lerp`

| #   | Acción                                | Archivos Afectados | Estado        |
| --- | ------------------------------------- | ------------------ | ------------- |
| 5   | Remover clamping de `Matrix2.lerp`    | `matrix2.ts`       | ✅ Completado |
| 6   | Remover clamping de `Matrix3.lerp`    | `matrix3.ts`       | ✅ Completado |
| 7   | Remover clamping de `Complex.lerp`    | `complex.ts`       | ✅ Completado |
| 8   | Remover clamping de `Rotation2.lerp`  | `rotation2.ts`     | ✅ Completado |
| 9   | Remover clamping de `Interval.lerp`   | `interval.ts`      | ✅ Completado |
| 10  | Remover clamping de `Transform2.lerp` | `transform2.ts`    | ✅ Completado |
| 11  | Agregar `lerpClamped` a `Complex`     | `complex.ts`       | ✅ Completado |
| 12  | Agregar `lerpClamped` a `Rotation2`   | `rotation2.ts`     | ✅ Completado |
| 13  | Agregar `lerpClamped` a `Interval`    | `interval.ts`      | ✅ Completado |
| 14  | Agregar `lerpClamped` a `Transform2`  | `transform2.ts`    | ✅ Completado |

#### 🟡 MEDIO - Limpieza de API

| #   | Acción                             | Archivos Afectados      | Estado                        |
| --- | ---------------------------------- | ----------------------- | ----------------------------- |
| 15  | Eliminar función `mix`             | `arithmetic.ts:255-274` | ✅ Completado                 |
| 16  | Actualizar exports si es necesario | `index.ts`              | ✅ N/A (mix no era exportado) |

#### 🟢 BAJO - Mejoras Futuras

| #   | Acción               | Archivos Afectados | Estado        |
| --- | -------------------- | ------------------ | ------------- |
| 17  | Unificar type guards | `types/index.ts`   | ✅ Completado |

---

## 11. Registro de Cambios Ejecutados

### Fecha: 2025-12-12

#### 🔴 Bugs Críticos Corregidos

| Archivo                    | Función        | Problema                                   | Solución                          |
| -------------------------- | -------------- | ------------------------------------------ | --------------------------------- |
| `arithmetic.ts:161-170`    | `remap`        | División por cero cuando `inMax === inMin` | Retorna midpoint del output range |
| `interpolation.ts:117-120` | `smoothStep`   | División por cero cuando `edge0 === edge1` | Usa step function behavior        |
| `interpolation.ts:143-146` | `smootherStep` | División por cero cuando `edge0 === edge1` | Usa step function behavior        |
| `rounding.ts:148-160`      | `quantize`     | División por cero cuando `max === min`     | Retorna `min`                     |

#### 🔴 Inconsistencia de `lerp` Unificada

**Cambio de comportamiento (BREAKING CHANGE):**

Antes: `lerp` clampeaba `t` a `[0, 1]` en Matrix2, Matrix3, Complex, Rotation2, Interval, Transform2.
Después: `lerp` NO clampea `t`, permitiendo extrapolación. Se agregó `lerpClamped` para cuando se necesite clamping.

| Módulo       | Cambio en `lerp`           | `lerpClamped` agregado             |
| ------------ | -------------------------- | ---------------------------------- |
| `Matrix2`    | Removido clamping          | Actualizado para clampear          |
| `Matrix3`    | Removido clamping          | Actualizado para clampear          |
| `Complex`    | Removido clamping          | ✅ Agregado (estático + instancia) |
| `Rotation2`  | Removido clamping          | ✅ Agregado (estático + instancia) |
| `Interval`   | Sin cambios (lerp interno) | ✅ Agregado (estático)             |
| `Transform2` | Removido clamping          | ✅ Agregado (estático + instancia) |

**Justificación:** Alineación con estándares de la industria (gl-matrix, three.js, GLSL, HLSL).

#### 🟡 Limpieza de API

| Archivo                 | Cambio                  | Justificación                                                                               |
| ----------------------- | ----------------------- | ------------------------------------------------------------------------------------------- |
| `arithmetic.ts:255-274` | Eliminada función `mix` | Redundante con `lerp`. No aporta beneficio GPU en JavaScript. Violaba DRY. Ver sección 9.1. |

#### Tests Actualizados

- `arithmetic.node.spec.ts`: Removidos tests de `mix`
- `rotation2.node.spec.ts`: Tests de `lerp` actualizados para nuevo comportamiento + tests de `lerpClamped`
- `transform2.node.spec.ts`: Tests de `lerp` actualizados para nuevo comportamiento + tests de `lerpClamped`
- `complex.node.spec.ts`: Tests de `lerp` actualizados para nuevo comportamiento + tests de `lerpClamped`

#### Resumen de Tests

- **Tests ejecutados**: 1921
- **Tests pasados**: 1918
- **Tests fallidos**: 0
- **Tests skipped**: 3

---

## 12. Migración para Usuarios

### Breaking Changes

#### 1. `mix` eliminado

```typescript
// ANTES
import { mix } from '@lenguados/math2d';
const result = mix(a, b, t);

// DESPUÉS
import { lerp } from '@lenguados/math2d';
const result = lerp(a, b, t);
```

#### 2. `lerp` ya no clampea (Matrix2, Matrix3, Complex, Rotation2, Transform2)

```typescript
// ANTES (clampeaba automáticamente)
Matrix2.lerp(a, b, 1.5); // Retornaba b (clamped a t=1)

// DESPUÉS (permite extrapolación)
Matrix2.lerp(a, b, 1.5); // Extrapola más allá de b

// Si necesitas clamping:
Matrix2.lerpClamped(a, b, 1.5); // Retorna b (clamped a t=1)
```

---

## 13. Revisión Post-Implementación

### Verificación de Consistencia - 2025-12-13

#### ✅ Inconsistencia Corregida Durante Revisión

| Módulo                     | Problema                               | Solución          |
| -------------------------- | -------------------------------------- | ----------------- |
| `Matrix2.lerp` (instancia) | Todavía clampeaba mientras estático no | Removido clamping |
| `Matrix3.lerp` (instancia) | Todavía clampeaba mientras estático no | Removido clamping |

#### ✅ Estado Final de `lerp` - CONSISTENTE

| Módulo       | `lerp` estático | `lerp` instancia | `lerpClamped` estático | `lerpClamped` instancia |
| ------------ | --------------- | ---------------- | ---------------------- | ----------------------- |
| `Vector2`    | ❌ NO clampea   | ❌ NO clampea    | ✅ Clampea             | ✅ Clampea              |
| `Matrix2`    | ❌ NO clampea   | ❌ NO clampea    | ✅ Clampea             | ✅ Clampea              |
| `Matrix3`    | ❌ NO clampea   | ❌ NO clampea    | ✅ Clampea             | ✅ Clampea              |
| `Complex`    | ❌ NO clampea   | ❌ NO clampea    | ✅ Clampea             | ✅ Clampea              |
| `Rotation2`  | ❌ NO clampea   | ❌ NO clampea    | ✅ Clampea             | ✅ Clampea              |
| `Interval`   | ❌ NO clampea   | ✅ Clampea\*     | ✅ Clampea             | N/A                     |
| `Transform2` | ❌ NO clampea   | ❌ NO clampea    | ✅ Clampea             | ✅ Clampea              |

\*`Interval.lerp(t)` tiene semántica diferente: interpola DENTRO del intervalo (obtiene un valor). El clampeo es correcto para este caso de uso.

#### ✅ Inconsistencia de `slerp` CORREGIDA

**Estado Anterior (Inconsistente):**
| Módulo | `slerp` clampeaba? | Problema |
| ----------- | ------------------ | --------------------------- |
| `Vector2` | ❌ NO | Correcto |
| `Rotation2` | ✅ SÍ | Inconsistente con `lerp` |
| `Complex` | ✅ SÍ | Inconsistente con `lerp` |

**Estado Actual (UNIFICADO):**
| Módulo | `slerp` | `slerpClamped` |
| ----------- | ------------- | -------------- |
| `Vector2` | ❌ NO clampea | ✅ Agregado |
| `Rotation2` | ❌ NO clampea | ✅ Agregado |
| `Complex` | ❌ NO clampea | ✅ Agregado |

**Análisis Matemático Realizado:**

```
Dado θ = π/4 (45°) entre dos vectores:
t=-0.5: extrapola ANTES del inicio (wa=1.31, wb=-0.54)
t=0.0: retorna inicio
t=0.5: punto medio
t=1.0: retorna fin
t=1.5: extrapola MÁS ALLÁ del fin (wa=-0.54, wb=1.31)
```

**Justificación del cambio:**

1. **Consistencia con `lerp`**: Si `lerp` NO clampea, `slerp` tampoco debería
2. **Estándar de industria**: gl-matrix y three.js NO clampean `slerp`
3. **Extrapolación es matemáticamente válida**: Para rotaciones, t=1.5 produce 135° entre 0° y 90°
4. **API predecible**: `*Clamped` siempre clampea, versión sin sufijo no clampea

#### ✅ Sinergia Matemática Verificada

| Concepto                     | Implementación                    | Estado       |
| ---------------------------- | --------------------------------- | ------------ |
| Interpolación lineal         | `lerp(a, b, t) = a + (b - a) * t` | ✅ Correcto  |
| Interpolación esférica       | `slerp` usa ángulos correctamente | ✅ Correcto  |
| Normalización de ángulos     | `lerpAngle` maneja wrap-around    | ✅ Correcto  |
| Protección división por cero | `smoothStep`, `remap`, `quantize` | ✅ Corregido |

#### ✅ Estándares de Industria Verificados

| Estándar                          | math2d | gl-matrix     | three.js               | GLSL/HLSL |
| --------------------------------- | ------ | ------------- | ---------------------- | --------- |
| `lerp` NO clampea                 | ✅     | ✅            | ✅                     | ✅        |
| `lerpClamped` para restricción    | ✅     | ❌ (no tiene) | ❌ (usa clamp externo) | N/A       |
| `slerp` para rotaciones           | ✅     | ✅            | ✅                     | ✅        |
| Fórmula `lerp`: `a + (b - a) * t` | ✅     | ✅            | ✅\*                   | ✅        |

_three.js usa `(1 - t) _ a + t \* b` (matemáticamente equivalente).

### Resumen Final de Cambios

| Categoría                              | Cambios                                 |
| -------------------------------------- | --------------------------------------- |
| Bugs críticos corregidos               | 4 (división por cero)                   |
| Función eliminada                      | 1 (`mix`)                               |
| `lerp` unificado                       | 8 módulos (estático + instancia)        |
| `lerpClamped` agregado                 | 4 módulos                               |
| Inconsistencia post-revisión corregida | 2 (Matrix2, Matrix3 instancia)          |
| `slerp` unificado (no clampea)         | 3 módulos (Vector2, Rotation2, Complex) |
| `slerpClamped` agregado                | 3 módulos (Vector2, Rotation2, Complex) |
| Type guards unificados                 | 7 type guards refactorizados (DRY)      |
| Property-based tests agregados         | 75 nuevos tests (Complex, Interval, Matrix2, Matrix3) |
| Simetría estático/instancia corregida  | `Complex.slerp/slerpClamped`, `Rotation2.normalize`, `Interval.divide` |
| **TRANSFORMATIONS_DESIGN implementado** | 8 cambios críticos/importantes |

### Cambios de Transformaciones (TRANSFORMATIONS_DESIGN.md)

| Módulo | Cambio | Tipo |
|--------|--------|------|
| Rotation2 | `applyToVector` → `apply` | Renombrado |
| Rotation2 | `applyInverse` | Agregado estático |
| Rotation2 | `normalizeSafe` | Agregado estático + instancia |
| Complex | `apply` | Agregado estático + instancia |
| Complex | `normalizeSafe` | Agregado estático |
| Transform2 | `transformPoint` | Agregado estático |
| Transform2 | `transformVector` | Agregado estático |
| Transform2 | `inverseTransformPoint` | Agregado estático |
| Transform2 | `inverseTransformVector` | Agregado estático + instancia |

### Tests Finales

- **1993 tests pasados** ✅ (+75 nuevos property-based tests)
- **0 tests fallidos** ✅
- **3 tests skipped** (property-based con limitaciones de precisión)

### Property-Based Tests Agregados

| Módulo | Tests Nuevos |
|--------|--------------|
| Complex | 17 |
| Interval | 18 |
| Matrix2 | 22 |
| Matrix3 | 18 |
| **Total** | **75** |

---

---

## 14. Simetría Estático vs Instancia

### Correcciones Realizadas

| Módulo | Método Agregado | Tipo |
|--------|-----------------|------|
| Complex | `slerp(a, b, t, out?)` | Estático |
| Complex | `slerpClamped(a, b, t, out?)` | Estático |
| Rotation2 | `normalize(rotation, out?)` | Estático |
| Interval | `divide(interval, scalar, out?)` | Estático |

### Asimetrías Intencionales (Por Diseño)

| Patrón | Solo en | Justificación |
|--------|---------|---------------|
| `fromArray`, `fromAngle`, etc. | Estático | Factory methods - crean nuevas instancias |
| `toArray`, `toString` | Instancia | Serialización - operan sobre `this` |
| `Interval.lerpClamped` | Estático | `lerp(t)` de instancia interpola DENTRO del intervalo (semántica diferente) |

### Estado Final

Todos los módulos core ahora tienen simetría correcta entre métodos estáticos e instancia para operaciones comunes como:
- Aritmética: `add`, `subtract`, `multiply`, `divide`, `scale`, `negate`
- Interpolación: `lerp`, `lerpClamped`, `slerp`, `slerpClamped`
- Comparación: `exactEquals`, `nearEquals`
- Utilidades: `clone`, `copy`, `normalize`, `isFinite`, `hasNaN`

---

_Documento actualizado: 2025-12-13 (simetría estático/instancia corregida)_
