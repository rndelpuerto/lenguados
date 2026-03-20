## 1. Fixes

- [x] 1.1 Fix `@example` before `@see` → move `@see` before `@example` in `crossScalarLeft` (vector2.ts)
- [x] 1.2 Fix `@remarks` after `@example` → move `@remarks` before `@example` in `AngleUnwrapper` class (unwrapping.ts)

## 2. Verification

- [x] 2.1 Run full tag order scan — confirm 0 violations
- [x] 2.2 Run `npm run test:unit` — confirm all tests pass
