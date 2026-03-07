## Context

`@lenguados/math2d` es matemática core pura: la base sobre la que se construirán otros paquetes
(geometrías, física, colisiones) mediante extensión, composición y fachada. El paquete tiene
33 archivos fuente organizados en 6 capas, 7 tipos core, y ~42 archivos de test.

Una auditoría anterior (`auditoria-math2d`) resolvió inconsistencias internas de naming, simetría
y cobertura de variantes. Sin embargo, las decisiones fundacionales — valores de tolerancia,
modelo de determinismo, patrones de API, estructura algebraica, estrategias de optimización —
nunca fueron validadas contra fuentes externas. Cada pilar fue elegido por intuición o conveniencia,
no por evidencia replicable.

Este trabajo es íntegramente documental y de investigación. No se toca ninguna línea de código.
El objetivo es producir una especificación tan sólida, precisa y contrastada que la implementación
posterior no requiera ninguna decisión adicional.

### Estado actual de las 6 capas

```
deterministic/  → fdlibm-based kernels (sin, cos, sqrt, atan2, exp, log, pow + Safe variants)
                  1 archivo, L0 bit-exact, zero dependencies

auxiliary/      → scalar/ (constants, arithmetic, comparison, interpolation)
                  angle/ (conversion, normalization, operations, interpolation, unwrapping)
                  numeric/ (guards, rounding, safety, wrapping)
                  14 archivos, usa deterministic/

core/           → Vector2, Complex, Interval, Rotation2, Matrix2, Matrix3, Transform2
                  8 archivos (7 tipos + index), usa auxiliary/ y deterministic/

types/          → *Like interfaces + type guards (1 archivo)
validation/     → Tree-shakeable assertions (1 archivo)
utils/          → parse, random, random-source, performance (4 archivos)
```

### Constraint fundamental

El paquete NO debe incluir geometrías ni algoritmos físicos. Es matemática primitiva: la base
que debe sostenerse sola como cimiento. Cada decisión tomada aquí se propaga a todo lo que se
construya encima.

## Goals / Non-Goals

**Goals:**

- Validar cada pilar fundacional contra literatura científica de renombre y bibliotecas comerciales líderes
- Producir un diagnóstico por entidad (constante, función, método) con veredicto justificado e irrefutable
- Diseñar la API definitiva del paquete: completa, sin legacy, sin ambigüedades, implementable sin decisiones pendientes
- Documentar cada decisión de diseño con sus fuentes externas, creando un decision log permanente
- Reconciliar los hallazgos con la documentación interna existente como paso final de cierre

**Non-Goals:**

- Modificar código fuente (este trabajo es puramente documental)
- Agregar tipos nuevos (AABB, Circle, Polygon — esos vendrán en paquetes superiores)
- Incluir geometría o algoritmos de física (fuera del scope de math core)
- Mantener compatibilidad hacia atrás por sí misma — si algo no tiene lugar en el diseño definitivo, se elimina
- Optimización prematura de bundle size — la auditoría prioriza corrección y ergonomía

## Decisions

### D1: Metodología de tres fases secuenciales

**Decision:** La auditoría se ejecuta en tres fases estrictas. No se avanza a la siguiente
hasta completar la anterior. La documentación interna del proyecto se consulta exclusivamente
en la fase de cierre.

**Fases:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  FASE 1: Auditoría de estado actual                                │
│  ─────────────────────────────────────                             │
│  Lectura línea a línea de todo el código fuente                    │
│  Contraste con fuentes externas obligatorias                       │
│  Diagnóstico por entidad: ✅ mantener │ ⚠️ redefinir │ 🗑️ eliminar │ ➕ agregar │
│  Output: Inventario + análisis + diagnóstico por módulo            │
├─────────────────────────────────────────────────────────────────────┤
│  FASE 2: Diseño de API definitiva                                  │
│  ──────────────────────────────────                                │
│  Usa conclusiones de Fase 1 pero vuelve a contrastar cada decisión │
│  Produce API final: firmas, edge cases, capas, delegación          │
│  Output: Convenciones + API por módulo + grafo de dependencias     │
├─────────────────────────────────────────────────────────────────────┤
│  CIERRE: Contraste con documentación interna                       │
│  ───────────────────────────────────────────                       │
│  Lee toda la documentación interna de packages/math2d/docs/        │
│  Contrasta con el diseño propio para detectar incongruencias       │
│  Output: Tabla de alineación + revisiones + diseño reconciliado    │
└─────────────────────────────────────────────────────────────────────┘
```

**Rationale:** Leer la documentación interna antes de formar criterio propio introduce sesgo
de confirmación. El análisis independiente primero, contraste después, produce hallazgos que
la documentación sola no revela.

**Alternativa descartada:** Auditoría integrada (código + docs simultáneos). Descartada porque
el riesgo de heredar errores documentados como verdades es alto en un proyecto que creció
orgánicamente.

### D2: Lectura línea a línea como método obligatorio

**Decision:** Cada archivo fuente se lee línea a línea, sin regex ni búsquedas de texto como
sustituto de lectura comprensiva. Cada entidad se trata como caso particular.

**Mentalidad de lectura — preguntas obligatorias por entidad:**

1. ¿Cuál es el propósito real, más allá de lo que el nombre sugiere?
2. ¿Qué regla o pilar de la librería revela su existencia?
3. ¿Cómo se supone que el desarrollador debe usarlo? ¿Qué DX propone?
4. ¿Qué pasa si se usa mal? ¿La API lo previene o lo permite silenciosamente?
5. ¿Qué escenario habilita que otro método no cubre?
6. ¿Qué edge cases existen y están contemplados o ignorados?
7. ¿Cómo impacta en performance: es seguro en un loop, genera allocations?
8. ¿Qué dice su relación con otros métodos del mismo módulo sobre el diseño del módulo?

**Rationale:** Un error de inferencia aquí genera un error de diseño que cuesta caro en
producción. La lectura superficial pierde información implícita que vive entre líneas: una
constante mal nombrada puede esconder una convención de todo el paquete, un método
aparentemente simple puede ser la primitiva sobre la que se construye la mitad de la librería.

### D3: Catálogo de fuentes externas obligatorias

**Decision:** Toda decisión de diseño DEBE estar contrastada contra al menos dos fuentes externas
independientes. Las fuentes se organizan en tres categorías:

**Matemáticas y utilidades generales:**

- gl-matrix (Brandon Jones) — referencia para API de álgebra lineal en JS, benchmarks de performance
- math.js — librería general de math en JS, API ergonómica
- Eigen (C++) — referencia académica de álgebra lineal, gold standard de corrección
- nalgebra (Rust) — referencia de type safety en math, ownership patterns

**Motores de física y gráficos:**

- three.js (Mr.doob) — referencia de DX en 3D math para JS, API más usada
- Babylon.js — alternativa a three.js con enfoque diferente en API design
- Godot Engine — referencia de math para game engines, documentación ejemplar
- Unity.Mathematics (DOTS) — referencia de performance-first math, SIMD patterns
- Box2D (Erin Catto) — gold standard de física 2D, reference implementation
- Rapier (Dimforge) — física moderna en Rust/Wasm, determinismo cross-platform
- LÖVE 2D — referencia de API simple para 2D math

**Referencia académica:**

- IEEE 754-2019 — estándar de aritmética de punto flotante
- Goldberg, "What Every Computer Scientist Should Know About Floating-Point Arithmetic" (1991)
- Higham, "Accuracy and Stability of Numerical Algorithms" (2002)
- Muller et al., "Handbook of Floating-Point Arithmetic" (2018)
- Lengyel, "Foundations of Game Engine Development Vol. 1: Mathematics" (2016)
- Dorst et al., "Geometric Algebra for Computer Science" (2007)
- Eberly, "Geometric Tools for Computer Graphics" (2003)
- Shoemake, "Animating Rotation with Quaternion Curves" (SIGGRAPH 1985)
- GLSL specification (Khronos) — referencia de funciones matemáticas en shaders
- Glenn Fiedler, "Gaffer On Games" — referencia de determinismo en networking
- crlibm (INRIA) — correctly-rounded math library
- fdlibm (Sun/Oracle) — implementación de referencia original

**Regla de conflicto:** Si dos fuentes resuelven algo de manera diferente, documentar ambas
y justificar cuál aplica mejor al objetivo de este paquete (math core 2D para physics engine).

### D4: Sistema de diagnóstico por entidad

**Decision:** Cada constante, función y método recibe un veredicto con justificación irrefutable:

| Veredicto    | Significado                                                                | Requiere                                          |
| ------------ | -------------------------------------------------------------------------- | ------------------------------------------------- |
| ✅ Mantener  | La entidad es correcta, bien ubicada, y consistente                        | Confirmación contra fuentes externas              |
| ⚠️ Redefinir | La entidad tiene valor pero necesita cambios                               | Descripción precisa del cambio y justificación    |
| 🗑️ Eliminar  | La entidad no tiene lugar en el diseño final                               | Justificación de por qué sobra y qué la reemplaza |
| ➕ Agregar   | Falta una entidad que las fuentes externas y el análisis revelan necesaria | Especificación completa de la nueva entidad       |

### D5: Capas de API por escenario de uso

**Decision:** Cada operación significativa se analiza en tres niveles (donde el escenario lo
justifique — no toda operación necesita las tres):

```
┌──────────────────────────────────────────────────────────┐
│  Capa 3: API de objeto / fachada                        │
│  Ergonómica, encadenable, delega a capas inferiores     │
│  Para: DX, prototipado, código no crítico               │
├──────────────────────────────────────────────────────────┤
│  Capa 2: Hot path / optimizada                          │
│  Sin allocations, parámetro out, primitivas precomp.    │
│  Para: loops, partículas, simulaciones, physics ticks   │
├──────────────────────────────────────────────────────────┤
│  Capa 1: Primitiva matemática                           │
│  Operación mínima y correcta, sin overhead              │
│  Base para las otras capas y para uso directo            │
└──────────────────────────────────────────────────────────┘
```

Las tres capas se complementan, no se contradicen. Documentar cuándo usar cada una y cuál
delega en cuál. Un módulo puede tener métodos por completitud semántica que sirven como
fachada de una variante más eficiente.

**Rationale:** Inspirado en gl-matrix (todo funcional, out params), three.js (todo OOP, chaining),
y Unity.Mathematics (burst-friendly structs). El approach híbrido permite cubrir todos los
escenarios sin forzar un solo paradigma.

### D6: Simetría instancia ↔ estático como herramienta, no dogma

**Decision:** Definir regla explícita por paquete: qué métodos existen en ambas formas,
cuáles solo como estáticos, y por qué. Aplicar uniformemente con excepciones justificadas.

La regla se determina durante la Fase 2 analizando cada tipo. El criterio es:

- Estático puro: operaciones que no tienen "dueño" natural (factories, conversiones entre tipos)
- Instancia puro: mutaciones que solo tienen sentido sobre `this`
- Ambos: operaciones donde la semántica lo justifica y la consistencia lo requiere

### D7: Análisis por módulo — estructura obligatoria de Fase 1

**Decision:** Para cada módulo, el análisis produce obligatoriamente:

1. **Inventario actual** — lista completa de constantes, utilidades y métodos con rol inferido
2. **Análisis línea a línea** — observaciones concretas con número de línea, incluyendo lo implícito
3. **Contraste con fuentes externas** — cómo resuelven el mismo problema las librerías de referencia
4. **Diagnóstico por entidad** — veredicto con justificación irrefutable
5. **Mapa de sinergia** — qué usa qué, qué podría usar qué, dependencias circulares en riesgo
6. **Inconsistencias de convención** — nombres, firmas, patrones que rompen coherencia
7. **Reglas e intenciones inferidas** — pilares de diseño leídos en el código aunque no estén escritos

### D8: Criterios transversales de verificación

**Decision:** Cada módulo se verifica contra estos criterios:

- **Responsabilidad única:** propósito claro, acotado e inferable
- **DRY:** sin duplicación real; la duplicación aparente puede tener justificación semántica
- **SOLID:** especialmente SRP y OCP
- **Clean Code:** nombres claros, sin abreviaciones ambiguas, sin magic numbers sin nombre
- **Sin geometría ni física:** cualquier concepto de capa superior se señala
- **DX consciente:** uso correcto fácil, uso incorrecto difícil o imposible

### D9: Diseño final sin legacy (Fase 2)

**Decision:** El output de Fase 2 es el diseño final. No se mantienen métodos por compatibilidad
hacia atrás ni se marcan deprecated. Si algo no tiene lugar, se elimina con documentación
de por qué, para que no se reintroduzca.

**Scope obligatorio de Fase 2 (en orden de prioridad):**

1. Transformaciones y rotaciones en todos los tipos
2. Operaciones entre tipos (multiplicación, proyección, interpolación, conversión)
3. Utilidades y constantes compartidas
4. Inicialización y factories

### D10: Composición inter-módulo, fachadas y completitud matemática

**Decision:** La auditoría no trata cada módulo como isla. Cada archivo se lee línea a línea,
pero el análisis DEBE trazar cómo los módulos se componen entre sí, cómo sus métodos se
reutilizan para construir operaciones de mayor nivel, y dónde existen (o faltan) fachadas.

**Principio rector: los core types son el centro gravitacional.**

```
                        ┌───────────────────────────────────────────┐
                        │              USUARIO FINAL                │
                        │  (usa core types directamente o vía       │
                        │   utils/facades para DX ergonómica)       │
                        └────────────────────┬──────────────────────┘
                                             │
                        ┌────────────────────▼──────────────────────┐
                        │            core/ types                    │
                        │  Vector2, Rotation2, Complex, Matrix2,   │
                        │  Matrix3, Transform2, Interval            │
                        │                                           │
                        │  DEBEN contener TODAS las operaciones     │
                        │  que den completitud de propiedades       │
                        │  y operaciones matemáticas del tipo       │
                        ├───────────────────────────────────────────┤
                        │  Pueden COMPONER desde:                   │
                        │  ← auxiliary/ (primitivas escalares,      │
                        │     angulares, numéricas)                 │
                        │  ← deterministic/ (sin, cos, sqrt...)    │
                        │                                           │
                        │  Pueden SER USADOS por:                   │
                        │  → otros core types (Rotation2→Vector2,  │
                        │     Transform2→Matrix3, Complex→Rotation2)│
                        │  → utils/ (parse, format, random)        │
                        │  → validation/ (assertions de shape)     │
                        └───────────────────────────────────────────┘
```

**Análisis obligatorio de composición por entidad:**

Para cada método de cada módulo, documentar:

1. **¿Compone desde otro módulo?** — ¿Usa primitivas de auxiliary/, deterministic/, u otro core type?
   Si sí: ¿la dependencia es lógica y no introduce acoplamiento innecesario? ¿El costo de la
   indirección es aceptable en hot path?

2. **¿Es fachada de otra entidad?** — ¿Existe un método más eficiente al que este delega?
   Esto puede ocurrir dentro del mismo módulo (instance method delega a static) o entre módulos
   (Vector2.rotate delega a sinCos de auxiliary/ + multiplicación inline).
   Si es fachada: ¿el overhead de la fachada es aceptable? ¿El usuario sabe que existe la
   alternativa más eficiente? ¿La documentación lo hace explícito?

3. **¿Es primitiva que otros componen?** — ¿Otros métodos del mismo módulo o de otros módulos
   dependen de este? Si sí: ¿su firma y performance son adecuados para ser building block?
   Un cambio aquí tiene efecto cascada.

4. **¿Falta como operación en core?** — Si las propiedades matemáticas del tipo requieren una
   operación que no existe (e.g., un grupo algebraico necesita closure, identity, inverse), la
   operación DEBE ser agregada. La completitud matemática del core no es opcional: es lo que
   permite que las capas superiores (geometría, física) se construyan sin reimplementar primitivas.

**Fachadas intra-módulo:**

Un método dentro del mismo módulo puede existir como fachada de otro más eficiente por
completitud semántica o DX. Ejemplo: `vector.rotate(angle)` puede internamente calcular
sinCos y delegar a la lógica de rotación, mientras que `vector.rotateCS(cos, sin)` es la
primitiva directa. Ambos tienen razón de existir, pero:

- La relación de delegación DEBE ser explícita y documentada
- El costo de la fachada DEBE ser medido (¿cuánto overhead agrega la indirección?)
- Si el overhead es significativo en hot path, la fachada DEBE documentar que existe
  la alternativa directa y cuándo usarla

**Fachadas inter-módulo:**

Los core types pueden crear métodos que son proxy/fachada de operaciones que viven en
otros módulos para conveniencia del usuario. Ejemplo: `vector.applyRotation2(rotation)` es
fachada de `Rotation2.apply(rotation, vector)`. Estas fachadas:

- DEBEN existir solo si el costo-beneficio de DX lo justifica
- No DEBEN duplicar la lógica — DEBEN delegar a la implementación canónica
- DEBEN documentar a qué delegan
- El costo de la indirección DEBE evaluarse: si agregar un nivel de call stack en hot path
  no es aceptable, la fachada debería vivir solo en la capa de documentación/ejemplos, no en el API

**Completitud matemática de core types:**

Cada core type representa una estructura algebraica con propiedades que DEBEN estar completas:

| Core Type  | Estructura                 | Operaciones obligatorias                                                                       |
| ---------- | -------------------------- | ---------------------------------------------------------------------------------------------- |
| Vector2    | Espacio vectorial          | add, scale, dot, cross, magnitude, normalize, project, reject, reflect, rotate, lerp, slerp    |
| Complex    | Campo                      | add, multiply, conjugate, reciprocal, magnitude, normalize, fromPolar, toPolar, exp, log       |
| Rotation2  | Grupo SO(2)                | compose, inverse, identity, apply, fromAngle, toAngle, normalize, lerp, slerp                  |
| Interval   | Álgebra de intervalos      | union, intersect, contains, overlaps, expand, shrink, width, center, clamp                     |
| Matrix2    | Álgebra de matrices 2x2    | multiply, determinant, inverse, transpose, fromRotation, fromScale, transformVector            |
| Matrix3    | Transformaciones afines 2D | multiply, determinant, inverse, transpose, fromTRS, transformPoint, transformVector, decompose |
| Transform2 | Grupo afín descompuesto    | compose, inverse, identity, apply, toMatrix3, fromMatrix3, fromPose, lerp                      |

El audit DEBE verificar que cada operación obligatoria existe, y si falta, marcarla como ➕.
Las operaciones entre tipos (Rotation2→Matrix2, Complex→Rotation2, Transform2→Matrix3) DEBEN
formar un grafo de conversión coherente sin agujeros.

**Análisis de costo-beneficio de delegación:**

Para cada relación de composición/fachada/delegación, documentar:

```
┌──────────────────────────────────────────────────────────────────┐
│  Delegación: vector.rotate(angle) → sinCos(angle) + inline mul  │
├──────────────────────────────────────────────────────────────────┤
│  Costo:     1 sinCos call + objeto SinCos allocation (si no out)│
│  Beneficio: API ergonómica, no requiere precomputar             │
│  Hot path:  NO — usar rotateCS(cos, sin) en loops               │
│  Veredicto: MANTENER como fachada, documentar alternativa CS    │
└──────────────────────────────────────────────────────────────────┘
```

### D11: Cierre de contraste documental

**Decision:** Solo después de completar Fases 1 y 2, se lee toda la documentación existente
en `packages/math2d/docs/` y subdirectorios. El contraste produce:

- Tabla de alineación (alineado / en conflicto / desactualizado / no cubierto)
- Revisiones al diseño si el contraste las genera
- Gaps documentales (código sin docs que debería tenerla)
- Diseño final reconciliado

## Risks / Trade-offs

**[Scope creep por profundidad de análisis]** → Mitigation: El análisis se limita a las 6 capas
de math2d. Cualquier hallazgo que requiera cambios en otros paquetes se anota al margen sin
profundizar. Las fases son secuenciales y cada una tiene un output definido que cierra.

**[Sesgo de fuentes externas hacia 3D]** → Mitigation: La mayoría de librerías de referencia
son 3D (three.js, Eigen, Unity). Las decisiones se filtran por el constraint de este paquete:
matemática 2D pura. No se importan patrones de 3D que no aplican a 2D.

**[Breaking changes en constantes numéricas]** → Mitigation: Rollback plan — branch
`pre-audit-foundations` creado antes de cualquier cambio. Tests de regresión bit-exact contra
snapshot de valores de referencia. Cada cambio de constante documentado con justificación
científica y plan de migración.

**[Deterministic kernel modifications]** → Mitigation: El kernel fdlibm es la capa más sensible.
Cualquier hallazgo que sugiera modificaciones al kernel se marca con prioridad máxima y requiere
validación cruzada contra fdlibm original (Sun/Oracle), crlibm (INRIA), y al menos un motor
de juegos con lockstep probado.

**[Parálisis por análisis en decisiones de trade-off]** → Mitigation: Si dos alternativas son
equivalentes según las fuentes, se elige la que mejor sirva a DX. Si siguen siendo equivalentes,
se elige la más simple. Se documenta la alternativa descartada para referencia futura.

**[Documentación interna desactualizada contaminando el cierre]** → Mitigation: El cierre
contrasta, no absorbe. Los hallazgos propios tienen prioridad. La documentación interna solo
genera revisiones si revela información que el análisis genuinamente pasó por alto, no por
inercia de "ya estaba documentado así".

## Open Questions

- ¿Qué nivel de backward compatibility se tolera en la implementación posterior? (El diseño
  es sin legacy, pero la migración puede ser gradual o big-bang)
- ¿Los specs existentes en `openspec/specs/` (de la auditoría anterior) se consideran como
  baseline o se reescriben desde cero con los hallazgos de esta auditoría?
- ¿Se priorizan los módulos que impactan más al determinism kernel, o se sigue orden estricto
  de capas (bottom-up: deterministic → auxiliary → core → types → validation → utils)?
