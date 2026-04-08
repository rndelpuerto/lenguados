# Interface: RealEigendecomposition

Defined in: [src/types/index.ts:473](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L473)

Eigendecomposition result for a 2x2 matrix with real eigenvalues and eigenvectors.

## Since

0.7.0

## Properties

### lambda1

> `readonly` **lambda1**: `number`

Defined in: [src/types/index.ts:477](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L477)

First eigenvalue.

---

### lambda2

> `readonly` **lambda2**: `number`

Defined in: [src/types/index.ts:481](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L481)

Second eigenvalue.

---

### type

> `readonly` **type**: `"real"`

Defined in: [src/types/index.ts:475](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L475)

Discriminant tag for real eigendecomposition.

---

### v1

> `readonly` **v1**: [`ReadonlyVector2Like`](ReadonlyVector2Like.md)

Defined in: [src/types/index.ts:479](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L479)

Normalized eigenvector corresponding to lambda1.

---

### v2

> `readonly` **v2**: [`ReadonlyVector2Like`](ReadonlyVector2Like.md)

Defined in: [src/types/index.ts:483](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L483)

Normalized eigenvector corresponding to lambda2.
