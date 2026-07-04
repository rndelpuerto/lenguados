/**
 * Returns a greeting message for the specified name
 *
 * @param name - The name to include in the greeting
 * @returns A string formatted as `Hello, {name}!`
 *
 * @example
 * ```typescript
 * greet('Ada'); // 'Hello, Ada!'
 * ```
 *
 * @category Helpers
 * @since 0.0.0
 */
export function greet(name: string): string {
 return `Hello, ${name}!`;
}
