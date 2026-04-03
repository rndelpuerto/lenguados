# @lenguados/examples

[![npm version](https://img.shields.io/npm/v/@lenguados/examples.svg)](https://www.npmjs.com/package/@lenguados/examples)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

> Interactive demos and reference scenes for the Lenguado physics-engine family.

## Examples

### Canvas Hello

Minimal canvas demo that validates the build pipeline and rendering setup.

```typescript
import { helloCanvas } from '@lenguados/examples';

helloCanvas('my-canvas-id');
```

Open `src/canvas-hello/demo.html` in a browser to see it in action.

## Adding New Examples

1. Create a directory under `src/` (e.g., `src/my-example/`)
2. Export the entry point from the package root
3. Add a corresponding `demo.html` for browser testing
4. Register the subpath export in `package.json` under `exports`

## License

[Apache License 2.0](../../LICENSE)
