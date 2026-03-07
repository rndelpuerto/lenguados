# 📚 base de Conocimiento: @lenguados/math2d

> **Versión del Índice:** 2026

Bienvenido al directorio raíz de documentación estructurada del core engine de matemáticas 2D. Esta base de datos interna consolida políticas arquitectónicas, dictámenes de testing, y todo el historial forense de las auditorías de completitud.

## 🗂 Estructura del Directorio

- **[`/architecture`](./architecture/core_principles.md)**
  - **`core_principles.md`**: El manifiesto arquitectónico definitivo. Describe la filosofía de capas, uso del Kill-Switch nativo frente al Determinismo (_fdlibm_), restricciones funcionales de V8 frente a mutabilidad y la estrategia para el DCE de validaciones en producción.
- **[`/standards`](./standards/tsdoc_and_naming.md)**
  - **`tsdoc_and_naming.md`**: Combinación rígida de Normativas de Nomenclatura Estricta (ej. sufijos numéricos obligatorios vs dimensionales) y del sistema de redacción TSDoc avalado para Docusaurus.

- **[`/testing`](./testing/testing_strategy.md)**
  - **`testing_strategy.md`**: Definición absoluta de los _Property-Based Tests_ esperados, asunciones de fast-check y manejos de wrap-around (tolerancias `EPSILON`).

- **[`/research`](./research/decisions_and_benchmarks.md)**
  - **`decisions_and_benchmarks.md`**: Referencias del sector (_Three.js, Unity, Box2D, glMatrix_), su comparabilidad con `@lenguados/math2d`, y el historial científico de _Rechazos Técnicos_ de código ineficiente y _anti-patrones_.

- **[`/audits`](./audits/ultimate_audit_report.md)**
  - **`ultimate_audit_report.md`**: Registro consolidado oficial que lista bajo juramento el cierre completo y exitoso de todos los GAPS descubiertos en el API frente a los Gold-Standards del año 2025-2026.

---

> _"El código rige la lógica, pero la documentación rige al Programador y al Agente de I.A."_
