## Why

Auditoria completa linea a linea de todos los modulos del paquete math2d
seguida de un diseno de API definitivo. El objetivo es establecer las
convenciones, la sinergia entre modulos, las capas de API por escenario
de uso y la especificacion final implementable sin decisiones pendientes.

El paquete ha crecido organicamente y acumula inconsistencias en naming
(`safe*` vs `*Safe`), cobertura de variantes (triality incompleta),
gaps de simetria entre tipos (Rotation2 sin `toMatrix2`, Complex sin `toVector2`),
funciones redundantes (6 normalizaciones angulares), documentacion obsoleta
(refs a modulos eliminados) y ausencia de una especificacion formal de
convenciones. Nota: la auditoria confirmo que Matrix2.transformVector,
Rotation2.toVector2/toComplex, e Interval.union/intersect YA EXISTEN.
Antes de agregar nuevos tipos (AABB, Circle), la API existente debe
quedar cerrada y definitiva.

## What Changes

- Formalizar todas las convenciones de API como especificacion implementable
- Consolidar funciones redundantes en auxiliary (angle normalization, safety naming)
- Completar simetria: agregar Rotation2.toMatrix2, Complex.toVector2, Interval.expand/shrink, Transform2.fromPose
- Completar cobertura de validation (assertComplex, assertInterval, assertTransform2, assertMatrix3Like)
- Limpiar exports y documentacion obsoleta en index.ts
- Verificar y documentar metodos ya existentes (Matrix2.transformVector, Rotation2.toVector2/toComplex, Interval.union/intersect)
- **BREAKING**: Renombrar `safe*` prefix a `*Safe` suffix en numeric/safety
- **BREAKING**: Eliminar `normalizeRadiansAround` y `wrapAngle` (composables trivialmente)

## Capabilities

### New Capabilities

- `api-conventions`: Reglas definitivas de naming, firmas, triality, simetria instancia/estatico, `out` parameter, `*CS` variants, `*Like` interfaces, politica de math determinista, capas de API por escenario
- `auxiliary-api`: Especificacion completa de la API auxiliary — scalar, angle, numeric — con consolidaciones, renombramientos y variantes faltantes
- `core-types-api`: Especificacion completa de la API de core types — Vector2, Rotation2, Complex, Matrix2, Matrix3, Transform2, Interval — con simetria cross-type y operaciones faltantes
- `support-layers-api`: Especificacion de deterministic, types, validation y utils — exports, cobertura de assertions, contratos de integracion

### Modified Capabilities

## Impact

- **Code**: Las 6 capas de `packages/math2d/src/` — principalmente auxiliary/ y core/, con actualizaciones en validation/, utils/ e index.ts
- **Tests**: Tests correspondientes a modulos modificados; nuevos tests para metodos agregados
- **API surface**: Breaking changes en naming de auxiliary; cambios aditivos en core types
- **Bundle size**: Impacto minimo — consolidacion puede reducir auxiliary ligeramente
- **Deterministic guarantees**: Sin cambios al kernel determinista; rollback a branch pre-audit si se detecta regresion
