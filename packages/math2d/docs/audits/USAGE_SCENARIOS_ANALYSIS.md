# Análisis de Escenarios de Uso: `@lenguados/math2d`

> **Objetivo:** Simular escenarios reales de uso para identificar gaps, oportunidades de mejora y validar la ergonomía de la API actual.

---

## Tabla de Contenidos

1. [Perfiles de Usuario](#1-perfiles-de-usuario)
2. [Escenarios por Dominio](#2-escenarios-por-dominio)
3. [Escenarios por Módulo](#3-escenarios-por-módulo)
4. [Patrones de Composición](#4-patrones-de-composición)
5. [Análisis de Gaps](#5-análisis-de-gaps)
6. [Recomendaciones](#6-recomendaciones)

---

## 1. Perfiles de Usuario

### 1.1 Desarrollador de Juegos 2D

- **Prioridades:** Rendimiento en hot paths, determinismo para replay
- **Uso típico:** Game loop, física simplificada, transformaciones
- **Nivel técnico:** Medio-alto

### 1.2 Desarrollador de UI/Canvas

- **Prioridades:** Ergonomía, transformaciones, hit testing
- **Uso típico:** Drag & drop, zoom/pan, rotación de elementos
- **Nivel técnico:** Medio

### 1.3 Desarrollador de Simulaciones

- **Prioridades:** Determinismo bit-exact, precisión numérica
- **Uso típico:** Simulaciones lockstep, networking, replay
- **Nivel técnico:** Alto

### 1.4 Desarrollador de Paquetes (Library Author)

- **Prioridades:** Extensibilidad, tipos robustos, tree-shaking
- **Uso típico:** Construir sobre math2d (physics2d, geometry2d)
- **Nivel técnico:** Alto

### 1.5 Desarrollador de Herramientas/Editores

- **Prioridades:** Ergonomía, serialización, validación
- **Uso típico:** Editores de niveles, herramientas de diseño
- **Nivel técnico:** Medio-alto

---

## 2. Escenarios por Dominio

### 2.1 Game Loop - Hot Path

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Update de 1000 entidades por frame a 60 FPS
// REQUISITOS: Máximo rendimiento, mínimas alocaciones
// ═══════════════════════════════════════════════════════════════════════════

class Entity {
 position: Vector2;
 velocity: Vector2;
 rotation: Rotation2; // ✅ Almacena cos/sin, no ángulo

 // Buffers reutilizables para evitar GC
 private _tempVector = new Vector2();
 private _sinCosBuffer: SinCos = { sin: 0, cos: 0 };
}

function updateEntities(entities: Entity[], dt: number): void {
 for (const entity of entities) {
  // ✅ CORRECTO: Usar variante Unchecked en hot path
  // ❓ PREGUNTA: ¿Existe addScaled(velocity, dt, out)?
  entity.position.addScaled(entity.velocity, dt);

  // ✅ CORRECTO: Rotation2 evita sinCos() en cada frame
  entity.rotation.apply(entity._tempVector.set(1, 0));

  // ⚠️ PROBLEMA: ¿Cómo rotar múltiples vectores eficientemente?
  // 💡 NECESITAMOS: applyBatch(vectors: Vector2[], out: Vector2[])
 }
}

// ═══════════════════════════════════════════════════════════════════════════
// GAPS IDENTIFICADOS:
// ═══════════════════════════════════════════════════════════════════════════
// - [ ] Vector2.addScaled(other, scalar, out?) - evita crear vector temporal
// - [ ] Rotation2.applyBatch(vectors, out) - procesar múltiples vectores
// - [ ] Vector2Pool / ObjectPool genérico para evitar GC
// - [ ] TypedArray batch operations para SIMD-friendly code
```

### 2.2 Transformaciones Jerárquicas (Scene Graph)

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Sistema de transformaciones padre-hijo
// REQUISITOS: Composición eficiente, cálculo de world transform
// ═══════════════════════════════════════════════════════════════════════════

class SceneNode {
 localTransform: Transform2;
 worldTransform: Transform2;
 parent: SceneNode | null;
 children: SceneNode[];

 // Cache para evitar recálculos
 private _worldMatrixDirty = true;
 private _cachedWorldMatrix = new Matrix3();
}

function updateWorldTransforms(node: SceneNode): void {
 if (node.parent) {
  // ✅ CORRECTO: Componer transforms
  // ❓ PREGUNTA: ¿Es eficiente? ¿Usa *CS internamente?
  Transform2.compose(node.parent.worldTransform, node.localTransform, node.worldTransform);

  // ⚠️ ALTERNATIVA: Trabajar con matrices directamente
  Matrix3.multiply(
   node.parent._cachedWorldMatrix,
   node.localTransform.toMatrix3(), // ❓ ¿Esto aloca?
   node._cachedWorldMatrix,
  );
 } else {
  node.worldTransform.copyFrom(node.localTransform);
 }

 for (const child of node.children) {
  updateWorldTransforms(child);
 }
}

// ═══════════════════════════════════════════════════════════════════════════
// GAPS IDENTIFICADOS:
// ═══════════════════════════════════════════════════════════════════════════
// - [ ] Transform2.compose(parent, child, out) - composición directa
// - [ ] Transform2.toMatrix3(out) - evitar alocación
// - [ ] Transform2.copyFrom(other) - copiar sin crear nuevo
// - [ ] Matrix3.fromTransform2(transform, out) - sin alocación
// - [ ] DirtyFlag utility para invalidación de cache
```

### 2.3 Hit Testing / Picking

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Detectar qué elemento está bajo el cursor
// REQUISITOS: Transformar punto, tests de contención
// ═══════════════════════════════════════════════════════════════════════════

function hitTest(worldPoint: Vector2, entity: Entity): boolean {
 // Necesitamos transformar el punto del mundo al espacio local

 // ⚠️ PROBLEMA: ¿Cómo obtener la inversa del transform?
 const localPoint = entity.worldTransform.inverseTransformPoint(worldPoint);
 // ❓ ¿Existe ese método? Si no, hay que:

 // ALTERNATIVA ACTUAL (verbose):
 const inverseTransform = entity.worldTransform.inverted(); // ¿Aloca? ¿Strict?
 const localPoint2 = inverseTransform.transformPoint(worldPoint);

 // Luego testear si está dentro del bounds local
 // ⚠️ PROBLEMA: No existe Box2
 return entity.localBounds.contains(localPoint2);
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Hit test con rotación
// ═══════════════════════════════════════════════════════════════════════════

function isPointInRotatedRect(
 point: Vector2,
 rectCenter: Vector2,
 rectSize: Vector2,
 rotation: Rotation2,
): boolean {
 // Transformar punto al espacio del rect
 const localPoint = Vector2.subtract(point, rectCenter);

 // ⚠️ PROBLEMA: Necesitamos rotación inversa
 rotation.applyInverse(localPoint, localPoint); // ❓ ¿Existe con out?

 // Test AABB en espacio local
 const halfSize = Vector2.scale(rectSize, 0.5);
 return Math.abs(localPoint.x) <= halfSize.x && Math.abs(localPoint.y) <= halfSize.y;

 // 💡 CON Box2 sería:
 // return Box2.fromCenterSize(Vector2.ZERO, rectSize).contains(localPoint);
}

// ═══════════════════════════════════════════════════════════════════════════
// GAPS IDENTIFICADOS:
// ═══════════════════════════════════════════════════════════════════════════
// - [ ] Transform2.inverseTransformPoint(point, out?) - atajo común
// - [ ] Transform2.inverseTransformVector(vector, out?) - sin traslación
// - [ ] Transform2.inverted(out?) - inversión sin alocación
// - [ ] Rotation2.applyInverse(vector, out?) - versión con out
// - [ ] Box2.contains(point) - test de contención
// - [ ] Box2.fromCenterSize(center, size) - factory común
```

### 2.4 Física Simplificada (Integración)

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Integración de velocidad/aceleración
// REQUISITOS: Precisión numérica, determinismo
// ═══════════════════════════════════════════════════════════════════════════

class RigidBody2D {
 position: Vector2;
 velocity: Vector2;
 acceleration: Vector2;
 angularVelocity: number;
 rotation: Rotation2;

 // Para compensated integration
 private _positionError = new Vector2();
}

function integrateVerlet(body: RigidBody2D, dt: number): void {
 // ✅ Semi-implicit Euler con Kahan summation

 // v += a * dt
 body.velocity.addScaled(body.acceleration, dt); // ❓ ¿Existe?

 // p += v * dt (con compensación de error)
 // ⚠️ PROBLEMA: ¿Cómo usar Kahan summation con Vector2?
 // 💡 NECESITAMOS: Vector2.addCompensated(delta, error)

 // Rotación
 // ⚠️ PROBLEMA: Rotation2 no tiene concepto de velocidad angular
 const deltaAngle = body.angularVelocity * dt;
 const deltaRot = Rotation2.fromAngle(deltaAngle); // ❓ ¿Cada frame?
 body.rotation.multiply(deltaRot); // ❓ ¿Existe multiply?

 // 💡 ALTERNATIVA EFICIENTE:
 // body.rotation.rotateBy(deltaAngle);  // No aloca
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Separación de colisión
// ═══════════════════════════════════════════════════════════════════════════

function resolveCircleCircleCollision(
 a: { center: Vector2; radius: number; velocity: Vector2 },
 b: { center: Vector2; radius: number; velocity: Vector2 },
): void {
 const delta = Vector2.subtract(b.center, a.center);
 const distance = delta.length; // ❓ ¿Getter o método?
 const minDist = a.radius + b.radius;

 if (distance < minDist) {
  // Calcular normal de colisión
  // ⚠️ PROBLEMA: ¿Qué pasa si distance ≈ 0?
  const normal = delta.normalizedSafe; // ❓ ¿Existe como getter?
  // O alternativamente:
  const normal2 = Vector2.normalizeSafe(delta); // Retorna (0,0) si zero

  // Separación
  const overlap = minDist - distance;
  const separation = Vector2.scale(normal, overlap * 0.5);

  a.center.subtract(separation);
  b.center.add(separation);

  // Reflexión de velocidad
  // ⚠️ PROBLEMA: ¿Existe reflect()?
  // v' = v - 2(v·n)n
  const vDotN = Vector2.dot(a.velocity, normal);
  const reflection = Vector2.scale(normal, 2 * vDotN);
  a.velocity.subtract(reflection);
 }
}

// ═══════════════════════════════════════════════════════════════════════════
// GAPS IDENTIFICADOS:
// ═══════════════════════════════════════════════════════════════════════════
// - [ ] Vector2.addScaled(other, scalar, out?) - operación muy común
// - [ ] Vector2.addCompensated(delta, error) - Kahan para vectores
// - [ ] Vector2.reflect(normal, out?) - reflexión física
// - [ ] Vector2.project(onto, out?) - proyección sobre vector
// - [ ] Vector2.reject(from, out?) - rechazo (perpendicular)
// - [ ] Rotation2.rotateBy(angle) - incrementar sin alocar
// - [ ] Rotation2.multiply(other, out?) - composición eficiente
// - [ ] Circle.intersects(other) - test de intersección
```

### 2.5 Interpolación de Animación

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Interpolar entre keyframes de animación
// REQUISITOS: Suavidad, diferentes tipos de easing
// ═══════════════════════════════════════════════════════════════════════════

interface Keyframe {
 time: number;
 position: Vector2;
 rotation: Rotation2;
 scale: Vector2;
}

function interpolateKeyframes(
 a: Keyframe,
 b: Keyframe,
 t: number,
 easing: (t: number) => number = smoothStep,
): Transform2 {
 const easedT = easing(t);

 // Posición: lerp directo ✅
 const position = Vector2.lerp(a.position, b.position, easedT);

 // Rotación: ⚠️ CUIDADO con wraparound
 // ❓ ¿Existe Rotation2.slerp o interpolación correcta?
 const rotation = Rotation2.slerp(a.rotation, b.rotation, easedT);
 // ¿O necesitamos hacerlo manualmente via ángulos?
 const angleA = a.rotation.angle;
 const angleB = b.rotation.angle;
 // ⚠️ PROBLEMA: angleDifference para shortest path
 const angleDiff = angleDifference(angleB, angleA);
 const interpolatedAngle = angleA + angleDiff * easedT;
 const rotation2 = Rotation2.fromAngle(interpolatedAngle);

 // Escala: lerp directo ✅
 const scale = Vector2.lerp(a.scale, b.scale, easedT);

 return Transform2.fromValues(position, rotation2.angle, scale);
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Interpolación con catmull-rom para paths suaves
// ═══════════════════════════════════════════════════════════════════════════

function catmullRomPath(
 points: Vector2[],
 t: number, // 0 a points.length - 1
 out?: Vector2,
): Vector2 {
 const i = Math.floor(t);
 const localT = t - i;

 const p0 = points[Math.max(0, i - 1)];
 const p1 = points[i];
 const p2 = points[Math.min(points.length - 1, i + 1)];
 const p3 = points[Math.min(points.length - 1, i + 2)];

 // ⚠️ PROBLEMA: ¿Existe catmullRom para Vector2?
 // 💡 NECESITAMOS: Vector2.catmullRom(p0, p1, p2, p3, t, out?)

 // Alternativa manual:
 const x = catmullRomInterp(p0.x, p1.x, p2.x, p3.x, localT);
 const y = catmullRomInterp(p0.y, p1.y, p2.y, p3.y, localT);

 out = out ?? new Vector2();
 return out.set(x, y);
}

// ═══════════════════════════════════════════════════════════════════════════
// GAPS IDENTIFICADOS:
// ═══════════════════════════════════════════════════════════════════════════
// - [ ] Rotation2.slerp(a, b, t) - interpolación esférica
// - [ ] Rotation2.slerpShortest(a, b, t) - shortest path
// - [ ] Vector2.catmullRom(p0, p1, p2, p3, t, out?) - curva spline
// - [ ] Vector2.bezier(p0, p1, p2, p3, t, out?) - curva bezier
// - [ ] Vector2.hermite(p0, t0, p1, t1, t, out?) - curva hermite
// - [ ] Transform2.lerp(a, b, t) - interpolación de transform completo
// - [ ] lerpAngle(a, b, t) - lerp de ángulos con wraparound
```

### 2.6 Serialización y Networking

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Sincronizar estado entre cliente y servidor
// REQUISITOS: Determinismo, serialización compacta
// ═══════════════════════════════════════════════════════════════════════════

interface NetworkedEntity {
 id: number;
 position: Vector2;
 velocity: Vector2;
 rotation: Rotation2;
}

// Serialización a buffer binario
function serializeEntity(entity: NetworkedEntity, buffer: DataView, offset: number): number {
 buffer.setUint32(offset, entity.id);
 offset += 4;

 // ❓ ¿Existe Vector2.toFloat32Array o toDataView?
 buffer.setFloat32(offset, entity.position.x);
 offset += 4;
 buffer.setFloat32(offset, entity.position.y);
 offset += 4;

 buffer.setFloat32(offset, entity.velocity.x);
 offset += 4;
 buffer.setFloat32(offset, entity.velocity.y);
 offset += 4;

 // Rotation2: ¿Serializar ángulo o cos/sin?
 // 💡 Ángulo es más compacto (1 float vs 2)
 // ⚠️ PROBLEMA: Pérdida de precisión al reconstruir
 buffer.setFloat32(offset, entity.rotation.angle);
 offset += 4;

 return offset;
}

function deserializeEntity(
 buffer: DataView,
 offset: number,
): { entity: NetworkedEntity; newOffset: number } {
 const id = buffer.getUint32(offset);
 offset += 4;

 // ❓ ¿Existe Vector2.fromDataView?
 const position = new Vector2(buffer.getFloat32(offset), buffer.getFloat32(offset + 4));
 offset += 8;

 const velocity = new Vector2(buffer.getFloat32(offset), buffer.getFloat32(offset + 4));
 offset += 8;

 const rotation = Rotation2.fromAngle(buffer.getFloat32(offset));
 offset += 4;

 return { entity: { id, position, velocity, rotation }, newOffset: offset };
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Snapshot para replay determinista
// ═══════════════════════════════════════════════════════════════════════════

function hashGameState(entities: NetworkedEntity[]): number {
 // Para detectar desync, necesitamos hash determinista

 // ⚠️ PROBLEMA: floats tienen problemas con hashing
 // 💡 NECESITAMOS: Conversión a fixed-point para hash

 let hash = 0;
 for (const entity of entities) {
  // ❓ ¿Existe Vector2.toFixedPoint(scale)?
  const px = Math.round(entity.position.x * 1000);
  const py = Math.round(entity.position.y * 1000);
  hash = ((hash << 5) - hash + px + py) | 0;
 }
 return hash;
}

// ═══════════════════════════════════════════════════════════════════════════
// GAPS IDENTIFICADOS:
// ═══════════════════════════════════════════════════════════════════════════
// - [ ] Vector2.toTypedArray(out?: Float32Array) - para buffers
// - [ ] Vector2.fromTypedArray(array, offset?) - desde buffers
// - [ ] Vector2.toFixedPoint(scale) - para hashing determinista
// - [ ] Transform2.toTypedArray() - serialización compacta
// - [ ] Rotation2.toCompact() - serializa solo ángulo
// - [ ] Rotation2.fromCompact(angle) - reconstruye cos/sin
```

### 2.7 Extensión por Otros Paquetes

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: @lenguados/physics2d extiende math2d
// REQUISITOS: Tipos extensibles, acceso a internals
// ═══════════════════════════════════════════════════════════════════════════

// physics2d/src/colliders/circle-collider.ts
import { Vector2, ReadonlyVector2Like, Circle } from '@lenguados/math2d';

class CircleCollider {
 // ✅ Usa tipo de math2d
 readonly shape: Circle; // ❓ ¿Existe Circle?

 // ❓ ¿Puedo extender Circle con métodos adicionales?
 // ⚠️ PROBLEMA: Si Circle es una clase, difícil de extender
 // 💡 SOLUCIÓN: Proveer interfaces + funciones standalone
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: @lenguados/geometry2d necesita algoritmos sobre primitivas
// ═══════════════════════════════════════════════════════════════════════════

// geometry2d/src/algorithms/convex-hull.ts
import { Vector2, ReadonlyVector2Like } from '@lenguados/math2d';

function convexHull(points: ReadonlyVector2Like[]): Vector2[] {
 // ✅ ReadonlyVector2Like permite cualquier objeto {x, y}
 // ✅ Buen diseño de tipos

 // ❓ ¿Existe alguna utilidad para cross product 2D?
 // cross(o, a, b) = (a-o) × (b-o)
 function cross(o: ReadonlyVector2Like, a: ReadonlyVector2Like, b: ReadonlyVector2Like): number {
  return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
 }

 // 💡 SERÍA ÚTIL: Vector2.cross2D(o, a, b) o similar

 // ... algoritmo de convex hull
 return [];
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: @lenguados/render2d necesita convertir a formato WebGL
// ═══════════════════════════════════════════════════════════════════════════

// render2d/src/batch-renderer.ts
import { Matrix3, Transform2 } from '@lenguados/math2d';

class BatchRenderer {
 private uniformBuffer: Float32Array;

 setTransform(transform: Transform2, offset: number): void {
  // Necesitamos copiar a Float32Array para WebGL

  const matrix = transform.toMatrix3(); // ❓ ¿Aloca?

  // ⚠️ PROBLEMA: ¿Cómo copiar directamente al buffer?
  // 💡 NECESITAMOS: matrix.copyToArray(array, offset)

  // Alternativa actual (ineficiente):
  const elements = matrix.elements; // ❓ ¿Es Float32Array o number[]?
  for (let i = 0; i < 9; i++) {
   this.uniformBuffer[offset + i] = elements[i];
  }

  // 💡 IDEAL: transform.toMatrix3Into(this.uniformBuffer, offset)
 }
}

// ═══════════════════════════════════════════════════════════════════════════
// GAPS IDENTIFICADOS:
// ═══════════════════════════════════════════════════════════════════════════
// - [ ] Primitivas geométricas: Circle, Box2, Ray2, Segment
// - [ ] Vector2.cross2D(o, a, b) - orientación de 3 puntos
// - [ ] Matrix3.copyToArray(array, offset) - copia directa
// - [ ] Transform2.toMatrix3Into(array, offset) - sin alocación
// - [ ] Interfaces extensibles vs clases selladas
// - [ ] ReadonlyCircle, ReadonlyBox2, etc. para inmutabilidad
```

---

## 3. Escenarios por Módulo

### 3.1 `auxiliary/scalar`

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Configuración de dificultad en juego
// ═══════════════════════════════════════════════════════════════════════════

function calculateDamage(
 baseDamage: number,
 distance: number,
 maxRange: number,
 difficultyMultiplier: number, // 0.5 (easy) to 2.0 (hard)
): number {
 // Falloff basado en distancia
 const normalizedDistance = saturate(distance / maxRange); // ✅
 const falloff = 1 - smoothStep(normalizedDistance); // ✅

 // ⚠️ PROBLEMA: ¿Existe exponential falloff?
 // 💡 ÚTIL: exponentialDecay(distance, halfLife)

 const damage = baseDamage * falloff * difficultyMultiplier;
 return clamp(damage, 0, 9999); // ✅
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Sistema de progresión con curvas
// ═══════════════════════════════════════════════════════════════════════════

function xpForLevel(level: number): number {
 // Típica fórmula: xp = base * level^exponent

 // ❓ ¿Existe pow seguro?
 // ⚠️ Math.pow puede dar NaN con negativos
 return 100 * Math.pow(level, 1.5);

 // 💡 ÚTIL: safePow(base, exponent) con manejo de edge cases
}

function levelFromXp(xp: number, maxLevel: number): number {
 // Inversa de la función anterior
 const rawLevel = Math.pow(xp / 100, 1 / 1.5);
 return clamp(Math.floor(rawLevel), 1, maxLevel); // ✅
}

// GAPS DE scalar:
// - [ ] exponentialDecay(value, halfLife, time)
// - [ ] exponentialGrowth(value, rate, time)
// - [ ] safePow(base, exponent) - maneja negativos
// - [ ] snap(value, gridSize) - alinear a grid
// - [ ] quantize(value, steps) - discretizar
// - [ ] wrap(value, min, max) - ¿diferente de loop?
```

### 3.2 `auxiliary/angle`

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: IA de enemigo que apunta al jugador
// ═══════════════════════════════════════════════════════════════════════════

function updateEnemyAiming(
 enemy: { position: Vector2; facingAngle: number; turnSpeed: number },
 target: Vector2,
 dt: number,
): void {
 // Calcular ángulo hacia el target
 const toTarget = Vector2.subtract(target, enemy.position);
 const targetAngle = Math.atan2(toTarget.y, toTarget.x); // ❓ ¿Existe en math2d?

 // 💡 ÚTIL: Vector2.angle() o angle(vector) standalone

 // Rotar gradualmente hacia el target
 const angleDiff = angleDifference(targetAngle, enemy.facingAngle); // ✅

 // Limitar velocidad de giro
 const maxTurn = enemy.turnSpeed * dt;
 const actualTurn = clamp(angleDiff, -maxTurn, maxTurn);

 // ⚠️ VERIFICAR: ¿clampAngle después de sumar?
 enemy.facingAngle = normalizeRadians(enemy.facingAngle + actualTurn); // ✅?
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Campo de visión (FOV)
// ═══════════════════════════════════════════════════════════════════════════

function isInFieldOfView(
 observer: { position: Vector2; facingAngle: number; fovAngle: number },
 target: Vector2,
): boolean {
 const toTarget = Vector2.subtract(target, observer.position);
 const angleToTarget = Math.atan2(toTarget.y, toTarget.x);

 // ⚠️ PROBLEMA: ¿Está dentro del FOV?
 const angleDiff = angleDistance(angleToTarget, observer.facingAngle); // ✅

 return angleDiff <= observer.fovAngle / 2;
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Sistema de radar con sectores
// ═══════════════════════════════════════════════════════════════════════════

function getRadarSector(angle: number, numSectors: number): number {
 // Dividir el círculo en sectores
 const normalized = normalizeRadians(angle); // 0 a TAU
 const sectorSize = TAU / numSectors;

 // ❓ ¿Existe función para esto?
 return Math.floor(normalized / sectorSize) % numSectors;

 // 💡 ÚTIL: angleSector(angle, numSectors)
}

// GAPS DE angle:
// - [ ] Vector2.angle() getter - atan2(y, x)
// - [ ] angleSector(angle, numSectors) - índice de sector
// - [ ] lerpAngle(a, b, t) - interpolación con wraparound
// - [ ] moveTowardsAngle(current, target, maxDelta) - para IA
// - [ ] angleFromTo(from, to) - ángulo entre dos vectores
```

### 3.3 `core/Vector2`

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Steering behaviors (AI movement)
// ═══════════════════════════════════════════════════════════════════════════

function steeringSeek(
 position: Vector2,
 target: Vector2,
 velocity: Vector2,
 maxSpeed: number,
 maxForce: number,
): Vector2 {
 // Desired velocity
 const desired = Vector2.subtract(target, position);

 // ⚠️ PROBLEMA: setLength que maneje zero vector
 const desiredVelocity = desired.normalized; // ❓ Throw si zero?
 desiredVelocity.scale(maxSpeed); // ✅ chainable

 // 💡 MEJOR: Vector2.setLength(desired, maxSpeed, out)
 // O: desired.withLength(maxSpeed) que retorna nuevo con safe handling

 // Steering force
 const steering = Vector2.subtract(desiredVelocity, velocity);

 // Truncar a maxForce
 // ⚠️ PROBLEMA: ¿Existe truncate/clampLength?
 if (steering.length > maxForce) {
  steering.normalize().scale(maxForce);
 }

 // 💡 ÚTIL: Vector2.clampLength(vector, maxLength, out)
 // O: steering.clampLength(maxForce) chainable

 return steering;
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Evitar obstáculos
// ═══════════════════════════════════════════════════════════════════════════

function steeringAvoid(
 position: Vector2,
 velocity: Vector2,
 obstacle: { center: Vector2; radius: number },
): Vector2 | null {
 // Proyectar obstáculo sobre el velocity
 const toObstacle = Vector2.subtract(obstacle.center, position);

 // Proyección escalar sobre dirección de velocidad
 // ⚠️ PROBLEMA: velocity podría ser zero
 const forward = velocity.normalizedSafe; // ✅ Retorna zero si zero
 const dotProduct = Vector2.dot(toObstacle, forward); // ✅

 if (dotProduct < 0) return null; // Obstáculo detrás

 // Componente lateral
 // ⚠️ PROBLEMA: ¿Existe Vector2.reject (perpendicular)?
 const lateral = Vector2.subtract(toObstacle, Vector2.scale(forward, dotProduct));

 // 💡 ÚTIL: Vector2.reject(vector, from, out) - component perpendicular
 // O: Vector2.project y Vector2.reject como par

 const lateralDistance = lateral.length;
 if (lateralDistance > obstacle.radius) return null;

 // Generar fuerza de evitación
 // ⚠️ ¿Cómo obtener perpendicular izquierdo/derecho?
 const perpendicular = new Vector2(-forward.y, forward.x); // Hardcoded

 // 💡 ÚTIL: Vector2.perpendicular(out) o Vector2.perpendicularCW/CCW

 return Vector2.scale(perpendicular, obstacle.radius - lateralDistance);
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Cálculo de centroide
// ═══════════════════════════════════════════════════════════════════════════

function calculateCentroid(points: Vector2[]): Vector2 {
 if (points.length === 0) {
  // ⚠️ ¿Qué retornar? ¿Throw? ¿Zero?
  return new Vector2(0, 0);
 }

 // ❓ ¿Existe Vector2.sum o Vector2.average?
 let sumX = 0,
  sumY = 0;
 for (const p of points) {
  sumX += p.x;
  sumY += p.y;
 }

 // 💡 ÚTIL: Vector2.centroid(points) o Vector2.average(points)

 return new Vector2(sumX / points.length, sumY / points.length);
}

// GAPS DE Vector2:
// - [ ] setLength(length) / withLength(length) - normalizar a longitud
// - [ ] clampLength(maxLength) - truncar si excede
// - [ ] perpendicular() / perpendicularCW() / perpendicularCCW()
// - [ ] project(onto, out?) - proyección sobre otro vector
// - [ ] reject(from, out?) - componente perpendicular
// - [ ] reflect(normal, out?) - reflexión física
// - [ ] static centroid(points) / average(points)
// - [ ] static sum(points, out?)
// - [ ] angle getter - atan2(y, x)
// - [ ] angleTo(other) - ángulo hacia otro vector
// - [ ] moveTowards(target, maxDelta) - para animaciones
// - [ ] rotateAround(center, angle, out?) - rotación orbital
```

### 3.4 `core/Matrix3`

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Editor de niveles con múltiples transformaciones
// ═══════════════════════════════════════════════════════════════════════════

class TransformGizmo {
 private baseMatrix: Matrix3;
 private rotationCenter: Vector2;

 rotateAroundPoint(angle: number, center: Vector2): void {
  // ⚠️ PROBLEMA: Operación común pero requiere varios pasos

  // 1. Trasladar al origen
  const toOrigin = Matrix3.fromTranslation(-center.x, -center.y);
  // 2. Rotar
  const rotation = Matrix3.fromRotation(angle);
  // 3. Trasladar de vuelta
  const fromOrigin = Matrix3.fromTranslation(center.x, center.y);

  // 4. Multiplicar en orden: fromOrigin * rotation * toOrigin
  let result = Matrix3.multiply(rotation, toOrigin);
  result = Matrix3.multiply(fromOrigin, result);

  this.baseMatrix = Matrix3.multiply(result, this.baseMatrix);

  // 💡 ÚTIL: Matrix3.rotateAroundPoint(angle, center, out?)
  // O: Matrix3.fromRotationAround(angle, center)
 }

 scaleAroundPoint(scale: Vector2, center: Vector2): void {
  // Mismo problema...
  // 💡 ÚTIL: Matrix3.scaleAroundPoint(scale, center, out?)
 }
}

// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: Descomposición de matriz
// ═══════════════════════════════════════════════════════════════════════════

function extractTransformComponents(matrix: Matrix3): {
 translation: Vector2;
 rotation: number;
 scale: Vector2;
 skew: number;
} {
 // ❓ ¿Existe Matrix3.decompose()?
 // ⚠️ Es una operación compleja con varios edge cases

 // 💡 NECESITAMOS: Matrix3.decompose() o Matrix3.toTransform2()

 // Implementación manual (propensa a errores):
 const translation = new Vector2(matrix.m20, matrix.m21); // ❓ Naming correcto?

 const scaleX = Math.sqrt(matrix.m00 * matrix.m00 + matrix.m01 * matrix.m01);
 const scaleY = Math.sqrt(matrix.m10 * matrix.m10 + matrix.m11 * matrix.m11);

 const rotation = Math.atan2(matrix.m01, matrix.m00);

 // ⚠️ Skew es más complejo...

 return { translation, rotation, scale: new Vector2(scaleX, scaleY), skew: 0 };
}

// GAPS DE Matrix3:
// - [ ] rotateAroundPoint(angle, center) - rotación alrededor de punto
// - [ ] scaleAroundPoint(scale, center) - escala alrededor de punto
// - [ ] decompose() - extraer translation, rotation, scale, skew
// - [ ] toTransform2() - conversión directa
// - [ ] fromRotationAround(angle, center) - factory
// - [ ] fromScaleAround(scale, center) - factory
// - [ ] getTranslation(out?) - extraer solo traslación
// - [ ] getScale() - extraer solo escala
// - [ ] getRotation() - extraer solo rotación
```

---

## 4. Patrones de Composición

### 4.1 Patrón: Object Pool

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// PROBLEMA: Evitar alocaciones en hot paths
// ═══════════════════════════════════════════════════════════════════════════

// ⚠️ ¿math2d debería proveer esto?
// 💡 Probablemente en @lenguados/core o similar

class Vector2Pool {
 private pool: Vector2[] = [];
 private index = 0;

 acquire(): Vector2 {
  if (this.index >= this.pool.length) {
   this.pool.push(new Vector2());
  }
  return this.pool[this.index++];
 }

 reset(): void {
  this.index = 0;
 }
}

// USO:
const pool = new Vector2Pool();
function gameLoop() {
 pool.reset();

 const temp1 = pool.acquire();
 const temp2 = pool.acquire();
 // ...usar temp1 y temp2...
}

// DECISIÓN: ¿Incluir en math2d?
// - PRO: Muy útil para usuarios de juegos
// - CON: Puede ir en paquete de utilidades
// - RECOMENDACIÓN: Documentar patrón, no incluir implementación
```

### 4.2 Patrón: Fluent Builder para Transformaciones

```typescript
// ═══════════════════════════════════════════════════════════════════════════
// ESCENARIO: API fluida para construir transformaciones
// ═══════════════════════════════════════════════════════════════════════════

// ❓ ¿Deberíamos tener algo así?
class TransformBuilder {
 private matrix = Matrix3.identity();

 translate(x: number, y: number): this {
  Matrix3.translate(this.matrix, x, y, this.matrix);
  return this;
 }

 rotate(angle: number): this {
  Matrix3.rotate(this.matrix, angle, this.matrix);
  return this;
 }

 scale(x: number, y: number = x): this {
  Matrix3.scale(this.matrix, x, y, this.matrix);
  return this;
 }

 build(): Matrix3 {
  return this.matrix.clone();
 }
}

// USO:
const transform = new TransformBuilder()
 .translate(100, 200)
 .rotate(Math.PI / 4)
 .scale(2)
 .build();

// NOTA: Matrix3 ya tiene métodos chainables, pero no un builder pattern
// ⚠️ El chaining actual muta, no es funcional
```

---

## 5. Análisis de Gaps

### 5.1 Gaps Críticos (Bloquean uso común)

| Gap                                | Módulo     | Impacto | Escenarios Afectados         |
| ---------------------------------- | ---------- | ------- | ---------------------------- |
| `Box2` ausente                     | primitives | Alto    | Hit testing, culling, bounds |
| `Circle` ausente                   | primitives | Alto    | Colisiones, radial queries   |
| `Vector2.addScaled`                | Vector2    | Alto    | Física, integración          |
| `Transform2.inverseTransformPoint` | Transform2 | Alto    | Hit testing, picking         |
| `Rotation2.slerp`                  | Rotation2  | Medio   | Animación, interpolación     |

### 5.2 Gaps de Ergonomía (Hacen código verbose)

| Gap                       | Módulo  | Alternativa Actual                             |
| ------------------------- | ------- | ---------------------------------------------- |
| `Vector2.perpendicular()` | Vector2 | `new Vector2(-v.y, v.x)`                       |
| `Vector2.angle` getter    | Vector2 | `Math.atan2(v.y, v.x)`                         |
| `Vector2.clampLength()`   | Vector2 | `if (v.length > max) v.normalize().scale(max)` |
| `Matrix3.decompose()`     | Matrix3 | Implementación manual compleja                 |
| `lerpAngle()`             | angle   | Manejo manual de wraparound                    |

### 5.3 Gaps de Rendimiento (Causan alocaciones innecesarias)

| Gap                                  | Módulo     | Problema                             |
| ------------------------------------ | ---------- | ------------------------------------ |
| `Transform2.toMatrix3(out)`          | Transform2 | Siempre aloca nuevo Matrix3          |
| `Matrix3.copyToArray(array, offset)` | Matrix3    | Requiere copia elemento por elemento |
| `Rotation2.applyBatch()`             | Rotation2  | No hay procesamiento batch           |
| Pooling utilities                    | utils      | Cada usuario reimplementa            |

### 5.4 Gaps de Extensibilidad

| Gap                                    | Impacto                                   |
| -------------------------------------- | ----------------------------------------- |
| Primitivas como clases selladas        | Difícil extender para physics2d           |
| Falta `ReadonlyCircle`, `ReadonlyBox2` | Inconsistencia con Vector2                |
| No hay hooks para determinismo custom  | Usuarios no pueden cambiar implementación |

---

## 6. Recomendaciones

### 6.1 Alta Prioridad (Agregar pronto)

```typescript
// Vector2 - operaciones muy comunes
Vector2.addScaled(v, scalar, out?): Vector2
Vector2.clampLength(maxLength): this
Vector2.perpendicular(): Vector2  // o perpendicularCCW
Vector2.project(onto, out?): Vector2
Vector2.reflect(normal, out?): Vector2
Vector2.angle: number  // getter

// Primitivas geométricas
class Box2 { contains, intersects, expand, center, size }
class Circle { contains, intersects }
class Ray2 { at, distanceToPoint }

// Transform2 - operaciones comunes en hit testing
Transform2.inverseTransformPoint(point, out?): Vector2
Transform2.inverseTransformVector(vector, out?): Vector2

// Interpolación
Rotation2.slerp(a, b, t): Rotation2
lerpAngle(a, b, t): number
```

### 6.2 Media Prioridad (Agregar cuando sea posible)

```typescript
// Vector2 - útiles pero menos críticas
Vector2.setLength(length): this
Vector2.moveTowards(target, maxDelta): this
Vector2.rotateAround(center, angle, out?): Vector2
Vector2.centroid(points): Vector2  // static

// Matrix3 - operaciones de editor/gizmos
Matrix3.rotateAroundPoint(angle, center): this
Matrix3.decompose(): { translation, rotation, scale }

// Angle - utilidades de IA/gameplay
moveTowardsAngle(current, target, maxDelta): number
angleSector(angle, numSectors): number
```

### 6.3 Baja Prioridad (Nice-to-have)

```typescript
// Curves - pueden ir en paquete separado
Vector2.catmullRom(p0, p1, p2, p3, t, out?): Vector2
Vector2.bezier(p0, p1, p2, p3, t, out?): Vector2

// Batch operations - optimización avanzada
Rotation2.applyBatch(vectors, out[]): void
Vector2.transformBatch(matrix, vectors, out[]): void

// Serialization helpers - pueden ir en @lenguados/serialize
Vector2.toTypedArray(out?): Float32Array
Matrix3.copyToArray(array, offset): void
```

### 6.4 Documentación a Agregar

1. **Guía de patrones de uso** con ejemplos de hot path
2. **Guía de integración** para autores de paquetes
3. **Cookbook** con soluciones a problemas comunes
4. **Performance guide** explicando cuándo usar *Unchecked vs *Safe

---

_Documento de análisis de escenarios. Actualizado: Diciembre 2025._
