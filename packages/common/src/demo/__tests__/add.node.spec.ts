/**
 * Unit‑tests for the demo add() function.
 * Runs in the “node” Jest project.
 */
import { add } from '../index';

describe('add()', () => {
 it('adds two positive numbers', () => {
  expect(add(2, 3)).toBe(5);
 });

 it('handles negatives', () => {
  expect(add(-4, 7)).toBe(3);
 });
});
