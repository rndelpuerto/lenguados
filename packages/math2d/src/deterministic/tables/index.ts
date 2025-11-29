/**
 * @file src/deterministic/tables/index.ts
 * @module @lenguados/math2d/deterministic/tables
 * @description Precalculated lookup tables for deterministic math operations.
 *
 * @remarks
 * These tables are generated at build time or initialization for fast,
 * deterministic approximations of expensive mathematical functions.
 */

/**
 * Sine lookup table size (number of entries).
 * Higher values give better precision but use more memory.
 */
export const DEFAULT_TABLE_SIZE = 4096;

/**
 * Base class for lookup tables.
 */
export abstract class LookupTable {
 protected readonly size: number;
 protected readonly data: Float64Array;

 constructor(size: number = DEFAULT_TABLE_SIZE) {
  this.size = size;
  this.data = new Float64Array(size);
  this.initialize();
 }

 /**
  * Initialize the table with precalculated values.
  */
 protected abstract initialize(): void;

 /**
  * Get interpolated value from the table.
  * @param index - Continuous index (may have fractional part)
  * @returns Interpolated value
  */
 protected interpolate(index: number): number {
  const baseIndex = Math.floor(index) % this.size;
  const nextIndex = (baseIndex + 1) % this.size;
  const fraction = index - Math.floor(index);

  return this.data[baseIndex]! + (this.data[nextIndex]! - this.data[baseIndex]!) * fraction;
 }
}

/**
 * Sine lookup table for fast, deterministic sine calculations.
 */
export class SineTable extends LookupTable {
 protected initialize(): void {
  const angleStep = (2 * Math.PI) / this.size;
  for (let index = 0; index < this.size; index++) {
   this.data[index] = Math.sin(index * angleStep);
  }
 }

 /**
  * Get sine value for angle.
  * @param radians - Angle in radians
  * @returns Sine of angle
  */
 getValue(radians: number): number {
  const normalizedAngle = radians % (2 * Math.PI);
  const index = (normalizedAngle / (2 * Math.PI)) * this.size;
  return this.interpolate(index);
 }
}

/**
 * Cosine lookup table for fast, deterministic cosine calculations.
 */
export class CosineTable extends LookupTable {
 protected initialize(): void {
  const angleStep = (2 * Math.PI) / this.size;
  for (let index = 0; index < this.size; index++) {
   this.data[index] = Math.cos(index * angleStep);
  }
 }

 /**
  * Get cosine value for angle.
  * @param radians - Angle in radians
  * @returns Cosine of angle
  */
 getValue(radians: number): number {
  const normalizedAngle = radians % (2 * Math.PI);
  const index = (normalizedAngle / (2 * Math.PI)) * this.size;
  return this.interpolate(index);
 }
}

/**
 * Combined sine/cosine table for efficient calculations.
 */
export class SinCosTable {
 private readonly sineTable: SineTable;
 private readonly cosineTable: CosineTable;

 constructor(size: number = DEFAULT_TABLE_SIZE) {
  this.sineTable = new SineTable(size);
  this.cosineTable = new CosineTable(size);
 }

 /**
  * Get sine and cosine values for angle.
  * @param radians - Angle in radians
  * @returns Object with sin and cos values
  */
 getSinCos(radians: number): { sin: number; cos: number } {
  return {
   sin: this.sineTable.getValue(radians),
   cos: this.cosineTable.getValue(radians),
  };
 }
}

/**
 * Arctangent lookup table for atan2 approximation.
 */
export class AtanTable extends LookupTable {
 protected initialize(): void {
  // Store atan values for ratios from -1 to 1
  for (let index = 0; index < this.size; index++) {
   const ratio = (index / (this.size - 1)) * 2 - 1; // Map to [-1, 1]
   this.data[index] = Math.atan(ratio);
  }
 }

 /**
  * Get arctangent value for ratio y/x.
  * @param y - Y component
  * @param x - X component
  * @returns Angle in radians
  */
 getValue(y: number, x: number): number {
  if (x === 0) {
   return y > 0 ? Math.PI / 2 : y < 0 ? -Math.PI / 2 : 0;
  }

  const ratio = y / x;
  const clampedRatio = Math.max(-1, Math.min(1, ratio));
  const index = ((clampedRatio + 1) / 2) * (this.size - 1);
  let angle = this.interpolate(index);

  // Adjust for quadrant
  if (x < 0) {
   angle += y >= 0 ? Math.PI : -Math.PI;
  }

  return angle;
 }
}
