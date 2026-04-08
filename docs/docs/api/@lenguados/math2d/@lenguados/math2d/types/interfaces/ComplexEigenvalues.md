# Interface: ComplexEigenvalues

Defined in: [src/types/index.ts:450](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L450)

Eigenvalue result for a 2x2 matrix with complex conjugate eigenvalues.

## Remarks

The two eigenvalues are `realPart ± imaginaryPart * i`.

## Since

0.7.0

## Properties

### imaginaryPart

> `readonly` **imaginaryPart**: `number`

Defined in: [src/types/index.ts:456](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L456)

Absolute value of the imaginary part.

---

### realPart

> `readonly` **realPart**: `number`

Defined in: [src/types/index.ts:454](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L454)

Real part of both conjugate eigenvalues.

---

### type

> `readonly` **type**: `"complex"`

Defined in: [src/types/index.ts:452](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L452)

Discriminant tag for complex eigenvalues.
