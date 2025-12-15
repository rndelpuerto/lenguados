# @lenguados/math2d - Estado del Arte

> **Versión:** 1.0.0  
> **Última Actualización:** 2025-12-01  
> **Estado:** ✅ Producción

---

## 📊 Resumen Ejecutivo

`@lenguados/math2d` es una librería de matemáticas 2D de grado industrial para TypeScript/JavaScript, diseñada como base para motores de física, simulaciones y aplicaciones gráficas en tiempo real.

| Métrica                | Valor          | Estado                        |
| ---------------------- | -------------- | ----------------------------- |
| **Cobertura de Tests** | 86.72%         | 🟡 En progreso (meta: 90%)    |
| **Tests Totales**      | 1386           | ✅                            |
| **Determinismo**       | 100%           | ✅ Cross-platform garantizado |
| **Tree-shakable**      | ✅ Sí          | Zero side effects             |
| **TypeScript**         | `strict: true` | ✅ Sin `any`                  |
| **Documentación**      | TSDoc completo | ✅                            |

---

## 🏗️ Arquitectura

```
@lenguados/math2d
├── auxiliary/          # Funciones matemáticas fundamentales
│   ├── scalar/         # Operaciones escalares (lerp, clamp, etc.)
│   ├── numeric/        # Guards, safety, rounding
│   └── angle/          # Operaciones angulares
├── core/               # Tipos matemáticos principales
│   ├── vector2.ts      # Vector 2D (3124 líneas)
│   ├── matrix2.ts      # Matriz 2×2 (1135 líneas)
│   ├── matrix3.ts      # Matriz 3×3 (1130 líneas)
│   ├── rotation2.ts    # Rotación 2D (592 líneas)
│   ├── complex.ts      # Números complejos (662 líneas)
│   ├── interval.ts     # Aritmética de intervalos (730 líneas)
│   └── transform2.ts   # Transformaciones 2D (644 líneas)
├── deterministic/      # Matemáticas reproducibles
│   ├── deterministic-math.ts  # sin/cos/sqrt deterministas
│   ├── precision-math.ts      # Suma compensada (Kahan/Neumaier)
│   └── rounding-control.ts    # Control de redondeo
├── validation/         # Sistema de aserciones (estilo Box2D)
│   └── assert.ts       # Assertions desactivables
├── pool/               # Object pooling para zero-allocation
├── batch/              # Operaciones vectorizadas (SoA)
├── types/              # Interfaces y type guards
└── utils/              # Utilidades (parse, random, performance)
```

---

## 🎯 Principios de Diseño

### 1. Determinismo Cross-Platform

```typescript
// ✅ Siempre usar DeterministicMath para trigonometría
const { sin, cos } = DeterministicMath;
const angle = DeterministicMath.atan2(y, x);
const length = safeSqrt(x * x + y * y); // Delega a DeterministicMath
```

### 2. Two-Layer Protection

```
┌─────────────────────────────────────────────────┐
│ DESARROLLO: Assertions (desactivables)          │
│   assertFinite, assertRange, assertNonZero      │
└─────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────┐
│ PRODUCCIÓN: Safe Functions + Critical Throws    │
│   safeSqrt, safeDivide, throw para singulares   │
└─────────────────────────────────────────────────┘
```

### 3. API Simétrica

```typescript
// Estático (puro, control de allocación)
const sum = Vector2.add(a, b); // Nueva instancia
Vector2.add(a, b, existingVector); // Zero-alloc

// Instancia (mutable, chainable)
velocity.add(acceleration).scale(dt);
```

### 4. Hot-Path Variants

```typescript
// Estándar: Valida y maneja edge cases
v.normalize();

// Unchecked: Máxima velocidad, asume input válido
v.normalizeUnchecked();

// Safe: Retorna fallback para edge cases
v.normalizeSafe();
```

---

## 📦 Módulos

### `auxiliary/` - Funciones Fundamentales

**94 funciones** organizadas en 13 archivos con **98.32% cobertura**.

| Sub-módulo             | Funciones Clave                               |
| ---------------------- | --------------------------------------------- |
| `scalar/arithmetic`    | `lerp`, `clamp`, `saturate`, `mod`, `sign`    |
| `scalar/comparison`    | `nearEquals`, `isNearZero`, `relativeEquals`  |
| `scalar/interpolation` | `smoothStep`, `bezierInterp`, `springInterp`  |
| `scalar/constants`     | `EPSILON`, `PI`, `TAU`, `DEG_TO_RAD`          |
| `numeric/safety`       | `safeDivide`, `safeSqrt`, `safeAcos`          |
| `numeric/guards`       | `isFinite`, `isNaN`, `isDenormal`             |
| `angle/operations`     | `sinCos`, `angleDifference`, `principalAngle` |

### `core/` - Tipos Matemáticos

| Tipo         | Descripción                      | Líneas |
| ------------ | -------------------------------- | ------ |
| `Vector2`    | Vector 2D completo               | 3124   |
| `Matrix2`    | Matriz 2×2 (column-major)        | 1135   |
| `Matrix3`    | Matriz 3×3 para transformaciones | 1130   |
| `Rotation2`  | Rotación como (cos, sin)         | 592    |
| `Complex`    | Números complejos                | 662    |
| `Interval`   | Aritmética de intervalos         | 730    |
| `Transform2` | Posición + Rotación + Escala     | 644    |

### `deterministic/` - Reproducibilidad

| Clase               | Propósito                                                          |
| ------------------- | ------------------------------------------------------------------ |
| `DeterministicMath` | Lookup tables + Newton-Raphson para `sin/cos/sqrt/atan2/acos/asin` |
| `PrecisionMath`     | Sumas compensadas (Kahan/Neumaier)                                 |
| `RoundingControl`   | Modos de redondeo explícitos                                       |

**Garantías:**

- ✅ 100% de `sin/cos/sqrt/atan2/acos/asin` usan `DeterministicMath`
- ✅ Resultados idénticos en V8, SpiderMonkey, JavaScriptCore
- ✅ Reproducibilidad para replays, networking, simulaciones

### `validation/` - Assertions

```typescript
// Activas en desarrollo, desactivables en producción
setAssertionsEnabled(false); // Para producción

// Funciones disponibles
assertFinite(value, 'velocity');
assertNonZero(divisor, 'divisor');
assertRange(t, 0, 1, 't');
assertPositive(radius, 'radius');
assertNonNegative(length, 'length');
assertVector2(x, y, 'position');
assertMatrix2(m00, m01, m10, m11, 'matrix');
assertRotation2(cos, sin, 'rotation');
```

---

## 🚀 Guía de Performance

### Zero-Allocation Patterns

```typescript
// ❌ Malo: Crea objetos en cada frame
for (const entity of entities) {
 const velocity = new Vector2(vx, vy); // Allocation!
}

// ✅ Bueno: Reutiliza objetos
const temp = new Vector2();
for (const entity of entities) {
 temp.set(vx, vy);
}

// ✅ Mejor: Usa parámetro out
Vector2.add(a, b, existingVector);
```

### Object Pooling

```typescript
import { ObjectPool, Vector2 } from '@lenguados/math2d';

const pool = new ObjectPool(
 () => new Vector2(),
 (v) => v.set(0, 0),
 100,
);

const temp = pool.acquire();
// ... usar temp ...
pool.release(temp);
```

### Batch Operations

```typescript
import { Vector2Batch } from '@lenguados/math2d';

const positions = new Float32Array(2000);
const velocities = new Float32Array(2000);
const results = new Float32Array(2000);

Vector2Batch.add(positions, velocities, results, 1000);
```

### Performance Comparison

| Operación | `DeterministicMath` | Native `Math` | Ratio |
| --------- | ------------------- | ------------- | ----- |
| `sin`     | ~15ns               | ~5ns          | 3x    |
| `cos`     | ~15ns               | ~5ns          | 3x    |
| `sqrt`    | ~8ns                | ~2ns          | 4x    |
| `atan2`   | ~20ns               | ~10ns         | 2x    |

---

## 🔧 Cuándo Usar Qué

### `Math.*` vs `auxiliary` vs `DeterministicMath`

| Operación             | Usar                      | Razón                           |
| --------------------- | ------------------------- | ------------------------------- |
| `sin/cos/tan`         | `DeterministicMath`       | No determinista en `Math.*`     |
| `sqrt`                | `safeSqrt`                | Maneja negativos, determinista  |
| `atan2`               | `DeterministicMath.atan2` | No determinista en `Math.*`     |
| `acos/asin`           | `safeAcos/safeAsin`       | Clampea + determinista          |
| `floor/ceil/round`    | `Math.*`                  | IEEE 754 garantiza determinismo |
| `abs/min/max`         | `Math.*` o `auxiliary`    | Ambos son deterministas         |
| `lerp/clamp/saturate` | `auxiliary`               | Centraliza lógica               |
| Comparaciones fuzzy   | `nearEquals/isNearZero`   | Usa epsilon configurable        |

### Assertions vs Throws

```typescript
// ✅ Assertions: Errores de desarrollo (desactivables)
assertNonNegative(radius, 'radius');

// ✅ Throws: Errores críticos (siempre activos)
if (determinant === 0) {
 throw new Error('Matrix is singular');
}

// ✅ Safe functions: Fallbacks silenciosos
const result = safeDivide(a, b); // Retorna 0 si b ≈ 0
```

---

## 📈 Estado de Auditoría

### Determinismo: ✅ COMPLETO

| Función     | Usos | Determinista |
| ----------- | ---- | ------------ |
| `sin/cos`   | 14   | ✅ 100%      |
| `atan2`     | 12   | ✅ 100%      |
| `sqrt`      | ~30  | ✅ 100%      |
| `acos/asin` | 4    | ✅ 100%      |

### Cobertura de Tests por Módulo

| Módulo           | Cobertura | Estado         |
| ---------------- | --------- | -------------- |
| `auxiliary/`     | 98.32%    | ✅ Excelente   |
| `deterministic/` | 97.56%    | ✅ Excelente   |
| `validation/`    | 95.71%    | ✅ Bueno       |
| `core/`          | 79.86%    | 🟡 En progreso |
| `utils/`         | 93.69%    | ✅ Bueno       |

### Adopción de Módulos

| Módulo       | `auxiliary`  | `validation` | `DeterministicMath` |
| ------------ | ------------ | ------------ | ------------------- |
| `vector2`    | ✅ 8 imports | ✅ 2 usos    | ✅                  |
| `rotation2`  | ✅ 8 imports | ✅ 8 usos    | ✅                  |
| `matrix2`    | ✅ 6 imports | ✅ 2 usos    | ✅                  |
| `matrix3`    | ✅ 6 imports | ✅ 2 usos    | ✅                  |
| `complex`    | ✅ 8 imports | ✅ 2 usos    | ✅                  |
| `interval`   | ✅ 5 imports | ✅ 2 usos    | ✅                  |
| `transform2` | ✅ 8 imports | ✅ 5 usos    | ✅                  |

---

## 🔬 Comparación con el Mercado

| Característica           | math2d | gl-matrix | Three.js | Box2D | Rapier |
| ------------------------ | ------ | --------- | -------- | ----- | ------ |
| Determinismo             | ✅     | ❌        | ❌       | ✅    | ✅     |
| Tree-shakable            | ✅     | ✅        | ⚠️       | ❌    | ❌     |
| TypeScript nativo        | ✅     | ⚠️        | ⚠️       | ❌    | ⚠️     |
| Safe functions           | ✅     | ❌        | ⚠️       | ⚠️    | ✅     |
| Assertions desactivables | ✅     | ❌        | ❌       | ✅    | ⚠️     |
| Object pooling           | ✅     | ❌        | ⚠️       | ✅    | ✅     |
| Batch operations         | ✅     | ⚠️        | ⚠️       | ❌    | ⚠️     |
| Precision math           | ✅     | ❌        | ❌       | ❌    | ⚠️     |

---

## 📚 API Destacada: Vector2

### Constantes Inmutables

```typescript
Vector2.ZERO; // (0, 0)
Vector2.ONE; // (1, 1)
Vector2.UNIT_X; // (1, 0)
Vector2.UNIT_Y; // (0, 1)
Vector2.UNIT_DIAGONAL; // (1/√2, 1/√2)
```

### Factories

```typescript
Vector2.fromValues(x, y, out?)
Vector2.fromAngle(angle, radius?, out?)
Vector2.fromArray(array, offset?, out?)
Vector2.fromObject({ x, y }, out?)
Vector2.fromComplex(complex, out?)
```

### Operaciones Clave

```typescript
// Geometría
Vector2.dot(a, b)           // Producto escalar
Vector2.cross(a, b)         // Producto cruz 2D
Vector2.length(v)           // Magnitud
Vector2.distance(a, b)      // Distancia euclidiana

// Transformaciones
Vector2.normalize(v, out?)
Vector2.rotate(v, angle, out?)
Vector2.project(v, axis, out?)
Vector2.reflect(v, normal, out?)
Vector2.slerp(a, b, t, out?)

// Integración con otros tipos
Vector2.applyRotation(v, rotation, out?)
Vector2.applyMatrix2(v, matrix, out?)
Vector2.applyTransform(v, transform, out?)
```

### Hot-Path Variants

```typescript
v.normalizeUnchecked(); // Sin validación
v.divideScalarUnchecked(s); // Sin validación
```

---

## 🛠️ Desarrollo

### Estructura de Tests

```
packages/math2d/test/
├── auxiliary/       # Tests de funciones auxiliares
├── core/            # Tests de tipos principales
├── deterministic/   # Tests de determinismo
├── validation/      # Tests de assertions
└── utils/           # Tests de utilidades
```

### Ejecutar Tests

```bash
npm run test              # Todos los tests
npm run test:coverage     # Con cobertura
npm run test -- --watch   # Modo watch
```

### Build

```bash
npm run build             # Compilar
npm run lint              # Verificar estilo
npm run typecheck         # Verificar tipos
```

---

## 📋 Roadmap

### ✅ Completado

- [x] Determinismo 100% para funciones trigonométricas
- [x] Sistema de assertions estilo Box2D
- [x] Object pooling
- [x] Batch operations con SoA layout
- [x] API completa de Vector2 (3124 líneas)
- [x] Integración Transform2/Matrix2/Rotation2

### 🔄 En Progreso

- [ ] Cobertura de tests: 86.72% → 90%
- [ ] Documentación de API pública

### 📅 Planificado

- [ ] SIMD support (Vector2BatchSimd)
- [ ] Web Workers support
- [ ] Continuous collision detection (CCD)

---

## 📖 Referencias

### Fuentes Primarias

- IEEE 754-2019: Standard for Floating-Point Arithmetic
- Box2D Manual (Erin Catto)
- Bullet Physics User Manual
- "What Every Computer Scientist Should Know About Floating-Point Arithmetic" (Goldberg)

### Librerías Analizadas

- gl-matrix (WebGL)
- Three.js (3D Graphics)
- Planck.js (Box2D port)
- Matter.js (2D Physics)
- Rapier (Rust physics)

---

## 🏆 Calidad

| Criterio                     | Estado |
| ---------------------------- | ------ |
| ✅ Tests: 1386 pasando       |        |
| ✅ Build: Sin warnings       |        |
| ✅ Linting: Sin errores      |        |
| ✅ TypeScript strict         |        |
| ✅ Zero `any`                |        |
| ✅ TSDoc completo            |        |
| ✅ Código legacy: Ninguno    |        |
| ✅ Código duplicado: Ninguno |        |

**El paquete está listo para uso en producción.**

---

_Documentación consolidada de: COMPREHENSIVE_AUDIT_2025.md, DETERMINISTIC_AUDIT_REPORT.md, PERFORMANCE.md, SEMANTIC_API_DESIGN.md, AUXILIARY_ADOPTION_PLAN.md, VALIDATION_ADOPTION_PLAN.md, VECTOR2_API_COMPARISON.md_
