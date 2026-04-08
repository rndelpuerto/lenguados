# Interface: ComplexEigendecomposition

Defined in: [src/types/index.ts:492](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L492)

Eigendecomposition result for a 2x2 matrix with complex eigenvalues (no real eigenvectors).

## Since

0.7.0

## Properties

### imaginaryPart

> `readonly` **imaginaryPart**: `number`

Defined in: [src/types/index.ts:498](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L498)

Absolute value of the imaginary part.

---

### realPart

> `readonly` **realPart**: `number`

Defined in: [src/types/index.ts:496](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L496)

Real part of both conjugate eigenvalues.

---

### type

> `readonly` **type**: `"complex"`

Defined in: [src/types/index.ts:494](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L494)

Discriminant tag for complex eigendecomposition.
