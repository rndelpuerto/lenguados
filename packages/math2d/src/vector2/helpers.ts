/**
 * @file src/vector2/helpers.ts
 * @module math2d/core/vector2/helpers
 * @description Helper functions and type guards for Vector2.
 * @internal
 */

/**
 * Plain object with `{ x: number, y: number }` shape.
 * @public
 */
export type Vector2Like = { x: number; y: number };

/**
 * Readonly plain object with `{ readonly x: number, readonly y: number }` shape.
 * @public
 */
export type ReadonlyVector2Like = { readonly x: number; readonly y: number };

/**
 * Permanently freezes a Vector2 instance so it can no longer be mutated.
 *
 * @param vector - The Vector2 object to freeze.
 * @returns The *same* instance, now typed as ReadonlyVector2,
 *          after being frozen with Object.freeze.
 *
 * @remarks
 * - The returned object keeps its original reference; no new memory is allocated.
 * - In *strict mode* any subsequent attempt to modify `x` or `y` throws a
 *   `TypeError`. In non-strict mode the write is silently ignored.
 * - Use this helper to create **truly immutable static constants**.
 */
export function freezeVector2<T extends { x: number; y: number }>(vector: T): Readonly<T> {
 return Object.freeze(vector);
}

/**
 * Type guard for a plain object that *looks like* a 2‑D vector.
 *
 * @param subject - Unknown value to test.
 * @returns `true` if `subject` is an object with numeric `x` and `y` properties; otherwise `false`.
 *
 * @example
 * ```ts
 * if (isVector2Like(maybe)) {
 *   // `maybe` is narrowed to `{ readonly x:number, readonly y:number }`
 *   console.log(maybe.x + maybe.y);
 * }
 * ```
 */
export function isVector2Like(subject: unknown): subject is ReadonlyVector2Like {
 return (
  typeof subject === 'object' &&
  subject !== null &&
  typeof (subject as { x?: unknown }).x === 'number' &&
  typeof (subject as { y?: unknown }).y === 'number'
 );
}
