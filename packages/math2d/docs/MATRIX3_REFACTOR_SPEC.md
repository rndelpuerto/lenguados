# Matrix3 Refactoring Specification

## 1. Resumen Ejecutivo

Este documento analiza `matrix3.ts` comparándolo con `vector2.ts` y `matrix2.ts` para garantizar consistencia API, riqueza de métodos, y adherencia a los patrones establecidos en el paquete `@lenguados/math2d`.

### Filosofía del Paquete

> **IMPORTANTE:** El paquete `@lenguados/math2d` es una **base matemática pura y rigurosa**. 
> No incluye métodos explícitos para motores de física o geometría de alto nivel.
> Proporciona las operaciones matemáticas fundamentales que servirán de base para 
> construir módulos de alto nivel en otros paquetes.

**Alcance de Matrix3:**
- ✅ Operaciones matriciales (multiplicación, inversa, transpuesta, determinante)
- ✅ Transformaciones afines 2D (composición de rotación, escala, translación)
- ✅ Interpolación lineal entre matrices
- ✅ Propiedades algebraicas (traza, norma de Frobenius, ortogonalidad)
- ❌ Simulación física (velocidades, fuerzas, colisiones)
- ❌ Algoritmos geométricos de alto nivel (intersecciones, distancias a curvas)

### Hallazgos Principales

| Categoría | Estado | Impacto |
|-----------|--------|---------|
| Organización de Secciones | ❌ Inconsistente | Alto |
| Simetría estático/instancia | ❌ Incorrecto | Crítico |
| Métodos faltantes | ❌ ~30 métodos | Alto |
| Formato de comentarios | ❌ Diferente | Medio |
| Type exports | ❌ Incompleto | Medio |
| Helpers (freezeMatrix3) | ❌ Faltante | Medio |
| Constructor overloads | ❌ No implementado | Medio |

---

## 2. Análisis de Organización de Secciones

### 2.1 Formato de Comentarios de Sección

**Matrix2 (correcto):**
```typescript
/* ======================================================================== */
/* Section Name                                                              */
/* ======================================================================== */
```

**Matrix3 (incorrecto):**
```typescript
/* ========================================================================== */
/* Section Name */
/* ========================================================================== */
```

**Problema:** Matrix3 usa 80 caracteres en el separador vs 76 en Matrix2, y no alinea el texto.

### 2.2 Nombres de Secciones

| Matrix2 Section | Matrix3 Equivalente | Estado |
|-----------------|---------------------|--------|
| Type Exports | ❌ Faltante | Añadir |
| Helper Functions | `Helpers` | ✅ Existe (renombrar) |
| Private Helpers | `Helpers` | ⚠️ Mezclado |
| Static Constants (Immutable) | `Constants` | ✅ Existe (renombrar) |
| Static Factories | `Static factories` | ✅ Existe |
| Static Arithmetic | `Static operations` | ⚠️ Mezclado |
| Static Numeric Transforms | ❌ Faltante | Añadir |
| Static Interpolation | ❌ Faltante (en Static operations) | Separar |
| Static Comparison & Validation | ❌ Faltante (en Static operations) | Separar |
| Static Matrix Operations | ❌ Faltante | Añadir |
| Instance Properties | ❌ Faltante (propiedades al inicio) | Añadir |
| Constructor | ❌ Faltante (constructor inline) | Añadir |
| Instance Basic Mutators | `Instance setters` | ✅ Existe |
| Instance Computed Values | `Queries` | ⚠️ Diferente nombre |
| Instance Getters (Derived) | `Readonly Getters` | ⚠️ Diferente nombre |
| Instance Arithmetic | `Arithmetic` | ✅ Existe |
| Instance Matrix Operations | ❌ Faltante | Añadir |
| Instance Numeric Transforms | ❌ Faltante | Añadir |
| Instance Transformations | `Transform builders` | ⚠️ Diferente nombre |
| Instance Column/Row Access | `Column/Row Access` | ✅ Existe |
| Instance Comparison | `Comparison & interpolation` | ⚠️ Mezclado |
| Instance Interpolation | `Comparison & interpolation` | ⚠️ Mezclado |
| Instance Conversion | `Conversion` + `Serialization` | ⚠️ Dividido |

### 2.3 Orden de Secciones

**Matrix2 (orden correcto):**
1. Type Exports (fuera de clase)
2. Helper Functions (fuera de clase)
3. Class definition
4. Private Helpers
5. Static Constants
6. Static Factories
7. Static Arithmetic
8. Static Numeric Transforms
9. Static Interpolation
10. Static Comparison & Validation
11. Static Matrix Operations
12. Instance Properties
13. Constructor
14. Instance Basic Mutators
15. ... (resto de instancia)

**Matrix3 (orden incorrecto):**
1. Constructor (al inicio de clase) ❌
2. Helpers
3. Constants
4. Static factories
5. Static operations (mezclado)
6. Instance setters
7. ... (mezcla de categorías)

---

## 3. Análisis de Simetría Estático/Instancia

### 3.1 Problema Crítico: Métodos de Instancia con `out?`

**Patrón correcto (Matrix2 v0.9.0+):**
```typescript
// STATIC: acepta out? para zero-allocation
static add(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, out?: Matrix2): Matrix2

// INSTANCE: muta this, retorna this para chaining, NO acepta out
add(other: ReadonlyMatrix2Like): this
```

**Patrón incorrecto en Matrix3:**
```typescript
// INSTANCE: acepta out?, devuelve Matrix3 en lugar de this
multiply(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3
add(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3
subtract(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3
scale(scalar: number, out?: Matrix3): Matrix3
transpose(out?: Matrix3): Matrix3
inverse(out?: Matrix3): Matrix3
negate(out?: Matrix3): Matrix3
premultiply(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3
lerp(other: ReadonlyMatrix3Like, t: number, out?: Matrix3): Matrix3
```

**Implementación incorrecta:**
```typescript
multiply(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const r = Matrix3.multiply(this, other, out ?? this);
  return out ? r : this;  // ❌ Confuso, no chainable
}
```

**Implementación correcta (como Matrix2):**
```typescript
multiply(other: ReadonlyMatrix3Like): this {
  const { m00: a00, ... } = this;
  const { m00: b00, ... } = other;
  this.m00 = ...;  // Muta directamente
  return this;     // Chainable
}
```

### 3.2 Métodos que Requieren Corrección

| Método | Estado Actual | Corrección Necesaria |
|--------|---------------|----------------------|
| `multiply(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `add(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `subtract(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `scale(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `transpose(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `inverse(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `negate(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `premultiply(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `lerp(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `translate(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `rotate(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |
| `scaleBy(out?)` | ❌ Acepta out | Remover out, mutar this, retornar this |

---

## 4. Métodos Estáticos Faltantes

### 4.1 Factories Faltantes

| Método | Matrix2 | Matrix3 | Prioridad |
|--------|---------|---------|-----------|
| `fromObject` | ✅ | ❌ | Alta |
| `copy` | ✅ | ❌ | Alta |
| `fromColumns` | ✅ | ❌ | Media |
| `fromRows` | ✅ | ❌ | Media |
| `fromShear` | ✅ | ❌ Aplicable | Media |

### 4.2 Aritmética Escalar Faltante

| Método | Matrix2 | Matrix3 | Prioridad |
|--------|---------|---------|-----------|
| `addScalar` | ✅ | ❌ | Alta |
| `subtractScalar` | ✅ | ❌ | Alta |
| `multiplyScalar` | ✅ | ❌ (solo `scale`) | Alta |
| `divideScalar` | ✅ | ❌ | Alta |

### 4.3 Transformaciones Numéricas Faltantes

| Método | Matrix2 | Matrix3 | Prioridad |
|--------|---------|---------|-----------|
| `floor` | ✅ | ❌ | Media |
| `ceil` | ✅ | ❌ | Media |
| `round` | ✅ | ❌ | Media |
| `abs` | ✅ | ❌ | Media |
| `sign` | ✅ | ❌ | Baja |
| `min` | ✅ | ❌ | Media |
| `max` | ✅ | ❌ | Media |
| `clamp` | ✅ | ❌ | Media |
| `clampScalar` | ✅ | ❌ | Media |

### 4.4 Interpolación Faltante

| Método | Matrix2 | Matrix3 | Prioridad |
|--------|---------|---------|-----------|
| `lerpUnclamped` | ✅ | ❌ | Alta |
| `smoothStep` | ✅ | ❌ | Media |

### 4.5 Comparación/Validación Faltantes

| Método | Matrix2 | Matrix3 | Prioridad |
|--------|---------|---------|-----------|
| `isZero` | ✅ | ❌ | Alta |
| `nearZero` | ✅ | ❌ | Alta |
| `isFinite` | ✅ | ❌ | Alta |
| `hasNaN` | ✅ | ❌ | Alta |
| `isSymmetric` | ✅ | ❌ | Media |
| `isSkewSymmetric` | ✅ | ❌ | Baja |
| `isDiagonal` | ✅ | ❌ | Media |
| `isSingular` | ✅ | ❌ | Alta |

### 4.6 Operaciones Matriciales Faltantes

| Método | Matrix2 | Matrix3 | Prioridad |
|--------|---------|---------|-----------|
| `adjugate` | ✅ | ❌ | Media |
| `inverseSafe` | ✅ | ❌ | Alta |
| `inverseUnchecked` | ✅ | ❌ | Alta |

---

## 5. Métodos de Instancia Faltantes

### 5.1 Replicar de Matrix2

| Método | Descripción | Prioridad |
|--------|-------------|-----------|
| `set` | ✅ Existe, verificar firma | - |
| `addScalar` | Añadir escalar a todos los elementos | Alta |
| `subtractScalar` | Restar escalar de todos los elementos | Alta |
| `divideScalar` | Dividir todos los elementos por escalar | Alta |
| `floor` | Aplicar Math.floor | Media |
| `ceil` | Aplicar Math.ceil | Media |
| `round` | Aplicar Math.round | Media |
| `abs` | Aplicar valor absoluto | Media |
| `sign` | Aplicar función signo | Baja |
| `min` | Mínimo componente a componente | Media |
| `max` | Máximo componente a componente | Media |
| `clamp` | Clamp entre matrices | Media |
| `clampScalar` | Clamp entre escalares | Media |
| `frobeniusNorm` | Norma de Frobenius | Alta |
| `trace` | Suma de diagonal | Alta |
| `adjugate` | Matriz adjunta | Media |
| `inverseSafe` | Inversa segura (identity si singular) | Alta |
| `inverseUnchecked` | Inversa sin verificar (hot path) | Alta |
| `isZero` | Verificar si es matriz cero | Alta |
| `nearZero` | Verificar si está cerca de cero | Alta |
| `isFinite` | Verificar si todos son finitos | Alta |
| `hasNaN` | Verificar si hay NaN | Alta |
| `isSymmetric` | Verificar simetría | Media |
| `isSkewSymmetric` | Verificar anti-simetría | Baja |
| `isDiagonal` | Verificar si es diagonal | Media |
| `isSingular` | Verificar si es singular | Alta |
| `isOrthogonal` | Verificar ortogonalidad | Media |
| `lerpUnclamped` | Interpolación sin clamp | Alta |
| `smoothStep` | Interpolación suave | Media |
| `toFloat32Array` | Conversión a Float32Array | Alta |

---

## 6. Type Exports y Helpers Faltantes

### 6.1 Type Exports

**Matrix2:**
```typescript
/* ========================================================================== */
/* Type Exports                                                               */
/* ========================================================================== */

export type ReadonlyMatrix2 = Readonly<Matrix2>;
```

**Matrix3 tiene:**
```typescript
export type ReadonlyMatrix3 = Readonly<Matrix3>;
```
Pero NO está en una sección separada.

### 6.2 Helper Functions

**Matrix2 tiene:**
```typescript
/* ========================================================================== */
/* Helper Functions                                                           */
/* ========================================================================== */

export function freezeMatrix2(matrix: Matrix2): ReadonlyMatrix2 {
  return Object.freeze(matrix);
}

export { isMatrix2Like } from '../types';
```

**Matrix3 NO tiene:**
- ❌ `freezeMatrix3` helper function
- ❌ Re-export de `isMatrix3Like`

### 6.3 Constantes que usan Object.freeze directamente

**Matrix2 (correcto):**
```typescript
public static readonly IDENTITY = freezeMatrix2(new Matrix2(1, 0, 0, 1));
```

**Matrix3 (incorrecto):**
```typescript
static readonly IDENTITY = Object.freeze(new Matrix3()) as ReadonlyMatrix3;
```

---

## 7. Constructor Overloads

### 7.1 Matrix2 Constructor (correcto)

```typescript
/** Creates a zero vector `(0, 0)`. */
constructor();
/** Creates from components. */
constructor(m00: number, m01: number, m10: number, m11: number);
/** Creates from array. */
constructor(array: [number, number, number, number]);
/** Creates from object. */
constructor(object: ReadonlyMatrix2Like);

constructor(
  m00OrSource?: number | [number, number, number, number] | ReadonlyMatrix2Like,
  m01?: number,
  m10?: number,
  m11?: number,
) {
  if (m00OrSource === undefined) {
    // Identity
  } else if (typeof m00OrSource === 'number') {
    // Explicit components
  } else if (Array.isArray(m00OrSource)) {
    // From array
  } else if (typeof m00OrSource === 'object' && 'm00' in m00OrSource) {
    // From object
  } else {
    throw new TypeError('Matrix2: invalid constructor arguments');
  }
}
```

### 7.2 Matrix3 Constructor (incompleto)

```typescript
constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
  this.m00 = m00;
  // ... solo acepta números
}
```

**Falta:**
- ❌ Overload para array `[number, ..., number]` (9 elementos)
- ❌ Overload para objeto `ReadonlyMatrix3Like`
- ❌ Overload signatures documentadas
- ❌ Validación y error handling

---

## 8. Documentación JSDoc Faltante

### 8.1 Clase Matrix3

**Documentación Propuesta (alineada con filosofía de matemáticas puras):**

```typescript
/**
 * Column-major 3×3 matrix for 2D affine transformations in homogeneous coordinates.
 *
 * @remarks
 * **Mathematical Foundation**
 * - Represents linear transformations extended with translation via homogeneous coordinates
 * - Upper-left 2×2 block contains the linear part (rotation, scale, shear)
 * - Third column contains the translation vector
 * - Bottom row is [0, 0, 1] for affine transformations
 *
 * **API Design**
 * - Instance methods mutate `this` for fluent chaining
 * - Static helpers are pure and provide optional `out` parameters for allocation control
 * - Trigonometric operations use {@link DeterministicMath} for cross-platform reproducibility
 *
 * **Matrix Layout (Column-Major)**
 * ```
 * | m00  m10  m20 |   | scaleX*cos  -scaleY*sin  translateX |
 * | m01  m11  m21 | = | scaleX*sin   scaleY*cos  translateY |
 * | m02  m12  m22 |   |     0            0           1      |
 * ```
 *
 * @example
 * ```typescript
 * // Compose transformations
 * const transform = Matrix3.fromTranslation({ x: 100, y: 50 })
 *   .rotate(Math.PI / 4)
 *   .scaleBy(2);
 *
 * // Apply to point
 * const worldPoint = transform.transformPoint({ x: 0, y: 0 });
 * ```
 *
 * @category Core
 * @since 0.1.0
 */
export class Matrix3 implements Matrix3Like {
```

**Documentación Actual (insuficiente):**
```typescript
/**
 * Column-major 3×3 matrix storing 2D affine transforms. Instance methods mutate `this` to support
 * fluent APIs, while static helpers stay pure and accept optional `out` parameters for reuse.
 */
```

---

## 9. Métodos con Implementación Diferente

### 9.1 `toArray` Parameter Order

**Matrix2:**
```typescript
toArray(out?: number[], offset = 0, columnMajor = true): number[]
```

**Matrix3:**
```typescript
toArray(out?: number[], offset = 0, columnMajor = true): number[]
```
✅ Consistente

### 9.2 `toString` Precision

**Matrix2:**
```typescript
toString(precision = 4): string
```

**Matrix3:**
```typescript
toString(precision = 4): string
```
✅ Consistente

---

## 10. Constantes Faltantes

| Constante | Matrix2 | Matrix3 | Notas |
|-----------|---------|---------|-------|
| `IDENTITY` | ✅ | ✅ | - |
| `ZERO` | ✅ | ✅ | - |
| `ONE` | ✅ | ❌ | Añadir |
| `EPSILON_MATRIX` | ✅ | ❌ | Añadir |
| `ROTATE_90` | ✅ | ✅ | - |
| `ROTATE_180` | ✅ | ✅ | - |
| `ROTATE_270` | ✅ | ✅ | - |
| `FLIP_X` | ✅ | ✅ | - |
| `FLIP_Y` | ✅ | ✅ | - |
| `FLIP_XY` | ✅ | ❌ | Añadir |
| `SCALE_2` | ✅ | ❌ | Añadir |
| `SCALE_HALF` | ✅ | ❌ | Añadir |

---

## 11. Getters Faltantes

| Getter | Matrix2 | Matrix3 | Notas |
|--------|---------|---------|-------|
| `transposed` | ✅ | ✅ | - |
| `inverted` | ✅ | ✅ | - |
| `negated` | ✅ | ✅ | - |
| `column0` | ✅ | ❌ | Añadir (Vector3 o [n,n,n]) |
| `column1` | ✅ | ❌ | Añadir |
| `column2` | N/A | ❌ | Añadir |
| `row0` | ✅ | ❌ | Añadir |
| `row1` | ✅ | ❌ | Añadir |
| `row2` | N/A | ❌ | Añadir |
| `diagonal` | ✅ | ✅ | Tipos diferentes |
| `translation` | N/A | ✅ | Específico de 3x3 |
| `upperLeft2x2` | N/A | ✅ | Específico de 3x3 |

---

## 12. Comparación con Librerías Matemáticas Externas

> **Nota:** Comparamos con librerías matemáticas para identificar operaciones 
> algebraicas fundamentales. Excluimos métodos específicos de renderizado 3D, 
> quaterniones, o matrices 4x4 que están fuera del alcance de este módulo 2D.

### 12.1 glMatrix (mat3) - Operaciones Matemáticas Relevantes

```javascript
// Operaciones algebraicas fundamentales:
mat3.transpose(out, a)      // Transpuesta
mat3.invert(out, a)         // Inversa
mat3.adjoint(out, a)        // Matriz adjunta
mat3.determinant(a)         // Determinante
mat3.multiply(out, a, b)    // Producto matricial
mat3.add(out, a, b)         // Suma
mat3.subtract(out, a, b)    // Resta
mat3.multiplyScalar(out, a, b)         // Escalar por matriz
mat3.multiplyScalarAndAdd(out, a, b, s) // FMA
mat3.frob(a)                // Norma de Frobenius
mat3.equals(a, b)           // Igualdad aproximada
mat3.exactEquals(a, b)      // Igualdad exacta

// Transformaciones afines 2D (matemáticas):
mat3.translate(out, a, v)   // Composición con translación
mat3.rotate(out, a, rad)    // Composición con rotación
mat3.scale(out, a, v)       // Composición con escala
mat3.fromTranslation(out, v)
mat3.fromRotation(out, rad)
mat3.fromScaling(out, v)
```

**Operaciones matemáticas faltantes en Matrix3:**
- ❌ `adjoint` (adjugate) - Matriz adjunta
- ❌ `frob` (frobeniusNorm) - Norma de Frobenius
- ❌ `multiplyScalar` - Multiplicación escalar
- ❌ `multiplyScalarAndAdd` (fma) - Fused multiply-add

**Excluidos (fuera de alcance 2D):**
- `fromQuat` - Quaterniones son 3D
- `normalFromMat4` - Requiere Matrix4
- `projection` - Específico de renderizado

### 12.2 Three.js (Matrix3) - Operaciones Matemáticas Relevantes

```javascript
// Operaciones algebraicas:
set(...)
identity()
copy(m)
multiply(m)
premultiply(m)
multiplyScalar(s)
determinant()
invert()
transpose()
equals(m)
clone()

// Transformaciones afines 2D:
scale(sx, sy)
rotate(theta)
translate(tx, ty)
```

**Operaciones matemáticas aplicables:**
- ✅ La mayoría ya están implementadas
- ❌ `multiplyScalar` como método separado

**Excluidos (fuera de alcance):**
- `extractBasis` - Operación 3D
- `setFromMatrix4` - Requiere Matrix4
- `getNormalMatrix` - Operación 3D
- `setUvTransform` - Específico de renderizado

---

## 13. Plan de Implementación por Fases

### Fase 1: Correcciones Arquitectónicas (Crítico)

1. **Corregir métodos de instancia** - Eliminar `out?` de todos los métodos de instancia
2. **Añadir helper `freezeMatrix3`**
3. **Re-exportar `isMatrix3Like`**
4. **Actualizar constantes** para usar `freezeMatrix3`
5. **Sobrecarga de constructor** (array, object)

### Fase 2: Organización de Secciones

1. Reorganizar secciones siguiendo el orden de Matrix2
2. Estandarizar formato de comentarios de sección
3. Separar secciones mezcladas

### Fase 3: Métodos Estáticos Faltantes

1. Factories: `fromObject`, `copy`, `fromColumns`, `fromRows`
2. Aritmética escalar: `addScalar`, `subtractScalar`, `multiplyScalar`, `divideScalar`
3. Comparación: `isZero`, `nearZero`, `isFinite`, `hasNaN`, `isSingular`
4. Operaciones: `adjugate`, `inverseSafe`, `inverseUnchecked`
5. Interpolación: `lerpUnclamped`, `smoothStep`

### Fase 4: Métodos de Instancia Faltantes

1. Aritmética: `addScalar`, `subtractScalar`, `divideScalar`
2. Transformaciones: `floor`, `ceil`, `round`, `abs`, `min`, `max`, `clamp`, `clampScalar`
3. Propiedades: `frobeniusNorm`, `trace`
4. Comparación: `isZero`, `nearZero`, `isFinite`, `hasNaN`, `isSymmetric`, `isDiagonal`, `isSingular`, `isOrthogonal`
5. Interpolación: `lerpUnclamped`, `smoothStep`
6. Conversión: `toFloat32Array`
7. Inversa: `inverseSafe`, `inverseUnchecked`, `adjugate`

### Fase 5: Constantes y Getters

1. Constantes: `ONE`, `EPSILON_MATRIX`, `FLIP_XY`, `SCALE_2`, `SCALE_HALF`
2. Getters: `column0`, `column1`, `column2`, `row0`, `row1`, `row2`

### Fase 6: Tests y Documentación

1. Añadir tests para todos los métodos nuevos
2. Actualizar documentación JSDoc
3. Verificar coverage > 90%

---

## 14. Checklist de Paridad Matrix2 ↔ Matrix3

### Type Exports
- [ ] `ReadonlyMatrix3` type export en sección separada

### Helper Functions
- [ ] `freezeMatrix3(matrix: Matrix3): ReadonlyMatrix3`
- [ ] Re-export `isMatrix3Like` from types

### Constructor
- [ ] Overload signatures documentadas
- [ ] Soporte para array de 9 elementos
- [ ] Soporte para objeto `ReadonlyMatrix3Like`
- [ ] Validación con `RangeError` y `TypeError`

### Static Constants
- [ ] Usar `freezeMatrix3` en lugar de `Object.freeze(...) as ReadonlyMatrix3`
- [ ] `ONE` (todos 1s)
- [ ] `EPSILON_MATRIX` (epsilon en todos)
- [ ] `FLIP_XY` (equivale a ROTATE_180)
- [ ] `SCALE_2`
- [ ] `SCALE_HALF`

### Static Factories
- [ ] `fromObject(obj, out?)`
- [ ] `copy(source, destination)`
- [ ] `fromColumns(col0, col1, col2, out?)`
- [ ] `fromRows(row0, row1, row2, out?)`

### Static Arithmetic
- [ ] `addScalar(matrix, scalar, out?)`
- [ ] `subtractScalar(matrix, scalar, out?)`
- [ ] `multiplyScalar(matrix, scalar, out?)` (alias de scale)
- [ ] `divideScalar(matrix, scalar, out?)`

### Static Numeric Transforms
- [ ] `floor(matrix, out?)`
- [ ] `ceil(matrix, out?)`
- [ ] `round(matrix, out?)`
- [ ] `abs(matrix, out?)`
- [ ] `sign(matrix, out?)`
- [ ] `min(a, b, out?)`
- [ ] `max(a, b, out?)`
- [ ] `clamp(matrix, minM, maxM, out?)`
- [ ] `clampScalar(matrix, min, max, out?)`

### Static Interpolation
- [ ] `lerpUnclamped(a, b, t, out?)`
- [ ] `smoothStep(a, b, t, out?)`

### Static Comparison & Validation
- [ ] `isZero(matrix)`
- [ ] `nearZero(matrix, epsilon?)`
- [ ] `isFinite(matrix)`
- [ ] `hasNaN(matrix)`
- [ ] `isSymmetric(matrix, epsilon?)`
- [ ] `isSkewSymmetric(matrix, epsilon?)`
- [ ] `isDiagonal(matrix, epsilon?)`
- [ ] `isSingular(matrix, epsilon?)`

### Static Matrix Operations
- [ ] `adjugate(matrix, out?)`
- [ ] `inverseSafe(matrix, out?)`
- [ ] `inverseUnchecked(matrix, out?)`
- [ ] `trace(matrix)` (suma diagonal)
- [ ] `frobeniusNorm(matrix)`

### Instance Methods - Simetría Corregida
- [ ] `multiply(other)` → retorna `this`, sin `out`
- [ ] `add(other)` → retorna `this`, sin `out`
- [ ] `subtract(other)` → retorna `this`, sin `out`
- [ ] `scale(scalar)` → retorna `this`, sin `out`
- [ ] `transpose()` → retorna `this`, sin `out`
- [ ] `inverse()` → retorna `this`, sin `out`
- [ ] `negate()` → retorna `this`, sin `out`
- [ ] `premultiply(other)` → retorna `this`, sin `out`
- [ ] `lerp(other, t)` → retorna `this`, sin `out`
- [ ] `translate(v)` → retorna `this`, sin `out`
- [ ] `rotate(angle)` → retorna `this`, sin `out`
- [ ] `scaleBy(scale)` → retorna `this`, sin `out`

### Instance Arithmetic (Nuevos)
- [ ] `addScalar(scalar): this`
- [ ] `subtractScalar(scalar): this`
- [ ] `multiplyScalar(scalar): this`
- [ ] `divideScalar(scalar): this`

### Instance Numeric Transforms (Nuevos)
- [ ] `floor(): this`
- [ ] `ceil(): this`
- [ ] `round(): this`
- [ ] `abs(): this`
- [ ] `sign(): this`
- [ ] `min(other): this`
- [ ] `max(other): this`
- [ ] `clamp(minM, maxM): this`
- [ ] `clampScalar(min, max): this`

### Instance Computed Values
- [ ] `frobeniusNorm(): number`
- [ ] `trace(): number`

### Instance Matrix Operations (Nuevos)
- [ ] `adjugate(): this`
- [ ] `inverseSafe(): this`
- [ ] `inverseUnchecked(): this`

### Instance Comparison (Nuevos)
- [ ] `isZero(): boolean`
- [ ] `nearZero(epsilon?): boolean`
- [ ] `isFinite(): boolean`
- [ ] `hasNaN(): boolean`
- [ ] `isSymmetric(epsilon?): boolean`
- [ ] `isSkewSymmetric(epsilon?): boolean`
- [ ] `isDiagonal(epsilon?): boolean`
- [ ] `isSingular(epsilon?): boolean`
- [ ] `isOrthogonal(epsilon?): boolean`

### Instance Interpolation (Nuevos)
- [ ] `lerpUnclamped(other, t): this`
- [ ] `smoothStep(other, t): this`

### Instance Getters
- [ ] `column0: [number, number, number]`
- [ ] `column1: [number, number, number]`
- [ ] `column2: [number, number, number]`
- [ ] `row0: [number, number, number]`
- [ ] `row1: [number, number, number]`
- [ ] `row2: [number, number, number]`

### Instance Conversion
- [ ] `toFloat32Array(out?, offset?, columnMajor?): Float32Array`

---

## 15. Referencias

### Librerías Matemáticas (Álgebra Lineal)
1. **Matrix2 (referencia interna):** `packages/math2d/src/core/matrix2.ts`
2. **Vector2 (referencia interna):** `packages/math2d/src/core/vector2.ts`
3. **glMatrix mat3:** https://glmatrix.net/docs/module-mat3.html
4. **Three.js Matrix3:** https://threejs.org/docs/#api/en/math/Matrix3

### Literatura Matemática
5. **"Matrices 3×3 for 2D Transformations"** - Transformaciones afines homogéneas
6. **Norma de Frobenius:** √(Σ|aᵢⱼ|²) - Generalización de la norma euclidiana

### Nota sobre Motores de Física
> Box2D, Rapier2D y otros motores de física construyen sus transformaciones
> sobre operaciones matemáticas básicas como las que proporciona este módulo.
> Este paquete NO implementa física directamente, sino las herramientas
> matemáticas que sirven como base.

---

## 16. Notas de Implementación

### Filosofía: Matemáticas Puras

Este módulo implementa **álgebra lineal 2D** y **transformaciones afines**. Los métodos
son operaciones matemáticas fundamentales, no abstracciones de física o geometría:

| Operación | Naturaleza | Justificación |
|-----------|------------|---------------|
| `multiply` | Álgebra lineal | Producto matricial estándar |
| `inverse` | Álgebra lineal | Inversa de matriz |
| `transpose` | Álgebra lineal | Transpuesta |
| `determinant` | Álgebra lineal | Determinante |
| `trace` | Álgebra lineal | Suma de diagonal |
| `frobeniusNorm` | Álgebra lineal | Norma matricial |
| `translate/rotate/scaleBy` | Geometría afín | Composición de transformaciones |
| `transformPoint/Vector` | Geometría afín | Aplicar transformación |
| `decompose` | Geometría afín | Factorización SVD simplificada |

### Consideraciones Específicas

1. **Columnas/Filas como arrays vs Vector3:**
   - Matrix2 usa `Vector2` para columnas/filas
   - Matrix3 usa tuplas `[number, number, number]`
   - Razón: Evita crear un Vector3 que sería exclusivo de Matrix3

2. **Transformaciones afines 2D:**
   - `translate`, `rotate`, `scaleBy` son composiciones de matrices
   - Matemáticamente: M' = M × T donde T es la matriz de transformación
   - NO son "físicas", son operaciones algebraicas sobre el espacio afín

3. **Batch operations:**
   - `transformPoints`, `transformVectors` aplican la transformación a múltiples vectores
   - Optimización matemática, no específica de dominio

4. **Conversión Matrix2 ↔ Matrix3:**
   - `fromMatrix2`: Embebe la parte lineal 2×2 en una matriz afín 3×3
   - `toMatrix2`: Extrae la parte lineal (ignora translación)
   - Relación matemática bien definida

---

## 17. Análisis de Uso de Módulos Auxiliares, Validation y Deterministic

### 17.1 Imports Actuales en Matrix3

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

### 17.2 Imports en Matrix2 (referencia)

```typescript
import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import {
  abs as scalarAbs,
  clamp,
  max as scalarMax,
  min as scalarMin,
  saturate,
  sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';
import { DeterministicMath } from '../deterministic/deterministic-math';
import { assertFinite, assertSafeInteger } from '../validation/assert';
```

### 17.3 Imports Faltantes en Matrix3

Para implementar los métodos faltantes, Matrix3 necesita importar:

```typescript
// De scalar/arithmetic (actualmente solo importa saturate)
import {
  abs as scalarAbs,
  clamp,
  max as scalarMax,
  min as scalarMin,
  saturate,
  sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';

// De scalar/interpolation (para smoothStep)
import { lerp, smoothStep as scalarSmoothStep } from '../auxiliary/scalar/interpolation';
```

### 17.4 Módulos Disponibles No Utilizados

| Módulo | Función | Uso Potencial en Matrix3 |
|--------|---------|--------------------------|
| `scalar/arithmetic.clamp` | Clamping | `clamp()`, `clampScalar()` |
| `scalar/arithmetic.abs` | Valor absoluto | `abs()` |
| `scalar/arithmetic.sign` | Signo | `sign()` |
| `scalar/arithmetic.min` | Mínimo | `min()` |
| `scalar/arithmetic.max` | Máximo | `max()` |
| `scalar/interpolation.smoothStep` | Interpolación suave | `smoothStep()` |

---

## 17.5 Análisis de Uso de `validation/assert`

### Funciones Disponibles en validation/assert

| Función | Descripción | Matrix3 Uso Actual | Matrix2 Uso |
|---------|-------------|-------------------|-------------|
| `assertFinite` | Valida número finito | ✅ En `sanitize()` | ✅ En `sanitize()` |
| `assertSafeInteger` | Valida entero seguro | ✅ En `getColumn/Row` | ✅ En `getColumn/Row` |
| `assertNonZero` | Valida no-cero | ❌ | ❌ |
| `assertRange` | Valida rango | ❌ | ❌ |
| `assertPositive` | Valida > 0 | ❌ | ❌ |
| `assertNonNegative` | Valida >= 0 | ❌ | ❌ |
| `assert` | Aserción genérica | ❌ | ❌ |
| `assertVector2` | Valida Vector2 | ❌ | ❌ |
| `assertMatrix2` | Valida Matrix2 | ❌ | ❌ |
| `assertRotation2` | Valida Rotation2 | ❌ | ❌ |

### Oportunidades de Mejora

#### 17.5.1 Añadir `assertMatrix3` al módulo validation

```typescript
// En validation/assert.ts - AÑADIR:
/**
 * Asserts that Matrix3-like components are finite.
 */
export function assertMatrix3(
  m00: number, m01: number, m02: number,
  m10: number, m11: number, m12: number,
  m20: number, m21: number, m22: number,
  name?: string,
): void {
  if (!assertionsEnabled) return;
  const prefix = name ?? 'matrix';
  const elements = [
    [m00, '0,0'], [m01, '0,1'], [m02, '0,2'],
    [m10, '1,0'], [m11, '1,1'], [m12, '1,2'],
    [m20, '2,0'], [m21, '2,1'], [m22, '2,2'],
  ] as const;
  
  for (const [value, pos] of elements) {
    if (!Number.isFinite(value)) {
      throw new Error(`[math2d] ${prefix}[${pos}] must be finite, got ${value}`);
    }
  }
}
```

#### 17.5.2 Uso en Matrix3 factory methods

```typescript
// Patrón actual (correcto):
private static sanitize(value: number, label: string): number {
  assertFinite(value, label);
  return value;
}

// Uso en fromArray:
static fromArray(array: ArrayLike<number>, offset = 0, columnMajor = true, out?: Matrix3): Matrix3 {
  // ... validación de bounds ...
  const values = new Array<number>(9);
  for (let index = 0; index < 9; index++) {
    values[index] = Matrix3.sanitize(array[offset + index]!, `Matrix3.fromArray:${offset + index}`);
  }
  // ...
}
```

**Estado:** ✅ Matrix3 ya usa validation correctamente, similar a Matrix2

---

## 17.6 Análisis de Uso de `deterministic`

### Funciones Disponibles en deterministic

| Clase/Función | Descripción | Matrix3 | Matrix2 | Vector2 |
|---------------|-------------|---------|---------|---------|
| `DeterministicMath.sin(x)` | Seno determinístico | ❌ | ❌ | ✅ (slerp) |
| `DeterministicMath.cos(x)` | Coseno determinístico | ❌ | ❌ | ❌ |
| `DeterministicMath.sqrt(x)` | Raíz determinística | ❌ | ❌ | ❌ |
| `DeterministicMath.atan2(y,x)` | Arcotangente determinística | ✅ | ✅ | ✅ |
| `PrecisionMath.kahanSum` | Suma compensada | ❌ | ❌ | ❌ |
| `PrecisionMath.twoSum` | Two-sum exacto | ❌ | ❌ | ❌ |
| `PrecisionMath.dotProduct` | Producto punto compensado | ❌ | ❌ | ❌ |

### 17.6.1 Uso Actual de DeterministicMath en Matrix3

```typescript
// getRotation() - línea 564:
return DeterministicMath.atan2(this.m01 / scaleX, this.m00 / scaleX);

// decompose() - línea 484:
const rotation = isNearZero(sx) ? 0 : DeterministicMath.atan2(matrix.m01 / sx, matrix.m00 / sx);
```

**Análisis:** 
- ✅ Usa `atan2` determinístico para extraer rotación
- ⚠️ NO usa `sinCos` de auxiliary/angle (que internamente usa DeterministicMath)
- Matrix3 delega trig a `sinCos()` que es el patrón correcto

### 17.6.2 Comparación con Matrix2

```typescript
// Matrix2.getRotation() - línea 1143:
return DeterministicMath.atan2(this.m01, this.m00);

// Matrix2.decompose() - línea 913:
const rotation = DeterministicMath.atan2(matrix.m01, matrix.m00);
```

**Diferencia crítica:**
- Matrix2 usa `atan2(m01, m00)` directamente
- Matrix3 divide por scale primero: `atan2(m01/sx, m00/sx)`
- Ambos son correctos según su estructura

### 17.6.3 Oportunidades con PrecisionMath

**Para operaciones de alta precisión (futuro):**

```typescript
// Uso potencial en frobeniusNorm para sumas largas:
import { PrecisionMath } from '../deterministic/precision-math';

frobeniusNorm(): number {
  // Versión simple actual:
  return safeSqrt(
    this.m00*this.m00 + this.m01*this.m01 + this.m02*this.m02 +
    this.m10*this.m10 + this.m11*this.m11 + this.m12*this.m12 +
    this.m20*this.m20 + this.m21*this.m21 + this.m22*this.m22
  );
  
  // Versión con Kahan (mayor precisión):
  return safeSqrt(PrecisionMath.kahanSum([
    this.m00*this.m00, this.m01*this.m01, this.m02*this.m02,
    this.m10*this.m10, this.m11*this.m11, this.m12*this.m12,
    this.m20*this.m20, this.m21*this.m21, this.m22*this.m22,
  ]));
}
```

**Decisión:** Por ahora, mantener la versión simple. La suma de 9 elementos
no es suficientemente grande para justificar Kahan compensation.
PrecisionMath es más útil para sumas de miles de elementos.

### 17.6.4 Tabla Resumen validation + deterministic

| Módulo | Estado en Matrix3 | Acción |
|--------|-------------------|--------|
| `assertFinite` | ✅ Usado en sanitize | Ninguna |
| `assertSafeInteger` | ✅ Usado en getColumn/Row | Ninguna |
| `assertMatrix3` | ❌ No existe | Añadir a validation/assert.ts |
| `DeterministicMath.atan2` | ✅ Usado en getRotation/decompose | Ninguna |
| `sinCos` (via auxiliary) | ✅ Usado en fromRotation, rotate | Ninguna |
| `safeSqrt` | ✅ Usado en getScale, decompose | Ninguna |
| `PrecisionMath` | ❌ No usado | Opcional para frobeniusNorm |

---

## 17.7 Análisis Exhaustivo de `auxiliary/`

### 17.7.1 Estructura de Auxiliary

```
auxiliary/
├── angle/
│   ├── conversion.ts    # deg↔rad, turns, gradians
│   ├── normalization.ts # normalizeRadians, wrapAngle
│   ├── operations.ts    # sinCos, angleDifference
│   ├── interpolation.ts # lerpAngle, slerpAngle
│   └── unwrapping.ts
├── numeric/
│   ├── safety.ts        # safeDivide, safeSqrt, safeAcos
│   ├── guards.ts        # isFinite, isNaN, isDenormal
│   ├── rounding.ts      # roundToPlaces, snapToGrid
│   └── wrapping.ts
└── scalar/
    ├── arithmetic.ts    # clamp, abs, sign, min, max, saturate
    ├── comparison.ts    # nearEquals, isNearZero
    ├── constants.ts     # EPSILON, PI, TAU
    └── interpolation.ts # lerp, smoothStep
```

### 17.7.2 Uso Actual en Matrix3

| Módulo | Función | Uso en Matrix3 | Líneas |
|--------|---------|----------------|--------|
| `angle/operations` | `sinCos` | ✅ `fromRotation`, `rotate` | L131, L867 |
| `numeric/safety` | `safeDivide` | ✅ `inverse`, `transformPoint` | L321, L349 |
| `numeric/safety` | `safeSqrt` | ✅ `getScale`, `decompose` | L478, L553 |
| `scalar/arithmetic` | `saturate` | ✅ `lerp` | L398 |
| `scalar/comparison` | `isNearZero` | ✅ Multiple | L317, L342, etc. |
| `scalar/comparison` | `nearEquals` | ✅ `equals`, `isIdentity` | L419-430 |
| `scalar/constants` | `EPSILON` | ✅ Default tolerance | L11 |
| `scalar/interpolation` | `lerp` | ✅ `lerp` | L400-408 |

### 17.7.3 Funciones de Auxiliary NO Utilizadas en Matrix3

| Módulo | Función | ¿Necesaria? | Para qué método |
|--------|---------|-------------|-----------------|
| `scalar/arithmetic.abs` | Valor absoluto | ✅ Sí | `abs()` |
| `scalar/arithmetic.sign` | Signo | ✅ Sí | `sign()` |
| `scalar/arithmetic.clamp` | Clamping | ✅ Sí | `clamp()`, `clampScalar()` |
| `scalar/arithmetic.min` | Mínimo | ✅ Sí | `min()` |
| `scalar/arithmetic.max` | Máximo | ✅ Sí | `max()` |
| `scalar/interpolation.smoothStep` | Smooth interpolation | ✅ Sí | `smoothStep()` |
| `numeric/rounding.roundToPlaces` | Redondeo precisión | ⚠️ Opcional | `toString()` |
| `numeric/guards.isNaN` | Validación | ✅ Sí | `hasNaN()` |
| `numeric/guards.isFinite` | Validación | ✅ Sí | `isFinite()` |

### 17.7.4 Imports Propuestos para Matrix3

```typescript
// Actuales (mantener):
import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';

// Añadir para nuevos métodos:
import {
  abs as scalarAbs,
  clamp,
  max as scalarMax,
  min as scalarMin,
  sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';
import { smoothStep as scalarSmoothStep } from '../auxiliary/scalar/interpolation';
```

---

## 17.8 Análisis Exhaustivo de `utils/`

### 17.8.1 Estructura de Utils

```
utils/
├── parse.ts          # parseMatrix3, formatMatrix3 ✅
├── random.ts         # randomVector2, randomRotation2, etc.
├── random-source.ts  # SeededRandomSource
└── performance.ts    # measure, MeasurementCollector
```

### 17.8.2 utils/parse.ts - Estado con Matrix3

| Función | Existe | Estado |
|---------|--------|--------|
| `parseMatrix3(string, out?)` | ✅ | Completo |
| `formatMatrix3(matrix, options?)` | ✅ | Completo |

**Verificación:**
```typescript
// Ya existe en parse.ts:
export function parseMatrix3(string_: string, out = new Matrix3()): Matrix3
export function formatMatrix3(matrix: Matrix3, options?: FormatOptions): string
```

✅ **COMPLETO** - No requiere cambios

### 17.8.3 utils/random.ts - Estado con Matrix3

| Función | Existe | ¿Necesaria? |
|---------|--------|-------------|
| `randomVector2` | ✅ | - |
| `randomUnitVector2` | ✅ | - |
| `randomRotation2` | ✅ | - |
| `randomRotationMatrix2` | ✅ | Retorna Matrix2 |
| `randomTransform2` | ✅ | - |
| `randomMatrix3` | ❌ | ⚠️ Añadir |
| `randomAffineMatrix3` | ❌ | ⚠️ Añadir |

**Funciones propuestas:**

```typescript
// Añadir a random.ts:

/**
 * Creates a random Matrix3 with elements in [-range, range].
 * @param range - Maximum absolute value for each element
 * @param source - Optional random source (default: Math.random)
 * @param out - Optional output matrix
 * @returns Random Matrix3
 */
export function randomMatrix3(
  range = 1,
  source: RandomSource = getDefaultRandomSource(),
  out = new Matrix3(),
): Matrix3 {
  return out.set(
    (source.next() * 2 - 1) * range, // m00
    (source.next() * 2 - 1) * range, // m01
    (source.next() * 2 - 1) * range, // m02
    (source.next() * 2 - 1) * range, // m10
    (source.next() * 2 - 1) * range, // m11
    (source.next() * 2 - 1) * range, // m12
    (source.next() * 2 - 1) * range, // m20
    (source.next() * 2 - 1) * range, // m21
    (source.next() * 2 - 1) * range, // m22
  );
}

/**
 * Creates a random affine transformation Matrix3.
 * @param translationRange - Maximum translation
 * @param scaleRange - Scale range [1/scaleRange, scaleRange]
 * @param source - Optional random source
 * @param out - Optional output matrix
 * @returns Random affine Matrix3
 */
export function randomAffineMatrix3(
  translationRange = 100,
  scaleRange = 2,
  source: RandomSource = getDefaultRandomSource(),
  out = new Matrix3(),
): Matrix3 {
  const tx = (source.next() * 2 - 1) * translationRange;
  const ty = (source.next() * 2 - 1) * translationRange;
  const angle = source.next() * TAU;
  const sx = 1 / scaleRange + source.next() * (scaleRange - 1 / scaleRange);
  const sy = 1 / scaleRange + source.next() * (scaleRange - 1 / scaleRange);
  
  return Matrix3.fromTransform({ x: tx, y: ty }, angle, { x: sx, y: sy }, out);
}
```

### 17.8.4 utils/performance.ts - Uso con Matrix3

| Función | Relevancia para Matrix3 |
|---------|------------------------|
| `measure()` | ✅ Benchmarking de operaciones |
| `MeasurementCollector` | ✅ Comparar Matrix3 vs Matrix2 |

**Uso típico (no requiere cambios en Matrix3):**

```typescript
import { measure } from '@lenguados/math2d/utils/performance';

const { result, stats } = measure('Matrix3.inverse', () => {
  return Matrix3.inverse(matrix);
});
```

### 17.8.5 utils/random-source.ts - Uso con Matrix3

| Clase/Función | Relevancia |
|---------------|------------|
| `SeededRandomSource` | ✅ Tests determinísticos |
| `setDefaultRandomSource` | ✅ Control global |

**Uso típico:**

```typescript
import { SeededRandomSource, setDefaultRandomSource } from '@lenguados/math2d/utils/random-source';

// Para tests reproducibles:
setDefaultRandomSource(new SeededRandomSource(12345));
const m = randomMatrix3(); // Siempre el mismo
```

---

## 17.10 Contraste Detallado: Vector2 vs Matrix2 vs Matrix3 (Patrones de Diseño)

### 17.10.1 Tríada Safe/Throwing/Unchecked

| Patrón | Vector2 | Matrix2 | Matrix3 | Acción |
|--------|---------|---------|---------|--------|
| **inverse** (throw) | ✅ `inverse()` | ✅ `inverse()` | ✅ `inverse()` | ✓ |
| **inverseSafe** | ✅ `inverseSafe()` | ✅ `inverseSafe()` | ❌ Falta | ⚠️ Añadir |
| **inverseUnchecked** | N/A | ✅ `inverseUnchecked()` | ❌ Falta | ⚠️ Añadir |
| **normalize** (throw) | ✅ Static + Instance | N/A | N/A | N/A |
| **normalizeSafe** | ✅ Static + Instance | N/A | N/A | N/A |
| **normalizeUnchecked** | ✅ Instance | N/A | N/A | N/A |
| **divideScalar** (safe) | ✅ Static + Instance | ✅ Static + Instance | ❌ Falta | ⚠️ Añadir |
| **divideScalarSafe** | ✅ Instance | N/A | N/A | N/A |
| **divideScalarUnchecked** | ✅ Instance | N/A | N/A | N/A |

**Filosofía:**
```
┌─────────────────────────────────────────────────────────────────┐
│ throwing() → Valida, lanza excepción si inválido               │
│ *Safe()    → Valida, devuelve valor fallback si inválido       │
│ *Unchecked()→ NO valida, máximo rendimiento, UB si inválido    │
└─────────────────────────────────────────────────────────────────┘
```

**Código propuesto para Matrix3:**

```typescript
// Static
static inverseSafe(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const det = Matrix3.determinant(matrix);
  if (isNearZero(det)) {
    return Matrix3.ensureOut(out).identity(); // Fallback: identity
  }
  return Matrix3.inverseUnchecked(matrix, out);
}

static inverseUnchecked(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  // Sin validación - asumir det ≠ 0
  const invDet = 1 / Matrix3.determinant(matrix);
  // ... cálculo directo
}

// Instance
inverseSafe(): this {
  const det = this.determinant();
  if (isNearZero(det)) {
    return this.identity();
  }
  return this.inverseUnchecked();
}

inverseUnchecked(): this {
  // Sin validación - asumir det ≠ 0
  const invDet = 1 / this.determinant();
  // ... cálculo directo
}
```

### 17.10.2 Valores por Defecto para Tolerancias

| Módulo | Patrón | Ejemplo |
|--------|--------|---------|
| **Vector2** | `epsilon = EPSILON` | `nearEquals(v, epsilon = EPSILON)` |
| **Vector2** | `epsilon = 0` (exacto) | `isZero(epsilon = 0)` |
| **Matrix2** | `epsilon: number = EPSILON` | `equals(a, b, epsilon: number = EPSILON)` |
| **Matrix3** | `epsilon: number = EPSILON` | ✅ Ya correcto |

**Consistencia requerida en Matrix3:**
- ✅ `equals(a, b, epsilon = EPSILON)` - Ya correcto
- ✅ `isIdentity(matrix, epsilon = EPSILON)` - Ya correcto
- ⚠️ Falta: `nearZero`, `isSymmetric`, `isDiagonal`, `isSingular`

### 17.10.3 Simetría Static vs Instance

| Operación | Vector2 | Matrix2 | Matrix3 |
|-----------|---------|---------|---------|
| **Static con out?** | ✅ `add(a, b, out?)` | ✅ `add(a, b, out?)` | ✅ Ya tiene |
| **Instance muta this** | ✅ `add(v): this` | ✅ `add(m): this` | ❌ Tiene `out?` |
| **Static sin out (puro)** | ✅ `dot(a, b): number` | ✅ `determinant(m): number` | ✅ `determinant()` |
| **Instance retorna valor** | ✅ `dot(v): number` | ✅ `determinant(): number` | ✅ `determinant()` |

**Problema crítico en Matrix3:**
```typescript
// ❌ INCORRECTO (actual):
multiply(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  // Debería mutar this, no aceptar out
}

// ✅ CORRECTO (propuesto):
multiply(other: ReadonlyMatrix3Like): this {
  // ... mutar this, retornar this
}
```

### 17.10.4 Sobrecarga de Constructor

| Patrón | Vector2 | Matrix2 | Matrix3 | Acción |
|--------|---------|---------|---------|--------|
| Sin args → Identity/Zero | ✅ `()` → `(0,0)` | ✅ `()` → Identity | ❌ Solo args explícitos | ⚠️ Añadir |
| Componentes explícitos | ✅ `(x, y)` | ✅ `(m00, m01, m10, m11)` | ✅ Ya tiene | ✓ |
| Desde array | ✅ `([x, y])` | ✅ `([m00,...])` | ❌ Falta | ⚠️ Añadir |
| Desde object | ✅ `({x, y})` | ✅ `({m00,...})` | ❌ Falta | ⚠️ Añadir |

**Código propuesto:**
```typescript
constructor(
  m00OrSource?: number | [number,...] | ReadonlyMatrix3Like,
  m01?: number, m02?: number,
  m10?: number, m11?: number, m12?: number,
  m20?: number, m21?: number, m22?: number,
) {
  if (m00OrSource === undefined) {
    // Identity
    this.m00 = 1; this.m01 = 0; this.m02 = 0;
    this.m10 = 0; this.m11 = 1; this.m12 = 0;
    this.m20 = 0; this.m21 = 0; this.m22 = 1;
  } else if (typeof m00OrSource === 'number') {
    // Componentes explícitos
  } else if (Array.isArray(m00OrSource)) {
    // Desde array
  } else if (typeof m00OrSource === 'object' && 'm00' in m00OrSource) {
    // Desde object
  } else {
    throw new TypeError('Matrix3: invalid constructor arguments');
  }
}
```

### 17.10.5 Hot Paths: Cuándo Evitar Validaciones

| Situación | Estrategia | Ejemplo |
|-----------|------------|---------|
| Bucle interno con miles de operaciones | `*Unchecked()` | `inverseUnchecked()` |
| API pública de usuario | throwing o `*Safe()` | `inverse()` o `inverseSafe()` |
| Parámetro índice de array | `assertSafeInteger` solo en dev | `getColumn(index)` |
| Constructor desde datos internos | Sin validación | `fromArray(internal, 0)` |

**Patrón Box2D para assertions:**
```typescript
// Solo se ejecuta en modo desarrollo
getColumn(index: number, out?: Vector3): Vector3 {
  assertSafeInteger(index, 'Matrix3.getColumn:index'); // Dev-only
  if (index === 0) return Vector3.fromValues(this.m00, this.m01, this.m02, out);
  // ...
  throw new RangeError(`Matrix3.getColumn: index must be 0, 1, or 2`);
}
```

### 17.10.6 Getters Inmutables (Propiedades Derivadas)

| Getter | Vector2 | Matrix2 | Matrix3 | Acción |
|--------|---------|---------|---------|--------|
| `normalized` | ✅ | N/A | N/A | N/A |
| `negated` | ✅ | ✅ | ❌ Falta | ⚠️ Añadir |
| `absolute` | ✅ | N/A | N/A | N/A |
| `transposed` | N/A | ✅ | ❌ Falta | ⚠️ Añadir |
| `inverted` | N/A | ✅ | ❌ Falta | ⚠️ Añadir |
| `column0/1/2` | N/A | ✅ `column0/1` | ❌ Falta | ⚠️ Añadir |
| `row0/1/2` | N/A | ✅ `row0/1` | ❌ Falta | ⚠️ Añadir |
| `diagonal` | N/A | ✅ | ❌ Falta | ⚠️ Añadir |

**Código propuesto:**
```typescript
public get transposed(): Matrix3 {
  return new Matrix3(
    this.m00, this.m10, this.m20,
    this.m01, this.m11, this.m21,
    this.m02, this.m12, this.m22,
  );
}

public get negated(): Matrix3 {
  return new Matrix3(
    -this.m00, -this.m01, -this.m02,
    -this.m10, -this.m11, -this.m12,
    -this.m20, -this.m21, -this.m22,
  );
}

public get inverted(): Matrix3 {
  const det = this.determinant();
  if (isNearZero(det)) {
    return new Matrix3(); // Identity fallback
  }
  // ... cálculo
}

public get column0(): Vector3 {
  return new Vector3(this.m00, this.m01, this.m02);
}
// ... column1, column2, row0, row1, row2
```

### 17.10.7 Constantes Frozen

| Constante | Vector2 | Matrix2 | Matrix3 | Acción |
|-----------|---------|---------|---------|--------|
| `ZERO` | ✅ frozen | ✅ frozen | ❌ `Object.freeze` directo | ⚠️ Usar helper |
| `IDENTITY` | N/A | ✅ frozen | ❌ `Object.freeze` directo | ⚠️ Usar helper |
| `ONE` | ✅ frozen | ✅ frozen | ❌ Falta | ⚠️ Añadir |
| `EPSILON_MATRIX` | ✅ frozen | ✅ frozen | ❌ Falta | ⚠️ Añadir |

**Helper propuesto:**
```typescript
export function freezeMatrix3(matrix: Matrix3): ReadonlyMatrix3 {
  return Object.freeze(matrix);
}

// Uso:
public static readonly IDENTITY = freezeMatrix3(new Matrix3());
public static readonly ZERO = freezeMatrix3(new Matrix3(0,0,0,0,0,0,0,0,0));
```

### 17.10.8 Resumen de Brechas Críticas en Matrix3

| Categoría | Faltante | Prioridad |
|-----------|----------|-----------|
| Tríada inversión | `inverseSafe`, `inverseUnchecked` | 🔴 Alta |
| Constructor | Sobrecargas array/object | 🔴 Alta |
| Simetría métodos | Instance sin `out?`, retornar `this` | 🔴 Alta |
| Getters inmutables | `transposed`, `negated`, `inverted` | 🟡 Media |
| Getters column/row | `column0/1/2`, `row0/1/2`, `diagonal` | 🟡 Media |
| Helper freeze | `freezeMatrix3()` | 🟡 Media |
| Constantes | `ONE`, `EPSILON_MATRIX` | 🟢 Baja |
| Validación | `isSymmetric`, `isDiagonal`, `nearZero` | 🟡 Media |

---

## 17.11 Tabla Resumen de Sinergia con Todos los Módulos

| Módulo | Categoría | Estado Matrix3 | Acción |
|--------|-----------|---------------|--------|
| **validation/assert** | Validación | ✅ Usa `assertFinite`, `assertSafeInteger` | Añadir `assertMatrix3` |
| **deterministic/deterministic-math** | Determinismo | ✅ Usa `atan2` | Ninguna |
| **deterministic/precision-math** | Precisión | ❌ No usado | Opcional para `frobeniusNorm` |
| **auxiliary/angle** | Ángulos | ✅ Usa `sinCos` | Ninguna |
| **auxiliary/numeric** | Safety | ✅ Usa `safeDivide`, `safeSqrt` | Ninguna |
| **auxiliary/scalar** | Aritmética | ⚠️ Parcial | Añadir `abs`, `sign`, `clamp`, `min`, `max` |
| **utils/parse** | Serialización | ✅ Tiene `parseMatrix3`, `formatMatrix3` | Ninguna |
| **utils/random** | Generación | ❌ Falta | Añadir `randomMatrix3`, `randomAffineMatrix3` |
| **utils/performance** | Benchmark | ✅ Disponible | Ninguna |
| **utils/random-source** | Seeds | ✅ Disponible | Ninguna |
| **types** | Interfaces | ✅ Tiene `Matrix3Like`, `isMatrix3Like` | Ninguna |

---

## 18. Análisis Método por Método

### 18.1 Constructor

**Matrix3 Actual (L37-47):**
```typescript
constructor(m00 = 1, m01 = 0, m02 = 0, m10 = 0, m11 = 1, m12 = 0, m20 = 0, m21 = 0, m22 = 1) {
  this.m00 = m00;
  // ...
}
```

**Problemas:**
1. ❌ Ubicación: Constructor antes de static members (Matrix2 lo tiene después)
2. ❌ Sin overloads para array/object
3. ❌ Sin JSDoc para cada overload
4. ❌ Sin validación de argumentos

**Corrección Propuesta:**
```typescript
/** Creates identity matrix. */
constructor();
/** Creates from 9 components (column-major). */
constructor(m00: number, m01: number, m02: number, m10: number, m11: number, m12: number, m20: number, m21: number, m22: number);
/** Creates from 9-element array. */
constructor(array: [number, number, number, number, number, number, number, number, number]);
/** Creates from plain object. */
constructor(object: ReadonlyMatrix3Like);

constructor(
  m00OrSource?: number | ArrayLike<number> | ReadonlyMatrix3Like,
  m01?: number,
  m02?: number,
  m10?: number,
  m11?: number,
  m12?: number,
  m20?: number,
  m21?: number,
  m22?: number,
) {
  if (m00OrSource === undefined) {
    // Identity
    this.m00 = 1; this.m01 = 0; this.m02 = 0;
    this.m10 = 0; this.m11 = 1; this.m12 = 0;
    this.m20 = 0; this.m21 = 0; this.m22 = 1;
  } else if (typeof m00OrSource === 'number') {
    this.m00 = m00OrSource;
    this.m01 = m01 ?? 0;
    // ...
  } else if (Array.isArray(m00OrSource) || ArrayBuffer.isView(m00OrSource)) {
    if (m00OrSource.length < 9) {
      throw new RangeError('Matrix3: array must have at least 9 elements');
    }
    this.m00 = m00OrSource[0]!;
    // ...
  } else if (typeof m00OrSource === 'object' && 'm00' in m00OrSource) {
    this.m00 = m00OrSource.m00;
    // ...
  } else {
    throw new TypeError('Matrix3: invalid constructor arguments');
  }
}
```

---

### 18.2 Private Helpers

**Matrix3 Actual (L53-60):**
```typescript
private static ensureOut(out?: Matrix3): Matrix3 {
  return out ?? new Matrix3();
}

private static sanitize(value: number, label: string): number {
  assertFinite(value, label);
  return value;
}
```

**Comparación con Matrix2:**
- ✅ `ensureOut` - Idéntico
- ✅ `sanitize` - Idéntico (Matrix2 lo llama `sanitizeComponent`, pero la funcionalidad es igual)

**Mejora:** Renombrar a `sanitizeComponent` para consistencia con Matrix2.

---

### 18.3 Static Constants

**Matrix3 Actual (L66-91):**
```typescript
static readonly IDENTITY = Object.freeze(new Matrix3()) as ReadonlyMatrix3;
static readonly ZERO = Object.freeze(new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0)) as ReadonlyMatrix3;
static readonly FLIP_X = Object.freeze(new Matrix3(-1, 0, 0, 0, 1, 0, 0, 0, 1)) as ReadonlyMatrix3;
// ...
```

**Problemas:**
1. ❌ No usa helper `freezeMatrix3`
2. ❌ Falta `public` keyword (Matrix2 lo tiene)
3. ❌ Faltan constantes: `ONE`, `EPSILON_MATRIX`, `FLIP_XY`, `SCALE_2`, `SCALE_HALF`

**Corrección Propuesta:**
```typescript
public static readonly IDENTITY = freezeMatrix3(new Matrix3());
public static readonly ZERO = freezeMatrix3(new Matrix3(0, 0, 0, 0, 0, 0, 0, 0, 0));
public static readonly ONE = freezeMatrix3(new Matrix3(1, 1, 1, 1, 1, 1, 1, 1, 1));
public static readonly EPSILON_MATRIX = freezeMatrix3(
  new Matrix3(EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON, EPSILON),
);
// ...
```

---

### 18.4 Static fromRotation

**Matrix3 Actual (L130-133):**
```typescript
static fromRotation(angle: number, out?: Matrix3): Matrix3 {
  const { cos, sin } = sinCos(angle);
  return Matrix3.ensureOut(out).set(cos, sin, 0, -sin, cos, 0, 0, 0, 1);
}
```

**Comparación con Matrix2:**
```typescript
static fromRotation(rotation: ReadonlyRotation2 | number, out?: Matrix2): Matrix2 {
  if (typeof rotation === 'number') {
    const { cos, sin } = sinCos(rotation);
    return Matrix2.ensureOut(out).set(cos, sin, -sin, cos);
  }
  return Matrix2.ensureOut(out).set(rotation.cos, rotation.sin, -rotation.sin, rotation.cos);
}
```

**Problema:** Matrix3 solo acepta `number`, Matrix2 acepta `ReadonlyRotation2 | number`.

**Mejora Propuesta:**
```typescript
static fromRotation(rotation: ReadonlyRotation2Like | number, out?: Matrix3): Matrix3 {
  let c: number, s: number;
  if (typeof rotation === 'number') {
    const result = sinCos(rotation);
    c = result.cos;
    s = result.sin;
  } else {
    c = rotation.cos;
    s = rotation.sin;
  }
  return Matrix3.ensureOut(out).set(c, s, 0, -s, c, 0, 0, 0, 1);
}
```

---

### 18.5 Static inverse (L303-333)

**Matrix3 Actual:**
```typescript
static inverse(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  // ... calculates cofactors ...
  const det = matrix.m00 * c00 + matrix.m10 * c01 + matrix.m20 * c02;
  if (isNearZero(det)) {
    throw new Error('Matrix3.inverse: matrix is singular');
  }
  const invDet = safeDivide(1, det);
  // ...
}
```

**Comparación con Matrix2:**
Matrix2 tiene 3 variantes:
- `inverse()` - Lanza excepción si singular
- `inverseSafe()` - Retorna identity si singular  
- `inverseUnchecked()` - No verifica, para hot paths

**Problema:** Matrix3 solo tiene una variante que lanza excepción.

**Corrección Propuesta:** Añadir `inverseSafe` e `inverseUnchecked`:
```typescript
static inverseSafe(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const det = Matrix3.determinant(matrix);
  if (isNearZero(det)) {
    return Matrix3.ensureOut(out).identity(); // Return identity for singular
  }
  return Matrix3.inverseUnchecked(matrix, out);
}

static inverseUnchecked(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  // No check, assumes matrix is invertible
  const c00 = matrix.m11 * matrix.m22 - matrix.m12 * matrix.m21;
  // ... (same calculation without isNearZero check)
}
```

---

### 18.6 Static lerp (L397-410)

**Matrix3 Actual:**
```typescript
static lerp(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, t: number, out?: Matrix3): Matrix3 {
  const clamped = saturate(t);
  return Matrix3.ensureOut(out).set(
    lerp(a.m00, b.m00, clamped),
    // ...
  );
}
```

**Comparación con Matrix2:**
Matrix2 tiene:
- `lerp()` - t clamped a [0,1]
- `lerpUnclamped()` - t sin clamping

**Problema:** Matrix3 solo tiene `lerp` con clamping implícito.

**Nota de Nomenclatura:** En Matrix2, `lerp` clampea y `lerpUnclamped` no lo hace. Esto difiere de algunas librerías donde `lerp` no clampea.

**Corrección:** Añadir `lerpUnclamped`:
```typescript
static lerpUnclamped(
  a: ReadonlyMatrix3Like,
  b: ReadonlyMatrix3Like,
  t: number,
  out?: Matrix3,
): Matrix3 {
  return Matrix3.ensureOut(out).set(
    lerp(a.m00, b.m00, t), // No saturate()
    // ...
  );
}
```

---

### 18.7 Instance multiply (L696-699) - **CRÍTICO**

**Matrix3 Actual:**
```typescript
multiply(other: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  const r = Matrix3.multiply(this, other, out ?? this);
  return out ? r : this;
}
```

**Comparación con Matrix2:**
```typescript
multiply(other: ReadonlyMatrix2Like): this {
  const { m00: a00, m01: a01, m10: a10, m11: a11 } = this;
  const { m00: b00, m01: b01, m10: b10, m11: b11 } = other;
  this.m00 = a00 * b00 + a10 * b01;
  this.m01 = a01 * b00 + a11 * b01;
  this.m10 = a00 * b10 + a10 * b11;
  this.m11 = a01 * b10 + a11 * b11;
  return this;
}
```

**Problemas:**
1. ❌ Acepta `out?` - Viola el patrón de instancia
2. ❌ Retorna `Matrix3` en lugar de `this` - No es chainable con subclases
3. ❌ Implementación indirecta vía static - Menos eficiente

**Corrección Propuesta:**
```typescript
multiply(other: ReadonlyMatrix3Like): this {
  const a00 = this.m00, a01 = this.m01, a02 = this.m02;
  const a10 = this.m10, a11 = this.m11, a12 = this.m12;
  const a20 = this.m20, a21 = this.m21, a22 = this.m22;
  
  this.m00 = a00 * other.m00 + a10 * other.m01 + a20 * other.m02;
  this.m01 = a01 * other.m00 + a11 * other.m01 + a21 * other.m02;
  this.m02 = a02 * other.m00 + a12 * other.m01 + a22 * other.m02;
  this.m10 = a00 * other.m10 + a10 * other.m11 + a20 * other.m12;
  this.m11 = a01 * other.m10 + a11 * other.m11 + a21 * other.m12;
  this.m12 = a02 * other.m10 + a12 * other.m11 + a22 * other.m12;
  this.m20 = a00 * other.m20 + a10 * other.m21 + a20 * other.m22;
  this.m21 = a01 * other.m20 + a11 * other.m21 + a21 * other.m22;
  this.m22 = a02 * other.m20 + a12 * other.m21 + a22 * other.m22;
  return this;
}
```

---

### 18.8 Instance transpose (L728-731) - **CRÍTICO**

**Matrix3 Actual:**
```typescript
transpose(out?: Matrix3): Matrix3 {
  const r = Matrix3.transpose(this, out ?? this);
  return out ? r : this;
}
```

**Comparación con Matrix2:**
```typescript
transpose(): this {
  const temporary = this.m01;
  this.m01 = this.m10;
  this.m10 = temporary;
  return this;
}
```

**Corrección Propuesta:**
```typescript
transpose(): this {
  const t01 = this.m01, t02 = this.m02, t12 = this.m12;
  this.m01 = this.m10;
  this.m02 = this.m20;
  this.m10 = t01;
  this.m12 = this.m21;
  this.m20 = t02;
  this.m21 = t12;
  return this;
}
```

---

### 18.9 Instance lerp (L991-1005) - **CRÍTICO**

**Matrix3 Actual:**
```typescript
lerp(other: ReadonlyMatrix3Like, t: number, out?: Matrix3): Matrix3 {
  const clamped = saturate(t);
  const target = out ?? this;
  return target.set(/* ... */);
}
```

**Comparación con Matrix2:**
```typescript
lerp(other: ReadonlyMatrix2Like, t: number): this {
  const clamped = saturate(t);
  this.m00 = lerp(this.m00, other.m00, clamped);
  // ...
  return this;
}
```

**Corrección Propuesta:**
```typescript
lerp(other: ReadonlyMatrix3Like, t: number): this {
  const clamped = saturate(t);
  this.m00 = lerp(this.m00, other.m00, clamped);
  this.m01 = lerp(this.m01, other.m01, clamped);
  this.m02 = lerp(this.m02, other.m02, clamped);
  this.m10 = lerp(this.m10, other.m10, clamped);
  this.m11 = lerp(this.m11, other.m11, clamped);
  this.m12 = lerp(this.m12, other.m12, clamped);
  this.m20 = lerp(this.m20, other.m20, clamped);
  this.m21 = lerp(this.m21, other.m21, clamped);
  this.m22 = lerp(this.m22, other.m22, clamped);
  return this;
}
```

---

### 18.10 Instance translate/rotate/scaleBy (L855-891)

**Matrix3 Actual:**
```typescript
translate(translation: ReadonlyVector2Like, out?: Matrix3): Matrix3 {
  // ... complex logic ...
  const target = out ?? this;
  return target.set(/* ... */);
}

rotate(angle: number, out?: Matrix3): Matrix3 { /* similar */ }
scaleBy(scale: ReadonlyVector2Like | number, out?: Matrix3): Matrix3 { /* similar */ }
```

**Mismo problema:** Todos aceptan `out?` y retornan `Matrix3`.

**Corrección Propuesta:**
```typescript
translate(translation: ReadonlyVector2Like): this {
  const tx = translation.x;
  const ty = translation.y;
  this.m20 = this.m00 * tx + this.m10 * ty + this.m20;
  this.m21 = this.m01 * tx + this.m11 * ty + this.m21;
  this.m22 = this.m02 * tx + this.m12 * ty + this.m22;
  return this;
}

rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  const a00 = this.m00, a01 = this.m01, a02 = this.m02;
  const a10 = this.m10, a11 = this.m11, a12 = this.m12;
  this.m00 = a00 * cos + a10 * sin;
  this.m01 = a01 * cos + a11 * sin;
  this.m02 = a02 * cos + a12 * sin;
  this.m10 = a00 * -sin + a10 * cos;
  this.m11 = a01 * -sin + a11 * cos;
  this.m12 = a02 * -sin + a12 * cos;
  return this;
}

scaleBy(scale: ReadonlyVector2Like | number): this {
  const sx = typeof scale === 'number' ? scale : scale.x;
  const sy = typeof scale === 'number' ? scale : scale.y;
  this.m00 *= sx; this.m01 *= sx; this.m02 *= sx;
  this.m10 *= sy; this.m11 *= sy; this.m12 *= sy;
  return this;
}
```

---

### 18.11 Instance getColumn/getRow

**Matrix3 Actual (L768-774, L812-818):**
```typescript
getColumn(index: number): [number, number, number] {
  assertSafeInteger(index, 'Matrix3.getColumn:index');
  if (index === 0) return [this.m00, this.m01, this.m02];
  if (index === 1) return [this.m10, this.m11, this.m12];
  if (index === 2) return [this.m20, this.m21, this.m22];
  throw new RangeError(`Matrix3.getColumn: index must be 0, 1, or 2, got ${index}`);
}
```

**Comparación con Matrix2:**
```typescript
getColumn(index: number, out?: Vector2): Vector2 {
  assertSafeInteger(index, 'Matrix2.getColumn:index');
  if (index === 0) return Vector2.fromValues(this.m00, this.m01, out);
  if (index === 1) return Vector2.fromValues(this.m10, this.m11, out);
  throw new RangeError(`Matrix2.getColumn: index must be 0 or 1, got ${index}`);
}
```

**Diferencias:**
1. Matrix2 retorna `Vector2`, Matrix3 retorna `[number, number, number]`
2. Matrix2 acepta `out?`, Matrix3 no (correcto para arrays)

**Análisis:** La diferencia tiene sentido porque no tenemos `Vector3` en el paquete.
Sin embargo, podríamos considerar añadir un parámetro `out` para el array:

```typescript
getColumn(index: number, out?: [number, number, number]): [number, number, number] {
  assertSafeInteger(index, 'Matrix3.getColumn:index');
  const result = out ?? [0, 0, 0];
  if (index === 0) {
    result[0] = this.m00; result[1] = this.m01; result[2] = this.m02;
    return result;
  }
  // ...
}
```

---

### 18.12 Métodos Faltantes Detallados

#### 18.12.1 trace() - Faltante

**Referencia Matrix2:**
```typescript
trace(): number {
  return this.m00 + this.m11;
}
```

**Propuesta Matrix3:**
```typescript
trace(): number {
  return this.m00 + this.m11 + this.m22;
}
```

#### 18.12.2 frobeniusNorm() - Faltante

**Referencia Matrix2:**
```typescript
frobeniusNorm(): number {
  return safeSqrt(
    this.m00 * this.m00 + this.m01 * this.m01 +
    this.m10 * this.m10 + this.m11 * this.m11,
  );
}
```

**Propuesta Matrix3:**
```typescript
frobeniusNorm(): number {
  return safeSqrt(
    this.m00 * this.m00 + this.m01 * this.m01 + this.m02 * this.m02 +
    this.m10 * this.m10 + this.m11 * this.m11 + this.m12 * this.m12 +
    this.m20 * this.m20 + this.m21 * this.m21 + this.m22 * this.m22,
  );
}
```

#### 18.12.3 isOrthogonal() - Faltante

**Referencia Matrix2:**
```typescript
isOrthogonal(epsilon: number = EPSILON): boolean {
  // M * M^T = I
  const product = Matrix2.multiply(this, this.transposed);
  return Matrix2.isIdentity(product, epsilon);
}
```

**Propuesta Matrix3:**
```typescript
isOrthogonal(epsilon: number = EPSILON): boolean {
  // M * M^T should equal I for orthogonal matrix
  const product = Matrix3.multiply(this, this.transposed);
  return Matrix3.isIdentity(product, epsilon);
}
```

---

## 19. Análisis Exhaustivo de Interacciones entre Módulos

> Todos los módulos de `math2d` proporcionan operaciones matemáticas fundamentales.
> La sinergia entre ellos refleja relaciones algebraicas naturales.
> Este análisis identifica interacciones actuales, faltantes, y oportunidades DRY/SOLID.

### 19.1 Mapa de Módulos Core

```
┌─────────────────────────────────────────────────────────────────┐
│                        @lenguados/math2d/core                   │
├─────────────┬─────────────┬─────────────┬─────────────┬─────────┤
│   Vector2   │   Matrix2   │   Matrix3   │  Rotation2  │ Complex │
│  (2D point/ │ (2×2 linear │ (3×3 affine │  (cos,sin)  │ (a+bi)  │
│   vector)   │   transform)│  transform) │   rotation  │ number  │
├─────────────┼─────────────┼─────────────┼─────────────┼─────────┤
│             │             │             │             │         │
│  Transform2 │  Interval   │             │             │         │
│  (TRS combo)│  [min,max]  │             │             │         │
└─────────────┴─────────────┴─────────────┴─────────────┴─────────┘
```

### 19.2 Vector2 ↔ Matrix3 (Transformación Lineal)

**Relación Matemática:** Matrix3 representa una transformación afín que actúa sobre Vector2.

**Interacciones Existentes:**
| Método | Dirección | Descripción |
|--------|-----------|-------------|
| `transformPoint(v)` | Matrix3 → Vector2 | Aplica transformación afín completa |
| `transformVector(v)` | Matrix3 → Vector2 | Aplica solo parte lineal (ignora translación) |
| `getTranslation()` | Matrix3 → Vector2 | Extrae componente [m20, m21] |
| `getScale()` | Matrix3 → Vector2 | Extrae magnitudes de columnas |
| `fromTranslation(v)` | Vector2 → Matrix3 | Construye matriz de translación |
| `fromScale(v)` | Vector2 → Matrix3 | Construye matriz de escala |

**Estado:** ✅ Completo y consistente

**Uso de Tipos:** ✅ `ReadonlyVector2Like` para inputs, `Vector2` para outputs

### 19.3 Matrix2 ↔ Matrix3 (Embedding/Proyección)

**Relación Matemática:** 
```
Matrix3 = [ Matrix2  | 0 ]     Matrix2 = submatriz(Matrix3, 0:2, 0:2)
          [ 0  0     | 1 ]
```

**Interacciones Existentes:**
| Método | Dirección | Descripción |
|--------|-----------|-------------|
| `fromMatrix2(m)` | Matrix2 → Matrix3 | Embedding en coordenadas homogéneas |
| `toMatrix2()` | Matrix3 → Matrix2 | Proyección a parte lineal |
| `upperLeft2x2` | Matrix3 → Matrix2 | Getter de extracción |

**⚠️ Problema de Consistencia de Tipos:**
```typescript
// Actual (incorrecto):
static fromMatrix2(matrix: ReadonlyMatrix2, out?: Matrix3): Matrix3

// Debería ser (consistente con otros métodos):
static fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Matrix3): Matrix3
```

### 19.4 Rotation2 ↔ Matrix3 (Representación de Rotación)

**Relación Matemática:** Rotation2(cos, sin) ↔ Matriz de rotación 2D

```
Rotation2(c, s) ≡ Matrix3 = [ c  -s  0 ]
                            [ s   c  0 ]
                            [ 0   0  1 ]
```

**Interacciones Actuales:** ❌ NINGUNA

**Interacciones Propuestas:**

```typescript
// En Matrix3:
static fromRotation2(rotation: ReadonlyRotation2Like, out?: Matrix3): Matrix3 {
  return Matrix3.ensureOut(out).set(
    rotation.cos, rotation.sin, 0,
    -rotation.sin, rotation.cos, 0,
    0, 0, 1,
  );
}

// Overload mejorado de fromRotation:
static fromRotation(rotation: ReadonlyRotation2Like | number, out?: Matrix3): Matrix3 {
  if (typeof rotation === 'number') {
    const { cos, sin } = sinCos(rotation);
    return Matrix3.ensureOut(out).set(cos, sin, 0, -sin, cos, 0, 0, 0, 1);
  }
  return Matrix3.fromRotation2(rotation, out);
}

// Extracción:
toRotation2(out?: Rotation2): Rotation2 {
  // Usa getRotation() internamente
  return Rotation2.fromAngle(this.getRotation(), out);
}
```

### 19.5 Complex ↔ Matrix3 (Isomorfismo de Rotación)

**Relación Matemática:** Número complejo unitario e^(iθ) = cos(θ) + i·sin(θ) ≡ Matriz de rotación

**Interacciones Actuales:** ❌ NINGUNA DIRECTA
- Complex tiene `toRotationMatrix(): Matrix2Like` 

**Interacciones Propuestas:**

```typescript
// En Matrix3:
static fromComplexRotation(complex: ReadonlyComplexLike, out?: Matrix3): Matrix3 {
  // Normaliza para garantizar rotación unitaria
  const mag = safeSqrt(complex.real * complex.real + complex.imag * complex.imag);
  if (isNearZero(mag)) {
    return Matrix3.ensureOut(out).identity();
  }
  const c = complex.real / mag;
  const s = complex.imag / mag;
  return Matrix3.ensureOut(out).set(c, s, 0, -s, c, 0, 0, 0, 1);
}

// Extracción como Complex unitario:
toComplexRotation(): ComplexLike {
  const angle = this.getRotation();
  const { cos, sin } = sinCos(angle);
  return { real: cos, imag: sin };
}
```

### 19.6 Transform2 ↔ Matrix3 (Descomposición TRS)

**Relación Matemática:** Transform2(T, R, S) ≡ Matrix3 = T × R × S

**Interacciones Existentes:** ✅ COMPLETAS
| Método | Dirección | Ubicación |
|--------|-----------|-----------|
| `Transform2.fromMatrix(m)` | Matrix3 → Transform2 | transform2.ts |
| `Transform2.toMatrix()` | Transform2 → Matrix3 | transform2.ts |
| `Matrix3.fromTransform(T,R,S)` | Params → Matrix3 | matrix3.ts |
| `Matrix3.decompose()` | Matrix3 → {T,R,S} | matrix3.ts |

**Estado:** ✅ Bien diseñado

**Mejora DRY Propuesta:**
```typescript
// En Matrix3, añadir factory desde Transform2Like:
static fromTransform2(transform: ReadonlyTransform2Like, out?: Matrix3): Matrix3 {
  return Matrix3.fromTransform(
    transform.position,
    transform.rotation,
    transform.scale,
    out,
  );
}
```

### 19.7 Interval ↔ Matrix3 (Sin Relación Directa)

**Análisis:** No hay relación matemática natural entre Interval y Matrix3.
- Interval representa rangos escalares [min, max]
- Matrix3 representa transformaciones afines 2D

**Conclusión:** ✅ Correcto que no haya interacción

---

## 19.8 Tabla Resumen de Interacciones

| Desde/Hacia | Vector2 | Matrix2 | Matrix3 | Rotation2 | Complex | Transform2 | Interval |
|-------------|---------|---------|---------|-----------|---------|------------|----------|
| **Matrix3** | ✅ | ✅ | - | ⚠️ Add | ⚠️ Add | ✅ | N/A |
| **Vector2** | - | ✅ | ✅ | ✅ | ✅ | ✅ | N/A |
| **Matrix2** | ✅ | - | ✅ | ✅ | ⚠️ | N/A | N/A |
| **Rotation2** | ✅ | ⚠️ | ⚠️ Add | - | ✅ | N/A | N/A |
| **Complex** | ✅ | ⚠️ | ⚠️ Add | ✅ | - | N/A | N/A |
| **Transform2** | ✅ | N/A | ✅ | ✅ | N/A | - | N/A |

Leyenda: ✅ Existe | ⚠️ Falta/Mejorar | N/A No aplica

---

## 19.9 Principios DRY Aplicados

### 19.9.1 Evitar Duplicación de Cálculos Trigonométricos

**Problema:** Varios módulos calculan sin/cos por separado.

**Solución (ya implementada):** Uso consistente de `sinCos(angle)` del módulo auxiliar.

```typescript
// ✅ Correcto (usado en Matrix3):
import { sinCos } from '../auxiliary/angle/operations';
const { cos, sin } = sinCos(angle);

// ❌ Evitar:
const cos = Math.cos(angle);
const sin = Math.sin(angle);
```

### 19.9.2 Reutilización de Helpers de Normalización

**Patrón común:** Normalizar vectores para extraer rotación/escala.

```typescript
// Usado en Matrix3.decompose() y Matrix3.getRotation():
const sx = safeSqrt(m00*m00 + m01*m01);
const rotation = isNearZero(sx) ? 0 : DeterministicMath.atan2(m01/sx, m00/sx);
```

**Oportunidad DRY:** Extraer a helper si se usa en más de 2 lugares.

### 19.9.3 Patrón Factory Consistente

Todos los módulos deben seguir el mismo patrón:
```typescript
static from<Source>(source: Readonly<Source>Like, out?: ThisClass): ThisClass {
  return ThisClass.ensureOut(out).set(...);
}
```

---

## 19.10 Principios SOLID Aplicados

### 19.10.1 Single Responsibility (SRP)

| Módulo | Responsabilidad Única |
|--------|----------------------|
| Vector2 | Representar y operar puntos/vectores 2D |
| Matrix2 | Transformaciones lineales 2×2 |
| Matrix3 | Transformaciones afines 2D (homogéneas) |
| Rotation2 | Rotación 2D optimizada (cos, sin) |
| Complex | Aritmética de números complejos |
| Transform2 | Composición TRS descompuesta |

**Verificación Matrix3:** ✅ Cumple SRP
- NO incluye física
- NO incluye geometría de alto nivel
- Solo álgebra lineal y transformaciones afines

### 19.10.2 Open/Closed Principle (OCP)

**Estrategia:** Usar interfaces `Like` permite extensión sin modificación.

```typescript
// Cualquier objeto que implemente ReadonlyMatrix3Like funciona:
function transformPoint(matrix: ReadonlyMatrix3Like, point: ReadonlyVector2Like): Vector2 {
  // Funciona con Matrix3, objetos planos, o cualquier clase compatible
}
```

### 19.10.3 Liskov Substitution (LSP)

**Aplicación:** `ReadonlyMatrix3` puede usarse donde se espera `ReadonlyMatrix3Like`.

```typescript
// Esto debe funcionar siempre:
const frozen: ReadonlyMatrix3 = Matrix3.IDENTITY;
Matrix3.multiply(frozen, otherMatrix); // ✅ Acepta ReadonlyMatrix3Like
```

### 19.10.4 Interface Segregation (ISP)

**Interfaces separadas por mutabilidad:**
- `ReadonlyMatrix3Like` — Para inputs (no muta)
- `Matrix3Like` — Para outputs mutables

### 19.10.5 Dependency Inversion (DIP)

**Aplicación:** Depender de abstracciones (interfaces), no de implementaciones concretas.

```typescript
// ✅ Correcto:
static fromRotation(rotation: ReadonlyRotation2Like | number, out?: Matrix3): Matrix3

// ❌ Evitar:
static fromRotation(rotation: Rotation2 | number, out?: Matrix3): Matrix3
```

---

## 20. Análisis Clean Code para Matrix3

### 20.1 Naming Conventions

**Comparación con Matrix2/Vector2:**

| Aspecto | Matrix2/Vector2 | Matrix3 Actual | Acción |
|---------|-----------------|----------------|--------|
| Helpers privados | `ensureOut`, `sanitizeComponent` | `ensureOut`, `sanitize` | Renombrar `sanitize` → `sanitizeComponent` |
| Constantes | `IDENTITY`, `ZERO`, `ONE` | `IDENTITY`, `ZERO` | Añadir `ONE`, `EPSILON_MATRIX` |
| Keyword `public` | Explícito en constantes | Omitido | Añadir `public` |

### 20.2 Guard Clauses y Early Returns

**Patrón correcto (Vector2):**
```typescript
public static normalize(v: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const length = Vector2.length(v);
  if (isNearZero(length)) {
    throw new RangeError('Vector2.normalize: cannot normalize zero-length vector');
  }
  const inv = 1 / length;
  return this.ensureOut(out).set(v.x * inv, v.y * inv);
}
```

**Patrón en Matrix3 (correcto):**
```typescript
static inverse(matrix: ReadonlyMatrix3Like, out?: Matrix3): Matrix3 {
  // ... cálculo de cofactores ...
  if (isNearZero(det)) {
    throw new Error('Matrix3.inverse: matrix is singular');
  }
  // ...
}
```

**Verificación:** ✅ Matrix3 usa guard clauses correctamente

### 20.3 Magic Numbers

**Problema identificado en Matrix3.fromArray:**
```typescript
if (offset < 0 || offset + 8 >= array.length) {  // ❓ ¿Por qué 8 y no 9?
```

**Corrección:**
```typescript
const MATRIX3_ELEMENT_COUNT = 9;
if (offset < 0 || offset + MATRIX3_ELEMENT_COUNT > array.length) {
```

### 20.4 Consistencia de Mensajes de Error

**Patrón Vector2:**
```typescript
throw new RangeError('Vector2.fromArray: offset ${offset} out of bounds for array length ${array.length}');
```

**Matrix3 (correcto):**
```typescript
throw new RangeError(`Matrix3.fromArray: offset ${offset} is out of bounds for array of length ${array.length}`);
```

**Pequeña inconsistencia:** "out of bounds" vs "is out of bounds" - Estandarizar.

### 20.5 Uso Consistente de Módulos Auxiliares

**Imports necesarios para paridad con Matrix2:**

```typescript
// Actuales en Matrix3:
import { sinCos } from '../auxiliary/angle/operations';
import { safeDivide, safeSqrt } from '../auxiliary/numeric/safety';
import { saturate } from '../auxiliary/scalar/arithmetic';
import { isNearZero, nearEquals } from '../auxiliary/scalar/comparison';
import { EPSILON } from '../auxiliary/scalar/constants';
import { lerp } from '../auxiliary/scalar/interpolation';

// Faltantes (usados en Matrix2):
import {
  abs as scalarAbs,
  clamp,
  max as scalarMax,
  min as scalarMin,
  sign as scalarSign,
} from '../auxiliary/scalar/arithmetic';
import { smoothStep as scalarSmoothStep } from '../auxiliary/scalar/interpolation';
```

---

## 20.6 Estrategias de Escalabilidad

### 20.6.1 Separación de Hot Paths

**Patrón establecido en Vector2/Matrix2:**
```typescript
// Throwing version (safe, validates)
normalize(): this { /* throws on zero */ }

// Safe version (handles edge cases gracefully)
normalizeSafe(): this { /* returns zero on zero */ }

// Unchecked version (hot path, assumes valid input)
normalizeUnchecked(): this { /* no checks, maximum performance */ }
```

**Aplicar a Matrix3:**
- `inverse()` — Throwing
- `inverseSafe()` — Retorna identity si singular
- `inverseUnchecked()` — Sin verificación

### 20.6.2 Batch Operations Pattern

**Matrix3 ya tiene (buena práctica):**
```typescript
transformPoints(points: readonly ReadonlyVector2Like[], out?: Vector2[]): Vector2[]
transformVectors(vectors: readonly ReadonlyVector2Like[], out?: Vector2[]): Vector2[]
```

**Considerar para Matrix2 también.**

### 20.6.3 Memory Pool Compatibility

**Patrón:** Todos los métodos que crean nuevas instancias deben tener variante con `out`.

**Matrix3 Status:**
- ✅ Static factories tienen `out?`
- ❌ Getters como `transposed`, `inverted`, `negated` no tienen versión con out
- ✅ Métodos como `getColumn`, `getRow` podrían aceptar `out` para tuplas

---

## 20.7 Análisis Comparativo con Mercado

### 20.7.1 glMatrix (Referencia WebGL)

| Característica | glMatrix | Matrix3 | Evaluación |
|----------------|----------|---------|------------|
| API funcional pura | ✅ Todo estático | ✅ Híbrido (static + instance) | ✅ Matrix3 más OOP |
| Zero allocation | ✅ out obligatorio | ✅ out opcional | ✅ Flexible |
| Column-major | ✅ | ✅ | ✅ Consistente |
| `frob` (Frobenius) | ✅ | ❌ | Añadir |
| `adjoint` | ✅ | ❌ | Añadir |

### 20.7.2 Three.js Matrix3 (Referencia 3D Graphics)

| Característica | Three.js | Matrix3 | Evaluación |
|----------------|----------|---------|------------|
| Mutable instance | ✅ | ✅ | ✅ |
| Chainable | ✅ Parcial | ❌ (retorna Matrix3) | Corregir → `this` |
| `multiplyScalar` | ✅ | ⚠️ Solo via `scale()` | Añadir alias |
| `clone()` | ✅ | ✅ | ✅ |
| `elements` array | ✅ | ❌ Props individuales | ✅ Props mejor typed |

### 20.7.3 Box2D b2Mat33 (Referencia Física 2D)

| Característica | Box2D | Matrix3 | Evaluación |
|----------------|-------|---------|------------|
| Solve linear system | ✅ `Solve33`, `Solve22` | ❌ | No requerido (matemática pura) |
| Inverse | ✅ | ✅ | ✅ |
| Zero allocation | ✅ Stack alloc C++ | ✅ out params | ✅ Equivalente en JS |

### 20.7.4 Síntesis: Qué Adoptar

**De glMatrix:**
- ✅ `adjugate` (matriz adjunta)
- ✅ `frobeniusNorm` (norma de Frobenius)

**De Three.js:**
- ✅ `multiplyScalar` como método separado
- ✅ Return `this` para chainability

**De Box2D:**
- ❌ Solvers lineales (pertenece a paquete de física)

---

## 21. Resumen de Prioridades

> Todas las operaciones son **algebraicas/matemáticas puras**, no específicas de dominio.

### Crítico (Fase 1) - Arquitectura API
1. Eliminar `out?` de todos los métodos de instancia
2. Cambiar tipo de retorno de `Matrix3` a `this` en métodos de instancia
3. Añadir helper `freezeMatrix3`
4. Reorganizar secciones al orden correcto

### Alto (Fase 2) - Operaciones Algebraicas Fundamentales
1. Constructor overloads (array, object)
2. `inverseSafe`, `inverseUnchecked` — Variantes de inversa matricial
3. `isZero`, `nearZero`, `isFinite`, `hasNaN`, `isSingular` — Predicados numéricos
4. `lerpUnclamped` — Interpolación lineal sin restricción
5. `trace`, `frobeniusNorm` — Propiedades algebraicas clásicas

### Medio (Fase 3) - Completitud Algebraica
1. Aritmética escalar: `addScalar`, `subtractScalar`, `divideScalar`
2. Operaciones componente: `floor`, `ceil`, `round`, `abs`, `sign`
3. Predicados matriciales: `isSymmetric`, `isDiagonal`, `isOrthogonal`
4. `smoothStep` (interpolación), `adjugate` (matriz adjunta)
5. Constantes: `ONE`, `EPSILON_MATRIX`, etc.

### Bajo (Fase 4) - Conveniencia y Acceso
1. Getters de estructura: `column0`, `column1`, `column2`, `row0`, `row1`, `row2`
2. Operaciones de rango: `min`, `max`, `clamp`, `clampScalar`
3. `isSkewSymmetric` — Predicado especializado
4. Actualizar imports para usar todos los módulos auxiliares

---

## 22. Consideraciones de Breaking Changes

### 21.1 Cambios que Rompen Compatibilidad

| Cambio | Impacto | Mitigación |
|--------|---------|------------|
| Eliminar `out?` de instancia | Alto | Deprecar primero, remover en v2 |
| `Matrix3` → `this` return type | Medio | Compatibilidad con subclases |
| Constructor overloads | Bajo | Additive, no rompe |

### 21.2 Estrategia de Migración

1. **v1.x:** Marcar métodos con `out?` como `@deprecated`
2. **v2.0:** Eliminar `out?`, cambiar return types a `this`

---

## 23. Qué NO Incluir en Matrix3

> Mantener la pureza matemática del módulo. Los siguientes métodos pertenecen
> a paquetes de nivel superior (física, renderizado, geometría computacional).

### 22.1 Métodos de Física (NO incluir)

| Método | Razón de Exclusión | Paquete Apropiado |
|--------|-------------------|-------------------|
| `applyForce` | Concepto físico | `@lenguados/physics2d` |
| `applyTorque` | Concepto físico | `@lenguados/physics2d` |
| `integrateVelocity` | Simulación física | `@lenguados/physics2d` |
| `computeInertia` | Momento de inercia | `@lenguados/physics2d` |

### 22.2 Métodos de Renderizado (NO incluir)

| Método | Razón de Exclusión | Paquete Apropiado |
|--------|-------------------|-------------------|
| `setUvTransform` | Específico de texturas | Renderer |
| `toCanvasMatrix` | Específico de Canvas API | Renderer |
| `toWebGLUniform` | Específico de WebGL | Renderer |
| `getNormalMatrix` | Operación 3D | `@lenguados/math3d` |

### 22.3 Métodos de Geometría de Alto Nivel (NO incluir)

| Método | Razón de Exclusión | Paquete Apropiado |
|--------|-------------------|-------------------|
| `transformPolygon` | Geometría computacional | `@lenguados/geometry2d` |
| `transformAABB` | Estructura geométrica | `@lenguados/geometry2d` |
| `transformCircle` | Estructura geométrica | `@lenguados/geometry2d` |
| `computeBoundingBox` | Algoritmo geométrico | `@lenguados/geometry2d` |

### 22.4 Lo que SÍ Incluimos (Matemáticas Puras)

- ✅ **Álgebra lineal:** multiplicación, inversa, transpuesta, determinante, traza
- ✅ **Propiedades matriciales:** norma de Frobenius, singularidad, ortogonalidad
- ✅ **Transformaciones afines:** composición de rotación/escala/translación
- ✅ **Aplicación de transformación:** `transformPoint`, `transformVector`
- ✅ **Interpolación:** lerp, smoothStep
- ✅ **Predicados numéricos:** isZero, isFinite, hasNaN, equals

---

## 24. Resumen Ejecutivo de Acciones

### 24.1 Acciones Críticas (Rompen compatibilidad actual)

| # | Acción | Archivo | Líneas Afectadas |
|---|--------|---------|------------------|
| 1 | Eliminar `out?` de métodos de instancia | matrix3.ts | ~12 métodos |
| 2 | Cambiar return `Matrix3` → `this` | matrix3.ts | ~12 métodos |
| 3 | Mover constructor después de static members | matrix3.ts | L37-47 → después de constants |

### 24.2 Acciones de Completitud (Añadir funcionalidad)

| # | Acción | Categoría | Prioridad |
|---|--------|-----------|-----------|
| 1 | `freezeMatrix3` helper | Helper | Alta |
| 2 | Constructor overloads (array, object) | Factory | Alta |
| 3 | `inverseSafe`, `inverseUnchecked` | Operations | Alta |
| 4 | `trace`, `frobeniusNorm` | Properties | Alta |
| 5 | `isZero`, `nearZero`, `isFinite`, `hasNaN` | Validation | Alta |
| 6 | `isSingular`, `isSymmetric`, `isDiagonal` | Validation | Media |
| 7 | `lerpUnclamped`, `smoothStep` | Interpolation | Media |
| 8 | `addScalar`, `subtractScalar`, `divideScalar` | Arithmetic | Media |
| 9 | `floor`, `ceil`, `round`, `abs`, `sign` | Numeric | Baja |
| 10 | `min`, `max`, `clamp`, `clampScalar` | Numeric | Baja |
| 11 | `adjugate` | Matrix Op | Media |
| 12 | Constantes: `ONE`, `EPSILON_MATRIX`, etc. | Constants | Media |
| 13 | Getters: `column0`, `row0`, etc. | Accessors | Baja |

### 24.3 Acciones de Consistencia (Alinear con Vector2/Matrix2)

| # | Acción | Detalle |
|---|--------|---------|
| 1 | Formato de secciones | 76 chars, texto alineado |
| 2 | Renombrar `sanitize` → `sanitizeComponent` | Consistencia |
| 3 | Añadir `public` a constantes | Explícito |
| 4 | Tipo `ReadonlyMatrix2Like` en `fromMatrix2` | Duck typing |
| 5 | Estandarizar mensajes de error | "out of bounds" |

### 24.4 Acciones de Interoperabilidad (Módulos internos)

| # | Acción | Relación |
|---|--------|----------|
| 1 | `fromRotation2(rotation: ReadonlyRotation2Like)` | Rotation2 → Matrix3 |
| 2 | Overload `fromRotation` con Rotation2Like | Rotation2 → Matrix3 |
| 3 | `fromTransform2(transform: ReadonlyTransform2Like)` | Transform2 → Matrix3 |
| 4 | `toRotation2()` | Matrix3 → Rotation2 |
| 5 | `fromComplexRotation(complex: ReadonlyComplexLike)` | Complex → Matrix3 |

### 24.5 Acciones en Módulos de Soporte

| # | Módulo | Acción | Prioridad |
|---|--------|--------|-----------|
| 1 | `validation/assert` | Añadir `assertMatrix3()` | Media |
| 2 | `types/index` | Verificar `isMatrix3Like` existe | ✅ Ya existe |
| 3 | `deterministic` | Ninguna acción requerida | N/A |
| 4 | `utils/random` | Añadir `randomMatrix3()` | Baja |
| 5 | `utils/random` | Añadir `randomAffineMatrix3()` | Baja |
| 6 | `utils/parse` | Ya completo (`parseMatrix3`, `formatMatrix3`) | ✅ |
| 7 | `auxiliary/scalar` | Añadir imports para `abs`, `sign`, `clamp`, `min`, `max` | Alta |

### 24.5 Métricas de Éxito

| Métrica | Objetivo |
|---------|----------|
| Test Coverage | > 90% |
| Paridad con Matrix2 | 100% de métodos equivalentes |
| Interoperabilidad | Bidireccional con todos los módulos core |
| Performance | Sin regresión en benchmarks |
| Documentación | JSDoc completo en API pública |

---

## 25. Checklist Final de Paridad (Matemáticas Puras)

### Consistencia con Matrix2

- [ ] Mismo orden de secciones
- [ ] Mismo formato de comentarios (76 chars, texto alineado)
- [ ] `public` en constantes estáticas
- [ ] `freezeMatrix3` helper
- [ ] Re-export `isMatrix3Like`
- [ ] Constructor overloads con validación
- [ ] Métodos de instancia sin `out?`, retornando `this`
- [ ] Imports completos de módulos auxiliares

### Métodos Estáticos Completos

- [ ] Todas las factories
- [ ] Aritmética escalar completa
- [ ] Transformaciones numéricas completas
- [ ] Interpolación completa
- [ ] Comparación/validación completa
- [ ] Operaciones matriciales completas

### Métodos de Instancia Completos

- [ ] Aritmética escalar
- [ ] Transformaciones numéricas
- [ ] Computed values (trace, frobeniusNorm)
- [ ] Comparaciones
- [ ] Interpolación
- [ ] Getters de columnas/filas

