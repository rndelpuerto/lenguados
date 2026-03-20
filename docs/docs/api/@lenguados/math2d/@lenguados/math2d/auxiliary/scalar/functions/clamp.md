# Function: clamp()

> **clamp**(`value`, `min`, `max`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:25](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L25)

Clamps a value between min and max bounds.

## Parameters

### value

`number`

Value to clamp

### min

`number`

Lower bound

### max

`number`

Upper bound

## Returns

`number`

Clamped value

## Example

```typescript
clamp(5, 0, 10); // 5
clamp(-5, 0, 10); // 0
clamp(15, 0, 10); // 10
clamp(NaN, 0, 10); // NaN
```

## Since

0.7.0
