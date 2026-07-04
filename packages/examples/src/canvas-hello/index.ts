/**
 * @file canvas-hello/index.ts
 * @module @lenguados/examples/canvas-hello
 * @description Canvas demo that exercises the real `@lenguados/math2d` API:
 * a square is modeled as four `Vector2` corners, rotated with `Rotation2`
 * (a single sin/cos evaluation per frame — not per corner), and rasterized onto a
 * 2D canvas. The math2d code is bundled into the built artifact, so the demo
 * runs standalone in a browser exactly as an npm consumer would receive it.
 */

import { Rotation2, Vector2 } from '@lenguados/math2d';

/**
 * Half-extent of the demo square, in canvas pixels
 *
 * @constant {number}
 * @category Constant
 * @since 0.7.0
 */
export const SQUARE_HALF_SIZE = 60;

/**
 * Resolves a canvas element and its 2D context, failing loudly on both paths
 *
 * @remarks
 * A wrong id and an unsupported environment must surface immediately and
 * identically — a demo never fails silently.
 *
 * @param canvasId - DOM id of the target `<canvas>` element
 * @returns The canvas and its 2D rendering context
 * @throws {Error} If the element does not exist, is not a canvas, or has no 2D context
 *
 * @internal
 */
const resolveContext = (
 canvasId: string,
): { canvas: HTMLCanvasElement; context: CanvasRenderingContext2D } => {
 const element = document.getElementById(canvasId);

 if (!(element instanceof HTMLCanvasElement)) {
  throw new Error(`canvas-hello: no <canvas> element with id "${canvasId}"`);
 }

 const context = element.getContext('2d');

 if (!context) {
  throw new Error(`canvas-hello: 2D context unavailable for canvas "${canvasId}"`);
 }

 return { canvas: element, context };
};

/**
 * Fills the whole canvas with a solid background
 *
 * @param canvasId - DOM id of the target `<canvas>` element
 * @returns Nothing
 * @throws {Error} If the canvas or its 2D context cannot be resolved
 *
 * @example
 * ```typescript
 * helloCanvas('demo-canvas');
 * ```
 *
 * @category Helpers
 * @since 0.3.0
 */
export const helloCanvas = (canvasId: string): void => {
 const { canvas, context } = resolveContext(canvasId);

 context.fillStyle = 'lime';
 context.fillRect(0, 0, canvas.width, canvas.height);
};

/**
 * Draws a square rotated by the given angle, centered on the canvas
 *
 * @remarks
 * Exercises the math2d hot-path pattern end to end: one `Rotation2.fromAngle`
 * per call (single sin/cos evaluation), then four allocation-free
 * `Rotation2.apply` calls writing through the `out` parameter — the same
 * pre-computed-rotation idiom the engine uses in simulation loops.
 * Deterministic: the same angle always produces the same four corners.
 *
 * Coordinate note: math2d convention is Y-up with CCW-positive angles, but
 * the returned corners are CANVAS coordinates, where Y grows downward — so a
 * positive angle renders visually clockwise, and the model corner (+H, +H)
 * lands toward the canvas bottom-right. The demo does not flip the Y axis;
 * the numbers follow the math2d convention, the pixels follow the canvas.
 *
 * @param canvasId - DOM id of the target `<canvas>` element
 * @param angleRadians - Rotation of the square, CCW positive in math2d coordinates (renders clockwise on the Y-down canvas), in radians
 * @returns The four rotated corners in canvas coordinates, for inspection and testing
 * @throws {Error} If the canvas or its 2D context cannot be resolved
 *
 * @example
 * ```typescript
 * import { drawRotatingSquare } from '@lenguados/examples/canvas-hello/index';
 *
 * const corners = drawRotatingSquare('demo-canvas', Math.PI / 4);
 * // corners[0] = model corner (+H, +H) rotated 45° and translated to canvas space
 * ```
 *
 * @category Helpers
 * @since 0.7.0
 */
export const drawRotatingSquare = (canvasId: string, angleRadians: number): Vector2[] => {
 const { canvas, context } = resolveContext(canvasId);
 const rotation = Rotation2.fromAngle(angleRadians);
 const center = new Vector2(canvas.width * 0.5, canvas.height * 0.5);

 // Full-frame render: clear first so successive calls (animation loops)
 // do not smear.
 context.clearRect(0, 0, canvas.width, canvas.height);

 // Model-space corners (CCW) rotated in place with the shared Rotation2,
 // then translated into canvas space.
 const corners = [
  new Vector2(SQUARE_HALF_SIZE, SQUARE_HALF_SIZE),
  new Vector2(-SQUARE_HALF_SIZE, SQUARE_HALF_SIZE),
  new Vector2(-SQUARE_HALF_SIZE, -SQUARE_HALF_SIZE),
  new Vector2(SQUARE_HALF_SIZE, -SQUARE_HALF_SIZE),
 ].map((corner) => Rotation2.apply(rotation, corner, corner).add(center));

 context.fillStyle = '#0b7285';
 context.beginPath();
 context.moveTo(corners[0]!.x, corners[0]!.y);

 for (const corner of corners.slice(1)) {
  context.lineTo(corner.x, corner.y);
 }

 context.closePath();
 context.fill();

 return corners;
};
