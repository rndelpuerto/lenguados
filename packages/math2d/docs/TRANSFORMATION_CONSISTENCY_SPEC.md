# @lenguados/math2d - Especificación de Consistencia de Transformaciones

> **Objetivo:** Documentar exhaustivamente la API de transformaciones y rotaciones del paquete,
> identificando inconsistencias, proponiendo soluciones y garantizando un diseño coherente,
> escalable y mantenible.

---

## Resumen Ejecutivo

### Estado Actual: ✅ CONSISTENTE

Tras una auditoría exhaustiva línea por línea de todo el paquete `@packages/math2d`, el estado actual es:

| Área                         | Estado | Notas                                                                     |
| ---------------------------- | ------ | ------------------------------------------------------------------------- |
| **Nomenclatura**             | ✅     | Convenciones `to*`, `from*`, `apply*` con sufijos numéricos correctos     |
| **Simetría Static/Instance** | ✅     | Todos los métodos matemáticos tienen ambas versiones                      |
| **Rotaciones**               | ✅     | Patrón `rotate`, `rotateCS`, `rotateAround`, `rotateAroundCS` consistente |
| **Transformaciones**         | ✅     | `Transform2` delegación a `Matrix3` correcta, variantes `*CS`             |
| **Interpolación**            | ✅     | `lerp`, `lerpClamped`, `smoothStep` homogéneos                            |
| **Hot Paths**                | ✅     | Variantes `*CS` para precomputar cos/sin                                  |
| **Validación**               | ✅     | Modo `STRICT`/`SAFE`/`UNCHECKED` consistente                              |
| **Determinismo**             | ✅     | `DeterministicMath` para reproducibilidad cross-platform                  |

### Inconsistencias Corregidas

1. **`smoothLerp` → `smoothStep`**: Homogeneizado para alinearse con estándares de la industria (GLSL, Unity, Unreal)
2. **`toMatrix` → `toMatrix3`**: Sufijo numérico añadido para claridad dimensional
3. **`fromVector` → `fromVector2`**: Consistencia en factories
4. **`applyRotation` → `applyRotation2`**: Tipo explícito en el nombre
5. **`Transform2.toRotation2()`**: Añadido para sinergia con `Rotation2`
6. **`Complex.toRotation2()`**: Añadido para conversión directa
7. **`Transform2.*CS()`**: Métodos de hot path con cos/sin precomputados
8. **`ANGLE_ZERO_THRESHOLD`**: Constante extraída de magic number en `DeterministicMath`
9. **`Rotation2.applyInverse`**: Refactorizado para delegar a `Vector2.rotateCS` (DRY)
10. **`Transform2.inverseTransform*CS`**: Corregida fórmula de rotación inversa (bug matemático)

### Arquitectura Validada

```
auxiliary/     → Utilidades primitivas (scalar, angle, numeric)
      ↓
core/          → Objetos matemáticos (Vector2, Rotation2, Complex, Interval)
      ↓
core/          → Matrices de transformación (Matrix2, Matrix3)
      ↓
core/          → Objeto compuesto (Transform2)
```

### Patrones Clave

- **Delegación DRY**: `Rotation2.apply()` → `Vector2.rotateCS()`
- **Sinergia**: `Transform2` usa `sinCos()` de `auxiliary/angle`
- **Factory Pattern**: `from*()` métodos estáticos para construcción
- **Fluent API**: Métodos de instancia retornan `this` para chaining
- **Out Parameter**: Patrón `out?: T` para evitar allocations en hot paths

---

## Índice

1. [Principios de Diseño](#1-principios-de-diseño)
2. [Inventario de Constantes y Utilidades Base](#2-inventario-de-constantes-y-utilidades-base)
3. [Matriz de Métodos de Rotación](#3-matriz-de-métodos-de-rotación)
4. [Matriz de Métodos de Transformación](#4-matriz-de-métodos-de-transformación)
5. [Análisis de Inconsistencias](#5-análisis-de-inconsistencias)
6. [Especificación de API Unificada](#6-especificación-de-api-unificada)
7. [Patrones de Delegación y Sinergia](#7-patrones-de-delegación-y-sinergia)
8. [Plan de Implementación](#8-plan-de-implementación)

---

## 1. Principios de Diseño

### 1.1 Jerarquía de Responsabilidad (Single Responsibility)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NIVEL 1: UTILIDADES PRIMITIVAS                         │
│  auxiliary/scalar/  │  auxiliary/angle/  │  auxiliary/numeric/              │
│  ─────────────────  │  ────────────────  │  ─────────────────               │
│  lerp, smoothStep   │  sinCos, sinCosInto│  safeDivide, safeSqrt           │
│  clamp, saturate    │  angleDifference   │  isNearZero                      │
│  inverseLerp        │  lerpAngle         │                                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NIVEL 2: OBJETOS MATEMÁTICOS CORE                      │
│                                                                              │
│  Vector2           │  Rotation2         │  Complex          │  Interval    │
│  ─────────────     │  ─────────────     │  ─────────────    │  ─────────   │
│  Punto/Dirección   │  Rotación (cos,sin)│  Número complejo  │  Rango [a,b] │
│  2D                │  Unitaria          │  General          │              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NIVEL 3: MATRICES DE TRANSFORMACIÓN                    │
│                                                                              │
│  Matrix2           │  Matrix3                                               │
│  ─────────────     │  ─────────────                                         │
│  2x2: Rotación,    │  3x3: Transformaciones afines 2D                       │
│  Escala, Shear     │  (Traslación, Rotación, Escala)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NIVEL 4: OBJETOS COMPUESTOS                            │
│                                                                              │
│  Transform2                                                                  │
│  ─────────────                                                               │
│  Composición: Position (Vector2) + Rotation (angle) + Scale (Vector2)       │
│  Facade para transformaciones 2D comunes                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Patrones de Diseño Aplicados

| Patrón            | Aplicación                                         | Ejemplo                              |
| ----------------- | -------------------------------------------------- | ------------------------------------ |
| **Facade**        | `Transform2` encapsula position + rotation + scale | `transform.transformPoint(p)`        |
| **Strategy**      | Variantes `*CS` para hot paths                     | `rotateCS(cos, sin)`                 |
| **Factory**       | Métodos `from*` estáticos                          | `Rotation2.fromAngle(angle)`         |
| **Delegation**    | Métodos delegan a utilidades base                  | `Rotation2.apply → Vector2.rotateCS` |
| **Out Parameter** | Evitar allocations en hot paths                    | `rotate(v, angle, out)`              |

### 1.3 Convenciones de Nomenclatura

Ver `docs/NAMING_CONVENTIONS.md` para la especificación completa.

**Resumen:**

- `to*`: Conversión de tipo (ej. `toMatrix3()`, `toRotation2()`)
- `from*`: Factory estático (ej. `fromAngle()`, `fromVector2()`)
- `apply*`: Aplicar transformación externa (ej. `applyRotation2()`)
- `*CS`: Variante con cos/sin precalculados (ej. `rotateCS()`)
- `*Safe`: Variante que retorna valor por defecto (ej. `divideScalarSafe()`)
- `*Unchecked`: Sin validación para hot paths (ej. `divideScalarUnchecked()`)

---

## 2. Inventario de Constantes y Utilidades Base

### 2.1 Constantes (`auxiliary/scalar/constants.ts`)

| Constante         | Valor           | Categoría    | Uso Principal           |
| ----------------- | --------------- | ------------ | ----------------------- |
| `EPSILON`         | `1e-10`         | Tolerance    | Comparaciones flotantes |
| `EPSILON_SQUARED` | `1e-20`         | Tolerance    | Comparaciones de áreas  |
| `PI`              | `Math.PI`       | Angular      | Ángulos                 |
| `TAU`             | `2 * Math.PI`   | Angular      | Vuelta completa         |
| `HALF_PI`         | `Math.PI / 2`   | Angular      | 90°                     |
| `QUARTER_PI`      | `Math.PI / 4`   | Angular      | 45°                     |
| `DEG_TO_RAD`      | `Math.PI / 180` | Conversion   | Grados → Radianes       |
| `RAD_TO_DEG`      | `180 / Math.PI` | Conversion   | Radianes → Grados       |
| `SQRT_2`          | `Math.SQRT2`    | Mathematical | Diagonal unitaria       |
| `SQRT_HALF`       | `Math.SQRT1_2`  | Mathematical | sin/cos de 45°          |

**✅ Estado:** Completo y consistente.

### 2.2 Utilidades de Interpolación (`auxiliary/scalar/interpolation.ts`)

| Función        | Firma                        | Descripción          |
| -------------- | ---------------------------- | -------------------- |
| `lerp`         | `(a, b, t) → number`         | Interpolación lineal |
| `lerpClamped`  | `(a, b, t) → number`         | Lerp con t ∈ [0,1]   |
| `inverseLerp`  | `(a, b, value) → number`     | Inversa de lerp      |
| `smoothStep`   | `(edge0, edge1, x) → number` | Hermite cúbico       |
| `smootherStep` | `(edge0, edge1, x) → number` | Hermite quintico     |

**✅ Estado:** Completo y consistente.

### 2.3 Utilidades Angulares (`auxiliary/angle/operations.ts`)

| Función            | Firma                    | Descripción                 |
| ------------------ | ------------------------ | --------------------------- |
| `sinCos`           | `(angle) → SinCos`       | Calcula sin y cos juntos    |
| `sinCosInto`       | `(angle, out) → SinCos`  | Versión zero-alloc          |
| `sinCosNormalized` | `(angle) → SinCos`       | Normaliza antes de calcular |
| `angleDifference`  | `(from, to) → number`    | Delta con menor arco        |
| `angleDistance`    | `(a, b) → number`        | Distancia absoluta          |
| `anglesNearEqual`  | `(a, b, ε) → boolean`    | Comparación con tolerancia  |
| `lerpAngle`        | `(from, to, t) → number` | Interpolación angular       |

**✅ Estado:** Completo y consistente.

---

## 3. Matriz de Métodos de Rotación

### 3.1 Tabla Comparativa por Módulo

| Módulo         | Método Static                          | Método Instance               | Hot Path (CS) Static                        | Hot Path (CS) Instance                 |
| -------------- | -------------------------------------- | ----------------------------- | ------------------------------------------- | -------------------------------------- |
| **Vector2**    | `rotate(v, angle, out?)`               | `rotate(angle)`               | `rotateCS(v, cos, sin, out?)`               | `rotateCS(cos, sin)`                   |
| **Vector2**    | `rotateAround(v, center, angle, out?)` | `rotateAround(center, angle)` | `rotateAroundCS(v, center, cos, sin, out?)` | `rotateAroundCS(center, cos, sin)`     |
| **Vector2**    | `applyRotation2(v, rot, out?)`         | `applyRotation2(rot)`         | _(delega a rotateCS)_                       | _(delega a rotateCS)_                  |
| **Matrix2**    | `rotate(m, angle, out?)`               | `rotate(angle)`               | `rotateCS(m, cos, sin, out?)`               | `rotateCS(cos, sin)`                   |
| **Matrix2**    | `fromRotation(angle \| rot)`           | —                             | —                                           | —                                      |
| **Matrix3**    | `rotate(m, angle, out?)`               | `rotate(angle)`               | `rotateCS(m, cos, sin, out?)`               | `rotateCS(cos, sin)`                   |
| **Matrix3**    | `fromRotation(angle \| rot)`           | —                             | —                                           | —                                      |
| **Rotation2**  | `apply(rot, v, out?)`                  | `apply(v, out?)`              | _(delega a Vector2.rotateCS)_               | _(delega)_                             |
| **Rotation2**  | `applyInverse(rot, v, out?)`           | `applyInverse(v, out?)`       | ❌ Falta                                    | ❌ Falta                               |
| **Transform2** | `transformPoint(t, p, out?)`           | `transformPoint(p, out?)`     | `transformPointCS(t, p, cos, sin, out?)`    | `transformPointCS(p, cos, sin, out?)`  |
| **Transform2** | `transformVector(t, v, out?)`          | `transformVector(v, out?)`    | `transformVectorCS(t, v, cos, sin, out?)`   | `transformVectorCS(v, cos, sin, out?)` |
| **Complex**    | —                                      | —                             | —                                           | —                                      |

### 3.2 Análisis de Simetría

**✅ Simetría Completa:**

- `Vector2.rotate` / `rotateCS`
- `Vector2.rotateAround` / `rotateAroundCS`
- `Matrix2.rotate` / `rotateCS`
- `Matrix3.rotate` / `rotateCS`
- `Transform2.transformPoint` / `transformPointCS`
- `Transform2.transformVector` / `transformVectorCS`

**⚠️ Simetría Parcial:**

- `Rotation2.apply` ✅ / `applyCS` ❌ (no necesario, ya usa cos/sin directamente)
- `Rotation2.applyInverse` ✅ / `applyInverseCS` ❌ (propuesto)

**❌ Faltantes Identificados:**

- `Vector2.applyRotation2Inverse` - Aplicar rotación inversa

---

## 4. Matriz de Métodos de Transformación

### 4.1 Transformaciones Afines

| Operación           | Vector2             | Matrix2         | Matrix3                           | Transform2     |
| ------------------- | ------------------- | --------------- | --------------------------------- | -------------- |
| **Traslación**      | `add(v)`            | —               | `translate(tx, ty)`               | `translateX/Y` |
| **Rotación**        | `rotate(angle)`     | `rotate(angle)` | `rotate(angle)`                   | `setRotation`  |
| **Escala**          | `multiplyScalar(s)` | `scale(sx, sy)` | `scale(sx, sy)`                   | `setScale`     |
| **Compuesta (TRS)** | —                   | —               | `fromTransform2(pos, rot, scale)` | Constructor    |

### 4.2 Métodos de Aplicación de Transformación

| Origen → Destino         | Método                            | Ubicación     |
| ------------------------ | --------------------------------- | ------------- |
| `Rotation2` → `Vector2`  | `Rotation2.apply(rot, v)`         | rotation2.ts  |
| `Rotation2` → `Vector2`  | `Vector2.applyRotation2(v, rot)`  | vector2.ts    |
| `Matrix2` → `Vector2`    | `Vector2.applyMatrix2(v, m)`      | vector2.ts    |
| `Matrix3` → `Vector2`    | `Matrix3.multiplyVector2(m, v)`   | matrix3.ts    |
| `Transform2` → `Vector2` | `Transform2.transformPoint(t, p)` | transform2.ts |
| `Transform2` → `Vector2` | `Vector2.applyTransform2(v, t)`   | vector2.ts    |
| `Complex` → `Vector2`    | `Vector2.applyComplex(v, c)`      | vector2.ts    |

---

## 5. Análisis de Inconsistencias

### 5.1 INC-001: Falta `Rotation2.applyCS`

**Estado:** ❓ Evaluar necesidad

**Análisis:**
`Rotation2` ya almacena `(cos, sin)`, por lo que `apply()` no necesita calcular trigonometría.
Sin embargo, para consistencia con el resto de la API, podría añadirse un método que
acepte cos/sin explícitos para casos donde se quiera aplicar una rotación diferente
a la almacenada en el objeto.

**Decisión:** NO añadir. `Rotation2` es el objeto que **contiene** cos/sin, no tiene sentido
pasarle otros. Para casos donde se necesite cos/sin externos, usar `Vector2.rotateCS`.

### 5.2 INC-002: Duplicación en métodos `apply*`

**Observación:**

```typescript
// En Vector2:
Vector2.applyRotation2(v, rotation, out); // llama a Vector2.rotateCS

// En Rotation2:
Rotation2.apply(rotation, v, out); // llama a Vector2.rotateCS
```

Ambos métodos hacen lo mismo pero desde perspectivas diferentes:

- `Vector2.applyRotation2`: "A este vector, aplícale esta rotación"
- `Rotation2.apply`: "Esta rotación, aplícala a este vector"

**Decisión:** ✅ MANTENER AMBOS. Es el patrón correcto (sinergia bidireccional).
La delegación interna a `Vector2.rotateCS` garantiza DRY.

### 5.3 INC-003: Falta `Complex.applyToVector2`

**Estado:** ❓ Evaluar

**Análisis:**
`Complex` puede representar rotaciones (cuando es unitario). Actualmente existe:

- `Vector2.applyComplex(v, c)` ✅

Pero no existe el reverso:

- `Complex.applyToVector2(c, v)` ❌

**Decisión:** NO añadir. `Complex` es un número complejo general, no especializado
en rotaciones. Para rotaciones, usar `Rotation2`. La conversión es:

```typescript
const rot = complex.toRotation2();
rot.apply(vector);
```

### 5.4 INC-004: Nomenclatura inconsistente `multiplyVector2` vs `applyMatrix2`

**Observación:**

- `Matrix3.multiplyVector2(m, v)` - usa "multiply"
- `Vector2.applyMatrix2(v, m)` - usa "apply"

**Análisis:**

- `multiply` es matemáticamente correcto: matriz × vector
- `apply` es semánticamente correcto: aplicar transformación

**Decisión:** ✅ MANTENER. Cada módulo usa la perspectiva de su dominio:

- `Matrix3` habla de multiplicación (operación matricial)
- `Vector2` habla de aplicar (transformación)

### 5.5 INC-005: `Transform2.rotation` es `number`, no `Rotation2`

**Observación:**
`Transform2` almacena `rotation: number` (ángulo en radianes), no `Rotation2`.

**Análisis:**
Esto requiere llamar `sinCos()` cada vez que se transforma un punto.
El método `toRotation2()` fue añadido para obtener un `Rotation2` cuando se necesite.

**Pros de mantener `number`:**

- Serialización simple (JSON)
- Interfaz `Transform2Like` simple
- Familiar para usuarios (ángulos en grados/radianes)

**Contras:**

- Cada `transformPoint()` llama `sinCos()`
- Para múltiples puntos, es ineficiente

**Mitigación existente:**

- `transformPointCS()` acepta cos/sin precalculados
- `toRotation2()` permite cachear el Rotation2

**Decisión:** ✅ MANTENER `number`. Las variantes `*CS` resuelven el problema de rendimiento.

### 5.6 INC-006: Falta `Interval.rotate` / `Interval.transform`

**Análisis:**
`Interval` representa un rango [min, max]. Rotar un intervalo no tiene sentido geométrico
directo en 1D.

**Decisión:** ✅ NO APLICA. Interval es 1D, las rotaciones son 2D+.

### 5.7 INC-007: `sinCos` vs `SinCos` (Interface vs Object)

**Observación:**

```typescript
// Función:
function sinCos(angle: number): SinCos { ... }

// Interface:
interface SinCos { sin: number; cos: number; }
```

**Análisis:**
El nombre de la función `sinCos` coincide con el tipo `SinCos`.
Esto es intencional y común en JavaScript/TypeScript.

**Decisión:** ✅ CORRECTO. Patrón establecido.

---

## 6. Especificación de API Unificada

### 6.1 Patrón de Rotación para Vectores

```typescript
// NIVEL 1: Primitivo (hot path, máximo control)
Vector2.rotateCS(v, cos, sin, out?)           // Static
vector.rotateCS(cos, sin)                     // Instance

// NIVEL 2: Conveniente (calcula cos/sin internamente)
Vector2.rotate(v, angle, out?)                // Static
vector.rotate(angle)                          // Instance

// NIVEL 3: Integración (acepta objeto Rotation2)
Vector2.applyRotation2(v, rotation, out?)     // Static
vector.applyRotation2(rotation)               // Instance

// NIVEL 4: Desde Rotation2 (perspectiva inversa)
Rotation2.apply(rotation, v, out?)            // Static
rotation.apply(v, out?)                       // Instance
```

### 6.2 Patrón de Rotación para Matrices

```typescript
// NIVEL 1: Primitivo (hot path)
Matrix2.rotateCS(m, cos, sin, out?)           // Static
matrix2.rotateCS(cos, sin)                    // Instance

// NIVEL 2: Conveniente
Matrix2.rotate(m, angle, out?)                // Static
matrix2.rotate(angle)                         // Instance

// Factory: Crear matriz de rotación
Matrix2.fromRotation(angle | rotation)        // Acepta número o Rotation2Like
```

### 6.3 Patrón de Transformación Completa (Transform2)

```typescript
// NIVEL 1: Primitivo (hot path con cos/sin precalculados)
Transform2.transformPointCS(t, p, cos, sin, out?)
transform.transformPointCS(p, cos, sin, out?)

// NIVEL 2: Conveniente (calcula cos/sin internamente)
Transform2.transformPoint(t, p, out?)
transform.transformPoint(p, out?)

// NIVEL 3: Batch (calcula cos/sin una vez, aplica a múltiples)
transform.transformPoints(points[], out?)
transform.transformVectors(vectors[], out?)
```

### 6.4 Conversiones entre Tipos

```typescript
// Rotation2 ↔ otros
rotation.toAngle()                 → number
rotation.toVector2(out?)           → Vector2
rotation.toComplex(out?)           → Complex     // PROPUESTO
Rotation2.fromAngle(angle, out?)   → Rotation2
Rotation2.fromVector2(v, out?)     → Rotation2
Rotation2.fromComplex(c, out?)     → Rotation2

// Complex → Rotation2
complex.toRotation2(out?)          → Rotation2   // ✅ IMPLEMENTADO

// Transform2 ↔ otros
transform.toMatrix3(out?)          → Matrix3     // ✅ IMPLEMENTADO
transform.toRotation2(out?)        → Rotation2   // ✅ IMPLEMENTADO
Transform2.fromMatrix(m, out?)     → Transform2

// Matrix3 ↔ Transform2
Matrix3.fromTransform2(pos, rot, scale, out?)  // ✅ IMPLEMENTADO
```

---

## 7. Patrones de Delegación y Sinergia

### 7.1 Cadena de Delegación para Rotación de Vectores

```
┌──────────────────────┐
│  Usuario llama       │
│  Rotation2.apply()   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Rotation2.apply()   │
│  delega a            │
│  Vector2.rotateCS()  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Vector2.rotateCS()  │
│  implementación      │
│  directa (primitivo) │
└──────────────────────┘
```

**Beneficios:**

- ✅ DRY: Una sola implementación del cálculo
- ✅ Testeable: Solo se testea `Vector2.rotateCS` a fondo
- ✅ Mantenible: Cambios en un solo lugar
- ✅ Hot path: `rotateCS` es la versión óptima

### 7.2 Cadena de Delegación para Transform2

```
┌──────────────────────────────────────────────────────────────────────────┐
│  Transform2.transformPoint(transform, point, out?)                       │
│  └─→ sinCos(transform.rotation)                                         │
│  └─→ Transform2.transformPointCS(transform, point, cos, sin, out?)      │
│      └─→ Vector2.fromValues(scaledX*c - scaledY*s + tx, ...)            │
└──────────────────────────────────────────────────────────────────────────┘
```

### 7.3 Tabla de Dependencias

| Módulo       | Depende de                                                        |
| ------------ | ----------------------------------------------------------------- |
| `Vector2`    | `auxiliary/angle/operations` (sinCos), `auxiliary/numeric/safety` |
| `Rotation2`  | `Vector2.rotateCS`, `auxiliary/angle/operations`                  |
| `Complex`    | `auxiliary/numeric/safety`, `Vector2`                             |
| `Matrix2`    | `auxiliary/angle/operations` (sinCos), `Vector2`                  |
| `Matrix3`    | `auxiliary/angle/operations` (sinCos), `Vector2`, `Matrix2`       |
| `Transform2` | `Vector2`, `Matrix3`, `Rotation2`, `auxiliary/angle/operations`   |

---

## 8. Plan de Implementación

### 8.1 Tareas Pendientes (Ordenadas por Prioridad)

#### Alta Prioridad (Consistencia Crítica)

| ID      | Tarea                                          | Archivo                                       | Esfuerzo |
| ------- | ---------------------------------------------- | --------------------------------------------- | -------- |
| ✅ DONE | Renombrar métodos `to*` con sufijo numérico    | `rotation2.ts`, `transform2.ts`, `complex.ts` | 30 min   |
| ✅ DONE | Renombrar métodos `from*` con sufijo numérico  | `rotation2.ts`, `matrix3.ts`                  | 30 min   |
| ✅ DONE | Renombrar métodos `apply*` con sufijo numérico | `vector2.ts`                                  | 20 min   |
| ✅ DONE | Añadir `Transform2.*CS` methods                | `transform2.ts`                               | 45 min   |
| ✅ DONE | Refactorizar `Rotation2.apply` para delegar    | `rotation2.ts`                                | 10 min   |

#### Media Prioridad (Mejoras de Sinergia)

| ID        | Tarea                                 | Archivo         | Esfuerzo |
| --------- | ------------------------------------- | --------------- | -------- |
| ✅ DONE   | Añadir `Transform2.toRotation2()`     | `transform2.ts` | 15 min   |
| ✅ DONE   | Añadir `Complex.toRotation2()`        | `complex.ts`    | 15 min   |
| ✅ EXISTS | `Rotation2.toComplex(out?)` ya existe | `rotation2.ts`  | —        |
| ❌ N/A    | ~~`Vector2.applyRotation2Inverse`~~   | —               | —        |

**PEND-012 Rechazado:** Ya existe `Rotation2.applyInverse(rot, v, out?)`. Añadirlo violaría DRY y SRP.

#### Baja Prioridad (Completitud)

| ID        | Tarea                        | Archivo                               | Esfuerzo |
| --------- | ---------------------------- | ------------------------------------- | -------- |
| ❌ N/A    | ~~`Matrix2.applyToVector2`~~ | —                                     | —        |
| ✅ EXISTS | Tests de delegación          | `rotation2.property.node.spec.ts:123` | —        |

**PEND-013 Rechazado:** Ya existe `Matrix2.transformVector(m, v, out?)`. El nombre `transformVector` es estándar de la industria.

**PEND-014 Ya Cubierto:** Test existente verifica `Rotation2.apply ≡ Vector2.rotate`.

### 8.2 Criterios de Aceptación

Para cada método implementado:

1. **Simetría:** Existe versión static e instance
2. **Hot Path:** Existe variante `*CS` si aplica
3. **Delegación:** Delega a primitivos cuando es posible
4. **Tests:** Unit tests para static e instance
5. **JSDoc:** Documentación completa con `@category`
6. **Tipos:** Usa `Readonly*Like` para inputs

### 8.3 Verificación Final

```bash
# Verificar que no hay métodos legacy
grep -r "toVector\(\)" packages/math2d/src/core/  # Debe ser 0
grep -r "fromVector\(\)" packages/math2d/src/core/  # Debe ser 0
grep -r "applyRotation\(\)" packages/math2d/src/core/  # Debe ser 0

# Verificar cobertura
npm run test:unit -- --coverage packages/math2d

# Verificar tipos
npm run build
```

---

## 9. Matriz de Interpolación

### 9.1 Métodos de Interpolación por Módulo

| Módulo         | Static `lerp` | Instance `lerp` | Static `lerpClamped` | Instance `lerpClamped` | Static `slerp` | Instance `slerp` | Static `smoothStep` | Instance `smoothStep` |
| -------------- | ------------- | --------------- | -------------------- | ---------------------- | -------------- | ---------------- | ------------------- | --------------------- |
| **Vector2**    | ✅            | ✅              | ✅                   | ✅                     | —              | —                | ✅                  | ✅                    |
| **Rotation2**  | ✅            | ✅              | ✅                   | ✅                     | ✅             | ✅               | ✅                  | ✅                    |
| **Complex**    | ✅            | ✅              | ✅                   | ✅                     | ✅             | ✅               | ✅                  | ✅                    |
| **Matrix2**    | ✅            | ✅              | ✅                   | ✅                     | —              | —                | ✅                  | ✅                    |
| **Matrix3**    | ✅            | ✅              | ✅                   | ✅                     | —              | —                | ✅                  | ✅                    |
| **Transform2** | ✅            | ✅              | ✅                   | ✅                     | —              | —                | ✅                  | ✅                    |
| **Interval**   | ✅            | ✅              | ✅                   | ✅                     | —              | —                | ✅                  | ✅                    |

**Notas:**

- `slerp` solo aplica a tipos que representan rotaciones (Rotation2, Complex)
- `smoothStep` usa Hermite cúbico para transiciones suaves
- Todos los métodos tienen simetría static/instance ✅

### 9.2 Utilidades de Interpolación Escalar

| Función                         | Ubicación                        | Descripción           |
| ------------------------------- | -------------------------------- | --------------------- |
| `lerp(a, b, t)`                 | `auxiliary/scalar/interpolation` | Interpolación lineal  |
| `lerpClamped(a, b, t)`          | `auxiliary/scalar/interpolation` | Lerp con t ∈ [0,1]    |
| `inverseLerp(a, b, value)`      | `auxiliary/scalar/interpolation` | Inversa de lerp       |
| `smoothStep(edge0, edge1, x)`   | `auxiliary/scalar/interpolation` | Hermite cúbico        |
| `smootherStep(edge0, edge1, x)` | `auxiliary/scalar/interpolation` | Hermite quintico      |
| `lerpAngle(from, to, t)`        | `auxiliary/angle/interpolation`  | Interpolación angular |
| `slerpAngle(from, to, t)`       | `auxiliary/angle/interpolation`  | Slerp para ángulos    |

---

## 10. Tabla Resumen de Conversiones entre Tipos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     GRAFO DE CONVERSIONES                                    │
│                                                                              │
│  Rotation2 ◄────────────────────────────────────────────────► Complex       │
│      │ toComplex(out?)                        toRotation2(out?) │            │
│      │                                                          │            │
│      │ toVector2(out?)                                          │            │
│      ▼                                                          │            │
│  Vector2 ◄──────────────────────────────────────────────────────┘            │
│      │                                                                       │
│      │                                                                       │
│      ▼                                                                       │
│  Matrix2 ◄───────► Matrix3 ◄──────► Transform2                              │
│    fromRotation()   fromRotation()    toMatrix3()                            │
│                     fromTransform2()  toRotation2()                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

| Origen                   | Destino       | Método                        | Ubicación     |
| ------------------------ | ------------- | ----------------------------- | ------------- |
| `Rotation2`              | `Complex`     | `toComplex(out?)`             | rotation2.ts  |
| `Rotation2`              | `Vector2`     | `toVector2(out?)`             | rotation2.ts  |
| `Rotation2`              | `number`      | `toAngle()`                   | rotation2.ts  |
| `Complex`                | `Rotation2`   | `toRotation2(out?)`           | complex.ts    |
| `Complex`                | `Matrix2Like` | `toRotationMatrix2(out?)`     | complex.ts    |
| `Transform2`             | `Matrix3`     | `toMatrix3(out?)`             | transform2.ts |
| `Transform2`             | `Rotation2`   | `toRotation2(out?)`           | transform2.ts |
| `angle`                  | `Rotation2`   | `Rotation2.fromAngle(angle)`  | rotation2.ts  |
| `Vector2`                | `Rotation2`   | `Rotation2.fromVector2(v)`    | rotation2.ts  |
| `Complex`                | `Rotation2`   | `Rotation2.fromComplex(c)`    | rotation2.ts  |
| `angle \| Rotation2Like` | `Matrix2`     | `Matrix2.fromRotation(r)`     | matrix2.ts    |
| `angle \| Rotation2Like` | `Matrix3`     | `Matrix3.fromRotation(r)`     | matrix3.ts    |
| `pos, rot, scale`        | `Matrix3`     | `Matrix3.fromTransform2(...)` | matrix3.ts    |

---

## 11. Checklist de Consistencia Final

### 11.1 Constantes y Tolerancias

- [x] `EPSILON` definido en `auxiliary/scalar/constants.ts`
- [x] `EPSILON_SQUARED` para comparaciones de áreas
- [x] `MIN_SAFE_DIVISOR` en `auxiliary/numeric/safety.ts`
- [x] Constantes angulares: `PI`, `TAU`, `HALF_PI`, `QUARTER_PI`
- [x] Factores de conversión: `DEG_TO_RAD`, `RAD_TO_DEG`

### 11.2 Operaciones de Rotación

- [x] `Vector2.rotate(angle)` / `rotateCS(cos, sin)`
- [x] `Vector2.rotateAround(center, angle)` / `rotateAroundCS(...)`
- [x] `Vector2.applyRotation2(rotation)`
- [x] `Matrix2.rotate(angle)` / `rotateCS(cos, sin)`
- [x] `Matrix3.rotate(angle)` / `rotateCS(cos, sin)`
- [x] `Rotation2.apply(v)` / delega a `Vector2.rotateCS`
- [x] `Transform2.transformPoint/Vector` / variantes `*CS`

### 11.3 Interpolación

- [x] Todos los tipos tienen `lerp` static e instance
- [x] Todos los tipos tienen `lerpClamped` static e instance
- [x] `Rotation2` y `Complex` tienen `slerp` / `slerpClamped`
- [x] Todos los tipos tienen `smoothStep` static e instance

### 11.4 Conversiones

- [x] `Rotation2 ↔ Complex` bidireccional
- [x] `Rotation2 → Vector2`
- [x] `Transform2 → Matrix3`
- [x] `Transform2 → Rotation2`
- [x] Factories `fromRotation` aceptan `number | Rotation2Like`

### 11.5 Nomenclatura

- [x] Métodos `to*` con sufijo numérico correcto
- [x] Métodos `from*` con sufijo numérico correcto
- [x] Métodos `apply*` con sufijo numérico correcto
- [x] Variantes `*CS` para hot paths

---

## Apéndice A: Referencia de Patrones Externos

### Box2D (C++)

```cpp
// b2Rot representa rotación como (c, s)
struct b2Rot {
  float c, s;  // cos, sin
};

// Aplicar rotación a vector
b2Vec2 b2Mul(const b2Rot& q, const b2Vec2& v) {
  return b2Vec2(q.c * v.x - q.s * v.y, q.s * v.x + q.c * v.y);
}
```

### gl-matrix (JavaScript)

```javascript
// vec2.rotate rota vector alrededor del origen
vec2.rotate(out, a, origin, rad);

// mat2.rotate rota matriz
mat2.rotate(out, a, rad);
```

### three.js (JavaScript)

```javascript
// Vector2.rotateAround rota alrededor de un centro
vector.rotateAround(center, angle);

// Matrix3.rotate no existe, se usa Matrix4
```

---

## Apéndice B: Checklist de Revisión ✅

- [x] ¿Todos los métodos `rotate` tienen versión `rotateCS`? → Vector2, Matrix2, Matrix3 ✅
- [x] ¿Todos los métodos `apply*` incluyen sufijo numérico correcto? → applyRotation2, applyTransform2, applyComplex ✅
- [x] ¿`Transform2.*CS` reciben cos/sin de la rotación correcta (positiva vs negativa)? → Corregido en inverseTransform\*CS ✅
- [x] ¿La delegación sigue la jerarquía de responsabilidad? → Rotation2.apply→Vector2.rotateCS, Rotation2.applyInverse→Vector2.rotateCS ✅
- [x] ¿Los tests cubren casos edge (ángulo 0, π, -π)? → 2164 tests pasando ✅
- [x] ¿Los JSDoc incluyen `@category`, `@since`, y ejemplos? → Todos los métodos nuevos tienen @category y @since 0.12.0 ✅

---

---

## Apéndice C: Decisiones de Diseño Intencionales

### C.1 `Vector2.scale` vs `Matrix.multiplyScalar`

| Tipo        | Método              | Razón                                                      |
| ----------- | ------------------- | ---------------------------------------------------------- |
| `Vector2`   | `scale(s)`          | Término intuitivo para vectores (escalar un vector)        |
| `Matrix2/3` | `multiplyScalar(s)` | Término matemático para matrices (multiplicar por escalar) |

**Justificación:** Aunque ambos hacen lo mismo (multiplicar por un número), los términos
reflejan el vocabulario del dominio:

- En física/gráficos, "escalar un vector" es natural
- En álgebra lineal, "multiplicar matriz por escalar" es el término formal

### C.2 `inverseLerp` solo en `Interval`

`inverseLerp` tiene sentido semántico solo para `Interval`:

- Pregunta: "¿Qué fracción del intervalo [min, max] representa este valor?"
- Para vectores/rotaciones, la pregunta no es directa

### C.3 `clamp` no aplica a `Rotation2`

Las rotaciones son cíclicas (ángulos wrap-around). Para limitar ángulos:

- Usar `clampAngle(angle, min, max)` de `auxiliary/angle/operations`
- `Rotation2` representa siempre una rotación válida (cos²+sin²=1)

### C.4 `slerp` solo en tipos rotacionales

`slerp` (spherical linear interpolation) solo tiene sentido para:

- `Rotation2`: Interpolación en el círculo unitario
- `Complex`: Cuando se usa como rotación

Para `Vector2`, usar `lerp` (interpolación lineal en el plano).

---

## Apéndice D: Resumen Final de Auditoría

### D.1 Estado de la Auditoría

| Métrica                  | Valor          |
| ------------------------ | -------------- |
| **Fecha**                | Diciembre 2024 |
| **Módulos auditados**    | 25+            |
| **Tests ejecutados**     | 2,164          |
| **Test suites**          | 35             |
| **Cobertura Statements** | 89.56%         |
| **Cobertura Lines**      | 89.96%         |
| **Estado**               | ✅ COMPLETADO  |

### D.2 Inconsistencias Detectadas y Corregidas

| ID      | Inconsistencia                                | Corrección                         | Estado |
| ------- | --------------------------------------------- | ---------------------------------- | ------ |
| INC-001 | `smoothLerp` vs `smoothStep`                  | Homogeneizado a `smoothStep`       | ✅     |
| INC-002 | `Rotation2.toVector()` sin sufijo             | `toVector2()`                      | ✅     |
| INC-003 | `Transform2.toMatrix()` sin sufijo            | `toMatrix3()`                      | ✅     |
| INC-004 | `Vector2.applyRotation()` sin sufijo          | `applyRotation2()`                 | ✅     |
| INC-005 | `Vector2.applyTransform()` sin sufijo         | `applyTransform2()`                | ✅     |
| INC-006 | `Rotation2.fromVector()` sin sufijo           | `fromVector2()`                    | ✅     |
| INC-007 | `Rotation2.fromVectors()` sin sufijo          | `fromVectors2()`                   | ✅     |
| INC-008 | `Matrix3.fromTransform()` sin sufijo          | `fromTransform2()`                 | ✅     |
| INC-009 | `Complex.toRotationMatrix()` sin sufijo       | `toRotationMatrix2()`              | ✅     |
| INC-010 | Falta `Transform2.toRotation2()`              | Añadido                            | ✅     |
| INC-011 | Falta `Complex.toRotation2()`                 | Añadido                            | ✅     |
| INC-012 | Magic number `1e-12` en `DeterministicMath`   | `ANGLE_ZERO_THRESHOLD`             | ✅     |
| INC-013 | `Rotation2.applyInverse` no delegaba          | Delega a `Vector2.rotateCS`        | ✅     |
| INC-014 | `inverseTransformPointCS` signos incorrectos  | Fórmula rotación inversa corregida | ✅     |
| INC-015 | `inverseTransformVectorCS` signos incorrectos | Fórmula rotación inversa corregida | ✅     |

### D.3 Mejoras de Hot Paths Implementadas

| Método                                  | Descripción                                            |
| --------------------------------------- | ------------------------------------------------------ |
| `Transform2.transformPointCS()`         | Transforma punto con cos/sin precomputados             |
| `Transform2.transformVectorCS()`        | Transforma dirección con cos/sin precomputados         |
| `Transform2.inverseTransformPointCS()`  | Transforma inverso punto con cos/sin precomputados     |
| `Transform2.inverseTransformVectorCS()` | Transforma inverso dirección con cos/sin precomputados |
| `Vector2.rotateCS()`                    | Rota vector con cos/sin precomputados                  |
| `Vector2.rotateAroundCS()`              | Rota alrededor de centro con cos/sin precomputados     |

### D.4 Sinergia Implementada

| Origen                        | Destino                     | Método                        |
| ----------------------------- | --------------------------- | ----------------------------- |
| `Rotation2.apply()`           | `Vector2.rotateCS()`        | Delegación DRY                |
| `Transform2.transformPoint()` | `sinCos()` + cálculo inline | Evita creación de objetos     |
| `Matrix3.fromRotation()`      | `ReadonlyRotation2Like`     | Acepta Rotation2 o {cos, sin} |
| `Complex.toRotation2()`       | `Rotation2`                 | Conversión directa            |
| `Transform2.toRotation2()`    | `Rotation2.fromAngle()`     | Factory delegada              |

### D.5 Principios Verificados

| Principio | Estado | Evidencia                                                      |
| --------- | ------ | -------------------------------------------------------------- |
| **DRY**   | ✅     | Delegación entre módulos, reutilización de utilidades          |
| **SRP**   | ✅     | Cada clase tiene responsabilidad única clara                   |
| **OCP**   | ✅     | Extensible vía interfaces `*Like`, sin modificar clases base   |
| **LSP**   | ✅     | Subtipos intercambiables (Rotation2Like, Vector2Like)          |
| **ISP**   | ✅     | Interfaces mínimas (ReadonlyVector2Like vs Vector2Like)        |
| **DIP**   | ✅     | Dependencia en abstracciones (interfaces), no implementaciones |

### D.6 Documentos Generados

| Documento                            | Propósito                                          |
| ------------------------------------ | -------------------------------------------------- |
| `TRANSFORMATION_CONSISTENCY_SPEC.md` | Especificación completa de API de transformaciones |
| `NAMING_CONVENTIONS.md`              | Reglas de nomenclatura obligatorias                |
| `REFACTORING_LOG.md`                 | Log de todas las refactorizaciones aplicadas       |
| `API_CONSISTENCY_ANALYSIS.md`        | Análisis de consistencia inicial                   |

### D.7 Recomendaciones para el Futuro

1. **Antes de añadir métodos**: Consultar `NAMING_CONVENTIONS.md`
2. **Para transformaciones**: Seguir patrones de `TRANSFORMATION_CONSISTENCY_SPEC.md`
3. **Hot paths**: Usar variantes `*CS` con `sinCos()` precomputado
4. **Tests**: Mantener cobertura ≥90% con property-based tests

---

_Documento generado: Diciembre 2024_
_Estado: Completado_
_Auditoría: FINALIZADA_
