# @lenguados/examples

[![npm version](https://img.shields.io/npm/v/@lenguados/examples.svg)](https://www.npmjs.com/package/@lenguados/examples)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

> Interactive demos and reference scenes for the Lenguado physics-engine family.

## Examples

### Canvas Hello

Canvas demo that exercises the real `@lenguados/math2d` API: a square modeled as four `Vector2` corners, rotated with a pre-normalized `Rotation2`, and rasterized onto a 2D canvas. The math2d code it uses is bundled into the built artifact, so the demo is self-contained.

The package root is intentionally an empty barrel — each example is consumed through its subpath:

```typescript
import { drawRotatingSquare, helloCanvas } from '@lenguados/examples/canvas-hello/index';

helloCanvas('my-canvas-id');
const corners = drawRotatingSquare('my-canvas-id', Math.PI / 4);
```

To see it in a browser, build first, then serve `packages/examples/lib` with any static file server (ES modules do not load from `file://`) and open `/assets/canvas-hello/demo.html`:

```bash
npm run build
# serve packages/examples/lib with any static file server, then open
# /assets/canvas-hello/demo.html
```

## Adding New Examples

1. Create a directory under `src/` (e.g., `src/my-example/`) with an `index.ts` entry point
2. Register the directory in `module-internals.json` (the build derives entry points and subpath bundles from it)
3. Register the subpath export in `package.json` under `exports` (the package root stays an empty barrel by design — examples are consumed via subpaths)
4. Add a corresponding `demo.html` for browser testing and a `*.dom.spec.ts` test under `test/`

## Documentation

- [Full Documentation](https://rndelpuerto.github.io/lenguados/docs/) -- docs site with architecture, standards, and API reference

## License

[Apache License 2.0](https://github.com/rndelpuerto/lenguados/blob/main/LICENSE)
