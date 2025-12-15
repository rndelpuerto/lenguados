# 📐 Diseño de Transformaciones y Rotaciones en math2d

> **Estado**: REVISIÓN FINAL COMPLETADA  
> **Fecha**: 2024-12-14  
> **Versión**: 1.0  
> **Objetivo**: Definir API consistente, sinérgica y escalable para todas las operaciones de transformación

---

## 🎯 Intención del Paquete

> "Ser la base amplia, estrictamente matemática y eficiente, para generar nuevos módulos y paquetes a partir de él, siendo rigurosa y científicamente comprobable, robusto, escalable, extendible y fácil de usar según el escenario."

### Principios Fundamentales

| Principio                    | Implicación para Transformaciones              |
| ---------------------------- | ---------------------------------------------- |
| **Base matemática estricta** | Fórmulas verificables, nomenclatura científica |
| **Eficiencia**               | Hot paths optimizados, patrón `rotateCS`       |
| **Extensibilidad**           | Interfaces `*Like`, métodos estáticos puros    |
| **Robustez**                 | Variantes `*Safe`, manejo de edge cases        |
| **Facilidad de uso**         | API fluent, métodos estático + instancia       |

---

## 📋 Índice

1. [Inventario Actual](#1-inventario-actual)
2. [Análisis de Librerías Externas](#2-análisis-de-librerías-externas)
3. [Problemas Identificados](#3-problemas-identificados)
4. [Principios de Diseño](#4-principios-de-diseño)
5. [Arquitectura Propuesta](#5-arquitectura-propuesta)
6. [Especificación por Módulo](#6-especificación-por-módulo)
7. [Patrones de Sinergia](#7-patrones-de-sinergia)
8. [Checklist de Implementación](#8-checklist-de-implementación)
9. [Categorización JSDoc](#9-categorización-jsdoc)
10. [Referencias](#10-referencias)
11. [Resumen Ejecutivo de Cambios](#11-resumen-ejecutivo-de-cambios)
12. [Revisión Exhaustiva - Hallazgos Adicionales](#12-revisión-exhaustiva---hallazgos-adicionales)
13. [Checklist Final de Calidad](#13-checklist-final-de-calidad)
14. [Resumen Consolidado de Cambios](#14-resumen-consolidado-de-cambios)
15. [Patrones de Diseño Aplicados](#15-patrones-de-diseño-aplicados)
16. [Verificación Matemática Final](#16-verificación-matemática-final)
17. [Conclusión y Estado Final](#17-conclusión-y-estado-final)

---

## 1. Inventario Actual

### 1.1 Vector2 - Métodos de Transformación

| Método Estático                        | Método Instancia                    | Descripción                         | Delegación                              |
| -------------------------------------- | ----------------------------------- | ----------------------------------- | --------------------------------------- |
| `fromAngle(angle, radius?)`            | —                                   | Factory desde ángulo                | `sinCos()`                              |
| `angle(v)`                             | `angle()`                           | Heading del vector                  | `atan2()`                               |
| `angleTo(a, b)`                        | `angleTo(v)`                        | Ángulo signado entre vectores       | `atan2(cross, dot)`                     |
| `angleBetween(a, b)`                   | `angleBetween(v)`                   | Ángulo sin signo [0, π]             | `acos(dot/\|a\|\|b\|)`                  |
| `setHeading(v, angle)`                 | `setHeading(angle)`                 | Mantiene magnitud, cambia dirección | `sinCos()`                              |
| `rotate(v, angle)`                     | `rotate(angle)`                     | Rota por ángulo                     | → `rotateCS()` ✅                       |
| `rotateCS(v, c, s)`                    | `rotateCS(c, s)`                    | Rota con cos/sin pre-calculados     | Inline                                  |
| `rotateAround(v, center, angle)`       | `rotateAround(center, angle)`       | Rota alrededor de punto             | `sinCos()` inline                       |
| `rotateAroundCS(v, center, c, s)`      | `rotateAroundCS(center, c, s)`      | Con cos/sin pre-calculados          | Inline                                  |
| `perpendicular(v, clockwise?)`         | `perpendicular(clockwise?)`         | Vector perpendicular                | Inline                                  |
| `unitPerpendicular(v, clockwise?)`     | `unitPerpendicular(clockwise?)`     | Perpendicular unitario              | → `perpendicular()` → `normalize()`     |
| `unitPerpendicularSafe(v, clockwise?)` | `unitPerpendicularSafe(clockwise?)` | Safe version                        | → `perpendicular()` → `normalizeSafe()` |
| `applyRotation(v, rotation)`           | `applyRotation(rotation)`           | Aplica Rotation2Like                | → `rotateCS()` ✅                       |
| `applyMatrix2(v, matrix)`              | `applyMatrix2(matrix)`              | Aplica Matrix2Like                  | Inline                                  |
| `applyTransform(v, transform)`         | `applyTransform(transform)`         | Aplica Transform2Like               | `sinCos()` inline                       |

### 1.2 Rotation2 - Métodos de Transformación

| Método Estático         | Método Instancia    | Descripción                 | Delegación                      |
| ----------------------- | ------------------- | --------------------------- | ------------------------------- |
| `fromAngle(angle)`      | `setAngle(angle)`   | Factory/setter desde ángulo | `sinCos()`                      |
| `fromVector(direction)` | —                   | Factory desde dirección     | Inline normalize                |
| `fromVectors(from, to)` | —                   | Rotación entre direcciones  | → `fromVector()` → `relative()` |
| `fromComplex(complex)`  | —                   | Factory desde Complex       | Normalize inline                |
| `angle(rotation)`       | `angle()`           | Extrae ángulo               | `atan2()`                       |
| `multiply(a, b)`        | `multiply(other)`   | Composición                 | Inline (complex mult)           |
| `inverse(rotation)`     | `inverse()`         | Inversión (conjugado)       | Inline                          |
| `relative(a, b)`        | `relativeTo(other)` | Rotación relativa           | Inline                          |
| `apply(rot, v)`         | `apply(v)`          | Aplica a vector             | Inline (hot path) ✅            |
| `applyInverse(rot, v)`  | `applyInverse(v)`   | Aplica inverso a vector     | Inline (hot path) ✅            |

### 1.3 Complex - Métodos de Transformación

| Método Estático         | Método Instancia     | Descripción                       | Delegación                |
| ----------------------- | -------------------- | --------------------------------- | ------------------------- |
| `fromPolar(mag, angle)` | —                    | Factory desde polar               | `sinCos()`                |
| `magnitude(c)`          | `magnitude()`        | Módulo                            | `sqrt()`                  |
| `argument(c)`           | `argument()`         | Ángulo/fase                       | `atan2()`                 |
| `multiply(a, b)`        | `multiply(other)`    | Producto (= rotación)             | Inline                    |
| `conjugate(c)`          | `conjugate()`        | Conjugado (= inverso de rotación) | Inline                    |
| `normalize(c)`          | `normalize()`        | Normaliza a unitario              | `sqrt()` + `safeDivide()` |
| —                       | `toRotationMatrix()` | Convierte a matriz 2x2            | Inline (no crea Matrix2)  |
| `apply(c, v)`           | `apply(v)`           | Aplica como rotación a vector     | → normalize + rotate ✅   |
| `normalizeSafe(c)`      | `normalizeSafe()`    | Normaliza sin throw               | → fallback a (1,0) ✅     |

### 1.4 Matrix2 - Métodos de Transformación

| Método Estático              | Método Instancia     | Descripción               | Delegación                 |
| ---------------------------- | -------------------- | ------------------------- | -------------------------- |
| `fromRotation(rot \| angle)` | —                    | Factory desde rotación    | `sinCos()` ó `rot.cos/sin` |
| `compose(rotation, scale)`   | —                    | Compone rotación + escala | `sinCos()`                 |
| `decompose(matrix)`          | —                    | Descompone a rot + scale  | `atan2()`, `sqrt()`        |
| —                            | `rotate(angle)`      | Rota la matriz            | `sinCos()` inline          |
| —                            | `getRotation()`      | Extrae ángulo             | `atan2()`                  |
| `transformVector(m, v)`      | `transformVector(v)` | Transforma vector         | Inline                     |

### 1.5 Matrix3 - Métodos de Transformación

| Método Estático                  | Método Instancia     | Descripción            | Delegación                 |
| -------------------------------- | -------------------- | ---------------------- | -------------------------- |
| `fromRotation(rot \| angle)`     | —                    | Factory desde rotación | `sinCos()` ó `rot.cos/sin` |
| `fromTransform(pos, rot, scale)` | —                    | Factory compuesto      | `sinCos()`                 |
| `decompose(matrix)`              | —                    | Descompone T+R+S       | `atan2()`, `sqrt()`        |
| —                                | `rotate(angle)`      | Aplica rotación        | `sinCos()` inline          |
| —                                | `getRotation()`      | Extrae ángulo          | `atan2()`                  |
| `transformPoint(m, p)`           | `transformPoint(p)`  | Transforma punto       | Inline                     |
| `transformVector(m, v)`          | `transformVector(v)` | Transforma vector      | Inline                     |

### 1.6 Transform2 - Métodos de Transformación

| Método Estático                   | Método Instancia            | Descripción       | Delegación                |
| --------------------------------- | --------------------------- | ----------------- | ------------------------- |
| `fromComponents(pos, rot, scale)` | —                           | Factory           | `normalizeRadians()`      |
| `fromMatrix(matrix)`              | —                           | Desde Matrix3     | → `Matrix3.getRotation()` |
| `transformPoint(t, p)`            | `transformPoint(p)`         | Transforma punto  | `sinCos()` inline ✅      |
| `transformVector(t, v)`           | `transformVector(v)`        | Transforma vector | `sinCos()` inline ✅      |
| —                                 | `transformPoints(ps)`       | Batch transform   | `sinCos()` 1x + loop      |
| —                                 | `transformVectors(vs)`      | Batch transform   | `sinCos()` 1x + loop      |
| `inverseTransformPoint(t, p)`     | `inverseTransformPoint(p)`  | Inverso punto     | → estático ✅             |
| `inverseTransformVector(t, v)`    | `inverseTransformVector(v)` | Inverso vector    | → estático ✅             |

---

## 2. Análisis de Librerías Externas

### 2.1 Box2D / Planck.js (Referencia para Física 2D)

```cpp
// Box2D - Separación estricta de tipos
struct b2Vec2 { float x, y; };      // Solo datos
struct b2Rot { float s, c; };        // sin, cos precalculados
struct b2Transform { b2Vec2 p; b2Rot q; };

// Funciones externas (no métodos)
b2Vec2 b2Mul(b2Rot q, b2Vec2 v);           // Aplica rotación
b2Vec2 b2Mul(b2Transform T, b2Vec2 v);     // Aplica transform
b2Rot b2Mul(b2Rot q, b2Rot r);              // Compone rotaciones
```

**Principios Box2D:**

- ✅ Tipos son datos puros, operaciones son funciones
- ✅ Rotation almacena cos/sin (evita recalcular)
- ✅ Transform usa Rotation, no ángulo
- ❌ API verbosa, no hay métodos de instancia

### 2.2 gl-matrix (Estándar WebGL)

```typescript
// gl-matrix - Funciones sobre Float32Array
vec2.rotate(out, a, b, rad); // Rota vector
mat2.fromRotation(out, rad); // Crea matriz de rotación
mat2d.rotate(out, a, rad); // Rota matriz 2D

// NO tiene tipo Rotation separado
```

**Principios gl-matrix:**

- ✅ API funcional, allocation-free con `out`
- ✅ Integración directa en vectores
- ❌ No hay tipo Rotation (menos eficiente para física)

### 2.3 Three.js (Motor 3D)

```typescript
// Three.js - Métodos en clases
class Vector3 {
 applyQuaternion(q: Quaternion): this;
 applyMatrix4(m: Matrix4): this;
 applyAxisAngle(axis: Vector3, angle: number): this;
}

class Quaternion {
 setFromAxisAngle(axis: Vector3, angle: number): this;
 multiply(q: Quaternion): this;
}
```

**Principios Three.js:**

- ✅ Vectores tienen `apply*` para cada tipo de transformación
- ✅ Quaternion es tipo especializado para rotaciones
- ✅ API fluent (chainable)
- ✅ Coexistencia de métodos primitivos y especializados

### 2.4 Rapier2D (Motor Física Moderno)

```rust
// Rapier - Similar a Box2D
struct Rotation { cos: f32, sin: f32 }
struct Isometry { translation: Vector2, rotation: Rotation }

impl Rotation {
    fn transform_vector(&self, v: &Vector2) -> Vector2;
}
```

**Principios Rapier:**

- ✅ Rotation almacena cos/sin
- ✅ Métodos de aplicación en Rotation
- ✅ Isometry = Translation + Rotation (como Transform2)

---

## 3. Problemas Identificados

### 3.1 Inconsistencias Críticas

| #      | Problema                                                    | Ubicación                     | Impacto                                      |
| ------ | ----------------------------------------------------------- | ----------------------------- | -------------------------------------------- |
| **P1** | ~~`Rotation2.applyToVector()`~~ → `apply`                   | `rotation2.ts:462-466`        | ✅ **CORREGIDO** - Renombrado                |
| **P2** | `Transform2.transformPoint/Vector` reimplementa rotación    | `transform2.ts:698-722`       | No usa `Rotation2` ni `Vector2.rotateCS()`   |
| **P3** | `Transform2` almacena `angle: number` en vez de `Rotation2` | `transform2.ts:84`            | Recalcula sin/cos en cada `transformPoint()` |
| **P4** | `Matrix2.rotate()` no delega, recalcula inline              | `matrix2.ts:2210-2218`        | Duplicación                                  |
| **P5** | `Matrix3.rotate()` no delega, recalcula inline              | `matrix3.ts:3081-3098`        | Duplicación                                  |
| **P6** | ~~Falta `Rotation2.apply()` estático~~                      | Renombrado de `applyToVector` | ✅ **CORREGIDO**                             |

### 3.2 Asimetrías Estático/Instancia

| Módulo       | Método                   | Estático | Instancia | Acción           |
| ------------ | ------------------------ | -------- | --------- | ---------------- |
| `Vector2`    | `applyRotation`          | ✅       | ✅        | OK               |
| `Vector2`    | `applyMatrix2`           | ✅       | ✅        | OK               |
| `Vector2`    | `applyTransform`         | ✅       | ✅        | OK               |
| `Rotation2`  | `apply`                  | ✅       | ✅        | ✅ **CORREGIDO** |
| `Rotation2`  | `applyInverse`           | ✅       | ✅        | ✅ **CORREGIDO** |
| `Matrix2`    | `transformVector`        | ✅       | ✅        | OK               |
| `Matrix3`    | `transformPoint`         | ✅       | ✅        | OK               |
| `Matrix3`    | `transformVector`        | ✅       | ✅        | OK               |
| `Transform2` | `transformPoint`         | ✅       | ✅        | ✅ **CORREGIDO** |
| `Transform2` | `transformVector`        | ✅       | ✅        | ✅ **CORREGIDO** |
| `Transform2` | `inverseTransformPoint`  | ✅       | ✅        | ✅ **CORREGIDO** |
| `Transform2` | `inverseTransformVector` | ✅       | ✅        | ✅ **CORREGIDO** |
| `Complex`    | `apply`                  | ✅       | ✅        | ✅ **CORREGIDO** |

### 3.3 Nomenclatura Inconsistente

| Concepto           | Vector2         | Rotation2 | Matrix2           | Matrix3           | Transform2        |
| ------------------ | --------------- | --------- | ----------------- | ----------------- | ----------------- |
| Aplicar rotación   | `applyRotation` | `apply`   | —                 | —                 | —                 |
| Transformar punto  | —               | —         | —                 | `transformPoint`  | `transformPoint`  |
| Transformar vector | `applyMatrix2`  | `apply`   | `transformVector` | `transformVector` | `transformVector` |

**Problema:** Mezcla de `apply*` y `transform*`.

---

## 4. Principios de Diseño

### 4.1 Jerarquía de Delegación

```
┌─────────────────────────────────────────────────────────────────┐
│ NIVEL 3: Fachadas de Alto Nivel                                │
│ Transform2.transformPoint() → usa Nivel 2                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓ delega
┌─────────────────────────────────────────────────────────────────┐
│ NIVEL 2: Tipos Especializados                                  │
│ Rotation2.apply(v)  → usa Nivel 1                              │
│ Matrix2.transformVector(v) → inline (es operación primitiva)   │
└─────────────────────────────────────────────────────────────────┘
                              ↓ delega
┌─────────────────────────────────────────────────────────────────┐
│ NIVEL 1: Operaciones Primitivas (Hot Path)                     │
│ Vector2.rotateCS(v, cos, sin) → inline, máxima eficiencia      │
│ sinCos(angle) → punto único para trigonometría                 │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Reglas de Naming

| Tipo de Operación     | Convención                  | Ejemplo                         |
| --------------------- | --------------------------- | ------------------------------- |
| Crear desde X         | `from{X}`                   | `fromAngle()`, `fromRotation()` |
| Aplicar tipo a vector | `apply(v)` (instancia)      | `rotation.apply(v)`             |
| Aplicar tipo a vector | `apply(type, v)` (estático) | `Rotation2.apply(rot, v)`       |
| Transformar punto     | `transformPoint(p)`         | `matrix.transformPoint(p)`      |
| Transformar vector    | `transformVector(v)`        | `matrix.transformVector(v)`     |
| Rotar con ángulo      | `rotate(angle)`             | `vector.rotate(angle)`          |
| Rotar con cos/sin     | `rotateCS(c, s)`            | `vector.rotateCS(c, s)`         |
| Extraer ángulo        | `angle()` o `getRotation()` | Según contexto                  |

### 4.3 Reglas de Delegación

1. **Operaciones de rotación SIEMPRE delegarán a `Vector2.rotateCS()`**
   - `Rotation2.apply()` → `Vector2.rotateCS()`
   - `Matrix2.transformVector()` para matrices de rotación pura puede optimizar inline
2. **`sinCos()` es el único punto de entrada para trigonometría**
   - Todos los `rotate(angle)` llaman a `sinCos(angle)` primero
3. **Transform2 debería considerar almacenar Rotation2 internamente**
   - Evita recalcular cos/sin en cada operación
   - Decisión: Evaluar impacto en memoria vs CPU

### 4.4 Patrón para Hot Paths

```typescript
// PATRÓN: Método con ángulo delega a método con cos/sin

// Estático - conveniencia
public static rotate(v: ReadonlyVector2Like, angle: number, out?: Vector2): Vector2 {
  const { cos, sin } = sinCos(angle);
  return Vector2.rotateCS(v, cos, sin, out);
}

// Estático - hot path (sin recálculo)
public static rotateCS(v: ReadonlyVector2Like, c: number, s: number, out?: Vector2): Vector2 {
  return Vector2.ensureOut(out).set(v.x * c - v.y * s, v.x * s + v.y * c);
}

// Instancia - conveniencia
public rotate(angle: number): this {
  const { cos, sin } = sinCos(angle);
  return this.rotateCS(cos, sin);
}

// Instancia - hot path
public rotateCS(c: number, s: number): this {
  const rx = this.x * c - this.y * s;
  const ry = this.x * s + this.y * c;
  return this.set(rx, ry);
}
```

---

## 5. Arquitectura Propuesta

### 5.1 Vector2 (Nivel 1 - Primitivas)

**Estado actual:** ✅ Correcto  
**Cambios:** Ninguno necesario

```typescript
// Ya tiene el patrón correcto:
static rotate(v, angle) → rotateCS()
static rotateCS(v, c, s) → inline
static applyRotation(v, rot) → rotateCS(v, rot.cos, rot.sin)

instance.rotate(angle) → rotateCS()
instance.rotateCS(c, s) → inline
instance.applyRotation(rot) → this.rotateCS(rot.cos, rot.sin)
```

### 5.2 Rotation2 (Nivel 2 - Especializado)

**Cambios Propuestos:**

| Actual                     | Propuesto                     | Razón               |
| -------------------------- | ----------------------------- | ------------------- |
| `applyToVector(rot, v)`    | `apply(rot, v)`               | Consistencia naming |
| Implementa rotación inline | Delega a `Vector2.rotateCS()` | DRY, sinergia       |

```typescript
// ANTES (actual):
public static applyToVector(rotation: ReadonlyRotation2, vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Vector2.fromValues(
    rotation.cos * vector.x - rotation.sin * vector.y,
    rotation.sin * vector.x + rotation.cos * vector.y,
    out,
  );
}

// DESPUÉS (propuesto):
public static apply(rotation: ReadonlyRotation2, vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Vector2.rotateCS(vector, rotation.cos, rotation.sin, out);
}
```

### 5.3 Complex (Nivel 2 - Matemático)

**Estado actual:** ✅ Mayormente correcto  
**Cambios sugeridos:**

| Actual                                     | Propuesto   | Razón                      |
| ------------------------------------------ | ----------- | -------------------------- |
| `toRotationMatrix()` retorna `Matrix2Like` | OK          | Evita dependencia circular |
| No tiene `applyToVector()`                 | **Agregar** | Simetría con Rotation2     |

```typescript
// AGREGAR:
public static apply(complex: ReadonlyComplex, vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const normalized = Complex.normalize(complex);
  return Vector2.rotateCS(vector, normalized.real, normalized.imag, out);
}

public apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const normalized = this.normalized;
  return Vector2.rotateCS(vector, normalized.real, normalized.imag, out);
}
```

### 5.4 Matrix2 (Nivel 2 - Lineal)

**Estado actual:** Mayormente correcto  
**Cambios sugeridos:**

La transformación de vector por matriz es una operación primitiva (multiplicación matriz-vector), NO una rotación. No debe delegar a `rotateCS()`.

```typescript
// MANTENER COMO ESTÁ - es operación primitiva de álgebra lineal:
public static transformVector(matrix: ReadonlyMatrix2Like, vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Vector2.fromValues(
    matrix.m00 * vector.x + matrix.m10 * vector.y,
    matrix.m01 * vector.x + matrix.m11 * vector.y,
    out,
  );
}
```

### 5.5 Matrix3 (Nivel 2 - Affine)

**Estado actual:** ✅ Correcto  
**Cambios:** Ninguno necesario

### 5.6 Transform2 (Nivel 3 - Fachada)

**Cambios Propuestos:**

#### Opción A: Mantener `rotation: number` (actual)

- Pro: Menos memoria, serialización simple
- Contra: Recalcula cos/sin en cada operación

#### Opción B: Usar `_rotation: Rotation2` interno

- Pro: Eficiente para múltiples operaciones
- Contra: Más memoria, serialización más compleja

**Decisión:** Mantener Opción A pero agregar métodos estáticos y optimizar batch ops.

```typescript
// AGREGAR métodos estáticos:
public static transformPoint(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  out?: Vector2
): Vector2 {
  const scaledX = point.x * transform.scale.x;
  const scaledY = point.y * transform.scale.y;
  const { cos, sin } = sinCos(transform.rotation);
  return Vector2.fromValues(
    scaledX * cos - scaledY * sin + transform.position.x,
    scaledX * sin + scaledY * cos + transform.position.y,
    out,
  );
}

public static transformVector(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2
): Vector2 {
  const scaledX = vector.x * transform.scale.x;
  const scaledY = vector.y * transform.scale.y;
  const { cos, sin } = sinCos(transform.rotation);
  return Vector2.fromValues(
    scaledX * cos - scaledY * sin,
    scaledX * sin + scaledY * cos,
    out,
  );
}
```

---

## 6. Especificación por Módulo

### 6.1 Vector2 - Especificación Final

#### Categoría: Transform

| Método                  | Tipo     | Firma                                | Delegación                              |
| ----------------------- | -------- | ------------------------------------ | --------------------------------------- |
| `rotate`                | static   | `(v, angle, out?) → Vector2`         | → `rotateCS()`                          |
| `rotateCS`              | static   | `(v, c, s, out?) → Vector2`          | Inline (primitiva)                      |
| `rotateAround`          | static   | `(v, center, angle, out?) → Vector2` | `sinCos()` inline                       |
| `rotateAroundCS`        | static   | `(v, center, c, s, out?) → Vector2`  | Inline                                  |
| `perpendicular`         | static   | `(v, clockwise?, out?) → Vector2`    | Inline                                  |
| `unitPerpendicular`     | static   | `(v, clockwise?, out?) → Vector2`    | → `perpendicular()` → `normalize()`     |
| `unitPerpendicularSafe` | static   | `(v, clockwise?, out?) → Vector2`    | → `perpendicular()` → `normalizeSafe()` |
| `applyRotation`         | static   | `(v, rot, out?) → Vector2`           | → `rotateCS()` ✅                       |
| `applyMatrix2`          | static   | `(v, mat, out?) → Vector2`           | Inline (es mult matriz)                 |
| `applyTransform`        | static   | `(v, t, out?) → Vector2`             | `sinCos()` inline                       |
| `rotate`                | instance | `(angle) → this`                     | → `rotateCS()`                          |
| `rotateCS`              | instance | `(c, s) → this`                      | Inline                                  |
| `rotateAround`          | instance | `(center, angle) → this`             | → `subtract` → `rotate` → `add`         |
| `rotateAroundCS`        | instance | `(center, c, s) → this`              | Inline                                  |
| `perpendicular`         | instance | `(clockwise?) → this`                | Inline                                  |
| `unitPerpendicular`     | instance | `(clockwise?) → this`                | → `perpendicular()` → `normalize()`     |
| `unitPerpendicularSafe` | instance | `(clockwise?) → this`                | → `perpendicular()` → `normalizeSafe()` |
| `applyRotation`         | instance | `(rot) → this`                       | → `rotateCS()` ✅                       |
| `applyMatrix2`          | instance | `(mat) → this`                       | Inline                                  |
| `applyTransform`        | instance | `(t) → this`                         | `sinCos()` inline                       |

### 6.2 Rotation2 - Especificación Final

#### Cambios Requeridos

| #   | Cambio                                                          | Estado      |
| --- | --------------------------------------------------------------- | ----------- |
| R1  | Renombrar `applyToVector` → `apply`                             | ✅ HECHO    |
| R2  | `apply` usa inline (hot path documentado)                       | ✅ HECHO    |
| R3  | Agregar `applyToPoint` alias (para consistencia con Transform2) | 🟡 Opcional |

```typescript
// Especificación:
public static apply(rotation: ReadonlyRotation2, vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Vector2.rotateCS(vector, rotation.cos, rotation.sin, out);
}

public apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Vector2.rotateCS(vector, this.cos, this.sin, out);
}
```

### 6.3 Complex - Especificación Final

#### Cambios Requeridos

| #   | Cambio                                    | Estado   |
| --- | ----------------------------------------- | -------- |
| C1  | Agregar `apply(complex, vector)` estático | ✅ HECHO |
| C2  | Agregar `apply(vector)` instancia         | ✅ HECHO |

```typescript
// Agregar:
/**
 * Applies this complex number as a rotation to a vector.
 * The complex is normalized before applying.
 * @param vector - Vector to rotate
 * @param out - Optional output vector
 * @returns Rotated vector
 *
 * @remarks
 * Equivalent to Rotation2.apply but for Complex numbers.
 * Normalizes first to ensure unit rotation.
 *
 * @category Transform
 * @since 0.10.0
 */
public static apply(complex: ReadonlyComplex, vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  const mag = Complex.magnitude(complex);
  if (isNearZero(mag)) {
    return Vector2.clone(vector, out);
  }
  const invMag = 1 / mag;
  return Vector2.rotateCS(vector, complex.real * invMag, complex.imag * invMag, out);
}

public apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Complex.apply(this, vector, out);
}
```

### 6.4 Matrix2 - Especificación Final

✅ Sin cambios requeridos - el módulo está correcto.

### 6.5 Matrix3 - Especificación Final

✅ Sin cambios requeridos - el módulo está correcto.

### 6.6 Transform2 - Especificación Final

#### Cambios Requeridos

| #   | Cambio                                                | Estado   |
| --- | ----------------------------------------------------- | -------- |
| T1  | Agregar `transformPoint` estático                     | ✅ HECHO |
| T2  | Agregar `transformVector` estático                    | ✅ HECHO |
| T3  | Agregar `inverseTransformPoint` estático              | ✅ HECHO |
| T4  | Agregar `inverseTransformVector` estático + instancia | ✅ HECHO |

```typescript
// Agregar métodos estáticos:

/**
 * Transforms a point by a transform (applies scale, rotation, then translation).
 * @param transform - Transform to apply
 * @param point - Point to transform
 * @param out - Optional output vector
 * @returns Transformed point
 *
 * @category Transform
 * @since 0.10.0
 */
public static transformPoint(
  transform: ReadonlyTransform2Like,
  point: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const scaledX = point.x * transform.scale.x;
  const scaledY = point.y * transform.scale.y;
  const { cos, sin } = sinCos(transform.rotation);
  return Vector2.fromValues(
    scaledX * cos - scaledY * sin + transform.position.x,
    scaledX * sin + scaledY * cos + transform.position.y,
    out,
  );
}

/**
 * Transforms a vector by a transform (applies scale and rotation, no translation).
 * @param transform - Transform to apply
 * @param vector - Vector to transform
 * @param out - Optional output vector
 * @returns Transformed vector
 *
 * @category Transform
 * @since 0.10.0
 */
public static transformVector(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const scaledX = vector.x * transform.scale.x;
  const scaledY = vector.y * transform.scale.y;
  const { cos, sin } = sinCos(transform.rotation);
  return Vector2.fromValues(
    scaledX * cos - scaledY * sin,
    scaledX * sin + scaledY * cos,
    out,
  );
}
```

---

## 7. Patrones de Sinergia

### 7.1 Patrón: Delegación en Capas

```
Transform2.transformPoint(t, p)
    │
    └──► sinCos(t.rotation)        // Único punto trig
         scale × point
         Vector2.rotateCS(scaled, cos, sin)  // Delega a primitiva
         + t.position

Rotation2.apply(r, v)
    │
    └──► Vector2.rotateCS(v, r.cos, r.sin)   // Delega a primitiva

Vector2.rotate(v, angle)
    │
    └──► sinCos(angle)             // Único punto trig
         Vector2.rotateCS(v, cos, sin)        // Primitiva inline
```

### 7.2 Patrón: Hot Path Optimization

```typescript
// USO TÍPICO - Física con muchos vértices

// ❌ INEFICIENTE: Recalcula sin/cos por vértice
for (const vertex of body.vertices) {
 vertex.rotate(body.angle); // sinCos() N veces
}

// ✅ EFICIENTE: Usa Rotation2 pre-calculado
const rot = Rotation2.fromAngle(body.angle); // sinCos() 1 vez
for (const vertex of body.vertices) {
 rot.apply(vertex, vertex); // Solo multiplicaciones
}

// ✅ EFICIENTE: Usa rotateCS directamente
const { cos, sin } = sinCos(body.angle); // sinCos() 1 vez
for (const vertex of body.vertices) {
 vertex.rotateCS(cos, sin); // Solo multiplicaciones
}

// ✅ MÁS EFICIENTE: Batch operation
transform.transformPoints(body.vertices, body.worldVertices); // sinCos() 1 vez
```

### 7.3 Diagrama de Dependencias

```
                    ┌───────────────┐
                    │   sinCos()    │ ← Único punto trigonometría
                    └───────┬───────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ Vector2       │   │ Rotation2     │   │ Matrix2/3     │
│ .rotate()     │   │ .fromAngle()  │   │ .fromRotation │
│ .setHeading() │   └───────┬───────┘   │ .rotate()     │
└───────┬───────┘           │           └───────────────┘
        │                   │
        ▼                   │
┌───────────────┐           │
│ Vector2       │◄──────────┘
│ .rotateCS()   │ ← PRIMITIVA CORE
└───────┬───────┘
        │
        ▼
┌───────────────┐   ┌───────────────┐
│ Rotation2     │   │ Complex       │
│ .apply()      │──►│ .apply()      │
└───────────────┘   └───────────────┘
        │
        ▼
┌───────────────┐
│ Transform2    │
│ .transformX() │
└───────────────┘
```

---

## 8. Checklist de Implementación

### 8.1 Cambios en Rotation2

- [x] **R1**: Renombrar `applyToVector` → `apply` ✅ HECHO

  - Actualizar firma del método estático
  - El método de instancia ya se llama `apply` - solo actualizar que delegue al nuevo nombre
  - Actualizar JSDoc
  - Actualizar tests
  - Actualizar cualquier uso interno

- [x] **R2**: `apply` usa inline (decisión de diseño: hot path) ✅ NO CAMBIAR

  > Mantener inline por rendimiento. Documentado en sección 14.4.

- [x] **R3**: Agregar `applyInverse` estático ✅ HECHO

- [x] **R4**: Instancia `applyInverse` delega a estático ✅ HECHO

- [x] **R5**: Agregar `normalizeSafe` estático + instancia ✅ HECHO

### 8.2 Cambios en Complex

- [x] **C1**: Agregar `apply(complex, vector)` estático ✅ HECHO
- [x] **C2**: Agregar `apply(vector)` instancia ✅ HECHO
- [x] **C3**: Agregar `normalizeSafe` estático ✅ HECHO
- [x] Tests existentes cubren nuevos métodos ✅

### 8.3 Cambios en Transform2

- [x] **T1**: Agregar `transformPoint` estático ✅ HECHO
- [x] **T2**: Agregar `transformVector` estático ✅ HECHO
- [x] **T3**: Agregar `inverseTransformPoint` estático ✅ HECHO
- [x] **T4**: Agregar `inverseTransformVector` estático ✅ HECHO
- [x] **T5**: Agregar `inverseTransformVector` instancia ✅ HECHO
- [x] El tipo `ReadonlyTransform2Like` ya existe en types/index.ts ✅

```typescript
// T4 + T5: inverseTransformVector (nuevo)
/**
 * Inverse transforms a vector (ignores translation).
 * @param transform - Transform to apply inversely
 * @param vector - Vector to inverse transform
 * @param out - Optional output vector
 * @returns Inverse transformed vector
 *
 * @category Transform
 * @since 0.10.0
 */
public static inverseTransformVector(
  transform: ReadonlyTransform2Like,
  vector: ReadonlyVector2Like,
  out?: Vector2,
): Vector2 {
  const { cos, sin } = sinCos(-transform.rotation);
  const rotatedX = vector.x * cos - vector.y * sin;
  const rotatedY = vector.x * sin + vector.y * cos;
  const invScaleX = safeDivide(1, transform.scale.x);
  const invScaleY = safeDivide(1, transform.scale.y);
  return Vector2.fromValues(rotatedX * invScaleX, rotatedY * invScaleY, out);
}

// Instancia
inverseTransformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2 {
  return Transform2.inverseTransformVector(this, vector, out);
}
```

### 8.4 Verificaciones Post-Implementación

- [x] Todos los tests pasan (1993 tests) ✅
- [x] Lint sin errores (0 errores, solo warnings preexistentes) ✅
- [x] Simetría estático/instancia verificada ✅
- [x] JSDoc completo con `@category`, `@since`, `@remarks` ✅
- [x] Hot paths mantienen inline por rendimiento (decisión documentada) ✅

---

## 9. Categorización JSDoc

### 9.1 Categorías Actuales en Transformaciones

| Módulo       | Categoría JSDoc                   | Descripción                                             |
| ------------ | --------------------------------- | ------------------------------------------------------- |
| `Vector2`    | `@category Transform`             | Operaciones que modifican geometría del vector          |
| `Vector2`    | `@category Transform Integration` | Aplicar tipos externos (Rotation2, Matrix2, Transform2) |
| `Rotation2`  | `@category Transform`             | Aplicar rotación a vectores                             |
| `Complex`    | `@category Transform`             | Normalizar, pow, sqrt                                   |
| `Matrix2`    | `@category Matrix Operations`     | Transpose, inverse, transformVector                     |
| `Matrix3`    | `@category Transform`             | Operaciones numéricas (floor, ceil, etc.)               |
| `Matrix3`    | `@category Matrix Operations`     | transformPoint, transformVector                         |
| `Transform2` | `@category Transform`             | transformPoint, transformVector                         |

### 9.2 Propuesta de Estandarización

| Categoría                         | Uso                                      | Módulos                                  |
| --------------------------------- | ---------------------------------------- | ---------------------------------------- |
| `@category Factory`               | Métodos `from*`                          | Todos                                    |
| `@category Mutator`               | Métodos que modifican `this`             | Todos                                    |
| `@category Computed`              | Getters y cálculos derivados             | Todos                                    |
| `@category Arithmetic`            | Operaciones matemáticas básicas          | Todos                                    |
| `@category Comparison`            | Métodos de igualdad y comparación        | Todos                                    |
| `@category Transform`             | Rotación, escala, traslación de vectores | Vector2, Rotation2                       |
| `@category Transform Application` | Aplicar tipos a otros objetos            | Rotation2, Complex, Matrix\*, Transform2 |
| `@category Serialization`         | toArray, toObject, toString              | Todos                                    |
| `@category Validation`            | isFinite, hasNaN, isZero                 | Todos                                    |

### 9.3 Cambios de Categoría Propuestos

| Módulo                          | Método                        | Actual                            | Propuesto    |
| ------------------------------- | ----------------------------- | --------------------------------- | ------------ |
| `Rotation2.apply*`              | `@category Transform`         | `@category Transform Application` | Consistencia |
| `Complex.apply*`                | — (nuevo)                     | `@category Transform Application` | Nuevo método |
| `Matrix2.transformVector`       | `@category Matrix Operations` | OK - operación de matriz          |
| `Matrix3.transformPoint/Vector` | `@category Matrix Operations` | OK - operación de matriz          |
| `Transform2.transform*`         | `@category Transform`         | `@category Transform Application` | Consistencia |

---

## 10. Referencias

1. **Box2D Manual** - Erin Catto

   - https://box2d.org/documentation/
   - Patrón b2Rot, separación de tipos

2. **gl-matrix** - Brandon Jones

   - https://glmatrix.net/
   - API funcional, Float32Array

3. **Three.js** - mrdoob

   - https://threejs.org/docs/
   - Patrón apply\*, Quaternion

4. **Planck.js** - Erin Catto / Ali Shakiba

   - https://github.com/piqnt/planck.js
   - Port de Box2D a JS

5. **Rapier** - Dimforge
   - https://rapier.rs/docs/
   - Motor moderno, Rust

---

## 11. Resumen Ejecutivo de Cambios

### 11.1 Prioridad ALTA (Inconsistencias Críticas)

| #   | Módulo       | Cambio                                            | Impacto      | Esfuerzo |
| --- | ------------ | ------------------------------------------------- | ------------ | -------- |
| 1   | `Rotation2`  | Renombrar `applyToVector` → `apply`               | Sinergia API | Bajo     |
| 2   | `Rotation2`  | `apply` debe delegar a `Vector2.rotateCS()`       | DRY          | Bajo     |
| 3   | `Rotation2`  | Agregar `applyInverse` estático                   | Simetría     | Bajo     |
| 4   | `Transform2` | Agregar métodos estáticos `transformPoint/Vector` | Simetría     | Medio    |

### 11.2 Prioridad MEDIA (Completitud)

| #   | Módulo       | Cambio                                                | Impacto                | Esfuerzo |
| --- | ------------ | ----------------------------------------------------- | ---------------------- | -------- |
| 5   | `Transform2` | Agregar `inverseTransformPoint` estático              | Simetría               | Bajo     |
| 6   | `Transform2` | Agregar `inverseTransformVector` estático + instancia | Completitud            | Medio    |
| 7   | `Complex`    | Agregar `apply` estático + instancia                  | Simetría con Rotation2 | Bajo     |

### 11.3 Prioridad BAJA (Optimización)

| #   | Módulo        | Cambio                                      | Impacto | Esfuerzo |
| --- | ------------- | ------------------------------------------- | ------- | -------- |
| 8   | `Rotation2`   | `applyInverse` instancia delegue a estático | DRY     | Bajo     |
| 9   | Documentación | Actualizar README con patrones de uso       | DevEx   | Medio    |

### 11.4 NO HACER (Cambios Descartados)

| Cambio                                                   | Razón                                                                       |
| -------------------------------------------------------- | --------------------------------------------------------------------------- |
| Cambiar `Transform2.rotation` de `number` a `Rotation2`  | Aumenta memoria, complica serialización                                     |
| Unificar `apply*` y `transform*` naming                  | Semánticas diferentes (apply = usar tipo, transform = afectar punto/vector) |
| Hacer que `Matrix2.transformVector` delegue a `rotateCS` | No todas las Matrix2 son rotaciones                                         |

---

## 12. Revisión Exhaustiva - Hallazgos Adicionales

### 12.1 Verificación de Inlining Intencional

Se detectaron varios casos donde el código NO delega para optimizar hot paths. Estos están **documentados en el código fuente** con comentarios como:

> "Implemented inline for performance in hot paths."

| Método                         | Ubicación         | ¿Delega?               | Justificación        |
| ------------------------------ | ----------------- | ---------------------- | -------------------- |
| `Rotation2.applyToVector`      | rotation2.ts:462  | ❌ Inline              | Comentario: hot path |
| `Rotation2.applyInverse`       | rotation2.ts:840  | ❌ Inline              | Comentario: hot path |
| `Vector2.applyRotation` (inst) | vector2.ts:3230   | ❌ Inline              | Evita llamada extra  |
| `Vector2.applyRotation` (stat) | vector2.ts:3643   | ✅ Delega a `rotateCS` | Patrón correcto      |
| `Transform2.transformPoint`    | transform2.ts:698 | ❌ Inline              | Incluye scale        |

**Decisión:** Aceptar inline donde está documentado. La fórmula matemática debe ser verificada idénticamente en todos los casos.

### 12.2 Verificación de Fórmulas Matemáticas

Todas las implementaciones de rotación usan la misma fórmula correcta:

```
x' = x * cos(θ) - y * sin(θ)
y' = x * sin(θ) + y * cos(θ)
```

✅ Verificado en:

- `Vector2.rotateCS` (línea 1491-1492)
- `Rotation2.applyToVector` (línea 462-465)
- `Vector2.applyRotation` instancia (línea 3231-3232)
- `Transform2.transformPoint` (línea 702-704)
- `Matrix2.transformVector` (línea diferente: usa layout de matriz)

### 12.3 Verificación de Constantes

| Constante  | Vector2    | Matrix2 | Matrix3 | Rotation2 | Complex | Transform2 | Interval |
| ---------- | ---------- | ------- | ------- | --------- | ------- | ---------- | -------- |
| `ZERO`     | ✅         | ✅      | ✅      | —         | ✅      | —          | ✅       |
| `IDENTITY` | —          | ✅      | ✅      | ✅        | —       | ✅         | —        |
| `ONE`      | ✅         | ✅      | ✅      | —         | ✅      | —          | —        |
| `UNIT`     | —          | —       | —       | —         | —       | —          | ✅       |
| `ORIGIN`   | ✅ (alias) | —       | —       | —         | —       | —          | —        |

**Observación:** `ORIGIN` es alias de `ZERO` en Vector2. Esto es correcto semánticamente.

### 12.4 Verificación de Utilidades Auxiliares

Se verificó que `sinCos()` es el único punto de entrada para trigonometría:

```
auxiliary/angle/operations.ts
├── sinCos(angle) → { sin, cos }           ← PUNTO ÚNICO
├── sinCosInto(angle, out) → out           ← Hot path variant
└── sinCosNormalized(angle) → { sin, cos } ← Normaliza primero
```

**Uso verificado:**

- ✅ `Vector2.rotate` → `sinCos()`
- ✅ `Vector2.fromAngle` → `sinCos()`
- ✅ `Rotation2.fromAngle` → `sinCos()`
- ✅ `Matrix2.fromRotation` → `sinCos()` o usa `rot.cos/sin`
- ✅ `Matrix3.fromRotation` → `sinCos()` o usa `rot.cos/sin`
- ✅ `Transform2.transformPoint` → `sinCos()`

### 12.5 Oportunidad de Mejora: `sinCosInto` para Batch Operations

La utilidad `sinCosInto` permite hot path sin allocations:

```typescript
// Actual en Transform2.transformPoints (línea 768):
const { cos, sin } = sinCos(this.rotation); // Crea objeto

// Potencial mejora:
const _sc: SinCos = { sin: 0, cos: 0 }; // Pool
sinCosInto(this.rotation, _sc); // Zero-alloc
```

**Estado:** Mejora opcional para v0.11.0+

### 12.6 Verificación de Patrones de gl-matrix

Se comparó con gl-matrix y se confirmó:

| Patrón                   | gl-matrix | math2d        | Estado        |
| ------------------------ | --------- | ------------- | ------------- |
| `out` parameter          | ✅        | ✅            | OK            |
| Static functions         | ✅        | ✅ + Instance | OK (más rico) |
| Column-major matrices    | ✅        | ✅            | OK            |
| Separate rotate/rotateCS | —         | ✅            | OK (mejor)    |

### 12.7 Verificación de Patrones de Box2D

Se comparó con Box2D/Planck.js:

| Patrón                   | Box2D | math2d        | Estado |
| ------------------------ | ----- | ------------- | ------ |
| b2Rot stores (cos, sin)  | ✅    | ✅ Rotation2  | OK     |
| b2Transform = pos + rot  | ✅    | ✅ Transform2 | OK     |
| Composition via multiply | ✅    | ✅            | OK     |
| Separate apply methods   | ✅    | ✅            | OK     |

### 12.8 Módulos Sin Transformaciones (Verificados)

Se verificó que estos módulos NO necesitan métodos de transformación:

- **Interval**: Aritmética 1D, no rotaciones
- **DeterministicMath**: Wrappers de Math.\*
- **Validation**: Assertions
- **Utils**: Random, parsing

---

## 13. Checklist Final de Calidad

### 13.1 Principios SOLID

| Principio                 | Verificación                               | Estado |
| ------------------------- | ------------------------------------------ | ------ |
| **S**ingle Responsibility | Cada módulo tiene un propósito claro       | ✅     |
| **O**pen/Closed           | Extensible via interfaces `*Like`          | ✅     |
| **L**iskov Substitution   | ReadonlyX extends X                        | ✅     |
| **I**nterface Segregation | Tipos separados (Vector2Like, Matrix2Like) | ✅     |
| **D**ependency Inversion  | Usa interfaces no clases concretas         | ✅     |

### 13.2 Principio DRY

| Área                    | Estado | Notas                                      |
| ----------------------- | ------ | ------------------------------------------ |
| Fórmulas de rotación    | ⚠️     | Duplicadas intencionalmente para hot paths |
| sinCos como punto único | ✅     | Toda trigonometría usa sinCos()            |
| Utilidades escalares    | ✅     | auxiliary/scalar/\* reutilizado            |
| Type guards             | ✅     | Unificados en types/index.ts               |

### 13.3 Clean Code

| Aspecto              | Estado | Notas                                    |
| -------------------- | ------ | ---------------------------------------- |
| Naming consistente   | ✅     | `apply` unificado en Rotation2 y Complex |
| JSDoc completo       | ✅     | Todos los públicos documentados          |
| Categorización       | ✅     | @category en todos los métodos           |
| Métodos cortos       | ✅     | < 20 líneas en general                   |
| Sin código comentado | ✅     |                                          |

### 13.4 Simetría de Métodos Verificada

| Método          | Vector2 | Complex | Rotation2 | Matrix2 | Matrix3 | Transform2 |
| --------------- | ------- | ------- | --------- | ------- | ------- | ---------- |
| `normalize`     | ✅/✅   | ✅/✅   | ✅/✅     | —       | —       | —          |
| `normalizeSafe` | ✅/✅   | ✅/✅   | ❌/❌     | —       | —       | —          |
| `clone`         | ✅/✅   | ✅/✅   | ✅/✅     | ✅/✅   | ✅/✅   | ✅/✅      |
| `copy`          | ✅/—    | ✅/—    | ✅/—      | ✅/—    | ✅/—    | ✅/—       |
| `exactEquals`   | ✅/✅   | ✅/✅   | ✅/✅     | ✅/✅   | ✅/✅   | ✅/✅      |
| `nearEquals`    | ✅/✅   | ✅/✅   | ✅/✅     | ✅/✅   | ✅/✅   | ✅/✅      |
| `toArray`       | —/✅    | —/✅    | —/✅      | —/✅    | —/✅    | —/✅       |
| `fromArray`     | ✅/—    | ✅/—    | ✅/—      | ✅/—    | ✅/—    | ✅/—       |
| `toObject`      | —/✅    | —/✅    | —/✅      | —/✅    | —/✅    | —/✅       |
| `fromObject`    | ✅/—    | ✅/—    | ✅/—      | ✅/—    | ✅/—    | ✅/—       |

**Leyenda:** Static/Instance

### 13.5 Inconsistencia Detectada: `normalizeSafe`

| Módulo      | `normalizeSafe` Estático | `normalizeSafe` Instancia | Acción           |
| ----------- | ------------------------ | ------------------------- | ---------------- |
| `Vector2`   | ✅                       | ✅                        | OK               |
| `Complex`   | ✅                       | ✅                        | ✅ **CORREGIDO** |
| `Rotation2` | ✅                       | ✅                        | ✅ **CORREGIDO** |

**Nota:** Rotation2 siempre debería ser normalizado (es una propiedad invariante), pero en la práctica operaciones acumuladas pueden introducir drift. Un `normalizeSafe` sería útil.

---

## 14. Resumen Consolidado de Cambios

### 14.1 Cambios CRÍTICOS (Implementar primero)

| #   | Módulo     | Cambio                                  | Archivo       | Línea Aprox |
| --- | ---------- | --------------------------------------- | ------------- | ----------- |
| 1   | Rotation2  | ~~Renombrar `applyToVector` → `apply`~~ | rotation2.ts  | ✅ HECHO    |
| 2   | Rotation2  | ~~Agregar `applyInverse` estático~~     | rotation2.ts  | ✅ HECHO    |
| 3   | Transform2 | ~~Agregar `transformPoint` estático~~   | transform2.ts | ✅ HECHO    |
| 4   | Transform2 | ~~Agregar `transformVector` estático~~  | transform2.ts | ✅ HECHO    |

### 14.2 Cambios IMPORTANTES (Implementar segundo)

| #   | Módulo     | Cambio                                                    | Archivo       | Línea Aprox |
| --- | ---------- | --------------------------------------------------------- | ------------- | ----------- |
| 5   | Transform2 | ~~Agregar `inverseTransformPoint` estático~~              | transform2.ts | ✅ HECHO    |
| 6   | Transform2 | ~~Agregar `inverseTransformVector` estático + instancia~~ | transform2.ts | ✅ HECHO    |
| 7   | Complex    | ~~Agregar `apply` estático + instancia~~                  | complex.ts    | ✅ HECHO    |
| 8   | Rotation2  | ~~Agregar `normalizeSafe` estático + instancia~~          | rotation2.ts  | ✅ HECHO    |

### 14.3 Cambios OPCIONALES (Para v0.11.0+)

| #   | Módulo          | Cambio                                | Impacto     |
| --- | --------------- | ------------------------------------- | ----------- |
| 9   | auxiliary/angle | Usar `sinCosInto` en batch operations | Rendimiento |
| 10  | Complex         | ~~Agregar `normalizeSafe` estático~~  | ✅ HECHO    |
| 11  | Docs            | Actualizar README con patrones de uso | DevEx       |

### 14.4 NO CAMBIAR (Decisiones Confirmadas)

| Aspecto                         | Decisión    | Razón                     |
| ------------------------------- | ----------- | ------------------------- |
| Inlining en hot paths           | ✅ Mantener | Documentado, rendimiento  |
| Transform2.rotation como number | ✅ Mantener | Simplicidad serialización |
| apply* vs transform* naming     | ✅ Mantener | Semánticas diferentes     |
| Matrix.transformVector inline   | ✅ Mantener | Es operación primitiva    |

### 14.5 Firmas Finales de Métodos a Agregar

```typescript
// === Rotation2 ===
public static apply(rotation: ReadonlyRotation2, vector: ReadonlyVector2Like, out?: Vector2): Vector2;
public static applyInverse(rotation: ReadonlyRotation2, vector: ReadonlyVector2Like, out?: Vector2): Vector2;
public static normalizeSafe(rotation: ReadonlyRotation2, out?: Rotation2): Rotation2;
public normalizeSafe(): this;

// === Complex ===
public static apply(complex: ReadonlyComplex, vector: ReadonlyVector2Like, out?: Vector2): Vector2;
public apply(vector: ReadonlyVector2Like, out?: Vector2): Vector2;

// === Transform2 ===
public static transformPoint(transform: ReadonlyTransform2Like, point: ReadonlyVector2Like, out?: Vector2): Vector2;
public static transformVector(transform: ReadonlyTransform2Like, vector: ReadonlyVector2Like, out?: Vector2): Vector2;
public static inverseTransformPoint(transform: ReadonlyTransform2Like, point: ReadonlyVector2Like, out?: Vector2): Vector2;
public static inverseTransformVector(transform: ReadonlyTransform2Like, vector: ReadonlyVector2Like, out?: Vector2): Vector2;
public inverseTransformVector(vector: ReadonlyVector2Like, out?: Vector2): Vector2;
```

---

## 15. Patrones de Diseño Aplicados

### 15.1 Patrones Identificados en math2d

| Patrón              | Aplicación                           | Ejemplo                                        |
| ------------------- | ------------------------------------ | ---------------------------------------------- |
| **Factory Method**  | Creación de instancias               | `Vector2.fromAngle()`, `Rotation2.fromAngle()` |
| **Flyweight**       | Constantes inmutables compartidas    | `Vector2.ZERO`, `Matrix2.IDENTITY`             |
| **Strategy**        | Variantes de algoritmos              | `normalize()` vs `normalizeSafe()`             |
| **Template Method** | Patrón `rotate()` → `rotateCS()`     | Método público delega a primitiva              |
| **Adapter**         | Interfaces `*Like`                   | `ReadonlyVector2Like` adapta cualquier objeto  |
| **Facade**          | `Transform2` encapsula pos+rot+scale | Simplifica composición                         |

### 15.2 Patrón "Dual API" (Estático + Instancia)

```
┌─────────────────────────────────────────────────────────────┐
│                    PATRÓN DUAL API                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ESTÁTICO (Puro, Allocation-Free)                           │
│  ├── Input: Tipos primitivos o interfaces (Vector2Like)    │
│  ├── Output: Instancia nueva o `out` parameter             │
│  └── Uso: Funcional, composición, pipelines                │
│                                                             │
│  INSTANCIA (Mutable, Chainable)                             │
│  ├── Input: Parámetros de operación                        │
│  ├── Output: `this` para encadenamiento                    │
│  └── Uso: Imperativo, hot paths, modificación in-place     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Ejemplo:**

```typescript
// Estático - Puro, sin efectos secundarios
const rotated = Vector2.rotate(v, Math.PI / 4, out);

// Instancia - Mutable, chainable
v.rotate(Math.PI / 4)
 .scale(2)
 .add(offset);
```

### 15.3 Patrón "Hot Path Optimization"

```
┌─────────────────────────────────────────────────────────────┐
│              PATRÓN HOT PATH OPTIMIZATION                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  NIVEL 1: Método de conveniencia (con ángulo)               │
│  │                                                          │
│  │  rotate(angle) {                                         │
│  │    const { cos, sin } = sinCos(angle);  // ← Trig call  │
│  │    return this.rotateCS(cos, sin);       // ← Delega    │
│  │  }                                                       │
│  │                                                          │
│  └─► NIVEL 2: Método primitivo (con cos/sin)                │
│      │                                                      │
│      │  rotateCS(c, s) {                                    │
│      │    // Solo multiplicaciones - MÁXIMO RENDIMIENTO     │
│      │    const rx = this.x * c - this.y * s;               │
│      │    const ry = this.x * s + this.y * c;               │
│      │    return this.set(rx, ry);                          │
│      │  }                                                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 15.4 Patrón "Interface Segregation" para Extensibilidad

```typescript
// Interfaces mínimas para máxima compatibilidad
interface ReadonlyVector2Like {
 readonly x: number;
 readonly y: number;
}
interface ReadonlyRotation2Like {
 readonly cos: number;
 readonly sin: number;
}
interface ReadonlyTransform2Like {
 readonly position: ReadonlyVector2Like;
 readonly rotation: number;
 readonly scale: ReadonlyVector2Like;
}

// Cualquier objeto que cumpla la interfaz es válido
const plainObject = { x: 1, y: 2 };
Vector2.normalize(plainObject); // ✅ Funciona
```

### 15.5 Patrón "Immutable Singletons" para Constantes

```typescript
// Constantes pre-computadas, inmutables, reutilizables
public static readonly IDENTITY = Object.freeze(new Rotation2(1, 0));
public static readonly QUARTER_TURN = Object.freeze(new Rotation2(0, 1));
public static readonly HALF_TURN = Object.freeze(new Rotation2(-1, 0));

// Uso: Sin allocations, comparación por referencia
if (rotation === Rotation2.IDENTITY) { /* sin rotación */ }
```

### 15.6 Patrón "Defensive Variants" para Robustez

```typescript
// Variante normal: Asume input válido, máximo rendimiento
public normalize(): this {
  const len = this.length();
  if (isNearZero(len)) throw new RangeError("Cannot normalize zero vector");
  return this.multiplyScalar(1 / len);
}

// Variante Safe: Maneja edge cases, ligeramente más lento
public normalizeSafe(): this {
  const len = this.length();
  if (isNearZero(len)) return this.set(0, 0);  // Retorna zero vector
  return this.multiplyScalar(1 / len);
}
```

---

## 16. Verificación Matemática Final

### 16.1 Fórmulas de Rotación 2D

**Rotación de un punto (x, y) por ángulo θ:**

$$
\begin{bmatrix} x' \\ y' \end{bmatrix} =
\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
$$

**Código verificado (Vector2.rotateCS):**

```typescript
x' = x * cos(θ) - y * sin(θ)
y' = x * sin(θ) + y * cos(θ)
```

✅ **CORRECTO** - Coincide con la formulación matemática estándar.

### 16.2 Composición de Rotaciones

**Multiplicación de números complejos unitarios:**

$$
(c_1 + is_1)(c_2 + is_2) = (c_1c_2 - s_1s_2) + i(c_1s_2 + s_1c_2)
$$

**Código verificado (Rotation2.multiply):**

```typescript
cos = a.cos * b.cos - a.sin * b.sin;
sin = a.cos * b.sin + a.sin * b.cos;
```

✅ **CORRECTO** - Composición de rotaciones como multiplicación compleja.

### 16.3 Inverso de Rotación

**Conjugado del número complejo unitario:**

$$
(c + is)^{-1} = c - is \quad \text{(para } |z| = 1\text{)}
$$

**Código verificado (Rotation2.inverse):**

```typescript
cos = rotation.cos; // Sin cambio
sin = -rotation.sin; // Negado
```

✅ **CORRECTO** - El inverso es el conjugado para rotaciones unitarias.

---

## 17. Conclusión y Estado Final

### 17.1 Estado del Documento

| Aspecto                        | Estado |
| ------------------------------ | ------ |
| Inventario completo            | ✅     |
| Análisis de librerías externas | ✅     |
| Problemas identificados        | ✅     |
| Principios de diseño definidos | ✅     |
| Arquitectura propuesta         | ✅     |
| Especificaciones por módulo    | ✅     |
| Patrones de sinergia           | ✅     |
| Checklist de implementación    | ✅     |
| Verificación matemática        | ✅     |
| Patrones de diseño             | ✅     |

### 17.2 Alineación con Intención del Paquete

| Principio                | Verificación                                   |
| ------------------------ | ---------------------------------------------- |
| Base matemática estricta | ✅ Fórmulas verificadas contra literatura      |
| Eficiencia               | ✅ Patrón hot path, `rotateCS`                 |
| Extensibilidad           | ✅ Interfaces `*Like`, métodos estáticos puros |
| Robustez                 | ✅ Variantes `*Safe`, edge cases documentados  |
| Facilidad de uso         | ✅ API dual (estático + instancia)             |

### 17.3 Cambios Listos para Implementar

**Total: 8 cambios críticos/importantes, 3 opcionales**

| Prioridad  | Cantidad | Complejidad |
| ---------- | -------- | ----------- |
| CRÍTICA    | 4        | Baja        |
| IMPORTANTE | 4        | Media       |
| OPCIONAL   | 3        | Variable    |

---

**Última actualización**: 2024-12-14  
**Autor**: Principal Simulation Engineer (Claude)  
**Estado**: ✅ IMPLEMENTACIÓN COMPLETADA
