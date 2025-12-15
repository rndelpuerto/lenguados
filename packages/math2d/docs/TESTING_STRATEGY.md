# Testing Strategy for math2d

## 1. Objetivo

Prevenir bugs de edge cases, boundary conditions, y garantizar correctitud matemática en todas las implementaciones presentes y futuras.

---

## 2. Lecciones Aprendidas

### Bug Detectado: `Transform2.nearEquals` (2024-12-08)

**Problema**: La comparación de rotaciones no manejaba el wrap-around angular en el boundary ±π.

```typescript
// BUG: scalarNearEquals no maneja wrap-around
scalarNearEquals(a.rotation, b.rotation, epsilon);

// CORRECTO: angleDifference maneja wrap-around
isNearZero(angleDifference(a.rotation, b.rotation), epsilon);
```

**Causa raíz**:
1. Tests solo cubrían casos "felices" (ángulos alejados del boundary)
2. No había property-based testing
3. No había tests de equivalencia cruzada entre módulos

---

## 3. Categorías de Tests Requeridos

### 3.1 Unit Tests (Existentes)

Tests de casos específicos predefinidos.

```typescript
it('should add two vectors', () => {
  const result = Vector2.add({ x: 1, y: 2 }, { x: 3, y: 4 });
  expect(result.x).toBe(4);
  expect(result.y).toBe(6);
});
```

### 3.2 Boundary Value Tests (NUEVO - Obligatorio)

Tests específicos para valores en los límites del dominio.

#### Boundaries Angulares

| Boundary | Valores de Test |
|----------|-----------------|
| Zero | `0`, `±1e-15` |
| Quarter turn | `±π/2`, `±π/2 ± 1e-10` |
| Half turn | `±π`, `±π ± 1e-10` |
| Full turn | `±2π`, `±2π ± 1e-10` |

#### Boundaries Numéricos

| Boundary | Valores de Test |
|----------|-----------------|
| Zero | `0`, `±EPSILON`, `±1e-300` |
| One | `1`, `1 ± EPSILON` |
| Infinity | `±Infinity` |
| Max safe | `±Number.MAX_SAFE_INTEGER` |
| Min positive | `Number.MIN_VALUE` |

### 3.3 Property-Based Tests (NUEVO - Obligatorio)

Tests que verifican propiedades matemáticas invariantes.

```typescript
import * as fc from 'fast-check';

describe('Vector2', () => {
  it('add should be commutative', () => {
    fc.assert(
      fc.property(
        fc.float(), fc.float(), fc.float(), fc.float(),
        (ax, ay, bx, by) => {
          const a = new Vector2(ax, ay);
          const b = new Vector2(bx, by);
          return Vector2.add(a, b).exactEquals(Vector2.add(b, a));
        }
      )
    );
  });
});
```

### 3.4 Cross-Module Equivalence Tests (NUEVO - Obligatorio)

Tests que verifican comportamiento consistente entre módulos relacionados.

```typescript
describe('Cross-module equivalence', () => {
  it('Transform2.rotation should behave like Rotation2', () => {
    // Si Transform2 contiene una rotación, nearEquals debe 
    // comportarse igual que Rotation2.nearEquals para esa rotación
    const angle1 = Math.PI - 1e-10;
    const angle2 = -Math.PI + 1e-10;
    
    const r1 = Rotation2.fromAngle(angle1);
    const r2 = Rotation2.fromAngle(angle2);
    
    const t1 = Transform2.fromValues(0, 0, angle1, 1, 1);
    const t2 = Transform2.fromValues(0, 0, angle2, 1, 1);
    
    // Deben ser equivalentes
    expect(r1.nearEquals(r2)).toBe(t1.nearEquals(t2));
  });
});
```

---

## 4. Propiedades Matemáticas a Verificar

### 4.1 Operaciones de Igualdad

| Propiedad | Descripción | Test |
|-----------|-------------|------|
| Reflexividad | `a.equals(a) === true` | ✓ |
| Simetría | `a.equals(b) === b.equals(a)` | ✓ |
| Transitividad | Si `a.equals(b)` y `b.equals(c)`, entonces `a.equals(c)` | ✓ |

### 4.2 Operaciones Aritméticas

| Propiedad | Descripción | Aplica a |
|-----------|-------------|----------|
| Conmutatividad | `a + b = b + a` | add, multiply (elemento) |
| Asociatividad | `(a + b) + c = a + (b + c)` | add, multiply (elemento) |
| Identidad | `a + 0 = a`, `a * 1 = a` | add, scale |
| Inverso | `a + (-a) = 0`, `a * (1/a) = 1` | negate, inverse |

### 4.3 Operaciones Angulares

| Propiedad | Descripción |
|-----------|-------------|
| Wrap-around | `nearEquals(π - ε, -π + ε) === true` |
| Normalización | `angle ∈ [-π, π]` después de normalizar |
| Interpolación | `lerp(a, b, 0) = a`, `lerp(a, b, 1) = b` |

### 4.4 Transformaciones

| Propiedad | Descripción |
|-----------|-------------|
| Identidad | `transform(identity, v) = v` |
| Composición | `transform(A, transform(B, v)) = transform(compose(A, B), v)` |
| Inversión | `transform(inverse(T), transform(T, v)) = v` |

---

## 5. Implementación con fast-check

### 5.1 Instalación

```bash
npm install --save-dev fast-check
```

### 5.2 Arbitrarios Personalizados

```typescript
// test/arbitraries.ts
import * as fc from 'fast-check';
import { Vector2 } from '../src/core/vector2';
import { Rotation2 } from '../src/core/rotation2';
import { Transform2 } from '../src/core/transform2';

// Vector2 arbitrario
export const arbVector2 = fc.tuple(
  fc.float({ min: -1e6, max: 1e6, noNaN: true }),
  fc.float({ min: -1e6, max: 1e6, noNaN: true })
).map(([x, y]) => new Vector2(x, y));

// Vector2 unitario
export const arbUnitVector2 = fc.float({ min: -Math.PI, max: Math.PI })
  .map(angle => Vector2.fromAngle(angle));

// Ángulo en radianes
export const arbAngle = fc.float({ min: -Math.PI, max: Math.PI, noNaN: true });

// Ángulo cerca de boundary ±π
export const arbAngleNearPi = fc.float({ min: -1e-6, max: 1e-6, noNaN: true })
  .map(offset => Math.PI - Math.abs(offset));

// Rotation2 arbitrario
export const arbRotation2 = arbAngle.map(a => Rotation2.fromAngle(a));

// Transform2 arbitrario
export const arbTransform2 = fc.tuple(
  arbVector2,
  arbAngle,
  fc.float({ min: 0.001, max: 1000, noNaN: true }),
  fc.float({ min: 0.001, max: 1000, noNaN: true })
).map(([pos, rot, sx, sy]) => 
  Transform2.fromComponents(pos, rot, new Vector2(sx, sy))
);

// Escalar no-cero
export const arbNonZeroScalar = fc.float({ min: -1e6, max: 1e6, noNaN: true })
  .filter(x => Math.abs(x) > 1e-10);
```

### 5.3 Tests de Propiedades

```typescript
// test/properties/vector2.property.spec.ts
import * as fc from 'fast-check';
import { Vector2 } from '../../src/core/vector2';
import { arbVector2, arbNonZeroScalar } from '../arbitraries';

describe('Vector2 Properties', () => {
  describe('Addition', () => {
    it('should be commutative', () => {
      fc.assert(fc.property(arbVector2, arbVector2, (a, b) => {
        const ab = Vector2.add(a, b);
        const ba = Vector2.add(b, a);
        return ab.nearEquals(ba);
      }));
    });

    it('should be associative', () => {
      fc.assert(fc.property(arbVector2, arbVector2, arbVector2, (a, b, c) => {
        const ab_c = Vector2.add(Vector2.add(a, b), c);
        const a_bc = Vector2.add(a, Vector2.add(b, c));
        return ab_c.nearEquals(a_bc, 1e-9);
      }));
    });

    it('should have zero as identity', () => {
      fc.assert(fc.property(arbVector2, (a) => {
        return Vector2.add(a, Vector2.ZERO).nearEquals(a);
      }));
    });
  });

  describe('Normalization', () => {
    it('should produce unit length for non-zero vectors', () => {
      fc.assert(fc.property(
        arbVector2.filter(v => v.lengthSquared() > 1e-20),
        (v) => {
          const normalized = Vector2.normalizeSafe(v);
          return Math.abs(normalized.length() - 1) < 1e-10 || 
                 normalized.exactEquals(Vector2.ZERO);
        }
      ));
    });
  });

  describe('Equality', () => {
    it('nearEquals should be symmetric', () => {
      fc.assert(fc.property(arbVector2, arbVector2, (a, b) => {
        return a.nearEquals(b) === b.nearEquals(a);
      }));
    });

    it('nearEquals should be reflexive', () => {
      fc.assert(fc.property(arbVector2, (a) => {
        return a.nearEquals(a);
      }));
    });
  });
});
```

### 5.4 Tests de Boundary Angulares

```typescript
// test/boundaries/angular.boundary.spec.ts
import * as fc from 'fast-check';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Complex } from '../../src/core/complex';

describe('Angular Boundary Tests', () => {
  describe('±π boundary', () => {
    it('Rotation2.nearEquals handles wrap-around', () => {
      fc.assert(fc.property(
        fc.float({ min: 1e-12, max: 1e-6, noNaN: true }),
        (epsilon) => {
          const r1 = Rotation2.fromAngle(Math.PI - epsilon);
          const r2 = Rotation2.fromAngle(-Math.PI + epsilon);
          return r1.nearEquals(r2, 1e-5);
        }
      ));
    });

    it('Transform2.nearEquals handles wrap-around', () => {
      fc.assert(fc.property(
        fc.float({ min: 1e-12, max: 1e-6, noNaN: true }),
        (epsilon) => {
          const t1 = Transform2.fromValues(0, 0, Math.PI - epsilon, 1, 1);
          const t2 = Transform2.fromValues(0, 0, -Math.PI + epsilon, 1, 1);
          return t1.nearEquals(t2, 1e-5);
        }
      ));
    });

    it('Complex.arg handles ±π correctly', () => {
      const c1 = Complex.fromPolar(1, Math.PI - 1e-10);
      const c2 = Complex.fromPolar(1, -Math.PI + 1e-10);
      // args should be close (modulo 2π)
      const diff = Math.abs(c1.arg() - c2.arg());
      expect(diff < 1e-5 || Math.abs(diff - 2 * Math.PI) < 1e-5).toBe(true);
    });
  });

  describe('Zero angle', () => {
    it('Rotation2 at zero should be identity', () => {
      const r = Rotation2.fromAngle(0);
      expect(r.isIdentity()).toBe(true);
    });

    it('Very small angles should be near identity', () => {
      fc.assert(fc.property(
        fc.float({ min: -1e-12, max: 1e-12, noNaN: true }),
        (angle) => {
          const r = Rotation2.fromAngle(angle);
          return r.isIdentity(1e-10);
        }
      ));
    });
  });

  describe('Full rotation (2π)', () => {
    it('2π rotation equals identity', () => {
      const r = Rotation2.fromAngle(2 * Math.PI);
      expect(r.isIdentity(1e-10)).toBe(true);
    });

    it('angle + 2π should equal original angle', () => {
      fc.assert(fc.property(
        fc.float({ min: -Math.PI, max: Math.PI, noNaN: true }),
        (angle) => {
          const r1 = Rotation2.fromAngle(angle);
          const r2 = Rotation2.fromAngle(angle + 2 * Math.PI);
          return r1.nearEquals(r2, 1e-10);
        }
      ));
    });
  });
});
```

---

## 6. Checklist para Nuevas Implementaciones

Antes de considerar completa cualquier nueva implementación:

### 6.1 Unit Tests

- [ ] Caso básico funciona
- [ ] Caso con valores cero
- [ ] Caso con valores negativos
- [ ] Caso con valores muy grandes
- [ ] Caso con valores muy pequeños

### 6.2 Boundary Tests

- [ ] Valores en el límite del dominio (±π para ángulos, 0 para divisiones)
- [ ] Valores justo antes/después del límite (±π ± ε)
- [ ] Valores especiales (0, 1, -1, Infinity, NaN)

### 6.3 Property Tests

- [ ] Reflexividad (si aplica)
- [ ] Simetría (si aplica)
- [ ] Transitividad (si aplica)
- [ ] Conmutatividad (si aplica)
- [ ] Asociatividad (si aplica)
- [ ] Identidad (si aplica)
- [ ] Inverso (si aplica)

### 6.4 Cross-Module Tests

- [ ] Si usa componentes de otro módulo, ¿se comporta consistente?
- [ ] Si extiende funcionalidad de otro módulo, ¿los edge cases son equivalentes?

---

## 7. Estructura de Archivos de Test

```
packages/math2d/test/
├── core/                        # Unit tests por módulo
│   ├── vector2.node.spec.ts
│   ├── rotation2.node.spec.ts
│   └── ...
├── properties/                  # Property-based tests (NUEVO)
│   ├── vector2.property.spec.ts
│   ├── rotation2.property.spec.ts
│   ├── transform2.property.spec.ts
│   └── ...
├── boundaries/                  # Boundary value tests (NUEVO)
│   ├── angular.boundary.spec.ts
│   ├── numeric.boundary.spec.ts
│   └── division.boundary.spec.ts
├── equivalence/                 # Cross-module equivalence tests (NUEVO)
│   ├── rotation-transform.equiv.spec.ts
│   └── vector-complex.equiv.spec.ts
└── arbitraries.ts               # fast-check arbitraries (NUEVO)
```

---

## 8. Integración en CI/CD

```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm ci
    - run: npm run test:unit
    - run: npm run test:property    # Nuevo
    - run: npm run test:boundary    # Nuevo
    - run: npm run test:equivalence # Nuevo
```

---

## 9. Métricas de Calidad

| Métrica | Objetivo | Actual |
|---------|----------|--------|
| Unit test coverage | > 90% | ✅ |
| Property tests por módulo core | ≥ 5 | ✅ Implementado |
| Boundary tests por módulo core | ≥ 3 | ✅ Implementado |
| Equivalence tests | ≥ 1 por relación | ✅ Implementado |

### Estado Actual

- **Tests totales**: 1911
- **Tests de boundary**: 33
- **Tests de propiedades**: 65
- **Tests de equivalencia**: 4

---

## 10. Conclusión

Este documento establece un framework de testing robusto que:

1. **Previene bugs de boundary** mediante tests explícitos de casos límite
2. **Detecta regresiones** mediante property-based testing
3. **Garantiza consistencia** mediante tests de equivalencia cruzada
4. **Es escalable** a nuevas implementaciones con el checklist

---

_Documento creado: 2024-12-08_
_Motivación: Bug en Transform2.nearEquals no detectado por tests existentes_

