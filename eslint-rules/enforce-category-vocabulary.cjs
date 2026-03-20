/**
 * Custom ESLint rule: enforce-category-vocabulary
 *
 * Validates that @category tag values belong to the controlled vocabulary
 * defined in packages/math2d/DOCUMENTATION_STANDARD.md Section 3.
 */

const VALID_CATEGORIES = new Set([
 // Base categories (all core types)
 'Constant',
 'Factory',
 'Arithmetic',
 'Computed',
 'Transform',
 'Interpolation',
 'Comparison',
 'Mutator',
 'Accessor',
 'Conversion',
 // Type-specific categories
 'Matrix Operations',
 'Set Operations',
 'Column/Row',
 'Transform Integration',
 'Direction',
 'Geometry',
 'Constraint',
 // Auxiliary file categories
 'Safety',
 'Wrapping',
 'Guards',
 'Normalization',
 // Constants file sub-categories
 'Tolerance',
 'Angular',
 'Mathematical',
 'Numeric Limits',
 'Collection',
 // Structural categories
 'Core',
 'Types',
 'Helpers',
 'Configuration',
 'Assertion',
]);

/**
 * Type-specific categories that are only valid in designated files.
 * Maps category name → array of allowed filename patterns (basename only).
 */
const FILE_SCOPE_MAP = {
 'Matrix Operations': ['matrix2.ts', 'matrix3.ts'],
 'Set Operations': ['interval.ts'],
 'Column/Row': ['matrix2.ts', 'matrix3.ts'],
 'Transform Integration': ['vector2.ts', 'transform2.ts'],
 Direction: ['vector2.ts'],
 Geometry: ['vector2.ts'],
 Constraint: ['vector2.ts'],
};

const DEPRECATED_MAP = {
 'Geometry & Measures': 'Computed or Geometry',
 'Direction & Angles': 'Direction or Computed',
 'Numeric Transform': 'Transform',
 'Vector Transforms': 'Transform',
 'Constraints': 'Constraint',
 'Predicate': 'Comparison',
 'Serialization': 'Conversion',
 'Composition': 'Matrix Operations',
 'Batch Operations': 'Matrix Operations',
 'Validation': 'Comparison',
 'Component': 'Accessor',
};

module.exports = {
 meta: {
  type: 'suggestion',
  docs: {
   description: 'Enforce controlled @category vocabulary from DOCUMENTATION_STANDARD.md',
  },
  schema: [],
  messages: {
   invalidCategory:
    'Invalid @category "{{value}}". Must be one of the controlled vocabulary values defined in DOCUMENTATION_STANDARD.md Section 3.',
   deprecatedCategory:
    'Deprecated @category "{{value}}". Replace with: {{replacement}}.',
   fileScopedCategory:
    '@category "{{value}}" is only valid in {{allowedFiles}}. See DOCUMENTATION_STANDARD.md Section 3.',
  },
 },
 create(context) {
  return {
   // eslint-plugin-jsdoc exposes JSDoc as AST nodes via sourceCode
   // We use a comment-based approach instead
   'Program:exit'() {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const comments = sourceCode.getAllComments();

    for (const comment of comments) {
     if (comment.type !== 'Block') continue;
     // Match @category lines in JSDoc blocks (skip lines inside @example blocks)
     const lines = comment.value.split('\n');
     let inExample = false;
     for (let i = 0; i < lines.length; i++) {
      const tagMatch = lines[i].match(/^\s*\*?\s*@(\w+)/);
      if (tagMatch) {
       if (tagMatch[1] === 'example') { inExample = true; continue; }
       if (inExample) inExample = false;
      } else if (inExample) { continue; }
      const match = lines[i].match(/@category\s+(.+?)(\s*\*\/|\s*$)/);
      if (!match) continue;

      const value = match[1].replace(/\s*\*?\s*$/, '').trim();
      if (!value) continue;

      if (DEPRECATED_MAP[value]) {
       context.report({
        node: comment,
        messageId: 'deprecatedCategory',
        data: { value, replacement: DEPRECATED_MAP[value] },
       });
      } else if (!VALID_CATEGORIES.has(value)) {
       context.report({
        node: comment,
        messageId: 'invalidCategory',
        data: { value },
       });
      }

      // File-scope check: type-specific categories must appear in designated files
      const allowedFiles = FILE_SCOPE_MAP[value];
      if (allowedFiles) {
       const filename = context.filename || context.getFilename();
       const basename = filename.split('/').pop();
       if (!allowedFiles.includes(basename)) {
        context.report({
         node: comment,
         messageId: 'fileScopedCategory',
         data: { value, allowedFiles: allowedFiles.join(', ') },
        });
       }
      }
     }
    }
   },
  };
 },
};
