import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Rotation2, Vector2 } from '@lenguados/math2d';

import { SQUARE_HALF_SIZE, drawRotatingSquare, helloCanvas } from '../../src/canvas-hello';

const DIGITS = 10;

describe('helloCanvas', () => {
 beforeEach(() => {
  document.body.innerHTML = `<canvas id="canvas" width="10" height="10"></canvas>`;
 });

 it('should fill the entire canvas with lime color', () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  expect(canvas).toBeTruthy();

  const context = canvas.getContext('2d')!;
  const fillRectSpy = jest.spyOn(context, 'fillRect');

  helloCanvas('canvas');

  expect(context.fillStyle).toBe('#00ff00');
  expect(fillRectSpy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
 });

 it('should throw a descriptive error for a missing canvas id', () => {
  expect(() => helloCanvas('missing')).toThrow(/no <canvas> element with id "missing"/);
 });
});

describe('drawRotatingSquare', () => {
 beforeEach(() => {
  document.body.innerHTML = `<canvas id="canvas" width="200" height="100"></canvas>`;
 });

 it('returns all four corners matching raw trigonometry at a nonzero angle', () => {
  const angle = 0.7;
  const corners = drawRotatingSquare('canvas', angle);

  expect(corners).toHaveLength(4);

  // Fully independent expectation: raw Math trig, no math2d code path shared
  // with the implementation. Rotation x' = x·cos − y·sin, y' = x·sin + y·cos,
  // then translation to the canvas center (100, 50).
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const model: Array<[number, number]> = [
   [SQUARE_HALF_SIZE, SQUARE_HALF_SIZE],
   [-SQUARE_HALF_SIZE, SQUARE_HALF_SIZE],
   [-SQUARE_HALF_SIZE, -SQUARE_HALF_SIZE],
   [SQUARE_HALF_SIZE, -SQUARE_HALF_SIZE],
  ];

  for (const [index, [x, y]] of model.entries()) {
   expect(corners[index]!.x).toBeCloseTo(x * cos - y * sin + 100, DIGITS);
   expect(corners[index]!.y).toBeCloseTo(x * sin + y * cos + 50, DIGITS);
  }
 });

 it('agrees with the public math2d API used allocation-style', () => {
  const angle = Math.PI / 4;
  const corners = drawRotatingSquare('canvas', angle);

  // Cross-path check: Rotation2.apply WITHOUT the out parameter (allocation
  // path) against the implementation's in-place aliased path.
  const rotation = Rotation2.fromAngle(angle);
  const expected = Rotation2.apply(rotation, new Vector2(SQUARE_HALF_SIZE, SQUARE_HALF_SIZE)).add(
   new Vector2(100, 50),
  );

  expect(corners[0]!.x).toBeCloseTo(expected.x, DIGITS);
  expect(corners[0]!.y).toBeCloseTo(expected.y, DIGITS);
 });

 it('is deterministic for the same angle', () => {
  const first = drawRotatingSquare('canvas', 1.2345);
  const second = drawRotatingSquare('canvas', 1.2345);

  for (const [index, corner] of first.entries()) {
   expect(corner.x).toBe(second[index]!.x);
   expect(corner.y).toBe(second[index]!.y);
  }
 });

 it('centers the unrotated square on the canvas', () => {
  const corners = drawRotatingSquare('canvas', 0);

  expect(corners[0]!.x).toBeCloseTo(100 + SQUARE_HALF_SIZE, DIGITS);
  expect(corners[0]!.y).toBeCloseTo(50 + SQUARE_HALF_SIZE, DIGITS);
  expect(corners[2]!.x).toBeCloseTo(100 - SQUARE_HALF_SIZE, DIGITS);
  expect(corners[2]!.y).toBeCloseTo(50 - SQUARE_HALF_SIZE, DIGITS);
 });

 it('draws the polygon through the 2D context', () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d')!;
  const fillSpy = jest.spyOn(context, 'fill');
  const lineToSpy = jest.spyOn(context, 'lineTo');

  drawRotatingSquare('canvas', 0.5);

  expect(fillSpy).toHaveBeenCalledTimes(1);
  expect(lineToSpy).toHaveBeenCalledTimes(3);
 });
});
