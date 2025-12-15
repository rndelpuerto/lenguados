# Matrix2 Refactorización Completa

> **Documento de Especificación de Refactor**  
> **Módulo:** `@lenguados/math2d/core/matrix2`  
> **Referencia:** `@lenguados/math2d/core/vector2`  
> **Fecha:** 2025-12-03  
> **Estado:** Draft para revisión

---

## 1. Resumen Ejecutivo

Este documento especifica la refactorización completa de `Matrix2` para alcanzar paridad de madurez con `Vector2`. El análisis revela que `Matrix2` está aproximadamente al **60% de completitud** respecto al estándar establecido por `Vector2`.

### Métricas Actuales

| Métrica              | Vector2 | Matrix2 | Ratio   |
| -------------------- | ------- | ------- | ------- |
| Líneas de código     | ~3124   | ~1143   | 36.6%   |
| Constantes estáticas | 14      | 10      | 71.4%   |
| Factories estáticas  | 7       | 9       | 128% ✅ |
| Métodos estáticos    | ~45     | ~16     | 35.5%   |
| Métodos de instancia | ~65     | ~35     | 53.8%   |
| Getters readonly     | 10      | 7       | 70%     |

---

## 2. Problemas Arquitectónicos Críticos

### 2.1 Patrón `out?` en Métodos de Instancia

**Problema:** Los métodos de instancia mutables aceptan `out?` parámetro, violando el contrato implícito.

**Vector2 (correcto):**

```typescript
// Estático: puro, acepta out? para control de allocación
public static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2

// Instancia: mutable, retorna this, SIN out
public add(v: ReadonlyVector2Like): this {
  this.x += v.x;
  this.y += v.y;
  return this;
}
```

**Matrix2 (problemático):**

```typescript
// Instancia: muta this SIEMPRE, pero puede retornar out (confuso)
add(other: ReadonlyMatrix2, out?: Matrix2): Matrix2 {
  this.m00 += other.m00;  // ← Siempre muta this
  // ...
  return out ? out.copy(this) : this;  // ← Puede retornar otro objeto
}
```

**Solución:** Eliminar `out?` de TODOS los métodos de instancia mutables.

### 2.2 Tipo de Retorno Incorrecto

**Problema:** Métodos de instancia retornan `Matrix2` en lugar de `this`.

```typescript
// Actual (problemático para herencia)
add(other: ReadonlyMatrix2, out?: Matrix2): Matrix2

// Correcto (permite chaining en subclases)
add(other: ReadonlyMatrix2Like): this
```

### 2.3 Uso Inconsistente de Interfaces

**Problema:** Algunos métodos usan `ReadonlyMatrix2` (tipo concreto) en lugar de `ReadonlyMatrix2Like` (interfaz).

```typescript
// Actual
add(other: ReadonlyMatrix2, out?: Matrix2): Matrix2
copy(other: ReadonlyMatrix2): this

// Correcto (duck typing)
add(other: ReadonlyMatrix2Like): this
copy(other: ReadonlyMatrix2Like): this
```

---

## 3. Comparación Método a Método

### 3.1 Constantes Estáticas

| Vector2             | Matrix2      | Estado | Acción                          |
| ------------------- | ------------ | ------ | ------------------------------- |
| `ZERO`              | `ZERO`       | ✅     | -                               |
| `ONE`               | -            | ❌     | Añadir `ONE = Matrix2(1,1,1,1)` |
| `ORIGIN`            | -            | N/A    | No aplica                       |
| `EPSILON_VECTOR`    | -            | ❌     | Añadir `EPSILON_MATRIX`         |
| `UNIT_X`            | -            | N/A    | No aplica                       |
| `UNIT_Y`            | -            | N/A    | No aplica                       |
| `NEGATIVE_ONE`      | -            | ❌     | Añadir `NEGATIVE_ONE`           |
| `NEGATIVE_UNIT_X`   | -            | N/A    | No aplica                       |
| `NEGATIVE_UNIT_Y`   | -            | N/A    | No aplica                       |
| `UNIT_DIAGONAL`     | -            | N/A    | No aplica                       |
| `POSITIVE_INFINITY` | -            | ❌     | Añadir `POSITIVE_INFINITY`      |
| `NEGATIVE_INFINITY` | -            | ❌     | Añadir `NEGATIVE_INFINITY`      |
| -                   | `IDENTITY`   | ✅     | Mantener                        |
| -                   | `ROTATE_90`  | ✅     | Mantener                        |
| -                   | `ROTATE_180` | ✅     | Mantener                        |
| -                   | `ROTATE_270` | ✅     | Mantener                        |
| -                   | `FLIP_X`     | ✅     | Mantener                        |
| -                   | `FLIP_Y`     | ✅     | Mantener                        |
| -                   | `FLIP_XY`    | ✅     | Mantener                        |
| -                   | `SCALE_2`    | ✅     | Mantener                        |
| -                   | `SCALE_HALF` | ✅     | Mantener                        |

**Constantes faltantes a añadir:**

```typescript
static readonly ONE = Object.freeze(new Matrix2(1, 1, 1, 1)) as ReadonlyMatrix2;
static readonly NEGATIVE_ONE = Object.freeze(new Matrix2(-1, -1, -1, -1)) as ReadonlyMatrix2;
static readonly EPSILON_MATRIX = Object.freeze(new Matrix2(EPSILON, EPSILON, EPSILON, EPSILON)) as ReadonlyMatrix2;
static readonly POSITIVE_INFINITY = Object.freeze(new Matrix2(Infinity, Infinity, Infinity, Infinity)) as ReadonlyMatrix2;
static readonly NEGATIVE_INFINITY = Object.freeze(new Matrix2(-Infinity, -Infinity, -Infinity, -Infinity)) as ReadonlyMatrix2;
```

---

### 3.2 Helpers Privados

| Vector2                          | Matrix2                 | Estado | Notas                           |
| -------------------------------- | ----------------------- | ------ | ------------------------------- |
| `ensureOut(out?)`                | `ensureOut(out?)`       | ✅     | Idéntico                        |
| `sanitizeComponent(value, name)` | `sanitize(value, name)` | ⚠️     | Renombrar a `sanitizeComponent` |

**Acción:** Renombrar `sanitize` → `sanitizeComponent` para consistencia.

---

### 3.3 Factories Estáticas

| Vector2                           | Matrix2                                       | Estado | Acción                   |
| --------------------------------- | --------------------------------------------- | ------ | ------------------------ |
| `fromValues(x, y, out?)`          | `fromValues(m00, m01, m10, m11, out?)`        | ✅     | -                        |
| `clone(source, out?)`             | `clone(source, out?)`                         | ✅     | -                        |
| `copy(source, dest)`              | -                                             | ❌     | **Añadir**               |
| `fromAngle(angle, radius?, out?)` | `fromRotation(rotation, out?)`                | ⚠️     | Añadir alias `fromAngle` |
| `fromObject(obj, out?)`           | -                                             | ❌     | **Añadir**               |
| `fromArray(arr, offset?, out?)`   | `fromArray(arr, offset?, columnMajor?, out?)` | ✅     | Bien                     |
| `fromComplex(complex, out?)`      | -                                             | N/A    | No aplica                |
| -                                 | `fromScale(scale, out?)`                      | ✅     | Mantener                 |
| -                                 | `fromShear(shear, out?)`                      | ✅     | Mantener                 |
| -                                 | `fromColumns(col0, col1, out?)`               | ✅     | Mantener                 |
| -                                 | `fromRows(row0, row1, out?)`                  | ✅     | Mantener                 |
| -                                 | `fromMatrix(matrix, out?)`                    | ✅     | Mantener                 |

**Factories faltantes:**

```typescript
/**
 * Copies component values from source into destination (alloc-free).
 * @category Factory
 */
public static copy(source: ReadonlyMatrix2Like, destination: Matrix2): Matrix2 {
  return destination.set(source.m00, source.m01, source.m10, source.m11);
}

/**
 * Creates a matrix from a plain object.
 * @throws {Error} If any component is not finite.
 * @category Factory
 */
public static fromObject(object: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const m00 = this.sanitizeComponent(object.m00, 'Matrix2.fromObject:m00');
  const m01 = this.sanitizeComponent(object.m01, 'Matrix2.fromObject:m01');
  const m10 = this.sanitizeComponent(object.m10, 'Matrix2.fromObject:m10');
  const m11 = this.sanitizeComponent(object.m11, 'Matrix2.fromObject:m11');
  return this.ensureOut(out).set(m00, m01, m10, m11);
}

/**
 * Alias for fromRotation with angle parameter.
 * @category Factory
 */
public static fromAngle(angle: number, out?: Matrix2): Matrix2 {
  return this.fromRotation(angle, out);
}
```

---

### 3.4 Aritmética Estática

| Vector2                                      | Matrix2                       | Estado | Acción                           |
| -------------------------------------------- | ----------------------------- | ------ | -------------------------------- |
| `sumComponents(v)`                           | -                             | ❌     | Añadir `sumComponents`           |
| `add(a, b, out?)`                            | `add(a, b, out?)`             | ✅     | -                                |
| `addScalar(v, s, out?)`                      | -                             | ❌     | **Añadir**                       |
| `subtract(a, b, out?)`                       | `subtract(a, b, out?)`        | ✅     | -                                |
| `subtractScalar(v, s, out?)`                 | -                             | ❌     | **Añadir**                       |
| `multiply(a, b, out?)`                       | `multiply(a, b, out?)`        | ✅     | -                                |
| `scale(v, s, out?)`                          | `scale(matrix, scalar, out?)` | ✅     | -                                |
| `divide(a, b, out?)`                         | -                             | ❌     | Añadir `divide` (component-wise) |
| `divideScalar(v, s, out?)`                   | -                             | ❌     | **Añadir**                       |
| `negate(v, out?)`                            | `negate(matrix, out?)`        | ✅     | -                                |
| `addScaledVector(base, scaled, scale, out?)` | -                             | ❌     | Añadir `addScaledMatrix`         |
| `fma(a, scale, b, out?)`                     | -                             | ❌     | **Añadir**                       |
| `mod(a, b, out?)`                            | -                             | ❌     | Añadir (low priority)            |
| `modScalar(v, s, out?)`                      | -                             | ❌     | Añadir (low priority)            |
| -                                            | `transpose(matrix, out?)`     | ✅     | Mantener                         |
| -                                            | `inverse(matrix, out?)`       | ✅     | Mantener                         |
| -                                            | `adjugate(matrix, out?)`      | ✅     | Mantener                         |
| -                                            | `determinant(matrix)`         | ✅     | Mantener                         |

**Métodos aritméticos faltantes:**

```typescript
/**
 * Computes the sum of all matrix components.
 * @category Arithmetic
 */
public static sumComponents(matrix: ReadonlyMatrix2Like): number {
  return matrix.m00 + matrix.m01 + matrix.m10 + matrix.m11;
}

/**
 * Adds a scalar to all components.
 * @category Arithmetic
 */
public static addScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    matrix.m00 + scalar,
    matrix.m01 + scalar,
    matrix.m10 + scalar,
    matrix.m11 + scalar,
  );
}

/**
 * Subtracts a scalar from all components.
 * @category Arithmetic
 */
public static subtractScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    matrix.m00 - scalar,
    matrix.m01 - scalar,
    matrix.m10 - scalar,
    matrix.m11 - scalar,
  );
}

/**
 * Component-wise division.
 * @category Arithmetic
 */
public static divide(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    safeDivide(a.m00, b.m00),
    safeDivide(a.m01, b.m01),
    safeDivide(a.m10, b.m10),
    safeDivide(a.m11, b.m11),
  );
}

/**
 * Divides all components by a scalar using safe division.
 * @category Arithmetic
 */
public static divideScalar(matrix: ReadonlyMatrix2Like, scalar: number, out?: Matrix2): Matrix2 {
  if (isNearZero(scalar)) {
    return this.ensureOut(out).set(0, 0, 0, 0);
  }
  const inv = 1 / scalar;
  return this.ensureOut(out).set(
    matrix.m00 * inv,
    matrix.m01 * inv,
    matrix.m10 * inv,
    matrix.m11 * inv,
  );
}

/**
 * Adds a scaled matrix: base + scale * scaled.
 * @category Arithmetic
 */
public static addScaledMatrix(
  base: ReadonlyMatrix2Like,
  scaled: ReadonlyMatrix2Like,
  scale: number,
  out?: Matrix2,
): Matrix2 {
  return this.ensureOut(out).set(
    base.m00 + scaled.m00 * scale,
    base.m01 + scaled.m01 * scale,
    base.m10 + scaled.m10 * scale,
    base.m11 + scaled.m11 * scale,
  );
}

/**
 * Fused multiply-add: a * scale + b.
 * @category Arithmetic
 */
public static fma(
  a: ReadonlyMatrix2Like,
  scale: number,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return this.ensureOut(out).set(
    a.m00 * scale + b.m00,
    a.m01 * scale + b.m01,
    a.m10 * scale + b.m10,
    a.m11 * scale + b.m11,
  );
}

/**
 * Multiplies matrix by transpose of another: a × bᵀ.
 * Common in physics for computing relative rotations.
 * @category Arithmetic
 */
public static multiplyTranspose(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return this.ensureOut(out).set(
    a.m00 * b.m00 + a.m10 * b.m10,
    a.m01 * b.m00 + a.m11 * b.m10,
    a.m00 * b.m01 + a.m10 * b.m11,
    a.m01 * b.m01 + a.m11 * b.m11,
  );
}

/**
 * Multiplies transpose of matrix by another: aᵀ × b.
 * @category Arithmetic
 */
public static transposeMultiply(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return this.ensureOut(out).set(
    a.m00 * b.m00 + a.m01 * b.m01,
    a.m10 * b.m00 + a.m11 * b.m01,
    a.m00 * b.m10 + a.m01 * b.m11,
    a.m10 * b.m10 + a.m11 * b.m11,
  );
}
```

---

### 3.5 Interpolación Estática

| Vector2                      | Matrix2               | Estado | Acción                             |
| ---------------------------- | --------------------- | ------ | ---------------------------------- |
| `lerp(a, b, t, out?)`        | `lerp(a, b, t, out?)` | ✅     | -                                  |
| `lerpClamped(a, b, t, out?)` | -                     | ❌     | **Añadir**                         |
| `slerp(a, b, t, out?)`       | -                     | ❌     | Añadir (para matrices de rotación) |

**Métodos de interpolación faltantes:**

```typescript
/**
 * Linear interpolation with t clamped to [0, 1].
 * @category Interpolation
 */
public static lerpClamped(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
): Matrix2 {
  return this.lerp(a, b, saturate(t), out);
}

/**
 * Spherical linear interpolation for rotation matrices.
 * Falls back to lerp for non-rotation matrices.
 * @category Interpolation
 */
public static slerp(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
): Matrix2 {
  // Extract angles
  const angleA = DeterministicMath.atan2(a.m01, a.m00);
  const angleB = DeterministicMath.atan2(b.m01, b.m00);

  // Interpolate angle (shortest path)
  let delta = angleB - angleA;
  if (delta > Math.PI) delta -= 2 * Math.PI;
  if (delta < -Math.PI) delta += 2 * Math.PI;

  const angle = angleA + delta * t;
  return this.fromRotation(angle, out);
}
```

---

### 3.6 Geometría y Medidas Estáticas

| Vector2                 | Matrix2                          | Estado | Acción                                             |
| ----------------------- | -------------------------------- | ------ | -------------------------------------------------- |
| `dot(a, b)`             | -                                | ❌     | Añadir (Frobenius inner product)                   |
| `length(v)`             | -                                | ❌     | Añadir (Frobenius norm) - ya existe como instancia |
| `lengthSquared(v)`      | -                                | ❌     | Añadir                                             |
| `distance(a, b)`        | -                                | ❌     | Añadir (Frobenius distance)                        |
| `distanceSquared(a, b)` | -                                | ❌     | Añadir                                             |
| -                       | `determinant(matrix)`            | ✅     | Mantener                                           |
| -                       | `compose(rotation, scale, out?)` | ✅     | Mantener                                           |
| -                       | `decompose(matrix)`              | ✅     | Mantener                                           |

**Métodos de geometría faltantes:**

```typescript
/**
 * Frobenius inner product (matrix dot product).
 * @returns Sum of element-wise products.
 * @category Geometry
 */
public static dot(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like): number {
  return a.m00 * b.m00 + a.m01 * b.m01 + a.m10 * b.m10 + a.m11 * b.m11;
}

/**
 * Frobenius norm (matrix length).
 * @category Geometry
 */
public static frobeniusNorm(matrix: ReadonlyMatrix2Like): number {
  return safeSqrt(
    matrix.m00 * matrix.m00 +
    matrix.m01 * matrix.m01 +
    matrix.m10 * matrix.m10 +
    matrix.m11 * matrix.m11,
  );
}

/**
 * Squared Frobenius norm.
 * @category Geometry
 */
public static frobeniusNormSquared(matrix: ReadonlyMatrix2Like): number {
  return (
    matrix.m00 * matrix.m00 +
    matrix.m01 * matrix.m01 +
    matrix.m10 * matrix.m10 +
    matrix.m11 * matrix.m11
  );
}

/**
 * Frobenius distance between two matrices.
 * @category Geometry
 */
public static distance(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like): number {
  const d00 = b.m00 - a.m00;
  const d01 = b.m01 - a.m01;
  const d10 = b.m10 - a.m10;
  const d11 = b.m11 - a.m11;
  return safeSqrt(d00 * d00 + d01 * d01 + d10 * d10 + d11 * d11);
}

/**
 * Squared Frobenius distance between two matrices.
 * @category Geometry
 */
public static distanceSquared(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like): number {
  const d00 = b.m00 - a.m00;
  const d01 = b.m01 - a.m01;
  const d10 = b.m10 - a.m10;
  const d11 = b.m11 - a.m11;
  return d00 * d00 + d01 * d01 + d10 * d10 + d11 * d11;
}
```

---

### 3.7 Transformaciones Numéricas Estáticas

| Vector2                | Matrix2                 | Estado | Acción                |
| ---------------------- | ----------------------- | ------ | --------------------- |
| `floor(v, out?)`       | -                       | ❌     | **Añadir**            |
| `ceil(v, out?)`        | -                       | ❌     | **Añadir**            |
| `round(v, out?)`       | -                       | ❌     | **Añadir**            |
| `abs(v, out?)`         | -                       | ❌     | **Añadir**            |
| `sign(v, out?)`        | -                       | ❌     | **Añadir**            |
| `inverse(v, out?)`     | `inverse(matrix, out?)` | ✅     | Diferente semántica   |
| `inverseSafe(v, out?)` | -                       | ❌     | Añadir `inverseSafe`  |
| `swap(v, out?)`        | -                       | N/A    | No aplica             |
| `step(edge, v, out?)`  | -                       | ❌     | Añadir (low priority) |

**Métodos de transformación faltantes:**

```typescript
/**
 * Applies Math.floor to all components.
 * @category Transform
 */
public static floor(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    Math.floor(matrix.m00),
    Math.floor(matrix.m01),
    Math.floor(matrix.m10),
    Math.floor(matrix.m11),
  );
}

/**
 * Applies Math.ceil to all components.
 * @category Transform
 */
public static ceil(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    Math.ceil(matrix.m00),
    Math.ceil(matrix.m01),
    Math.ceil(matrix.m10),
    Math.ceil(matrix.m11),
  );
}

/**
 * Applies Math.round to all components.
 * @category Transform
 */
public static round(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    Math.round(matrix.m00),
    Math.round(matrix.m01),
    Math.round(matrix.m10),
    Math.round(matrix.m11),
  );
}

/**
 * Applies Math.abs to all components.
 * @category Transform
 */
public static abs(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    scalarAbs(matrix.m00),
    scalarAbs(matrix.m01),
    scalarAbs(matrix.m10),
    scalarAbs(matrix.m11),
  );
}

/**
 * Applies Math.sign to all components.
 * @category Transform
 */
public static sign(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    scalarSign(matrix.m00),
    scalarSign(matrix.m01),
    scalarSign(matrix.m10),
    scalarSign(matrix.m11),
  );
}

/**
 * Safe matrix inverse. Returns identity if singular.
 * @category Transform
 */
public static inverseSafe(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
    return this.ensureOut(out).set(1, 0, 0, 1); // Identity fallback
  }
  const invDet = safeDivide(1, det);
  return this.ensureOut(out).set(
    matrix.m11 * invDet,
    -matrix.m01 * invDet,
    -matrix.m10 * invDet,
    matrix.m00 * invDet,
  );
}
```

---

### 3.8 Restricciones Estáticas

| Vector2                          | Matrix2 | Estado | Acción             |
| -------------------------------- | ------- | ------ | ------------------ |
| `clamp(v, minV, maxV, out?)`     | -       | ❌     | **Añadir**         |
| `clampScalar(v, min, max, out?)` | -       | ❌     | **Añadir**         |
| `clampLength(v, min, max, out?)` | -       | ❌     | Añadir `clampNorm` |
| `limit(v, maxLength, out?)`      | -       | ❌     | Añadir `limitNorm` |
| `min(a, b, out?)`                | -       | ❌     | **Añadir**         |
| `max(a, b, out?)`                | -       | ❌     | **Añadir**         |

**Métodos de restricción faltantes:**

```typescript
/**
 * Component-wise clamp between min and max matrices.
 * @category Constraint
 */
public static clamp(
  matrix: ReadonlyMatrix2Like,
  minM: ReadonlyMatrix2Like,
  maxM: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return this.ensureOut(out).set(
    clamp(matrix.m00, minM.m00, maxM.m00),
    clamp(matrix.m01, minM.m01, maxM.m01),
    clamp(matrix.m10, minM.m10, maxM.m10),
    clamp(matrix.m11, minM.m11, maxM.m11),
  );
}

/**
 * Clamps all components between scalar min and max.
 * @category Constraint
 */
public static clampScalar(
  matrix: ReadonlyMatrix2Like,
  min: number,
  max: number,
  out?: Matrix2,
): Matrix2 {
  return this.ensureOut(out).set(
    clamp(matrix.m00, min, max),
    clamp(matrix.m01, min, max),
    clamp(matrix.m10, min, max),
    clamp(matrix.m11, min, max),
  );
}

/**
 * Component-wise minimum of two matrices.
 * @category Constraint
 */
public static min(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    scalarMin(a.m00, b.m00),
    scalarMin(a.m01, b.m01),
    scalarMin(a.m10, b.m10),
    scalarMin(a.m11, b.m11),
  );
}

/**
 * Component-wise maximum of two matrices.
 * @category Constraint
 */
public static max(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return this.ensureOut(out).set(
    scalarMax(a.m00, b.m00),
    scalarMax(a.m01, b.m01),
    scalarMax(a.m10, b.m10),
    scalarMax(a.m11, b.m11),
  );
}
```

---

### 3.9 Comparación y Validación Estática

| Vector2                           | Matrix2                        | Estado | Acción                             |
| --------------------------------- | ------------------------------ | ------ | ---------------------------------- |
| `isZero(v)`                       | -                              | ❌     | **Añadir**                         |
| `nearZero(v, epsilon?)`           | -                              | ❌     | **Añadir**                         |
| `equals(a, b)`                    | `equals(a, b, epsilon?)`       | ⚠️     | Separar en `equals` y `nearEquals` |
| `nearEquals(a, b, epsilon?)`      | -                              | ❌     | **Añadir** (renombrar actual)      |
| `isUnit(v)`                       | -                              | N/A    | No aplica directamente             |
| `isFinite(v)`                     | -                              | ❌     | **Añadir**                         |
| `isParallel(a, b, epsilon?)`      | -                              | N/A    | No aplica                          |
| `isPerpendicular(a, b, epsilon?)` | -                              | N/A    | No aplica                          |
| -                                 | `isIdentity(matrix, epsilon?)` | ✅     | Mantener                           |

**Métodos de validación faltantes:**

```typescript
/**
 * Tests whether matrix is exactly zero.
 * @category Comparison
 */
public static isZero(matrix: ReadonlyMatrix2Like): boolean {
  return matrix.m00 === 0 && matrix.m01 === 0 && matrix.m10 === 0 && matrix.m11 === 0;
}

/**
 * Tests whether all components are within epsilon of zero.
 * @category Comparison
 */
public static nearZero(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return (
    isNearZero(matrix.m00, epsilon) &&
    isNearZero(matrix.m01, epsilon) &&
    isNearZero(matrix.m10, epsilon) &&
    isNearZero(matrix.m11, epsilon)
  );
}

/**
 * Strict component-wise equality.
 * @category Comparison
 */
public static exactEquals(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like): boolean {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m10 === b.m10 && a.m11 === b.m11;
}

// Nota: El actual `equals` con epsilon debería renombrarse a `nearEquals`
// y añadir un `equals` sin epsilon (alias de exactEquals)

/**
 * Tests whether all components are finite numbers.
 * @category Comparison
 */
public static isFinite(matrix: ReadonlyMatrix2Like): boolean {
  return (
    Number.isFinite(matrix.m00) &&
    Number.isFinite(matrix.m01) &&
    Number.isFinite(matrix.m10) &&
    Number.isFinite(matrix.m11)
  );
}

/**
 * Tests whether any component is NaN.
 * @category Comparison
 */
public static hasNaN(matrix: ReadonlyMatrix2Like): boolean {
  return (
    Number.isNaN(matrix.m00) ||
    Number.isNaN(matrix.m01) ||
    Number.isNaN(matrix.m10) ||
    Number.isNaN(matrix.m11)
  );
}

/**
 * Tests whether matrix is symmetric (m01 === m10).
 * @category Comparison
 */
public static isSymmetric(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return nearEquals(matrix.m01, matrix.m10, epsilon);
}

/**
 * Tests whether matrix is skew-symmetric (m01 === -m10, diagonal zero).
 * @category Comparison
 */
public static isSkewSymmetric(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return (
    isNearZero(matrix.m00, epsilon) &&
    isNearZero(matrix.m11, epsilon) &&
    nearEquals(matrix.m01, -matrix.m10, epsilon)
  );
}

/**
 * Tests whether matrix is diagonal (off-diagonal elements zero).
 * @category Comparison
 */
public static isDiagonal(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return isNearZero(matrix.m01, epsilon) && isNearZero(matrix.m10, epsilon);
}
```

---

### 3.10 Álgebra Lineal - Métodos Fundamentales Faltantes

Operaciones de álgebra lineal estándar que toda librería matemática debe incluir:

````typescript
/**
 * Solves the linear system Ax = b for x using Cramer's rule.
 *
 * @param b - Right-hand side vector.
 * @param out - Optional output vector.
 * @returns Solution vector x such that Ax = b.
 * @throws {Error} If matrix is singular.
 *
 * @remarks
 * For 2×2 systems, Cramer's rule is optimal:
 * - x = (b.x × m11 - b.y × m10) / det
 * - y = (b.y × m00 - b.x × m01) / det
 *
 * @example
 * ```typescript
 * const A = Matrix2.fromValues(4, 2, 1, 3);
 * const b = new Vector2(10, 7);
 * const x = Matrix2.solve(A, b);
 * // Verificar: A.transformVector(x) ≈ b
 * ```
 *
 * @category Linear Algebra
 */
public static solve(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
    throw new Error('Matrix2.solve: singular matrix');
  }
  const invDet = 1 / det;
  return Vector2.fromValues(
    invDet * (matrix.m11 * b.x - matrix.m10 * b.y),
    invDet * (matrix.m00 * b.y - matrix.m01 * b.x),
    out,
  );
}

/**
 * Safe solve - returns zero vector if matrix is singular.
 * @category Linear Algebra
 */
public static solveSafe(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
    return Vector2.fromValues(0, 0, out);
  }
  const invDet = 1 / det;
  return Vector2.fromValues(
    invDet * (matrix.m11 * b.x - matrix.m10 * b.y),
    invDet * (matrix.m00 * b.y - matrix.m01 * b.x),
    out,
  );
}

/**
 * Computes the inverse of a symmetric matrix (where m01 = m10).
 * More efficient than general inverse when symmetry is known.
 *
 * @remarks
 * For symmetric matrices: det = m00 × m11 - m01²
 * The result is also symmetric.
 *
 * @category Linear Algebra
 */
public static symmetricInverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m01;
  if (isNearZero(det)) {
    throw new Error('Matrix2.symmetricInverse: singular matrix');
  }
  const invDet = 1 / det;
  return Matrix2.ensureOut(out).set(
    matrix.m11 * invDet,
    -matrix.m01 * invDet,
    -matrix.m01 * invDet,
    matrix.m00 * invDet,
  );
}
````

---

### 3.11 Constructor

**Vector2 (múltiples overloads):**

```typescript
constructor();                                    // (0, 0)
constructor(x: number, y: number);                // explicit values
constructor(array: [number, number]);             // from tuple
constructor(object: ReadonlyVector2Like);         // from object
```

**Matrix2 (simple):**

```typescript
constructor((m00 = 1), (m01 = 0), (m10 = 0), (m11 = 1));
```

**Propuesta para Matrix2:**

```typescript
constructor();
constructor(m00: number, m01: number, m10: number, m11: number);
constructor(array: [number, number, number, number]);
constructor(object: ReadonlyMatrix2Like);
constructor(
  m00OrSource?: number | [number, number, number, number] | ReadonlyMatrix2Like,
  m01?: number,
  m10?: number,
  m11?: number,
) {
  if (m00OrSource === undefined) {
    // Identity matrix by default
    this.m00 = 1;
    this.m01 = 0;
    this.m10 = 0;
    this.m11 = 1;
  } else if (typeof m00OrSource === 'number') {
    this.m00 = m00OrSource;
    this.m01 = m01 ?? 0;
    this.m10 = m10 ?? 0;
    this.m11 = m11 ?? 1;
  } else if (Array.isArray(m00OrSource)) {
    if (m00OrSource.length < 4) {
      throw new RangeError('Matrix2: array must have at least 4 elements');
    }
    this.m00 = m00OrSource[0];
    this.m01 = m00OrSource[1];
    this.m10 = m00OrSource[2];
    this.m11 = m00OrSource[3];
  } else if (
    typeof m00OrSource === 'object' &&
    'm00' in m00OrSource &&
    'm01' in m00OrSource &&
    'm10' in m00OrSource &&
    'm11' in m00OrSource
  ) {
    this.m00 = m00OrSource.m00;
    this.m01 = m00OrSource.m01;
    this.m10 = m00OrSource.m10;
    this.m11 = m00OrSource.m11;
  } else {
    throw new TypeError('Matrix2: invalid constructor arguments');
  }
}
```

---

### 3.12 Getters de Instancia

| Vector2                | Matrix2              | Estado | Acción                                           |
| ---------------------- | -------------------- | ------ | ------------------------------------------------ |
| `normalized`           | -                    | N/A    | No aplica (normalización matricial es diferente) |
| `negated`              | `negated`            | ✅     | -                                                |
| `absolute`             | -                    | ❌     | Añadir                                           |
| `xy`, `yx`, `xx`, `yy` | -                    | N/A    | No aplica                                        |
| -                      | `transposed`         | ✅     | Mantener                                         |
| -                      | `inverted`           | ✅     | Mantener                                         |
| -                      | `column0`, `column1` | ✅     | Mantener                                         |
| -                      | `row0`, `row1`       | ✅     | Mantener                                         |
| -                      | `diagonal`           | ✅     | Mantener                                         |

**Getters faltantes:**

```typescript
/**
 * Returns absolute-valued copy.
 */
public get absolute(): Matrix2 {
  return new Matrix2(
    scalarAbs(this.m00),
    scalarAbs(this.m01),
    scalarAbs(this.m10),
    scalarAbs(this.m11),
  );
}

/**
 * Returns trace (sum of diagonal elements).
 * Convenience getter for trace() method.
 */
public get traceValue(): number {
  return this.m00 + this.m11;
}

/**
 * Returns determinant value.
 * Convenience getter for determinant() method.
 */
public get det(): number {
  return this.m00 * this.m11 - this.m01 * this.m10;
}
```

---

### 3.13 Métodos de Instancia - Corrección de Firmas

**Todos los siguientes métodos deben corregirse para:**

1. Eliminar `out?` parámetro
2. Cambiar retorno de `Matrix2` a `this`
3. Cambiar tipos de `ReadonlyMatrix2` a `ReadonlyMatrix2Like`

```typescript
// ANTES (problemático)
add(other: ReadonlyMatrix2, out?: Matrix2): Matrix2

// DESPUÉS (correcto)
add(other: ReadonlyMatrix2Like): this
```

**Lista de métodos a corregir:**

- `add`
- `subtract`
- `multiply`
- `scale`
- `transpose`
- `inverse`
- `adjugate`
- `negate`
- `premultiply`
- `rotate`
- `scaleBy`
- `lerp`
- `multiplyScalar`

---

### 3.14 Métodos de Instancia Faltantes

| Vector2                 | Matrix2         | Estado | Acción                   |
| ----------------------- | --------------- | ------ | ------------------------ |
| `zero()`                | -               | ❌     | **Añadir**               |
| `addScalar(s)`          | -               | ❌     | Añadir                   |
| `subtractScalar(s)`     | -               | ❌     | Añadir                   |
| `divide(v)`             | -               | ❌     | Añadir (component-wise)  |
| `divideScalar(s)`       | -               | ❌     | **Añadir**               |
| `divideScalarSafe(s)`   | -               | ❌     | Añadir                   |
| `addScaledVector`       | -               | ❌     | Añadir `addScaledMatrix` |
| `fma(scale, v)`         | -               | ❌     | Añadir                   |
| `inverse()`             | `inverse(out?)` | ⚠️     | Corregir firma           |
| `inverseSafe()`         | -               | ❌     | **Añadir**               |
| `floor()`               | -               | ❌     | **Añadir**               |
| `ceil()`                | -               | ❌     | **Añadir**               |
| `round()`               | -               | ❌     | **Añadir**               |
| `abs()`                 | -               | ❌     | **Añadir**               |
| `sign()`                | -               | ❌     | **Añadir**               |
| `min(v)`                | -               | ❌     | **Añadir**               |
| `max(v)`                | -               | ❌     | **Añadir**               |
| `clamp(min, max)`       | -               | ❌     | Añadir                   |
| `clampScalar(min, max)` | -               | ❌     | Añadir                   |
| `isZero(epsilon?)`      | -               | ❌     | **Añadir**               |
| `isFinite()`            | -               | ❌     | **Añadir**               |
| `hasNaN()`              | -               | ❌     | **Añadir**               |
| `lerpClamped(end, t)`   | -               | ❌     | Añadir                   |
| `smoothStep(end, t)`    | -               | ❌     | Añadir                   |
| `[Symbol.iterator]`     | -               | ❌     | **Añadir**               |

**Implementación de métodos faltantes críticos:**

```typescript
/**
 * Resets matrix to zero.
 */
public zero(): this {
  this.m00 = 0;
  this.m01 = 0;
  this.m10 = 0;
  this.m11 = 0;
  return this;
}

/**
 * Safe inverse. Sets to identity if singular.
 */
public inverseSafe(): this {
  const det = this.determinant();
  if (isNearZero(det)) {
    return this.identity();
  }
  const invDet = 1 / det;
  const m00 = this.m11 * invDet;
  const m01 = -this.m01 * invDet;
  const m10 = -this.m10 * invDet;
  const m11 = this.m00 * invDet;
  return this.set(m00, m01, m10, m11);
}

/**
 * Divides all components by scalar.
 */
public divideScalar(s: number): this {
  if (isNearZero(s)) {
    return this.zero();
  }
  const inv = 1 / s;
  this.m00 *= inv;
  this.m01 *= inv;
  this.m10 *= inv;
  this.m11 *= inv;
  return this;
}

/**
 * Applies floor to all components.
 */
public floor(): this {
  this.m00 = Math.floor(this.m00);
  this.m01 = Math.floor(this.m01);
  this.m10 = Math.floor(this.m10);
  this.m11 = Math.floor(this.m11);
  return this;
}

/**
 * Applies ceil to all components.
 */
public ceil(): this {
  this.m00 = Math.ceil(this.m00);
  this.m01 = Math.ceil(this.m01);
  this.m10 = Math.ceil(this.m10);
  this.m11 = Math.ceil(this.m11);
  return this;
}

/**
 * Applies round to all components.
 */
public round(): this {
  this.m00 = Math.round(this.m00);
  this.m01 = Math.round(this.m01);
  this.m10 = Math.round(this.m10);
  this.m11 = Math.round(this.m11);
  return this;
}

/**
 * Applies abs to all components.
 */
public abs(): this {
  this.m00 = scalarAbs(this.m00);
  this.m01 = scalarAbs(this.m01);
  this.m10 = scalarAbs(this.m10);
  this.m11 = scalarAbs(this.m11);
  return this;
}

/**
 * Component-wise minimum.
 */
public min(other: ReadonlyMatrix2Like): this {
  this.m00 = scalarMin(this.m00, other.m00);
  this.m01 = scalarMin(this.m01, other.m01);
  this.m10 = scalarMin(this.m10, other.m10);
  this.m11 = scalarMin(this.m11, other.m11);
  return this;
}

/**
 * Component-wise maximum.
 */
public max(other: ReadonlyMatrix2Like): this {
  this.m00 = scalarMax(this.m00, other.m00);
  this.m01 = scalarMax(this.m01, other.m01);
  this.m10 = scalarMax(this.m10, other.m10);
  this.m11 = scalarMax(this.m11, other.m11);
  return this;
}

/**
 * Tests if zero matrix.
 */
public isZero(epsilon = 0): boolean {
  if (epsilon === 0) {
    return this.m00 === 0 && this.m01 === 0 && this.m10 === 0 && this.m11 === 0;
  }
  return (
    isNearZero(this.m00, epsilon) &&
    isNearZero(this.m01, epsilon) &&
    isNearZero(this.m10, epsilon) &&
    isNearZero(this.m11, epsilon)
  );
}

/**
 * Tests if all components are finite.
 */
public isFinite(): boolean {
  return (
    Number.isFinite(this.m00) &&
    Number.isFinite(this.m01) &&
    Number.isFinite(this.m10) &&
    Number.isFinite(this.m11)
  );
}

/**
 * Tests if any component is NaN.
 */
public hasNaN(): boolean {
  return (
    Number.isNaN(this.m00) ||
    Number.isNaN(this.m01) ||
    Number.isNaN(this.m10) ||
    Number.isNaN(this.m11)
  );
}

/**
 * Iterator for array destructuring.
 * Yields elements in column-major order: m00, m01, m10, m11.
 */
public *[Symbol.iterator](): IterableIterator<number> {
  yield this.m00;
  yield this.m01;
  yield this.m10;
  yield this.m11;
}

/**
 * Solves Ax = b for x, mutating this to store the result in the provided vector.
 * @param b - Right-hand side vector.
 * @param out - Output vector for solution.
 * @returns The solution vector.
 * @throws {Error} If matrix is singular.
 */
public solve(b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix2.solve(this, b, out);
}

/**
 * Safe solve - returns zero vector if singular.
 */
public solveSafe(b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Matrix2.solveSafe(this, b, out);
}
```

---

### 3.15 Integración con Otros Módulos math2d

**Vector2 usa:**

- `sinCos` from `auxiliary/angle/operations`
- `safeDivide`, `safeSqrt`, `safeAcos` from `auxiliary/numeric/safety`
- `abs`, `clamp`, `saturate`, `sign`, etc. from `auxiliary/scalar/arithmetic`
- `isNearZero`, `nearEquals` from `auxiliary/scalar/comparison`
- `EPSILON` from `auxiliary/scalar/constants`
- `lerp` from `auxiliary/scalar/interpolation`
- `DeterministicMath` from `deterministic/deterministic-math`
- `assertFinite` from `validation/assert`

**Matrix2 usa actualmente:**

- `sinCos` ✅
- `safeDivide`, `safeSqrt` ✅
- `saturate` ✅
- `isNearZero`, `nearEquals` ✅
- `EPSILON` ✅
- `lerp` ✅
- `DeterministicMath` ✅
- `assertFinite`, `assertSafeInteger` ✅

**Matrix2 debería añadir:**

- `abs` (como `scalarAbs`)
- `clamp`
- `sign` (como `scalarSign`)
- `min`, `max` (como `scalarMin`, `scalarMax`)
- `mod` (si se añade modulo)

---

## 4. Orden de Implementación

### Fase 1: Correcciones Críticas (Breaking Changes)

1. Eliminar `out?` de métodos de instancia mutables
2. Cambiar retorno `Matrix2` → `this` en métodos de instancia
3. Cambiar tipos `ReadonlyMatrix2` → `ReadonlyMatrix2Like`
4. Renombrar `sanitize` → `sanitizeComponent`

### Fase 2: Física 2D

5. Añadir `solve(b)` y `solveSafe(b)` estáticos
6. Añadir `solve(b)` y `solveSafe(b)` de instancia
7. Añadir `multiplyTranspose` y `transposeMultiply`
8. Añadir `getSymInverse`

### Fase 3: Paridad con Vector2 - Factories

9. Añadir `fromObject`
10. Añadir `copy` estático
11. Añadir `fromAngle` (alias)
12. Mejorar constructor con overloads

### Fase 4: Paridad con Vector2 - Aritmética

13. Añadir `addScalar`, `subtractScalar`, `divideScalar` (estáticos e instancia)
14. Añadir `fma`, `addScaledMatrix`
15. Añadir `divide` (component-wise)

### Fase 5: Paridad con Vector2 - Validación

16. Añadir `isZero`, `nearZero`, `exactEquals`
17. Añadir `isFinite`, `hasNaN`
18. Añadir `isSymmetric`, `isDiagonal`, `isSkewSymmetric`
19. Separar `equals` en `exactEquals` y `nearEquals`

### Fase 6: Paridad con Vector2 - Transformaciones

20. Añadir `floor`, `ceil`, `round`, `abs`, `sign` (estáticos e instancia)
21. Añadir `min`, `max` (estáticos e instancia)
22. Añadir `clamp`, `clampScalar`
23. Añadir `inverseSafe`

### Fase 7: Paridad con Vector2 - Interpolación

24. Añadir `lerpClamped`
25. Añadir `slerp` (para rotaciones)
26. Añadir `smoothStep`

### Fase 8: Paridad con Vector2 - Conversión

27. Añadir `[Symbol.iterator]`
28. Añadir `zero()` método de instancia
29. Añadir getter `absolute`

### Fase 9: Geometría

30. Añadir `dot` (Frobenius)
31. Añadir `frobeniusNorm` estático
32. Añadir `frobeniusNormSquared`
33. Añadir `distance`, `distanceSquared`

### Fase 10: Constantes

34. Añadir `ONE`, `NEGATIVE_ONE`
35. Añadir `EPSILON_MATRIX`
36. Añadir `POSITIVE_INFINITY`, `NEGATIVE_INFINITY`

---

## 5. Tests Requeridos

Para cada método añadido o modificado:

1. **Unit tests básicos** - valores conocidos
2. **Edge cases** - cero, infinito, NaN, singularidad
3. **Consistency tests** - estático vs instancia producen mismo resultado
4. **Property-based tests** - identidades matemáticas
   - `M × M⁻¹ = I`
   - `(AB)ᵀ = BᵀAᵀ`
   - `det(AB) = det(A) × det(B)`
   - `solve(b)` verifica `A × x = b`

---

## 6. Estimación de Impacto

| Categoría                | Métodos Nuevos | Métodos Modificados |
| ------------------------ | -------------- | ------------------- |
| Factories                | 3              | 0                   |
| Aritmética               | 12             | 0                   |
| Validación               | 8              | 1 (`equals`)        |
| Transformaciones         | 14             | 0                   |
| Restricciones            | 4              | 0                   |
| Interpolación            | 3              | 0                   |
| Física                   | 4              | 0                   |
| Geometría                | 5              | 0                   |
| Instancia (correcciones) | 0              | 14                  |
| Instancia (nuevos)       | 15             | 0                   |
| Conversión               | 2              | 0                   |
| Constantes               | 5              | 0                   |
| **TOTAL**                | **~70**        | **~15**             |

**Líneas estimadas adicionales:** ~800-1000  
**Matrix2 final estimado:** ~2000-2200 líneas

---

## 7. Notas de Compatibilidad

### Breaking Changes (Fase 1)

- Eliminar `out?` de métodos de instancia mutables
- Cambiar tipos de retorno de `Matrix2` a `this`
- Esto afectará código que pase `out` a métodos de instancia

### Deprecaciones Sugeridas

- `equals(a, b, epsilon)` → `nearEquals(a, b, epsilon)` (con periodo de deprecación)

### Migraciones

```typescript
// Antes
const result = matrix.add(other, outMatrix);

// Después - opción 1: usar método estático
const result = Matrix2.add(matrix, other, outMatrix);

// Después - opción 2: clonar primero
const result = matrix.clone().add(other);
```

---

## 8. Referencias

- **Vector2 actual:** `packages/math2d/src/core/vector2.ts`
- **glMatrix mat2:** https://glmatrix.net/docs/mat2.js.html
- **Box2D b2Mat22:** https://box2d.org/documentation/
- **Three.js Matrix3:** https://threejs.org/docs/#api/en/math/Matrix3
- **Eigen Matrix2d:** https://eigen.tuxfamily.org/

---

## 9. Interacciones con Otros Módulos de math2d

### 9.1 Mapa de Dependencias Actual

```
┌─────────────────────────────────────────────────────────────────┐
│                          math2d/core                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐              │
│  │ Vector2  │◄────►│ Matrix2  │◄────►│ Rotation2│              │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘              │
│       │                 │                  │                    │
│       │                 ▼                  │                    │
│       │           ┌──────────┐             │                    │
│       └──────────►│ Matrix3  │◄────────────┘                    │
│                   └────┬─────┘                                  │
│                        │                                        │
│                        ▼                                        │
│                  ┌───────────┐       ┌──────────┐              │
│                  │Transform2 │◄─────►│ Complex  │              │
│                  └───────────┘       └──────────┘              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 9.2 Interacciones Actuales de Matrix2

| Módulo         | Dirección           | Métodos/Propiedades                                  | Estado   |
| -------------- | ------------------- | ---------------------------------------------------- | -------- |
| **Vector2**    | Matrix2 → Vector2   | `transformVector`, `getScale`, `getColumn`, `getRow` | ✅       |
| **Vector2**    | Vector2 → Matrix2   | `applyMatrix2`                                       | ✅       |
| **Rotation2**  | Matrix2 → Rotation2 | `fromRotation(ReadonlyRotation2)`                    | ✅       |
| **Rotation2**  | Rotation2 → Matrix2 | (ninguno directo)                                    | ⚠️ Falta |
| **Matrix3**    | Matrix3 → Matrix2   | `toMatrix2`, `upperLeft2x2`                          | ✅       |
| **Matrix3**    | Matrix2 → Matrix3   | `fromMatrix2`                                        | ✅       |
| **Complex**    | Complex → Matrix2   | `toRotationMatrix() → Matrix2Like`                   | ✅       |
| **Complex**    | Matrix2 → Complex   | (ninguno)                                            | ❌ Falta |
| **Transform2** | (ninguno directo)   | -                                                    | ⚠️       |

### 9.3 Interacciones Faltantes o Incompletas

#### 9.3.1 Matrix2 ↔ Rotation2

**Actual:**

```typescript
// Matrix2 puede crearse desde Rotation2
Matrix2.fromRotation(rotation: ReadonlyRotation2 | number, out?): Matrix2
```

**Faltante:**

```typescript
// En Rotation2: crear desde Matrix2
Rotation2.fromMatrix(matrix: ReadonlyMatrix2Like, out?): Rotation2

// En Matrix2: extraer rotación como Rotation2
Matrix2.extractRotation(matrix: ReadonlyMatrix2Like, out?: Rotation2): Rotation2
toRotation(out?: Rotation2): Rotation2
```

**Implementación sugerida para Matrix2:**

```typescript
/**
 * Extracts the rotation component as a Rotation2.
 * @param matrix - Matrix to extract rotation from
 * @param out - Optional output rotation
 * @returns Rotation2 representing the rotation component
 *
 * @remarks
 * Extracts the rotation by normalizing the first column.
 * For non-uniform scale matrices, this extracts the rotation
 * that would be applied first in S*R decomposition.
 *
 * @category Conversion
 */
public static extractRotation(matrix: ReadonlyMatrix2Like, out?: Rotation2): Rotation2 {
  const scale = safeSqrt(matrix.m00 * matrix.m00 + matrix.m01 * matrix.m01);
  if (isNearZero(scale)) {
    return Rotation2.fromAngle(0, out);
  }
  const cos = matrix.m00 / scale;
  const sin = matrix.m01 / scale;
  return Rotation2.ensureOut(out).set(cos, sin);
}

/**
 * Converts this matrix to a Rotation2.
 * @param out - Optional output rotation
 * @returns Rotation2 representing the rotation component
 */
public toRotation(out?: Rotation2): Rotation2 {
  return Matrix2.extractRotation(this, out);
}
```

#### 9.3.2 Matrix2 ↔ Complex

**Actual:**

```typescript
// Complex puede convertirse a Matrix2Like (no Matrix2)
complex.toRotationMatrix(out?: Matrix2Like): Matrix2Like
```

**Faltante:**

```typescript
// En Matrix2: crear desde Complex
Matrix2.fromComplex(complex: ReadonlyComplexLike, out?): Matrix2

// En Matrix2: convertir a Complex
Matrix2.toComplex(matrix: ReadonlyMatrix2Like, out?: Complex): Complex
toComplex(out?: Complex): Complex
```

**Implementación sugerida:**

````typescript
/**
 * Creates a rotation matrix from a complex number.
 * The complex number is normalized to create a valid rotation.
 * @param complex - Complex number (will be normalized)
 * @param out - Optional output matrix
 * @returns Rotation matrix
 *
 * @example
 * ```typescript
 * const c = Complex.fromPolar(1, Math.PI / 4);
 * const m = Matrix2.fromComplex(c); // 45° rotation matrix
 * ```
 *
 * @category Factory
 */
public static fromComplex(complex: ReadonlyComplexLike, out?: Matrix2): Matrix2 {
  const mag = safeSqrt(complex.real * complex.real + complex.imag * complex.imag);
  if (isNearZero(mag)) {
    return Matrix2.ensureOut(out).identity();
  }
  const cos = complex.real / mag;
  const sin = complex.imag / mag;
  return Matrix2.ensureOut(out).set(cos, sin, -sin, cos);
}

/**
 * Extracts the rotation as a complex number.
 * @param matrix - Matrix to extract from
 * @param out - Optional output complex
 * @returns Complex number representing the rotation
 */
public static toComplex(matrix: ReadonlyMatrix2Like, out?: Complex): Complex {
  const scale = safeSqrt(matrix.m00 * matrix.m00 + matrix.m01 * matrix.m01);
  if (isNearZero(scale)) {
    return Complex.ensureOut(out).set(1, 0);
  }
  return Complex.ensureOut(out).set(matrix.m00 / scale, matrix.m01 / scale);
}

/**
 * Converts this matrix's rotation to a complex number.
 * @param out - Optional output complex
 * @returns Complex number representing the rotation
 */
public toComplex(out?: Complex): Complex {
  return Matrix2.toComplex(this, out);
}
````

#### 9.3.3 Matrix2 ↔ Transform2

**Actual:** No hay interacción directa.

**Faltante:**

```typescript
// En Transform2: aplicar solo la matriz 2x2 (sin traslación)
Transform2.fromMatrix2(matrix: ReadonlyMatrix2Like, out?): Transform2

// En Matrix2: extraer de Transform2 (solo rotación/escala)
Matrix2.fromTransform(transform: ReadonlyTransform2Like, out?): Matrix2
```

**Implementación sugerida:**

````typescript
/**
 * Creates a Matrix2 from a Transform2 (rotation × scale only, no translation).
 * @param transform - Transform to extract from
 * @param out - Optional output matrix
 * @returns Matrix2 representing rotation and scale
 *
 * @example
 * ```typescript
 * const t = new Transform2({ x: 10, y: 20 }, Math.PI / 4, { x: 2, y: 1 });
 * const m = Matrix2.fromTransform(t); // Only rotation and scale
 * ```
 *
 * @category Factory
 */
public static fromTransform(transform: ReadonlyTransform2Like, out?: Matrix2): Matrix2 {
  const { cos, sin } = sinCos(transform.rotation);
  const sx = transform.scale.x;
  const sy = transform.scale.y;
  return Matrix2.ensureOut(out).set(
    cos * sx,
    sin * sx,
    -sin * sy,
    cos * sy,
  );
}
````

### 9.4 Simetría de Patrones Entre Módulos

#### Patrón de Conversión Bidireccional

Cada módulo debería poder convertirse a/desde tipos relacionados:

| Desde   | Hacia             | Método en Origen        | Método en Destino        | Estado   |
| ------- | ----------------- | ----------------------- | ------------------------ | -------- |
| Matrix2 | Vector2 (columna) | `getColumn()`           | `Matrix2.fromColumns()`  | ✅       |
| Matrix2 | Rotation2         | `toRotation()`          | `Rotation2.fromMatrix()` | ❌ Falta |
| Matrix2 | Complex           | `toComplex()`           | `Matrix2.fromComplex()`  | ❌ Falta |
| Matrix2 | Matrix3           | `Matrix3.fromMatrix2()` | `toMatrix2()`            | ✅       |
| Matrix2 | angle (number)    | `getRotation()`         | `fromRotation()`         | ✅       |
| Matrix2 | Transform2        | -                       | `fromTransform()`        | ❌ Falta |

#### Patrón de Transformación de Vectores

Todos los módulos que representan transformaciones deberían tener:

| Módulo     | `transformVector` | `transformPoint`              | Batch | Estado Matrix2 |
| ---------- | ----------------- | ----------------------------- | ----- | -------------- |
| Vector2    | N/A               | N/A                           | N/A   | -              |
| Matrix2    | ✅                | N/A (2x2 no tiene traslación) | ❌    | Añadir batch   |
| Matrix3    | ✅                | ✅                            | ✅    | -              |
| Rotation2  | `apply()`         | `apply()`                     | ❌    | -              |
| Transform2 | ✅                | ✅                            | ✅    | -              |

**Métodos batch faltantes en Matrix2:**

```typescript
/**
 * Transforms multiple vectors efficiently (batch operation).
 * @param vectors - Array of vectors to transform
 * @param out - Optional output array
 * @returns Array of transformed vectors
 *
 * @category Batch Operations
 */
public transformVectors(
  vectors: readonly ReadonlyVector2Like[],
  out: Vector2[] = [],
): Vector2[] {
  for (let i = 0; i < vectors.length; i++) {
    const v = vectors[i]!;
    if (out[i]) {
      out[i]!.set(
        this.m00 * v.x + this.m10 * v.y,
        this.m01 * v.x + this.m11 * v.y,
      );
    } else {
      out[i] = new Vector2(
        this.m00 * v.x + this.m10 * v.y,
        this.m01 * v.x + this.m11 * v.y,
      );
    }
  }
  return out;
}

/**
 * Static batch transform.
 */
public static transformVectors(
  matrix: ReadonlyMatrix2Like,
  vectors: readonly ReadonlyVector2Like[],
  out: Vector2[] = [],
): Vector2[] {
  for (let i = 0; i < vectors.length; i++) {
    const v = vectors[i]!;
    if (out[i]) {
      out[i]!.set(
        matrix.m00 * v.x + matrix.m10 * v.y,
        matrix.m01 * v.x + matrix.m11 * v.y,
      );
    } else {
      out[i] = new Vector2(
        matrix.m00 * v.x + matrix.m10 * v.y,
        matrix.m01 * v.x + matrix.m11 * v.y,
      );
    }
  }
  return out;
}
```

### 9.5 Uso de Módulos Auxiliares

#### Dependencias Actuales

| Módulo Auxiliar                    | Vector2 | Matrix2 | Matrix3 | Rotation2 | Complex | Transform2 |
| ---------------------------------- | ------- | ------- | ------- | --------- | ------- | ---------- |
| `auxiliary/angle/operations`       | ✅      | ✅      | ✅      | ✅        | ✅      | ✅         |
| `auxiliary/angle/normalization`    | ❌      | ❌      | ❌      | ✅        | ✅      | ✅         |
| `auxiliary/angle/interpolation`    | ❌      | ❌      | ❌      | ✅        | ✅      | ✅         |
| `auxiliary/numeric/safety`         | ✅      | ✅      | ✅      | ✅        | ✅      | ✅         |
| `auxiliary/scalar/arithmetic`      | ✅      | ✅      | ❌      | ✅        | ✅      | ✅         |
| `auxiliary/scalar/comparison`      | ✅      | ✅      | ✅      | ✅        | ✅      | ✅         |
| `auxiliary/scalar/constants`       | ✅      | ✅      | ✅      | ✅        | ✅      | ✅         |
| `auxiliary/scalar/interpolation`   | ✅      | ✅      | ✅      | ✅        | ✅      | ✅         |
| `deterministic/deterministic-math` | ✅      | ✅      | ✅      | ✅        | ✅      | ❌         |
| `validation/assert`                | ✅      | ✅      | ✅      | ✅        | ✅      | ✅         |

#### Dependencias Faltantes en Matrix2

Matrix2 debería importar:

```typescript
// Añadir a imports
import {
 abs as scalarAbs,
 clamp,
 max as scalarMax,
 min as scalarMin,
 sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';
```

---

## 10. Operaciones Matemáticas Fundamentales

### 10.1 Álgebra Lineal Básica

Las siguientes operaciones son fundamentales en álgebra lineal y deben estar presentes en cualquier implementación de matrices 2×2:

| Operación                    | Descripción Matemática         | Estado                    |
| ---------------------------- | ------------------------------ | ------------------------- |
| **Resolución de sistemas**   | Resolver Ax = b                | ❌ Falta `solve`          |
| **Producto con transpuesta** | A × Bᵀ                         | ❌ Falta                  |
| **Transpuesta por matriz**   | Aᵀ × B                         | ❌ Falta                  |
| **Inversa de simétrica**     | Inversa optimizada para M = Mᵀ | ❌ Falta                  |
| **Eigenvalores**             | λ donde det(A - λI) = 0        | ❌ Falta (baja prioridad) |

### 10.2 Resolución de Sistemas Lineales

**Método `solve(b)`** - Resolver el sistema Ax = b para x

````typescript
/**
 * Solves the linear system Ax = b for x.
 *
 * @param b - Right-hand side vector
 * @param out - Optional output vector
 * @returns Solution vector x such that Ax = b
 * @throws {Error} If matrix is singular (determinant ≈ 0)
 *
 * @remarks
 * Uses Cramer's rule for 2×2 systems:
 * x = (b.x * m11 - b.y * m10) / det
 * y = (b.y * m00 - b.x * m01) / det
 *
 * Time complexity: O(1)
 *
 * @example
 * ```typescript
 * const A = new Matrix2(4, 2, 1, 3);
 * const b = new Vector2(10, 7);
 * const x = A.solve(b);
 * // Verifica: A.transformVector(x) ≈ b
 * ```
 *
 * @category Linear Algebra
 */
public static solve(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
    throw new Error('Matrix2.solve: singular matrix');
  }
  const invDet = 1 / det;
  return Vector2.fromValues(
    invDet * (matrix.m11 * b.x - matrix.m10 * b.y),
    invDet * (matrix.m00 * b.y - matrix.m01 * b.x),
    out,
  );
}

/**
 * Safe solve - returns zero vector if singular.
 * @category Linear Algebra
 */
public static solveSafe(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  if (isNearZero(det)) {
    return Vector2.fromValues(0, 0, out);
  }
  const invDet = 1 / det;
  return Vector2.fromValues(
    invDet * (matrix.m11 * b.x - matrix.m10 * b.y),
    invDet * (matrix.m00 * b.y - matrix.m01 * b.x),
    out,
  );
}
````

### 10.3 Productos con Transpuesta

Operaciones comunes en álgebra lineal que evitan crear matrices intermedias:

```typescript
/**
 * Computes A × Bᵀ efficiently without allocating Bᵀ.
 *
 * @remarks
 * Mathematical identity: (A × Bᵀ)ᵢⱼ = Σₖ Aᵢₖ × Bⱼₖ
 *
 * Common in:
 * - Computing Gram matrices (Aᵀ × A)
 * - Covariance matrices
 * - Symmetric products
 *
 * @category Linear Algebra
 */
public static multiplyTranspose(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    a.m00 * b.m00 + a.m10 * b.m10,
    a.m01 * b.m00 + a.m11 * b.m10,
    a.m00 * b.m01 + a.m10 * b.m11,
    a.m01 * b.m01 + a.m11 * b.m11,
  );
}

/**
 * Computes Aᵀ × B efficiently without allocating Aᵀ.
 *
 * @remarks
 * Mathematical identity: (Aᵀ × B)ᵢⱼ = Σₖ Aₖᵢ × Bₖⱼ
 *
 * @category Linear Algebra
 */
public static transposeMultiply(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    a.m00 * b.m00 + a.m01 * b.m01,
    a.m10 * b.m00 + a.m11 * b.m01,
    a.m00 * b.m10 + a.m01 * b.m11,
    a.m10 * b.m10 + a.m11 * b.m11,
  );
}
```

### 10.4 Matrices Simétricas

Para matrices donde M = Mᵀ (m01 = m10), operaciones optimizadas:

```typescript
/**
 * Computes the inverse of a symmetric matrix more efficiently.
 *
 * @remarks
 * For symmetric matrices, m01 = m10, so:
 * det = m00 × m11 - m01²
 *
 * The result is also symmetric.
 *
 * @param matrix - Symmetric matrix (assumes m01 = m10)
 * @param out - Optional output matrix
 * @returns Inverse symmetric matrix
 * @throws {Error} If matrix is singular
 *
 * @category Linear Algebra
 */
public static symmetricInverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m01;
  if (isNearZero(det)) {
    throw new Error('Matrix2.symmetricInverse: singular matrix');
  }
  const invDet = 1 / det;
  return Matrix2.ensureOut(out).set(
    matrix.m11 * invDet,
    -matrix.m01 * invDet,
    -matrix.m01 * invDet, // Symmetric
    matrix.m00 * invDet,
  );
}

/**
 * Tests if the matrix is symmetric (m01 ≈ m10).
 * @category Comparison
 */
public static isSymmetric(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return nearEquals(matrix.m01, matrix.m10, epsilon);
}
```

### 10.5 Propiedades Matriciales

```typescript
/**
 * Tests if the matrix is skew-symmetric (Aᵀ = -A).
 * For 2×2: m00 = m11 = 0, m01 = -m10
 * @category Comparison
 */
public static isSkewSymmetric(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return (
    isNearZero(matrix.m00, epsilon) &&
    isNearZero(matrix.m11, epsilon) &&
    nearEquals(matrix.m01, -matrix.m10, epsilon)
  );
}

/**
 * Tests if the matrix is diagonal (off-diagonal elements ≈ 0).
 * @category Comparison
 */
public static isDiagonal(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return isNearZero(matrix.m01, epsilon) && isNearZero(matrix.m10, epsilon);
}

/**
 * Tests if the matrix is a scalar matrix (diagonal with equal elements).
 * @category Comparison
 */
public static isScalar(matrix: ReadonlyMatrix2Like, epsilon = EPSILON): boolean {
  return (
    Matrix2.isDiagonal(matrix, epsilon) &&
    nearEquals(matrix.m00, matrix.m11, epsilon)
  );
}
```

---

## 11. Buenas Prácticas de Librerías Matemáticas

### 11.1 glMatrix

**Patrones adoptados:**

- Funciones estáticas puras con `out` opcional para control de allocación
- Nombres descriptivos: `fromRotation`, `fromScaling`
- `frob()` para norma de Frobenius
- Separación clara entre operaciones puras y mutables

**Aplicar a Matrix2:**

```typescript
// glMatrix style: multiplyScalarAndAdd (fma matricial)
public static multiplyScalarAndAdd(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  scale: number,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    a.m00 + b.m00 * scale,
    a.m01 + b.m01 * scale,
    a.m10 + b.m10 * scale,
    a.m11 + b.m11 * scale,
  );
}

// Alias más intuitivo
public static fma = Matrix2.multiplyScalarAndAdd;
```

### 11.2 Three.js

**Patrones adoptados:**

- Métodos de instancia mutables para chaining fluido
- Getters para propiedades derivadas (`determinant`, `transposed`)
- Separación clara entre mutación (`transpose()`) y creación (`transposed`)
- Métodos `extract*` para descomposición

**Aplicar a Matrix2:**

```typescript
// Three.js style: extractRotation que muta this
public extractRotation(m: ReadonlyMatrix2Like): this {
  const scale = safeSqrt(m.m00 * m.m00 + m.m01 * m.m01);
  if (isNearZero(scale)) {
    return this.identity();
  }
  const invScale = 1 / scale;
  return this.set(
    m.m00 * invScale,
    m.m01 * invScale,
    -m.m01 * invScale,
    m.m00 * invScale,
  );
}

// Getter inmutable vs método mutable
public get transposed(): Matrix2  // Crea nueva matriz
public transpose(): this          // Muta this
```

### 11.3 Eigen (C++)

**Patrones adoptados:**

- Operaciones component-wise explícitas con prefijo `cwise`
- Distinción entre operaciones matriciales y element-wise

**Aplicar a Matrix2:**

```typescript
// Operaciones element-wise (Hadamard) con nombres claros
public static cwiseProduct(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    a.m00 * b.m00,
    a.m01 * b.m01,
    a.m10 * b.m10,
    a.m11 * b.m11,
  );
}

public static cwiseQuotient(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    safeDivide(a.m00, b.m00),
    safeDivide(a.m01, b.m01),
    safeDivide(a.m10, b.m10),
    safeDivide(a.m11, b.m11),
  );
}

public static cwiseMin(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    scalarMin(a.m00, b.m00),
    scalarMin(a.m01, b.m01),
    scalarMin(a.m10, b.m10),
    scalarMin(a.m11, b.m11),
  );
}

public static cwiseMax(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    scalarMax(a.m00, b.m00),
    scalarMax(a.m01, b.m01),
    scalarMax(a.m10, b.m10),
    scalarMax(a.m11, b.m11),
  );
}
```

### 11.4 NumPy / SciPy

**Patrones adoptados:**

- Funciones de álgebra lineal como ciudadanos de primera clase
- `solve` para sistemas lineales
- Descomposiciones matriciales

**Aplicar a Matrix2:**

```typescript
// NumPy/SciPy style: linalg namespace implícito
// Los métodos de álgebra lineal son parte de la clase

// solve: Ax = b → x
public solve(b: ReadonlyVector2Like, out?: Vector2): Vector2

// Descomposición polar: M = R × S (rotación × escala simétrica)
public static polarDecomposition(matrix: ReadonlyMatrix2Like): {
  rotation: Matrix2;
  stretch: Matrix2;
}
```

### 11.5 Convenciones Adoptadas para math2d

| Aspecto               | Convención                | Ejemplo                     |
| --------------------- | ------------------------- | --------------------------- |
| **Estático puro**     | `out?` opcional al final  | `Matrix2.add(a, b, out?)`   |
| **Instancia mutable** | Sin `out`, retorna `this` | `m.add(other): this`        |
| **Getter inmutable**  | Propiedad get             | `m.transposed`              |
| **Component-wise**    | Prefijo `cwise`           | `cwiseProduct`, `cwiseMin`  |
| **Safe variants**     | Sufijo `Safe`             | `solveSafe`, `inverseSafe`  |
| **Validación**        | Prefijo `is`/`has`        | `isSymmetric`, `hasNaN`     |
| **Conversión**        | Prefijo `to`/`from`       | `toRotation`, `fromComplex` |

---

## 12. Checklist de Completitud por Categoría

### 12.1 Aritmética Básica

| Operación                      | Vector2 | Matrix2 | Prioridad |
| ------------------------------ | ------- | ------- | --------- |
| `add`                          | ✅      | ✅      | -         |
| `subtract`                     | ✅      | ✅      | -         |
| `multiply`                     | ✅      | ✅      | -         |
| `divide` (cwise)               | ✅      | ❌      | 🟡        |
| `scale`                        | ✅      | ✅      | -         |
| `negate`                       | ✅      | ✅      | -         |
| `addScalar`                    | ✅      | ❌      | 🟡        |
| `subtractScalar`               | ✅      | ❌      | 🟡        |
| `divideScalar`                 | ✅      | ❌      | 🟠        |
| `fma` / `multiplyScalarAndAdd` | ✅      | ❌      | 🟡        |
| `addScaledMatrix`              | ✅      | ❌      | 🟡        |

### 12.2 Transformaciones Numéricas (Element-wise)

| Operación          | Vector2 | Matrix2 | Prioridad |
| ------------------ | ------- | ------- | --------- |
| `floor`            | ✅      | ❌      | 🟡        |
| `ceil`             | ✅      | ❌      | 🟡        |
| `round`            | ✅      | ❌      | 🟡        |
| `abs`              | ✅      | ❌      | 🟡        |
| `sign`             | ✅      | ❌      | 🟢        |
| `cwiseMin` / `min` | ✅      | ❌      | 🟡        |
| `cwiseMax` / `max` | ✅      | ❌      | 🟡        |
| `cwiseProduct`     | ✅      | ❌      | 🟡        |
| `cwiseQuotient`    | ✅      | ❌      | 🟢        |
| `clamp`            | ✅      | ❌      | 🟢        |

### 12.3 Validación y Comparación

| Operación         | Vector2 | Matrix2 | Prioridad |
| ----------------- | ------- | ------- | --------- |
| `isZero`          | ✅      | ❌      | 🔴        |
| `nearZero`        | ✅      | ❌      | 🔴        |
| `isFinite`        | ✅      | ❌      | 🔴        |
| `hasNaN`          | ✅      | ❌      | 🔴        |
| `equals` (exacto) | ✅      | ⚠️      | 🟠        |
| `nearEquals`      | ✅      | ⚠️      | 🟠        |
| `isIdentity`      | N/A     | ✅      | -         |
| `isSymmetric`     | N/A     | ❌      | 🟡        |
| `isSkewSymmetric` | N/A     | ❌      | 🟢        |
| `isDiagonal`      | N/A     | ❌      | 🟢        |
| `isScalar`        | N/A     | ❌      | 🟢        |

### 12.4 Álgebra Lineal

| Operación            | Descripción                    | Estado | Prioridad |
| -------------------- | ------------------------------ | ------ | --------- |
| `solve(b)`           | Resolver Ax = b                | ❌     | 🔴        |
| `solveSafe(b)`       | Solve con fallback             | ❌     | 🔴        |
| `symmetricInverse`   | Inversa optimizada para M = Mᵀ | ❌     | 🟠        |
| `multiplyTranspose`  | A × Bᵀ                         | ❌     | 🟠        |
| `transposeMultiply`  | Aᵀ × B                         | ❌     | 🟠        |
| `polarDecomposition` | M = R × S                      | ❌     | 🟢        |
| `eigenvalues`        | λ₁, λ₂                         | ❌     | 🟢        |

### 12.5 Conversiones Entre Tipos

| Conversión               | Estado              | Prioridad |
| ------------------------ | ------------------- | --------- |
| Matrix2 → Rotation2      | ❌                  | 🟠        |
| Matrix2 → Complex        | ❌                  | 🟡        |
| Matrix2 → angle (number) | ✅ `getRotation()`  | -         |
| Rotation2 → Matrix2      | ✅ `fromRotation()` | -         |
| Complex → Matrix2        | ❌                  | 🟡        |
| Transform2 → Matrix2     | ❌                  | 🟡        |

### 12.6 Operaciones por Lotes (Batch)

| Operación          | Matrix3 | Transform2 | Matrix2 | Prioridad |
| ------------------ | ------- | ---------- | ------- | --------- |
| `transformPoints`  | ✅      | ✅         | N/A     | -         |
| `transformVectors` | ✅      | ✅         | ❌      | 🟡        |

### 12.7 Serialización y Conversión

| Operación           | Vector2 | Matrix2 | Prioridad |
| ------------------- | ------- | ------- | --------- |
| `clone()`           | ✅      | ✅      | -         |
| `copy()`            | ✅      | ✅      | -         |
| `toArray()`         | ✅      | ✅      | -         |
| `fromArray()`       | ✅      | ✅      | -         |
| `toObject()`        | ✅      | ✅      | -         |
| `fromObject()`      | ✅      | ❌      | 🟠        |
| `toJSON()`          | ✅      | ✅      | -         |
| `toString()`        | ✅      | ✅      | -         |
| `[Symbol.iterator]` | ✅      | ❌      | 🟡        |

---

## 13. Análisis Crítico de Decisiones de Diseño

### 13.1 ¿Por qué eliminar `out?` de métodos de instancia?

**Pregunta:** ¿No es útil tener `out` en métodos de instancia para evitar allocaciones?

**Análisis:**

| Aspecto                | Con `out?`                                | Sin `out?`                       |
| ---------------------- | ----------------------------------------- | -------------------------------- |
| **Claridad semántica** | ❌ Confuso: ¿muta `this`, `out`, o ambos? | ✅ Claro: siempre muta `this`    |
| **Predecibilidad**     | ❌ Comportamiento variable                | ✅ Comportamiento consistente    |
| **Chaining**           | ⚠️ Complicado: ¿qué retorna?              | ✅ Simple: retorna `this`        |
| **Zero-alloc**         | ✅ Posible                                | ✅ Posible via métodos estáticos |
| **Extensibilidad**     | ❌ Retorna `Matrix2`, no `this`           | ✅ Retorna `this` para subclases |

**Decisión:** Eliminar `out?` de instancia. Usuarios que necesiten control de allocación usarán métodos estáticos.

```typescript
// Zero-allocation path
Matrix2.multiply(a, b, result); // Usa result existente

// Convenience path
a.multiply(b); // Muta a, retorna a
```

### 13.2 ¿Por qué `ReadonlyMatrix2Like` en lugar de `ReadonlyMatrix2`?

**Pregunta:** ¿No es suficiente usar el tipo concreto?

**Análisis:**

```typescript
// Con tipo concreto
multiply(other: ReadonlyMatrix2): this
// ❌ Requiere exactamente Matrix2 o Readonly<Matrix2>

// Con interfaz
multiply(other: ReadonlyMatrix2Like): this
// ✅ Acepta cualquier objeto con {m00, m01, m10, m11}
```

**Beneficios de interfaz:**

1. **Duck typing:** Interoperabilidad con objetos plain
2. **Bibliotecas externas:** Acepta matrices de otras libs
3. **Testing:** Fácil crear mocks
4. **JSON:** Acepta objetos deserializados directamente

**Decisión:** Usar `ReadonlyMatrix2Like` para todos los parámetros de entrada.

### 13.3 ¿Por qué no añadir `eigenvalues()`?

**Pregunta:** Muchas librerías matemáticas incluyen cálculo de eigenvalores.

**Análisis:**

| Pro                               | Contra                             |
| --------------------------------- | ---------------------------------- |
| Operación matemática fundamental  | Complejidad O(n³) para n×n general |
| Útil para análisis de estabilidad | Para 2×2 es O(1) pero uso limitado |
| Completitud API                   | Añade ~50 líneas de código         |

**Eigenvalores 2×2:**

```typescript
// λ² - trace(A)λ + det(A) = 0
// λ = (trace ± √(trace² - 4·det)) / 2
```

**Decisión:** Añadir con **prioridad baja**. No es crítico para el motor de física, pero es matemáticamente fundamental. Implementar en Fase final.

### 13.4 ¿Por qué `solve(b)` es esencial?

**Pregunta:** ¿No es suficiente con `inverse()` y luego multiplicar?

**Análisis:**

```typescript
// Método indirecto (evitar)
const x = matrix.inverted.transformVector(b);

// Método directo (preferido)
const x = matrix.solve(b);
```

| Aspecto                  | `inverted` → `transformVector`    | `solve(b)`                 |
| ------------------------ | --------------------------------- | -------------------------- |
| **Allocaciones**         | 2 (matriz + vector)               | 1 (vector)                 |
| **Operaciones**          | 4 divisiones + 8 multiplicaciones | 1 división + 6 operaciones |
| **Estabilidad numérica** | ⚠️ Puede acumular error           | ✅ Usa Cramer directamente |
| **Legibilidad**          | ❌ Intención no clara             | ✅ Expresa intención       |

**Decisión:** `solve(b)` es **alta prioridad**. Operación fundamental de álgebra lineal.

### 13.5 ¿Por qué `slerp` para matrices de rotación?

**Pregunta:** `lerp` ya interpola matrices. ¿Es necesario `slerp`?

**Análisis:**

```typescript
// lerp: interpola componentes linealmente
// Problema: la matriz resultante NO es una rotación pura
const mid = Matrix2.lerp(rot0, rot45, 0.5);
// mid.determinant() ≈ 0.85 (no es 1!)

// slerp: interpola el ángulo de rotación
const mid = Matrix2.slerp(rot0, rot45, 0.5);
// mid.determinant() === 1 (rotación pura)
```

**Decisión:** Añadir `slerp` con **prioridad media**. Esencial para animaciones suaves de rotación.

### 13.6 ¿Por qué operaciones element-wise (`cwiseProduct`, `cwiseMin`)?

**Pregunta:** ¿No es confuso tener multiplicación matricial Y multiplicación element-wise?

**Análisis:**

| Operación            | Matemáticamente   | Uso práctico                    |
| -------------------- | ----------------- | ------------------------------- |
| `multiply(A, B)`     | A × B (matricial) | Composición de transformaciones |
| `cwiseProduct(A, B)` | A ⊙ B (Hadamard)  | Máscaras, filtros               |
| `cwiseMin(A, B)`     | min(Aᵢⱼ, Bᵢⱼ)     | Bounding, clamp                 |

**Patrones de naming (Eigen C++):**

- `cwise` prefix = component-wise / element-wise
- Evita ambigüedad con operaciones matriciales

**Decisión:** Adoptar prefijo `cwise` para claridad. Prioridad media.

### 13.7 ¿Por qué no TypedArray interno?

**Pregunta:** glMatrix usa Float32Array. ¿No deberíamos hacer lo mismo?

**Análisis:**

| Aspecto       | Propiedades individuales | Float32Array              |
| ------------- | ------------------------ | ------------------------- |
| **Acceso**    | `m.m00` (más legible)    | `m[0]` (menos claro)      |
| **Tipo**      | number (64-bit)          | float (32-bit)            |
| **Precisión** | ✅ IEEE 754 double       | ⚠️ Puede perder precisión |
| **WebGL**     | Necesita conversión      | ✅ Directo                |
| **Memory**    | 32 bytes (4×8)           | 16 bytes (4×4)            |

**Nuestra decisión:**

- Usar propiedades para claridad y precisión
- Proveer `toFloat32Array()` para WebGL
- Mantener precisión double para cálculos intermedios

**Decisión:** Mantener propiedades individuales. Priorizar precisión sobre memoria.

---

## 14. Resumen de Patrones de Librerías Externas

### 14.1 Patrones Adoptados

| Librería     | Patrón                                 | Aplicación en Matrix2               |
| ------------ | -------------------------------------- | ----------------------------------- |
| **glMatrix** | Funciones estáticas puras con `out?`   | ✅ Ya implementado                  |
| **glMatrix** | `frob()` para norma Frobenius          | ✅ `frobeniusNorm()` existe         |
| **glMatrix** | `multiplyScalarAndAdd`                 | ➕ Añadir como `fma`                |
| **Three.js** | Getters inmutables (`transposed`)      | ✅ Ya implementado                  |
| **Three.js** | Métodos `extract*` para descomposición | ➕ Añadir `extractRotation`         |
| **Three.js** | Chaining con `this`                    | ⚠️ Corregir (actualmente `Matrix2`) |
| **Eigen**    | Prefijo `cwise` para element-wise      | ➕ Adoptar convención               |
| **Eigen**    | `isApprox()` para comparación          | ✅ `nearEquals` existe              |
| **Box2D**    | `Solve(b)` para sistemas lineales      | ➕ **Alta prioridad**               |
| **Box2D**    | `GetSymInverse()` para simétricas      | ➕ Añadir `symmetricInverse`        |

### 14.2 Patrones NO Adoptados (con justificación)

| Librería     | Patrón                        | Razón para NO adoptar            |
| ------------ | ----------------------------- | -------------------------------- |
| **glMatrix** | Float32Array interno          | Priorizamos precisión 64-bit     |
| **glMatrix** | Matrices como arrays planos   | Preferimos propiedades nombradas |
| **NumPy**    | Broadcasting automático       | Complejidad innecesaria para 2×2 |
| **NumPy**    | Operadores sobrecargados      | TypeScript no soporta bien       |
| **BLAS**     | Nomenclatura `dgemm`, `daxpy` | Poco legible para JS             |

### 14.3 Priorización de Implementación

```
ALTA PRIORIDAD (Fase 1-2):
├── Correcciones arquitectónicas
│   ├── Eliminar out? de instancia
│   ├── Retornar this en instancia
│   └── Usar ReadonlyMatrix2Like
├── Álgebra lineal fundamental
│   ├── solve(b)
│   ├── solveSafe(b)
│   └── symmetricInverse
└── Validación básica
    ├── isZero
    ├── isFinite
    └── hasNaN

MEDIA PRIORIDAD (Fase 3-5):
├── Aritmética extendida
│   ├── addScalar, subtractScalar
│   ├── divideScalar
│   └── fma / addScaledMatrix
├── Transformaciones numéricas
│   ├── floor, ceil, round
│   ├── abs, sign
│   └── min, max, clamp
├── Conversiones
│   ├── fromComplex, toComplex
│   ├── toRotation
│   └── fromTransform
└── Interpolación
    ├── lerpClamped
    └── slerp

BAJA PRIORIDAD (Fase 6+):
├── Propiedades matriciales
│   ├── isSymmetric, isDiagonal
│   ├── isSkewSymmetric
│   └── eigenvalues (opcional)
├── Batch operations
│   └── transformVectors
├── Operaciones element-wise
│   ├── cwiseProduct
│   ├── cwiseQuotient
│   └── cwiseMin, cwiseMax
└── Constantes adicionales
    ├── ONE, NEGATIVE_ONE
    ├── EPSILON_MATRIX
    └── POSITIVE_INFINITY
```

---

## 15. Análisis DRY (Don't Repeat Yourself)

### 15.1 Patrones de Código Repetido Identificados

#### Patrón 1: Verificación de Determinante Singular

**Código repetido actual:**

```typescript
// En inverse() - estático
const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
if (isNearZero(det)) {
 throw new Error('Matrix2.inverse: matrix is singular');
}

// En inverse() - instancia
const det = this.determinant();
if (isNearZero(det)) {
 throw new Error('Matrix2.inverse: matrix is singular');
}
```

**Solución DRY:**

```typescript
/**
 * Validates that determinant is non-singular, throws if singular.
 * @private
 */
private static assertNonSingular(det: number, methodName: string): void {
  if (isNearZero(det)) {
    throw new Error(`Matrix2.${methodName}: matrix is singular`);
  }
}

// Uso:
public static inverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  Matrix2.assertNonSingular(det, 'inverse');
  // ...
}
```

#### Patrón 2: Cálculo de Determinante Inline

**Problema:** El determinante se calcula en múltiples lugares:

- `Matrix2.determinant()` (estático)
- `determinant()` (instancia)
- `inverse()` (estático e instancia)
- `decompose()`
- `inverted` getter

**Solución DRY:**

```typescript
// Ya existe Matrix2.determinant() estático - reutilizarlo
public static inverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = Matrix2.determinant(matrix); // Reutilizar
  Matrix2.assertNonSingular(det, 'inverse');
  // ...
}
```

#### Patrón 3: Patrón `out ? out.set(...) : this.set(...)`

**Código repetido (7+ veces):**

```typescript
return out ? out.set(r00, r01, r10, r11) : this.set(r00, r01, r10, r11);
```

**Solución DRY - Eliminar `out` de métodos de instancia:**

Según la convención de `Vector2`, los métodos de instancia NO deben tener `out`:

- Métodos estáticos: puros, `out?` para control de allocación
- Métodos de instancia: mutan `this`, retornan `this`

#### Patrón 4: Construcción de Matriz de Rotación

**Código repetido:**

```typescript
// En fromRotation
const { cos, sin } = sinCos(rotation);
return Matrix2.ensureOut(out).set(cos, sin, -sin, cos);

// En rotate
const { cos, sin } = sinCos(angle);
// ... cálculos de multiplicación
```

**Solución DRY:**

```typescript
/**
 * Creates rotation matrix components without allocation.
 * @private
 */
private static rotationComponents(angle: number): { cos: number; sin: number } {
  return sinCos(angle);
}
```

### 15.2 Oportunidades de Abstracción

#### Helper para Operaciones Element-wise

```typescript
/**
 * Applies a unary operation to all matrix components.
 * @private
 */
private static mapComponents(
  matrix: ReadonlyMatrix2Like,
  fn: (x: number) => number,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    fn(matrix.m00),
    fn(matrix.m01),
    fn(matrix.m10),
    fn(matrix.m11),
  );
}

// Uso simplificado:
public static floor(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.mapComponents(matrix, Math.floor, out);
}

public static ceil(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.mapComponents(matrix, Math.ceil, out);
}

public static abs(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.mapComponents(matrix, Math.abs, out);
}
```

#### Helper para Operaciones Binarias Element-wise

```typescript
/**
 * Applies a binary operation to corresponding components.
 * @private
 */
private static zipComponents(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  fn: (x: number, y: number) => number,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    fn(a.m00, b.m00),
    fn(a.m01, b.m01),
    fn(a.m10, b.m10),
    fn(a.m11, b.m11),
  );
}

// Uso simplificado:
public static add(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.zipComponents(a, b, (x, y) => x + y, out);
}

public static min(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.zipComponents(a, b, Math.min, out);
}
```

**⚠️ Trade-off:** Los helpers reducen repetición pero pueden afectar performance por las closures. Para hot paths, mantener código inline.

---

## 16. Análisis SOLID

### 16.1 Single Responsibility Principle (SRP)

**Estado actual:** ✅ Bien aplicado

`Matrix2` tiene una única responsabilidad: representar y operar con matrices 2×2.
No mezcla:

- Serialización a formatos específicos (eso sería otro módulo)
- Rendering/visualización
- Persistencia

**Mejora sugerida:**

Las operaciones de conversión (`toArray`, `toFloat32Array`, `toJSON`) podrían extraerse a un módulo `matrix2-serialization.ts`, pero el beneficio es mínimo y aumentaría la complejidad de imports.

### 16.2 Open/Closed Principle (OCP)

**Estado actual:** ⚠️ Parcialmente aplicado

**Problemas:**

1. Los métodos de instancia retornan `Matrix2` en lugar de `this`, dificultando extensión:

```typescript
// Actual
multiply(other: ReadonlyMatrix2, out?: Matrix2): Matrix2

// Correcto para OCP
multiply(other: ReadonlyMatrix2Like): this
```

2. El constructor no acepta interfaces, solo valores primitivos:

```typescript
// Actual
constructor(m00 = 1, m01 = 0, m10 = 0, m11 = 1)

// Mejor para OCP
constructor();
constructor(m00: number, m01: number, m10: number, m11: number);
constructor(source: ReadonlyMatrix2Like);
```

**Correcciones OCP:**

```typescript
// Retorno `this` permite extensión
class SpecialMatrix2 extends Matrix2 {
 public specialMethod(): this {
  // ... operación especial
  return this.multiply(Matrix2.ROTATE_90); // ✅ Retorna SpecialMatrix2
 }
}
```

### 16.3 Liskov Substitution Principle (LSP)

**Estado actual:** ✅ Bien aplicado

- `ReadonlyMatrix2` es subtipo de `Matrix2` (vía `Readonly<Matrix2>`)
- Los métodos aceptan `ReadonlyMatrix2Like` permitiendo duck typing
- No hay violaciones de contrato en subtipos

### 16.4 Interface Segregation Principle (ISP)

**Estado actual:** ✅ Bien aplicado

Las interfaces están bien segregadas:

- `Matrix2Like` - interfaz mutable mínima
- `ReadonlyMatrix2Like` - interfaz de solo lectura

**Mejora potencial:**

```typescript
// Interfaces adicionales para casos específicos
interface RotationMatrix2Like extends ReadonlyMatrix2Like {
 // Marca semántica para matrices que representan rotaciones puras
}

interface ScaleMatrix2Like extends ReadonlyMatrix2Like {
 // Marca semántica para matrices diagonales de escala
}
```

Pero esto añadiría complejidad sin beneficio claro para un paquete base.

### 16.5 Dependency Inversion Principle (DIP)

**Estado actual:** ⚠️ Mejorable

**Problema:** `Matrix2` importa directamente `Vector2` (clase concreta):

```typescript
import { Vector2, type ReadonlyVector2 } from './vector2';
```

**Mejora DIP:**

```typescript
// Usar solo interfaces donde sea posible
import type { ReadonlyVector2Like, Vector2Like } from '../types';

// En los métodos, usar la interfaz
public static transformVector(
  matrix: ReadonlyMatrix2Like,
  vector: ReadonlyVector2Like, // ✅ Interfaz
  out?: Vector2Like,          // ✅ Interfaz
): Vector2Like {
  // ...
}
```

**Trade-off:** Esto complica la implementación porque necesitamos crear una instancia concreta para el retorno. La solución actual es pragmática.

---

## 17. Análisis Clean Code

### 17.1 Naming Conventions

#### Métodos con Nombres Claros

| Actual        | Sugerido            | Razón                                |
| ------------- | ------------------- | ------------------------------------ |
| `sanitize`    | `sanitizeComponent` | Consistencia con Vector2             |
| `getRotation` | `extractRotation`   | Más preciso (no es un simple getter) |
| `getScale`    | `extractScale`      | Consistencia                         |
| `scaleBy`     | `applyScale`        | Más claro sobre la operación         |

#### Parámetros con Nombres Descriptivos

```typescript
// Actual
lerp(other: ReadonlyMatrix2, t: number, out?: Matrix2): Matrix2

// Más descriptivo
lerp(target: ReadonlyMatrix2Like, factor: number): this
```

### 17.2 Comentarios y Documentación

**Estado actual:** ✅ Excelente documentación JSDoc

**Mejoras menores:**

````typescript
/**
 * Multiplies two matrices (a × b).
 *
 * @remarks
 * Matrix multiplication is NOT commutative: A × B ≠ B × A
 *
 * The result represents applying transformation B first, then A:
 * - A × B transforms a vector as: A(B(v))
 *
 * @example
 * ```typescript
 * // Rotate then scale
 * const rotThenScale = Matrix2.multiply(scale, rotation);
 *
 * // Scale then rotate
 * const scaleThenRot = Matrix2.multiply(rotation, scale);
 * ```
 */
````

### 17.3 Guard Clauses

**Patrón actual:** Usa guard clauses correctamente

```typescript
if (offset < 0 || offset + 4 > array.length) {
  throw new RangeError(...);
}
```

**Mejora para métodos con múltiples condiciones:**

```typescript
// Usar early returns con mensajes claros
public static solve(
  matrix: ReadonlyMatrix2Like,
  b: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const det = Matrix2.determinant(matrix);

  // Guard clause
  if (isNearZero(det)) {
    throw new Error(
      'Matrix2.solve: cannot solve system - matrix is singular (determinant ≈ 0)',
    );
  }

  // Happy path
  const invDet = 1 / det;
  return Vector2.fromValues(
    invDet * (matrix.m11 * b.x - matrix.m10 * b.y),
    invDet * (matrix.m00 * b.y - matrix.m01 * b.x),
    out,
  );
}
```

### 17.4 Evitar Magic Numbers

**Estado actual:** ✅ Usa constantes apropiadamente

```typescript
static readonly EPSILON = ...; // Importado de constants
```

**Mejora adicional:**

```typescript
/** Number of components in a 2×2 matrix */
private static readonly COMPONENT_COUNT = 4;

/** Number of rows/columns in this matrix type */
private static readonly SIZE = 2;
```

---

## 18. Estrategia de Interoperabilidad

### 18.1 Conversión Entre Tipos math2d

```
                    ┌─────────────┐
                    │   Matrix2   │
                    └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   Rotation2   │  │    Complex    │  │   Transform2  │
└───────────────┘  └───────────────┘  └───────────────┘
        │                  │                  │
        └──────────────────┴──────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Matrix3   │
                    └─────────────┘
```

### 18.2 Métodos de Interoperabilidad Requeridos

#### Matrix2 → Otros Tipos

| Destino         | Método          | Descripción                          |
| --------------- | --------------- | ------------------------------------ |
| Rotation2       | `toRotation()`  | Extrae rotación como (cos, sin)      |
| Complex         | `toComplex()`   | Extrae rotación como número complejo |
| Matrix3         | `toMatrix3()`   | Embebe en esquina superior-izquierda |
| number (angle)  | `getRotation()` | ✅ Ya existe                         |
| Vector2 (scale) | `getScale()`    | ✅ Ya existe                         |

#### Otros Tipos → Matrix2

| Origen     | Método            | Descripción              |
| ---------- | ----------------- | ------------------------ |
| Rotation2  | `fromRotation()`  | ✅ Ya existe             |
| Complex    | `fromComplex()`   | Crear matriz de rotación |
| Transform2 | `fromTransform()` | Extraer rotación+escala  |
| angle      | `fromRotation()`  | ✅ Ya existe             |
| scale      | `fromScale()`     | ✅ Ya existe             |

### 18.3 Implementación de Conversiones

```typescript
// ============ Conversiones a Rotation2 ============

/**
 * Extracts the rotation component as a Rotation2.
 *
 * @remarks
 * For matrices with non-uniform scale, this extracts the rotation
 * that would be applied first in an R×S decomposition.
 *
 * @category Conversion
 */
public toRotation(): Rotation2 {
  const scale = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  if (isNearZero(scale)) {
    return Rotation2.IDENTITY.clone();
  }
  return new Rotation2(this.m00 / scale, this.m01 / scale);
}

// ============ Conversiones a/desde Complex ============

/**
 * Creates a rotation matrix from a complex number.
 * The complex number is normalized to unit length.
 *
 * @param complex - Complex number representing rotation
 * @param out - Optional output matrix
 * @returns Rotation matrix
 *
 * @remarks
 * A unit complex number e^(iθ) = cos(θ) + i*sin(θ) directly
 * corresponds to a 2D rotation matrix.
 *
 * @category Factory
 */
public static fromComplex(complex: ReadonlyComplexLike, out?: Matrix2): Matrix2 {
  const mag = safeSqrt(complex.real * complex.real + complex.imag * complex.imag);
  if (isNearZero(mag)) {
    return Matrix2.ensureOut(out).identity();
  }
  const cos = complex.real / mag;
  const sin = complex.imag / mag;
  return Matrix2.ensureOut(out).set(cos, sin, -sin, cos);
}

/**
 * Extracts the rotation as a unit complex number.
 *
 * @category Conversion
 */
public toComplex(): Complex {
  const scale = safeSqrt(this.m00 * this.m00 + this.m01 * this.m01);
  if (isNearZero(scale)) {
    return new Complex(1, 0);
  }
  return new Complex(this.m00 / scale, this.m01 / scale);
}

// ============ Conversiones a/desde Transform2 ============

/**
 * Creates a Matrix2 from a Transform2 (rotation × scale, no translation).
 *
 * @param transform - Transform to extract from
 * @param out - Optional output matrix
 * @returns Matrix2 representing rotation and scale
 *
 * @category Factory
 */
public static fromTransform(transform: ReadonlyTransform2Like, out?: Matrix2): Matrix2 {
  const { cos, sin } = sinCos(transform.rotation);
  const sx = transform.scale.x;
  const sy = transform.scale.y;
  return Matrix2.ensureOut(out).set(
    cos * sx,
    sin * sx,
    -sin * sy,
    cos * sy,
  );
}

/**
 * Embeds this Matrix2 into a Matrix3 (upper-left 2×2).
 *
 * @category Conversion
 */
public toMatrix3(): Matrix3 {
  return Matrix3.fromMatrix2(this);
}
```

---

## 19. Checklist de Calidad Final

### 19.1 Consistencia API

- [ ] Todos los métodos de instancia retornan `this`
- [ ] Todos los métodos de instancia aceptan `ReadonlyXLike` interfaces
- [ ] Ningún método de instancia tiene parámetro `out`
- [ ] Todos los métodos estáticos tienen parámetro `out?` opcional
- [ ] Naming consistente: `sanitizeComponent`, no `sanitize`

### 19.2 Completitud Funcional

- [ ] Aritmética: `addScalar`, `subtractScalar`, `divideScalar`, `fma`
- [ ] Validación: `isZero`, `nearZero`, `isFinite`, `hasNaN`, `isSymmetric`
- [ ] Transformaciones: `floor`, `ceil`, `round`, `abs`, `sign`, `min`, `max`
- [ ] Álgebra lineal: `solve`, `solveSafe`, `symmetricInverse`
- [ ] Interpolación: `lerpClamped`, `slerp`
- [ ] Conversiones: `toRotation`, `toComplex`, `fromComplex`, `fromTransform`
- [ ] Batch: `transformVectors`
- [ ] Iteración: `[Symbol.iterator]`

### 19.3 Tests

- [ ] Unit tests para todos los métodos nuevos
- [ ] Edge cases: matrices singulares, NaN, Infinity
- [ ] Property-based tests: identidades matemáticas
- [ ] Consistency tests: estático vs instancia
- [ ] Interoperabilidad: conversiones bidireccionales

### 19.4 Documentación

- [ ] JSDoc completo para cada método público
- [ ] Ejemplos de código en JSDoc
- [ ] Categorías `@category` asignadas
- [ ] Remarks con advertencias importantes
- [ ] Referencias cruzadas con `@see`

### 19.5 Performance

- [ ] No hay allocaciones innecesarias en hot paths
- [ ] Helpers DRY no afectan métodos críticos
- [ ] Benchmarks de regresión para operaciones clave

---

## 20. Resumen Ejecutivo de Cambios

### 20.1 Cambios Críticos (Breaking Changes)

| Cambio                                  | Impacto   | Migración                                         |
| --------------------------------------- | --------- | ------------------------------------------------- |
| Eliminar `out?` de métodos de instancia | **Alto**  | Usar métodos estáticos para control de allocación |
| Retorno `this` en lugar de `Matrix2`    | **Medio** | Subclases heredan correctamente                   |
| `ReadonlyMatrix2Like` en parámetros     | **Bajo**  | Compatible hacia atrás                            |

### 20.2 Métricas de Éxito

| Métrica                  | Antes | Después (objetivo) |
| ------------------------ | ----- | ------------------ |
| Líneas de código         | ~1143 | ~2000-2200         |
| Métodos estáticos        | ~16   | ~45                |
| Métodos de instancia     | ~35   | ~55                |
| Cobertura de tests       | ~85%  | 95%+               |
| Consistencia con Vector2 | 60%   | 95%+               |

### 20.3 Próximos Pasos Inmediatos

```
1. [ ] APROBACIÓN: Revisar y aprobar este documento
2. [ ] FASE 1: Correcciones arquitectónicas
   - [ ] Eliminar out? de métodos de instancia
   - [ ] Cambiar retorno a `this`
   - [ ] Cambiar tipos a interfaces
3. [ ] FASE 2: Álgebra lineal fundamental
   - [ ] Implementar solve(b) y solveSafe(b)
   - [ ] Implementar symmetricInverse
   - [ ] Implementar multiplyTranspose, transposeMultiply
4. [ ] TESTS: Escribir tests para cada método nuevo
5. [ ] DOCS: Actualizar README de math2d
```

### 20.4 Riesgos y Mitigaciones

| Riesgo                                    | Probabilidad | Impacto | Mitigación                              |
| ----------------------------------------- | ------------ | ------- | --------------------------------------- |
| Breaking changes afectan código existente | Media        | Alto    | Versionado semántico, guía de migración |
| Performance regression                    | Baja         | Medio   | Benchmarks antes/después                |
| Complejidad excesiva                      | Baja         | Bajo    | Revisión de código, KISS                |

---

## 21. Aprobación

### 21.1 Checklist Pre-Implementación

- [ ] Documento revisado técnicamente
- [ ] Breaking changes aprobados por stakeholders
- [ ] Plan de migración claro y documentado
- [ ] Especificación de tests completa
- [ ] Benchmarks de baseline capturados

### 21.2 Firmas de Aprobación

| Rol             | Nombre | Fecha      | Firma |
| --------------- | ------ | ---------- | ----- |
| Autor           | -      | 2025-12-03 | ✅    |
| Revisor técnico | -      | -          | ⏳    |
| Aprobador       | -      | -          | ⏳    |

---

## 22. Análisis Exhaustivo de Sinergias entre Módulos

### 22.1 Inventario Completo de Módulos math2d

```
packages/math2d/src/
├── core/
│   ├── vector2.ts      ← Referencia principal
│   ├── matrix2.ts      ← Objetivo del refactor
│   ├── matrix3.ts
│   ├── rotation2.ts
│   ├── complex.ts
│   ├── transform2.ts
│   └── interval.ts
├── auxiliary/
│   ├── angle/
│   │   ├── conversion.ts
│   │   ├── normalization.ts
│   │   ├── operations.ts      ← sinCos, angleDifference
│   │   ├── interpolation.ts   ← lerpAngle, slerpAngle
│   │   └── unwrapping.ts
│   ├── numeric/
│   │   ├── safety.ts          ← safeDivide, safeSqrt
│   │   ├── guards.ts
│   │   ├── rounding.ts        ← roundToPlaces, snapToGrid
│   │   └── wrapping.ts
│   └── scalar/
│       ├── arithmetic.ts      ← clamp, sign, abs, min, max
│       ├── comparison.ts      ← nearEquals, isNearZero
│       ├── constants.ts       ← EPSILON, TAU
│       └── interpolation.ts   ← lerp, smoothStep, bezierInterp
├── deterministic/
│   ├── deterministic-math.ts  ← atan2, sin, cos, sqrt
│   ├── precision-math.ts
│   └── rounding-control.ts
├── validation/
│   └── assert.ts              ← assertFinite, assertSafeInteger
├── utils/
│   ├── parse.ts
│   ├── performance.ts
│   ├── random.ts
│   └── random-source.ts
└── types/
    └── index.ts               ← Interfaces Like
```

### 22.2 Uso Actual de Matrix2 vs Uso de Vector2

| Módulo Auxiliar          | Vector2 Usa                          | Matrix2 Usa                            | Acción para Matrix2                             |
| ------------------------ | ------------------------------------ | -------------------------------------- | ----------------------------------------------- |
| **angle/operations**     | `sinCos`                             | ✅ `sinCos`                            | -                                               |
| **angle/normalization**  | ❌                                   | ❌                                     | Considerar para `slerp`                         |
| **angle/interpolation**  | ❌                                   | ❌                                     | Usar `lerpAngle` para `slerp`                   |
| **numeric/safety**       | `safeDivide`, `safeSqrt`, `safeAcos` | ✅ `safeDivide`, `safeSqrt`            | Añadir `safeAcos` si hay eigenvalores           |
| **numeric/rounding**     | ❌                                   | ❌                                     | `roundToPlaces` para `toString`?                |
| **numeric/wrapping**     | ❌                                   | ❌                                     | No aplica                                       |
| **scalar/arithmetic**    | ✅ Todos                             | ⚠️ Solo `saturate`                     | **Añadir `clamp`, `sign`, `abs`, `min`, `max`** |
| **scalar/comparison**    | ✅ `nearEquals`, `isNearZero`        | ✅ Usa                                 | -                                               |
| **scalar/constants**     | ✅ `EPSILON`                         | ✅ `EPSILON`                           | -                                               |
| **scalar/interpolation** | ✅ `lerp`                            | ✅ `lerp`                              | **Añadir `smoothStep`, `lerpClamped`**          |
| **deterministic**        | ✅ `atan2`                           | ✅ `atan2`                             | -                                               |
| **validation/assert**    | ✅ `assertFinite`                    | ✅ `assertFinite`, `assertSafeInteger` | -                                               |

### 22.3 Módulos NO Utilizados por Matrix2

#### 22.3.1 `auxiliary/angle/interpolation.ts`

**Funciones disponibles:**

- `lerpAngle(from, to, t)` - Interpolación angular por camino corto
- `slerpAngle(from, to, t)` - Slerp para ángulos
- `smoothStepAngle(from, to, t)` - Interpolación suave angular
- `springAngle(...)` - Interpolación con física de resorte

**Oportunidad para Matrix2:**

```typescript
/**
 * Spherical linear interpolation for rotation matrices.
 * Uses lerpAngle internally for proper angular interpolation.
 *
 * @remarks
 * Delegates angle interpolation to auxiliary/angle/interpolation.lerpAngle
 * to avoid duplicating angular math logic.
 */
public static slerp(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
): Matrix2 {
  // Usar lerpAngle de auxiliary/angle/interpolation
  const angleA = DeterministicMath.atan2(a.m01, a.m00);
  const angleB = DeterministicMath.atan2(b.m01, b.m00);
  const interpolatedAngle = lerpAngle(angleA, angleB, t); // ← DRY
  return Matrix2.fromRotation(interpolatedAngle, out);
}
```

#### 22.3.2 `auxiliary/scalar/interpolation.ts`

**Funciones disponibles NO usadas:**

- `smoothStep(edge0, edge1, x)` - Interpolación cúbica suave
- `smootherStep(edge0, edge1, x)` - Interpolación quintica
- `inverseLerp(a, b, value)` - Lerp inverso
- `bezierInterp(t, p0, p1, p2, p3)` - Curvas Bezier
- `springInterp(...)` - Física de resorte

**Oportunidades para Matrix2:**

```typescript
/**
 * Smooth step interpolation between matrices.
 * Uses scalar/interpolation.smoothStep internally.
 */
public static smoothStep(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
): Matrix2 {
  const smoothT = smoothStep(0, 1, saturate(t)); // ← DRY
  return Matrix2.lerp(a, b, smoothT, out);
}
```

#### 22.3.3 `auxiliary/numeric/rounding.ts`

**Funciones disponibles:**

- `roundToPlaces(value, places)` - Redondeo a decimales
- `roundToMultiple(value, multiple)` - Redondeo a múltiplos
- `snapToGrid(value, gridSize, offset)` - Snap a grilla
- `quantize(value, levels, min, max)` - Cuantización

**Oportunidades para Matrix2:**

```typescript
/**
 * Rounds all components to specified decimal places.
 * Useful for display and serialization.
 *
 * @remarks
 * Delegates to auxiliary/numeric/rounding.roundToPlaces for each component.
 */
public static roundToPlaces(
  matrix: ReadonlyMatrix2Like,
  places: number,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    roundToPlaces(matrix.m00, places),
    roundToPlaces(matrix.m01, places),
    roundToPlaces(matrix.m10, places),
    roundToPlaces(matrix.m11, places),
  );
}

/**
 * Snaps components to a grid.
 * Useful for editor tools and discrete transformations.
 */
public static snapToGrid(
  matrix: ReadonlyMatrix2Like,
  gridSize: number,
  out?: Matrix2,
): Matrix2 {
  return Matrix2.ensureOut(out).set(
    snapToGrid(matrix.m00, gridSize),
    snapToGrid(matrix.m01, gridSize),
    snapToGrid(matrix.m10, gridSize),
    snapToGrid(matrix.m11, gridSize),
  );
}
```

### 22.4 Sinergias con Módulos Core

#### 22.4.1 Matrix2 ↔ Interval

**Estado actual:** Sin interacción directa.

**Oportunidad:**

````typescript
/**
 * Computes the bounding interval for a transformed 1D range.
 * Useful for axis-aligned bounding calculations.
 *
 * @example
 * ```typescript
 * const m = Matrix2.fromScale(2, 3);
 * const range = new Interval(-1, 1);
 * const bounds = m.transformInterval(range, 0); // x-axis bounds
 * ```
 */
public transformInterval(
  interval: ReadonlyIntervalLike,
  axis: 0 | 1,
  out?: Interval,
): Interval {
  // Transforma los extremos del intervalo
  const v1 = this.transformVector(
    axis === 0 ? { x: interval.min, y: 0 } : { x: 0, y: interval.min },
  );
  const v2 = this.transformVector(
    axis === 0 ? { x: interval.max, y: 0 } : { x: 0, y: interval.max },
  );

  const component = axis === 0 ? 'x' : 'y';
  return Interval.hull([v1[component], v2[component]], out);
}
````

#### 22.4.2 Matrix2 ↔ Complex

**Estado actual:**

- `Complex.toRotationMatrix()` → `Matrix2Like` ✅
- `Matrix2.fromComplex()` ❌
- `Matrix2.toComplex()` ❌

**Relación matemática:**
Un número complejo unitario \( e^{i\theta} = \cos\theta + i\sin\theta \) corresponde directamente a una matriz de rotación 2D.

```typescript
// Bidireccional
Matrix2.fromComplex(complex: ReadonlyComplexLike, out?): Matrix2
matrix.toComplex(out?: Complex): Complex
```

#### 22.4.3 Matrix2 ↔ Rotation2

**Estado actual:**

- `Matrix2.fromRotation(rotation: ReadonlyRotation2)` ✅
- `matrix.toRotation()` ❌
- `Rotation2.fromMatrix()` ❌

**Relación matemática:**
`Rotation2` almacena \((\cos\theta, \sin\theta)\), que son exactamente `m00` y `m01` de una matriz de rotación pura.

```typescript
// Bidireccional
matrix.toRotation(out?: Rotation2): Rotation2
Matrix2.extractRotation(matrix, out?): Rotation2
```

#### 22.4.4 Matrix2 ↔ Transform2

**Estado actual:** Sin interacción directa.

**Relación matemática:**
`Transform2` = posición + rotación + escala. La parte rotación+escala es exactamente una `Matrix2`.

```typescript
// Extracción
Matrix2.fromTransform(transform: ReadonlyTransform2Like, out?): Matrix2

// Ya existe en Transform2:
// transform.toMatrix() → Matrix3 (no Matrix2)
```

### 22.5 Dependencias que Faltan Importar

**Imports actuales de Matrix2:**

```typescript
import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import { assertFinite, assertSafeInteger } from '../validation/assert';
```

**Imports a añadir:**

```typescript
// De auxiliary/scalar/arithmetic (para operaciones element-wise)
import {
 abs as scalarAbs,
 clamp,
 max as scalarMax,
 min as scalarMin,
 sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';

// De auxiliary/scalar/interpolation (para smoothStep)
import { smoothStep } from '../auxiliary/scalar/interpolation';

// De auxiliary/angle/interpolation (para slerp)
import { lerpAngle } from '../auxiliary/angle/interpolation';

// De auxiliary/numeric/rounding (para roundToPlaces, opcional)
import { roundToPlaces, snapToGrid } from '../auxiliary/numeric/rounding';
```

### 22.6 Principio DRY entre Módulos

#### Delegación de Lógica Compartida

| Operación                  | Módulo Autorizado      | Consumidores                   |
| -------------------------- | ---------------------- | ------------------------------ |
| Interpolación angular      | `angle/interpolation`  | Matrix2.slerp, Rotation2.slerp |
| Interpolación suave        | `scalar/interpolation` | Todos los smoothStep           |
| Comparación con epsilon    | `scalar/comparison`    | Todos los módulos core         |
| División segura            | `numeric/safety`       | Todos los módulos core         |
| Clamp escalar              | `scalar/arithmetic`    | Vector2, Matrix2, etc.         |
| Trigonometría determinista | `deterministic-math`   | Todos los módulos core         |

**Principio:** Un módulo core NUNCA debe reimplementar lógica que existe en auxiliary.

### 22.7 Matriz de Interoperabilidad Completa

```
            │ Vector2 │ Matrix2 │ Matrix3 │ Rotation2 │ Complex │ Transform2 │ Interval │
────────────┼─────────┼─────────┼─────────┼───────────┼─────────┼────────────┼──────────┤
Vector2     │    -    │  ✅/⚠️  │   ✅    │    ✅     │   ✅    │     ✅     │    ❌    │
Matrix2     │   ✅    │    -    │   ✅    │   ✅/❌   │  ❌/❌  │    ❌/❌   │    ❌    │
Matrix3     │   ✅    │   ✅    │    -    │    ✅     │   ❌    │     ✅     │    ❌    │
Rotation2   │   ✅    │   ✅    │   ❌    │     -     │   ✅    │     ❌     │    ❌    │
Complex     │   ✅    │  ✅/❌  │   ❌    │    ✅     │    -    │     ❌     │    ❌    │
Transform2  │   ✅    │   ❌    │   ✅    │    ❌     │   ❌    │      -     │    ❌    │
Interval    │   ❌    │   ❌    │   ❌    │    ❌     │   ❌    │     ❌     │     -    │

Leyenda:
✅ = Interacción existente
❌ = Sin interacción
⚠️ = Interacción parcial
✅/❌ = to/from (primero to, luego from)
```

### 22.8 Priorización de Sinergias para Matrix2

| Prioridad   | Sinergia                                              | Beneficio         | Esfuerzo |
| ----------- | ----------------------------------------------------- | ----------------- | -------- |
| 🔴 Alta     | Usar `scalar/arithmetic` (clamp, min, max, abs, sign) | DRY, consistencia | Bajo     |
| 🔴 Alta     | `Matrix2 ↔ Rotation2` bidireccional                  | Completitud API   | Medio    |
| 🟠 Media    | Usar `angle/interpolation.lerpAngle` para slerp       | DRY               | Bajo     |
| 🟠 Media    | Usar `scalar/interpolation.smoothStep`                | DRY               | Bajo     |
| 🟠 Media    | `Matrix2 ↔ Complex` bidireccional                    | Completitud API   | Medio    |
| 🟡 Baja     | `Matrix2 ↔ Transform2`                               | Conveniencia      | Bajo     |
| 🟡 Baja     | `Matrix2 ↔ Interval`                                 | Casos especiales  | Medio    |
| 🟢 Opcional | `numeric/rounding` para display                       | Nice to have      | Bajo     |

---

## 23. Resumen de Acciones por Módulo Auxiliar

### 23.1 Acciones Inmediatas (Fase 1)

```typescript
// Añadir a imports de matrix2.ts
import {
 abs as scalarAbs,
 clamp,
 max as scalarMax,
 min as scalarMin,
 sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';
```

### 23.2 Acciones de Fase 2-3

```typescript
// Para smoothStep
import { smoothStep } from '../auxiliary/scalar/interpolation';

// Para slerp de matrices de rotación
import { lerpAngle } from '../auxiliary/angle/interpolation';
```

### 23.3 Métodos a Implementar por Sinergia

| Sinergia               | Métodos a Añadir en Matrix2                                                   |
| ---------------------- | ----------------------------------------------------------------------------- |
| `scalar/arithmetic`    | `floor`, `ceil`, `round`, `abs`, `sign`, `min`, `max`, `clamp`, `clampScalar` |
| `scalar/interpolation` | `smoothStep`, `lerpClamped`                                                   |
| `angle/interpolation`  | `slerp` (delegando a `lerpAngle`)                                             |
| `Rotation2`            | `toRotation()`, `static extractRotation()`                                    |
| `Complex`              | `toComplex()`, `static fromComplex()`                                         |
| `Transform2`           | `static fromTransform()`                                                      |

---

## 24. Análisis Exhaustivo: utils/

### 24.1 Inventario de Módulos utils

```
packages/math2d/src/utils/
├── random.ts         ← Generación aleatoria de objetos matemáticos
├── random-source.ts  ← Abstracción de fuentes de aleatoriedad (SeededRandomSource, MathRandomSource)
├── parse.ts          ← Parsing y serialización de tipos matemáticos
└── performance.ts    ← Medición de rendimiento (measure, MeasurementCollector)
```

### 24.2 utils/random.ts - Sinergias con Matrix2

**Estado actual:** ✅ Ya tiene `randomRotationMatrix2()`

```typescript
// Función existente:
randomRotationMatrix2(out?: Matrix2, source?: RandomSource): Matrix2
```

**Patrón de uso de DeterministicMath (referencia):**

```typescript
// randomUnitVector2 usa DeterministicMath.sin/cos
// randomInUnitCircle usa DeterministicMath.sqrtSafe
// randomGaussianVector2 usa DeterministicMath.sqrtSafe + sin/cos
```

**Oportunidades de mejora (nuevas funciones):**

| Función                                           | Descripción                                   | Prioridad |
| ------------------------------------------------- | --------------------------------------------- | --------- |
| `randomMatrix2(min, max, out?, source?)`          | Matriz con elementos aleatorios en [min, max) | 🟡 Baja   |
| `randomSymmetricMatrix2(min, max, out?, source?)` | Matriz simétrica aleatoria (m01 = m10)        | 🟡 Baja   |
| `randomInvertibleMatrix2(out?, source?)`          | Matriz invertible (rotación + escala no-cero) | 🟡 Baja   |

### 24.3 utils/parse.ts - Sinergias con Matrix2

**Estado actual:** ✅ Ya tiene `parseMatrix2()` y `formatMatrix2()`

```typescript
// Funciones existentes:
parseMatrix2(str: string, out?: Matrix2): Matrix2
formatMatrix2(m: ReadonlyMatrix2, format?: 'flat' | 'nested' | 'json', precision?: number): string
```

**Formatos soportados:**

| Formato  | Ejemplo                 | parseMatrix2 | formatMatrix2 |
| -------- | ----------------------- | ------------ | ------------- |
| CSV/Flat | `1,0,0,1`               | ✅           | ✅ `'flat'`   |
| Space    | `1 0 0 1`               | ✅           | ❌            |
| Nested   | `[[1,0],[0,1]]`         | ✅           | ✅ `'nested'` |
| JSON     | `{"m00":1,"m01":0,...}` | ✅           | ✅ `'json'`   |

### 24.4 utils/performance.ts - Uso para Matrix2

**Estado actual:** Módulo genérico, no específico de Matrix2

```typescript
// Disponible para cualquier operación:
measure<T>(label: string, fn: () => T): Measurement<T>
measureAsync<T>(label: string, fn: () => Promise<T>): Promise<Measurement<T>>
MeasurementCollector<T>
summarizeMeasurements(collector): Map<string, MeasurementSummary>
formatSummary(summary): string
```

**Uso recomendado para benchmarking de Matrix2:**

```typescript
import { measure, MeasurementCollector } from '../utils/performance';

const collector = new MeasurementCollector<Matrix2>();
for (let i = 0; i < 10000; i++) {
 collector.record(measure('multiply', () => Matrix2.multiply(a, b)));
 collector.record(measure('inverse', () => Matrix2.inverse(a)));
}
console.log(collector.formatSummaries());
```

### 24.5 utils/random-source.ts - Uso para Tests Deterministas

**Interfaces disponibles:**

```typescript
interface RandomSource {
  next(): number;          // [0, 1)
  nextInt(max: number): number;
  seed?(seed: number): void;
}

class MathRandomSource implements RandomSource  // No determinista (Math.random)
class SeededRandomSource implements RandomSource // Determinista (LCG Park-Miller)
```

**Uso para tests reproducibles:**

```typescript
// Test determinista
const source = new SeededRandomSource(12345);
const m1 = randomRotationMatrix2(new Matrix2(), source);

// Mismo seed = mismo resultado
const source2 = new SeededRandomSource(12345);
const m2 = randomRotationMatrix2(new Matrix2(), source2);
expect(m1.equals(m2)).toBe(true);
```

### 24.6 Matriz de Sinergias: utils ↔ Matrix2

| Módulo utils         | Matrix2 Usa                        | Acción                                  |
| -------------------- | ---------------------------------- | --------------------------------------- |
| **random.ts**        | ✅ `randomRotationMatrix2`         | Considerar añadir funciones adicionales |
| **parse.ts**         | ✅ `parseMatrix2`, `formatMatrix2` | Completo ✅                             |
| **performance.ts**   | ❌ No directamente                 | Documentar uso para benchmarking        |
| **random-source.ts** | ✅ Indirectamente via random.ts    | -                                       |

---

## 25. Análisis Exhaustivo: validation/assert

### 25.1 Inventario Completo de Funciones Disponibles

```typescript
// packages/math2d/src/validation/assert.ts

// Control global de assertions
setAssertionsEnabled(enabled: boolean): void
areAssertionsEnabled(): boolean

// Validaciones de valores escalares
assertFinite(value: number, name?: string): void
assertNonZero(value: number, name?: string): void
assertRange(value: number, min: number, max: number, name?: string): void
assertPositive(value: number, name?: string): void
assertNonNegative(value: number, name?: string): void
assertSafeInteger(value: number, name?: string): void
assert(condition: boolean, message?: string): void

// Validaciones de tipos compuestos
assertVector2(x: number, y: number, name?: string): void
assertMatrix2(m00: number, m01: number, m10: number, m11: number, name?: string): void  // ← ¡YA EXISTE!
assertRotation2(cos: number, sin: number, name?: string): void
```

### 25.2 Uso Actual en Matrix2

| Función             | Uso en Matrix2        | Uso en Vector2    | Sinergia   |
| ------------------- | --------------------- | ----------------- | ---------- |
| `assertFinite`      | ✅ En factory métodos | ✅ Extensivo      | -          |
| `assertSafeInteger` | ✅ Para índices       | ✅ Para índices   | -          |
| `assertMatrix2`     | ❌ **NO USADO**       | N/A               | **Añadir** |
| `assertNonZero`     | ❌ NO USADO           | ✅ Para divisores | **Añadir** |
| `assertPositive`    | ❌ NO USADO           | ❌                | Considerar |
| `assertRange`       | ❌ NO USADO           | ❌                | Considerar |

### 25.3 Oportunidades de Mejora para Matrix2

#### Uso de `assertMatrix2` (ya existe pero no se usa)

**Estado actual del validador:**

```typescript
// validation/assert.ts líneas 260-281
export function assertMatrix2(
 m00: number,
 m01: number,
 m10: number,
 m11: number,
 name?: string,
): void {
 if (!assertionsEnabled) return;
 const prefix = name ?? 'matrix';
 if (!Number.isFinite(m00)) throw new Error(`[math2d] ${prefix}[0,0] must be finite, got ${m00}`);
 if (!Number.isFinite(m01)) throw new Error(`[math2d] ${prefix}[0,1] must be finite, got ${m01}`);
 if (!Number.isFinite(m10)) throw new Error(`[math2d] ${prefix}[1,0] must be finite, got ${m10}`);
 if (!Number.isFinite(m11)) throw new Error(`[math2d] ${prefix}[1,1] must be finite, got ${m11}`);
}
```

**Recomendación:** Usar en factories y métodos que reciben parámetros numéricos:

```typescript
// En Matrix2.fromValues
public static fromValues(m00: number, m01: number, m10: number, m11: number): Matrix2 {
  assertMatrix2(m00, m01, m10, m11, 'Matrix2.fromValues');
  return new Matrix2(m00, m01, m10, m11);
}

// En constructor (opcionalmente)
constructor(m00 = 0, m01 = 0, m10 = 0, m11 = 0) {
  assertMatrix2(m00, m01, m10, m11, 'Matrix2.constructor');
  this.m00 = m00;
  this.m01 = m01;
  this.m10 = m10;
  this.m11 = m11;
}
```

#### Uso de `assertNonZero` para determinante

**Recomendación para `inverse()` y `solve()`:**

```typescript
public static inverse(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  assertNonZero(det, 'Matrix2.inverse:determinant');  // ← Mejor debugging
  // ...
}

public static solve(matrix: ReadonlyMatrix2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const det = matrix.m00 * matrix.m11 - matrix.m01 * matrix.m10;
  assertNonZero(det, 'Matrix2.solve:determinant');  // ← Mejor debugging
  // ...
}
```

#### Uso de `assertRange` para interpolación

```typescript
public static lerp(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  t: number,
  out?: Matrix2,
): Matrix2 {
  assertRange(t, 0, 1, 'Matrix2.lerp:t');  // ← Validación de rango
  // ...
}
```

### 25.4 Patrón de Assertions Box2D

**Filosofía adoptada:**

```typescript
// Assertions = desarrollo (deshabilitables)
assertMatrix2(m00, m01, m10, m11, 'input'); // Zero cost en producción

// Throws = errores irrecuperables (siempre activos)
if (isNearZero(det)) throw new Error('Matrix2.inverse: singular matrix');
```

**Regla DRY:** Las validaciones de parámetros de entrada usan assertions. Los errores de estado irrecuperable (matriz singular, overflow) usan throws.

---

## 26. Análisis Exhaustivo: deterministic/

### 26.1 Inventario de Módulos Determinísticos

#### deterministic-math.ts

```typescript
class DeterministicMath {
 // Configuración
 static configure(options: Partial<DeterministicOptions>): void;
 static reset(): void;
 static getOptions(): Required<DeterministicOptions>;

 // Trigonometría (lookup tables + interpolación)
 static sin(angle: number): number;
 static cos(angle: number): number;
 static tan(angle: number): number;

 // Trigonometría inversa (identidades + composición)
 static acos(x: number): number; // acos(x) = atan2(sqrt(1-x²), x)
 static acosSafe(x: number): number; // clamps [-1, 1]
 static asin(x: number): number; // asin(x) = atan2(x, sqrt(1-x²))
 static asinSafe(x: number): number; // clamps [-1, 1]
 static atan2(y: number, x: number): number; // quantized

 // Raíz cuadrada (Newton-Raphson)
 static sqrt(x: number): number;
 static sqrtSafe(x: number): number; // clamps < 0 to 0

 // Operaciones básicas
 static abs(value: number): number; // delega a scalar/arithmetic
 static sign(value: number): number; // delega a scalar/arithmetic

 // Redondeo (bitwise fast para int32)
 static floor(x: number): number; // fast, int32 range
 static floorSafe(x: number): number; // all finite
 static ceil(x: number): number; // fast, int32 range
 static ceilSafe(x: number): number; // all finite
 static round(x: number): number; // banker's rounding
 static roundSafe(x: number): number; // all finite
}
```

#### precision-math.ts

```typescript
class PrecisionMath {
 // Suma compensada
 static kahanSum(values: readonly number[]): number;
 static neumaierSum(values: readonly number[]): number;

 // Aritmética exacta
 static twoSum(a: number, b: number): TwoSumResult; // { sum, error }
 static fastTwoSum(a: number, b: number): TwoSumResult; // when |a| >= |b|
 static twoProduct(a: number, b: number): TwoProductResult; // { product, error }

 // Productos compensados
 static compensatedProduct(values: readonly number[]): CompensatedResult;
 static compensatedDot(a: readonly number[], b: readonly number[]): CompensatedResult;
 static extendedSum(values: readonly CompensatedResult[]): CompensatedResult;
}
```

#### rounding-control.ts

```typescript
enum RoundingMode {
 TRUNCATE = 'truncate',
 NEAREST_EVEN = 'nearestEven', // Banker's rounding
 NEAREST_AWAY = 'nearestAway',
 CEIL = 'ceil',
 FLOOR = 'floor',
}

class RoundingControl {
 // Redondeo con modo explícito
 static round(value: number, mode: RoundingMode): number;
 static truncate(value: number): number;
 static nearestEven(value: number): number;
 static nearestAway(value: number): number;
 static ceil(value: number): number;
 static floor(value: number): number;

 // Redondeo a precisión específica
 static roundToPlaces(value: number, places: number, mode?: RoundingMode): number;
 static roundToMultiple(value: number, multiple: number, mode?: RoundingMode): number;
 static quantizeToFixed(value: number, fractionalBits: number, mode?: RoundingMode): number;

 // Especial
 static stochasticRound(value: number, random: number): number;
 static rangeReduce(value: number, period: number): number;
}
```

### 26.2 Uso Actual en Matrix2 vs Oportunidades

| Función                                | Matrix2 Usa | Vector2 Usa | Oportunidad para Matrix2                     |
| -------------------------------------- | ----------- | ----------- | -------------------------------------------- |
| **DeterministicMath.sin/cos**          | ❌          | ✅          | Usar en `fromRotation`, `getRotationAngle`   |
| **DeterministicMath.sqrt**             | ❌          | ✅          | Usar en `frobeniusNorm`                      |
| **DeterministicMath.atan2**            | ✅          | ✅          | Ya implementado ✅                           |
| **DeterministicMath.floor/ceil/round** | ❌          | ❌          | Añadir `floor()`, `ceil()`, `round()`        |
| **DeterministicMath.abs**              | ❌          | ✅          | Añadir `abs()`                               |
| **PrecisionMath.twoSum**               | ❌          | ❌          | Para `compensatedAdd` de alta precisión      |
| **PrecisionMath.twoProduct**           | ❌          | ❌          | Para `compensatedMultiply` de alta precisión |
| **RoundingControl.roundToPlaces**      | ❌          | ❌          | Para `toString` con precisión controlada     |

### 26.3 Métodos Recomendados para Matrix2 usando deterministic/

#### 25.3.1 floor/ceil/round/abs (usando DeterministicMath)

```typescript
import { DeterministicMath } from '../deterministic/deterministic-math';

/**
 * Applies floor to all matrix elements.
 * Uses deterministic floor for cross-platform consistency.
 *
 * @param matrix - Input matrix
 * @param out - Optional output matrix
 * @returns Matrix with floored elements
 *
 * @category Numeric Transforms
 */
public static floor(matrix: ReadonlyMatrix2Like, out?: Matrix2): Matrix2 {
  return Matrix2.ensureOut(out).set(
    DeterministicMath.floor(matrix.m00),
    DeterministicMath.floor(matrix.m01),
    DeterministicMath.floor(matrix.m10),
    DeterministicMath.floor(matrix.m11),
  );
}

/**
 * Applies floor to all elements in place.
 * @returns `this` for chaining
 */
public floor(): this {
  this.m00 = DeterministicMath.floor(this.m00);
  this.m01 = DeterministicMath.floor(this.m01);
  this.m10 = DeterministicMath.floor(this.m10);
  this.m11 = DeterministicMath.floor(this.m11);
  return this;
}

// Análogo para ceil, round, abs
```

#### 25.3.2 Uso de DeterministicMath en fromRotation

**Estado actual:**

```typescript
public static fromRotation(rotation: ReadonlyRotation2): Matrix2 {
  return new Matrix2(rotation.cos, -rotation.sin, rotation.sin, rotation.cos);
}
```

**Oportunidad de mejora (si recibe ángulo):**

```typescript
/**
 * Creates a rotation matrix from an angle using deterministic trigonometry.
 *
 * @param angle - Rotation angle in radians
 * @param out - Optional output matrix
 * @returns Rotation matrix
 *
 * @remarks
 * Uses `DeterministicMath.sin/cos` for cross-platform reproducibility.
 */
public static fromAngle(angle: number, out?: Matrix2): Matrix2 {
  const c = DeterministicMath.cos(angle);
  const s = DeterministicMath.sin(angle);
  return Matrix2.ensureOut(out).set(c, -s, s, c);
}

/**
 * Extracts rotation angle using deterministic atan2.
 * @returns Rotation angle in radians
 */
public getRotationAngle(): number {
  // Asuming this is a rotation matrix
  return DeterministicMath.atan2(this.m10, this.m00);
}
```

#### 25.3.3 Norma Frobenius con DeterministicMath

**Estado actual:**

```typescript
public frobeniusNorm(): number {
  return Math.sqrt(this.m00 * this.m00 + this.m01 * this.m01 +
                   this.m10 * this.m10 + this.m11 * this.m11);
}
```

**Oportunidad de mejora:**

```typescript
/**
 * Computes Frobenius norm using deterministic sqrt.
 * @returns Frobenius norm (deterministic)
 */
public frobeniusNorm(): number {
  return DeterministicMath.sqrt(
    this.m00 * this.m00 + this.m01 * this.m01 +
    this.m10 * this.m10 + this.m11 * this.m11
  );
}
```

#### 25.3.4 toString con RoundingControl

```typescript
import { RoundingControl, RoundingMode } from '../deterministic/rounding-control';

/**
 * Converts matrix to string with controlled precision.
 *
 * @param places - Number of decimal places (default: 4)
 * @param mode - Rounding mode (default: NEAREST_EVEN)
 * @returns Formatted string representation
 */
public toStringPrecision(
  places: number = 4,
  mode: RoundingMode = RoundingMode.NEAREST_EVEN
): string {
  const r = (v: number) => RoundingControl.roundToPlaces(v, places, mode);
  return `Matrix2(${r(this.m00)}, ${r(this.m01)}, ${r(this.m10)}, ${r(this.m11)})`;
}
```

#### 25.3.5 Productos de Alta Precisión con PrecisionMath

```typescript
import { PrecisionMath } from '../deterministic/precision-math';

/**
 * Computes determinant with extended precision.
 * Useful for near-singular matrices where precision matters.
 *
 * @returns Determinant with reduced floating-point error
 */
public determinantCompensated(): number {
  // det = m00*m11 - m01*m10
  const { product: p1, error: e1 } = PrecisionMath.twoProduct(this.m00, this.m11);
  const { product: p2, error: e2 } = PrecisionMath.twoProduct(this.m01, this.m10);

  // Suma compensada del resultado
  const { sum, error } = PrecisionMath.twoSum(p1, -p2);
  return sum + error + e1 - e2;
}

/**
 * Multiplies matrices with Kahan-compensated accumulation.
 * Higher precision for long multiplication chains.
 */
public static multiplyCompensated(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  out?: Matrix2
): Matrix2 {
  // Cada elemento del resultado es un producto escalar de 2 elementos
  const m00 = PrecisionMath.neumaierSum([a.m00 * b.m00, a.m01 * b.m10]);
  const m01 = PrecisionMath.neumaierSum([a.m00 * b.m01, a.m01 * b.m11]);
  const m10 = PrecisionMath.neumaierSum([a.m10 * b.m00, a.m11 * b.m10]);
  const m11 = PrecisionMath.neumaierSum([a.m10 * b.m01, a.m11 * b.m11]);

  return Matrix2.ensureOut(out).set(m00, m01, m10, m11);
}
```

### 26.4 Resumen de Acciones para deterministic/

| Prioridad   | Acción                                              | Módulo Fuente      | Beneficio                |
| ----------- | --------------------------------------------------- | ------------------ | ------------------------ |
| 🔴 Alta     | Usar `DeterministicMath.sqrt` en `frobeniusNorm`    | deterministic-math | Determinismo             |
| 🔴 Alta     | Añadir `floor()`, `ceil()`, `round()`, `abs()`      | deterministic-math | Consistencia con Vector2 |
| 🟠 Media    | Añadir `fromAngle()` con trigonometría determinista | deterministic-math | Factory completo         |
| 🟠 Media    | Añadir `getRotationAngle()`                         | deterministic-math | Extracción de ángulo     |
| 🟡 Baja     | Añadir `toStringPrecision()`                        | rounding-control   | Display controlado       |
| 🟢 Opcional | Añadir `determinantCompensated()`                   | precision-math     | Alta precisión           |
| 🟢 Opcional | Añadir `multiplyCompensated()`                      | precision-math     | Cadenas largas           |

### 26.5 Decisiones de Diseño: ¿Cuándo usar deterministic/?

```
┌─────────────────────────────────────────────────────────────────┐
│                    Árbol de Decisión                           │
├─────────────────────────────────────────────────────────────────┤
│ ¿La operación involucra trigonometría?                         │
│   └─ SÍ → Usar DeterministicMath.sin/cos/tan/atan2             │
│                                                                 │
│ ¿La operación involucra sqrt?                                  │
│   └─ SÍ → Usar DeterministicMath.sqrt                          │
│                                                                 │
│ ¿Es floor/ceil/round/abs en hot path?                          │
│   └─ SÍ → Usar DeterministicMath (bitwise fast)                │
│                                                                 │
│ ¿Se requiere control explícito del modo de redondeo?           │
│   └─ SÍ → Usar RoundingControl                                 │
│                                                                 │
│ ¿La precisión es crítica (near-singular, long chains)?         │
│   └─ SÍ → Usar PrecisionMath (compensated algorithms)          │
│                                                                 │
│ ¿Ninguno de los anteriores?                                    │
│   └─ Usar Math nativo + scalar/arithmetic                      │
└─────────────────────────────────────────────────────────────────┘
```

---

## 27. Patrones de Vector2 para Matrix2

### 27.1 Tríada Safe/Throwing/Unchecked

| Variante      | Uso               | Comportamiento en error | Ejemplo Vector2             |
| ------------- | ----------------- | ----------------------- | --------------------------- |
| **Throwing**  | API general       | `throw RangeError`      | `normalize()`               |
| **Safe**      | Flujo recuperable | Retorna valor fallback  | `normalizeSafe()` → `(0,0)` |
| **Unchecked** | Hot paths         | Undefined behavior      | `normalizeUnchecked()`      |

**Aplicación a Matrix2:**

| Operación   | Throwing  | Safe (fallback) | Unchecked   | Estado                                     |
| ----------- | --------- | --------------- | ----------- | ------------------------------------------ |
| `inverse`   | ✅ det≈0  | IDENTITY        | Sin chequeo | 🔴 Falta `inverseSafe`, `inverseUnchecked` |
| `solve(b)`  | ✅ det≈0  | ZERO vector     | Sin chequeo | 🔴 No existe                               |
| `normalize` | ✅ norm≈0 | ZERO matrix     | Sin chequeo | 🔴 No existe                               |

### 27.2 Valores por Defecto y Tolerancias

**Vector2 usa:**

- `epsilon = EPSILON` (nunca `tolerance`)
- `isNearZero(value, epsilon)` para comparaciones
- Importa `EPSILON` de `scalar/constants`

**Matrix2 debe corregir:**

- ⚠️ Algunos métodos usan `tolerance` → Renombrar a `epsilon`
- ⚠️ Uso inconsistente de `isNearZero` → Aumentar uso

### 27.3 Simetría Estático/Instancia

```typescript
// ESTÁTICO: Puro, acepta out?, retorna tipo
static add(a, b, out?): Vector2

// INSTANCIA: Muta this, retorna this, SIN out
add(v): this
```

**Problema en Matrix2:** Algunos métodos instancia aceptan `out?` → **Eliminar**.

### 27.4 Sobrecarga de Constructor

**Vector2 soporta:**

1. `new Vector2()` → `(0, 0)`
2. `new Vector2(x, y)`
3. `new Vector2([x, y])`
4. `new Vector2({ x, y })`

**Matrix2 debe añadir:**

1. `new Matrix2()` → IDENTITY ✅
2. `new Matrix2(m00, m01, m10, m11)` ✅
3. `new Matrix2([m00, m01, m10, m11])` 🔴 Falta
4. `new Matrix2({ m00, m01, m10, m11 })` 🔴 Falta

### 27.5 Hot Paths y Chequeos

| Situación            | Acción              | Método               |
| -------------------- | ------------------- | -------------------- |
| API pública          | Validar + throw     | `inverse()`          |
| Recuperable          | Método `*Safe`      | `inverseSafe()`      |
| Hot path interno     | Método `*Unchecked` | `inverseUnchecked()` |
| Comparación numérica | `isNearZero(v, ε)`  | Nunca `v === 0`      |

### 27.6 Getters Inmutables

**Vector2 tiene:**

- `normalized` → nuevo Vector2 normalizado
- `negated` → nuevo Vector2 negado
- `absolute` → nuevo Vector2 con abs

**Matrix2 debe añadir:**

- `transposed` → nueva Matrix2 transpuesta
- `negated` → nueva Matrix2 negada
- `inverted` → nueva Matrix2 inversa (puede throw)
- `invertedSafe` → nueva Matrix2 inversa segura

### 27.7 Constantes Frozen

**Vector2:**

```typescript
public static readonly ZERO = freezeVector2(new Vector2(0, 0));
public static readonly EPSILON_VECTOR = freezeVector2(new Vector2(EPSILON, EPSILON));
```

**Matrix2 debe añadir:**

```typescript
public static readonly ONE = freezeMatrix2(new Matrix2(1, 1, 1, 1));
public static readonly EPSILON_MATRIX = freezeMatrix2(new Matrix2(EPSILON, EPSILON, EPSILON, EPSILON));
```

### 27.8 Checklist de Paridad Vector2 ↔ Matrix2

| Patrón                         | Vector2       | Matrix2              | Estado |
| ------------------------------ | ------------- | -------------------- | ------ |
| Tríada Safe/Throwing/Unchecked | ✅            | ⚠️ Parcial           | 🔴     |
| `epsilon = EPSILON` default    | ✅            | ⚠️ Usa `tolerance`   | 🟡     |
| Uso de `isNearZero()`          | ✅ Extensivo  | ⚠️ Parcial           | 🟡     |
| Sobrecarga constructor         | ✅ 4 formas   | ❌ 1 forma           | 🔴     |
| Métodos `*Unchecked`           | ✅ 2 métodos  | ❌ Ninguno           | 🔴     |
| Getters inmutables             | ✅ 3+         | ⚠️ Algunos           | 🟡     |
| Constantes frozen              | ✅ Con helper | ⚠️ Sin helper        | 🟡     |
| Instance retorna `this`        | ✅            | ❌ Retorna `Matrix2` | 🔴     |
| Instance sin `out?`            | ✅            | ❌ Algunos tienen    | 🔴     |

---

## 28. Checklist Final de Sinergias

### 28.1 validation/assert

- [ ] Usar `assertMatrix2` en factories y constructor
- [ ] Usar `assertNonZero` para validación de determinante
- [ ] Usar `assertRange` para parámetros de interpolación
- [ ] Usar `assertFinite` ya implementado ✅

### 28.2 deterministic/deterministic-math

- [ ] Migrar `frobeniusNorm` a usar `DeterministicMath.sqrt`
- [ ] Añadir `floor()`, `ceil()`, `round()` con `DeterministicMath`
- [ ] Añadir `abs()` con `DeterministicMath.abs`
- [ ] Añadir `fromAngle()` con `DeterministicMath.sin/cos`
- [ ] Añadir `getRotationAngle()` con `DeterministicMath.atan2`

### 28.3 deterministic/precision-math

- [ ] Considerar `determinantCompensated()` para casos de alta precisión
- [ ] Considerar `multiplyCompensated()` para cadenas largas

### 28.4 deterministic/rounding-control

- [ ] Añadir `toStringPrecision()` con `RoundingControl.roundToPlaces`

### 28.5 Paridad con Vector2 (Sección 27)

- [ ] Añadir `inverseSafe()` y `inverseUnchecked()`
- [ ] Renombrar `tolerance` → `epsilon` en comparaciones
- [ ] Eliminar `out?` de métodos instancia
- [ ] Añadir sobrecargas de constructor (array, object)
- [ ] Añadir getters inmutables: `transposed`, `negated`, `inverted`
- [ ] Añadir constantes: `ONE`, `EPSILON_MATRIX`
- [ ] Corregir métodos instancia para retornar `this`

---

_Documento generado como parte del proceso de refactorización de `@lenguados/math2d`._
_Última actualización: 2025-12-03_
