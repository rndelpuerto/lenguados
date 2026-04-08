/**
 * Custom ESLint rule: enforce-required-tags
 *
 * Enforces per-symbol-type tag requirements from DOCUMENTATION_STANDARD.md Section 2.
 * Checks @category, @since, and @example presence/prohibition based on symbol type.
 */

/* Tag requirements per symbol type: 'req' = warn if missing, 'no' = warn if present, 'opt' = skip */
const REQUIREMENTS = {
 function: { category: 'req', since: 'req', example: 'req' },
 class: { category: 'req', since: 'req', example: 'req' },
 interface: { category: 'req', since: 'req', example: 'no' },
 'type-alias': { category: 'req', since: 'req', example: 'no' },
 constant: { category: 'req', since: 'req', example: 'opt' },
 factory: { category: 'req', since: 'req', example: 'opt' },
 'static-method': { category: 'req', since: 'req', example: 'opt' },
 safe: { category: 'req', since: 'req', example: 'opt' },
 unchecked: { category: 'req', since: 'req', example: 'no' },
 'instance-method': { category: 'req', since: 'req', example: 'opt' },
 'static-field': { category: 'req', since: 'req', example: 'opt' },
 getter: { category: 'req', since: 'req', example: 'opt' },
 internal: { category: 'no', since: 'no', example: 'no' },
};

/**
 * Extract standalone @tag names from a JSDoc comment value.
 * Only matches tags at the start of a line (after optional whitespace and *).
 * Ignores inline tags like {@link ...}.
 */
function extractTags(commentValue) {
 const tags = new Set();
 const lines = commentValue.split('\n');
 let inExample = false;
 for (const line of lines) {
  const match = line.match(/^\s*\*?\s*@(\w+)/);
  if (match) {
   if (match[1] === 'example') {
    inExample = true;
    tags.add(match[1]);
    continue;
   }
   if (inExample) {
    // A new top-level tag ends the example block
    inExample = false;
   }
   tags.add(match[1]);
  }
 }
 return tags;
}

/**
 * Get the JSDoc block comment immediately preceding a node.
 * Handles ExportNamedDeclaration wrapping (JSDoc is before the export keyword).
 */
function getJSDocComment(sourceCode, node) {
 const target = node.parent && node.parent.type === 'ExportNamedDeclaration' ? node.parent : node;
 const comments = sourceCode.getCommentsBefore(target);
 for (let i = comments.length - 1; i >= 0; i--) {
  const c = comments[i];
  if (c.type === 'Block' && c.value.charAt(0) === '*') return c;
 }
 return null;
}

function getNodeName(node) {
 if (!node) return '<anonymous>';
 // FunctionDeclaration, ClassDeclaration, TSInterfaceDeclaration, TSTypeAliasDeclaration
 if (node.id) return node.id.name || '<anonymous>';
 // MethodDefinition, PropertyDefinition
 if (node.key) return node.key.name || node.key.value || '<computed>';
 // VariableDeclaration
 if (node.declarations && node.declarations[0] && node.declarations[0].id) {
  return node.declarations[0].id.name || '<anonymous>';
 }
 return '<anonymous>';
}

function classifyStaticMethod(name) {
 if (name.endsWith('Safe')) return 'safe';
 if (name.endsWith('Unchecked')) return 'unchecked';
 if (name.startsWith('from') || name === 'clone' || name === 'copy') return 'factory';
 return 'static-method';
}

function classifyStandaloneFunction(name) {
 if (name.endsWith('Safe')) return 'safe';
 if (name.endsWith('Unchecked')) return 'unchecked';
 return 'function';
}

module.exports = {
 meta: {
  type: 'suggestion',
  docs: {
   description: 'Enforce per-symbol-type tag requirements from DOCUMENTATION_STANDARD.md Section 2',
  },
  schema: [],
  messages: {
   missingTag:
    'Missing @{{tag}} on {{symbolType}} "{{name}}". Required by DOCUMENTATION_STANDARD.md Section 2.',
   prohibitedTag:
    '@{{tag}} is prohibited on {{symbolType}} "{{name}}". See DOCUMENTATION_STANDARD.md Section 2.',
  },
 },
 create(context) {
  const sourceCode = context.sourceCode || context.getSourceCode();

  function check(node, symbolType) {
   const jsdoc = getJSDocComment(sourceCode, node);
   if (!jsdoc) return;

   const tags = extractTags(jsdoc.value);

   // @internal overrides all other classifications
   if (tags.has('internal')) {
    symbolType = 'internal';
   }

   const reqs = REQUIREMENTS[symbolType];
   if (!reqs) return;

   const name = getNodeName(node);

   for (const [tag, requirement] of Object.entries(reqs)) {
    if (requirement === 'req' && !tags.has(tag)) {
     context.report({
      node: jsdoc,
      messageId: 'missingTag',
      data: { tag, symbolType, name },
     });
    } else if (requirement === 'no' && tags.has(tag)) {
     context.report({
      node: jsdoc,
      messageId: 'prohibitedTag',
      data: { tag, symbolType, name },
     });
    }
   }
  }

  return {
   // Exported functions
   'ExportNamedDeclaration > FunctionDeclaration'(node) {
    const name = node.id ? node.id.name : '';
    check(node, classifyStandaloneFunction(name));
   },

   // Exported classes
   'ExportNamedDeclaration > ClassDeclaration'(node) {
    check(node, 'class');
   },

   // Exported interfaces
   'ExportNamedDeclaration > TSInterfaceDeclaration'(node) {
    check(node, 'interface');
   },

   // Exported type aliases
   'ExportNamedDeclaration > TSTypeAliasDeclaration'(node) {
    check(node, 'type-alias');
   },

   // Exported constants
   'ExportNamedDeclaration > VariableDeclaration'(node) {
    check(node, 'constant');
   },

   // Class methods (public only)
   MethodDefinition(node) {
    if (node.kind === 'constructor') return;
    if (node.accessibility === 'private') return;
    if (node.kind === 'set') return;
    if (node.kind === 'get') {
     check(node, 'getter');
     return;
    }

    if (node.static) {
     const name = node.key.name || '';
     check(node, classifyStaticMethod(name));
    } else {
     check(node, 'instance-method');
    }
   },

   // Static class fields (public static readonly constants)
   PropertyDefinition(node) {
    if (!node.static) return;
    if (node.accessibility === 'private') return;
    check(node, 'static-field');
   },
  };
 },
};
