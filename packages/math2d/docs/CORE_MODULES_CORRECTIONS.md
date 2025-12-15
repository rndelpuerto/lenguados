# Documento de Correcciones: Vector2, Matrix2, Matrix3

> **Estado:** ✅ COMPLETADO (18 anomalías corregidas)
> **Fecha:** 2025-12-04
> **Última actualización:** Sesión 2
> **Módulos afectados:** `vector2.ts`, `matrix2.ts`, `matrix3.ts`

---

## ✅ CORRECCIONES APLICADAS

Las siguientes anomalías fueron corregidas exitosamente:

| #   | Anomalía                                                  | Archivo    | Estado                              |
| --- | --------------------------------------------------------- | ---------- | ----------------------------------- |
| 1   | Bug `smoothStep` usaba `scalarSmoothStep` incorrectamente | matrix3.ts | ✅ CORREGIDO                        |
| 2   | `clone()` de instancia faltante                           | matrix2.ts | ✅ Ya existía                       |
| 3   | `copy()` de instancia faltante                            | matrix2.ts | ✅ Ya existía                       |
| 6   | Import innecesario `scalarSmoothStep`                     | matrix3.ts | ✅ ELIMINADO                        |
| 9   | Faltan `@since` en 4 métodos                              | vector2.ts | ✅ AÑADIDOS                         |
| 13  | Tipos de excepción inconsistentes                         | matrix3.ts | ✅ CORREGIDO (Error → RangeError)   |
| 17  | Matrix2 omite `public` keyword (instancia)                | matrix2.ts | ✅ CORREGIDO (~50 métodos)          |
| 18  | Matrix2 omite `public` keyword (estáticos)                | matrix2.ts | ✅ CORREGIDO (53 métodos estáticos) |

---

## 🚨 ANOMALÍAS CRÍTICAS

### 1. Bug en `smoothStep` de Matrix3

**Severidad:** CRÍTICA 🔴
**Archivos afectados:** `matrix3.ts` (líneas 1069-1086, 3371-3383)

#### Problema

La implementación de `smoothStep` en `Matrix3` usa incorrectamente la función `scalarSmoothStep`:

```typescript
// ❌ INCORRECTO - Matrix3 actual
public smoothStep(other: ReadonlyMatrix3Like, t: number): this {
  return this.set(
    scalarSmoothStep(this.m00, other.m00, t),
    scalarSmoothStep(this.m01, other.m01, t),
    // ...
  );
}
```

La función `scalarSmoothStep(edge0, edge1, x)` está diseñada para **mapear un rango `[edge0, edge1]` a `[0, 1]`**, NO para interpolar entre dos valores.

```typescript
// scalarSmoothStep implementation
export function smoothStep(edge0: number, edge1: number, x: number): number {
 const t = saturate((x - edge0) / (edge1 - edge0));
 return t * t * (3 - 2 * t);
}
```

#### Referencia correcta: Vector2

```typescript
// ✅ CORRECTO - Vector2
public smoothStep(end: ReadonlyVector2Like, t: number): this {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return this.lerp(end, factor);
}
```

#### Corrección propuesta

```typescript
// Matrix3 Static
public static smoothStep(
  a: ReadonlyMatrix3Like,
  b: ReadonlyMatrix3Like,
  t: number,
  out?: Matrix3,
): Matrix3 {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return Matrix3.ensureOut(out).set(
    lerp(a.m00, b.m00, factor),
    lerp(a.m01, b.m01, factor),
    lerp(a.m02, b.m02, factor),
    lerp(a.m10, b.m10, factor),
    lerp(a.m11, b.m11, factor),
    lerp(a.m12, b.m12, factor),
    lerp(a.m20, b.m20, factor),
    lerp(a.m21, b.m21, factor),
    lerp(a.m22, b.m22, factor),
  );
}

// Matrix3 Instance
public smoothStep(other: ReadonlyMatrix3Like, t: number): this {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return this.set(
    lerp(this.m00, other.m00, factor),
    lerp(this.m01, other.m01, factor),
    lerp(this.m02, other.m02, factor),
    lerp(this.m10, other.m10, factor),
    lerp(this.m11, other.m11, factor),
    lerp(this.m12, other.m12, factor),
    lerp(this.m20, other.m20, factor),
    lerp(this.m21, other.m21, factor),
    lerp(this.m22, other.m22, factor),
  );
}
```

---

## ⚠️ ANOMALÍAS DE SIMETRÍA DE API

### 2. Matrix2 no tiene `clone()` de instancia

**Severidad:** MEDIA 🟡
**Archivo:** `matrix2.ts`

#### Problema

Vector2 y Matrix3 tienen `clone()` como método de instancia, pero Matrix2 no.

| Módulo  | `static clone()` | `public clone()` |
| ------- | ---------------- | ---------------- |
| Vector2 | ✅               | ✅               |
| Matrix2 | ✅               | ❌               |
| Matrix3 | ✅               | ✅               |

#### Corrección propuesta

```typescript
// Añadir a Matrix2
public clone(): Matrix2 {
  return Matrix2.clone(this);
}
```

---

### 3. Matrix2 no tiene `copy()` de instancia

**Severidad:** MEDIA 🟡
**Archivo:** `matrix2.ts`

#### Problema

Vector2 y Matrix3 tienen `copy()` como método de instancia, pero Matrix2 no.

| Módulo  | `static copy()` | `public copy()` |
| ------- | --------------- | --------------- |
| Vector2 | ✅              | ✅              |
| Matrix2 | ✅              | ❌              |
| Matrix3 | ✅              | ✅              |

#### Corrección propuesta

```typescript
// Añadir a Matrix2
public copy(matrix: ReadonlyMatrix2Like): this {
  return this.set(matrix.m00, matrix.m01, matrix.m10, matrix.m11);
}
```

---

### 4. Matrix3 tiene `isZero()` y `nearZero()` de instancia, pero Vector2 y Matrix2 no

**Severidad:** MEDIA 🟡
**Archivos:** `vector2.ts`, `matrix2.ts`

#### Problema

Matrix3 tiene métodos de instancia para validación que los otros módulos no tienen:

| Módulo  | `static isZero()` | `public isZero()` | `static nearZero()` | `public nearZero()` |
| ------- | ----------------- | ----------------- | ------------------- | ------------------- |
| Vector2 | ✅                | ❌                | ✅                  | ❌                  |
| Matrix2 | ✅                | ❌                | ✅                  | ❌                  |
| Matrix3 | ✅                | ✅                | ✅                  | ✅                  |

#### Corrección propuesta

Añadir métodos de instancia a Vector2 y Matrix2:

```typescript
// Vector2
public isZero(): boolean {
  return this.x === 0 && this.y === 0;
}

public nearZero(epsilon = EPSILON): boolean {
  return isNearZero(this.x, epsilon) && isNearZero(this.y, epsilon);
}

// Matrix2
public isZero(): boolean {
  return this.m00 === 0 && this.m01 === 0 && this.m10 === 0 && this.m11 === 0;
}

public nearZero(epsilon = EPSILON): boolean {
  return (
    isNearZero(this.m00, epsilon) &&
    isNearZero(this.m01, epsilon) &&
    isNearZero(this.m10, epsilon) &&
    isNearZero(this.m11, epsilon)
  );
}
```

---

### 5. `smoothStep` de Matrix2 - Verificación de consistencia

**Severidad:** BAJA 🟢
**Archivo:** `matrix2.ts`

**Estado:** ✅ VERIFICADO CORRECTO

Matrix2 implementa `smoothStep` correctamente usando el mismo patrón que Vector2:

```typescript
// Matrix2.smoothStep - CORRECTO
static smoothStep(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like, t: number, out?: Matrix2): Matrix2 {
  const tt = saturate(t);
  const factor = tt * tt * (3 - 2 * tt);
  return Matrix2.ensureOut(out).set(
    lerp(a.m00, b.m00, factor),
    // ...
  );
}
```

---

### 6. Verificar import innecesario en Matrix3

**Severidad:** BAJA 🟢
**Archivo:** `matrix3.ts`

Si se corrige el bug #1, el import de `scalarSmoothStep` ya no sería necesario (se puede reemplazar por `saturate` y `lerp`).

---

## ⚠️ ANOMALÍAS DE SEMÁNTICA

### 8. Inconsistencia en semántica de `equals()` entre módulos

**Severidad:** MEDIA 🟡
**Archivos:** `vector2.ts`, `matrix2.ts`, `matrix3.ts`

#### Problema

El comportamiento de `equals()` es diferente entre módulos:

| Módulo  | `equals()` comportamiento  | `nearEquals()` instancia |
| ------- | -------------------------- | ------------------------ |
| Vector2 | Comparación EXACTA (===)   | ✅ Existe                |
| Matrix2 | Comparación con TOLERANCIA | ❌ No existe             |
| Matrix3 | Comparación con TOLERANCIA | ❌ No existe             |

En Vector2, `equals()` usa comparación exacta y existe `nearEquals()` para comparación con tolerancia.
En Matrix2 y Matrix3, `equals()` ya usa tolerancia por defecto, lo cual es inconsistente.

```typescript
// Vector2.equals - EXACTO
public equals(v: ReadonlyVector2Like): boolean {
  return this.x === v.x && this.y === v.y;
}

// Matrix2.equals - CON TOLERANCIA
equals(other: ReadonlyMatrix2, epsilon: number = EPSILON): boolean {
  return nearEquals(this.m00, other.m00, epsilon) && ...
}

// Matrix3.equals - CON TOLERANCIA
public equals(other: ReadonlyMatrix3Like, epsilon: number = EPSILON): boolean {
  return nearEquals(this.m00, other.m00, epsilon) && ...
}
```

#### Opciones de corrección

**Opción A: Unificar a semántica de Vector2 (recomendada)**

- `equals()` = comparación exacta
- `nearEquals()` = comparación con tolerancia

**Opción B: Documentar la diferencia**

- Matrices usan tolerancia por defecto debido a mayor acumulación de errores numéricos
- Añadir `strictEquals()` a matrices para comparación exacta

**Opción C: Mantener actual pero añadir `nearEquals()`**

- Añadir `nearEquals()` de instancia a Matrix2 y Matrix3 como alias de `equals()`

---

## ⚠️ ANOMALÍAS DE DOCUMENTACIÓN

### 9. Métodos sin `@since` tag en Vector2

**Severidad:** BAJA 🟢
**Archivo:** `vector2.ts`

#### Problema

4 métodos de instancia tienen `@category` pero les falta `@since`:

| Línea | Método           | @category  | @since |
| ----- | ---------------- | ---------- | ------ |
| 2072  | `multiply()`     | Arithmetic | ❌     |
| 2085  | `scale()`        | Arithmetic | ❌     |
| 2101  | `divide()`       | Arithmetic | ❌     |
| 2114  | `divideScalar()` | Arithmetic | ❌     |

#### Corrección

Añadir `@since 0.1.0` a estos 4 métodos (ya que son operaciones fundamentales que probablemente existen desde el inicio).

---

## 📊 RESUMEN DE MÉTODOS FALTANTES

### Tabla de Paridad de Métodos

| Método               | Vector2 | Matrix2 | Matrix3 | Acción           |
| -------------------- | ------- | ------- | ------- | ---------------- |
| `clone()` instancia  | ✅      | ❌      | ✅      | AÑADIR a Matrix2 |
| `copy()` instancia   | ✅      | ❌      | ✅      | AÑADIR a Matrix2 |
| `isZero()` instancia | ❌      | ❌      | ✅      | AÑADIR a V2/M2   |
| `nearZero()` inst    | ❌      | ❌      | ✅      | AÑADIR a V2/M2   |
| `nearEquals()` inst  | ✅      | ❌      | ❌      | AÑADIR a M2/M3   |
| `fma()` static       | ✅      | ❌      | ❌      | Evaluar utilidad |
| `fma()` instancia    | ✅      | ❌      | ❌      | Evaluar utilidad |

### Tipos de retorno en Column/Row getters

| Módulo  | column0/1/2       | row0/1/2          | diagonal          |
| ------- | ----------------- | ----------------- | ----------------- |
| Matrix2 | `Vector2`         | `Vector2`         | `Vector2`         |
| Matrix3 | `[n, n, n]` tupla | `[n, n, n]` tupla | `[n, n, n]` tupla |

**Nota**: Esta diferencia es intencional en un paquete math2d (no existe Vector3), pero debe documentarse.

### Nota sobre `fma()`

El método `fma()` (fused multiply-add) existe en Vector2 pero no en Matrix2/Matrix3. Este método es más común para vectores que para matrices. Se puede considerar añadirlo para consistencia, pero no es crítico.

```typescript
// Vector2.fma
public fma(scale: number, v: ReadonlyVector2Like): this {
  this.x = this.x * scale + v.x;
  this.y = this.y * scale + v.y;
  return this;
}
```

---

## 📋 CHECKLIST DE VERIFICACIÓN

### Simetría API

- [ ] Static methods con `out` parameter
- [ ] Instance methods retornan `this`
- [ ] Consistencia de nombres entre módulos

### Manejo de excepciones

- [ ] Métodos `Safe` retornan valores seguros
- [ ] Métodos `Unchecked` documentan precondiciones
- [ ] Métodos base lanzan excepciones apropiadas

### Hot paths

- [ ] Variantes `Unchecked` disponibles
- [ ] Sin validaciones innecesarias en loops críticos

### Tolerancias

- [ ] Uso consistente de `EPSILON` como default
- [ ] `epsilon` parameter opcional en comparaciones

---

## 🔍 ÁREAS A INVESTIGAR

1. **Operaciones modulo**: Verificar uso de `scalarModule` vs `%`
2. **División segura**: Verificar uso de `safeDivide`
3. **Raíz cuadrada**: Verificar uso de `safeSqrt`
4. **Trigonometría**: Verificar delegación a `DeterministicMath`
5. **Frozen constants**: Verificar uso de `freezeVector2`/`freezeMatrix2`/`freezeMatrix3`

---

## 🎯 PLAN DE ACCIÓN PRIORIZADO

### Prioridad 1: CRÍTICA 🔴

| #   | Anomalía                                                | Archivo    | Acción                                       |
| --- | ------------------------------------------------------- | ---------- | -------------------------------------------- |
| 1   | Bug `smoothStep` usa `scalarSmoothStep` incorrectamente | matrix3.ts | Corregir implementación estática e instancia |

### Prioridad 2: MEDIA 🟡

| #   | Anomalía                               | Archivo(s)             | Acción                |
| --- | -------------------------------------- | ---------------------- | --------------------- |
| 2   | `clone()` de instancia faltante        | matrix2.ts             | Añadir método         |
| 3   | `copy()` de instancia faltante         | matrix2.ts             | Añadir método         |
| 4   | `isZero()` de instancia faltante       | vector2.ts, matrix2.ts | Añadir métodos        |
| 5   | `nearZero()` de instancia faltante     | vector2.ts, matrix2.ts | Añadir métodos        |
| 8   | Inconsistencia semántica en `equals()` | matrix2.ts, matrix3.ts | Documentar o unificar |

### Prioridad 3: BAJA 🟢

| #   | Anomalía                              | Archivo(s) | Acción                    |
| --- | ------------------------------------- | ---------- | ------------------------- |
| 6   | Import innecesario `scalarSmoothStep` | matrix3.ts | Eliminar tras corregir #1 |
| 9   | Faltan `@since` en 4 métodos          | vector2.ts | Añadir tags               |

---

## 🔍 ANOMALÍAS ADICIONALES ENCONTRADAS

### 10. Import innecesario de `scalarSmoothStep` en Matrix3

**Severidad:** BAJA 🟢 (relacionado con bug #1)
**Archivo:** `matrix3.ts`

#### Problema

Matrix3 importa `smoothStep as scalarSmoothStep` desde `auxiliary/scalar/interpolation`:

```typescript
// matrix3.ts línea 39
import { lerp, smoothStep as scalarSmoothStep } from '../auxiliary/scalar/interpolation';
```

Este import NO existe en Vector2 ni Matrix2, y se usa incorrectamente en la implementación de `smoothStep`.

#### Comparación de imports de interpolation

| Módulo  | Imports de `auxiliary/scalar/interpolation` |
| ------- | ------------------------------------------- |
| Vector2 | `lerp`                                      |
| Matrix2 | `lerp`                                      |
| Matrix3 | `lerp`, `smoothStep as scalarSmoothStep`    |

#### Corrección

Tras corregir el bug #1, eliminar el import de `scalarSmoothStep` ya que no será necesario.

---

### 11. Inconsistencia menor en parámetro default de `toString()`

**Severidad:** INFORMATIVA 🔵
**Archivos:** `vector2.ts` vs otros

#### Observación

```typescript
// Vector2 - precision es opcional sin default
public toString(precision?: number): string

// Matrix2, Matrix3, etc. - precision tiene default = 4
public toString(precision = 4): string
```

Esto no es necesariamente un problema, pero es una diferencia sutil de comportamiento.

---

## 🔍 VERIFICACIÓN DE OBJETIVOS DE DISEÑO

### 12. Método `angularToLinearVelocity` con categoría `@category Physics`

**Severidad:** BAJA 🟢 (cuestionable según principio "base matemática pura")
**Archivo:** `vector2.ts` (líneas 1537-1567)

#### Observación

El método `angularToLinearVelocity` está categorizado como `@category Physics`:

```typescript
/**
 * Converts angular velocity to linear velocity at a position.
 * Useful in physics for calculating velocity at a point on a rotating body.
 *
 * @remarks
 * In 2D, angular velocity ω is a scalar (perpendicular to the plane).
 * The cross product ω × r produces a tangent velocity.
 * Equivalent to `Vector2.crossSV(omega, r, out)`.
 *
 * @category Physics
 * @since 0.9.0
 */
public static angularToLinearVelocity(omega: number, r: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Vector2.crossSV(omega, r, out);
}
```

#### Análisis

| Aspecto             | Evaluación                                                   |
| ------------------- | ------------------------------------------------------------ |
| **Matemáticamente** | Es simplemente `ω × r`, una operación vectorial pura         |
| **Nombre**          | Contexto de física (angular velocity, linear velocity)       |
| **JSDoc**           | Referencias explícitas a física ("physics", "rotating body") |
| **Duplicación**     | Es un alias directo de `crossSV`                             |

#### Opciones

**Opción A: Mantener como está**

- Es matemáticamente válido
- Proporciona abstracción semántica útil para usuarios de física
- No contamina la API con algoritmos complejos

**Opción B: Mover a módulo de física futuro**

- Mantener solo `crossSV` como operación matemática pura
- Cuando se cree el paquete de física, incluir este método allí

**Opción C: Re-categorizar**

- Cambiar `@category Physics` a `@category Transform` o `@category Arithmetic`
- Renombrar a algo más genérico como `perpendicularScaled` (pero perdería claridad)

#### Recomendación

Mantener por ahora (Opción A), pero documentar como método de conveniencia. Al crear el paquete de física, evaluar si moverlo.

---

### 13. Inconsistencia en tipos de excepción

**Severidad:** MEDIA 🟡
**Archivos:** `vector2.ts`, `matrix2.ts`, `matrix3.ts`

#### Problema

Diferentes tipos de excepción para errores similares:

| Módulo  | Operación                 | Tipo de Excepción  |
| ------- | ------------------------- | ------------------ |
| Vector2 | `normalize()` zero length | `RangeError`       |
| Vector2 | `inverse()` zero comp.    | `RangeError`       |
| Vector2 | `setLength()` invalid     | `RangeError`       |
| Matrix2 | `inverse()` singular      | `RangeError`       |
| Matrix3 | `inverse()` singular      | `Error` (genérico) |
| Matrix3 | `divideScalar(0)`         | `Error` (genérico) |

#### Corrección propuesta

Unificar a `RangeError` para errores de dominio matemático:

```typescript
// Matrix3 - Cambiar Error a RangeError
throw new RangeError('Matrix3.inverse: matrix is singular');
throw new RangeError('Matrix3.divideScalar: division by zero');
```

---

### 14. Falta `assertMatrix3` en validation/assert.ts

**Severidad:** BAJA 🟢
**Archivo:** `validation/assert.ts`

#### Problema

El módulo de validación tiene assertions para:

- ✅ `assertVector2`
- ✅ `assertMatrix2`
- ✅ `assertRotation2`
- ❌ `assertMatrix3` (falta)

#### Corrección propuesta

```typescript
export function assertMatrix3(
 m00: number,
 m01: number,
 m02: number,
 m10: number,
 m11: number,
 m12: number,
 m20: number,
 m21: number,
 m22: number,
 name?: string,
): void {
 if (!assertionsEnabled) return;
 const prefix = name ?? 'matrix';
 const elements = [
  [m00, '0,0'],
  [m01, '0,1'],
  [m02, '0,2'],
  [m10, '1,0'],
  [m11, '1,1'],
  [m12, '1,2'],
  [m20, '2,0'],
  [m21, '2,1'],
  [m22, '2,2'],
 ];
 for (const [value, index] of elements) {
  if (!Number.isFinite(value)) {
   throw new Error(`[math2d] ${prefix}[${index}] must be finite, got ${value}`);
  }
 }
}
```

---

### 15. Validaciones en hot paths - Estado ✅

**Severidad:** INFORMATIVA 🔵
**Archivo:** `validation/assert.ts`

#### Estado actual: CORRECTO

El sistema de assertions está correctamente implementado:

1. **Desactivación automática en producción:**

   ```typescript
   const DEFAULT_ENABLED = !(globalThis.process?.env?.NODE_ENV === 'production');
   ```

2. **Control manual:**

   ```typescript
   setAssertionsEnabled(false); // Desactivar
   setAssertionsEnabled(true); // Activar
   ```

3. **Zero overhead cuando desactivadas:**

   ```typescript
   export function assertFinite(value: number, name?: string): void {
    if (!assertionsEnabled) return; // Early return
    // ...
   }
   ```

4. **Métodos `Unchecked` disponibles para hot paths:**
   - `Vector2.normalizeUnchecked()`
   - `Vector2.divideScalarUnchecked()`
   - `Matrix2.inverseUnchecked()`
   - `Matrix3.inverseUnchecked()`

---

### 16. Vector2 tiene `isZero(epsilon)` pero Matrix2/Matrix3 no

**Severidad:** BAJA 🟢
**Archivos:** `vector2.ts`, `matrix2.ts`, `matrix3.ts`

#### Observación

Vector2.isZero tiene parámetro opcional `epsilon`:

```typescript
// Vector2
public isZero(epsilon = 0): boolean {
  if (epsilon === 0) {
    return this.x === 0 && this.y === 0;
  }
  return isNearZero(this.x, epsilon) && isNearZero(this.y, epsilon);
}
```

Matrix3 tiene `isZero()` sin parámetro epsilon (exacto):

```typescript
// Matrix3
public isZero(): boolean {
  return this.m00 === 0 && this.m01 === 0 && ...;
}
```

#### Recomendación

Esto es intencional: Vector2 combina ambas funcionalidades en un método. Las matrices mantienen la separación entre `isZero()` (exacto) y `nearZero(epsilon)` (aproximado).

Documentar esta diferencia pero no requiere cambios.

---

## 📈 ESTADÍSTICAS DE COBERTURA DE ANÁLISIS

| Aspecto analizado  | Vector2 | Matrix2 | Matrix3             |
| ------------------ | ------- | ------- | ------------------- |
| @category tags     | 102     | ~80     | ~100                |
| @since tags        | 98      | ~80     | ~100                |
| Static methods     | ✅      | ✅      | ✅                  |
| Instance methods   | ✅      | ✅      | ✅                  |
| Imports            | ✅      | ✅      | ⚠️ scalarSmoothStep |
| Frozen constants   | ✅      | ✅      | ✅                  |
| Safe/Unchecked     | ✅      | ✅      | ✅                  |
| Exception handling | ✅      | ✅      | ✅                  |

---

## 📝 NOTAS

- Este documento se actualiza a medida que se encuentran más anomalías
- Las correcciones deben validarse contra tests existentes
- Priorizar correcciones por severidad
- El bug de `smoothStep` en Matrix3 (#1) es la prioridad más alta ya que produce resultados incorrectos

---

### 17. Matrix2 omite keyword `public` en muchos métodos

**Severidad:** BAJA 🟢 (estilo/consistencia)
**Archivo:** `matrix2.ts`

#### Problema

Matrix2 omite el keyword `public` explícito en muchos métodos de instancia:

| Módulo  | Usos de `public` keyword |
| ------- | ------------------------ |
| Vector2 | 207                      |
| Matrix2 | 25                       |
| Matrix3 | 160                      |

Ejemplos en Matrix2 sin `public`:

- `getColumn(...)` - debería ser `public getColumn(...)`
- `setColumn(...)` - debería ser `public setColumn(...)`
- `toArray(...)` - debería ser `public toArray(...)`
- `equals(...)` - debería ser `public equals(...)`

#### Impacto

- Funcionalmente no hay diferencia (en TypeScript los métodos son públicos por defecto)
- Afecta la consistencia y legibilidad del código
- Dificulta la generación de documentación uniforme

#### Corrección propuesta

Añadir `public` keyword a todos los métodos de instancia que lo omiten en Matrix2.

---

## ⚠️ ANOMALÍAS ADICIONALES IDENTIFICADAS (Sesión 2)

### 19. Asimetría en métodos de interpolación

**Severidad:** BAJA 🟢 (inconsistencia)
**Archivos afectados:** `vector2.ts`, `matrix2.ts`, `matrix3.ts`

#### Problema

Los métodos de interpolación tienen naming inconsistente:

| Módulo  | `lerpClamped` | `lerpUnclamped` |
| ------- | ------------- | --------------- |
| Vector2 | ✅            | ❌              |
| Matrix2 | ❌            | ✅              |
| Matrix3 | ❌            | ✅              |

Vector2 usa `lerpClamped` mientras Matrix2/Matrix3 usan `lerpUnclamped`.

#### Recomendación

- **Opción A:** Añadir los métodos faltantes a cada módulo
- **Opción B:** Estandarizar naming (ambos módulos con ambos métodos)

El método base `lerp` en matrices NO clampea `t`, mientras en Vector2 el `lerp` tampoco lo hace.
La convención actual es coherente pero incompleta.

---

### 20. Diferencia en constantes readonly

**Severidad:** INFORMATIVO 📝

#### Observación

| Constante          | Vector2 | Matrix2 | Matrix3 |
| ------------------ | ------- | ------- | ------- |
| ZERO               | ✅      | ✅      | ✅      |
| ONE                | ✅      | ✅      | ✅      |
| IDENTITY           | N/A     | ✅      | ✅      |
| EPSILON\_\*        | ✅      | ✅      | ✅      |
| UNIT_X/UNIT_Y      | ✅      | N/A     | N/A     |
| ROTATE_90/180/270  | N/A     | ✅      | ✅      |
| FLIP_X/FLIP_Y      | N/A     | ✅      | ✅      |
| SCALE_2/SCALE_HALF | N/A     | ✅      | ✅      |

Esto es consistente con la naturaleza de cada tipo (vectores vs matrices).

---

## 📊 RESUMEN DE ESTADO FINAL

| Aspecto            | Vector2 | Matrix2 | Matrix3 |
| ------------------ | ------- | ------- | ------- |
| public static      | ✅ 100  | ✅ 67   | ✅ 72   |
| public instance    | ✅ 111  | ✅ 92   | ✅ 96   |
| @category tags     | ✅ 104  | ✅ 77   | ✅ 133  |
| Imports limpios    | ✅      | ✅      | ✅      |
| Frozen constants   | ✅      | ✅      | ✅      |
| Exception handling | ✅      | ✅      | ✅      |
| lerpClamped        | ✅      | ✅      | ✅      |
| lerpUnclamped      | ✅      | ✅      | ✅      |
| nearEquals inst    | ✅      | ✅      | ✅      |
| fma (static+inst)  | ✅      | ✅      | ✅      |
| assertMatrix3      | N/A     | N/A     | ✅      |

**Todos los tests pasan: 1763/1763 ✅**

---

## ✅ CORRECCIONES SESIÓN 3

| #   | Anomalía                                                    | Estado       |
| --- | ----------------------------------------------------------- | ------------ |
| 19  | `lerpUnclamped` añadido a Vector2 (static + instance)       | ✅ CORREGIDO |
| 20  | `lerpClamped` añadido a Matrix2/Matrix3 (static + instance) | ✅ CORREGIDO |
| 21  | `nearEquals()` instancia añadido a Matrix2/Matrix3          | ✅ CORREGIDO |
| 22  | `fma()` añadido a Matrix2/Matrix3 (static + instance)       | ✅ CORREGIDO |
| 23  | `assertMatrix3` añadido a validation/assert.ts              | ✅ CORREGIDO |

---

## 🔍 ANOMALÍAS SESIÓN 4 - ANÁLISIS EN PROFUNDIDAD

> **Estado:** 🔎 EN INVESTIGACIÓN
> **Metodología:** Análisis crítico antes de implementar cambios

---

### 24. `Symbol.iterator` falta en Matrix2 y Matrix3

**Severidad:** 🟡 Media  
**Archivos afectados:** `matrix2.ts`, `matrix3.ts`

#### Situación Actual

**Vector2** implementa `Symbol.iterator` permitiendo destructuring:

```typescript
// Vector2 - FUNCIONA
const v = new Vector2(3, 4);
const [x, y] = v; // ✅ x=3, y=4
for (const component of v) {
 /* ... */
} // ✅
```

**Matrix2 y Matrix3** NO lo implementan:

```typescript
// Matrix2/Matrix3 - NO FUNCIONA
const m = new Matrix2(1, 0, 0, 1);
const [m00, m01, m10, m11] = m; // ❌ TypeError
```

#### Análisis Crítico

**Argumentos A FAVOR de añadir:**

1. **Consistencia API** - Si Vector2 lo tiene, las matrices también deberían
2. **Interoperabilidad** - Facilita conversión a arrays: `[...matrix]`
3. **Patrones modernos ES6+** - Destructuring es idiomático en JS/TS

**Argumentos EN CONTRA de añadir:**

1. **Utilidad limitada** - Destructuring de 4-9 elementos es poco práctico
2. **Ambigüedad de orden** - ¿Row-major o column-major? Genera confusión
3. **Librerías de referencia**:
   - **gl-matrix**: NO implementa Symbol.iterator en matrices
   - **three.js Matrix3/Matrix4**: NO implementan iterador directo
   - **glm-js**: NO implementa iterador
4. **toArray() ya existe** - Provee la misma funcionalidad de forma explícita

#### Recomendación

**NO AÑADIR** `Symbol.iterator` a matrices.

**Justificación:**

- El estándar de la industria (gl-matrix, three.js) no lo implementa
- `toArray()` es más explícito y claro sobre el orden de elementos
- Destructuring de 4-9 elementos es anti-patrón (difícil de leer)
- Vector2 lo tiene porque destructuring `[x, y]` SÍ es práctico e idiomático

**Alternativa si se necesita:**

```typescript
// Ya disponible y claro
const arr = matrix.toArray();
const [m00, m01, m10, m11] = matrix.toArray();
```

---

### 25. `@category` inconsistente: "Numeric Transforms" vs "Numeric Transform"

**Severidad:** 🟢 Baja (cosmética/documentación)  
**Archivos afectados:** `matrix2.ts`

#### Situación Actual

| Módulo  | Categoría usada      |
| ------- | -------------------- | ---------------------------- |
| Vector2 | `Numeric Transform`  |
| Matrix2 | `Numeric Transforms` | ← **INCONSISTENTE (plural)** |
| Matrix3 | `Numeric Transform`  |

#### Análisis

Esta es una inconsistencia tipográfica menor. El estándar en el proyecto es usar **singular**:

- `@category Factory` (no "Factories")
- `@category Comparison` (no "Comparisons")
- `@category Arithmetic` (no "Arithmetics")

#### Recomendación

**CORREGIR** - Cambiar `Numeric Transforms` → `Numeric Transform` en Matrix2.

**Impacto:** Solo afecta documentación generada.

---

### 26. `@category` inconsistente: "Computed Values" vs "Computed"

**Severidad:** 🟢 Baja (cosmética/documentación)  
**Archivos afectados:** `matrix2.ts`, `matrix3.ts`

#### Situación Actual

| Módulo  | Categoría usada   |
| ------- | ----------------- | ------------------- |
| Vector2 | _(sin categoría)_ |
| Matrix2 | `Computed Values` |
| Matrix3 | `Computed`        | ← **INCONSISTENTE** |

#### Análisis

Vector2 no usa categorías para sus getters derivados (`normalized`, `negated`, etc.).

**Opciones:**

1. Estandarizar a `Computed` (más conciso)
2. Estandarizar a `Computed Values` (más descriptivo)
3. Eliminar categoría (como Vector2)

#### Recomendación

**CORREGIR** - Estandarizar a `Computed` (más conciso, alineado con Matrix3).

Preferimos `Computed` porque:

- Es más conciso
- Matrix3 ya lo usa (más líneas de código que Matrix2)
- Sigue el patrón de nombres cortos del proyecto

---

### 27. `multiplyScalar` falta en Vector2

**Severidad:** 🟢 Baja (alias opcional)  
**Archivos afectados:** `vector2.ts`

#### Situación Actual

| Método              | Vector2 | Matrix2 | Matrix3 |
| ------------------- | ------- | ------- | ------- |
| `scale(s)`          | ✅      | ✅      | ✅      |
| `multiplyScalar(s)` | ❌      | ✅      | ✅      |

Las matrices tienen `multiplyScalar` como alias de `scale`.

#### Análisis Crítico

**Argumentos A FAVOR de añadir:**

1. **Consistencia** - Mismo nombre que matrices
2. **Nomenclatura matemática** - "multiply by scalar" es término formal

**Argumentos EN CONTRA de añadir:**

1. **Redundancia** - `scale()` ya hace exactamente lo mismo
2. **Inflación de API** - Más métodos = más documentación = más mantenimiento
3. **Convención establecida**:
   - **three.js Vector2**: usa `multiplyScalar()` sin `scale()`
   - **gl-matrix vec2**: usa `scale()` sin `multiplyScalar()`
   - Nuestro Vector2 ya eligió `scale()` como primario

#### Recomendación

**NO AÑADIR** `multiplyScalar` a Vector2.

**Justificación:**

- `scale()` es más conciso y semánticamente claro para vectores
- Añadir alias infla la API sin beneficio real
- La asimetría es intencional: vectores "se escalan", matrices "multiplican por escalar"

**Si un usuario necesita uniformidad:**

```typescript
// Ya pueden hacer
vector.scale(s); // Vector2
matrix.scale(s); // Matrix2/Matrix3
// O
matrix.multiplyScalar(s); // Solo matrices
```

---

### 28. `angularToLinearVelocity` con `@category Physics`

**Severidad:** 📝 REQUIERE DECISIÓN ARQUITECTÓNICA  
**Archivos afectados:** `vector2.ts`

#### Situación Actual

```typescript
/**
 * Converts angular velocity to linear velocity at a position.
 * Useful in physics for calculating velocity at a point on a rotating body.
 *
 * @param omega - Angular velocity in radians per second.
 * @param r - Position vector from center of rotation.
 * @returns Linear velocity v = ω × r = (-ω*r.y, ω*r.x).
 *
 * @remarks
 * In 2D, angular velocity ω is a scalar (perpendicular to the plane).
 * The cross product ω × r produces a tangent velocity.
 * Equivalent to `Vector2.crossSV(omega, r, out)`.
 *
 * @category Physics
 * @since 0.9.0
 */
public static angularToLinearVelocity(
  omega: number,
  r: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  return Vector2.crossSV(omega, r, out);
}
```

#### Análisis Crítico

**El método ES matemáticamente puro:**

- Es simplemente un alias de `crossSV(omega, r)` → `(-ω*r.y, ω*r.x)`
- El cálculo subyacente es el producto cruz 2D escalar-vector

**PERO la nomenclatura y documentación son de física:**

- Nombre: "angular to linear velocity"
- Parámetros: `omega` (velocidad angular), `r` (radio)
- Descripción: "Useful in physics..."
- Categoría: `@category Physics`

#### Opciones

**Opción A: MANTENER (status quo)**

Pros:

- Es un wrapper conveniente con nombre descriptivo
- No afecta funcionalidad
- Usuarios de física lo encuentran fácilmente

Contras:

- Viola principio "pure mathematical base"
- Única categoría `@category Physics` en Vector2
- Mezcla responsabilidades

**Opción B: ELIMINAR**

Pros:

- Mantiene pureza matemática del módulo
- `crossSV()` hace exactamente lo mismo

Contras:

- Breaking change menor
- Usuarios deben migrar a `crossSV()`

**Opción C: RECATEGORIZAR**

Cambiar de:

```typescript
* @category Physics
```

A:

```typescript
* @category Transform
```

Y ajustar documentación para ser más neutral:

```typescript
/**
 * Cross product of scalar with vector: s × v = (-s*v.y, s*v.x).
 * Alias for crossSV with semantic parameter names.
 *
 * @param omega - Scalar multiplier (e.g., angular rate).
 * @param r - Vector to cross with.
 * @returns Perpendicular scaled vector (CCW rotation).
 *
 * @remarks
 * Mathematically equivalent to `crossSV(omega, r)`.
 * Common use case: tangent velocity from rotation.
 *
 * @category Transform
 * @since 0.9.0
 */
```

#### Recomendación

**OPCIÓN C: RECATEGORIZAR** con documentación neutral.

**Justificación:**

1. Mantiene funcionalidad útil
2. No es breaking change
3. Remueve categoría `Physics` del módulo base
4. Documentación describe matemática, no física específicamente
5. Usuario puede interpretar uso según contexto

---

## 📋 RESUMEN DE ACCIONES

| #   | Anomalía                                          | Acción           | Estado        |
| --- | ------------------------------------------------- | ---------------- | ------------- |
| 24  | `Symbol.iterator` falta en matrices               | ❌ NO AÑADIR     | ⏭️ DESCARTADO |
| 25  | `Numeric Transforms` → `Numeric Transform`        | ✅ CORREGIR      | ✅ APLICADO   |
| 26  | `Computed Values` → `Computed`                    | ✅ CORREGIR      | ✅ APLICADO   |
| 27  | `multiplyScalar` falta en Vector2                 | ❌ NO AÑADIR     | ⏭️ DESCARTADO |
| 28  | `angularToLinearVelocity` con `@category Physics` | ✏️ RECATEGORIZAR | ✅ APLICADO   |
| 29  | `Transformation` → `Transform` en Matrix3         | ✅ CORREGIR      | ✅ APLICADO   |
| 30  | `Basic Mutators` → `Mutator` en Matrix2           | ✅ CORREGIR      | ✅ APLICADO   |

---

## ✅ CAMBIOS APLICADOS SESIÓN 4

### 25. Matrix2: `@category Numeric Transforms` → `@category Numeric Transform`

**Archivos modificados:** `matrix2.ts`  
**Cambios:** 9 ocurrencias corregidas

### 26. Matrix2: `@category Computed Values` → `@category Computed`

**Archivos modificados:** `matrix2.ts`  
**Cambios:** 5 ocurrencias corregidas

### 28. Vector2: `angularToLinearVelocity` recategorizado

**Archivos modificados:** `vector2.ts`

**Antes:**

```typescript
/**
 * Converts angular velocity to linear velocity at a position.
 * Useful in physics for calculating velocity...
 * @category Physics
 */
```

**Después:**

```typescript
/**
 * Computes tangent vector from scalar rotation rate and radius vector.
 * Mathematically equivalent to crossSV(omega, r)...
 * @category Transform
 */
```

### 29. Matrix3: `@category Transformation` → `@category Transform`

**Archivos modificados:** `matrix3.ts`  
**Cambios:** 3 ocurrencias corregidas

### 30. Matrix2: `@category Basic Mutators` → `@category Mutator`

**Archivos modificados:** `matrix2.ts`  
**Cambios:** 4 ocurrencias corregidas (consistencia con Matrix3)

---

## 📊 ESTADO FINAL CONSOLIDADO

| Aspecto                 | Vector2     | Matrix2     | Matrix3     |
| ----------------------- | ----------- | ----------- | ----------- |
| `@category` consistente | ✅          | ✅          | ✅          |
| Sin `@category Physics` | ✅          | ✅          | ✅          |
| `Numeric Transform`     | ✅ singular | ✅ singular | ✅ singular |
| `Computed`              | N/A         | ✅          | ✅          |
| `Transform` (no plural) | ✅          | N/A         | ✅          |
| `Mutator` (no "Basic")  | N/A         | ✅          | ✅          |

### Categorías Estandarizadas (Convención)

| Categoría           | Descripción                                |
| ------------------- | ------------------------------------------ |
| `Arithmetic`        | Operaciones aritméticas (+, -, \*, /)      |
| `Comparison`        | Comparaciones y validaciones               |
| `Computed`          | Getters derivados (determinant, trace)     |
| `Constraint`        | Limitación de valores (clamp, limit)       |
| `Conversion`        | Conversiones de formato (toArray, toJSON)  |
| `Core`              | Definición de clase                        |
| `Direction`         | Ángulos y direcciones (Vector2)            |
| `Factory`           | Métodos de creación estáticos              |
| `Geometry`          | Medidas geométricas (length, distance)     |
| `Helpers`           | Funciones auxiliares                       |
| `Interpolation`     | lerp, slerp, smoothStep                    |
| `Matrix Operations` | Operaciones matriciales (transpose, mult)  |
| `Mutator`           | Métodos básicos de mutación (set, copy)    |
| `Numeric Transform` | Transformaciones numéricas (floor, abs)    |
| `Transform`         | Transformaciones geométricas (rotate, etc) |

**Todos los tests pasan: 1763/1763 ✅**

---

## 🔍 ANOMALÍAS SESIÓN 5 - ANÁLISIS EN PROFUNDIDAD

> **Metodología:** Investigación exhaustiva, contraste con librerías externas y decisiones anteriores
> **Principios:** SOLID, DRY, Clean Code, consistencia con el ecosistema

---

### 31. `toString(precision)` sin default en Vector2

**Severidad:** 🟡 Media  
**Archivos afectados:** `vector2.ts`

#### Situación Actual

| Módulo     | Firma                          |
| ---------- | ------------------------------ |
| Vector2    | `toString(precision?: number)` |
| Matrix2    | `toString(precision = 4)`      |
| Matrix3    | `toString(precision = 4)`      |
| Complex    | `toString(precision = 4)`      |
| Rotation2  | `toString(precision = 4)`      |
| Interval   | `toString(precision = 4)`      |
| Transform2 | `toString(precision = 2)`      |

Vector2 es el **ÚNICO** sin default.

#### Comportamiento diferenciado

```typescript
// Vector2 - sin default
v.toString(); // "Vector2(3.141592653589793, 2.718281828459045)"
v.toString(4); // "Vector2(3.1416, 2.7183)"

// Matrix2 - con default
m.toString(); // "Matrix2(\n  1.0000, 0.0000\n  0.0000, 1.0000\n)"
```

#### Análisis de Librerías Externas

| Librería  | Comportamiento               |
| --------- | ---------------------------- |
| three.js  | Sin precision parameter      |
| gl-matrix | `str()` sin precision        |
| glm       | `to_string()` precision fija |

#### Decisión

✅ **CORREGIR** - Añadir `precision = 4` para consistencia.

**Justificación:**

1. **DRY/Consistencia**: 6 de 7 módulos usan default
2. **Principio de menor sorpresa**: Usuarios esperan uniformidad
3. **Legibilidad**: 4 decimales es estándar del proyecto

---

### 32. `static nearEquals` falta en Matrix2 y Matrix3

**Severidad:** 🟡 Media  
**Archivos afectados:** `matrix2.ts`, `matrix3.ts`

#### Situación Actual

| Método                | Vector2 | Matrix2 | Matrix3 |
| --------------------- | ------- | ------- | ------- |
| `static equals`       | ✅      | ✅      | ✅      |
| `static nearEquals`   | ✅      | ❌      | ❌      |
| `instance nearEquals` | ✅      | ✅      | ✅      |

#### Análisis Semántico Crítico

**Problema de fondo - Semántica de `equals` inconsistente:**

```typescript
// Vector2: equals = EXACTO
Vector2.equals(a, b); // a.x === b.x && a.y === b.y

// Matrix2/Matrix3: equals = CON TOLERANCIA
Matrix2.equals(a, b); // usa nearEquals internamente
Matrix2.equals(a, b, 0); // Para comparación exacta
```

#### Análisis de Librerías Externas

| Librería  | `equals`       | Con tolerancia            |
| --------- | -------------- | ------------------------- |
| gl-matrix | exacto (`===`) | `equals(a, b)` + epsilon  |
| three.js  | exacto (`===`) | No tiene                  |
| glm       | exacto (`==`)  | `epsilonEqual(a, b, eps)` |

**Conclusión:** La industria usa `equals` = exacto.

#### Decisión

✅ **AÑADIR** `static nearEquals` + `static exactEquals` a matrices.

**Justificación:**

1. **No breaking change**: Preserva API existente
2. **Simetría**: Mismos métodos en todos los módulos
3. **Claridad**: `exactEquals` para comparación estricta

**Implementación propuesta:**

```typescript
// Matrix2
public static nearEquals(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
  epsilon: number = EPSILON,
): boolean {
  return Matrix2.equals(a, b, epsilon);
}

public static exactEquals(
  a: ReadonlyMatrix2Like,
  b: ReadonlyMatrix2Like,
): boolean {
  return a.m00 === b.m00 && a.m01 === b.m01 &&
         a.m10 === b.m10 && a.m11 === b.m11;
}
```

---

### 33. Parámetro `epsilon` vs `tolerance` inconsistente

**Severidad:** 🟢 Baja (naming)  
**Archivos afectados:** `vector2.ts`

#### Situación Actual

```typescript
// Vector2 STATIC - usa "epsilon"
public static nearEquals(a, b, epsilon = EPSILON)

// Vector2 INSTANCE - usa "tolerance" ← INCONSISTENTE
public nearEquals(v, tolerance = EPSILON)
```

#### Convención del Proyecto

El módulo `auxiliary/scalar/comparison.ts` usa **`epsilon`** en TODOS sus métodos:

```typescript
function nearEquals(a, b, epsilon = EPSILON);
function isNearZero(value, epsilon = EPSILON);
function lessThan(a, b, epsilon = EPSILON);
```

#### Decisión

✅ **CORREGIR** - Cambiar `tolerance` → `epsilon`.

**Justificación:**

1. **DRY**: Consistencia con módulo auxiliar
2. **Industria**: Estándar es `epsilon`
3. **Interno**: Ya usamos `epsilon` en métodos estáticos

---

### 34. `divideScalarUnchecked` falta en matrices

**Severidad:** 🟢 Baja

#### Situación Actual

| Variante                | Vector2 | Matrix2 | Matrix3 |
| ----------------------- | ------- | ------- | ------- |
| `divideScalar`          | ✅      | ✅      | ✅      |
| `divideScalarSafe`      | ✅      | ✅      | ✅      |
| `divideScalarUnchecked` | ✅      | ❌      | ❌      |

#### Análisis

El patrón `*Unchecked` es para hot paths donde el caller garantiza validez.
Matrices rara vez se dividen por escalar en hot paths.

#### Decisión

⏭️ **NO AÑADIR** - YAGNI (You Aren't Gonna Need It)

---

### 35. Tipo retorno getters column/row inconsistente

**Severidad:** 📝 Nota

```typescript
// Matrix2 devuelve Vector2
public get column0(): Vector2

// Matrix3 devuelve tupla (no existe Vector3)
public get column0(): [number, number, number]
```

#### Decisión

⏭️ **MANTENER** - La diferencia es intencional.

**Razón:** No existe Vector3 en el proyecto. Crear uno solo para getters sería over-engineering.

---

### 36. Instance `exactEquals` falta en matrices

**Severidad:** 🟡 Media

Para completar simetría, también añadir método de instancia:

```typescript
// Matrix2/Matrix3 instance
public exactEquals(other: ReadonlyMatrix2Like): boolean {
  return Matrix2.exactEquals(this, other);
}
```

---

## ✅ CAMBIOS APLICADOS SESIÓN 5

### Decisión Arquitectónica: Semántica de `equals` Unificada

Se adoptó la convención de la industria (gl-matrix, three.js, glm):

| Método       | Comportamiento                           |
| ------------ | ---------------------------------------- |
| `equals`     | Comparación **EXACTA** (`===`)           |
| `nearEquals` | Comparación con **TOLERANCIA** (epsilon) |

**Breaking Change justificado:** Antes, `Matrix2/Matrix3.equals` usaba tolerancia por defecto,
inconsistente con Vector2 y la industria. Ahora los 3 módulos son semánticamente idénticos.

---

### 31. Vector2: `toString(precision = 4)`

**Antes:**

```typescript
public toString(precision?: number): string
// v.toString() → "Vector2(3.141592653589793, 2.718281828459045)"
```

**Después:**

```typescript
public toString(precision = 4): string
// v.toString() → "Vector2(3.1416, 2.7183)"
```

---

### 32. Matrix2/Matrix3: `equals()` exacto + `static nearEquals()`

**Antes (inconsistente):**

```typescript
// Matrix2/Matrix3 - usaba tolerancia
public static equals(a, b, epsilon = EPSILON)
```

**Después (consistente con Vector2 e industria):**

```typescript
// Comparación exacta
public static equals(a: ReadonlyMatrix2Like, b: ReadonlyMatrix2Like): boolean {
  return a.m00 === b.m00 && a.m01 === b.m01 && a.m10 === b.m10 && a.m11 === b.m11;
}

// Comparación con tolerancia
public static nearEquals(a, b, epsilon = EPSILON): boolean {
  return scalarNearEquals(a.m00, b.m00, epsilon) && ...;
}
```

---

### 33. Unificación de parámetro `epsilon`

**Antes (inconsistente):**

```typescript
// Vector2 static
public static nearEquals(a, b, epsilon = EPSILON)
// Vector2 instance
public nearEquals(v, tolerance = EPSILON)  // ← "tolerance"
```

**Después (unificado):**

```typescript
public nearEquals(v, epsilon = EPSILON)  // ← Ahora "epsilon"
```

---

### 34-37. Decisiones de No-Cambio

| #   | Anomalía                | Decisión        | Razón                            |
| --- | ----------------------- | --------------- | -------------------------------- |
| 34  | `divideScalarUnchecked` | ⏭️ NO AÑADIR    | YAGNI - matrices no en hot paths |
| 35  | Tipo retorno column/row | ⏭️ MANTENER     | No existe Vector3                |
| 36  | Instance `exactEquals`  | ⏭️ NO NECESARIO | `equals()` ahora es exacto       |
| 37  | `isZero` vs `nearZero`  | ⏭️ MANTENER     | Funciona correctamente           |

---

## 📊 ESTADO FINAL CONSOLIDADO

| Aspecto                   | Vector2      | Matrix2      | Matrix3      |
| ------------------------- | ------------ | ------------ | ------------ |
| `equals()` semántica      | ✅ EXACTO    | ✅ EXACTO    | ✅ EXACTO    |
| `nearEquals()` static     | ✅           | ✅ AÑADIDO   | ✅ AÑADIDO   |
| `nearEquals()` instance   | ✅           | ✅           | ✅           |
| Parámetro `epsilon`       | ✅ unificado | ✅ unificado | ✅ unificado |
| `toString(precision = 4)` | ✅ CORREGIDO | ✅           | ✅           |

**Todos los tests pasan: 1763/1763 ✅**
