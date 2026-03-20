# @lenguados/math2d/core

## File

core/transform2.ts

## Description

Deterministic 2D transform combining translation, rotation, and scale

## Remarks

Provides the [Transform2](classes/Transform2.md) class for decomposed SRT (Scale → Rotate → Translate)
2D transforms. Stores position, rotation, and scale as separate components for
efficient composition, interpolation, and inverse computation.

## Core

- [Transform2](classes/Transform2.md)

## Helpers

- [freezeTransform2](functions/freezeTransform2.md)

## Other

### isTransform2Like

Re-exports [isTransform2Like](../types/functions/isTransform2Like.md)

## Types

### Transform2Like

Re-exports [Transform2Like](../types/interfaces/Transform2Like.md)
