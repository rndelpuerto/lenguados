# @lenguados/math2d - Convenciones de Nomenclatura

Este documento establece las convenciones de nomenclatura obligatorias para el paquete `@lenguados/math2d`. Todas las contribuciones DEBEN seguir estas reglas para garantizar consistencia y claridad.

---

## 1. Regla de Sufijo Numérico para Tipos Dimensionados

### Regla Principal

> **Si un tipo tiene un número en su nombre de clase (e.g., `Vector2`, `Matrix3`, `Rotation2`), cualquier método que lo referencie DEBE incluir ese número en el nombre del método.**

### Aplicación

| Patrón   | Ejemplo Correcto   | Ejemplo Incorrecto |
| -------- | ------------------ | ------------------ |
| `to*`    | `toVector2()`      | `toVector()`       |
| `from*`  | `fromMatrix2()`    | `fromMatrix()`     |
| `apply*` | `applyRotation2()` | `applyRotation()`  |
| `get*`   | `getVector2()`     | `getVector()`      |

### Justificación

1. **Claridad dimensional**: `toVector2()` indica explícitamente el tipo de retorno
2. **Futuro-proof**: Permite añadir `Vector3`, `Matrix4`, etc. sin ambigüedad
3. **Auto-documentación**: El nombre revela el tipo exacto sin consultar JSDoc
4. **Estándar de industria**: Unity, Three.js, Godot usan esta convención

### Excepciones

- **Tipos sin número**: `Complex`, `Interval` → `toComplex()`, `fromInterval()` ✅
- **Retorno de interface/object**: `toComplexLike()`, `toObject()` ✅
- **Contexto implícito**: Dentro de `Vector2`, `clone()` no necesita `clone2()`
- **Operaciones con mismo tipo**: Dentro de `Vector2`, `add(other: Vector2Like)` no necesita `addVector2()` porque el contexto ya define el tipo. Esto incluye: `add`, `subtract`, `multiply`, `divide`, `lerp`, `dot`, `cross`, `min`, `max`, `equals`, `addScaledVector`, etc.

### Cuándo SÍ aplica el sufijo

El sufijo es **obligatorio** cuando hay conversión o interacción con un tipo **diferente**:

| Escenario                      | Ejemplo                    | Justificación                  |
| ------------------------------ | -------------------------- | ------------------------------ |
| Conversión de tipo             | `Rotation2.toVector2()`    | Convierte a tipo diferente     |
| Creación desde tipo            | `Matrix3.fromTransform2()` | Crea desde tipo diferente      |
| Aplicar transformación externa | `Vector2.applyRotation2()` | Aplica tipo diferente a `this` |
| Extracción a tipo diferente    | `Matrix3.toMatrix2()`      | Extrae subtipo diferente       |

---

## 2. Prefijos de Métodos

### 2.1 `to*` - Conversión de Tipo

Convierte `this` a otro tipo. Retorna una **nueva instancia** del tipo destino.

```typescript
// ✅ Correcto
Rotation2.toComplex(out?): Complex      // Complex no tiene número
Rotation2.toVector2(out?): Vector2      // Vector2 tiene "2"
Transform2.toMatrix3(out?): Matrix3     // Matrix3 tiene "3"
Matrix3.toMatrix2(out?): Matrix2        // Matrix2 tiene "2"

// ❌ Incorrecto
Rotation2.toVector(): Vector2           // Falta "2"
Transform2.toMatrix(): Matrix3          // Falta "3"
```

### 2.2 `from*` - Construcción desde Tipo

Factory estático que crea una instancia desde otro tipo.

```typescript
// ✅ Correcto
Matrix3.fromMatrix2(matrix, out?): Matrix3      // Matrix2 tiene "2"
Matrix3.fromTransform2(transform, out?): Matrix3 // Transform2 tiene "2"
Rotation2.fromVector2(direction, out?): Rotation2 // Vector2 tiene "2"
Rotation2.fromComplex(complex, out?): Rotation2   // Complex no tiene número

// ❌ Incorrecto
Matrix3.fromTransform(transform): Matrix3        // Falta "2"
Rotation2.fromVector(direction): Rotation2       // Falta "2"
```

### 2.3 `get*` - Extracción de Componente

Extrae un componente o propiedad del objeto. NO crea un nuevo tipo, sino que lee datos existentes.

```typescript
// ✅ Correcto (extracción de datos primitivos o componentes)
Matrix2.getRotation(): number           // Retorna primitivo
Matrix2.getScale(out?): Vector2         // Extrae componente como Vector2
Matrix3.getTranslation(out?): Vector2   // Extrae componente
Matrix3.getColumn(index): [n, n, n]     // Retorna array primitivo

// ✅ Nota: getScale retorna Vector2, pero es una extracción de
// componentes existentes, no una conversión de tipo
```

### 2.4 `apply*` - Aplicar Transformación

Aplica una transformación a un vector u otro objeto.

```typescript
// ✅ Correcto
Vector2.applyRotation2(rotation): this     // Rotation2 tiene "2"
Vector2.applyMatrix2(matrix): this         // Matrix2 tiene "2"
Vector2.applyMatrix3(matrix): this         // Matrix3 tiene "3"
Vector2.applyComplex(complex): this        // Complex no tiene número

// ❌ Incorrecto
Vector2.applyRotation(rotation): this      // Falta "2"
Vector2.applyMatrix(matrix): this          // ¿Matrix2 o Matrix3?
```

---

## 3. Sufijos de Métodos

### 3.1 `*Safe` - Manejo Seguro de Degenerados

Retorna un valor por defecto en casos degenerados en lugar de lanzar error.

```typescript
normalize(): this           // Throws si length ≈ 0
normalizeSafe(): this        // Retorna (0,0) si length ≈ 0

divideScalar(s): this        // Throws si s ≈ 0
divideScalarSafe(s): this    // Retorna (0,0) si s ≈ 0
```

### 3.2 `*Unchecked` - Sin Validación (Hot Paths)

Omite validaciones para máximo rendimiento. **Solo para hot paths donde se garantizan precondiciones.**

```typescript
divideScalar(s): this            // Valida s ≠ 0
divideScalarUnchecked(s): this   // Sin validación, puede producir NaN/Infinity
```

### 3.3 `*CS` - Coseno/Seno Precalculados

Acepta valores de cos/sin precalculados para evitar llamadas trigonométricas redundantes en loops.

```typescript
rotate(angle): this              // Calcula cos/sin internamente
rotateCS(cos, sin): this         // Usa cos/sin precalculados

// Uso en hot path:
const { cos, sin } = sinCos(angle);
for (const v of vectors) {
    v.rotateCS(cos, sin);        // ✅ Sin recálculo trig
}
```

### 3.4 `*Clamped` - Parámetro Clampado

Clampea el parámetro (típicamente `t`) al rango [0, 1].

```typescript
lerp(other, t): this             // t puede ser < 0 o > 1 (extrapolación)
lerpClamped(other, t): this      // t clampado a [0, 1]
```

### 3.5 `*Like` - Retorna Interface/POD

Retorna un objeto plano (Plain Old Data) en lugar de una instancia de clase.

```typescript
toObject(): Vector2Like          // { x, y }
toComplexLike(): ComplexLike     // { real, imag }
```

---

## 4. Patrón Static vs Instance

### 4.1 Métodos Static

```typescript
// Patrón: Class.method(inputs..., out?) → output
public static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2

// Características:
// - Primer parámetro: input principal (readonly)
// - Último parámetro opcional: out para reutilización de memoria
// - Retorna: nueva instancia o `out` mutado
// - Ideal para: hot paths, programación funcional
```

### 4.2 Métodos Instance

```typescript
// Patrón: instance.method(args...) → this
public add(other: ReadonlyVector2Like): this

// Características:
// - Muta `this`
// - Retorna `this` para encadenamiento
// - Ideal para: código expresivo, builders
```

### 4.3 Simetría Obligatoria

> **Todo método de instancia DEBE tener un equivalente estático, y viceversa, a menos que no tenga sentido matemático.**

```typescript
// ✅ Simetría completa
static add(a, b, out?): Vector2
add(other): this

static normalize(v, out?): Vector2
normalize(): this

// ✅ Excepción válida: solo tiene sentido como static
static fromAngle(angle, out?): Vector2    // No hay instance equivalente
static lerp(a, b, t, out?): Vector2       // Requiere dos inputs
```

---

## 5. Parámetros

### 5.1 Orden de Parámetros (Static)

```
(inputs principales..., parámetros de operación..., out?)
```

```typescript
// ✅ Correcto
static lerp(a: Vector2, b: Vector2, t: number, out?: Vector2): Vector2
static rotate(v: Vector2, angle: number, out?: Vector2): Vector2
static clamp(v: Vector2, min: Vector2, max: Vector2, out?: Vector2): Vector2

// ❌ Incorrecto (out no al final)
static lerp(a: Vector2, out: Vector2, b: Vector2, t: number): Vector2
```

### 5.2 Tipos de Input

- **Inputs que no se mutan**: Usar `Readonly*Like` (e.g., `ReadonlyVector2Like`)
- **Outputs opcionales**: Usar tipo concreto (e.g., `out?: Vector2`)

```typescript
// ✅ Correcto
static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2

// ❌ Incorrecto (input no es readonly)
static add(a: Vector2Like, b: Vector2Like, out?: Vector2): Vector2
```

---

## 6. Categorías JSDoc

Todos los métodos DEBEN tener una categoría JSDoc usando `@category`.

| Categoría        | Descripción                     | Ejemplos                                |
| ---------------- | ------------------------------- | --------------------------------------- |
| `Constants`      | Valores estáticos inmutables    | `ZERO`, `IDENTITY`, `EPSILON`           |
| `Constructors`   | Creación de instancias          | `constructor`, `clone`                  |
| `Factory`        | Métodos estáticos de creación   | `fromValues`, `fromAngle`, `fromObject` |
| `Accessors`      | Getters/setters de propiedades  | `x`, `y`, `length`, `lengthSquared`     |
| `Arithmetic`     | Operaciones matemáticas básicas | `add`, `subtract`, `multiply`, `divide` |
| `Comparison`     | Comparaciones y tests           | `equals`, `nearEquals`, `isZero`        |
| `Interpolation`  | Interpolación y mezcla          | `lerp`, `slerp`, `smoothStep`           |
| `Transformation` | Transformaciones geométricas    | `rotate`, `scale`, `translate`          |
| `Normalization`  | Normalización y ajuste          | `normalize`, `clamp`, `floor`           |
| `Geometric`      | Operaciones geométricas         | `dot`, `cross`, `project`, `reflect`    |
| `Conversion`     | Conversión entre tipos          | `toArray`, `toObject`, `toMatrix3`      |
| `Utility`        | Utilidades generales            | `toString`, `copy`, `set`               |

---

## 7. Checklist de Revisión

Antes de añadir un nuevo método, verificar:

- [ ] ¿El nombre incluye el número del tipo si aplica? (`toVector2`, no `toVector`)
- [ ] ¿Tiene equivalente static/instance si tiene sentido?
- [ ] ¿El sufijo es correcto? (`Safe`, `Unchecked`, `CS`, `Clamped`)
- [ ] ¿El orden de parámetros sigue la convención? (inputs, operación, out)
- [ ] ¿Los inputs son `Readonly*Like`?
- [ ] ¿Tiene `@category` en JSDoc?
- [ ] ¿El nombre sigue camelCase?
- [ ] ¿Hay tests para static e instance?

---

## 8. Inconsistencias Históricas ✅ CORREGIDAS

Las siguientes inconsistencias fueron identificadas y **corregidas** en la refactorización de diciembre 2024.

### 8.1 Métodos `to*` ✅

| Antes                        | Después                  | Archivo              |
| ---------------------------- | ------------------------ | -------------------- |
| `Rotation2.toVector()`       | `toVector2()` ✅         | `core/rotation2.ts`  |
| `Transform2.toMatrix()`      | `toMatrix3()` ✅         | `core/transform2.ts` |
| `Complex.toRotationMatrix()` | `toRotationMatrix2()` ✅ | `core/complex.ts`    |

### 8.2 Métodos `from*` ✅

| Antes                     | Después               | Archivo             |
| ------------------------- | --------------------- | ------------------- |
| `Rotation2.fromVector()`  | `fromVector2()` ✅    | `core/rotation2.ts` |
| `Rotation2.fromVectors()` | `fromVectors2()` ✅   | `core/rotation2.ts` |
| `Matrix3.fromTransform()` | `fromTransform2()` ✅ | `core/matrix3.ts`   |

### 8.3 Métodos `apply*` ✅

| Antes                      | Después                | Archivo           |
| -------------------------- | ---------------------- | ----------------- |
| `Vector2.applyRotation()`  | `applyRotation2()` ✅  | `core/vector2.ts` |
| `Vector2.applyTransform()` | `applyTransform2()` ✅ | `core/vector2.ts` |

**Nota:** `Vector2.applyMatrix2()` ya era correcto. `Vector2.applyComplex()` es correcto porque `Complex` no tiene número.

### 8.4 Nuevos métodos de sinergia ✅

| Método                                | Archivo              | Estado        |
| ------------------------------------- | -------------------- | ------------- |
| `Transform2.toRotation2(out?)`        | `core/transform2.ts` | ✅ Añadido    |
| `Complex.toRotation2(out?)`           | `core/complex.ts`    | ✅ Añadido    |
| `Matrix3.fromRotation(Rotation2Like)` | `core/matrix3.ts`    | ✅ Ya existía |

---

## 9. Versionado de Cambios

| Fecha   | Cambio                                       | Autor           |
| ------- | -------------------------------------------- | --------------- |
| 2024-12 | Documento inicial con reglas de nomenclatura | Auditoría       |
| 2024-12 | Identificación de inconsistencias históricas | Auditoría       |
| 2024-12 | Corrección de todas las inconsistencias      | Refactorización |

---

_Este documento es normativo. Todas las contribuciones deben cumplirlo._
