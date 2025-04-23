import { helloCanvas } from '../index';

describe('helloCanvas', () => {
 beforeEach(() => {
  document.body.innerHTML = `<canvas id="canvas" width="10" height="10"></canvas>`;
 });

 it('should fill the entire canvas with lime color', () => {
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  expect(canvas).toBeTruthy();

  const ctx = canvas.getContext('2d')!;
  const fillRectSpy = jest.spyOn(ctx, 'fillRect');

  helloCanvas('canvas');

  expect(ctx.fillStyle).toBe('#00ff00');
  expect(fillRectSpy).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
 });
});
