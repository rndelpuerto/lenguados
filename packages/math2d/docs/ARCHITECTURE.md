# @lenguados/math2d - Arquitectura y Diseño

> **Estado:** NORMATIVO  
> **Versión:** 0.12.0  
> **Última actualización:** Diciembre 2024

---

## 1. Visión del Paquete

> "Ser la base matemática estricta y eficiente para generar nuevos módulos y paquetes, siendo rigurosa, científicamente comprobable, robusta, escalable, extensible y fácil de usar."

### 1.1 Principios Fundamentales

| Principio                    | Descripción                                    | Implicación                                 |
| ---------------------------- | ---------------------------------------------- | ------------------------------------------- |
| **Base matemática estricta** | Fórmulas verificables, nomenclatura científica | CCW positivo, column-major matrices         |
| **Eficiencia**               | Hot paths optimizados                          | Variantes `*CS`, `*Unchecked`, patrón `out` |
| **Extensibilidad**           | Interfaces flexibles                           | `*Like` interfaces para interoperabilidad   |
| **Robustez**                 | Manejo de edge cases                           | Variantes `*Safe`, validación configurable  |
| **Facilidad de uso**         | API ergonómica                                 | Métodos static + instance, fluent chaining  |

---

## 2. Arquitectura de Capas

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NIVEL 1: UTILIDADES PRIMITIVAS                         │
│  auxiliary/scalar/  │  auxiliary/angle/  │  auxiliary/numeric/              │
│  ─────────────────  │  ────────────────  │  ─────────────────               │
│  lerp, smoothStep   │  sinCos, lerpAngle │  safeDivide, safeSqrt           │
│  clamp, saturate    │  angleDifference   │  isNearZero                      │
│  inverseLerp        │  normalizeAngle    │                                  │
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
│  Wrapper semántico: position + rotation (angle) + scale                      │
│  Delega a Matrix3 para operaciones complejas                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      NIVEL 5: DETERMINISMO                                  │
│                                                                              │
│  DeterministicMath │  PrecisionMath    │  RoundingControl                   │
│  ─────────────     │  ─────────────    │  ───────────────                   │
│  Lookup tables     │  Kahan summation  │  Control de redondeo IEEE754       │
│  para sin/cos/atan │  compensación     │                                    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Flujo de Dependencias

```
auxiliary/ ─────────────────────────────────────────────────────┐
    │                                                            │
    ├── scalar/arithmetic.ts  ←─────────────────────────────────┤
    ├── scalar/comparison.ts  ←─────────────────────────────────┤
    ├── scalar/interpolation.ts ←───────────────────────────────┤
    ├── angle/operations.ts ←────── uses deterministic/         │
    └── numeric/safety.ts ←──────── uses deterministic/         │
                                                                 │
core/ ───────────────────────────────────────────────────────────┤
    │                                                            │
    ├── vector2.ts ←──────── uses auxiliary/, validation/       │
    ├── rotation2.ts ←────── uses auxiliary/, vector2           │
    ├── complex.ts ←──────── uses auxiliary/, rotation2         │
    ├── matrix2.ts ←──────── uses auxiliary/, vector2           │
    ├── matrix3.ts ←──────── uses auxiliary/, vector2, matrix2  │
    ├── transform2.ts ←───── uses all above                     │
    └── interval.ts ←─────── uses auxiliary/scalar              │
                                                                 │
deterministic/ ──────────────────────────────────────────────────┘
    │
    ├── deterministic-math.ts  (lookup tables)
    ├── precision-math.ts      (compensated arithmetic)
    └── rounding-control.ts    (IEEE754 rounding modes)
```

---

## 3. Patrones de Diseño

### 3.1 Patrón Static/Instance

Todos los métodos matemáticos tienen versión estática e instancia:

```typescript
// STATIC: Funcional, inmutable, acepta out opcional
Vector2.add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2

// INSTANCE: Muta this, retorna this para chaining
vector.add(other: ReadonlyVector2Like): this
```

**Regla:** La versión instance SIEMPRE muta `this` y retorna `this`.

### 3.2 Patrón Out Parameter

Para evitar allocations en hot paths:

```typescript
// Sin out: Crea nuevo objeto (conveniente, pero aloca)
const result = Vector2.add(a, b);

// Con out: Reutiliza objeto existente (eficiente)
const result = Vector2.add(a, b, preallocatedVector);
```

**Convención:** `out` siempre es el último parámetro opcional.

### 3.3 Patrón \*CS (Coseno/Seno Precalculado)

Para loops donde el ángulo no cambia:

```typescript
// ❌ Ineficiente: Calcula cos/sin N veces
for (const v of vectors) {
 v.rotate(angle);
}

// ✅ Eficiente: Calcula cos/sin una vez
const { cos, sin } = sinCos(angle);
for (const v of vectors) {
 v.rotateCS(cos, sin);
}
```

### 3.4 Variantes de Validación

| Sufijo       | Comportamiento                | Uso                                       |
| ------------ | ----------------------------- | ----------------------------------------- |
| (ninguno)    | STRICT - Valida y lanza error | API pública, desarrollo                   |
| `*Safe`      | SAFE - Retorna valor seguro   | Prototipos, datos inciertos               |
| `*Unchecked` | SIN validación                | Hot paths con precondiciones garantizadas |

```typescript
v.normalize(); // Throws si length ≈ 0
v.normalizeSafe(); // Retorna (0,0) si length ≈ 0
v.normalizeUnchecked(); // Puede producir NaN (solo hot paths)
```

### 3.5 Patrón Factory (from\*)

Construcción desde diferentes fuentes:

```typescript
Rotation2.fromAngle(radians); // Desde ángulo
Rotation2.fromVector2(direction); // Desde vector de dirección
Rotation2.fromComplex(complex); // Desde número complejo
Matrix3.fromTransform2(pos, rot, scale); // Desde componentes
```

### 3.6 Patrón Conversión (to\*)

Conversión a otros tipos:

```typescript
rotation.toVector2(); // → Vector2 (cos, sin)
rotation.toComplex(); // → Complex
transform.toMatrix3(); // → Matrix3
transform.toRotation2(); // → Rotation2
```

### 3.7 Patrón Delegación (DRY)

Evitar duplicación delegando a métodos especializados:

```typescript
// Rotation2.apply delega a Vector2.rotateCS
public static apply(rotation, vector, out?) {
    return Vector2.rotateCS(vector, rotation.cos, rotation.sin, out);
}

// Rotation2.applyInverse usa rotación negada
public static applyInverse(rotation, vector, out?) {
    return Vector2.rotateCS(vector, rotation.cos, -rotation.sin, out);
}
```

---

## 4. Convenciones Matemáticas

### 4.1 Sistema de Coordenadas

| Convención        | Valor                   | Justificación                 |
| ----------------- | ----------------------- | ----------------------------- |
| Rotación positiva | CCW (Counter-Clockwise) | Estándar matemático           |
| Eje Y             | Arriba positivo         | Consistente con trigonometría |
| Ángulos           | Radianes                | Estándar matemático           |
| Matrices          | Column-major            | Coincide con WebGL/OpenGL     |

### 4.2 Orden de Operaciones

Para transformaciones compuestas (Transform2):

1. **Scale** (escalar primero)
2. **Rotate** (rotar segundo)
3. **Translate** (trasladar último)

```typescript
// Equivalente matemático:
v' = R * S * v + T
```

### 4.3 Representación de Rotación

| Tipo                  | Almacenamiento   | Uso                          |
| --------------------- | ---------------- | ---------------------------- |
| `Rotation2`           | `(cos, sin)`     | Rotación pura, eficiente     |
| `Complex`             | `(real, imag)`   | Matemáticas complejas        |
| `Transform2.rotation` | `angle (number)` | Serialización, interpolación |
| `Matrix2/3`           | Matriz completa  | Composición, shear           |

---

## 5. Tolerancias y Precisión

### 5.1 Constantes de Tolerancia

| Constante              | Valor          | Propósito                            |
| ---------------------- | -------------- | ------------------------------------ |
| `EPSILON`              | 1e-10          | Comparaciones de igualdad aproximada |
| `MIN_SAFE_DIVISOR`     | Number.EPSILON | Umbral para división segura          |
| `ANGLE_ZERO_THRESHOLD` | 1e-12          | Umbral para ángulos cercanos a cero  |

### 5.2 Métodos de Comparación

```typescript
exactEquals(a, b); // Comparación bitwise exacta
nearEquals(a, b, ε); // |a - b| ≤ ε (absoluta)
relativeEquals(a, b); // Tolerancia relativa para valores grandes
```

---

## 6. Categorías JSDoc

Todos los métodos DEBEN tener `@category`:

| Categoría        | Descripción                   |
| ---------------- | ----------------------------- |
| `Constants`      | Valores estáticos inmutables  |
| `Constructors`   | Creación de instancias        |
| `Factory`        | Métodos estáticos de creación |
| `Accessors`      | Getters/setters               |
| `Arithmetic`     | Operaciones matemáticas       |
| `Comparison`     | Comparaciones                 |
| `Interpolation`  | Interpolación                 |
| `Transformation` | Transformaciones geométricas  |
| `Normalization`  | Normalización y ajuste        |
| `Geometric`      | Operaciones geométricas       |
| `Conversion`     | Conversión entre tipos        |
| `Utility`        | Utilidades generales          |

---

## 7. Interfaces \*Like

Para máxima interoperabilidad, todos los tipos core tienen interfaces:

```typescript
// Interfaz mínima (solo lectura)
interface ReadonlyVector2Like {
 readonly x: number;
 readonly y: number;
}

// Interfaz mutable
interface Vector2Like {
 x: number;
 y: number;
}
```

**Regla:** Los parámetros de entrada usan `Readonly*Like`, los de salida usan el tipo concreto.

---

## 8. Testing

### 8.1 Tipos de Tests

| Tipo           | Propósito                  | Ejemplo                              |
| -------------- | -------------------------- | ------------------------------------ |
| Unit Tests     | Casos específicos          | `add(1,2) + add(3,4) = (4,6)`        |
| Property Tests | Propiedades matemáticas    | `∀a,b: a+b = b+a`                    |
| Boundary Tests | Valores límite             | `angle = π, -π, 0`                   |
| Cross-module   | Equivalencia entre módulos | `Rotation2.apply ≡ Vector2.rotateCS` |

### 8.2 Cobertura Objetivo

| Métrica    | Objetivo |
| ---------- | -------- |
| Statements | ≥90%     |
| Branches   | ≥85%     |
| Functions  | ≥90%     |
| Lines      | ≥90%     |

---

## 9. Referencias Externas

Este paquete sigue convenciones de:

| Librería            | Influencia                                  |
| ------------------- | ------------------------------------------- |
| **gl-matrix**       | Patrón `out`, EPSILON, estructura de API    |
| **Box2D/Planck.js** | Rotation2 como (cos,sin), Transform pattern |
| **Three.js**        | Fluent API, métodos de instancia            |
| **Unity**           | Nomenclatura (smoothStep, lerp)             |
| **GLSL**            | Funciones matemáticas estándar              |

---

## 10. Versionado

Este documento es normativo para la versión 0.12.0+.

| Versión | Cambios                                              |
| ------- | ---------------------------------------------------- |
| 0.12.0  | Nomenclatura unificada (`to*2`, `from*2`, `apply*2`) |
| 0.11.0  | `smoothStep` homogeneizado                           |
| 0.10.0  | Variantes `*CS` en Transform2                        |

---

_Documento normativo. Todas las contribuciones deben cumplirlo._
