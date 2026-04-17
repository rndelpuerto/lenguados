/**
 * @file harness/timeout.ts
 * @description Enforce operation timeout watchdog and crash recovery
 *
 * Enforces configurable timeout per stress test operation.
 * Catches unhandled exceptions and records them as diagnostic findings.
 */

import { addFinding } from './diagnostics.ts';
import type { DiagnosticReport } from './diagnostics.ts';

/* ========================================================================== */
/* Timeout Watchdog                                                            */
/* ========================================================================== */

/**
 * Execute a function with a timeout watchdog
 *
 * @remarks
 * For synchronous functions, the timeout cannot interrupt execution
 * (JavaScript is single-threaded). It only races against the event loop
 * for async operations.
 *
 * @template T - The return type of the function
 * @param fn - The function to execute (sync or async)
 * @param timeoutMs - Maximum time in milliseconds before timeout
 * @returns An object with the result (or null), timeout flag, and error (or null)
 */
export async function withTimeout<T>(
 fn: () => T | Promise<T>,
 timeoutMs: number,
): Promise<{ result: T | null; timedOut: boolean; error: Error | null }> {
 return new Promise((resolve) => {
  const timer = setTimeout(() => {
   resolve({ result: null, timedOut: true, error: null });
  }, timeoutMs);

  try {
   const maybePromise = fn();
   if (maybePromise instanceof Promise) {
    maybePromise
     .then((result) => {
      clearTimeout(timer);
      resolve({ result, timedOut: false, error: null });
     })
     .catch((err: unknown) => {
      clearTimeout(timer);
      resolve({
       result: null,
       timedOut: false,
       error: err instanceof Error ? err : new Error(String(err)),
      });
     });
   } else {
    clearTimeout(timer);
    resolve({ result: maybePromise, timedOut: false, error: null });
   }
  } catch (err: unknown) {
   clearTimeout(timer);
   resolve({
    result: null,
    timedOut: false,
    error: err instanceof Error ? err : new Error(String(err)),
   });
  }
 });
}

/* ========================================================================== */
/* Crash Recovery                                                              */
/* ========================================================================== */

/**
 * Execute a stress test operation with crash recovery and timeout
 *
 * @remarks
 * Catches unhandled exceptions, records them as diagnostic findings,
 * and continues the run without terminating.
 *
 * @template T - The return type of the function
 * @param fn - The function to execute (sync or async)
 * @param entity - The mathematical entity name (for diagnostic reporting)
 * @param operation - The operation name (for diagnostic reporting)
 * @param diagnostics - The diagnostic report to record findings in
 * @param timeoutMs - Maximum time in milliseconds before timeout (default: 30,000)
 * @returns The function result, or null if timed out or crashed
 */
export async function runWithRecovery<T>(
 fn: () => T | Promise<T>,
 entity: string,
 operation: string,
 diagnostics: DiagnosticReport,
 timeoutMs = 30_000,
): Promise<T | null> {
 const { result, timedOut, error } = await withTimeout(fn, timeoutMs);

 if (timedOut) {
  addFinding(diagnostics, {
   severity: 'error',
   type: 'timeout',
   entity,
   operation,
   message: `Operation exceeded ${timeoutMs / 1000}s timeout`,
  });
  return null;
 }

 if (error) {
  addFinding(diagnostics, {
   severity: 'error',
   type: 'crash',
   entity,
   operation,
   message: error.message,
   details: { stack: error.stack },
  });
  return null;
 }

 return result;
}
