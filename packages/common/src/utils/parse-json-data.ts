/**
 * @file utils/parse-json-data.ts
 * @module @lenguados/common/utils
 * @description Type-safe JSON parsing that reports malformed input through
 * the return type (`undefined`) instead of an exception, so callers branch on
 * a value rather than wrapping every parse in try/catch.
 */

/**
 * Parses a JSON string, returning `undefined` on malformed input
 *
 * @remarks
 * Thin wrapper over `JSON.parse` with the failure channel moved into the
 * return type. The type parameter is a caller-supplied assertion — the shape
 * of the parsed value is NOT validated at runtime.
 *
 * @template TData - Expected shape of the parsed value (unvalidated)
 * @param data - JSON source text
 * @returns The parsed value, or `undefined` when the input is not valid JSON
 *
 * @example
 * ```typescript
 * const point = parseJSONData<{ x: number; y: number }>('{"x":1,"y":2}');
 * // point: { x: 1, y: 2 }
 *
 * const invalid = parseJSONData('not json');
 * // invalid: undefined
 * ```
 *
 * @category Helpers
 * @since 0.2.1
 */
const parseJSONData = <TData>(data: string): TData | undefined => {
 try {
  return JSON.parse(data) as TData;
 } catch {
  return undefined;
 }
};

export { parseJSONData };
