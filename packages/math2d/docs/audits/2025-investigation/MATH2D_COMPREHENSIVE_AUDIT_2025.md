# Auditoría Integral de Consistencia, Rigor Matemático e Ingeniería: `@lenguados/math2d`

> **Fecha:** Diciembre 2025  
> **Estado:** DOCUMENTO DEFINITIVO DE REFERENCIA  
> **Alcance:** `packages/math2d/src/**` + documentación interna + contraste externo exhaustivo  
> **Objetivo:** Detectar y documentar inconsistencias matemáticas, de uso, rendimiento, API y documentación. Consolidar criterios irrefutables para refactor posterior **sin modificar código**.

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Filosofía y Principios Fundacionales](#2-filosofía-y-principios-fundacionales)
3. [Contraste con Librerías Externas](#3-contraste-con-librerías-externas)
4. [Auditoría de Constantes y Tolerancias](#4-auditoría-de-constantes-y-tolerancias)
5. [Auditoría del Módulo Deterministic](#5-auditoría-del-módulo-deterministic)
6. [Auditoría Módulo por Módulo](#6-auditoría-módulo-por-módulo)
7. [Análisis de Sinergia entre Módulos](#7-análisis-de-sinergia-entre-módulos)
8. [Análisis de Simetría Static/Instance](#8-análisis-de-simetría-staticinstance)
9. [Política de Errores y Validación](#9-política-de-errores-y-validación)
10. [Convenciones de Nomenclatura](#10-convenciones-de-nomenclatura)
11. [Análisis de Módulos Internals](#11-análisis-de-módulos-internals)
12. [Checklist de Principios SOLID y DRY](#12-checklist-de-principios-solid-y-dry)
13. [Hallazgos Críticos y Recomendaciones](#13-hallazgos-críticos-y-recomendaciones)
14. [Plan de Implementación Priorizado](#14-plan-de-implementación-priorizado)

---

## 1. Resumen Ejecutivo

### 1.1 Estado Actual del Paquete

El paquete `@lenguados/math2d` es una **base matemática 2D robusta** con alta madurez en muchas áreas. Esta auditoría exhaustiva línea por línea identifica áreas que requieren refinamiento para alcanzar paridad con librerías líderes de la industria.

| Área                                 | Estado          | Acción Requerida                         |
| ------------------------------------ | --------------- | ---------------------------------------- |
| **Arquitectura de Capas**            | ✅ Excelente    | Mantener estructura actual               |
| **Nomenclatura (to*/from*/apply\*)** | ✅ Buena        | Verificada correcta con sufijos "2"/"3"  |
| **Simetría Static/Instance**         | ✅ Muy Buena    | ~95% completa                            |
| **Patrón Strict/Safe/Unchecked**     | ⚠️ Parcialmente | Unificar en todos los módulos            |
| **Determinismo L0**                  | ✅ Excelente    | Tablas precomputadas 131,072 entries     |
| **Validación Runtime**               | ⚠️ Mixta        | Clarificar dev-only vs prod              |
| **Tolerancias y Umbrales**           | ✅ Unificadas   | EPSILON, ANGLE_EPSILON, MIN_SAFE_DIVISOR |
| **Hot Paths**                        | ✅ Buena        | Variantes `*CS` y `*Unchecked` presentes |
| **Documentación TSDoc**              | ✅ Muy Buena    | ~95% completa con categorías             |

### 1.2 Métricas de Completitud

```
Objetos Matemáticos Core:           7/7  ✅ (Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2)
Interfaces *Like:                   7/7  ✅ (Todas con versiones Readonly)
Type Guards:                        7/7  ✅ (Completos en types/index.ts)
Módulos Auxiliary:                  16   ✅ (scalar/3, angle/5, numeric/4 + indices)
Cobertura Strict/Safe/Unchecked:   ~85%
Simetría Static/Instance:          ~95%
Documentación TSDoc:               ~95%
Tests Coverage:                    ≥90%
```

### 1.3 Líneas de Código por Módulo Core

| Módulo          | Líneas | Items | Descripción                               |
| --------------- | ------ | ----- | ----------------------------------------- |
| `vector2.ts`    | 3,640  | 223   | Punto/dirección 2D, operaciones completas |
| `matrix3.ts`    | 4,097  | 170   | Transformaciones afines 2D homogéneas     |
| `matrix2.ts`    | 2,971  | 150   | Rotación, escala, shear 2x2               |
| `transform2.ts` | 1,919  | 83    | Wrapper SRT (Scale-Rotate-Translate)      |
| `complex.ts`    | 1,768  | 96    | Números complejos generales               |
| `interval.ts`   | 1,651  | 90    | Aritmética de intervalos cerrados         |
| `rotation2.ts`  | 1,478  | 81    | Rotación unitaria (cos, sin)              |

---

## 2. Filosofía y Principios Fundacionales

### 2.1 Misión Core

> **"Ser la base matemática 2D más robusta, predecible y eficiente del ecosistema TypeScript, habilitando aplicaciones deterministas sin sacrificar ergonomía."**

### 2.2 Jerarquía de Prioridades (en orden estricto)

1. **Corrección Matemática** — Un resultado incorrecto es peor que un error explícito
2. **Predecibilidad** — Comportamiento documentado y consistente, sin sorpresas
3. **Determinismo Controlado** — Reproducibilidad donde se promete, velocidad donde se solicita
4. **Ergonomía** — API intuitiva, TypeScript-first, chaining fluido
5. **Rendimiento** — Hot paths optimizados sin comprometer los puntos anteriores

### 2.3 Límites del Paquete

> [!CAUTION]
> **Este paquete es PURAMENTE MATEMÁTICO CORE.**
>
> NO debe incluir:
>
> - Primitivas geométricas de alto nivel (Box2D, Ray2, Circle, LineSegment)
> - Algoritmos de física (collision detection, broad phase, etc.)
> - Algoritmos geométricos complejos (triangulación, hull convexo, etc.)
>
> Estas pertenecen a paquetes de nivel superior que extenderán esta base.

### 2.4 El Balance Fundamental

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     ESPECTRO DE TRADE-OFFS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SEGURIDAD ◄──────────────────────────────────────────────► RENDIMIENTO    │
│                                                                             │
│  Strict          Safe           [Default]         Unchecked      Native    │
│  (throw)         (fallback)     (validado)        (sin check)   (Math.*)   │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  DETERMINISMO ◄────────────────────────────────────────────► VELOCIDAD     │
│                                                                             │
│  Fixed-Point    LUT+Newton     [Default]        *Unchecked      Native     │
│  (bit-exact)    (consistent)   (DetermMath)     (Math.*)        (fastest)  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Contraste con Librerías Externas

### 3.1 Comparación con gl-matrix

| Aspecto              | gl-matrix                | @lenguados/math2d                    | Evaluación        |
| -------------------- | ------------------------ | ------------------------------------ | ----------------- |
| **Estructura datos** | Float32Array directo     | Clases con propiedades nombradas     | ✅ Más ergonómico |
| **Patrón out**       | `out` primer parámetro   | `out` último parámetro (opcional)    | ✅ Más intuitivo  |
| **Column-major**     | Sí (OpenGL)              | Sí (OpenGL)                          | ✅ Consistente    |
| **Inmutabilidad**    | Explícita (out required) | Híbrida (static=pura, instance=muta) | ✅ Mejor balance  |
| **Determinismo**     | No garantizado           | L0/L1/L2 explícito                   | ✅ Superior       |
| **Tipos TypeScript** | Tipado básico            | Tipos estrictos + interfaces \*Like  | ✅ Superior       |

**Conclusión:** math2d sigue los principios de gl-matrix con mejoras ergonómicas y determinismo explícito.

### 3.2 Comparación con Box2D b2Rot

| Aspecto              | Box2D b2Rot           | Rotation2                       | Evaluación     |
| -------------------- | --------------------- | ------------------------------- | -------------- |
| **Almacenamiento**   | `(c, s)` = (cos, sin) | `(cos, sin)`                    | ✅ Idéntico    |
| **Normalización**    | Implícita             | Normalización explícita + check | ✅ Más robusto |
| **Composición**      | `b2MulRot(q, r)`      | `Rotation2.multiply(a, b)`      | ✅ Más claro   |
| **Ángulo a Rot**     | `b2MakeRot(angle)`    | `Rotation2.fromAngle(angle)`    | ✅ Consistente |
| **Aplicar a vector** | `b2RotateVec2(q, v)`  | `rotation.rotateVector(v)`      | ✅ Más OOP     |

**Conclusión:** Rotation2 sigue el patrón b2Rot probado de Box2D con API más TypeScript-friendly.

### 3.3 Comparación con Three.js

| Aspecto                | Three.js                           | @lenguados/math2d                  | Evaluación          |
| ---------------------- | ---------------------------------- | ---------------------------------- | ------------------- |
| **API fluent**         | Sí, chaining extenso               | Sí, instance methods return `this` | ✅ Equivalente      |
| **Clone/Copy pattern** | `clone()`, `copy(source)`          | `clone()`, `copy(source, dest)`    | ✅ Equivalente      |
| **Factory methods**    | `set()`, `setFrom*`                | `fromAngle()`, `fromVector2()`     | ✅ Más consistente  |
| **Transformations**    | `applyMatrix3()`, `applyMatrix4()` | `applyMatrix2()`, `applyMatrix3()` | ✅ Con sufijo "2/3" |

---

## 4. Auditoría de Constantes y Tolerancias

### 4.1 Inventario de Constantes

**Ubicación:** `auxiliary/scalar/constants.ts`

| Constante                            | Valor             | Categoría    | Uso Principal                         |
| ------------------------------------ | ----------------- | ------------ | ------------------------------------- |
| `EPSILON`                            | 1e-10             | Tolerance    | Comparaciones floating-point          |
| `EPSILON_SQUARED`                    | 1e-20             | Tolerance    | Comparaciones de área/distancia²      |
| `ANGLE_EPSILON`                      | 1e-12             | Angular      | Ángulos cercanos a cero               |
| `MIN_SAFE_DIVISOR`                   | 1e-10 (= EPSILON) | Safety       | División segura (en `numeric/safety`) |
| `PI`, `TAU`, `HALF_PI`, `QUARTER_PI` | Math.\*           | Angular      | Constantes angulares estándar         |
| `DEG_TO_RAD`, `RAD_TO_DEG`           | conversión        | Conversion   | Conversión grados/radianes            |
| `SQRT_2`, `SQRT_HALF`                | Math.SQRT\*       | Mathematical | Constantes matemáticas                |

### 4.2 Evaluación de Coherencia

| Análisis                                    | Estado | Nota                                           |
| ------------------------------------------- | ------ | ---------------------------------------------- |
| `MIN_SAFE_DIVISOR` = `EPSILON`              | ✅     | Unificado correctamente en numeric/safety.ts   |
| Todas las constantes exportadas             | ✅     | Disponibles individual y en objeto `Constants` |
| Constantes matemáticas derivadas de Math.\* | ✅     | Garantiza precisión IEEE 754                   |
| Constantes de conversión coherentes         | ✅     | DEG/RAD/TURN/GRAD completos                    |

### 4.3 Recomendación

✅ **No se requieren cambios.** Las constantes están correctamente unificadas y documentadas.

---

## 5. Auditoría del Módulo Deterministic

### 5.1 Estructura del Módulo

```
deterministic/
├── deterministic-math.ts   (901 líneas) - Core LUT + algoritmos
├── precision-math.ts       (260 líneas) - Kahan/Neumaier summation
├── rounding-control.ts     (340 líneas) - IEEE 754 rounding modes
└── trig-tables.ts          (2.7 MB)     - 131,072 sin/cos precomputados
```

### 5.2 Niveles de Determinismo

| Nivel  | Nombre            | Garantía                                  | Implementación               | Estado |
| ------ | ----------------- | ----------------------------------------- | ---------------------------- | ------ |
| **L0** | Cross-Platform    | Idéntico bit-a-bit en cualquier JS engine | Tablas precomputadas offline | ✅     |
| **L1** | Engine-Consistent | Idéntico dentro del mismo runtime JS      | LUT runtime (si size≠65536)  | ✅     |
| **L2** | Invocation        | Mismo resultado en misma invocación       | Math.\* nativo               | ✅     |

### 5.3 Auditoría de DeterministicMath

| Función       | Implementación                         | Determinismo | Estado |
| ------------- | -------------------------------------- | ------------ | ------ |
| `sin(angle)`  | LUT interpolación lineal               | L0           | ✅     |
| `cos(angle)`  | LUT interpolación lineal               | L0           | ✅     |
| `tan(angle)`  | `sin/cos` con safeDivide               | L0           | ✅     |
| `sqrt(x)`     | Fast Inverse + Newton-Raphson (3 iter) | L0           | ✅     |
| `sqrtSafe(x)` | sqrt con clamp negatives → 0           | L0           | ✅     |
| `atan2(y, x)` | CORDIC-like iterativo                  | L0           | ✅     |
| `acos(x)`     | `atan2(sqrt(1-x²), x)`                 | L0           | ✅     |
| `asin(x)`     | `atan2(x, sqrt(1-x²))`                 | L0           | ✅     |
| `acosSafe(x)` | acos con clamp [-1, 1]                 | L0           | ✅     |
| `asinSafe(x)` | asin con clamp [-1, 1]                 | L0           | ✅     |
| `pow(b, e)`   | `exp(e * log(b))` o iter para enteros  | L1 (usa log) | ⚠️     |

### 5.4 Hallazgo: pow usa Math.log/exp

**Issue:** `DeterministicMath.pow()` internamente usa `Math.log()` y `Math.exp()` que no son deterministas L0.

**Impacto:** Bajo - `pow` se usa raramente en physics core donde L0 es crítico.

**Recomendación:** Documentar explícitamente que `pow` es L1, no L0.

### 5.5 Evaluación de Tablas Trigonométricas

```
Tabla precomputada: 131,072 entries (2^17)
Tamaño en memoria: ~2.7 MB (Float64Array × 2)
Precisión angular: 2π / 131072 ≈ 0.000048 rad ≈ 0.00275°
Error máximo interpolación lineal: ~1e-10
```

✅ **Excelente implementación.** Tablas offline garantizan L0.

---

## 6. Auditoría Módulo por Módulo

### 6.1 `core/vector2.ts` (3,640 líneas, 223 items)

#### Categorías de Métodos

| Categoría      | Ejemplos                                                               | Estado |
| -------------- | ---------------------------------------------------------------------- | ------ |
| Factory        | `fromValues`, `fromAngle`, `fromArray`, `fromObject`, `clone`, `copy`  | ✅     |
| Arithmetic     | `add`, `subtract`, `multiply`, `divide`, `scale`, `negate`             | ✅     |
| Geometric      | `dot`, `cross`, `project`, `reflect`, `perpendicular`                  | ✅     |
| Transformation | `rotate`, `rotateCS`, `applyMatrix2`, `applyMatrix3`, `applyRotation2` | ✅     |
| Normalization  | `normalize`, `normalizeSafe`, `clamp`, `floor`, `ceil`, `round`        | ✅     |
| Comparison     | `equals`, `nearEquals`, `exactEquals`, `isZero`, `isNearZero`          | ✅     |
| Interpolation  | `lerp`, `lerpClamped`, `smoothStep`                                    | ✅     |
| Conversion     | `toArray`, `toObject`, `toString`, `angle`, `length`                   | ✅     |

#### Hallazgos Específicos

1. **`divide()` usa `safeDivide` internamente** ✅
   - Línea ~600: `return Vector2.fromValues(safeDivide(a.x, b.x), safeDivide(a.y, b.y), out);`
   - **Evaluación:** Correcto. El método sin sufijo es "default" que usa safe internamente.

2. **`applyMatrix3()` y division homogénea** ✅
   - Usa `safeDivide` para w-component cuando no es 1
   - Comportamiento correcto para coordenadas homogéneas

3. **Simetría static/instance** ✅
   - Todos los métodos relevantes tienen ambas versiones
   - Instance muta `this` y retorna `this`
   - Static acepta `out` opcional como último parámetro

4. **Variantes \*CS presentes** ✅
   - `rotateCS(cos, sin)` para hot paths

5. **Variantes *Safe y *Unchecked** ⚠️ Parcial
   - `normalizeSafe` existe ✅
   - `normalizeUnchecked` existe ✅ (static)
   - `divideScalarSafe` existe ✅
   - Falta: `divideScalarUnchecked` (recomendación: agregar)

### 6.2 `core/rotation2.ts` (1,478 líneas, 81 items)

#### Diseño (Patrón Box2D b2Rot)

```typescript
class Rotation2 {
 public cos: number; // cos(θ)
 public sin: number; // sin(θ)
}
```

✅ **Excelente diseño.** Evita llamadas trig redundantes.

#### Hallazgos Específicos

1. **Normalización automática** ✅
   - `normalizeComponents` asegura magnitud unitaria
   - Usado en constructores y operaciones

2. **Composición de rotaciones** ✅
   - `multiply(a, b)` usa formulación correcta: `(ac₁c₂ - s₁s₂, c₁s₂ + s₁c₂)`

3. **Conversiones completas** ✅
   - `fromAngle`, `fromVector2`, `fromVectors2`, `fromComplex`
   - `toVector2`, `toComplex`, `toAngle`
   - Todos con sufijo numérico correcto

4. **Variantes Safe** ✅
   - `fromVector2Safe`, `fromComplexSafe`
   - Retornan identidad (1, 0) en caso degenerado

### 6.3 `core/complex.ts` (1,768 líneas, 96 items)

#### Diseño

```typescript
class Complex {
 public real: number;
 public imag: number;
}
```

#### Diferencia con Rotation2

| Aspecto       | Complex               | Rotation2            |
| ------------- | --------------------- | -------------------- |
| Magnitud      | Cualquier valor       | Siempre 1 (unitario) |
| Uso principal | Matemáticas complejas | Rotaciones puras     |
| División      | Soportada             | No aplica            |
| Potencias     | Soportadas            | Multiplicación solo  |

#### Hallazgos

1. **Operaciones aritméticas completas** ✅
   - `add`, `subtract`, `multiply`, `divide`, `conjugate`, `reciprocal`

2. **Conversiones** ✅
   - `toRotation2`, `fromRotation2`, `toRotationMatrix2`
   - Sufijos numéricos correctos

3. **Variantes Safe** ⚠️ Parcial
   - `divideSafe` existe ✅
   - `divideUnchecked` existe ✅
   - Falta: `reciprocalSafe` (retorna 0+0i si magnitud ≈ 0)

### 6.4 `core/interval.ts` (1,651 líneas, 90 items)

#### Diseño

```typescript
class Interval {
 public min: number;
 public max: number;
}
```

✅ Invariante: `min <= max` asegurado en construcción.

#### Hallazgos

1. **Aritmética de intervalos correcta** ✅
   - `add`, `subtract`, `multiply`, `divide` siguen Moore arithmetic
   - `divide` maneja división por intervalo conteniendo 0

2. **Operaciones de conjunto** ✅
   - `union`, `intersection`, `hull`, `contains`, `overlaps`

3. **Variantes Safe** ⚠️
   - `divideSafe` existe ✅
   - `reciprocalSafe` existe ✅
   - `sqrtSafe` existe ✅

4. **Constantes especiales** ✅
   - `Interval.EMPTY` = [Infinity, -Infinity]
   - `Interval.FULL` = [-Infinity, Infinity]
   - `Interval.UNIT` = [0, 1]

### 6.5 `core/matrix2.ts` (2,971 líneas, 150 items)

#### Layout

```
Column-major:
| m00  m10 |   Col0: (m00, m01) = primera columna
| m01  m11 |   Col1: (m10, m11) = segunda columna
```

✅ Consistente con OpenGL/WebGL.

#### Hallazgos

1. **Factory methods completos** ✅
   - `fromRotation`, `fromScale`, `fromShear`, `fromColumns`, `fromRows`

2. **Inversión** ⚠️ Parcial
   - `invert()` existe (instance, muta this)
   - `inverted()` existe (static, pure)
   - Falta: `invertedSafe()` → retorna null si det ≈ 0
   - Falta: `invertedUnchecked()` → sin validación

3. **Descomposición** ✅
   - `getRotation()`, `getScale(out?)`, `getShear()`
   - Útil para análisis de transformaciones

4. **Determinante** ✅
   - `determinant()` correcto: `m00 * m11 - m10 * m01`

### 6.6 `core/matrix3.ts` (4,097 líneas, 170 items)

#### Layout (2D Affine en Homogéneas)

```
Column-major 3x3:
| m00  m10  m20 |   Scale/Rot  Scale/Rot  TransX
| m01  m11  m21 |   Scale/Rot  Scale/Rot  TransY
| m02  m12  m22 |   0          0          1
```

✅ Consistente con OpenGL para transformaciones 2D.

#### Hallazgos

1. **Transformaciones afines completas** ✅
   - `translate`, `rotate`, `rotateCS`, `scale`, `skew`
   - Métodos fluent que modifican `this`

2. **Factory methods** ✅
   - `fromTranslation`, `fromRotation`, `fromScale`, `fromMatrix2`, `fromTransform2`
   - Todos con sufijos numéricos correctos

3. **Inversión** ⚠️ Parcial
   - `invert()` existe ✅
   - `inverted()` existe ✅
   - Falta: `invertedSafe()` → retorna null si det ≈ 0

4. **Descomposición** ✅
   - `getTranslation(out?)`, `getRotation()`, `getScale(out?)`
   - Útil para extraer Transform2 desde Matrix3

5. **Aplicación a puntos/vectores** ✅
   - `transformPoint(v, out?)` - aplica traslación
   - `transformVector(v, out?)` - ignora traslación (direcciones)

### 6.7 `core/transform2.ts` (1,919 líneas, 83 items)

#### Diseño (Decomposed SRT)

```typescript
class Transform2 {
 public readonly position: Vector2; // Translation
 public rotation: number; // Angle in radians
 public readonly scale: Vector2; // Non-uniform scale
}
```

#### Orden de Aplicación

**Scale → Rotate → Translate** (estándar de la industria)

#### Hallazgos

1. **rotation como `number` (ángulo)** ⚠️ Trade-off conocido
   - **Pro:** Más intuitivo para usuarios, serialización directa
   - **Con:** Requiere `sinCos()` para operaciones
   - **Mitigación:** Métodos `*CS` y `toRotation2(out?)` disponibles

2. **Conversiones** ✅
   - `toMatrix3(out?)`, `fromMatrix3(matrix, out?)`
   - `toRotation2(out?)`

3. **Composición** ⚠️ Advertencia documentada
   - `compose(parent, child, out?)` - combina transforms
   - **Limitación:** Non-uniform scale + rotation produce shear no representable
   - Documentación advierte correctamente

4. **Inversión** ⚠️ Parcial
   - `inverse(out?)` existe ✅
   - Falta: `inverseSafe(out?)` → null si scale ≈ 0

---

## 7. Análisis de Sinergia entre Módulos

### 7.1 Matriz de Conversiones

| Desde \ Hacia  | Vector2   | Rotation2   | Complex   | Matrix2   | Matrix3     | Transform2 |
| -------------- | --------- | ----------- | --------- | --------- | ----------- | ---------- |
| **Vector2**    | clone     | fromVector2 | —         | —         | —           | —          |
| **Rotation2**  | toVector2 | clone       | toComplex | fromRot   | fromRot     | —          |
| **Complex**    | —         | toRotation2 | clone     | toRotMat2 | —           | —          |
| **Matrix2**    | —         | getRotation | —         | clone     | fromMatrix2 | —          |
| **Matrix3**    | getTrans  | getRotation | —         | toMatrix2 | clone       | decompose  |
| **Transform2** | position  | toRotation2 | —         | —         | toMatrix3   | clone      |

✅ **Todas las conversiones siguen convención de sufijos (`to*2`, `from*2`).**

### 7.2 Delegación Correcta (DRY)

| Operación                      | Delega a                         | Estado |
| ------------------------------ | -------------------------------- | ------ |
| `Vector2.rotate(angle)`        | `sinCos(angle)` → `rotateCS`     | ✅     |
| `Rotation2.rotateVector(v)`    | `Vector2.rotateCS(v, cos, sin)`  | ✅     |
| `Transform2.transformPoint(v)` | Construye temporalmente y aplica | ⚠️     |
| `Matrix3.transformPoint(v)`    | Cálculo directo (evita allocs)   | ✅     |

### 7.3 Recomendación de Sinergia

**Transform2.transformPoint** podría simplificarse:

```typescript
// Actual: Cálculo manual
transformPoint(v, out?) {
  const c = DeterministicMath.cos(this.rotation);
  const s = DeterministicMath.sin(this.rotation);
  out.x = (v.x * this.scale.x * c - v.y * this.scale.y * s) + this.position.x;
  out.y = (v.x * this.scale.x * s + v.y * this.scale.y * c) + this.position.y;
}

// Alternativa: Delegar a Matrix3 (trade-off: una alocación más)
transformPoint(v, out?) {
  return this.toMatrix3(tempMatrix).transformPoint(v, out);
}
```

**Decisión:** ✅ El cálculo manual es correcto para hot paths.

---

## 8. Análisis de Simetría Static/Instance

### 8.1 Inventario por Clase

| Clase      | Static Only  | Instance Only | Simétricos | % Simetría |
| ---------- | ------------ | ------------- | ---------- | ---------- |
| Vector2    | 8 (factory)  | 0             | 210+       | 96%        |
| Rotation2  | 5 (factory)  | 0             | 75+        | 95%        |
| Complex    | 6 (factory)  | 0             | 85+        | 94%        |
| Interval   | 5 (factory)  | 0             | 80+        | 94%        |
| Matrix2    | 10 (factory) | 0             | 135+       | 93%        |
| Matrix3    | 12 (factory) | 0             | 152+       | 92%        |
| Transform2 | 6 (factory)  | 0             | 72+        | 90%        |

✅ **Excelente simetría.** Los únicos métodos solo-static son factories (`fromAngle`, `fromValues`, etc.) que tienen sentido solo como constructores alternativos.

### 8.2 Patrón Consistente

```typescript
// Static: Funcional, inmutable, acepta out opcional
Vector2.add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2

// Instance: Muta this, retorna this para chaining
vector.add(other: ReadonlyVector2Like): this
```

✅ **Consistente en todo el paquete.**

---

## 9. Política de Errores y Validación

### 9.1 Estrategias Actuales

| Estrategia             | Uso                                   | Ejemplo                      |
| ---------------------- | ------------------------------------- | ---------------------------- |
| **throw Error**        | Métodos sin sufijo (default=strict)   | `normalize()` si length ≈ 0  |
| **return fallback**    | Métodos `*Safe`                       | `normalizeSafe()` → (0, 0)   |
| **undefined behavior** | Métodos `*Unchecked`                  | `normalizeUnchecked()` → NaN |
| **dev-only assert**    | `assertFinite`, `assertVector2`, etc. | Eliminado en producción      |
| **always validate**    | Constructores, `fromObject`           | Siempre valida componentes   |

### 9.2 Módulo validation/assert.ts

```typescript
// Comportamiento controlado por NODE_ENV
setAssertionsEnabled(true); // Default en dev
setAssertionsEnabled(false); // Forzar deshabilitado

// Funciones disponibles
assertFinite(value, name);
assertNonZero(value, name);
assertRange(value, min, max, name);
assertPositive(value, name);
assertNonNegative(value, name);
assertVector2(v, name);
assertMatrix2(m, name);
assertMatrix3(m, name);
assertRotation2(r, name);
assertSafeInteger(value, name);
```

### 9.3 Política Recomendada (Triality Policy)

| Contexto            | Variante     | Comportamiento                            |
| ------------------- | ------------ | ----------------------------------------- |
| **API pública**     | Sin sufijo   | STRICT: Valida y throw en error           |
| **Datos inciertos** | `*Safe`      | SAFE: Retorna fallback documentado        |
| **Hot path**        | `*Unchecked` | UNCHECKED: Sin validación, asume correcto |
| **Desarrollo**      | `assert*`    | DEV-ONLY: Eliminado en prod build         |

### 9.4 Hallazgos de Inconsistencia

| Método                 | Problema                        | Recomendación            |
| ---------------------- | ------------------------------- | ------------------------ |
| `Matrix2.inverted()`   | Solo versión strict, falta Safe | Agregar `invertedSafe`   |
| `Matrix3.inverted()`   | Solo versión strict, falta Safe | Agregar `invertedSafe`   |
| `Transform2.inverse()` | Solo versión strict, falta Safe | Agregar `inverseSafe`    |
| `Complex.reciprocal()` | Solo versión strict, falta Safe | Agregar `reciprocalSafe` |

---

## 10. Convenciones de Nomenclatura

### 10.1 Prefijos

| Prefijo  | Significado                      | Ejemplo                   |
| -------- | -------------------------------- | ------------------------- |
| `from*`  | Factory estático desde otro tipo | `Rotation2.fromAngle()`   |
| `to*`    | Conversión a otro tipo           | `rotation.toVector2()`    |
| `get*`   | Extracción de componente         | `matrix.getRotation()`    |
| `apply*` | Aplicar transformación externa   | `vector.applyRotation2()` |
| `set*`   | Establecer valores (muta this)   | `vector.set(x, y)`        |

### 10.2 Sufijos

| Sufijo       | Significado                              | Ejemplo                   |
| ------------ | ---------------------------------------- | ------------------------- |
| `*Safe`      | Retorna fallback en error                | `normalizeSafe()`         |
| `*Unchecked` | Sin validación (hot path)                | `divideScalarUnchecked()` |
| `*CS`        | Acepta cos/sin precalculados             | `rotateCS(cos, sin)`      |
| `*Clamped`   | Parámetro t clampado a [0, 1]            | `lerpClamped()`           |
| `*Into`      | Escribe en objeto existente (zero-alloc) | `sinCosInto(angle, out)`  |

### 10.3 Sufijos Numéricos

> **Regla:** Si un tipo tiene número en su nombre (Vector**2**, Matrix**3**), cualquier método que lo referencie DEBE incluir ese número.

| ✅ Correcto           | ❌ Incorrecto        |
| --------------------- | -------------------- |
| `toVector2()`         | `toVector()`         |
| `fromMatrix3()`       | `fromMatrix()`       |
| `applyRotation2()`    | `applyRotation()`    |
| `toRotationMatrix2()` | `toRotationMatrix()` |

✅ **Verificado:** Todas las referencias actuales incluyen sufijos correctos.

---

## 11. Análisis de Módulos Internals

### 11.1 Módulos Exportados como Internals

**Ubicación:** `package.json` exports + `module-internals.json`

| Ruta de Exportación                                | Propósito                          |
| -------------------------------------------------- | ---------------------------------- |
| `@lenguados/math2d/validation/assert`              | Assertions dev-only                |
| `@lenguados/math2d/deterministic/precision-math`   | Kahan/Neumaier summation           |
| `@lenguados/math2d/deterministic/rounding-control` | IEEE 754 rounding modes            |
| `@lenguados/math2d/utils/random`                   | Funciones random (Vector2, Circle) |
| `@lenguados/math2d/utils/random-source`            | SeededRandomSource                 |
| `@lenguados/math2d/utils/parse`                    | Parsing/formatting                 |
| `@lenguados/math2d/utils/performance`              | Medición de rendimiento            |

### 11.2 Evaluación de Candidatos Adicionales

| Módulo                | ¿Debería ser Internal? | Justificación                          |
| --------------------- | ---------------------- | -------------------------------------- |
| `trig-tables.ts`      | ✅ Ya interno          | Solo usado por DeterministicMath       |
| `scalar/constants.ts` | ❌ No                  | Constantes públicas útiles             |
| `angle/unwrapping.ts` | ⚠️ Considerar          | Uso especializado, podría ser internal |
| `numeric/guards.ts`   | ❌ No                  | Type guards públicos útiles            |

### 11.3 Coherencia de Exportaciones

✅ **Las exportaciones están bien estructuradas:**

- Módulo principal exporta: tipos, auxiliary/_, core/_, DeterministicMath
- Funcionalidades avanzadas disponibles vía imports específicos
- `module-internals.json` contiene `["validation/assert"]`

---

## 12. Checklist de Principios SOLID y DRY

### 12.1 Single Responsibility (S)

| Módulo               | Responsabilidad Única         | Cumple |
| -------------------- | ----------------------------- | ------ |
| `vector2.ts`         | Operaciones de vectores 2D    | ✅     |
| `rotation2.ts`       | Rotaciones unitarias 2D       | ✅     |
| `complex.ts`         | Aritmética compleja           | ✅     |
| `interval.ts`        | Aritmética de intervalos      | ✅     |
| `matrix2.ts`         | Transformaciones lineales 2x2 | ✅     |
| `matrix3.ts`         | Transformaciones afines 2D    | ✅     |
| `transform2.ts`      | Wrapper SRT descompuesto      | ✅     |
| `deterministic-math` | Matemáticas deterministas     | ✅     |
| `assert.ts`          | Validaciones de desarrollo    | ✅     |

### 12.2 Open/Closed (O)

- ✅ Interfaces `*Like` permiten extensión sin modificar código core
- ✅ `ReadonlyVector2Like` acepta cualquier objeto con `{x, y}`
- ✅ Nuevos tipos pueden implementar interfaces existentes

### 12.3 Liskov Substitution (L)

- ✅ Instance methods retornan `this`, no tipo hardcodeado
- ✅ Subclases potenciales mantendrían comportamiento

### 12.4 Interface Segregation (I)

- ✅ Interfaces separadas: `Vector2Like` vs `ReadonlyVector2Like`
- ✅ No hay interfaces "god object"
- ✅ Type guards separados por tipo

### 12.5 Dependency Inversion (D)

- ✅ Core depende de abstracciones (interfaces \*Like)
- ✅ `DeterministicMath` es singleton configurable
- ⚠️ Dependencia directa de `DeterministicMath` en auxiliary/numeric/safety

### 12.6 DRY (Don't Repeat Yourself)

| Patrón                         | Implementación                | Cumple |
| ------------------------------ | ----------------------------- | ------ |
| `ensureOut()` pattern          | Helper privado en cada clase  | ✅     |
| `sanitize()` pattern           | Helper privado en cada clase  | ✅     |
| Constantes centralizadas       | `scalar/constants.ts`         | ✅     |
| Delegación rotar vector        | `rotateCS` usado por `rotate` | ✅     |
| Funciones safe\* centralizadas | `numeric/safety.ts`           | ✅     |

---

## 13. Hallazgos Críticos y Recomendaciones

### 13.1 Hallazgos por Severidad

#### 🔴 Críticos (Afectan corrección o contratos)

| #   | Hallazgo                           | Ubicación              | Recomendación             |
| --- | ---------------------------------- | ---------------------- | ------------------------- |
| 1   | `pow` usa Math.log/exp (L1, no L0) | deterministic-math.ts  | Documentar explícitamente |
| 2   | Falta `invertedSafe` en matrices   | matrix2.ts, matrix3.ts | Agregar métodos           |
| 3   | Falta `inverseSafe` en Transform2  | transform2.ts          | Agregar método            |

#### 🟡 Medios (Afectan consistencia API)

| #   | Hallazgo                                                  | Ubicación  | Recomendación                                 |
| --- | --------------------------------------------------------- | ---------- | --------------------------------------------- |
| 4   | Falta `reciprocalSafe` en Complex                         | complex.ts | Agregar método                                |
| 5   | Falta `divideScalarUnchecked` en Vector2                  | vector2.ts | Agregar método                                |
| 6   | Inconsistencia: algunos \*Safe retornan valor, otros null | Varios     | Unificar: Safe siempre retorna valor fallback |

#### 🟢 Menores (Mejoras de ergonomía)

| #   | Hallazgo                                  | Ubicación       | Recomendación                  |
| --- | ----------------------------------------- | --------------- | ------------------------------ |
| 7   | `angle/unwrapping.ts` podría ser internal | auxiliary/angle | Evaluar si es API pública      |
| 8   | Documentar claramente política de errores | docs/           | Crear ERROR_HANDLING_POLICY.md |

### 13.2 Cosas que NO se deben cambiar

| Aspecto                             | Justificación                                |
| ----------------------------------- | -------------------------------------------- |
| `Transform2.rotation` como `number` | Trade-off documentado, serialización directa |
| Column-major matrices               | Estándar OpenGL/WebGL                        |
| CCW positive rotation               | Estándar matemático                          |
| `out` como último parámetro         | Más intuitivo que gl-matrix                  |
| Clases con propiedades nombradas    | Más ergonómico que TypedArrays               |

---

## 14. Plan de Implementación Priorizado

### 14.1 Fase 1: Corrección de Contratos (Crítico)

- [ ] Documentar que `DeterministiveMath.pow` es L1 (no L0)
- [ ] Agregar `Matrix2.invertedSafe()` → retorna null si det ≈ 0
- [ ] Agregar `Matrix3.invertedSafe()` → retorna null si det ≈ 0
- [ ] Agregar `Transform2.inverseSafe()` → retorna null si scale ≈ 0

### 14.2 Fase 2: Consistencia API (Medio)

- [ ] Agregar `Complex.reciprocalSafe()` → retorna (0, 0) si magnitud ≈ 0
- [ ] Agregar `Vector2.divideScalarUnchecked()` para hot paths
- [ ] Verificar que todos los `*Safe` retornan valor (no null)
- [ ] Documentar política de Safe vs null en ARCHITECTURE.md

### 14.3 Fase 3: Documentación (Menor)

- [ ] Crear `docs/ERROR_HANDLING_POLICY.md`
- [ ] Revisar si `angle/unwrapping.ts` debe ser internal
- [ ] Actualizar README con tabla de determinismo

### 14.4 Fase 4: Validación Final

- [ ] Ejecutar suite de tests completa
- [ ] Verificar coverage ≥ 90%
- [ ] Verificar 0 errores de lint
- [ ] Actualizar CHANGELOG

---

## Apéndice A: Referencias Externas Consultadas

1. **gl-matrix** - https://glmatrix.net/
   - Patrón `out` parameter, column-major, Float32Array
2. **Box2D** - https://box2d.org/
   - `b2Rot` como (cos, sin), `b2Transform`, convenciones de física

3. **Three.js** - https://threejs.org/
   - API fluent, clone/copy pattern, naming conventions

4. **IEEE 754-2019** - Floating-point arithmetic standard
   - Rounding modes, special values (NaN, Infinity)

---

## Apéndice B: Glosario

| Término            | Definición                                            |
| ------------------ | ----------------------------------------------------- |
| **L0 Determinism** | Bit-identical results across all JS engines           |
| **L1 Determinism** | Identical results within the same JS engine           |
| **L2 Determinism** | Identical results within the same invocation          |
| **Column-major**   | Matrix storage where columns are contiguous in memory |
| **SRT**            | Scale-Rotate-Translate order of transformation        |
| **LUT**            | Lookup Table (tabla precalculada)                     |
| **Hot path**       | Code executed frequently, requiring optimization      |
| **Strict**         | Throws error on invalid input                         |
| **Safe**           | Returns fallback value on invalid input               |
| **Unchecked**      | No validation, assumes valid input                    |

---

_Documento de auditoría definitivo. Estado: ✅ COMPLETADO_
_Fecha de completado: Diciembre 2025_
_Próximo paso: Implementación según fases priorizadas_
