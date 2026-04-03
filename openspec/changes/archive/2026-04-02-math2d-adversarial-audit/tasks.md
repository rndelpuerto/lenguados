# Tasks: math2d Adversarial Audit Implementation

## P1: Important (5 items)

- [x] AUDIT-P1-1: Identify `Rotation2.fromMatrix2` precision loss — round-trips through atan2 unnecessarily
  - File: `core/rotation2.ts:495-498`
  - Action: Replace `atan2(m01, m00)` + `fromAngle` with direct column extraction + normalize
  - Agents: Agent 2 flagged, Agent 5 confirmed

- [x] AUDIT-P1-2: Identify `ITERATIVE_TOLERANCE` as unused constant
  - File: `auxiliary/scalar/constants.ts:54`
  - Action: Remove (zero consumers in codebase)
  - Agents: Agent 2 flagged, Agent 5 confirmed via grep

- [x] AUDIT-P1-3: Identify `MAX_SAFE_INTEGER_F64` as pure alias
  - File: `auxiliary/scalar/constants.ts:71`
  - Action: Remove (alias for `Number.MAX_SAFE_INTEGER` with no added value)
  - Agents: Agent 2, Agent 5 agree

- [x] AUDIT-P1-4: Identify `E` constant as non-2D-relevant
  - File: `auxiliary/scalar/constants.ts:226`
  - Action: Remove (alias for `Math.E` with zero consumers)
  - Agents: Agent 2, Agent 5 agree

- [x] AUDIT-P1-5: Resolve GOLDEN_RATIO retain/remove contradiction
  - File: `auxiliary/scalar/constants.ts:241-253`
  - Action: Remove (zero consumers, not relevant for 2D physics, resolves prior audit contradiction)
  - Agents: Agent 1 (contradiction), Agent 2, Agent 4, Agent 5 all agree on REMOVE

## P2: Nice-to-Have (7 items)

- [x] AUDIT-P2-6: Identify missing `Vector2.moveTowards`
  - File: `core/vector2.ts`
  - Action: Add `moveTowards(current, target, maxDelta, out?)` — standard in Unity/Godot
  - Agents: Agent 2, Agent 4

- [x] AUDIT-P2-7: Identify `sumComponents` as lacking geometric purpose
  - File: `core/vector2.ts:392`
  - Action: Deprecate — no consumers, no geometric meaning
  - Agents: Agent 2, Agent 4

- [x] AUDIT-P2-8: `neumaierSum` vs `robustSum` need cross-documentation
  - File: `auxiliary/numeric/safety.ts`
  - Action: Add @see cross-references explaining when to use each
  - Agents: Agent 2

- [x] AUDIT-P2-9: `compensatedProduct` needs consumer documentation
  - File: `auxiliary/numeric/safety.ts:317`
  - Action: Add example showing high-precision dot product use case
  - Agents: Agent 4

- [x] AUDIT-P2-10: `inRange` vs `isInRange` distinction clarity
  - File: comparison.ts + guards.ts
  - Action: Enhance @see cross-references ("epsilon-tolerant" vs "exact")
  - Agents: Agent 2

- [x] AUDIT-P2-11: Missing `Matrix2.fromAngleScale` convenience factory
  - File: `core/matrix2.ts`
  - Action: Add combined rotation+scale factory
  - Agents: Agent 2

- [x] AUDIT-P2-12: Parse round-trip limitation for non-finite values
  - File: `utils/parse.ts`
  - Action: Document that parse functions only handle finite values
  - Agents: Agent 2

## P3: Cosmetic (8 items)

- [x] AUDIT-P3-13 through AUDIT-P3-20: Documentation and naming polish items
  - See audit-report.md Section 5 for details
