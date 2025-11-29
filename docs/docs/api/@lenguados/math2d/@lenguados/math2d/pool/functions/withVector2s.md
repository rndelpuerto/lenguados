# Function: withVector2s()

## Call Signature

> **withVector2s**\<`R`\>(`count`, `function_`): `R`

Executes a function with multiple temporary Vector2s from the pool.

### Type Parameters

#### R

`R`

### Parameters

#### count

`1`

Number of vectors needed

#### function\_

(`v1`) => `R`

### Returns

`R`

Result of the function

### Example

```typescript
const sum = withVector2s(3, (v1, v2, v3) => {
 v1.set(1, 0);
 v2.set(0, 1);
 return v1.add(v2, v3);
});
```

## Call Signature

> **withVector2s**\<`R`\>(`count`, `function_`): `R`

Executes a function with multiple temporary Vector2s from the pool.

### Type Parameters

#### R

`R`

### Parameters

#### count

`2`

Number of vectors needed

#### function\_

(`v1`, `v2`) => `R`

### Returns

`R`

Result of the function

### Example

```typescript
const sum = withVector2s(3, (v1, v2, v3) => {
 v1.set(1, 0);
 v2.set(0, 1);
 return v1.add(v2, v3);
});
```

## Call Signature

> **withVector2s**\<`R`\>(`count`, `function_`): `R`

Executes a function with multiple temporary Vector2s from the pool.

### Type Parameters

#### R

`R`

### Parameters

#### count

`3`

Number of vectors needed

#### function\_

(`v1`, `v2`, `v3`) => `R`

### Returns

`R`

Result of the function

### Example

```typescript
const sum = withVector2s(3, (v1, v2, v3) => {
 v1.set(1, 0);
 v2.set(0, 1);
 return v1.add(v2, v3);
});
```

## Call Signature

> **withVector2s**\<`R`\>(`count`, `function_`): `R`

Executes a function with multiple temporary Vector2s from the pool.

### Type Parameters

#### R

`R`

### Parameters

#### count

`4`

Number of vectors needed

#### function\_

(`v1`, `v2`, `v3`, `v4`) => `R`

### Returns

`R`

Result of the function

### Example

```typescript
const sum = withVector2s(3, (v1, v2, v3) => {
 v1.set(1, 0);
 v2.set(0, 1);
 return v1.add(v2, v3);
});
```
