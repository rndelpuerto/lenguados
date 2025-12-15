# @lenguados/math2d - Documentación

> **Versión:** 0.12.0  
> **Última Actualización:** Diciembre 2024  
> **Estado:** ✅ Producción

---

## Índice de Documentos

| Documento                                                                  | Propósito                                              | Audiencia       |
| -------------------------------------------------------------------------- | ------------------------------------------------------ | --------------- |
| [ARCHITECTURE.md](./ARCHITECTURE.md)                                       | Arquitectura, patrones de diseño, convenciones         | Desarrolladores |
| [DETERMINISM.md](./DETERMINISM.md)                                         | Garantías de determinismo L0/L1/L2                     | Desarrolladores |
| [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)                           | Reglas de nomenclatura obligatorias                    | Contribuidores  |
| [TSDOC_STANDARD.md](./TSDOC_STANDARD.md)                                   | Estándar de documentación TSDoc/JSDoc                  | Contribuidores  |
| [TRANSFORMATION_CONSISTENCY_SPEC.md](./TRANSFORMATION_CONSISTENCY_SPEC.md) | Especificación de API de transformaciones              | Desarrolladores |
| [RESEARCH_REFERENCES.md](./RESEARCH_REFERENCES.md)                         | Investigaciones y comparaciones con librerías externas | Referencia      |
| [REFACTORING_LOG.md](./REFACTORING_LOG.md)                                 | Historial de refactorizaciones                         | Mantenimiento   |
| [TESTING_STRATEGY.md](./TESTING_STRATEGY.md)                               | Estrategia de testing                                  | QA              |
| [ROADMAP_TO_MARKET_LEADER.md](./ROADMAP_TO_MARKET_LEADER.md)               | Plan de evolución                                      | Gestión         |

---

## Resumen del Paquete

`@lenguados/math2d` es una librería de matemáticas 2D de grado comercial para TypeScript/JavaScript, diseñada como base para motores de física, simulaciones y aplicaciones gráficas en tiempo real.

### Métricas Actuales

| Métrica                  | Valor        | Estado             |
| ------------------------ | ------------ | ------------------ |
| **Tests Totales**        | 2,164        | ✅                 |
| **Test Suites**          | 35           | ✅                 |
| **Cobertura Statements** | 89.56%       | 🟡 Meta: 90%       |
| **Cobertura Lines**      | 89.96%       | 🟡 Meta: 90%       |
| **Determinismo**         | 100%         | ✅ Cross-platform  |
| **Tree-shakable**        | ✅           | sideEffects: false |
| **TypeScript**           | strict: true | ✅ Sin any         |

---

## Arquitectura

```
@lenguados/math2d/src/
├── auxiliary/          # Funciones primitivas (scalar, angle, numeric)
├── core/               # Objetos matemáticos (Vector2, Matrix2/3, Rotation2, etc.)
├── deterministic/      # Matemáticas reproducibles (sin/cos/sqrt deterministas)
├── validation/         # Sistema de assertions
├── types/              # Interfaces y type guards
└── utils/              # Utilidades (parse, random, performance)
```

### Principios Fundamentales

| Principio            | Descripción                                              |
| -------------------- | -------------------------------------------------------- |
| **Determinismo**     | Resultados idénticos en V8, SpiderMonkey, JavaScriptCore |
| **Eficiencia**       | Variantes `*CS`, `*Unchecked`, patrón `out`              |
| **Extensibilidad**   | Interfaces `*Like` para interoperabilidad                |
| **Robustez**         | Variantes `*Safe`, validación configurable               |
| **Facilidad de uso** | API fluent, métodos static + instance                    |

---

## Patrones Clave

### Static vs Instance

```typescript
// STATIC: Funcional, inmutable
const result = Vector2.add(a, b);
Vector2.add(a, b, out); // Zero-allocation

// INSTANCE: Muta this, chainable
velocity.add(acceleration).scale(dt);
```

### Hot Path Optimization

```typescript
// Estándar
for (const v of vectors) v.rotate(angle);

// Optimizado: Precalcular cos/sin
const { cos, sin } = sinCos(angle);
for (const v of vectors) v.rotateCS(cos, sin);
```

### Variantes de Validación

```typescript
v.normalize(); // STRICT: Valida, lanza error
v.normalizeSafe(); // SAFE: Retorna fallback
v.normalizeUnchecked(); // UNCHECKED: Máxima velocidad
```

---

## Módulos Core

| Tipo         | Descripción         | Métodos      |
| ------------ | ------------------- | ------------ |
| `Vector2`    | Vector/punto 2D     | ~120 métodos |
| `Rotation2`  | Rotación (cos, sin) | ~80 métodos  |
| `Complex`    | Números complejos   | ~100 métodos |
| `Matrix2`    | Matriz 2×2          | ~100 métodos |
| `Matrix3`    | Matriz 3×3 afín     | ~120 métodos |
| `Transform2` | pos + rot + scale   | ~60 métodos  |
| `Interval`   | Rango [min, max]    | ~50 métodos  |

---

## Convenciones

| Aspecto               | Convención                                         |
| --------------------- | -------------------------------------------------- |
| **Rotación positiva** | CCW (Counter-Clockwise)                            |
| **Matrices**          | Column-major                                       |
| **Ángulos**           | Radianes                                           |
| **EPSILON**           | 1e-10                                              |
| **Sufijos numéricos** | `toVector2()`, `fromMatrix3()`, `applyRotation2()` |

---

## Comparación con el Mercado

| Característica           | math2d | gl-matrix | Three.js | Box2D |
| ------------------------ | ------ | --------- | -------- | ----- |
| Determinismo             | ✅     | ❌        | ❌       | ✅    |
| Tree-shakable            | ✅     | ✅        | ⚠️       | ❌    |
| TypeScript nativo        | ✅     | ⚠️        | ⚠️       | ❌    |
| Safe functions           | ✅     | ❌        | ⚠️       | ⚠️    |
| Assertions desactivables | ✅     | ❌        | ❌       | ✅    |

---

## Quick Start

```typescript
import { Vector2, Rotation2, Transform2 } from '@lenguados/math2d';

// Crear vectores
const position = Vector2.fromValues(10, 20);
const velocity = new Vector2(1, 0);

// Rotar
const rotation = Rotation2.fromAngle(Math.PI / 4);
position.applyRotation2(rotation);

// Transformar
const transform = Transform2.fromValues(0, 0, Math.PI / 2, 1, 1);
const worldPos = transform.transformPoint(position);
```

---

## Documentos de Referencia

Para detalles específicos, consulta:

- **Arquitectura y patrones:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Nomenclatura:** [NAMING_CONVENTIONS.md](./NAMING_CONVENTIONS.md)
- **Transformaciones:** [TRANSFORMATION_CONSISTENCY_SPEC.md](./TRANSFORMATION_CONSISTENCY_SPEC.md)
- **Investigaciones:** [RESEARCH_REFERENCES.md](./RESEARCH_REFERENCES.md)

---

_Documentación consolidada: Diciembre 2024_
