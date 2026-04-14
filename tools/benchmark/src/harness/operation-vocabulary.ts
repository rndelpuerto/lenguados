/**
 * Standard operation vocabulary for cross-library comparison.
 *
 * Defines the canonical set of operations that are common across
 * 2D math libraries. Each entry has a precise mathematical
 * specification so all adapters implement semantically identical ops.
 *
 * The vocabulary is the intersection of operations present in at least
 * 2 of: gl-matrix, Three.js Vector2/Matrix3, and @lenguados/math2d.
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

export interface OperationSpec {
 /** Standard operation name (e.g., "vectorAdd") */
 name: string;
 /** Category for grouping in reports */
 category: 'vector' | 'matrix' | 'rotation';
 /** Mathematical specification of inputs and expected output */
 description: string;
 /** Number of input parameters (excluding output parameter) */
 inputCount: number;
}

/* ========================================================================== */
/* Vector Operations                                                           */
/* ========================================================================== */

export const VECTOR_OPS: OperationSpec[] = [
 {
  name: 'vectorAdd',
  category: 'vector',
  description: 'Component-wise addition: (a.x+b.x, a.y+b.y)',
  inputCount: 2,
 },
 {
  name: 'vectorSubtract',
  category: 'vector',
  description: 'Component-wise subtraction: (a.x-b.x, a.y-b.y)',
  inputCount: 2,
 },
 {
  name: 'vectorScale',
  category: 'vector',
  description: 'Scalar multiplication: (v.x*s, v.y*s)',
  inputCount: 2,
 },
 {
  name: 'vectorDot',
  category: 'vector',
  description: 'Dot product: a.x*b.x + a.y*b.y',
  inputCount: 2,
 },
 {
  name: 'vectorCross',
  category: 'vector',
  description: '2D cross product (scalar): a.x*b.y - a.y*b.x',
  inputCount: 2,
 },
 {
  name: 'vectorMagnitude',
  category: 'vector',
  description: 'Euclidean length: sqrt(x*x + y*y)',
  inputCount: 1,
 },
 {
  name: 'vectorNormalize',
  category: 'vector',
  description: 'Unit vector in same direction: v / ||v||',
  inputCount: 1,
 },
 {
  name: 'vectorDistance',
  category: 'vector',
  description: 'Euclidean distance: ||a - b||',
  inputCount: 2,
 },
 {
  name: 'vectorLerp',
  category: 'vector',
  description: 'Linear interpolation: a + t*(b - a)',
  inputCount: 3,
 },
];

/* ========================================================================== */
/* Matrix Operations                                                           */
/* ========================================================================== */

export const MATRIX_OPS: OperationSpec[] = [
 {
  name: 'matrixMultiply',
  category: 'matrix',
  description: 'Matrix-matrix multiplication: A * B (3x3)',
  inputCount: 2,
 },
 {
  name: 'matrixTranspose',
  category: 'matrix',
  description: 'Matrix transpose: A^T',
  inputCount: 1,
 },
 {
  name: 'matrixDeterminant',
  category: 'matrix',
  description: 'Matrix determinant: det(A)',
  inputCount: 1,
 },
 {
  name: 'matrixInvert',
  category: 'matrix',
  description: 'Matrix inversion: A^{-1}',
  inputCount: 1,
 },
 {
  name: 'matrixFromRotation',
  category: 'matrix',
  description: 'Create rotation matrix from angle in radians',
  inputCount: 1,
 },
 {
  name: 'matrixFromScale',
  category: 'matrix',
  description: 'Create scale matrix from (sx, sy)',
  inputCount: 2,
 },
 {
  name: 'matrixTransformPoint',
  category: 'matrix',
  description: 'Transform a 2D point by a 3x3 matrix (affine)',
  inputCount: 2,
 },
 {
  name: 'matrixTransformVector',
  category: 'matrix',
  description: 'Transform a 2D vector by a 3x3 matrix (no translation)',
  inputCount: 2,
 },
];

/* ========================================================================== */
/* Rotation Operations                                                         */
/* ========================================================================== */

export const ROTATION_OPS: OperationSpec[] = [
 {
  name: 'rotationFromAngle',
  category: 'rotation',
  description: 'Create a 2D rotation from angle in radians',
  inputCount: 1,
 },
 {
  name: 'rotationMultiply',
  category: 'rotation',
  description: 'Compose two rotations: R1 * R2',
  inputCount: 2,
 },
 {
  name: 'rotationApplyToVector',
  category: 'rotation',
  description: 'Apply rotation to a 2D vector',
  inputCount: 2,
 },
];

/* ========================================================================== */
/* Full Vocabulary                                                             */
/* ========================================================================== */

export const ALL_OPERATIONS: OperationSpec[] = [
 ...VECTOR_OPS,
 ...MATRIX_OPS,
 ...ROTATION_OPS,
];

export const OPERATION_NAMES = new Set(ALL_OPERATIONS.map((op) => op.name));

/**
 * Get operation spec by name. Returns undefined if not in vocabulary.
 */
export function getOperationSpec(name: string): OperationSpec | undefined {
 return ALL_OPERATIONS.find((op) => op.name === name);
}
