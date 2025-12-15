# @lenguados/math2d - Referencias e Investigación

> **Propósito:** Documentar investigaciones realizadas y decisiones basadas en librerías externas  
> **Última actualización:** Diciembre 2024

---

## 1. Librerías de Referencia Analizadas

### 1.1 gl-matrix (Estándar para WebGL)

**URL:** https://github.com/toji/gl-matrix  
**Versión analizada:** 3.4.3

| Característica | gl-matrix     | @lenguados/math2d       | Decisión             |
| -------------- | ------------- | ----------------------- | -------------------- |
| Patrón output  | `out` primero | `out` último            | ✅ Seguimos Three.js |
| Mutabilidad    | Todo puro     | Híbrido static/instance | ✅ Más ergonómico    |
| EPSILON        | 0.000001      | 1e-10                   | ✅ Mayor precisión   |
| Validación     | Ninguna       | strict/safe/unchecked   | ✅ Más robusto       |
| TypeScript     | JSDoc only    | Nativo + interfaces     | ✅ Mejor DX          |

**Fórmula de tolerancia gl-matrix:**

```
|a - b| ≤ EPSILON * max(1.0, |a|, |b|)
```

### 1.2 Box2D / Planck.js (Física 2D)

**URL:** https://github.com/piqnt/planck.js  
**Versión analizada:** 1.0.4

| Característica | Box2D        | @lenguados/math2d    | Decisión                 |
| -------------- | ------------ | -------------------- | ------------------------ |
| Rotación       | b2Rot (c, s) | Rotation2 (cos, sin) | ✅ Idéntico              |
| Transform      | pos + rot    | pos + rot + scale    | ✅ Extendido para juegos |
| Ángulos        | CCW positivo | CCW positivo         | ✅ Idéntico              |
| Matrices       | No usa       | Matrix2, Matrix3     | ✅ Más completo          |

**Estructura b2Rot de Box2D:**

```cpp
struct b2Rot {
    float c, s;  // cos, sin
};

b2Vec2 b2Mul(const b2Rot& q, const b2Vec2& v) {
    return b2Vec2(q.c * v.x - q.s * v.y, q.s * v.x + q.c * v.y);
}
```

### 1.3 Three.js (3D Web)

**URL:** https://github.com/mrdoob/three.js  
**Versión analizada:** 0.170.0

| Característica | Three.js          | @lenguados/math2d                | Decisión       |
| -------------- | ----------------- | -------------------------------- | -------------- |
| API fluent     | ✅ `.add().sub()` | ✅ `.add().subtract()`           | ✅ Idéntico    |
| Comparación    | `equals()` exacto | `exactEquals()` + `nearEquals()` | ✅ Más preciso |
| Clone          | `clone()`         | `clone()`                        | ✅ Idéntico    |
| Copy           | `copy(source)`    | `copy(source)`                   | ✅ Idéntico    |

### 1.4 Unity (Game Engine)

| Característica | Unity                 | @lenguados/math2d | Decisión    |
| -------------- | --------------------- | ----------------- | ----------- |
| Lerp           | `Mathf.Lerp`          | `lerp`            | ✅ Idéntico |
| SmoothStep     | `Mathf.SmoothStep`    | `smoothStep`      | ✅ Idéntico |
| Clamp          | `Mathf.Clamp`         | `clamp`           | ✅ Idéntico |
| Aproximación   | `Mathf.Approximately` | `nearEquals`      | ✅ Idéntico |

### 1.5 GLSL (Shader Language)

| Función GLSL                  | @lenguados/math2d             | Notas                 |
| ----------------------------- | ----------------------------- | --------------------- |
| `smoothstep(edge0, edge1, x)` | `smoothStep(edge0, edge1, x)` | Hermite interpolation |
| `mix(a, b, t)`                | `lerp(a, b, t)`               | Linear interpolation  |
| `clamp(x, min, max)`          | `clamp(x, min, max)`          | Idéntico              |
| `mod(x, y)`                   | `flooredMod(x, y)`            | GLSL usa floored      |

---

## 2. Decisiones de Diseño Documentadas

### 2.1 ¿Por qué `smoothStep` en lugar de `smoothLerp`?

**Investigación realizada:** Diciembre 2024

| Término      | Uso en la industria                  |
| ------------ | ------------------------------------ |
| `smoothstep` | GLSL, HLSL, Unity, Unreal, Godot     |
| `smoothlerp` | ❌ No encontrado en ninguna librería |

**Decisión:** Usar `smoothStep` en todos los módulos para alinearse con estándares.

### 2.2 ¿Por qué sufijos numéricos en métodos?

**Problema:** `toVector()` es ambiguo - ¿Vector2 o Vector3?

**Investigación:**

- Unity: `Vector3.ToVector2()`, `Quaternion.ToAngleAxis()`
- Three.js: `matrix.toArray()`, `vector.toArray()`

**Decisión:** Usar sufijo numérico cuando el tipo destino tiene número:

- `toVector2()` ✅
- `toMatrix3()` ✅
- `toComplex()` ✅ (Complex no tiene número)

### 2.3 ¿Por qué (cos, sin) en Rotation2?

**Investigación de motores de física:**

| Motor     | Representación de rotación 2D    |
| --------- | -------------------------------- |
| Box2D     | `b2Rot { c, s }`                 |
| Planck.js | `Rot { c, s }`                   |
| Rapier    | `Rotation { re, im }` (complejo) |

**Ventajas de (cos, sin):**

1. Evita llamadas a `cos()`/`sin()` repetidas
2. Siempre normalizado (unitario)
3. Composición directa sin conversión

**Decisión:** `Rotation2(cos, sin)` es el patrón óptimo.

### 2.4 ¿Por qué column-major para matrices?

**Convenciones de la industria:**

| Tecnología   | Orden        |
| ------------ | ------------ |
| OpenGL/WebGL | Column-major |
| DirectX      | Row-major    |
| gl-matrix    | Column-major |
| Three.js     | Column-major |
| Unity        | Column-major |

**Decisión:** Column-major para compatibilidad con WebGL.

### 2.5 ¿Por qué EPSILON = 1e-10?

**Investigación:**

| Librería  | EPSILON                   |
| --------- | ------------------------- |
| gl-matrix | 0.000001 (1e-6)           |
| Three.js  | Number.EPSILON (~2.2e-16) |
| Unity     | 0.00001f (1e-5)           |

**Análisis:**

- 1e-6 es muy grueso para cálculos de precisión
- Number.EPSILON es demasiado fino para comparaciones prácticas
- 1e-10 es un balance entre precisión y practicidad

**Decisión:** `EPSILON = 1e-10` para comparaciones, `MIN_SAFE_DIVISOR = Number.EPSILON` para divisiones.

---

## 3. Patrones de Hot Path Validados

### 3.1 Patrón \*CS (precomputed cos/sin)

**Origen:** Observado en motores de juegos profesionales

**Benchmark conceptual:**

```
10,000 rotaciones:
- rotate(angle): ~10,000 llamadas a sin/cos
- rotateCS(cos, sin): 1 llamada a sin/cos + 10,000 multiplicaciones

Speedup teórico: 10-100x en bucles grandes
```

### 3.2 Patrón out parameter

**Origen:** gl-matrix, Box2D

**Benchmark conceptual:**

```
Sin out: 10,000 allocations + GC pressure
Con out: 1 allocation, 0 GC pressure

Speedup típico: 2-5x en hot paths
```

---

## 4. Comparación de Completitud

### 4.1 Vector2 API Comparison

| Método       | gl-matrix | Three.js | @lenguados/math2d     |
| ------------ | --------- | -------- | --------------------- |
| add          | ✅        | ✅       | ✅ static + instance  |
| subtract     | ✅        | ✅       | ✅ static + instance  |
| multiply     | ✅        | ✅       | ✅ static + instance  |
| divide       | ✅        | ✅       | ✅ static + instance  |
| scale        | ✅        | ✅       | ✅ static + instance  |
| dot          | ✅        | ✅       | ✅ static + instance  |
| cross        | ✅        | ✅       | ✅ static + instance  |
| normalize    | ✅        | ✅       | ✅ + Safe + Unchecked |
| lerp         | ✅        | ✅       | ✅ + Clamped          |
| rotate       | ✅        | ✅       | ✅ + CS variant       |
| rotateAround | ❌        | ✅       | ✅ + CS variant       |
| reflect      | ❌        | ✅       | ✅ static + instance  |
| project      | ❌        | ✅       | ✅ static + instance  |
| applyMatrix  | ✅        | ✅       | ✅ Matrix2 + Matrix3  |

**Conclusión:** API más completa que gl-matrix, comparable a Three.js.

---

## 5. Fuentes y Referencias

### 5.1 Documentación Oficial

- [gl-matrix GitHub](https://github.com/toji/gl-matrix)
- [Box2D Manual](https://box2d.org/documentation/)
- [Planck.js Docs](https://piqnt.com/planck.js/)
- [Three.js Docs](https://threejs.org/docs/)
- [Unity Mathf](https://docs.unity3d.com/ScriptReference/Mathf.html)
- [GLSL Specification](https://registry.khronos.org/OpenGL/specs/gl/GLSLangSpec.4.60.pdf)

### 5.2 Papers y Artículos

- IEEE 754 Floating-Point Standard
- "Quaternion to Euler Angle Conversion for Arbitrary Rotation Sequence"
- "What Every Computer Scientist Should Know About Floating-Point Arithmetic"

---

_Documento de referencia. Actualizar cuando se realicen nuevas investigaciones._
