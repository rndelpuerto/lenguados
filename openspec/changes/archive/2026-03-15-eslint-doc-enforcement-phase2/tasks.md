## 1. Create enforce-required-tags rule

- [x] 1.1 Create `eslint-rules/enforce-required-tags.cjs` with symbol-type classification via AST (FunctionDeclaration, ClassDeclaration, TSInterfaceDeclaration, MethodDefinition, VariableDeclaration)
- [x] 1.2 Implement triality detection: static methods ending in `Safe` → Triality Safe, ending in `Unchecked` → Triality Unchecked; exclude factory names (`from*`, `clone`, `copy`)
- [x] 1.3 Implement @internal override: if JSDoc contains `@internal`, skip required-tag checks and enforce prohibited tags (@category, @since, @example must NOT be present)
- [x] 1.4 Implement required-tag checks: @category and @since required on all non-@internal exported symbols; @example required on Function, Triality Strict, Triality Safe, Class, Factory
- [x] 1.5 Implement prohibited-tag checks: @example prohibited on Triality Unchecked and Interface
- [x] 1.6 Register rule in eslint.config.js as `local/enforce-required-tags` at warn level
- [x] 1.7 Run lint and fix any violations (documentation-only changes)

## 2. Enhance enforce-category-vocabulary with file-scoping

- [x] 2.1 Add FILE_SCOPE_MAP to enforce-category-vocabulary.cjs mapping type-specific categories to allowed filename patterns
- [x] 2.2 Add `fileScopedCategory` message ID and report when a type-specific category appears in a non-designated file
- [x] 2.3 Run lint and fix any violations

## 3. Create enforce-see-format rule

- [x] 3.1 Create `eslint-rules/enforce-see-format.cjs` that validates @see tags contain `{@link ...}` pattern
- [x] 3.2 Register rule in eslint.config.js as `local/enforce-see-format` at warn level
- [x] 3.3 Run lint and fix any violations

## 4. Create enforce-tag-fragments rule

- [x] 4.1 Create `eslint-rules/enforce-tag-fragments.cjs` that checks: no trailing period on @param/@returns descriptions, and @param uses `name - Description` dash format
- [x] 4.2 Handle edge case: @param descriptions containing inline `@defaultValue` — trailing period check must stop before embedded tags
- [x] 4.3 Register rule in eslint.config.js as `local/enforce-tag-fragments` at warn level
- [x] 4.4 Run lint and fix any violations

## 5. Update eslint-doc-enforcement spec

- [x] 5.1 Update `openspec/specs/eslint-doc-enforcement/spec.md` Limitations section: remove items addressed by this change, keep remaining items

## 6. Final verification

- [x] 6.1 Run `npx eslint packages/math2d/src/` — confirm exit 0 with no errors/warnings
- [x] 6.2 Run `npm run test:unit` — confirm all tests pass
- [x] 6.3 Verify non-comment code lines unchanged (comment-strip diff against HEAD)
