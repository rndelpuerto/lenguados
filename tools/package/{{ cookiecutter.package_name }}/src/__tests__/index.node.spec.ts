import { greet } from '../index';

describe('greet()', () => {
 it('should return a formatted greeting message', () => {
  expect(greet('Alice')).toBe('Hello, Alice!');
 });

 it('should handle empty string', () => {
  expect(greet('')).toBe('Hello, !');
 });
});
