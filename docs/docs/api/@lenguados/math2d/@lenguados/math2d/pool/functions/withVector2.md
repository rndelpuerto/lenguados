# Function: withVector2()

> **withVector2**\<`R`\>(`function_`): `R`

Executes a function with a temporary Vector2 from the pool.

## Type Parameters

### R

`R`

## Parameters

### function\_

(`v`) => `R`

## Returns

`R`

Result of the function

## Example

```typescript
const length = withVector2((v) => {
 v.set(3, 4);
 return v.length();
});
```
