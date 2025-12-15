# Auditoría de Consistencia - math2d

## Resumen Ejecutivo

Review exhaustivo de todos los módulos core de `@lenguados/math2d` buscando inconsistencias en código, rigor matemático, precisión tecnológica y violaciones de convenciones.

---

## 🔴 CRÍTICO - Inconsistencias que Afectan Determinismo/Precisión

### 1. `Math.pow` en Complex (No Determinista)

**Archivo:** `complex.ts` líneas 317, 459

```typescript
const poweredMagnitude = Math.pow(mag, exponent);
```

**Problema:** `Math.pow` puede producir resultados ligeramente diferentes entre plataformas.

**Solución:** Usar `DeterministicMath.pow` o implementar una versión determinista.

---

## 🟠 ALTO - Inconsistencias de API

### 2. `toString` precision inconsistente

| Módulo     | Default Precision |
| ---------- | ----------------- |
| Vector2    | 4                 |
| Matrix2    | 4                 |
| Matrix3    | 4                 |
| Complex    | 4                 |
| Rotation2  | 4                 |
| Interval   | 4                 |
| Transform2 | **2** ❌          |

**Solución:** Cambiar Transform2 a `precision = 4`.

---

### 3. Tipos de Error Inconsistentes

| Módulo   | RangeError | Error | TypeError |
| -------- | ---------- | ----- | --------- |
| Vector2  | 10         | 0     | 1         |
| Matrix2  | 8          | 0     | 1         |
| Matrix3  | 9          | 0     | 1         |
| Complex  | 1          | 0     | 0         |
| Rotation2| 0          | 0     | 0         |
| Interval | 3          | **6** ❌ | 0      |
| Transform2| 0         | 0     | 0         |

**Problema:** Interval usa `Error` genérico donde debería usar `RangeError`.

**Errores a corregir en Interval:**
- Línea 296: `hull: values array cannot be empty` → RangeError
- Línea 343: `sqrt: interval contains negative values` → RangeError
- Línea 357: `reciprocal: interval contains zero` → RangeError
- Línea 510: `divide: divisor interval contains zero` → RangeError
- Línea 562: `reciprocal: interval contains zero` → RangeError
- Línea 671: `reciprocated: interval contains zero` → RangeError

---

### 4. Métodos Faltantes por Módulo

| Método      | V2 | M2 | M3 | Complex | Rot2 | Interval | Transform2 |
| ----------- | -- | -- | -- | ------- | ---- | -------- | ---------- |
| `zero()`    | ✅ | ✅ | ✅ | ✅      | ❌   | ✅       | ❌         |
| `toArray()` | ✅ | ✅ | ✅ | ✅      | ✅   | ✅       | ❌         |
| `isZero()`  | ✅ | ✅ | ✅ | ✅      | ❌   | ❌       | ✅         |
| `nearZero()`| ✅ | ✅ | ✅ | ❌      | ❌   | ❌       | ❌         |
| `isFinite()`| ✅ | ✅ | ✅ | ❌      | ❌   | ❌       | ❌         |
| `hasNaN()`  | ✅ | ✅ | ✅ | ❌      | ❌   | ❌       | ❌         |

**Nota:** Algunos métodos pueden no aplicar a ciertos tipos (ej: `zero()` no tiene sentido para Rotation2 que siempre es unitario).

---

## 🟡 MEDIO - Inconsistencias de Documentación

### 5. Tags JSDoc Faltantes

| Módulo     | @category | @since |
| ---------- | --------- | ------ |
| Vector2    | 106       | 106    |
| Matrix2    | 83        | 83     |
| Matrix3    | 138       | 138    |
| Complex    | **4** ❌  | **4** ❌ |
| Rotation2  | **2** ❌  | **2** ❌ |
| Interval   | **4** ❌  | **4** ❌ |
| Transform2 | **6** ❌  | **6** ❌ |

**Problema:** Complex, Rotation2, Interval y Transform2 tienen documentación JSDoc incompleta.

---

## 🟢 BAJO - Observaciones

### 6. Symbol.iterator

Solo `Vector2` implementa `Symbol.iterator` para destructuring `[x, y]`.

**Decisión:** Mantener así. Los vectores son naturalmente iterables, las matrices no.

### 7. Métodos Safe/Unchecked

| Módulo  | Safe | Unchecked |
| ------- | ---- | --------- |
| Vector2 | 28   | 6         |
| Matrix2 | 7    | 6         |
| Matrix3 | 4    | 5         |

**Observación:** Vector2 tiene más variantes Safe, lo cual es correcto dado su uso más frecuente en hot paths.

---

## 📋 PLAN DE CORRECCIÓN

### Prioridad 1 (Crítico)
- [ ] Complex: Reemplazar `Math.pow` con alternativa determinista

### Prioridad 2 (Alto)
- [ ] Transform2: Cambiar `toString(precision = 2)` → `precision = 4`
- [ ] Interval: Cambiar 6 `throw new Error` → `throw new RangeError`

### Prioridad 3 (Medio)
- [ ] Complex: Añadir ~80 tags @category y @since
- [ ] Rotation2: Añadir ~80 tags @category y @since
- [ ] Interval: Añadir ~80 tags @category y @since
- [ ] Transform2: Añadir ~80 tags @category y @since

### Prioridad 4 (Bajo/Evaluación)
- [ ] Evaluar si añadir `isFinite()`, `hasNaN()` a Complex, Rotation2, Interval, Transform2
- [ ] Evaluar si añadir `nearZero()` donde falte
- [ ] Transform2: Evaluar añadir `toArray()`

---

## ✅ CORRECCIONES YA APLICADAS (Sesión Actual)

1. ✅ `equals()` → exacto en todos los módulos
2. ✅ `nearEquals()` → añadido en todos los módulos
3. ✅ Parámetro `epsilon` unificado (no `tolerance`)
4. ✅ Vector2 `toString(precision = 4)` con default
5. ✅ Import `scalarNearEquals` consistente
6. ✅ Transform2 `toString(precision = 4)` - era 2
7. ✅ Interval: 6 `Error` → `RangeError`

---

## 📊 VERIFICACIÓN FINAL

```
Test Suites: 29 passed ✅
Tests: 1766 passed ✅
```

---

## 🔬 PENDIENTE PARA INVESTIGACIÓN

### Math.pow en Complex

`Math.pow` puede no ser determinista entre plataformas para exponentes fraccionarios.

**Opciones:**
1. Implementar `DeterministicMath.pow` usando logaritmos/exponenciales de tabla
2. Usar `Math.pow` con documentación de que no es bit-exact cross-platform
3. Limitar Complex.pow a exponentes enteros (usar multiplicación)

**Decisión:** Requiere análisis de casos de uso reales y benchmarks.

---

*Generado: Diciembre 2024*

