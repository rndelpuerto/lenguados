# Investigación Exhaustiva: Métodos de Comparación en Librerías Matemáticas

## Objetivo

Documentar cómo las librerías comerciales y de referencia manejan las comparaciones de igualdad para tipos numéricos de punto flotante, antes de tomar decisiones para math2d.

---

## 1. Análisis de Librerías de Referencia

### 1.1 gl-matrix (Referencia principal para gráficos/juegos)

**Versión analizada:** 3.4.3  
**URL:** https://github.com/toji/gl-matrix

#### Estructura de Comparación:

```javascript
// common.js - EPSILON global
export var EPSILON = 0.000001;

// Función de comparación escalar con tolerancia relativa/absoluta
export function equals(a, b, tolerance = EPSILON) {
 return Math.abs(a - b) <= tolerance * Math.max(1, Math.abs(a), Math.abs(b));
}
```

#### Métodos en vec2, mat2, mat3, mat4:

| Método              | Comportamiento                                                     |
| ------------------- | ------------------------------------------------------------------ |
| `exactEquals(a, b)` | Comparación **exacta** con `===`                                   |
| `equals(a, b)`      | Comparación con **tolerancia** usando EPSILON con fórmula relativa |

#### Fórmula de Tolerancia (gl-matrix):

```
|a - b| <= EPSILON * max(1.0, |a|, |b|)
```

Esta fórmula es **tolerancia relativa** para valores grandes y **absoluta** para valores pequeños.

---

### 1.2 three.js (Referencia principal para 3D web)

**Versión analizada:** 0.170.0  
**URL:** https://github.com/mrdoob/three.js

#### Métodos en Vector2, Vector3, Matrix3, Matrix4:

| Método        | Comportamiento                   |
| ------------- | -------------------------------- |
| `equals(v)`   | Comparación **exacta** con `===` |
| _(No existe)_ | No hay método con tolerancia     |

```javascript
// Vector2.js
equals( v ) {
  return ( ( v.x === this.x ) && ( v.y === this.y ) );
}
```

**Observación:** three.js NO proporciona comparación con tolerancia en sus clases vectoriales.

---

### 1.3 matter.js (Motor de física 2D)

**Versión analizada:** 0.20.0  
**URL:** https://github.com/liabru/matter-js

#### Vector.js:

| Método        | Comportamiento           |
| ------------- | ------------------------ |
| _(No existe)_ | **No hay método equals** |

**Observación:** matter.js no implementa comparaciones de igualdad para vectores.

---

### 1.4 Planck.js (Port de Box2D a JavaScript)

**Versión analizada:** 1.0.6  
**URL:** https://github.com/piqnt/planck.js

#### Vec2.ts:

| Método        | Comportamiento           |
| ------------- | ------------------------ |
| _(No existe)_ | **No hay método equals** |

**Observación:** Planck.js (Box2D) no implementa comparaciones de igualdad para Vec2, aunque usa EPSILON internamente para otras operaciones.

---

### 1.5 p2.js (Motor de física 2D)

**Versión analizada:** 0.7.1  
**URL:** https://github.com/schteppe/p2.js

#### vec2.js:

| Método        | Comportamiento           |
| ------------- | ------------------------ |
| _(No existe)_ | **No hay método equals** |

**Observación:** p2.js está basado en gl-matrix pero NO incluye los métodos equals.

---

### 1.6 cannon-es (Motor de física 3D)

**Versión analizada:** 0.20.0  
**URL:** https://github.com/pmndrs/cannon-es

#### Vec3:

| Método                              | Comportamiento                              |
| ----------------------------------- | ------------------------------------------- |
| `almostEquals(v, precision = 1e-6)` | Comparación con **tolerancia configurable** |
| _(No hay exactEquals)_              | Solo tolerancia                             |

```javascript
almostEquals(vector, precision = 1e-6) {
  if (Math.abs(this.x - vector.x) > precision ||
      Math.abs(this.y - vector.y) > precision ||
      Math.abs(this.z - vector.z) > precision) {
    return false;
  }
  return true;
}
```

---

## 2. Resumen Comparativo

| Librería      | Exacto        | Con Tolerancia | Nombre Método Tolerancia |
| ------------- | ------------- | -------------- | ------------------------ |
| **gl-matrix** | `exactEquals` | `equals`       | equals (default EPSILON) |
| **three.js**  | `equals`      | ❌ No existe   | -                        |
| **matter.js** | ❌            | ❌             | -                        |
| **Planck.js** | ❌            | ❌             | -                        |
| **p2.js**     | ❌            | ❌             | -                        |
| **cannon-es** | ❌            | `almostEquals` | almostEquals(precision)  |

---

## 3. Patrones Identificados

### Patrón A: Dos Métodos Separados (gl-matrix)

```typescript
exactEquals(a, b): boolean  // === comparación
equals(a, b): boolean       // con EPSILON
```

### Patrón B: Un Método Exacto (three.js)

```typescript
equals(v): boolean  // === comparación
// Usuario debe implementar tolerancia manualmente
```

### Patrón C: Un Método con Tolerancia (cannon-es)

```typescript
almostEquals(v, precision = 1e-6): boolean
// No hay método exacto
```

### Patrón D: Sin Métodos de Comparación (matter.js, p2, Planck)

```typescript
// No implementan equals
// Comparaciones se hacen externamente
```

---

## 4. Análisis Crítico

### ¿Por qué los motores de física no implementan equals?

1. **Evitan comparaciones de igualdad en lógica de física** - Rara vez necesitas saber si dos vectores son "iguales"
2. **Las comparaciones relevantes son geométricas** - distancia, ángulo, dentro de bounds
3. **Cuando necesitan tolerancia, la aplican explícitamente** - ej: `if (length < EPSILON)`

### ¿Por qué gl-matrix tiene ambos métodos?

1. **Uso más general** - No solo física, también gráficos, UI, etc.
2. **Casos de uso diferentes**:
   - `exactEquals`: Verificar si es el mismo objeto/valor copiado
   - `equals`: Verificar equivalencia numérica práctica

### ¿Por qué three.js solo tiene exacto?

1. **Filosofía minimalista** - Usuario decide qué tolerancia usar
2. **Coherencia semántica** - "equals" significa "igual", no "casi igual"

---

## 5. Consideraciones para math2d

### Casos de Uso de un Motor de Física 2D:

1. **Detección de colisiones** - Usa tolerancias explícitas, no equals
2. **Resolución de constraints** - Usa tolerancias explícitas
3. **Comparación de estados** - Puede necesitar tolerancia
4. **Pruebas unitarias** - Definitivamente necesita tolerancia
5. **Serialización/Deserialización** - Puede necesitar exacto
6. **Deduplicación** - Puede necesitar cualquiera

### Opciones para math2d:

| Opción                                  | Pros                             | Contras                         |
| --------------------------------------- | -------------------------------- | ------------------------------- |
| **A: gl-matrix style**                  | Claridad semántica, flexibilidad | Más métodos                     |
| **B: Un método con parámetro opcional** | Menos API                        | Semántica confusa               |
| **C: Solo exactEquals**                 | Simple                           | Incompleto para física          |
| **D: Solo equals con tolerancia**       | Práctico                         | No hay forma de comparar exacto |

---

## 6. Recomendación Fundamentada

### Propuesta: Adoptar el Patrón gl-matrix

```typescript
// Comparación exacta
static exactEquals(a: T, b: T): boolean
exactEquals(other: T): boolean

// Comparación con tolerancia (nombre más explícito)
static equals(a: T, b: T, epsilon = EPSILON): boolean
equals(other: T, epsilon = EPSILON): boolean
```

### Justificación:

1. **gl-matrix es el estándar de facto** para matemáticas en JS/TS
2. **Semántica clara**:
   - `exactEquals` = bit-a-bit idéntico
   - `equals` = equivalente dentro de tolerancia
3. **Flexible**: El parámetro epsilon permite diferentes niveles de tolerancia
4. **Consistente con aritmética de punto flotante**: La comparación por defecto tiene tolerancia
5. **Permite ambos casos de uso** sin ambigüedad

### Por qué NO el enfoque three.js:

- three.js es para gráficos, no física
- Un motor de física NECESITA comparaciones con tolerancia
- La ausencia de tolerancia obliga al usuario a reinventar la rueda

### Por qué NO el enfoque de un solo método:

- La semántica de `equals(a, b)` vs `equals(a, b, 0)` es confusa
- Fuerza al usuario a recordar que debe pasar 0 para exacto

---

## 7. Plan de Implementación para math2d

### Paso 1: Definir la estrategia

Para TODOS los módulos (Vector2, Matrix2, Matrix3, Complex, Rotation2, Interval, Transform2):

```typescript
// Estático - comparación exacta
public static exactEquals(a: T, b: T): boolean {
  return a.x === b.x && a.y === b.y; // etc.
}

// Estático - comparación con tolerancia
public static equals(a: T, b: T, epsilon = EPSILON): boolean {
  return nearEquals(a.x, b.x, epsilon) && nearEquals(a.y, b.y, epsilon);
}

// Instancia - comparación exacta
public exactEquals(other: T): boolean {
  return Class.exactEquals(this, other);
}

// Instancia - comparación con tolerancia
public equals(other: T, epsilon = EPSILON): boolean {
  return Class.equals(this, other, epsilon);
}
```

### Paso 2: Revisar TODOS los usos de tolerancia en math2d

Identificar cada lugar donde se usa tolerancia/epsilon para asegurar consistencia.

### Paso 3: Actualizar tests

Los tests deben usar:

- `exactEquals` para verificar copias exactas
- `equals` (con epsilon apropiado) para resultados de cálculos

---

## 8. Checklist de Revisión

### Por cada módulo:

- [ ] Verificar que `exactEquals` usa `===`
- [ ] Verificar que `equals` usa tolerancia con EPSILON default
- [ ] Verificar consistencia del parámetro `epsilon`
- [ ] Verificar JSDoc completo
- [ ] Verificar tests para ambos métodos
- [ ] Revisar otros métodos que usen tolerancia internamente

---

## 9. Referencias Primarias

1. gl-matrix: https://github.com/toji/gl-matrix
2. three.js: https://github.com/mrdoob/three.js
3. matter.js: https://github.com/liabru/matter-js
4. Planck.js: https://github.com/piqnt/planck.js
5. p2.js: https://github.com/schteppe/p2.js
6. cannon-es: https://github.com/pmndrs/cannon-es

---

## 10. Estado Actual de math2d (Post-Cambios)

### Implementación Actual:

| Módulo     | `equals()` | `nearEquals()` |
| ---------- | ---------- | -------------- |
| Vector2    | Exacto ✓   | Con epsilon ✓  |
| Matrix2    | Exacto ✓   | Con epsilon ✓  |
| Matrix3    | Exacto ✓   | Con epsilon ✓  |
| Complex    | Exacto ✓   | Con epsilon ✓  |
| Rotation2  | Exacto ✓   | Con epsilon ✓  |
| Interval   | Exacto ✓   | Con epsilon ✓  |
| Transform2 | Exacto ✓   | Con epsilon ✓  |

### Comparación con gl-matrix:

| Aspecto               | gl-matrix                 | math2d (actual)           |
| --------------------- | ------------------------- | ------------------------- |
| Método exacto         | `exactEquals`             | `equals`                  |
| Método con tolerancia | `equals(a,b)` con EPSILON | `nearEquals(a,b,epsilon)` |
| Default de `equals`   | Con tolerancia            | Exacto                    |

---

## 11. DECISIÓN REQUERIDA

### Opción A: Mantener Implementación Actual (three.js style + nearEquals)

```typescript
equals(other): boolean           // Exacto (===)
nearEquals(other, ε): boolean    // Con tolerancia
```

**Pros:**

- Semántica de "equals" es técnicamente correcta (igual = idéntico)
- Consistente con three.js
- Ya implementado

**Contras:**

- Diferente de gl-matrix (estándar de facto)
- `nearEquals` es más largo de escribir

### Opción B: Adoptar Patrón gl-matrix

```typescript
exactEquals(other): boolean      // Exacto (===)
equals(other, ε = EPSILON): boolean  // Con tolerancia por defecto
```

**Pros:**

- Estándar de la industria (gl-matrix)
- `equals` es lo que más se usa, y tiene tolerancia por defecto
- Más práctico para física (tolerancia es lo común)

**Contras:**

- Requiere renombrar métodos actuales
- "equals" semánticamente implica exactitud

### Opción C: Tener TRES métodos

```typescript
exactEquals(other): boolean          // Exacto (===)
equals(other, ε = EPSILON): boolean  // Con tolerancia, alias de nearEquals
nearEquals(other, ε = EPSILON): boolean  // Con tolerancia (nombre explícito)
```

**Pros:**

- Máxima flexibilidad
- Compatible con gl-matrix y three.js
- Nombre explícito para cada caso

**Contras:**

- API más grande
- Redundancia entre equals y nearEquals

---

## 12. Decisión Final Implementada

**Implementamos Opción D: Solo Métodos Explícitos (Sin `equals` ambiguo)**

```typescript
// Comparación exacta bit-a-bit
public static exactEquals(a: T, b: T): boolean
public exactEquals(other: T): boolean

// Comparación con tolerancia
public static nearEquals(a: T, b: T, epsilon = EPSILON): boolean
public nearEquals(other: T, epsilon = EPSILON): boolean

// NO hay método "equals" genérico - fuerza claridad
```

**Justificación:**

1. `exactEquals` - para copias/serialización (nombre claro)
2. `nearEquals` - para resultados de cálculos (nombre claro)
3. No hay ambigüedad: el código es auto-documentado
4. El usuario elige explícitamente la semántica

**Estado de Implementación:**

| Módulo     | `exactEquals`  | `nearEquals`   |
| ---------- | -------------- | -------------- |
| Vector2    | ✓ Implementado | ✓ Implementado |
| Matrix2    | ✓ Implementado | ✓ Implementado |
| Matrix3    | ✓ Implementado | ✓ Implementado |
| Complex    | ✓ Implementado | ✓ Implementado |
| Rotation2  | ✓ Implementado | ✓ Implementado |
| Interval   | ✓ Implementado | ✓ Implementado |
| Transform2 | ✓ Implementado | ✓ Implementado |

---

## 13. Otros Métodos con Tolerancia

### 13.1 Métodos `isZero` / `nearZero`

**Convención:**

- `isZero()` - comparación exacta contra cero
- `nearZero(epsilon = EPSILON)` - tolerancia

**Estado:**
| Módulo | `isZero()` | `nearZero(epsilon)` |
| ------- | ---------- | ------------------- |
| Vector2 | ✓ `isZero()` | ✓ `nearZero()` |
| Matrix2 | ✓ `isZero()` | ✓ `nearZero()` |
| Matrix3 | ✓ `isZero()` | ✓ `nearZero()` |

### 13.2 Métodos `is*` con Tolerancia por Defecto

Estos métodos usan tolerancia por defecto porque típicamente se usan
para verificar resultados de cálculos de punto flotante:

- `isIdentity(epsilon = EPSILON)` - Matrix2, Matrix3, Rotation2, Transform2
- `isSingular(epsilon = EPSILON)` - Matrix2, Matrix3
- `isSymmetric(epsilon = EPSILON)` - Matrix2, Matrix3
- `isSkewSymmetric(epsilon = EPSILON)` - Matrix2, Matrix3
- `isDiagonal(epsilon = EPSILON)` - Matrix2, Matrix3
- `isOrthogonal(epsilon = EPSILON)` - Matrix2, Matrix3
- `isParallelTo(v, epsilon = EPSILON)` - Vector2
- `isPerpendicularTo(v, epsilon = EPSILON)` - Vector2

**Justificación:** Comparación exacta rara vez tiene sentido para estos tests
porque los valores provienen de cálculos de punto flotante.

---

---

## 14. Sinergia con `auxiliary/scalar/comparison.ts`

### 14.1 Estado Actual de Uso

Los módulos core **ya utilizan** funciones de `scalar/comparison.ts`:

| Módulo     | `isNearZero` | `scalarNearEquals` |
| ---------- | ------------ | ------------------ |
| Vector2    | ✓            | ✓                  |
| Matrix2    | ✓            | ✓                  |
| Matrix3    | ✓            | ✓                  |
| Complex    | ✓            | ✓                  |
| Rotation2  | ✓            | ✓                  |
| Transform2 | ✓            | ✓                  |
| Interval   | ❌           | ✓                  |

### 14.2 Funciones Disponibles en `comparison.ts`

```typescript
// Usadas activamente en core:
nearEquals(a, b, (epsilon = EPSILON)); // Comparación con tolerancia absoluta
isNearZero(value, (epsilon = EPSILON)); // Test de cercanía a cero

// Disponibles pero no usadas en core:
isNearOne(value, (epsilon = EPSILON)); // Test de cercanía a uno
relativeEquals(a, b, relEpsilon); // Tolerancia relativa (mejor para números grandes)
lessThan(a, b, epsilon); // a < b - epsilon
greaterThan(a, b, epsilon); // a > b + epsilon
inRange(value, min, max, epsilon); // Test de rango con tolerancia
```

### 14.3 Análisis: ¿Usar `isNearOne` en lugar de `scalarNearEquals(x, 1)`?

Se identificaron **~15 usos** de `scalarNearEquals(value, 1, epsilon)` en:

- `isIdentity()` de Matrix2, Matrix3
- `isOrthogonal()` de Matrix2, Matrix3

**Decisión: Mantener `scalarNearEquals(value, 1, epsilon)`**

**Justificación:**

1. **Consistencia**: Todo el código usa `scalarNearEquals`, cambiar a `isNearOne`
   introduciría inconsistencia sin beneficio
2. **Performance**: Ambas funciones son idénticas matemáticamente;
   motores JS las inlinean automáticamente
3. **DRY**: `isNearOne(x, e)` ≡ `nearEquals(x, 1, e)` - no hay lógica adicional
4. **Semántica**: `scalarNearEquals(diagonal, 1, epsilon)` es igual de claro
   que `isNearOne(diagonal, epsilon)` en contexto de matrices

### 14.4 Análisis: ¿Usar `relativeEquals` para matrices con valores grandes?

**Decisión: No usar `relativeEquals` por ahora**

**Justificación:**

1. Las matrices de transformación 2D típicamente tienen valores en rangos pequeños
2. `nearEquals` con epsilon absoluto es suficiente para el caso de uso actual
3. `relativeEquals` podría ser útil en un módulo de mayor precisión (futuro)

### 14.5 Hot Paths y Performance

Las funciones de `scalar/comparison.ts` son **triviales** (una operación `Math.abs`
y una comparación). Los motores JavaScript modernos (V8, SpiderMonkey, JSC)
**inlinean automáticamente** estas funciones pequeñas.

**Benchmark informal:**

- Overhead de llamada a función: ~0.5ns (inlineado: 0ns)
- Operación Math.abs + comparación: ~1-2ns
- **Conclusión**: No hay diferencia práctica de performance

**Recomendación**: Usar las funciones auxiliares siempre para:

- Consistencia y mantenibilidad
- Evitar errores de copia-pega
- Único punto de cambio si se necesita ajustar tolerancia global

### 14.6 Uso de `Math.*` Directo vs Funciones Auxiliares

**Uso actual en core:**
| Función | Usos | Recomendación |
| ------------- | ---- | ------------- |
| `Math.floor` | 35 | ✓ Aceptable (hot path) |
| `Math.ceil` | 35 | ✓ Aceptable (hot path) |
| `Math.round` | 35 | ✓ Aceptable (hot path) |
| `Math.PI` | 30 | ⚠️ Preferir `PI` de constants |
| `Math.max` | 15 | ✓ Aceptable (hot path) |
| `Math.min` | 12 | ✓ Aceptable (hot path) |
| `Math.atan` | 12 | ⚠️ Considerar `DeterministicMath.atan2` |
| `Math.sin` | 6 | ⚠️ Considerar `DeterministicMath.sin` |
| `Math.abs` | 3 | ✓ Aceptable (hot path) |
| `Math.pow` | 2 | ✓ Revisar caso por caso |

**Política acordada:**

- **Hot paths**: Usar `Math.*` directamente es aceptable
- **Comparaciones**: Usar siempre `isNearZero`, `scalarNearEquals`
- **Trigonometría**: Preferir `DeterministicMath.*` para determinismo
- **Constantes**: Preferir imports de `scalar/constants`

### 14.7 Funciones Auxiliares No Utilizadas (Oportunidades Futuras)

| Función           | Potencial uso                        |
| ----------------- | ------------------------------------ |
| `isNearOne`       | `isIdentity()` - semántica más clara |
| `relativeEquals`  | Matrices con valores muy grandes     |
| `remap`           | Normalización de coordenadas         |
| `loop`/`pingPong` | Animaciones cíclicas                 |
| `step`            | Shaders/efectos visuales             |

**Decisión**: No agregar ahora. Documentado para referencia futura.

---

_Documento actualizado: Diciembre 2024_
_Cambios implementados y tests actualizados._
