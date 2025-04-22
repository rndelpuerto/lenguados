/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import 'jest-canvas-mock';
import '@testing-library/jest-dom';

// Stub createObjectURL / revokeObjectURL
(globalThis as any).URL.createObjectURL = jest.fn();
(globalThis as any).URL.revokeObjectURL = jest.fn();

// Mock ResizeObserver
class ResizeObserver {
 observe() {}
 unobserve() {}
 disconnect() {}
}

(globalThis as any).ResizeObserver = ResizeObserver;

// requestAnimationFrame shim
(globalThis as any).requestAnimationFrame = (callback: FrameRequestCallback) =>
 setTimeout(callback, 0);
(globalThis as any).cancelAnimationFrame = (id: number) => clearTimeout(id);
