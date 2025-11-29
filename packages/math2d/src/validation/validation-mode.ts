/**
 * @file src/validation/ValidationMode.ts
 * @module @lenguados/math2d/validation
 * @description Validation modes for numerical operations in @lenguados/math2d.
 */

/**
 * Validation mode for numerical operations.
 *
 * @remarks
 * Controls how the library handles invalid inputs and numerical edge cases.
 * - STRICT: Throws exceptions on any invalid input
 * - SAFE: Returns safe fallback values instead of throwing
 * - WARN: Logs warnings but continues execution
 * - NONE: No validation (maximum performance)
 */
export enum ValidationMode {
 /**
  * Strict validation mode.
  * Throws exceptions on invalid inputs.
  */
 STRICT = 'strict',

 /**
  * Safe validation mode.
  * Returns safe fallback values for invalid inputs.
  */
 SAFE = 'safe',

 /**
  * Warning validation mode.
  * Logs warnings but continues execution.
  */
 WARN = 'warn',

 /**
  * No validation mode.
  * Skips all validation checks for maximum performance.
  */
 NONE = 'none',
}

/**
 * Validation configuration options.
 */
export interface ValidationConfig {
 /**
  * Current validation mode.
  */
 mode: ValidationMode;

 /**
  * Whether to validate finite values.
  * @default true
  */
 validateFinite?: boolean;

 /**
  * Whether to validate NaN values.
  * @default true
  */
 validateNaN?: boolean;

 /**
  * Whether to validate range bounds.
  * @default true
  */
 validateRange?: boolean;

 /**
  * Whether to check for denormal numbers.
  * @default false
  */
 checkDenormals?: boolean;

 /**
  * Custom logger function for warnings.
  * @default console.warn
  */
 logger?: (message: string) => void;
}

/**
 * Default validation configuration.
 */
export const DEFAULT_VALIDATION_CONFIG: Required<ValidationConfig> = {
 mode: ValidationMode.SAFE,
 validateFinite: true,
 validateNaN: true,
 validateRange: true,
 checkDenormals: false,
 // eslint-disable-next-line no-undef
 logger: console.warn,
};

/**
 * Global validation configuration.
 */
let globalConfig: Required<ValidationConfig> = { ...DEFAULT_VALIDATION_CONFIG };

/**
 * Get current validation configuration.
 * @returns Current validation configuration
 */
export function getValidationConfig(): Required<ValidationConfig> {
 return { ...globalConfig };
}

/**
 * Set validation configuration.
 * @param config - Partial configuration to merge with current
 */
export function setValidationConfig(config: Partial<ValidationConfig>): void {
 globalConfig = {
  ...globalConfig,
  ...config,
 };
}

/**
 * Reset validation configuration to defaults.
 */
export function resetValidationConfig(): void {
 globalConfig = { ...DEFAULT_VALIDATION_CONFIG };
}

/**
 * Execute a function with temporary validation configuration.
 * @param config - Temporary configuration
 * @param fn - Function to execute
 * @returns Result of the function
 */
export function withValidationConfig<T>(config: Partial<ValidationConfig>, function_: () => T): T {
 const previousConfig = { ...globalConfig };
 try {
  setValidationConfig(config);
  return function_();
 } finally {
  globalConfig = previousConfig;
 }
}
