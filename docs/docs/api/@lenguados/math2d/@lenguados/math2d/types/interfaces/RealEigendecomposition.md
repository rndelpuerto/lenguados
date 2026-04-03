# Interface: RealEigendecomposition

Defined in: [src/types/index.ts:473](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L473)

Eigendecomposition result for a 2x2 matrix with real eigenvalues and eigenvectors.

## Since

0.8.0

## Properties

### lambda1

> `readonly` **lambda1**: `number`

Defined in: [src/types/index.ts:477](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L477)

First eigenvalue.

---

### lambda2

> `readonly` **lambda2**: `number`

Defined in: [src/types/index.ts:481](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L481)

Second eigenvalue.

---

### type

> `readonly` **type**: `"real"`

Defined in: [src/types/index.ts:475](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L475)

Discriminant tag for real eigendecomposition.

---

### v1

> `readonly` **v1**: [`ReadonlyVector2Like`](ReadonlyVector2Like.md)

Defined in: [src/types/index.ts:479](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L479)

Normalized eigenvector corresponding to lambda1.

---

### v2

> `readonly` **v2**: [`ReadonlyVector2Like`](ReadonlyVector2Like.md)

Defined in: [src/types/index.ts:483](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L483)

Normalized eigenvector corresponding to lambda2.
