## 1. Spec Documentativa — Templates

- [x] 1.1 Crear documento de referencia `packages/math2d/DOCUMENTATION_STANDARD.md` con los 14 templates de documentación (file header, constant, function, triality strict/safe/unchecked, class, interface, static constant, factory, instance method, internal, type alias, section divider) incluyendo ejemplos concretos extraídos del codebase actual como gold standard
- [x] 1.2 Incluir en el documento la tabla de orden canónico de tags con indicador de obligatorio/opcional por tipo de símbolo
- [x] 1.3 Incluir la tabla completa del vocabulario controlado de `@category` (base + type-specific + auxiliary + constants sub-categories + structural) con las clases/archivos donde cada categoría es válida

## 2. Spec Documentativa — Ordenamiento de Secciones

- [x] 2.1 Incluir en `DOCUMENTATION_STANDARD.md` el esquema de ordenamiento de secciones para archivos de clase con su justificación de compatibilidad con `@typescript-eslint/member-ordering`
- [x] 2.2 Incluir el esquema de ordenamiento para archivos de funciones (auxiliary/utils) con criterios de cuándo usar section dividers vs cuándo omitirlos
- [x] 2.3 Incluir la especificación exacta del formato de section dividers (80-char file-level, 78-char class-level) con plantilla copiar/pegar

## 3. Spec Documentativa — Reglas Transversales

- [x] 3.1 Incluir en `DOCUMENTATION_STANDARD.md` la sección de reglas transversales: voz imperativa, sentence fragments sin punto, formato de `@see`, Unicode sí / LaTeX no, fórmulas en ASCII art
- [x] 3.2 Incluir la convención de cross-linking para triality (qué `@see` va en strict, safe, unchecked) con ejemplo completo de un triality set
- [x] 3.3 Incluir la tabla de required vs optional tags por tipo de símbolo (cuándo `@remarks`, `@example`, `@throws`, `@constant` son obligatorios)

## 4. Documentación de Arquitectura

- [x] 4.1 Actualizar `packages/math2d/ARCHITECTURE.md` para referenciar el nuevo `DOCUMENTATION_STANDARD.md` como fuente autoritativa de convenciones de documentación
- [x] 4.2 Verificar que las convenciones ya documentadas en `ARCHITECTURE.md` (zero-check, triality, allocation control) no entren en conflicto con el nuevo estándar

## 5. Sincronización con OpenSpec

- [x] 5.1 Verificar que la spec `specs/documentation-standard/spec.md` cubre todos los requirements definidos en `DOCUMENTATION_STANDARD.md` sin discrepancias
- [x] 5.2 Verificar que el design.md refleja correctamente las decisiones finales del estándar (D1-D7)
